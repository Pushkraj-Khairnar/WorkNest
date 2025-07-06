import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthContext } from "@/context/auth-provider";
import { Loader, Building2, Crown } from "lucide-react";

const WorkspaceHeader = () => {
  const { workspaceLoading, workspace } = useAuthContext();
  
  return (
    <div className="w-full">
      {workspaceLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <Loader className="w-6 h-6 animate-spin text-purple-600" />
            <span className="text-slate-600 dark:text-slate-400">Loading workspace...</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          {/* Workspace Avatar */}
          <div className="relative">
            <Avatar className="size-16 rounded-2xl border-4 border-white dark:border-slate-700 shadow-lg">
              <AvatarFallback className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
                {workspace?.name?.split(" ")?.[0]?.charAt(0) || "W"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Building2 className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Workspace Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {workspace?.name}
              </h2>
              <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full">
                <Crown className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  Free Plan
                </span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Collaborative workspace for team projects and task management
            </p>
          </div>

          {/* Workspace Stats */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                -
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Members</p>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                -
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Projects</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceHeader;
