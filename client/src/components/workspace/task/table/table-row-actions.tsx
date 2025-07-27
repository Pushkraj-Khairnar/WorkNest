import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import { TaskType } from "@/types/api.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { deleteTaskMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import EditTaskDialog from "../edit-task-dialog";

import { useGetTaskPermissions } from "@/hooks/api/use-get-task-permissions";

interface DataTableRowActionsProps {
  row: Row<TaskType>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [openDeleteDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const task = row.original;
  const taskId = task._id as string;
  const taskCode = task.taskCode;

  // Get task-specific permissions
  const { data: permissionsData } = useGetTaskPermissions({
    workspaceId,
    taskId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteTaskMutationFn,
  });

  // STRICT ROLE-BASED ACCESS CONTROL
  // Use ONLY backend permissions - no client-side role checks
  const permissions = permissionsData?.permissions;
  const canUpdateStatus = permissions?.canUpdateStatus || false;
  const canUpdateAllFields = permissions?.canUpdateAllFields || false;
  const canDelete = permissions?.canDelete || false;
  const isTaskAssignee = permissions?.isTaskAssignee || false;
  
  // Determine user access level based on backend permissions
  const isAdminOrOwner = canUpdateAllFields && canDelete;
  const isNormalMemberAssignee = !isAdminOrOwner && isTaskAssignee && canUpdateStatus;

  const handleConfirm = () => {
    mutate(
      { workspaceId: workspaceId || "", taskId },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["all-tasks", workspaceId || ""] });
          toast({ title: "Success", description: data.message, variant: "success" });
          setTimeout(() => setOpenDialog(false), 100);
        },
        onError: (error) => {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        },
      }
    );
  };

  // STRICT ACCESS CONTROL: Only render based on exact backend permissions
  
  // Admin/Owner: Full edit/delete access for any task
  if (isAdminOrOwner) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <MoreHorizontal />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenEditDialog(true)}>
              <Pencil className="w-4 h-4 mr-2" /> 
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="!text-destructive cursor-pointer"
              onClick={() => setOpenDialog(true)}
            >
              Delete Task
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <EditTaskDialog task={task} isOpen={openEditDialog} onClose={() => setOpenEditDialog(false)} />
        <ConfirmDialog
          isOpen={openDeleteDialog}
          isLoading={isPending}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleConfirm}
          title="Delete Task"
          description={`Are you sure you want to delete ${taskCode}?`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </>
    );
  }

  // Normal Member Assignee: Show indicator only (status changes handled in status column)
  if (isNormalMemberAssignee) {
    return (
      <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
        <span>Assignee</span>
      </div>
    );
  }

  // Read-only users: No actions rendered at all
  // isReadOnly users see completely empty actions column
  return null;
}
