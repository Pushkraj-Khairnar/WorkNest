import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface UseAuthOptions {
  enabled?: boolean;
}

const useAuth = (options: UseAuthOptions = {}) => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 0,
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    enabled: options.enabled !== false, // Default to true if not specified
  });

  // Transform the result to handle 401 errors gracefully
  const transformedQuery = {
    ...query,
    error: (query.error as any)?.response?.status === 401 ? null : query.error,
    isError: (query.error as any)?.response?.status === 401 ? false : query.isError,
  };

  return transformedQuery;
};

export default useAuth;
