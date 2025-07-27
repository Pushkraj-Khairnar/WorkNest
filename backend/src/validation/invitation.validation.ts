import { z } from "zod";

export const inviteUserToWorkspaceSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const respondToInvitationSchema = z.object({
  response: z.enum(["accept", "decline"], {
    required_error: "Response is required",
  }),
});

export const invitationIdSchema = z.string().min(1, "Invitation ID is required");
