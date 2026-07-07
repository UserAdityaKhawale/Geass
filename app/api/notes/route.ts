export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Note } from "@/lib/models/Note";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    const { _id, workspaceId, title, snippet, content, pinned, tags, color } = body;

    const note = await Note.create({
      _id: _id || undefined,
      workspaceId,
      userId,
      title,
      snippet,
      content,
      pinned: pinned || false,
      tags: tags || [],
      color: color || "#f59e0b",
    });

    return NextResponse.json(note);
  } catch (err) {
    console.error("[notes POST] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
