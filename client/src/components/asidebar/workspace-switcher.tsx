import * as React from "react";
import { Check, ChevronDown, Loader, Plus, Building2, Crown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useCreateWorkspaceDialog from "@/hooks/use-create-workspace-dialog";
import { useQuery } from "@tanstack/react-query";
import { getAllWorkspacesUserIsMemberQueryFn } from "@/lib/api";

type WorkspaceType = {
  _id: string;
  name: string;
};

export function WorkspaceSwitcher() {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();

  const { onOpen } = useCreateWorkspaceDialog();
  const workspaceId = useWorkspaceId();

  const [activeWorkspace, setActiveWorkspace] = React.useState<WorkspaceType>();

  const { data, isPending } = useQuery({
    queryKey: ["userWorkspaces"],
    queryFn: getAllWorkspacesUserIsMemberQueryFn,
    staleTime: 1,
    refetchOnMount: true,
  });

  const workspaces = data?.workspaces;

  React.useEffect(() => {
    if (workspaces?.length) {
      const workspace = workspaceId
        ? workspaces.find((ws) => ws._id === workspaceId)
        : workspaces[0];

      if (workspace) {
        setActiveWorkspace(workspace);
        if (!workspaceId) navigate(`/workspace/${workspace._id}`);
      }
    }
  }, [workspaceId, workspaces, navigate]);

  const onSelect = (workspace: WorkspaceType) => {
    setActiveWorkspace(workspace);
    navigate(`/workspace/${workspace._id}`);
  };

  return (
    <>
      <SidebarGroupLabel className="w-full justify-between pr-0 mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Workspaces
          </span>
        </div>
        <button
          onClick={onOpen}
          className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Plus className="size-3.5" />
        </button>
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-white/60 dark:data-[state=open]:bg-slate-800/60 data-[state=open]:text-slate-900 dark:data-[state=open]:text-white hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl transition-all duration-200 group"
              >
                {activeWorkspace ? (
                  <>
                    <div className="relative">
                      <div className="flex aspect-square size-10 items-center font-bold justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-200">
                        {activeWorkspace?.name?.split(" ")?.[0]?.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-sm">
                        <Crown className="w-2 h-2 text-white" />
                      </div>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                      <span className="truncate font-semibold text-slate-900 dark:text-white">
                        {activeWorkspace?.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Active workspace
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-slate-600 dark:text-slate-400">
                      No Workspace selected
                    </span>
                  </div>
                )}
                <ChevronDown className="ml-auto size-4 text-slate-400" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-3 py-2">
                Your Workspaces
              </DropdownMenuLabel>
              {isPending ? (
                <div className="flex items-center justify-center py-4">
                  <Loader className="w-5 h-5 animate-spin text-purple-600" />
                </div>
              ) : null}

              {workspaces?.map((workspace) => (
                <DropdownMenuItem
                  key={workspace._id}
                  onClick={() => onSelect(workspace)}
                  className="gap-3 p-3 !cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <div className="relative">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold text-sm shadow-sm">
                      {workspace?.name?.split(" ")?.[0]?.charAt(0)}
                    </div>
                    {workspace._id === workspaceId && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white dark:border-slate-800"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {workspace.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {workspace._id === workspaceId ? 'Current workspace' : 'Click to switch'}
                    </p>
                  </div>

                  {workspace._id === workspaceId && (
                    <DropdownMenuShortcut className="tracking-normal !opacity-100">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
              <DropdownMenuItem
                className="gap-3 p-3 !cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 rounded-lg transition-all duration-200"
                onClick={onOpen}
              >
                <div className="flex size-8 items-center justify-center rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-600 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
                  <Plus className="size-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-purple-700 dark:text-purple-300">
                    Create workspace
                  </p>
                  <p className="text-xs text-purple-500 dark:text-purple-400">
                    Start a new team workspace
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
