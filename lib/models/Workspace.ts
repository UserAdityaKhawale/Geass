import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IWorkspace extends Document {
  userId: string;
  name: string;
  icon: string;
  color: string;
  createdAt: Date;
}

const WorkspaceSchema = new Schema<IWorkspace>({
  userId:    { type: String, required: true, index: true },
  name:      { type: String, required: true },
  icon:      { type: String, default: "🏠" },
  color:     { type: String, default: "#EF5A6F" },
  createdAt: { type: Date, default: Date.now },
});

export const Workspace = models.Workspace || model<IWorkspace>("Workspace", WorkspaceSchema);
