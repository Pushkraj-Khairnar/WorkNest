import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Shield, User, Activity } from "lucide-react";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";

export default function RoleDistribution() {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspaceMembers(workspaceId);

  const members = data?.members || [];
  const roles = data?.roles || [];

  // Calculate role statistics
  const roleStats = roles.map(role => {
    const count = members.filter(member => member.role._id === role._id).length;
    return { ...role, count };
  });

  const getRoleIcon = (roleName: string) => {
    switch (roleName?.toUpperCase()) {
      case "OWNER":
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case "ADMIN":
        return <Shield className="w-5 h-5 text-blue-500" />;
      case "MEMBER":
        return <User className="w-5 h-5 text-gray-500" />;
      default:
        return <User className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName?.toUpperCase()) {
      case "OWNER":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "ADMIN":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "MEMBER":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200/50 shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Role Distribution</h3>
            <p className="text-xs sm:text-sm text-gray-600">Members by role and permissions</p>
          </div>
        </div>

        <div className="space-y-3">
          {roleStats.map((role) => (
            <div key={role._id} className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
              <div className="flex items-center gap-3">
                {getRoleIcon(role.name)}
                <div>
                  <div className="text-sm sm:text-base font-medium text-gray-900 capitalize">
                    {role.name?.toLowerCase()}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {role.name === "OWNER" && "Full workspace control"}
                    {role.name === "ADMIN" && "Manage projects & members"}
                    {role.name === "MEMBER" && "View & update assigned task status"}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className={`text-xs sm:text-sm ${getRoleColor(role.name)}`}>
                {role.count}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
