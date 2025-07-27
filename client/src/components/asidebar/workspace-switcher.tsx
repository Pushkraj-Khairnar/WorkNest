import * as React from "react";
import { Check, ChevronDown, Loader, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
    <div className="w-full">
      {/* Header with add workspace button */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Workspaces
        </span>
        <Button
          onClick={onOpen}
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 rounded-full hover:bg-gray-100"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      {/* Workspace Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between h-auto p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left"
          >
            {activeWorkspace ? (
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 text-white font-semibold text-sm flex-shrink-0">
                  {activeWorkspace?.name?.split(" ")?.[0]?.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900 truncate text-sm">
                    {activeWorkspace?.name}
                  </div>
                  <div className="text-xs text-gray-500">Free</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-300 text-gray-600 font-semibold text-sm">
                  ?
                </div>
                <span className="font-semibold text-gray-600 text-sm">
                  No Workspace selected
                </span>
              </div>
            )}
            <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64 rounded-xl border border-gray-200 shadow-lg bg-white/95 backdrop-blur-sm"
          align="start"
          sideOffset={4}
        >
          <DropdownMenuLabel className="text-xs text-gray-500 px-3 py-2">
            Workspaces
          </DropdownMenuLabel>
          
          {isPending && (
            <div className="flex items-center justify-center py-4">
              <Loader className="w-5 h-5 animate-spin text-blue-500" />
            </div>
          )}

          {workspaces?.map((workspace) => (
            <DropdownMenuItem
              key={workspace._id}
              onClick={() => onSelect(workspace)}
              className="gap-3 p-3 cursor-pointer rounded-lg mx-2"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded border bg-gray-50 text-sm font-medium">
                {workspace?.name?.split(" ")?.[0]?.charAt(0)}
              </div>
              <span className="flex-1 truncate">{workspace.name}</span>

              {workspace._id === workspaceId && (
                <DropdownMenuShortcut>
                  <Check className="w-4 h-4 text-blue-500" />
                </DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator className="mx-2" />
          
          <DropdownMenuItem
            className="gap-3 p-3 cursor-pointer rounded-lg mx-2"
            onClick={onOpen}
          >
            <div className="flex items-center justify-center w-6 h-6 rounded border bg-gray-50">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-gray-600 font-medium">
              Add workspace
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
