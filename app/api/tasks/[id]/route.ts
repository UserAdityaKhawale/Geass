export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Task } from "@/lib/models/Task";

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

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId },
      { $set: body },
      { new: true }
    );

    if (!updatedTask) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    return NextResponse.json(updatedTask);
  } catch (err) {
    console.error("[tasks PATCH] error:", err);
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

    const deletedTask = await Task.findOneAndDelete({ _id: id, userId });
    if (!deletedTask) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[tasks DELETE] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
