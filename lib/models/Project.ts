import { Schema, model, models, Document, Types } from "mongoose";

export interface IProject extends Document {
  workspaceId: Types.ObjectId;
  userId: string;
  name: string;
  description: string;
  status: "active" | "archived" | "done";
  progress: number;
  color: string;
  icon: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    userId:      { type: String, required: true, index: true },
    name:        { type: String, required: true },
    description: { type: String, default: "" },
    status:      { type: String, enum: ["active", "archived", "done"], default: "active" },
    progress:    { type: Number, min: 0, max: 100, default: 0 },
    color:       { type: String, default: "#EF5A6F" },
    icon:        { type: String, default: "⚡" },
    dueDate:     { type: Date },
  },
  { timestamps: true }
);

export const Project = models.Project || model<IProject>("Project", ProjectSchema);
