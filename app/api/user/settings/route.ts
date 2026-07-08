export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { UserSettings } from "@/lib/models/UserSettings";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    let userSettings = await UserSettings.findOne({ userId });

    if (!userSettings) {
      userSettings = await UserSettings.create({ userId });
    }

    return NextResponse.json(userSettings);
  } catch (error) {
    console.error("GET /api/user/settings error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    const userSettings = await UserSettings.findOneAndUpdate(
      { userId },
      { $set: body },
      { new: true, upsert: true }
    );

    return NextResponse.json(userSettings);
  } catch (error) {
    console.error("PATCH /api/user/settings error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
