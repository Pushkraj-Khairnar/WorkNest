import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { format } from "date-fns";
import { Loader, UserPlus, Calendar, Crown, User, Mail } from "lucide-react";

const RecentMembers = () => {
  const workspaceId = useWorkspaceId();
  const { data, isPending } = useGetWorkspaceMembers(workspaceId);

  const members = data?.members || [];

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="relative">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <div className="absolute inset-0 rounded-full bg-blue-600/10 animate-pulse" />
        </div>
      </div>
    );
  }

  if (members?.length === 0) {
    return (
      <div className="text-center py-16 px-8">
        <div className="relative mb-8">
          {/* Vector-style illustration */}
          <div className="mx-auto w-20 h-20 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl transform rotate-3" />
            <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 rounded-3xl flex items-center justify-center">
              <UserPlus className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-60 animate-pulse" />
          <div className="absolute -bottom-1 -left-3 w-4 h-4 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full opacity-40 animate-pulse delay-75" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Build your dream team</h3>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          Invite talented team members to collaborate and bring your projects to life together.
        </p>
        <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-200">
          Invite Members
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.map((member, index) => {
        const name = member?.userId?.name || "";
        const email = member?.userId?.email || "";
        const initials = getAvatarFallbackText(name);
        const avatarColor = getAvatarColor(name);
        const isOwner = member.role.name.toLowerCase() === 'owner';
        
        return (
          <div
            key={index}
            className="group relative p-6 rounded-3xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-50"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-center gap-4">
              {/* Enhanced Avatar */}
              <div className="relative">
                <Avatar className="h-14 w-14 border-3 border-white shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <AvatarImage
                    src={member.userId.profilePicture || ""}
                    alt={name}
                    className="object-cover"
                  />
                  <AvatarFallback className={`${avatarColor} text-white font-bold text-lg`}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
                {isOwner && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-sm">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Member Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                    {name}
                  </h3>
                  <Badge 
                    variant="secondary"
                    className={`text-xs font-semibold px-3 py-1 rounded-xl border-0 ${
                      isOwner 
                        ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800" 
                        : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700"
                    }`}
                  >
                    <User className="w-3 h-3 mr-1.5" />
                    {member.role.name}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  {email && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Joined {member.joinedAt ? format(member.joinedAt, "MMM dd, yyyy") : "Recently"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action indicator */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" />
              </div>
            </div>

            {/* Hover effect border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        );
      })}
    </div>
  );
};

export default RecentMembers;
