import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CheckCircle, 
  Users, 
  Bell, 
  Settings, 
  LogOut, 
  Loader,
  FolderOpen
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/logo";
import LogoutDialog from "./logout-dialog";
import { WorkspaceSwitcher } from "./workspace-switcher";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useAuthContext } from "@/context/auth-provider";
import { Permissions } from "@/constant";
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";

const Asidebar = () => {
  const { isLoading, user, hasPermission } = useAuthContext();
  const workspaceId = useWorkspaceId();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const canManageSettings = hasPermission(Permissions.MANAGE_WORKSPACE_SETTINGS);

  const { data: projectsData } = useGetProjectsInWorkspaceQuery({
    workspaceId,
    pageNumber: 1,
    pageSize: 5,
  });

  const projects = projectsData?.projects || [];

  const navItems = workspaceId ? [
    {
      title: "Dashboard",
      url: `/workspace/${workspaceId}`,
      icon: LayoutDashboard,
      color: "bg-blue-500",
    },
    {
      title: "Tasks",
      url: `/workspace/${workspaceId}/tasks`,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Members",
      url: `/workspace/${workspaceId}/members`,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Invitations",
      url: "/invitations",
      icon: Bell,
      color: "bg-orange-500",
    },
    ...(canManageSettings
      ? [
          {
            title: "Settings",
            url: `/workspace/${workspaceId}/settings`,
            icon: Settings,
            color: "bg-gray-500",
          },
        ]
      : []),
  ] : [];

  return (
    <>
      {/* Ultra-minimal floating sidebar */}
      <div 
        className={`fixed left-4 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ease-out ${
          isHovered ? 'w-80' : 'w-16'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 border border-white/20 overflow-hidden">
          
          {/* Logo section */}
          <div className="p-4 border-b border-gray-100/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Logo />
              </div>
              {isHovered && (
                <div className="overflow-hidden">
                  <h2 className="font-bold text-lg text-gray-900 truncate animate-in slide-in-from-left-5 duration-200">
                    WorkNest
                  </h2>
                </div>
              )}
            </div>
          </div>

          {/* Workspace switcher - always visible */}
          <div className="p-4 border-b border-gray-100/50 animate-in slide-in-from-left-5 duration-300">
            <WorkspaceSwitcher />
          </div>

          {/* Navigation */}
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.url;
              const IconComponent = item.icon;
              
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isActive ? 'bg-blue-500 text-white shadow-lg scale-110' : `${item.color} text-white opacity-80 group-hover:opacity-100`
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  {isHovered && (
                    <span className="font-medium truncate animate-in slide-in-from-left-5 duration-200">
                      {item.title}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Projects section */}
          {isHovered && projects.length > 0 && (
            <div className="p-4 border-t border-gray-100/50 animate-in slide-in-from-left-5 duration-400">
              <div className="flex items-center gap-2 mb-3">
                <FolderOpen className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">Recent Projects</span>
                <Badge variant="secondary" className="text-xs">
                  {projects.length}
                </Badge>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {projects.slice(0, 3).map((project) => (
                  <Link
                    key={project._id}
                    to={`/workspace/${workspaceId}/project/${project._id}`}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-lg">{project.emoji}</span>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 truncate">
                      {project.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* User section */}
          <div className="p-4 border-t border-gray-100/50">
            {isLoading ? (
              <div className="flex items-center justify-center p-2">
                <Loader className="w-5 h-5 animate-spin text-blue-500" />
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 w-full p-2 rounded-2xl hover:bg-gray-50 transition-colors group">
                    <Avatar className="w-8 h-8 border-2 border-white shadow-md">
                      <AvatarImage src={user?.profilePicture || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                        {user?.name?.split(" ")?.[0]?.charAt(0)}
                        {user?.name?.split(" ")?.[1]?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {isHovered && (
                      <div className="flex-1 text-left overflow-hidden animate-in slide-in-from-left-5 duration-200">
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {user?.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </div>
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 rounded-2xl border border-gray-200 shadow-xl bg-white/95 backdrop-blur-sm"
                  side="right"
                  align="end"
                  sideOffset={8}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                        <AvatarImage src={user?.profilePicture || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                          {user?.name?.split(" ")?.[0]?.charAt(0)}
                          {user?.name?.split(" ")?.[1]?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900">{user?.name}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setIsOpen(true)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl m-2 p-3"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      <LogoutDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Asidebar;
