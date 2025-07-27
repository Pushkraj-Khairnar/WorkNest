import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { format } from "date-fns";
import { Loader, UserPlus, Crown } from "lucide-react";

const RecentMembers = () => {
  const workspaceId = useWorkspaceId();
  const { data, isPending } = useGetWorkspaceMembers(workspaceId);

  const members = data?.members || [];

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-6 h-6 animate-spin text-green-600" />
      </div>
    );
  }

  if (members?.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
            <UserPlus className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">No members yet</h3>
          <p className="text-sm text-gray-500">
            Invite team members to collaborate.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.slice(0, 5).map((member, index) => {
        const name = member?.userId?.name || "";
        const initials = getAvatarFallbackText(name);
        const avatarColor = getAvatarColor(name);
        const isOwner = member.role.name.toLowerCase() === 'owner';
        
        return (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={member.userId.profilePicture || ""}
                alt={name}
              />
              <AvatarFallback className={`${avatarColor} text-white text-xs font-medium`}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 mb-1">
                <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                {isOwner && <Crown className="w-3 h-3 text-yellow-500" />}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Badge 
                  variant="secondary"
                  className="text-xs px-1.5 py-0.5"
                >
                  {member.role.name}
                </Badge>
                <span>
                  {member.joinedAt ? format(member.joinedAt, "MMM dd") : "—"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentMembers;
