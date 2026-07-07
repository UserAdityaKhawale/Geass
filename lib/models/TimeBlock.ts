import { Schema, model, models, Document, Types } from "mongoose";

export interface ITimeBlock extends Document {
  workspaceId: Types.ObjectId;
  userId: string;
  title: string;
  sub: string;
  start: string; // e.g. "08:00"
  end: string;   // e.g. "10:30"
  color: string;
  date: string;  // e.g. "YYYY-MM-DD"
  createdAt: Date;
}

const TimeBlockSchema = new Schema<ITimeBlock>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    userId:      { type: String, required: true, index: true },
    title:       { type: String, required: true },
    sub:         { type: String, default: "" },
    start:       { type: String, required: true },
    end:         { type: String, required: true },
    color:       { type: String, default: "#7C3AED" },
    date:        { type: String, required: true }, // Format "YYYY-MM-DD" for filtering by day
  },
  { timestamps: true }
);

export const TimeBlock = models.TimeBlock || model<ITimeBlock>("TimeBlock", TimeBlockSchema);
