import { Schema, model, models, Document, Types } from "mongoose";

export interface ITask extends Document {
  workspaceId: Types.ObjectId;
  userId: string;
  title: string;
  status: "todo" | "in_progress" | "done" | "backlog";
  priority: "high" | "medium" | "low";
  dueDate?: Date;
  estimatedTime?: number; // minutes
  orderIndex: number;
  tag?: string;
  progress?: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    workspaceId:   { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    userId:        { type: String, required: true, index: true },
    title:         { type: String, required: true },
    status:        { type: String, enum: ["todo", "in_progress", "done", "backlog"], default: "todo" },
    priority:      { type: String, enum: ["high", "medium", "low"], default: "medium" },
    dueDate:       { type: Date },
    estimatedTime: { type: Number },
    orderIndex:    { type: Number, default: 0 },
    tag:           { type: String },
    progress:      { type: Number, min: 0, max: 100 },
  },
  { timestamps: true }
);

// Compound index for efficient workspace+project queries
TaskSchema.index({ workspaceId: 1, status: 1, orderIndex: 1 });

export const Task = models.Task || model<ITask>("Task", TaskSchema);
