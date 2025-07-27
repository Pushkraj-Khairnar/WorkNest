import mongoose, { Document, Schema } from "mongoose";

export interface InvitationDocument extends Document {
  workspaceId: mongoose.Types.ObjectId;
  inviterId: mongoose.Types.ObjectId; // Who sent the invitation
  inviteeEmail: string; // Email of the person being invited
  inviteeId?: mongoose.Types.ObjectId; // User ID if they're already registered
  status: "pending" | "accepted" | "declined";
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const invitationSchema = new Schema<InvitationDocument>(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    inviterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    inviteeEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    inviteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
invitationSchema.index({ inviteeEmail: 1, status: 1 });
invitationSchema.index({ workspaceId: 1, status: 1 });
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired invitations

// Compound index to prevent duplicate pending invitations
invitationSchema.index(
  { workspaceId: 1, inviteeEmail: 1, status: 1 },
  { unique: true }
);

const InvitationModel = mongoose.model<InvitationDocument>(
  "Invitation",
  invitationSchema
);

export default InvitationModel;
