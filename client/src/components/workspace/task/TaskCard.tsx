import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, User, Tag, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { TaskType } from "@/types/api.type";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import EditTaskDialog from "./edit-task-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { deleteTaskMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useGetTaskPermissions } from "@/hooks/api/use-get-task-permissions";
import { InlineStatusToggle } from "./inline-status-toggle";

interface TaskCardProps {
  task: TaskType;
}

const statusColors: Record<string, string> = {
  BACKLOG: "from-gray-100 to-gray-200 text-gray-600",
  TODO: "from-blue-100 to-blue-200 text-blue-700",
  IN_PROGRESS: "from-yellow-100 to-yellow-200 text-yellow-700",
  IN_REVIEW: "from-purple-100 to-purple-200 text-purple-700",
  DONE: "from-green-100 to-green-200 text-green-700",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-gradient-to-r from-green-100 to-green-200 text-green-700",
  MEDIUM: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700",
  HIGH: "bg-gradient-to-r from-red-100 to-orange-200 text-orange-700",
};

function TaskCard({ task }: TaskCardProps) {
  // HOOKS AND LOGIC
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const taskId = task._id as string;
  const taskCode = task.taskCode;

  // Permissions logic
  const { data: permissionsData } = useGetTaskPermissions({
    workspaceId,
    taskId,
  });
  
  // STRICT ROLE-BASED ACCESS CONTROL
  // Use ONLY backend permissions - no client-side role checks
  const permissions = permissionsData?.permissions;
  const isTaskAssignee = permissions?.isTaskAssignee || false;
  const canUpdateAllFields = permissions?.canUpdateAllFields || false;
  const canDelete = permissions?.canDelete || false;
  const canUpdateStatus = permissions?.canUpdateStatus || false;
  
  // Determine user access level based on backend permissions
  const isAdminOrOwner = canUpdateAllFields && canDelete;
  const isNormalMemberAssignee = !isAdminOrOwner && isTaskAssignee && canUpdateStatus;

  const { mutate: deleteTask, isPending } = useMutation({
    mutationFn: () => deleteTaskMutationFn({ workspaceId: workspaceId!, taskId }),
    onSuccess: () => {
      toast({ title: "Task deleted" });
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
      setOpenDeleteDialog(false);
    },
    onError: (err: any) => {
      toast({ title: "Failed to delete task", description: err?.message || "" });
    },
  });

  const handleDeleteConfirm = () => {
    deleteTask();
  };

  // RENDER
  return (
    <div>
      <div
        className="relative bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-4 min-w-[260px] max-w-xs border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-2xl group"
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.08)" }}
      >
        {/* Status Ribbon - Always visible to all users */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${statusColors[task.status]} z-10`}>
          {task.status.replace("_", " ")}
        </div>

        {/* STRICT ACCESS CONTROL: Only render controls based on exact backend permissions */}
        
        {/* Admin/Owner: Full edit/delete access for any task */}
        {isAdminOrOwner && (
          <div className="absolute bottom-3 right-3 z-20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 bg-white hover:bg-gray-100 rounded-full shadow-md border border-gray-300"
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-700" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setOpenEditDialog(true)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="!text-destructive cursor-pointer"
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Normal Member Assignee: Only status toggle for their own assigned tasks */}
        {isNormalMemberAssignee && (
          <div className="absolute bottom-3 right-3 z-20">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              <InlineStatusToggle task={task} currentStatus={task.status} />
            </div>
          </div>
        )}

        {/* Read-only users: No controls rendered at all */}
        {/* isReadOnly users see no interactive elements */}

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">{task.title}</h3>

        {/* Project */}
        {task.project && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Tag className="w-4 h-4 text-indigo-400" />
            {task.project?.name}
          </div>
        )}

        {/* Assignee and Due Date */}
        <div className="flex items-center gap-2 mt-2">
          <Avatar className="h-7 w-7">
            {task.assignedTo?.profilePicture ? (
              <AvatarImage src={task.assignedTo.profilePicture} alt={task.assignedTo.name} />
            ) : (
              <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                {task.assignedTo?.name?.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <User className="w-3 h-3" />
            {task.assignedTo?.name || "Unassigned"}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1 ml-auto">
            <Clock className="w-3 h-3" />
            {task.dueDate ? format(task.dueDate, "MMM dd") : "No date"}
          </span>
        </div>

        {/* Priority */}
        <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority]} w-fit`}>
          {task.priority}
        </div>
      </div>

      {/* STRICT ACCESS: Edit/Delete dialogs only for admins/owners */}
      {isAdminOrOwner && (
        <>
          <EditTaskDialog
            task={task}
            isOpen={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
          />
          <ConfirmDialog
            isOpen={openDeleteDialog}
            isLoading={isPending}
            onClose={() => setOpenDeleteDialog(false)}
            onConfirm={handleDeleteConfirm}
            title="Delete Task"
            description={`Are you sure you want to delete ${taskCode}? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
          />
        </>
      )}
    </div>
  );
}

export default TaskCard;
