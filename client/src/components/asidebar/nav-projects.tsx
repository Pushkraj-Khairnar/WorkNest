import {
  Folder,
  Loader,
  MoreHorizontal,
  Plus,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";
import { ConfirmDialog } from "../resuable/confirm-dialog";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { Button } from "../ui/button";
import { Permissions } from "@/constant";
import PermissionsGuard from "../resuable/permission-guard";
import { useState } from "react";
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import { PaginationType } from "@/types/api.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProjectMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export function NavProjects() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { isMobile } = useSidebar();
  const { onOpen } = useCreateProjectDialog();
  const { context, open, onOpenDialog, onCloseDialog } = useConfirmDialog();

  const [pageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: deleteProjectMutationFn,
  });

  const { data, isPending, isFetching, isError } =
    useGetProjectsInWorkspaceQuery({
      workspaceId,
      pageSize,
      pageNumber,
    });

  const projects = data?.projects || [];
  const pagination = data?.pagination || ({} as PaginationType);
  const hasMore = pagination?.totalPages > pageNumber;

  const fetchNextPage = () => {
    if (!hasMore || isFetching) return;
    setPageSize((prev) => prev + 5);
  };

  const handleConfirm = () => {
    if (!context) return;
    mutate(
      {
        workspaceId,
        projectId: context?._id,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ["allprojects", workspaceId],
          });
          toast({
            title: "Success",
            description: data.message,
            variant: "success",
          });

          navigate(`/workspace/${workspaceId}`);
          setTimeout(() => onCloseDialog(), 100);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="w-full justify-between pr-0 mb-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Projects
            </span>
            {projects.length > 0 && (
              <Badge className="px-2 py-0.5 text-xs bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                {projects.length}
              </Badge>
            )}
          </div>

          <PermissionsGuard requiredPermission={Permissions.CREATE_PROJECT}>
            <button
              onClick={onOpen}
              type="button"
              className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Plus className="size-3.5" />
            </button>
          </PermissionsGuard>
        </SidebarGroupLabel>
        
        <SidebarMenu className="h-[280px] scrollbar overflow-y-auto pb-2 space-y-1">
          {isError ? (
            <div className="text-center py-4">
              <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center">
                <Folder className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-xs text-red-600 dark:text-red-400">Error loading projects</p>
            </div>
          ) : null}
          
          {isPending ? (
            <div className="flex items-center justify-center py-6">
              <div className="flex items-center gap-3">
                <Loader className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Loading projects...</span>
              </div>
            </div>
          ) : null}

          {!isPending && projects?.length === 0 ? (
            <div className="text-center py-6 px-4">
              <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full flex items-center justify-center">
                <Folder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                No projects yet. Create your first project to get started.
              </p>
              <PermissionsGuard requiredPermission={Permissions.CREATE_PROJECT}>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20"
                  onClick={onOpen}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </PermissionsGuard>
            </div>
          ) : (
            projects.map((item) => {
              const projectUrl = `/workspace/${workspaceId}/project/${item._id}`;
              const isActive = projectUrl === pathname;

              return (
                <SidebarMenuItem key={item._id}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive}
                    className={`group relative overflow-hidden transition-all duration-200 min-h-[64px] py-3 px-2 flex items-start gap-3 ${
                      isActive 
                        ? 'bg-white/80 dark:bg-slate-800/80 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50' 
                        : 'hover:bg-white/40 dark:hover:bg-slate-800/40'
                    } rounded-xl`}
                  >
                    <Link to={projectUrl} className="flex items-start gap-3 w-full">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 shadow-sm group-hover:shadow-md transition-all duration-200 flex-shrink-0">
                        <span className="text-white text-sm">{item.emoji}</span>
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className={`font-medium leading-tight break-words whitespace-normal ${
                          isActive 
                            ? 'text-slate-900 dark:text-white' 
                            : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {item.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                          Project
                        </span>
                      </div>
                      {isActive && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover className="hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200">
                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem
                        onClick={() => navigate(`${projectUrl}`)}
                        className="rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <Folder className="w-4 h-4 mr-2 text-slate-500" />
                        <span>View Project</span>
                      </DropdownMenuItem>

                      <PermissionsGuard
                        requiredPermission={Permissions.DELETE_PROJECT}
                      >
                        <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
                        <DropdownMenuItem
                          disabled={isLoading}
                          onClick={() => onOpenDialog(item)}
                          className="rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          <span>Delete Project</span>
                        </DropdownMenuItem>
                      </PermissionsGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              );
            })
          )}

          {hasMore && (
            <SidebarMenuItem>
              <SidebarMenuButton
                className="text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl transition-all duration-200"
                disabled={isFetching}
                onClick={fetchNextPage}
              >
                <div className="p-2 rounded-lg bg-gradient-to-r from-slate-500 to-gray-500 shadow-sm">
                  <MoreHorizontal className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">
                  {isFetching ? "Loading..." : "Load More"}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>

      <ConfirmDialog
        isOpen={open}
        isLoading={isLoading}
        onClose={onCloseDialog}
        onConfirm={handleConfirm}
        title="Delete Project"
        description={`Are you sure you want to delete ${
          context?.name || "this item"
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
