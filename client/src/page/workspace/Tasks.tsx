
import { useState, useMemo } from "react";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useQuery } from "@tanstack/react-query";
import { getAllTasksQueryFn } from "@/lib/api";
import { TaskType } from "@/types/api.type";
import TaskTabs from "@/components/workspace/task/TaskTabs";
import TaskFiltersBar from "@/components/workspace/task/TaskFiltersBar";
import TaskGrid from "@/components/workspace/task/TaskGrid";
import NewTaskButton from "@/components/workspace/task/NewTaskButton";
import CreateTaskDialog from "@/components/workspace/task/create-task-dialog";
import { useAuthContext } from "@/context/auth-provider";

export default function Tasks() {
  const workspaceId = useWorkspaceId();
  const { user } = useAuthContext();
  const [tab, setTab] = useState("all");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["all-tasks", workspaceId, tab],
    queryFn: () => {
      let filters = {};
      if (tab === "mine") {
        filters = { assignedTo: user?._id };
      }
      return getAllTasksQueryFn({ 
        workspaceId: workspaceId!, 
        ...filters 
      });
    },
    enabled: !!workspaceId && !!user,
    staleTime: 0,
  });
  const tasks: TaskType[] = data?.tasks || [];

  // Filtering logic
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (tab === "mine") {
      filtered = filtered.filter(t => t.assignedTo?._id === user?._id);
    } else if (tab === "overdue") {
      filtered = filtered.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE");
    } else if (tab === "done") {
      filtered = filtered.filter(t => t.status === "DONE");
    }
    if (status !== "All") filtered = filtered.filter(t => t.status === status);
    if (priority !== "All") filtered = filtered.filter(t => t.priority === priority);
    if (search.trim()) filtered = filtered.filter(t => t.title.toLowerCase().includes(search.trim().toLowerCase()));
    return filtered;
  }, [tasks, tab, status, priority, search, user]);

  return (
    <div className="relative w-full min-h-screen bg-gray-50 px-2 md:px-8 pt-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Tasks</h2>
            <p className="text-gray-500 text-base">Manage and track all workspace tasks in a beautiful, modern view.</p>
          </div>
        </div>
        <TaskTabs tab={tab} setTab={setTab} />
        <TaskFiltersBar status={status} setStatus={setStatus} priority={priority} setPriority={setPriority} search={search} setSearch={setSearch} />
        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-gray-400 text-lg font-medium">Loading tasks...</div>
        ) : (
          <TaskGrid tasks={filteredTasks} />
        )}
        <NewTaskButton onClick={() => setShowDialog(true)} />
        <CreateTaskDialog open={showDialog} onOpenChange={setShowDialog} />
      </div>
    </div>
  );
}
