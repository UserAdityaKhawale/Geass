export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Task } from "@/lib/models/Task";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    // Map frontend fields (e.g. status todo, in_progress, etc) to schema
    const { _id, workspaceId, projectId, title, status, priority, dueDate, estimatedTime, orderIndex, tag } = body;

    const task = await Task.create({
      _id: _id || undefined, // use client-generated ID if present for offline/optimistic sync mapping
      workspaceId,
      projectId: projectId || undefined,
      userId,
      title,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      estimatedTime,
      orderIndex: orderIndex || 0,
      tag
    });

    return NextResponse.json(task);
  } catch (err) {
    console.error("[tasks POST] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
