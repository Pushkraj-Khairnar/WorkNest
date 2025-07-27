import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader, Search, UserPlus, Mail, Users } from "lucide-react";
import PermissionsGuard from "@/components/resuable/permission-guard";
import { Permissions } from "@/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sendInvitationMutationFn, searchUsersByEmailQueryFn } from "@/lib/api";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";

export default function InviteMemberCard() {
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
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    if (!workspaceId) {
      toast({
        title: "Error",
        description: "Workspace ID not found",
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
    <div className="bg-gradient-to-br from-white/90 via-white/80 to-blue-50/50 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <UserPlus className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Invite Team Members</h3>
          <p className="text-sm text-gray-600">
            Grow your team by inviting new members to collaborate
          </p>
        </div>
      </div>

      <PermissionsGuard showMessage requiredPermission={Permissions.SEND_INVITATION}>
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="email"
                placeholder="Search users or enter email address..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="pl-12 pr-4 py-3 h-12 bg-white/80 border-gray-200 rounded-xl placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (isValidEmail(input)) handleSendInvitation();
                  }
                }}
              />
              {isSearching && (
                <Loader className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
              )}
            </div>
            
            {/* Action Button */}
            <Button
              onClick={handleSendInvitation}
              disabled={isSending || !isValidEmail(input)}
              className="mt-4 w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Sending Invitation...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>

          {/* Search Results */}
          {input.length >= 3 && searchResults?.users && searchResults.users.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl p-2 shadow-sm max-h-48 overflow-y-auto">
              <div className="flex items-center gap-2 px-3 py-2 mb-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                <Users className="w-4 h-4" />
                Found {searchResults.users.length} user{searchResults.users.length !== 1 ? 's' : ''}
              </div>
              {searchResults.users.map((user) => {
                const initials = getAvatarFallbackText(user.name);
                const avatarColor = getAvatarColor(user.name);
                return (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
                    onClick={() => handleSearchSelect(user.email)}
                  >
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarImage src={user.profilePicture || ""} alt={user.name} />
                      <AvatarFallback className={`${avatarColor} text-white font-semibold`}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <UserPlus className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No Results Message */}
          {input.length >= 3 && searchResults?.users?.length === 0 && !isSearching && (
            <div className="bg-amber-50/80 border border-amber-200/50 rounded-xl p-4 text-center">
              <Search className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-amber-800 mb-1">No users found</p>
              <p className="text-sm text-amber-700">
                You can still invite "{input}" directly by sending an invitation
              </p>
            </div>
          )}
        </div>
      </PermissionsGuard>
    </div>
  );
}
