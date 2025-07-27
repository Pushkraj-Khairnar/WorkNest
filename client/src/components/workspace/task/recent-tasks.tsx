import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { getAllTasksQueryFn } from "@/lib/api";
import {
  getAvatarColor,
  getAvatarFallbackText,
  transformStatusEnum,
} from "@/lib/helper";
import { TaskType } from "@/types/api.type";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader, Rocket, Clock, User, ArrowUpRight } from "lucide-react";
import { StatusDropdown } from "./status-dropdown";
import { useAuthContext } from "@/context/auth-provider";
import { Permissions } from "@/constant";

const RecentTasks = () => {
  const workspaceId = useWorkspaceId();
  const { user, workspace, hasPermission } = useAuthContext();

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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (tasks?.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl flex items-center justify-center mb-6">
            <Rocket className="w-12 h-12 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No tasks yet</h3>
          <p className="text-gray-500 max-w-md mx-auto text-lg leading-relaxed">
            Time to get productive! Create your first task and start tracking your progress.
          </p>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.slice(0, 6).map((task) => {
        const name = task?.assignedTo?.name || "";
        const initials = getAvatarFallbackText(name);
        const avatarColor = getAvatarColor(name);
        
        // Role-based permissions for each task
        const isWorkspaceOwner = user && workspace && user._id === workspace.owner;
        const isTaskAssignee = user && task.assignedTo && user._id === task.assignedTo._id;
        const hasEditPermission = hasPermission(Permissions.EDIT_TASK);
        const hasDeletePermission = hasPermission(Permissions.DELETE_TASK);
        const isAdminOrOwner = isWorkspaceOwner || hasEditPermission || hasDeletePermission;
        const canShowStatusDropdown = isAdminOrOwner || isTaskAssignee;
        
        return (
          <div
            key={task._id}
            className="group relative bg-white rounded-3xl p-6 border border-gray-100/50 hover:border-gray-200 transition-all duration-300 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Task status indicator */}
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 group-hover:scale-125 transition-transform duration-300"></div>
                
                <div className="flex-1 min-w-0">
                  {/* Task header */}
                  <div className="flex items-center gap-3 mb-3">
                    <Badge 
                      variant="outline" 
                      className="text-xs font-medium bg-gray-50 text-gray-600 border-gray-200 rounded-xl"
                    >
                      {task.taskCode}
                    </Badge>
                    <Badge
                      className={`text-xs font-medium rounded-xl border ${getPriorityColor(task.priority)}`}
                    >
                      {transformStatusEnum(task.priority)}
                    </Badge>
                  </div>
                  
                  {/* Task title */}
                  <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                    {task.title}
                  </h3>
                  
                  {/* Task meta */}
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        Due {task.dueDate ? format(task.dueDate, "MMM dd") : "No date"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{name || "Unassigned"}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right side - Status and Avatar */}
              <div className="flex items-center gap-4 ml-4">
                {/* Only show status dropdown if user has permission */}
                {canShowStatusDropdown ? (
                  <StatusDropdown task={task} currentStatus={task.status} />
                ) : (
                  // Read-only status badge for users without edit permissions
                  <Badge
                    variant="outline"
                    className="text-xs font-medium bg-gray-50 text-gray-600 border-gray-200 rounded-xl opacity-60"
                  >
                    {task.status.replace("_", " ")}
                  </Badge>
                )}
                
                <Avatar className="h-12 w-12 border-2 border-white shadow-lg group-hover:shadow-xl transition-shadow">
                  <AvatarImage
                    src={task.assignedTo?.profilePicture || ""}
                    alt={task.assignedTo?.name}
                  />
                  <AvatarFallback className={`${avatarColor} text-white font-bold`}>
                    {initials || "?"}
                  </AvatarFallback>
                </Avatar>
                
                {/* Arrow indicator - only show for users with some level of access */}
                {canShowStatusDropdown && (
                  <div className="w-8 h-8 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/30 group-hover:via-purple-50/20 group-hover:to-pink-50/30 rounded-3xl transition-all duration-300 pointer-events-none"></div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentTasks;
