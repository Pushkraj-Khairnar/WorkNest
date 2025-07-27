import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskType } from "@/types/api.type";
import { TaskStatusEnum } from "@/constant";
import { useUpdateTaskStatus } from "@/hooks/api/use-update-task-status";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { toast } from "@/hooks/use-toast";

interface InlineStatusToggleProps {
  task: TaskType;
  currentStatus: string;
}

const statusColors: Record<string, string> = {
  BACKLOG: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200",
  TODO: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
  IN_REVIEW: "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
  DONE: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
};

export const InlineStatusToggle = ({ task, currentStatus }: InlineStatusToggleProps) => {
  const [open, setOpen] = useState(false);
  const { mutate: updateStatus, isPending } = useUpdateTaskStatus();
  const workspaceId = useWorkspaceId();

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === currentStatus || isPending) return;

    updateStatus(
      {
        workspaceId: workspaceId || "",
        taskId: task._id,
        status: newStatus,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Task status updated",
            variant: "success",
          });
          setOpen(false);
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
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-6 px-2 text-xs font-medium rounded-md border transition-colors ${statusColors[currentStatus]}`}
          disabled={isPending}
        >
          {currentStatus.replace("_", " ")}
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[120px]">
        {Object.values(TaskStatusEnum).map((status) => (
          <DropdownMenuItem
            key={status}
            className="cursor-pointer flex items-center justify-between text-xs"
            onClick={() => handleStatusChange(status)}
          >
            <span>{status.replace("_", " ")}</span>
            {status === currentStatus && <Check className="w-3 h-3" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InlineStatusToggle;
