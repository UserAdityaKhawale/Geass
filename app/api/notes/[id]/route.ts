export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Note } from "@/lib/models/Note";

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

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId },
      { $set: body },
      { new: true }
    );

    if (!updatedNote) return NextResponse.json({ error: "Note not found" }, { status: 404 });

    return NextResponse.json(updatedNote);
  } catch (err) {
    console.error("[notes PATCH] error:", err);
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

    const deletedNote = await Note.findOneAndDelete({ _id: id, userId });
    if (!deletedNote) return NextResponse.json({ error: "Note not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[notes DELETE] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
