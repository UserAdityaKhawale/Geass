import { Schema, model, models, Document, Types } from "mongoose";

export interface INote extends Document {
  workspaceId: Types.ObjectId;
  userId: string;
  title: string;
  snippet: string;
  content: string;
  pinned: boolean;
  tags: string[];
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    userId:      { type: String, required: true, index: true },
    title:       { type: String, default: "Untitled Note" },
    snippet:     { type: String, default: "" },
    content:     { type: String, default: "" },
    pinned:      { type: Boolean, default: false },
    tags:        [{ type: String }],
    color:       { type: String, default: "#f59e0b" },
  },
  { timestamps: true }
);

export const Note = models.Note || model<INote>("Note", NoteSchema);
