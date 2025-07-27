import { Loader, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import MemberCard from "./MemberCard";
import InviteMemberCard from "./InviteMemberCard";
import MemberActivity from "./MemberActivity";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import { useState, useMemo } from "react";

export default function MembersList() {
  const workspaceId = useWorkspaceId();
  const { data, isPending } = useGetWorkspaceMembers(workspaceId);
  const [searchTerm, setSearchTerm] = useState("");

  const members = data?.members || [];
  const roles = data?.roles || [];

  // Filter members based on search term
  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return members;
    
    return members.filter(member => 
      member.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  // Group members by role for better organization
  const membersByRole = useMemo(() => {
    const grouped = filteredMembers.reduce((acc, member) => {
      const roleName = member.role?.name || 'Unknown';
      if (!acc[roleName]) {
        acc[roleName] = [];
      }
      acc[roleName].push(member);
      return acc;
    }, {} as Record<string, typeof members>);

    // Sort roles by importance
    const roleOrder = ['OWNER', 'ADMIN', 'MEMBER'];
    return roleOrder.reduce((acc, role) => {
      if (grouped[role]) {
        acc[role] = grouped[role];
      }
      return acc;
    }, {} as Record<string, typeof members>);
  }, [filteredMembers]);

  if (isPending) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/90 via-white/80 to-purple-50/50 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Team Members</h3>
            <p className="text-sm text-gray-600">
              {members.length} member{members.length !== 1 ? 's' : ''} in this workspace
            </p>
          </div>
        </div>
        
        <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
          {members.length} {members.length === 1 ? 'Member' : 'Members'}
        </Badge>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search members by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 pr-4 py-3 h-12 bg-white/80 border-gray-200 rounded-xl placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200"
        />
      </div>

      {/* Members List */}
      <div className="space-y-6">
        {Object.entries(membersByRole).map(([roleName, roleMembers]) => (
          <div key={roleName} className="space-y-3">
            {/* Role Header */}
            <div className="flex items-center gap-3">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {roleName}
              </h4>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                {roleMembers.length}
              </Badge>
            </div>

            {/* Members in this role */}
            <div className="space-y-3">
              {roleMembers.map((member) => (
                <MemberCard
                  key={member.userId._id}
                  member={member}
                  roles={roles}
                  workspaceId={workspaceId || ''}
                />
              ))}
            </div>
          </div>
        ))}

        {/* No members found */}
        {filteredMembers.length === 0 && !isPending && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-700 mb-2">No members found</h4>
            <p className="text-gray-600">
              {searchTerm ? 
                `No members match "${searchTerm}"` : 
                "This workspace doesn't have any members yet."
              }
            </p>
          </div>
        )}
      </div>

      {/* Invite Team Members and Member Activity */}
      <div className="mt-8 space-y-6">
        <InviteMemberCard />
        <MemberActivity />
      </div>
    </div>
  );
}
