export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Workspace } from "@/lib/models/Workspace";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const workspaces = await Workspace.find({ userId }).sort({ createdAt: 1 }).lean();
    return NextResponse.json(workspaces);
  } catch (err) {
    console.error("[workspaces GET] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    const { _id, name, icon, color } = body;

    const workspace = await Workspace.create({
      _id: _id || undefined,
      userId,
      name,
      icon,
      color,
    });

    return NextResponse.json(workspace);
  } catch (err) {
    console.error("[workspaces POST] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
