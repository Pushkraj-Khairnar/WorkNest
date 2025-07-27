import { Plus, Calendar, Clock, TrendingUp, Activity, Users, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";
import WorkspaceAnalytics from "@/components/workspace/workspace-analytics";
import RecentProjects from "@/components/workspace/project/recent-projects-clean";
import RecentTasks from "@/components/workspace/task/recent-tasks-clean";
import RecentMembers from "@/components/workspace/member/recent-members-clean";
import InviteMember from "@/components/workspace/member/invite-member-new";

const WorkspaceDashboard = () => {
  const { onOpen } = useCreateProjectDialog();
  
  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 -m-3">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{getCurrentDate()}</span>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <Clock className="w-4 h-4" />
              <span>{getCurrentTime()}</span>
            </div>
          </div>
          <Button 
            onClick={onOpen}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Dashboard Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your workspace performance and activity
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Performance Cards - Full Width on Large Screens */}
          <div className="xl:col-span-3">
            <WorkspaceAnalytics />
            
            {/* Recent Activity Tabs */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Projects</h3>
                    <RecentProjects />
                  </div>
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Tasks</h3>
                    <RecentTasks />
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members Section */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
                </div>
              </div>
              <div className="p-6">
                <RecentMembers />
              </div>
            </div>

            {/* Invite Team Members Section */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Invite Team Members</h2>
                </div>
              </div>
              <div className="p-6">
                <InviteMember />
              </div>
            </div>
          </div>

          {/* Activity Feed Panel - Now Empty or Can be Used for Other Content */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Activity Feed</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <div className="text-gray-400 text-sm">
                    Recent workspace activity will appear here
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WorkspaceDashboard;
