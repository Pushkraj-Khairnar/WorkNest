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
import { Loader, Calendar, User, Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

const RecentTasks = () => {
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useQuery({
    queryKey: ["all-tasks", workspaceId],
    queryFn: () =>
      getAllTasksQueryFn({
        workspaceId,
      }),
    staleTime: 0,
    enabled: !!workspaceId,
  });

  const tasks: TaskType[] = data?.tasks || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4" />;
      case "TODO":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "TODO":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800";
      case "MEDIUM":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      case "LOW":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-slate-600 dark:text-slate-400">Loading tasks...</span>
        </div>
      </div>
    );
  }

  if (tasks?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          No tasks yet
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
          Create your first task to start tracking your team's work and progress.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          Recent Tasks
        </h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => {
          const name = task?.assignedTo?.name || "";
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);
          
          return (
            <div
              key={task._id}
              className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Task Code */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-700/50 dark:to-gray-700/50 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {task.taskCode}
                    </span>
                  </div>
                </div>

                {/* Task Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                        {task.title}
                      </h4>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Due: {task.dueDate ? format(task.dueDate, "MMM dd, yyyy") : "No due date"}
                          </span>
                        </div>
                        {task.assignedTo && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>Assigned to {name}</span>
                          </div>
                        )}
                      </div>

                      {/* Status and Priority Badges */}
                      <div className="flex items-center gap-3">
                        <Badge className={`flex items-center gap-1 px-3 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          <span className="text-xs font-medium">
                            {transformStatusEnum(task.status)}
                          </span>
                        </Badge>
                        
                        <Badge className={`flex items-center gap-1 px-3 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                          <span className="text-xs font-medium">
                            {transformStatusEnum(task.priority)}
                          </span>
                        </Badge>
                      </div>
                    </div>

                    {/* Assignee Avatar */}
                    {task.assignedTo && (
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Assigned to
                          </p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {name}
                          </p>
                        </div>
                        <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-700 shadow-sm">
                          <AvatarImage
                            src={task.assignedTo?.profilePicture || ""}
                            alt={name}
                          />
                          <AvatarFallback className={`${avatarColor} text-sm font-medium`}>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTasks;

// const RecentTasks = () => {
//   const tasks = [
//     {
//       id: "Task-12",
//       title: "You can't compress the program without quanti",
//       date: "December 29, 2024",
//       assigneeTo: "EM",
//     },
//     {
//       id: "Task-13",
//       title: "You can't compress the program without quanti",
//       date: "December 29, 2024",
//       assigneeTo: "EM",
//     },
//     {
//       id: "Task-14",
//       title: "You can't compress the program without quanti",
//       date: "December 29, 2024",
//       assigneeTo: "EM",
//     },
//     {
//       id: "Task-15",
//       title: "You can't compress the program without quanti",
//       date: "December 29, 2024",
//       assigneeTo: "EM",
//     },
//     {
//       id: "Task-16",
//       title: "You can't compress the program without quanti",
//       date: "December 29, 2024",
//       assigneeTo: "EM",
//     },
//   ];
//   return (
//     <div className="flex flex-col pt-2">
//       <ul role="list" className="space-y-2">
//         {tasks.map((item, index) => (
//           <li
//             key={index}
//             role="listitem"
//             className="shadow-none border-0 py-2 hover:bg-[#fbfbfb] transition-colors ease-in-out "
//           >
//             <div className="grid grid-cols-7 gap-1 p-0">
//               <div className="shrink">
//                 <p>{item.id}</p>
//               </div>
//               <div className="col-span-2">
//                 <p className="text-sm font-medium leading-none">{item.title}</p>
//               </div>
//               <div>dueDate</div>
//               <div>Todo</div>
//               <div>High</div>
//               <div className="flex items-center gap-4 place-self-end">
//                 <span className="text-sm text-gray-500">Assigned To</span>
//                 <Avatar className="hidden h-9 w-9 sm:flex">
//                   <AvatarImage src="/avatars/01.png" alt="Avatar" />
//                   <AvatarFallback>{item.assigneeTo}</AvatarFallback>
//                 </Avatar>
//               </div>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default RecentTasks;
