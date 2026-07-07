export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { TimeBlock } from "@/lib/models/TimeBlock";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    const { _id, workspaceId, title, sub, start, end, color, date } = body;

    const block = await TimeBlock.create({
      _id: _id || undefined,
      workspaceId,
      userId,
      title,
      sub,
      start,
      end,
      color: color || "#7C3AED",
      date: date || new Date().toISOString().split("T")[0],
    });

    return NextResponse.json(block);
  } catch (err) {
    console.error("[timeblocks POST] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
