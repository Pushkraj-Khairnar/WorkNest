import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";

export default function WorkspaceStats() {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspaceMembers(workspaceId);

  const members = data?.members || [];

  const totalMembers = members.length;
  const activeMembers = members.filter(member => member.joinedAt).length; // Placeholder logic

  return (
    <div className="space-y-6">
      {/* Workspace Overview */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200/50 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Workspace Overview</h3>
              <p className="text-xs sm:text-sm text-gray-600">Team composition and statistics</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white/60 rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-indigo-600 mb-1">{totalMembers}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Members</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">{activeMembers}</div>
              <div className="text-xs sm:text-sm text-gray-600">Active Members</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
