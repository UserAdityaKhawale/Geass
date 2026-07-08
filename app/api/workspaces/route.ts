export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Workspace } from "@/lib/models/Workspace";
import { UserSettings } from "@/lib/models/UserSettings";

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
    
    // Get user's subscription tier
    let userSettings = await UserSettings.findOne({ userId });
    if (!userSettings) {
      userSettings = await UserSettings.create({ userId });
    }

    // Count current workspaces
    const workspaceCount = await Workspace.countDocuments({ userId });
    const limit = userSettings.subscriptionTier === "free" ? 20 : 100;

    if (workspaceCount >= limit) {
      return NextResponse.json(
        { error: `Workspace limit reached! You can only create ${limit} workspaces on your current plan.` },
        { status: 403 }
      );
    }

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
