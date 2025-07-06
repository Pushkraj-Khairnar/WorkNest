import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { format } from "date-fns";
import { Loader, Users, Calendar, Crown, Shield, User } from "lucide-react";

const RecentMembers = () => {
  const workspaceId = useWorkspaceId();
  const { data, isPending } = useGetWorkspaceMembers(workspaceId);

  const members = data?.members || [];

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

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800";
      case "admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800";
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-slate-600 dark:text-slate-400">Loading members...</span>
        </div>
      </div>
    );
  }

  if (members?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center">
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
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          Recent Members
        </h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {members.length} member{members.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid gap-4">
        {members.map((member, index) => {
          const name = member?.userId?.name || "";
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);
          const role = member.role.name;
          
          return (
            <div
              key={index}
              className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-700 shadow-sm">
                    <AvatarImage
                      src={member.userId.profilePicture || ""}
                      alt={name}
                    />
                    <AvatarFallback className={`${avatarColor} text-sm font-medium`}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Member Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                        {name}
                      </h4>
                      
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={`flex items-center gap-1 px-3 py-1 rounded-full border ${getRoleColor(role)}`}>
                          {getRoleIcon(role)}
                          <span className="text-xs font-medium">
                            {role}
                          </span>
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Joined {member.joinedAt ? format(member.joinedAt, "MMM dd, yyyy") : "Recently"}
                        </span>
                      </div>
                    </div>

                    {/* Member Status */}
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentMembers;
