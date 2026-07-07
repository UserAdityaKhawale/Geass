import { Schema, model, models, Document } from "mongoose";

export interface IUserSettings extends Document {
  userId: string;
  theme: "dark" | "light";
  aiProvider: "gemini" | "openai" | "anthropic";
  encryptedAiApiKey?: string; // AES-256 encrypted, stored if user opts for cross-device sync
  updatedAt: Date;
}

const UserSettingsSchema = new Schema<IUserSettings>(
  {
    userId:            { type: String, required: true, unique: true, index: true },
    theme:             { type: String, enum: ["dark", "light"], default: "dark" },
    aiProvider:        { type: String, enum: ["gemini", "openai", "anthropic"], default: "gemini" },
    encryptedAiApiKey: { type: String },
  },
  { timestamps: true }
);

export const UserSettings = models.UserSettings || model<IUserSettings>("UserSettings", UserSettingsSchema);
