// GET /api/sync/[workspaceId] — Full workspace state hydration
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Task } from "@/lib/models/Task";
import { FocusSession } from "@/lib/models/FocusSession";
import { Workspace } from "@/lib/models/Workspace";
import { Note } from "@/lib/models/Note";
import { TimeBlock } from "@/lib/models/TimeBlock";

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
    const [tasks, focusSessions, notes, timeblocks] = await Promise.all([
      Task.find({ workspaceId, userId }).sort({ orderIndex: 1 }).lean(),
      FocusSession.find({ workspaceId, userId }).sort({ completedAt: -1 }).limit(100).lean(),
      Note.find({ workspaceId, userId }).sort({ updatedAt: -1 }).lean(),
      TimeBlock.find({ workspaceId, userId }).sort({ start: 1 }).lean(),
    ]);

    return NextResponse.json({
      workspaces: workspaces.map(serialize),
      tasks:      tasks.map(serialize),
      focusSessions: focusSessions.map(serialize),
      notes:      notes.map(serialize),
      timeblocks: timeblocks.map(serialize),
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
  return out;
}
