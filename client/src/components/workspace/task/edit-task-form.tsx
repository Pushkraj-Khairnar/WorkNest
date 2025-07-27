import { z } from "zod";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../../ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { TaskPriorityEnum, TaskStatusEnum } from "@/constant";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import { editTaskMutationFn } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { TaskType } from "@/types/api.type";
import { useAuthContext } from "@/context/auth-provider";
import { useUpdateTaskStatus } from "@/hooks/api/use-update-task-status";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Permissions } from "@/constant";

export default function EditTaskForm({ task, onClose }: { task: TaskType; onClose: () => void }) {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const { user, workspace, hasPermission } = useAuthContext();

  const { mutate: updateFullTask, isPending: isFullUpdatePending } = useMutation({
    mutationFn: editTaskMutationFn,
  });

  const { mutate: updateTaskStatus, isPending: isStatusUpdatePending } = useUpdateTaskStatus();

  const isPending = isFullUpdatePending || isStatusUpdatePending;

  const { data: memberData } = useGetWorkspaceMembers(workspaceId);
  const members = memberData?.members || [];

  // Create member options with proper styling
  const membersOptions = members?.map((member) => {
    const name = member.userId?.name || "Unknown";
    const initials = getAvatarFallbackText(name);
    const avatarColor = getAvatarColor(name);

    return {
      label: (
        <div className="flex items-center space-x-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={member.userId?.profilePicture || ""} alt={name} />
            <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
          </Avatar>
          <span>{name}</span>
        </div>
      ),
      value: member.userId._id,
    };
  });

  // If the user is the workspace owner, always allow editing all fields
  const isOwner = user && workspace && user._id === workspace.owner;
  
  let canUpdateAllFields = false;
  let canUpdateStatus = false;
  
  if (isOwner) {
    // Owner can do everything
    canUpdateAllFields = true;
    canUpdateStatus = true;
  } else {
    // For non-owners, check permissions and task assignment
    const isTaskAssignee = user && task.assignedTo && user._id === task.assignedTo._id;
    const hasEditPermission = hasPermission(Permissions.EDIT_TASK);
    const hasDeletePermission = hasPermission(Permissions.DELETE_TASK);
    
    // Only owners and admins can edit all fields
    canUpdateAllFields = hasEditPermission || hasDeletePermission;
    
    // Task assignees can update status, or admins/owners can update status
    canUpdateStatus = isTaskAssignee || canUpdateAllFields;
  }

  const formSchema = z.object({
    title: z.string().trim().min(1, { message: "Title is required" }),
    description: z.string().trim(),
    status: z.enum(Object.values(TaskStatusEnum) as [keyof typeof TaskStatusEnum]),
    priority: z.enum(Object.values(TaskPriorityEnum) as [keyof typeof TaskPriorityEnum]),
    assignedTo: z.string().trim().min(1, { message: "AssignedTo is required" }),
    dueDate: z.date({ required_error: "A due date is required." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "TODO",
      priority: task?.priority ?? "MEDIUM",
      assignedTo: task.assignedTo?._id ?? "",
      dueDate: task?.dueDate ? new Date(task.dueDate) : new Date(),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;

    // If user can only update status, use the status-specific API
    if (!canUpdateAllFields && canUpdateStatus) {
      // Only update status
      if (values.status !== task.status) {
        updateTaskStatus(
          {
            workspaceId: workspaceId || "",
            taskId: task._id,
            status: values.status,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["all-tasks", workspaceId || ""] });
              toast({
                title: "Success",
                description: "Task status updated successfully",
                variant: "success",
              });
              onClose();
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
      } else {
        // No changes made
        toast({
          title: "Info",
          description: "No changes detected",
          variant: "default",
        });
        onClose();
      }
      return;
    }

    // If user can update all fields, use the full update API
    const payload = {
      workspaceId: workspaceId || "",
      projectId: task.project?._id ?? "",
      taskId: task._id,
      data: {
        ...values,
        dueDate: values.dueDate.toISOString(),
      },
    };

    updateFullTask(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["all-tasks", workspaceId || ""] });
        toast({
          title: "Success",
          description: "Task updated successfully",
          variant: "success",
        });
        onClose();
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
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex flex-col">
      {/* Modern Header with subtle gradient */}
      <div className="px-8 py-6 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm flex-shrink-0">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            {canUpdateAllFields ? "Edit Task" : canUpdateStatus ? "Update Task Status" : "View Task"}
          </h1>
          <p className="text-sm text-slate-600">
            {canUpdateAllFields ? "Update task details and manage progress efficiently" : 
             canUpdateStatus ? "Update the status to reflect current progress" :
             "View task details (read-only access)"}
          </p>
          
          {/* Permission Notice for Assignees */}
          {!canUpdateAllFields && canUpdateStatus && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>Assignee Access:</strong> You can only update the task status. 
                Other task details can only be modified by workspace owners and admins.
              </p>
            </div>
          )}
          
          {/* No Permission Notice */}
          {!canUpdateAllFields && !canUpdateStatus && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-800">
                <strong>Read-Only Access:</strong> You don't have permission to modify this task.
                Only workspace owners, admins, and task assignees can make changes.
              </p>
            </div>
          )}
          
          {/* Full Access Notice for Admins/Owners - Removed per user request */}
        </div>
      </div>

      {/* Enhanced Scrollable Form Container */}
      <div className="flex-1 overflow-y-auto p-8" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#e2e8f0 transparent'
      }}>
        {/* Render different interfaces based on user permissions */}
        {canUpdateAllFields ? (
          // Full edit form for owners and admins
          <Form {...form}>
            <form className="space-y-6 max-w-2xl mx-auto" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Task Title */}
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700 mb-2 block">
                    Task Title
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter task title..."
                      className="h-12 px-4 bg-white border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 shadow-sm transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage className="text-xs ml-1" />
                </FormItem>
              )} />

              {/* Task Description */}
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700 mb-2 block">
                    Description <span className="text-slate-400 font-normal">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={3} 
                      placeholder="Describe the task details..."
                      className="px-4 py-3 bg-white border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 shadow-sm transition-all duration-200 resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-xs ml-1" />
                </FormItem>
              )} />

              {/* Assigned To */}
              <FormField control={form.control} name="assignedTo" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700 mb-2 block">
                    Assigned To
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 px-4 bg-white border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 shadow-sm transition-all duration-200">
                        <SelectValue placeholder="Select an assignee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl bg-white">
                      <div className="max-h-48 overflow-y-auto">
                        {membersOptions?.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="capitalize cursor-pointer hover:bg-slate-50 rounded-lg mx-1 transition-colors"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs ml-1" />
                </FormItem>
              )} />

              {/* Due Date */}
              <FormField control={form.control} name="dueDate" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700 mb-2 block">
                    Due Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button 
                          variant="outline"
                          className={cn(
                            "w-full h-12 px-4 justify-start text-left font-normal bg-white border-slate-200 rounded-xl hover:bg-slate-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 shadow-sm transition-all duration-200",
                            !field.value && "text-slate-500"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-xl border-slate-200 shadow-xl" align="start" aria-label="Select due date">
                      <Calendar 
                        mode="single" 
                        selected={field.value} 
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                          date > new Date("2100-12-31")
                        }
                        initialFocus
                        defaultMonth={field.value || new Date()}
                        fromMonth={new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-xs ml-1" />
                </FormItem>
              )} />

              {/* Status and Priority - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 mb-2 block">
                      Status
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 shadow-sm transition-all duration-200">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl bg-white">
                        {Object.values(TaskStatusEnum).map((status) => (
                          <SelectItem 
                            key={status} 
                            value={status}
                            className="capitalize cursor-pointer hover:bg-slate-50 rounded-lg mx-1 transition-colors"
                          >
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs ml-1" />
                  </FormItem>
                )} />

                {/* Priority */}
                <FormField control={form.control} name="priority" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 mb-2 block">
                      Priority
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 shadow-sm transition-all duration-200">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl bg-white">
                        {Object.values(TaskPriorityEnum).map((priority) => (
                          <SelectItem 
                            key={priority} 
                            value={priority}
                            className="capitalize cursor-pointer hover:bg-slate-50 rounded-lg mx-1 transition-colors"
                          >
                            {priority.charAt(0) + priority.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs ml-1" />
                  </FormItem>
                )} />
              </div>
            </form>
          </Form>
        ) : canUpdateStatus ? (
          // Simplified status-only interface for assignees
          <div className="max-w-2xl mx-auto">
            {/* Task Information Display (Read-only) */}
            <div className="space-y-6 mb-8">
              {/* Task Title */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Task Title</h3>
                <p className="text-slate-900 font-medium">{task.title}</p>
              </div>

              {/* Task Description */}
              {task.description && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Description</h3>
                  <p className="text-slate-700">{task.description}</p>
                </div>
              )}

              {/* Task Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Assigned To */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Assigned To</h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignedTo?.profilePicture || ""} alt={task.assignedTo?.name || ""} />
                      <AvatarFallback className="text-xs">
                        {getAvatarFallbackText(task.assignedTo?.name || "")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-slate-900 font-medium">{task.assignedTo?.name || "Unassigned"}</span>
                  </div>
                </div>

                {/* Due Date */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Due Date</h3>
                  <p className="text-slate-900 font-medium">
                    {task.dueDate ? format(new Date(task.dueDate), "PPP") : "No due date"}
                  </p>
                </div>

                {/* Priority */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Priority</h3>
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                    task.priority === "HIGH" && "bg-red-100 text-red-700",
                    task.priority === "MEDIUM" && "bg-yellow-100 text-yellow-700",
                    task.priority === "LOW" && "bg-green-100 text-green-700"
                  )}>
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Update Section */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Update Task Status</h3>
                <p className="text-sm text-blue-700">
                  As the task assignee, you can update the status to reflect current progress.
                </p>
              </div>

              <Form {...form}>
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 mb-3 block text-center">
                      Current Status
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-14 px-6 bg-white border-blue-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all duration-200 text-center font-medium">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl bg-white">
                        {Object.values(TaskStatusEnum).map((status) => (
                          <SelectItem 
                            key={status} 
                            value={status}
                            className="capitalize cursor-pointer hover:bg-slate-50 rounded-lg mx-1 transition-colors font-medium"
                          >
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-3 h-3 rounded-full",
                                status === "BACKLOG" && "bg-gray-400",
                                status === "TODO" && "bg-blue-400",
                                status === "IN_PROGRESS" && "bg-orange-400", 
                                status === "IN_REVIEW" && "bg-purple-400",
                                status === "DONE" && "bg-green-400"
                              )} />
                              {status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ")}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs ml-1" />
                  </FormItem>
                )} />
              </Form>
            </div>
          </div>
        ) : (
          // No edit access - show read-only view
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
              <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">No Edit Permission</h3>
              <p className="text-sm text-red-700 mb-6">
                You don't have permission to modify this task. Only workspace owners, admins, and task assignees can make changes.
              </p>
              
              {/* Task Details for viewing */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 text-left">
                <h4 className="font-medium text-slate-900 mb-4">Task Details</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-slate-600">Title:</span>
                    <span className="ml-2 font-medium text-slate-900">{task.title}</span>
                  </div>
                  {task.description && (
                    <div>
                      <span className="text-slate-600">Description:</span>
                      <span className="ml-2 text-slate-900">{task.description}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-600">Status:</span>
                    <span className="ml-2 font-medium text-slate-900">{task.status.replace("_", " ")}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Priority:</span>
                    <span className="ml-2 font-medium text-slate-900">{task.priority}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Action Buttons - Fixed at bottom */}
      <div className="px-8 py-6 border-t border-slate-200/60 bg-white/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex gap-4 max-w-2xl mx-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200"
          >
            Cancel
          </Button>
          
          {/* Only show save button if user has some level of edit permission */}
          {(canUpdateAllFields || canUpdateStatus) && (
            <Button
              type="submit"
              disabled={isPending}
              onClick={form.handleSubmit(onSubmit)}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg shadow-blue-600/25 transform hover:scale-105 disabled:transform-none disabled:opacity-50 transition-all duration-200"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>
                    {canUpdateAllFields ? "Updating..." : "Updating Status..."}
                  </span>
                </div>
              ) : (
                <>
                  {canUpdateAllFields ? "Save All Changes" : "Update Status"}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
