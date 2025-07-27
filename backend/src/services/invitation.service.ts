import { ErrorCodeEnum } from "../enums/error-code.enum";
import { Roles } from "../enums/role.enum";
import InvitationModel from "../models/invitation.model";
import MemberModel from "../models/member.model";
import RoleModel from "../models/roles-permission.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError";

//********************************
// SEND INVITATION TO USER
//**************** **************/
export const sendInvitationService = async (
  workspaceId: string,
  inviterId: string,
  inviteeEmail: string
) => {
  // Check if workspace exists
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  // Check if inviter is a member of the workspace
  const inviterMember = await MemberModel.findOne({
    userId: inviterId,
    workspaceId,
  });
  if (!inviterMember) {
    throw new UnauthorizedException(
      "You are not a member of this workspace",
      ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }

  // Check if invitee is already a member
  const inviteeUser = await UserModel.findOne({ email: inviteeEmail });
  if (inviteeUser) {
    const existingMember = await MemberModel.findOne({
      userId: inviteeUser._id,
      workspaceId,
    });
    if (existingMember) {
      throw new BadRequestException("User is already a member of this workspace");
    }
  }

  // Check if there's already a pending invitation
  const existingInvitation = await InvitationModel.findOne({
    workspaceId,
    inviteeEmail,
    status: "pending",
  });
  if (existingInvitation) {
    throw new BadRequestException("An invitation has already been sent to this user");
  }

  // Create new invitation
  const invitation = new InvitationModel({
    workspaceId,
    inviterId,
    inviteeEmail,
    inviteeId: inviteeUser?._id || undefined,
  });

  await invitation.save();

  return {
    invitation: await InvitationModel.findById(invitation._id)
      .populate("workspaceId", "name description")
      .populate("inviterId", "name email"),
  };
};

//********************************
// GET USER'S PENDING INVITATIONS
//**************** **************/
export const getUserInvitationsService = async (userEmail: string) => {
  const invitations = await InvitationModel.find({
    inviteeEmail: userEmail,
    status: "pending",
    expiresAt: { $gt: new Date() },
  })
    .populate("workspaceId", "name description")
    .populate("inviterId", "name email")
    .sort({ createdAt: -1 });

  return { invitations };
};

//********************************
// RESPOND TO INVITATION
//**************** **************/
export const respondToInvitationService = async (
  invitationId: string,
  userId: string,
  response: "accept" | "decline"
) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  const invitation = await InvitationModel.findById(invitationId);
  if (!invitation) {
    throw new NotFoundException("Invitation not found");
  }

  // Check if invitation is for this user
  if (invitation.inviteeEmail !== user.email) {
    throw new UnauthorizedException("This invitation is not for you");
  }

  // Check if invitation is still pending
  if (invitation.status !== "pending") {
    throw new BadRequestException("This invitation has already been responded to");
  }

  // Check if invitation has expired
  if (invitation.expiresAt < new Date()) {
    throw new BadRequestException("This invitation has expired");
  }

  // Update invitation status
  invitation.status = response === "accept" ? "accepted" : "declined";
  await invitation.save();

  let workspaceId = null;

  // If accepted, add user to workspace
  if (response === "accept") {
    const workspace = await WorkspaceModel.findById(invitation.workspaceId);
    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    // Check if user is already a member (double-check)
    const existingMember = await MemberModel.findOne({
      userId,
      workspaceId: invitation.workspaceId,
    });

    if (!existingMember) {
      const memberRole = await RoleModel.findOne({ name: Roles.MEMBER });
      if (!memberRole) {
        throw new NotFoundException("Member role not found");
      }

      const newMember = new MemberModel({
        userId,
        workspaceId: invitation.workspaceId,
        role: memberRole._id,
        joinedAt: new Date(),
      });
      await newMember.save();

      workspaceId = invitation.workspaceId;
    }
  }

  return {
    message: `Invitation ${response}ed successfully`,
    workspaceId,
  };
};

//********************************
// SEARCH USERS BY EMAIL
//**************** **************/
export const searchUsersByEmailService = async (query: string) => {
  if (query.length < 3) {
    throw new BadRequestException("Search query must be at least 3 characters long");
  }

  const users = await UserModel.find({
    email: { $regex: query, $options: "i" },
    isActive: true,
  })
    .select("name email profilePicture")
    .limit(10);

  return { users };
};

//********************************
// GET WORKSPACE INVITATIONS (FOR WORKSPACE OWNERS/ADMINS)
//**************** **************/
export const getWorkspaceInvitationsService = async (
  workspaceId: string,
  userId: string
) => {
  // Check if user is a member of the workspace
  const member = await MemberModel.findOne({
    userId,
    workspaceId,
  }).populate("role");

  if (!member) {
    throw new UnauthorizedException(
      "You are not a member of this workspace",
      ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }

  const invitations = await InvitationModel.find({
    workspaceId,
    status: "pending",
    expiresAt: { $gt: new Date() },
  })
    .populate("inviterId", "name email")
    .sort({ createdAt: -1 });

  return { invitations };
};
