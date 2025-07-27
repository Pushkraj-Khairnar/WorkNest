import { useQuery } from "@tanstack/react-query";
import { getUserInvitationsQueryFn } from "@/lib/api";

const useGetUserInvitations = () => {
  return useQuery({
    queryKey: ["userInvitations"],
    queryFn: getUserInvitationsQueryFn,
    refetchInterval: 30000, // Refetch every 30 seconds to check for new invitations
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export default useGetUserInvitations;
