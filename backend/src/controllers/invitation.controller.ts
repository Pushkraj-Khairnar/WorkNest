import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  inviteUserToWorkspaceSchema,
  respondToInvitationSchema,
  invitationIdSchema,
} from "../validation/invitation.validation";
import { workspaceIdSchema } from "../validation/workspace.validation";
import {
  sendInvitationService,
  getUserInvitationsService,
  respondToInvitationService,
  searchUsersByEmailService,
  getWorkspaceInvitationsService,
} from "../services/invitation.service";
import { z } from "zod";

//********************************
// SEND INVITATION TO USER
//**************** **************/
export const sendInvitationController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const { email } = inviteUserToWorkspaceSchema.parse(req.body);
    const inviterId = req.user?._id;

    const { invitation } = await sendInvitationService(
      workspaceId,
      inviterId,
      email
    );

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Invitation sent successfully",
      invitation,
    });
  }
);

//********************************
// GET USER'S PENDING INVITATIONS
//**************** **************/
export const getUserInvitationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const { invitations } = await getUserInvitationsService(userEmail);

    return res.status(HTTPSTATUS.OK).json({
      message: "Invitations retrieved successfully",
      invitations,
    });
  }
);

//********************************
// RESPOND TO INVITATION
//**************** **************/
export const respondToInvitationController = asyncHandler(
  async (req: Request, res: Response) => {
    const invitationId = invitationIdSchema.parse(req.params.invitationId);
    const { response } = respondToInvitationSchema.parse(req.body);
    const userId = req.user?._id;

    const result = await respondToInvitationService(
      invitationId,
      userId,
      response
    );

    return res.status(HTTPSTATUS.OK).json(result);
  }
);

//********************************
// SEARCH USERS BY EMAIL
//**************** **************/
export const searchUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = z.string().min(1).parse(req.query.q);

    const { users } = await searchUsersByEmailService(query);

    return res.status(HTTPSTATUS.OK).json({
      message: "Users retrieved successfully",
      users,
    });
  }
);

//********************************
// GET WORKSPACE INVITATIONS
//**************** **************/
export const getWorkspaceInvitationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;

    const { invitations } = await getWorkspaceInvitationsService(
      workspaceId,
      userId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Workspace invitations retrieved successfully",
      invitations,
    });
  }
);
