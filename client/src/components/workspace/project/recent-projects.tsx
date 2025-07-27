import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import { Loader, Sparkles, Calendar, User, ArrowRight } from "lucide-react";
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (projects?.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No projects yet</h3>
          <p className="text-gray-500 max-w-md mx-auto text-lg leading-relaxed">
            Ready to build something amazing? Create your first project and start collaborating with your team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <div className="relative bg-white rounded-3xl p-8 border border-gray-100/50 hover:border-gray-200 transition-all duration-300 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1">
              {/* Project emoji - large and prominent */}
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {project.emoji}
              </div>
              
              {/* Project name */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                {project.name}
              </h3>
              
              {/* Meta information */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Created {project.createdAt ? format(project.createdAt, "MMM dd, yyyy") : "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  <span>by {name}</span>
                </div>
              </div>
              
              {/* Creator avatar and arrow */}
              <div className="flex items-center justify-between">
                <Avatar className="h-12 w-12 border-2 border-white shadow-lg group-hover:shadow-xl transition-shadow">
                  <AvatarImage
                    src={project.createdBy.profilePicture || ""}
                    alt={name}
                  />
                  <AvatarFallback className={`${avatarColor} text-white font-bold`}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              
              {/* Hover effect gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/30 rounded-3xl transition-all duration-300 pointer-events-none"></div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default RecentProjects;
