import { getMembersInWorkspaceQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetWorkspaceMembers = (workspaceId: string | null) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => getMembersInWorkspaceQueryFn(workspaceId!),
    staleTime: Infinity,
    enabled: !!workspaceId,
  });
  return query;
};

export default useGetWorkspaceMembers;
