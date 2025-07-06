import { Users, UserPlus, Calendar } from "lucide-react";
import InviteMember from "@/components/workspace/member/invite-member";
import AllMembers from "@/components/workspace/member/all-members";
import WorkspaceHeader from "@/components/workspace/common/workspace-header";

export default function Members() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-indigo-600/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 dark:from-white dark:via-purple-100 dark:to-pink-100 bg-clip-text text-transparent">
                Team Members
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                Manage your workspace team, invite new members, and control access permissions. 
                Build a collaborative environment for your projects.
              </p>
            </div>
          </div>

          {/* Workspace Info */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 mb-8">
            <WorkspaceHeader />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Members</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">Loading...</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Invite Link</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">Active</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Recent Joins</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-6 pb-8 space-y-8">
        {/* Invite Member Section */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
          <div className="p-6">
            <InviteMember />
          </div>
        </div>

        {/* All Members Section */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                All Members
              </h2>
            </div>
            <AllMembers />
          </div>
        </div>
      </div>
    </div>
  );
}
