import useWorkspaceId from "@/hooks/use-workspace-id";
import AnalyticsCard from "./common/modern-analytics-card";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaceAnalyticsQueryFn } from "@/lib/api";

const WorkspaceAnalytics = () => {
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: () => getWorkspaceAnalyticsQueryFn(workspaceId!),
    staleTime: 0,
    enabled: !!workspaceId,
  });

  const analytics = data?.analytics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <AnalyticsCard
        isLoading={isPending}
        title="Total Tasks"
        value={analytics?.totalTasks || 0}
        type="total"
      />
      <AnalyticsCard
        isLoading={isPending}
        title="Overdue Tasks"
        value={analytics?.overdueTasks || 0}
        type="overdue"
      />
      <AnalyticsCard
        isLoading={isPending}
        title="Completed Tasks"
        value={analytics?.completedTasks || 0}
        type="completed"
      />
    </div>
  );
};

export default WorkspaceAnalytics;
