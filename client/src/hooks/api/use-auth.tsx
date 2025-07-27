import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useAuth = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 0,
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (Unauthorized) or 403 (Forbidden) errors
      if (error?.response?.status === 401 || 
          error?.response?.status === 403 || 
          error?.errorCode === 'UNAUTHORIZED') {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
  });
  return query;
};

export default useAuth;
