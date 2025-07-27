import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import { Loader, FolderPlus, Calendar } from "lucide-react";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { format } from "date-fns";

const RecentProjects = () => {
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useGetProjectsInWorkspaceQuery({
    workspaceId,
    pageNumber: 1,
    pageSize: 5,
  });

  const projects = data?.projects || [];

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (projects?.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
            <FolderPlus className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">No projects yet</h3>
          <p className="text-sm text-gray-500">
            Create your first project to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.slice(0, 3).map((project) => {
        const name = project.createdBy.name;
        const initials = getAvatarFallbackText(name);
        const avatarColor = getAvatarColor(name);

        return (
          <Link
            key={project._id}
            to={`/workspace/${workspaceId}/project/${project._id}`}
            className="block group"
          >
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="text-lg">{project.emoji}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                  {project.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {project.createdAt ? format(project.createdAt, "MMM dd") : "—"}
                  </span>
                </div>
              </div>
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={project.createdBy.profilePicture || ""}
                  alt={name}
                />
                <AvatarFallback className={`${avatarColor} text-white text-xs font-medium`}>
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default RecentProjects;
