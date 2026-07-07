export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { FocusSession } from "@/lib/models/FocusSession";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    const { _id, workspaceId, duration, type, completedAt } = body;

    const session = await FocusSession.create({
      _id: _id || undefined,
      workspaceId,
      userId,
      duration,
      type,
      completedAt: completedAt ? new Date(completedAt) : undefined,
    });

    return NextResponse.json(session);
  } catch (err) {
    console.error("[focus POST] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
