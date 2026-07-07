import { Schema, model, models, Document, Types } from "mongoose";

export interface IFocusSession extends Document {
  workspaceId: Types.ObjectId;
  userId: string;
  duration: number; // minutes
  type: "pomodoro" | "deep_work";
  completedAt: Date;
}

const FocusSessionSchema = new Schema<IFocusSession>({
  workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
  userId:      { type: String, required: true, index: true },
  duration:    { type: Number, required: true },
  type:        { type: String, enum: ["pomodoro", "deep_work"], default: "pomodoro" },
  completedAt: { type: Date, default: Date.now },
});

export const FocusSession = models.FocusSession || model<IFocusSession>("FocusSession", FocusSessionSchema);
