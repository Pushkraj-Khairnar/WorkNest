import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import PermissionsGuard from "@/components/resuable/permission-guard";
import { Button } from "@/components/ui/button";
import { Permissions } from "@/constant";
import { useAuthContext } from "@/context/auth-provider";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { toast } from "@/hooks/use-toast";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { deleteWorkspaceMutationFn } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Trash2, AlertTriangle, Shield } from "lucide-react";

const DeleteWorkspaceCard = () => {
  const { workspace, hasPermission } = useAuthContext();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { open, onOpenDialog, onCloseDialog } = useConfirmDialog();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteWorkspaceMutationFn,
  });

  const canDeleteWorkspace = hasPermission(Permissions.DELETE_WORKSPACE);

  const handleConfirm = async () => {
    if (!workspaceId) return;
    mutate(workspaceId as string, {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries({ queryKey: ["userWorkspaces"] });
        // Try to use backend's currentWorkspace, otherwise fetch userWorkspaces and redirect to the first one
        if (data.currentWorkspace) {
          navigate(`/workspace/${data.currentWorkspace}`);
        } else {
          // Fallback: get userWorkspaces from cache or refetch
          let userWorkspaces = queryClient.getQueryData(["userWorkspaces"]);
          if (!userWorkspaces) {
            userWorkspaces = await queryClient.fetchQuery({ queryKey: ["userWorkspaces"] });
          }
          // Type guard for workspaces property
          const workspaces = (userWorkspaces && Array.isArray((userWorkspaces as any).workspaces)) ? (userWorkspaces as any).workspaces : [];
          if (workspaces.length > 0) {
            navigate(`/workspace/${workspaces[0]._id}`);
          } else {
            navigate("/workspace");
          }
        }
        setTimeout(() => onCloseDialog(), 100);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };
  return (
    <>
      <div className="w-full">
        {/* Modern Danger Section Header */}
        <div className="relative mb-8 p-6 bg-gradient-to-br from-red-50 via-rose-50/30 to-red-50/20 
                        rounded-xl border border-red-200/60 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
              <p className="text-sm text-red-700 mt-1">
                Permanently delete this workspace and all its data
              </p>
            </div>
          </div>
        </div>

        <PermissionsGuard
          showMessage={false}
          requiredPermission={Permissions.DELETE_WORKSPACE}
        >
          <div className="bg-white rounded-xl border border-red-200/60 shadow-sm hover:shadow-md 
                          transition-all duration-300 p-6 space-y-6">
            
            {/* Critical Warning Section */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-red-900">
                    This action cannot be undone
                  </h3>
                  <div className="text-sm text-red-800 space-y-2">
                    <p>Deleting this workspace will permanently remove:</p>
                    <ul className="list-disc list-inside ml-2 space-y-1 text-red-700">
                      <li>All projects and their associated tasks</li>
                      <li>Team member roles and permissions</li>
                      <li>File attachments and comments</li>
                      <li>Workspace history and analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Workspace Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {workspace?.name?.charAt(0)?.toUpperCase() || 'W'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {workspace?.name || 'Current Workspace'}
                  </p>
                  <p className="text-xs text-gray-600">
                    This workspace will be permanently deleted
                  </p>
                </div>
              </div>
            </div>

            {/* Delete Action */}
            <div className="flex justify-end pt-2">
              <Button
                variant="destructive"
                onClick={onOpenDialog}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 
                         hover:to-red-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg 
                         transition-all duration-200 transform hover:scale-105 min-w-[180px] h-12"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Workspace
              </Button>
            </div>
          </div>
        </PermissionsGuard>

        {/* Custom no permission content */}
        {!canDeleteWorkspace && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-amber-800 mb-2">
                  Permission Required
                </h3>
                <p className="text-sm text-amber-700 leading-relaxed">
                  You don't have permission to delete this workspace. Only workspace owners and administrators can perform this action.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={open}
        isLoading={isPending}
        onClose={onCloseDialog}
        onConfirm={handleConfirm}
        title={`Delete ${workspace?.name} Workspace`}
        description={`Are you sure you want to delete this workspace? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default DeleteWorkspaceCard;
