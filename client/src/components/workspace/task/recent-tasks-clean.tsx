import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { getAllTasksQueryFn } from "@/lib/api";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { TaskType } from "@/types/api.type";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader, ListTodo, Clock } from "lucide-react";
import { StatusDropdown } from "./status-dropdown";

const RecentTasks = () => {
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useQuery({
    queryKey: ["all-tasks", workspaceId],
    queryFn: () =>
      getAllTasksQueryFn({
        workspaceId: workspaceId!,
      }),
    staleTime: 0,
    enabled: !!workspaceId,
  });

  const tasks: TaskType[] = data?.tasks || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (tasks?.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
            <ListTodo className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">No tasks yet</h3>
          <p className="text-sm text-gray-500">
            Start creating tasks to track your work.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.slice(0, 3).map((task) => {
        const name = task?.assignedTo?.name || "";
        const initials = getAvatarFallbackText(name);
        const avatarColor = getAvatarColor(name);
        
        return (
          <div
            key={task._id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge 
                  variant="outline" 
                  className="text-xs font-medium bg-gray-50 text-gray-600 border-gray-200 px-1.5 py-0.5"
                >
                  {task.taskCode}
                </Badge>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                {task.title}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {task.dueDate ? format(task.dueDate, "MMM dd") : "No date"}
                  </span>
                </div>
                <StatusDropdown task={task} currentStatus={task.status} />
              </div>
            </div>
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={task.assignedTo?.profilePicture || ""}
                alt={task.assignedTo?.name}
              />
              <AvatarFallback className={`${avatarColor} text-white text-xs font-medium`}>
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        );
      })}
    </div>
  );
};

export default RecentTasks;
