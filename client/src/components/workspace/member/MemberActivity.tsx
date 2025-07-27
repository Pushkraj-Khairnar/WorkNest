import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";

export default function MemberActivity() {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspaceMembers(workspaceId);

  const members = data?.members || [];

  // Calculate member activity stats
  const membersJoinedThisWeek = members.filter(m => {
    const joinedDate = new Date(m.joinedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return joinedDate > weekAgo;
  }).length;

  const activeMembers = members.filter(member => member.joinedAt).length; // Placeholder logic

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50 shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Member Activity</h3>
            <p className="text-xs sm:text-sm text-gray-600">Recent workspace activity</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
            <div className="text-xs sm:text-sm text-gray-700">Members joined this week</div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs sm:text-sm">
              {membersJoinedThisWeek}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
            <div className="text-xs sm:text-sm text-gray-700">Active this month</div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs sm:text-sm">
              {activeMembers}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
