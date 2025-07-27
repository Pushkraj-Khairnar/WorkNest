import { useParams } from "react-router-dom";

const useWorkspaceId = () => {
  const params = useParams();
  return params.workspaceId || null;
};

export default useWorkspaceId;
