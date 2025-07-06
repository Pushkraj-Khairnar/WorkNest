import { Plus, TrendingUp, Users, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";
import WorkspaceAnalytics from "@/components/workspace/workspace-analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentProjects from "@/components/workspace/project/recent-projects";
import RecentTasks from "@/components/workspace/task/recent-tasks";
import RecentMembers from "@/components/workspace/member/recent-members";

const WorkspaceDashboard = () => {
  const { onOpen } = useCreateProjectDialog();

  return (
    <main className="flex flex-1 flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                Workspace Overview
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                Welcome back! Here's what's happening in your workspace today. 
                Track progress, manage projects, and stay connected with your team.
              </p>
            </div>
            <Button 
              onClick={onOpen}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="px-6 mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
            Key Metrics
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Track your workspace performance at a glance
          </p>
        </div>
        <WorkspaceAnalytics />
      </div>

      {/* Content Tabs Section */}
      <div className="px-6 pb-8 flex-1">
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
          <Tabs defaultValue="projects" className="w-full">
            <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
              <TabsList className="w-full justify-start border-0 bg-transparent px-6 py-4 h-auto">
                <TabsTrigger 
                  value="projects" 
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-400 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <Target className="w-4 h-4" />
                  Recent Projects
                </TabsTrigger>
                <TabsTrigger 
                  value="tasks" 
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-400 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <TrendingUp className="w-4 h-4" />
                  Recent Tasks
                </TabsTrigger>
                <TabsTrigger 
                  value="members" 
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-400 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <Users className="w-4 h-4" />
                  Recent Members
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="projects" className="mt-0">
                <RecentProjects />
              </TabsContent>
              <TabsContent value="tasks" className="mt-0">
                <RecentTasks />
              </TabsContent>
              <TabsContent value="members" className="mt-0">
                <RecentMembers />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default WorkspaceDashboard;
