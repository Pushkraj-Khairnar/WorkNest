import { useQuery } from "@tanstack/react-query";
import { getTaskPermissionsQueryFn } from "@/lib/api";

export const useGetTaskPermissions = ({
  workspaceId,
  taskId,
  enabled = true,
}: {
  workspaceId: string | null;
  taskId: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["task-permissions", workspaceId, taskId],
    queryFn: () => getTaskPermissionsQueryFn({ workspaceId: workspaceId!, taskId }),
    enabled: enabled && !!workspaceId && !!taskId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 