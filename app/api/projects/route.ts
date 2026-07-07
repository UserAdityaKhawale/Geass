export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/lib/models/Project";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    const { _id, workspaceId, name, description, status, progress, color, icon, dueDate } = body;

    const project = await Project.create({
      _id: _id || undefined,
      workspaceId,
      userId,
      name,
      description,
      status,
      progress: progress || 0,
      color,
      icon,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    return NextResponse.json(project);
  } catch (err) {
    console.error("[projects POST] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
