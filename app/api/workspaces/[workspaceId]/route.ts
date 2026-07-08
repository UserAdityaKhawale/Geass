export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Workspace } from "@/lib/models/Workspace";
import { Task } from "@/lib/models/Task";
import { Note } from "@/lib/models/Note";
import { FocusSession } from "@/lib/models/FocusSession";
import { TimeBlock } from "@/lib/models/TimeBlock";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { workspaceId } = await params;

    // Verify workspace belongs to user
    const workspace = await Workspace.findOne({ _id: workspaceId, userId });
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Delete all associated data
    await Promise.all([
      Task.deleteMany({ workspaceId, userId }),
      Note.deleteMany({ workspaceId, userId }),
      FocusSession.deleteMany({ workspaceId, userId }),
      TimeBlock.deleteMany({ workspaceId, userId }),
    ]);

    // Delete the workspace itself
    await Workspace.deleteOne({ _id: workspaceId, userId });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[workspaces DELETE] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
