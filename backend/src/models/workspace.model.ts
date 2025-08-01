import mongoose, { Document, Schema } from "mongoose";
// import { generateInviteCode } from "../utils/uuid"; // Deprecated - using invitation system instead

export interface WorkspaceDocument extends Document {
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  inviteCode?: string; // Deprecated - keeping for backward compatibility
  createdAt: string;
  updatedAt: string;
}

const workspaceSchema = new Schema<WorkspaceDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model (the workspace creator)
      required: true,
    },
    inviteCode: {
      type: String,
      required: false, // No longer required - using invitation system
      unique: true,
      sparse: true, // Allow multiple null values
      // default: generateInviteCode, // Disabled
    },
  },
  {
    timestamps: true,
  }
);

// Deprecated method - keeping for backward compatibility
// workspaceSchema.methods.resetInviteCode = function () {
//   this.inviteCode = generateInviteCode();
// };

const WorkspaceModel = mongoose.model<WorkspaceDocument>(
  "Workspace",
  workspaceSchema
);

export default WorkspaceModel;
