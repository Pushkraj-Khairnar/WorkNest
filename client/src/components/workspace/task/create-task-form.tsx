import { z } from "zod";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Loader } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  getAvatarColor,
  getAvatarFallbackText,
  transformOptions,
} from "@/lib/helper";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { TaskPriorityEnum, TaskStatusEnum, Permissions } from "@/constant";
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createTaskMutationFn } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useAuthContext } from "@/context/auth-provider";

export default function CreateTaskForm(props: {
  projectId?: string;
  onClose: () => void;
}) {
  const { projectId, onClose } = props;

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const { hasPermission } = useAuthContext();

  // Check if user has permission to create tasks
  const canCreateTask = hasPermission(Permissions.CREATE_TASK);

  const { mutate, isPending } = useMutation({
    mutationFn: createTaskMutationFn,
  });

  const { data, isLoading } = useGetProjectsInWorkspaceQuery({
    workspaceId,
    skip: !!projectId,
  });

  const { data: memberData } = useGetWorkspaceMembers(workspaceId);

  const projects = data?.projects || [];
  const members = memberData?.members || [];

  //Workspace Projects
  const projectOptions = projects?.map((project) => {
    return {
      label: (
        <div className="flex items-center gap-1">
          <span>{project.emoji}</span>
          <span>{project.name}</span>
        </div>
      ),
      value: project._id,
    };
  });

  // Workspace Memebers
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

  const formSchema = z.object({
    title: z.string().trim().min(1, {
      message: "Title is required",
    }),
    description: z.string().trim(),
    projectId: z.string().trim().min(1, {
      message: "Project is required",
    }),
    status: z.enum(
      Object.values(TaskStatusEnum) as [keyof typeof TaskStatusEnum],
      {
        required_error: "Status is required",
      }
    ),
    priority: z.enum(
      Object.values(TaskPriorityEnum) as [keyof typeof TaskPriorityEnum],
      {
        required_error: "Priority is required",
      }
    ),
    assignedTo: z.string().trim().min(1, {
      message: "AssignedTo is required",
    }),
    dueDate: z.date({
      required_error: "A date of birth is required.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId: projectId ? projectId : "",
    },
  });

  const taskStatusList = Object.values(TaskStatusEnum);
  const taskPriorityList = Object.values(TaskPriorityEnum); // ["LOW", "MEDIUM", "HIGH", "URGENT"]

  const statusOptions = transformOptions(taskStatusList);
  const priorityOptions = transformOptions(taskPriorityList);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending || !workspaceId) return;
    
    const payload = {
      workspaceId,
      projectId: values.projectId,
      data: {
        ...values,
        dueDate: values.dueDate.toISOString(),
      },
    };

    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["project-analytics", projectId],
        });

        queryClient.invalidateQueries({
          queryKey: ["all-tasks", workspaceId],
        });

        toast({
          title: "Success",
          description: "Task created successfully",
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
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Modern Header with subtle gradient */}
      <div className="px-8 py-6 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Create New Task
          </h1>
          <p className="text-sm text-slate-600">
            Add a new task to keep your team organized and productive
          </p>
          {!canCreateTask && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-800">
                <strong>No Permission:</strong> You don't have permission to create tasks in this workspace.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Scrollable Form Container */}
      <div className="p-8 max-h-[calc(90vh-200px)] overflow-y-auto" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#e2e8f0 transparent'
      }}>
        <Form {...form}>
          <form className="space-y-6 max-w-2xl mx-auto" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Task Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700 mb-2 block">
                    Task Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter task title..."
                      className="h-12 px-4 bg-white border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 shadow-sm transition-all duration-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs ml-1" />
                </FormItem>
              )}
            />

            {/* Task Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700 mb-2 block">
                    Description <span className="text-slate-400 font-normal">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={3} 
                      placeholder="Describe the task details..."
                      className="px-4 py-3 bg-white border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 shadow-sm transition-all duration-200 resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs ml-1" />
                </FormItem>
              )}
            />

            {/* Project Selection (if not pre-selected) */}
            {!projectId && (
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 mb-2 block">
                      Project
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 shadow-sm transition-all duration-200">
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl bg-white">
                        {isLoading && (
                          <div className="flex justify-center py-4">
                            <Loader className="w-4 h-4 animate-spin text-blue-500" />
                          </div>
                        )}
                        <div className="max-h-48 overflow-y-auto">
                          {projectOptions?.map((option) => (
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
                )}
              />
            )}

            {/* Assigned To */}
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700 mb-2 block">
                    Assigned To
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            className="cursor-pointer hover:bg-slate-50 rounded-lg mx-1 transition-colors"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs ml-1" />
                </FormItem>
              )}
            />

            {/* Due Date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
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
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-xl border-slate-200 shadow-xl" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                          date > new Date("2100-12-31")
                        }
                        initialFocus
                        defaultMonth={new Date()}
                        fromMonth={new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-xs ml-1" />
                </FormItem>
              )}
            />

            {/* Status and Priority - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 mb-2 block">
                      Status
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 shadow-sm transition-all duration-200">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl bg-white">
                        {statusOptions?.map((status) => (
                          <SelectItem
                            key={status.value}
                            value={status.value}
                            className="capitalize cursor-pointer hover:bg-slate-50 rounded-lg mx-1 transition-colors"
                          >
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                              {status.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs ml-1" />
                  </FormItem>
                )}
              />

              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 mb-2 block">
                      Priority
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 shadow-sm transition-all duration-200">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl bg-white">
                        {priorityOptions?.map((priority) => (
                          <SelectItem
                            key={priority.value}
                            value={priority.value}
                            className="capitalize cursor-pointer hover:bg-slate-50 rounded-lg mx-1 transition-colors"
                          >
                            <span className={cn(
                              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                              priority.value === "HIGH" && "bg-red-100 text-red-700",
                              priority.value === "URGENT" && "bg-red-100 text-red-700",
                              priority.value === "MEDIUM" && "bg-yellow-100 text-yellow-700",
                              priority.value === "LOW" && "bg-green-100 text-green-700"
                            )}>
                              {priority.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs ml-1" />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>

      {/* Enhanced Action Buttons */}
      <div className="px-8 py-6 border-t border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="flex gap-4 max-w-2xl mx-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || !canCreateTask}
            onClick={form.handleSubmit(onSubmit)}
            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg shadow-blue-600/25 transform hover:scale-105 disabled:transform-none disabled:opacity-50 transition-all duration-200"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </div>
            ) : (
              "Create Task"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
