import { Router } from "express";
import {
  sendInvitationController,
  getUserInvitationsController,
  respondToInvitationController,
  searchUsersController,
  getWorkspaceInvitationsController,
} from "../controllers/invitation.controller";

const invitationRoutes = Router();

// Send invitation to workspace
invitationRoutes.post("/workspace/:workspaceId/send", sendInvitationController);

// Get user's pending invitations
invitationRoutes.get("/user/pending", getUserInvitationsController);

// Respond to invitation (accept/decline)
invitationRoutes.put("/:invitationId/respond", respondToInvitationController);

// Search users by email
invitationRoutes.get("/users/search", searchUsersController);

// Get workspace invitations (for workspace owners/admins)
invitationRoutes.get("/workspace/:workspaceId/all", getWorkspaceInvitationsController);

export default invitationRoutes;
