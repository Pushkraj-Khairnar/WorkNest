import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { useAuthContext } from "@/context/auth-provider";
import { changeWorkspaceMemberRoleMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Permissions } from "@/constant";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Crown, Shield, User, Loader } from "lucide-react";

interface MemberCardProps {
  member: {
    userId: {
      _id: string;
      name: string;
      email: string;
      profilePicture?: string | null;
    };
    role: {
      _id: string;
      name: string;
    };
  };
  roles: Array<{
    _id: string;
    name: string;
  }>;
  workspaceId: string;
}

const getRoleIcon = (roleName: string) => {
  switch (roleName?.toUpperCase()) {
    case "OWNER":
      return <Crown className="w-4 h-4 text-yellow-500" />;
    case "ADMIN":
      return <Shield className="w-4 h-4 text-blue-500" />;
    case "MEMBER":
      return <User className="w-4 h-4 text-gray-500" />;
    default:
      return <User className="w-4 h-4 text-gray-500" />;
  }
};

const getRoleColor = (roleName: string) => {
  switch (roleName?.toUpperCase()) {
    case "OWNER":
      return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-600 border-yellow-200";
    case "ADMIN":
      return "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 border-blue-200";
    case "MEMBER":
      return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-600 border-gray-200";
    default:
      return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-600 border-gray-200";
  }
};

export default function MemberCard({ member, roles, workspaceId }: MemberCardProps) {
  const { user, hasPermission } = useAuthContext();
  const queryClient = useQueryClient();

  const canChangeMemberRole = hasPermission(Permissions.CHANGE_MEMBER_ROLE);

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: changeWorkspaceMemberRoleMutationFn,
  });

  const handleSelect = (roleId: string, memberId: string) => {
    if (!roleId || !memberId) return;
    const payload = {
      workspaceId,
      data: {
        roleId,
        memberId,
      },
    };
    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["members", workspaceId],
        });
        toast({
          title: "Success",
          description: "Member's role changed successfully",
          variant: "success",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const name = member.userId?.name;
  const initials = getAvatarFallbackText(name);
  const avatarColor = getAvatarColor(name);

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:bg-white/90 hover:border-gray-300/50">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          {/* Enhanced Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white shadow-sm">
              <AvatarImage
                src={member.userId?.profilePicture || ""}
                alt={name}
              />
              <AvatarFallback className={`${avatarColor} text-white font-semibold`}>
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {/* Online indicator (placeholder for future implementation) */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
          </div>

          {/* Member Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{name}</h3>
              {member.userId._id === user?._id && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 border-blue-200 flex-shrink-0">
                  You
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 truncate">{member.userId.email}</p>
          </div>
        </div>

        {/* Role Badge and Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Badge 
            variant="outline" 
            className={`px-2 sm:px-3 py-1 sm:py-1.5 font-medium border text-xs sm:text-sm ${getRoleColor(member.role.name)} backdrop-blur-sm`}
          >
            <span className="flex items-center gap-1 sm:gap-1.5">
              {getRoleIcon(member.role.name)}
              <span className="capitalize">{member.role.name?.toLowerCase()}</span>
            </span>
          </Badge>

          {/* Role Change Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                disabled={
                  isLoading ||
                  !canChangeMemberRole ||
                  member.userId._id === user?._id
                }
              >
                {canChangeMemberRole && member.userId._id !== user?._id && (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </PopoverTrigger>
            {canChangeMemberRole && (
              <PopoverContent className="p-0 w-80" align="end" aria-label="Select member role">
                <Command>
                  <CommandInput
                    placeholder="Select new role..."
                    disabled={isLoading}
                    className="disabled:pointer-events-none"
                  />
                  <CommandList>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader className="w-6 h-6 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>No roles found.</CommandEmpty>
                        <CommandGroup>
                          {roles?.map(
                            (role) =>
                              role.name !== "OWNER" && (
                                <CommandItem
                                  key={role._id}
                                  disabled={isLoading}
                                  className="disabled:pointer-events-none flex flex-col items-start px-4 py-3 cursor-pointer hover:bg-gray-50"
                                  onSelect={() => {
                                    handleSelect(
                                      role._id,
                                      member.userId._id
                                    );
                                  }}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    {getRoleIcon(role.name)}
                                    <span className="font-medium capitalize">
                                      {role.name?.toLowerCase()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 leading-relaxed">
                                    {role.name === "ADMIN" &&
                                      "Can view, create, edit tasks, projects and manage settings"}
                                    {role.name === "MEMBER" &&
                                      "Can view and create tasks, only change status of assigned tasks"}
                                  </p>
                                </CommandItem>
                              )
                          )}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            )}
          </Popover>
        </div>
      </div>
    </div>
  );
}
