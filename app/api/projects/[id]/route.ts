export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/lib/models/Project";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const { id } = await params;

    const updatedProject = await Project.findOneAndUpdate(
      { _id: id, userId },
      { $set: body },
      { new: true }
    );

    if (!updatedProject) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json(updatedProject);
  } catch (err) {
    console.error("[projects PATCH] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;

    const deletedProject = await Project.findOneAndDelete({ _id: id, userId });
    if (!deletedProject) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[projects DELETE] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
