import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader, Search, UserPlus } from "lucide-react";
import PermissionsGuard from "@/components/resuable/permission-guard";
import { Permissions } from "@/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sendInvitationMutationFn, searchUsersByEmailQueryFn } from "@/lib/api";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";

const InviteMember = () => {
  const [input, setInput] = useState("");
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();

  // Search users
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["searchUsers", input],
    queryFn: () => searchUsersByEmailQueryFn(input),
    enabled: input.length >= 3,
  });

  // Send invitation mutation
  const { mutate: sendInvitation, isPending: isSending } = useMutation({
    mutationFn: sendInvitationMutationFn,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Invitation sent successfully",
        variant: "success",
      });
      setInput("");
      queryClient.invalidateQueries({
        queryKey: ["workspaceInvitations", workspaceId],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      });
    },
  });

  const handleSendInvitation = () => {
    if (!workspaceId) {
      toast({
        title: "Error",
        description: "Workspace not found",
        variant: "destructive",
      });
      return;
    }
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    sendInvitation({
      workspaceId,
      email: input.trim(),
    });
  };

  const handleSearchSelect = (selectedEmail: string) => {
    setInput(selectedEmail);
  };

  // Simple email validation
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="flex flex-col pt-0.5 px-0">
      <h5 className="text-lg leading-[30px] font-semibold mb-1">
        Invite members to join you
      </h5>
      <p className="text-sm text-muted-foreground leading-tight mb-4">
        Search for users by email address and send them workspace invitations.
        They'll receive a notification and can accept or decline the invitation.
      </p>

      <PermissionsGuard showMessage requiredPermission={Permissions.SEND_INVITATION}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email" className="text-sm font-medium">
              Search users or enter email
            </Label>
            <div className="relative flex gap-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="invite-email"
                type="email"
                placeholder="Type or paste email address..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (isValidEmail(input)) handleSendInvitation();
                  }
                }}
              />
              <Button
                onClick={handleSendInvitation}
                disabled={isSending || !isValidEmail(input)}
                className="shrink-0"
              >
                {isSending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                Send Invite
              </Button>
              {isSearching && (
                <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
              )}
            </div>

            {/* Search Results */}
            {input.length >= 3 && searchResults?.users && searchResults.users.length > 0 && (
              <div className="border rounded-lg p-2 bg-background max-h-40 overflow-y-auto mt-2">
                {searchResults.users.map((user) => {
                  const initials = getAvatarFallbackText(user.name);
                  const avatarColor = getAvatarColor(user.name);
                  return (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 p-2 hover:bg-muted rounded cursor-pointer"
                      onClick={() => handleSearchSelect(user.email)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profilePicture || ""} alt={user.name} />
                        <AvatarFallback className={avatarColor}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {input.length >= 3 && searchResults?.users?.length === 0 && !isSearching && (
              <p className="text-sm text-muted-foreground mt-2">No users found. You can invite this email directly.</p>
            )}
          </div>
        </div>
      </PermissionsGuard>
    </div>
  );
};

export default InviteMember;
