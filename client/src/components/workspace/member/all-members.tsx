import { ChevronDown, Loader, Crown, Shield, User, Calendar, Mail, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
import useWorkspaceId from "@/hooks/use-workspace-id";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeWorkspaceMemberRoleMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Permissions } from "@/constant";
import { format } from "date-fns";

const AllMembers = () => {
  const { user, hasPermission } = useAuthContext();

  const canChangeMemberRole = hasPermission(Permissions.CHANGE_MEMBER_ROLE);

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useGetWorkspaceMembers(workspaceId);
  const members = data?.members || [];
  const roles = data?.roles || [];

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

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner":
        return <Crown className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 animate-spin text-purple-600" />
          <span className="text-slate-600 dark:text-slate-400">Loading members...</span>
        </div>
      </div>
    );
  }

  if (members?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          No members yet
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
          Invite team members to start collaborating on your workspace projects.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {members.length} member{members.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {members?.map((member) => {
          const name = member.userId?.name;
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);
          const role = member.role.name;
          
          return (
            <div
              key={member.userId._id}
              className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                {/* Member Info */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-700 shadow-sm">
                      <AvatarImage
                        src={member.userId?.profilePicture || ""}
                        alt={name}
                      />
                      <AvatarFallback className={`${avatarColor} text-sm font-medium`}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {member.userId._id === user?._id && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Member Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {name}
                      </h4>
                      {member.userId._id === user?._id && (
                        <Badge className="px-2 py-1 text-xs bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                          You
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{member.userId.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Joined {member.joinedAt ? format(member.joinedAt, "MMM dd, yyyy") : "Recently"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role Management */}
                <div className="flex items-center gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`ml-auto min-w-32 capitalize disabled:opacity-95 disabled:pointer-events-none bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all duration-200 ${
                          member.userId._id === user?._id ? 'ring-2 ring-purple-200 dark:ring-purple-800' : ''
                        }`}
                        disabled={
                          isLoading ||
                          !canChangeMemberRole ||
                          member.userId._id === user?._id
                        }
                      >
                        <div className="flex items-center gap-2">
                          {getRoleIcon(role)}
                          <span className="font-medium">{role.toLowerCase()}</span>
                          {canChangeMemberRole && member.userId._id !== user?._id && (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </Button>
                    </PopoverTrigger>
                    {canChangeMemberRole && (
                      <PopoverContent className="p-0 w-80" align="end">
                        <Command>
                          <CommandInput
                            placeholder="Select new role..."
                            disabled={isLoading}
                            className="disabled:pointer-events-none"
                          />
                          <CommandList>
                            {isLoading ? (
                              <Loader className="w-8 h-8 animate-spin place-self-center flex my-4" />
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
                                          className="disabled:pointer-events-none gap-3 mb-2 flex flex-col items-start px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                                          onSelect={() => {
                                            handleSelect(
                                              role._id,
                                              member.userId._id
                                            );
                                          }}
                                        >
                                          <div className="flex items-center gap-2">
                                            {getRoleIcon(role.name)}
                                            <p className="capitalize font-medium text-slate-900 dark:text-white">
                                              {role.name?.toLowerCase()}
                                            </p>
                                          </div>
                                          <p className="text-sm text-slate-600 dark:text-slate-400 ml-6">
                                            {role.name === "ADMIN" &&
                                              `Can view, create, edit tasks, project and manage settings.`}

                                            {role.name === "MEMBER" &&
                                              `Can view, edit only task created by.`}
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
        })}
      </div>
    </div>
  );
};

export default AllMembers;
