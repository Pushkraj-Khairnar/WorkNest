import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import { Loader, Calendar, User, ArrowRight } from "lucide-react";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { format } from "date-fns";

const RecentProjects = () => {
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useGetProjectsInWorkspaceQuery({
    workspaceId,
    pageNumber: 1,
    pageSize: 10,
  });

  const projects = data?.projects || [];

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-slate-600 dark:text-slate-400">Loading projects...</span>
        </div>
      </div>
    );
  }

  if (projects?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
          <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          No projects yet
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
          Get started by creating your first project to organize your team's work and track progress.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          Recent Projects
        </h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {projects.length} project{projects.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => {
          const name = project.createdBy.name;
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);

          return (
            <Link
              key={project._id}
              to={`/workspace/${workspaceId}/project/${project._id}`}
              className="group block"
            >
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-start gap-4">
                  {/* Project Emoji */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                      {project.emoji}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                          {project.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {project.createdAt
                                ? format(project.createdAt, "MMM dd, yyyy")
                                : "No date"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>Created by {name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Creator Avatar */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Created by
                          </p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {name}
                          </p>
                        </div>
                        <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-700 shadow-sm">
                          <AvatarImage
                            src={project.createdBy.profilePicture || ""}
                            alt={name}
                          />
                          <AvatarFallback className={`${avatarColor} text-sm font-medium`}>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecentProjects;
