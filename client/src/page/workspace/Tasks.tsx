import { Filter, Search, Target, Calendar, Users } from "lucide-react";
import CreateTaskDialog from "@/components/workspace/task/create-task-dialog";
import TaskTable from "@/components/workspace/task/task-table";

export default function Tasks() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                Task Management
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                Organize, track, and manage all your team's tasks in one place. 
                Filter, search, and stay on top of your project deliverables.
              </p>
            </div>
            <CreateTaskDialog />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Tasks</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">Loading...</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Due This Week</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">Loading...</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Assignees</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Table Section */}
      <div className="px-6 pb-8">
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Task List
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Search className="w-4 h-4" />
                <span>Use filters to find specific tasks</span>
              </div>
            </div>
            
            <TaskTable />
          </div>
        </div>
      </div>
    </div>
  );
}
