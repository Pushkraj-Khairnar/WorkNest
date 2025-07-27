import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { TaskType } from "@/types/api.type";
import { useUpdateTaskStatus } from "@/hooks/api/use-update-task-status";
import { useGetTaskPermissions } from "@/hooks/api/use-get-task-permissions";
import { statuses } from "./table/data";
import useWorkspaceId from "@/hooks/use-workspace-id";

interface StatusDropdownProps {
  task: TaskType;
  currentStatus: string;
}

export function StatusDropdown({ task, currentStatus }: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const { mutate: updateStatus, isPending } = useUpdateTaskStatus();
  const workspaceId = useWorkspaceId();

  // Don't render if workspaceId is not available
  if (!workspaceId) return null;

  const { data: permissionsData } = useGetTaskPermissions({
    workspaceId,
    taskId: task._id,
  });

  // STRICT ROLE-BASED ACCESS CONTROL
  // Use ONLY backend permissions - no client-side role checks
  const permissions = permissionsData?.permissions;
  const canUpdateStatus = permissions?.canUpdateStatus || false;
  
  // Determine user access level based on backend permissions
  const hasStatusUpdateAccess = canUpdateStatus; // Either admin/owner or task assignee

  // If user cannot update status, show read-only status badge (no dropdown)
  if (!hasStatusUpdateAccess) {
    const status = statuses.find((s) => s.value === currentStatus);
    if (!status) return null;

    const Icon = status.icon;

    return (
      <div className="flex lg:w-[120px] items-center">
        <Badge
          variant="outline"
          className="flex w-auto p-1 px-2 gap-1 font-medium shadow-sm uppercase border-0 opacity-60 cursor-not-allowed"
        >
          {Icon && <Icon className="h-4 w-4 rounded-full text-inherit" />}
          <span>{status.label}</span>
        </Badge>
        <span className="ml-1 text-xs text-gray-400" title="You don't have permission to change this task's status">
          🔒
        </span>
      </div>
    );
  }

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === currentStatus) {
      setOpen(false);
      return;
    }

    updateStatus(
      {
        workspaceId,
        taskId: task._id,
        status: newStatus,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-auto justify-between p-1 px-2 h-auto bg-blue-50 hover:bg-blue-100 border-blue-200 transition-colors"
          disabled={isPending}
        >
          <div className="flex items-center gap-1">
            {(() => {
              const status = statuses.find((s) => s.value === currentStatus);
              if (!status) return null;

              const Icon = status.icon;

              return (
                <>
                  {Icon && <Icon className="h-4 w-4 rounded-full text-inherit" />}
                  <span className="uppercase font-medium text-xs">{status.label}</span>
                </>
              );
            })()}
          </div>
          <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" aria-label="Select task status">
        <Command>
          <CommandInput placeholder="Search status..." />
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              <div className="px-2 py-1 text-xs text-gray-500 font-medium">
                Update task status
              </div>
              {statuses.map((status) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={() => handleStatusChange(status.value)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2 w-full">
                    {status.icon && (
                      <status.icon className="h-4 w-4 rounded-full" />
                    )}
                    <span className="flex-1">{status.label}</span>
                    {currentStatus === status.value && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 