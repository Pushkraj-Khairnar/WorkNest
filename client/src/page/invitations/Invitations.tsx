import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Check, X, Loader, Bell, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { getUserInvitationsQueryFn, respondToInvitationMutationFn } from "@/lib/api";
import { getAvatarFallbackText } from "@/lib/helper";
import { useNavigate } from "react-router-dom";

const Invitations = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  
  const { data: invitationsData, isLoading } = useQuery({
    queryKey: ["userInvitations"],
    queryFn: getUserInvitationsQueryFn,
  });

  const { mutate: respondToInvitation } = useMutation({
    mutationFn: respondToInvitationMutationFn,
    onSuccess: (data, variables) => {
      const action = variables.response === "accept" ? "accepted" : "declined";
      toast({
        title: "Success",
        description: `Invitation ${action} successfully`,
        variant: "success",
      });
      
      queryClient.invalidateQueries({ queryKey: ["userInvitations"] });
      queryClient.invalidateQueries({ queryKey: ["userWorkspaces"] });
      
      // If accepted and we got a workspaceId, navigate to the workspace
      if (variables.response === "accept" && data.workspaceId) {
        setTimeout(() => {
          navigate(`/workspace/${data.workspaceId}`);
        }, 1000);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to respond to invitation",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setRespondingTo(null);
    },
  });

  const handleRespond = (invitationId: string, response: "accept" | "decline") => {
    setRespondingTo(invitationId);
    respondToInvitation({ invitationId, response });
  };

  const invitations = invitationsData?.invitations || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        {/* Minimal Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-normal text-gray-900">
              Invitations
            </h1>
          </div>
          <p className="text-gray-500 text-sm font-light">
            Manage your workspace invitations
          </p>
        </div>

        {invitations.length === 0 ? (
          // Empty State
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl border-0 p-16 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gray-100/60 rounded-2xl">
              <Users className="h-7 w-7 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending invitations</h3>
            <p className="text-gray-500 text-sm font-light">
              You don't have any pending workspace invitations at the moment.
            </p>
          </div>
        ) : (
          // Invitation Cards
          <div className="space-y-4">
            {invitations.map((invitation: any) => {
              const inviterName = invitation.inviterId?.name || "Unknown";
              const workspaceName = invitation.workspaceId?.name || "Unknown Workspace";
              const initials = getAvatarFallbackText(inviterName);
              const isResponding = respondingTo === invitation._id;

              return (
                <div key={invitation._id} className="bg-white/70 backdrop-blur-sm rounded-3xl border-0 p-8 transition-all duration-200 hover:bg-white/80">
                  {/* Header Section */}
                  <div className="flex items-start gap-5 mb-6">
                    {/* Softer Avatar with Pastel Colors */}
                    <Avatar className="h-14 w-14 ring-0 border-0">
                      <AvatarImage 
                        src={invitation.inviterId?.profilePicture || ""} 
                        alt={inviterName} 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 font-medium text-base">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content with Left Alignment */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-left">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Workspace Invitation
                          </h3>
                          <p className="text-gray-500 text-sm font-light leading-relaxed">
                            <span className="font-medium text-gray-700">{inviterName}</span> invited you to join{" "}
                            <span className="font-medium text-gray-700">{workspaceName}</span>
                          </p>
                        </div>

                        {/* Pill-shaped Neutral Status Badge */}
                        <Badge className="bg-gray-100 hover:bg-gray-100 text-gray-600 border-0 rounded-full px-4 py-1.5 text-xs font-medium">
                          Pending
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Description with Minimal Styling */}
                  {invitation.workspaceId?.description && (
                    <div className="mb-6 p-5 bg-gray-50/60 rounded-2xl border-0">
                      <p className="text-sm text-gray-600 leading-relaxed font-light">
                        {invitation.workspaceId.description}
                      </p>
                    </div>
                  )}

                  {/* Footer Actions with Clean Spacing */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-gray-400 font-light">
                      Received {format(new Date(invitation.createdAt), "PPP")}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRespond(invitation._id, "decline")}
                        disabled={isResponding}
                        className="px-5 py-2.5 border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50/80
                                 rounded-full transition-all duration-200 font-medium border-0 bg-gray-100/60 hover:bg-red-50"
                      >
                        {isResponding ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            Decline
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRespond(invitation._id, "accept")}
                        disabled={isResponding}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full 
                                 transition-all duration-200 font-medium shadow-sm hover:shadow-md
                                 transform hover:scale-105 disabled:transform-none border-0"
                      >
                        {isResponding ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Accept
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Invitations;
