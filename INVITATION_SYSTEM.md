# Invitation System Implementation

## Overview
This implementation replaces the link-based workspace joining system with a request-and-approval invitation system. Workspace owners and admins can now search for users by email and send them direct invitations within the app.

## Backend Changes

### New Models
- **Invitation Model** (`backend/src/models/invitation.model.ts`): Tracks invitation records with status (pending, accepted, declined)

### New Services
- **Invitation Service** (`backend/src/services/invitation.service.ts`):
  - Send invitations to users by email
  - Get user's pending invitations
  - Accept/decline invitations
  - Search users by email
  - Get workspace invitations for admins

### New Controllers & Routes
- **Invitation Controller** (`backend/src/controllers/invitation.controller.ts`)
- **Invitation Routes** (`backend/src/routes/invitation.route.ts`):
  - `POST /invitation/workspace/:workspaceId/send` - Send invitation
  - `GET /invitation/user/pending` - Get user's pending invitations
  - `PUT /invitation/:invitationId/respond` - Accept/decline invitation
  - `GET /invitation/users/search` - Search users by email
  - `GET /invitation/workspace/:workspaceId/all` - Get workspace invitations

### Updated Permissions
- Added `SEND_INVITATION` permission for OWNER and ADMIN roles
- Deprecated `inviteCode` field in Workspace model

## Frontend Changes

### New Components
- **InviteMember** (`client/src/components/workspace/member/invite-member-new.tsx`): Email search and invitation sending
- **Invitations Page** (`client/src/page/invitations/Invitations.tsx`): View and manage incoming invitations
- **Invitation Notification** (`client/src/components/notifications/invitation-notification.tsx`): Header notification with count

### New Routes
- `/invitations` - View pending invitations page

### Updated API Layer
- Added invitation-related API functions in `client/src/lib/api.ts`
- Added TypeScript types in `client/src/types/api.type.ts`

### Navigation Updates
- Added notification bell in header showing invitation count
- Added "Invitations" item in sidebar navigation

## Key Features

### For Workspace Owners/Admins:
1. **Search Users**: Type email to search registered users
2. **Send Invitations**: Send invitations to specific email addresses
3. **Manage Invitations**: View pending invitations for workspace

### For Invited Users:
1. **Notification Badge**: See invitation count in header
2. **Invitations Page**: View all pending invitations with workspace details
3. **Accept/Decline**: Respond to invitations directly in the app
4. **Auto-navigation**: Automatically navigate to workspace upon acceptance

## Migration Notes

### Deprecated Features:
- Link-based invitation system (invite codes)
- `/invite/workspace/:inviteCode/join` route
- `invitedUserJoinWorkspaceMutationFn` API function

### Database Changes:
- `inviteCode` field in Workspace model is now optional for backward compatibility
- New `Invitation` collection with automatic expiration (7 days)

## Security Features

1. **Permission-based**: Only users with `SEND_INVITATION` permission can send invitations
2. **Workspace validation**: Ensures sender is a member of the workspace
3. **Duplicate prevention**: Prevents sending multiple invitations to the same email
4. **Auto-expiration**: Invitations expire after 7 days
5. **Email validation**: Ensures invitations are only sent to valid email addresses

## Usage Flow

1. **Workspace Owner/Admin**:
   - Goes to workspace Members page
   - Searches for user by email or enters email directly
   - Clicks "Send Invite" button
   - System creates pending invitation

2. **Invited User**:
   - Sees notification badge in header
   - Visits /invitations page
   - Views invitation details (workspace name, inviter, description)
   - Clicks Accept or Decline
   - If accepted, gets added to workspace and navigated there

## Technical Details

### Database Indexes:
- Compound index on `workspaceId + inviteeEmail + status` for uniqueness
- Index on `inviteeEmail + status` for user queries
- TTL index on `expiresAt` for automatic cleanup

### API Permissions:
- All invitation endpoints require authentication
- Sending invitations requires workspace membership
- Responding to invitations validates email ownership

### Frontend State Management:
- React Query for server state management
- Auto-refetch of invitations every 30 seconds
- Optimistic updates for invitation responses
