import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatusMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import useWorkspaceId from "@/hooks/use-workspace-id";

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: updateTaskStatusMutationFn,
    onSuccess: (data) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ["all-tasks", workspaceId] });
      toast({ 
        title: "Success", 
        description: data.message, 
        variant: "success" 
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update task status", 
        variant: "destructive" 
      });
    },
  });
}; 