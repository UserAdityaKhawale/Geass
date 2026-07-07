// GET /api/sync/[workspaceId] — Full workspace state hydration
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Task } from "@/lib/models/Task";
import { Project } from "@/lib/models/Project";
import { FocusSession } from "@/lib/models/FocusSession";
import { Workspace } from "@/lib/models/Workspace";

// Default workspaces seeded for new users
const DEFAULT_WORKSPACES = [
  { name: "Home",      icon: "🏠", color: "#EF5A6F" },
  { name: "College",   icon: "🎓", color: "#7C3AED" },
  { name: "Freelance", icon: "💼", color: "#3b82f6" },
  { name: "Startup",   icon: "🚀", color: "#f59e0b" },
  { name: "Fitness",   icon: "💪", color: "#22c55e" },
  { name: "Learning",  icon: "📚", color: "#06b6d4" },
  { name: "Personal",  icon: "👤", color: "#ec4899" },
];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { workspaceId } = await params;

    // Fetch all workspaces for this user (always returned for sidebar)
    let workspaces = await Workspace.find({ userId }).lean();

    // Seed defaults if first-time user
    if (workspaces.length === 0) {
      const seeded = await Workspace.insertMany(
        DEFAULT_WORKSPACES.map((w) => ({ ...w, userId }))
      );
      workspaces = seeded.map((w) => w.toObject());
    }

    // Fetch workspace-scoped data
    const [projects, tasks, focusSessions] = await Promise.all([
      Project.find({ workspaceId, userId }).sort({ createdAt: -1 }).lean(),
      Task.find({ workspaceId, userId }).sort({ orderIndex: 1 }).lean(),
      FocusSession.find({ workspaceId, userId }).sort({ completedAt: -1 }).limit(100).lean(),
    ]);

    return NextResponse.json({
      workspaces: workspaces.map(serialize),
      projects:   projects.map(serialize),
      tasks:      tasks.map(serialize),
      focusSessions: focusSessions.map(serialize),
    });
  } catch (err) {
    console.error("[sync] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// Convert ObjectId → string
function serialize(doc: Record<string, unknown>): Record<string, unknown> {
  const out = { ...doc };
  if (out._id) out._id = String(out._id);
  if (out.workspaceId) out.workspaceId = String(out.workspaceId);
  if (out.projectId) out.projectId = String(out.projectId);
  return out;
}
