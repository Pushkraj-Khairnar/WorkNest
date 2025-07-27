import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CheckCircle,
  Users,
  Bell,
  Settings,
  LogOut,
  Plus,
  Loader,
  ChevronDown,
  Check,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import LogoutDialog from "./logout-dialog";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useAuthContext } from "@/context/auth-provider";
import { Permissions } from "@/constant";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getAllWorkspacesUserIsMemberQueryFn } from "@/lib/api";
import Logo from "@/components/logo";
import useCreateWorkspaceDialog from "@/hooks/use-create-workspace-dialog";

const ModernSidebar = () => {
  const { isLoading, user, hasPermission } = useAuthContext();
  const workspaceId = useWorkspaceId();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [wsModalOpen, setWsModalOpen] = useState(false);
  const { onOpen: openCreateWorkspace } = useCreateWorkspaceDialog();

  const canManageSettings = hasPermission(Permissions.MANAGE_WORKSPACE_SETTINGS);

  const navigationItems = workspaceId
    ? [
        {
          title: "Dashboard",
          url: `/workspace/${workspaceId}`,
          icon: LayoutDashboard,
        },
        {
          title: "Tasks",
          url: `/workspace/${workspaceId}/tasks`,
          icon: CheckCircle,
        },
        {
          title: "Members",
          url: `/workspace/${workspaceId}/members`,
          icon: Users,
        },
        {
          title: "Invitations",
          url: "/invitations",
          icon: Bell,
        },
        ...(canManageSettings
          ? [
              {
                title: "Settings",
                url: `/workspace/${workspaceId}/settings`,
                icon: Settings,
              },
            ]
          : []),
      ]
    : [];

  // Workspace list for modal
  const { data, isPending } = useQuery({
    queryKey: ["userWorkspaces"],
    queryFn: getAllWorkspacesUserIsMemberQueryFn,
    staleTime: 1,
    refetchOnMount: true,
  });
  const workspaces = data?.workspaces;

  // Find active workspace
  const activeWorkspace = workspaces?.find((ws) => ws._id === workspaceId);

  // Workspace type
  type WorkspaceType = { _id: string; name: string };

  // Workspace switch handler
  const handleWorkspaceSwitch = (ws: WorkspaceType) => {
    setWsModalOpen(false);
    window.location.href = `/workspace/${ws._id}`;
  };


  return (
    <>
      <aside className="fixed left-4 top-4 bottom-4 w-16 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 flex flex-col items-center py-4">
        {/* WorkNest Logo at the top */}
        <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Logo size="h-6 w-6" />
        </div>
        
        {/* Workspace Switcher Button */}
        <button
          className={`w-12 h-12 mb-2 rounded-full flex items-center justify-center transition-all duration-200 ${
            wsModalOpen
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
          title="Switch Workspace"
          onClick={() => setWsModalOpen(true)}
          style={{ outline: wsModalOpen ? "2px solid #6366f1" : undefined }}
        >
          {activeWorkspace ? (
            <span className="font-bold text-lg">
              {activeWorkspace.name?.split(" ")?.[0]?.charAt(0) || "W"}
            </span>
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        {/* Dashboard Button (second button) */}
        {navigationItems.length > 0 && (
          <Link
            to={navigationItems[0].url}
            className={`w-12 h-12 mb-2 rounded-full flex items-center justify-center transition-all duration-200 ${
              location.pathname === navigationItems[0].url
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            title={navigationItems[0].title}
          >
            <LayoutDashboard className="w-5 h-5" />
          </Link>
        )}

        {/* Remaining Navigation Items */}
        <nav className="flex-1 flex flex-col gap-2">
          {navigationItems.slice(1).map((item) => {
            const isActive = location.pathname === item.url;
            const IconComponent = item.icon;
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
                  ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
                `}
                title={item.title}
              >
                <IconComponent className="w-5 h-5" />
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="mt-4">
          {isLoading ? (
            <div className="w-12 h-12 bg-gray-100 rounded-full animate-pulse"></div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-12 h-12 rounded-full p-0 hover:bg-gray-100"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.profilePicture || ""} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                      {user?.name?.split(" ")?.[0]?.charAt(0)}
                      {user?.name?.split(" ")?.[1]?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                sideOffset={12}
                className="w-56 rounded-xl border border-gray-200 shadow-xl"
              >
                <div className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.profilePicture || ""} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs font-semibold">
                        {user?.name?.split(" ")?.[0]?.charAt(0)}
                        {user?.name?.split(" ")?.[1]?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsOpen(true)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg mx-1"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </aside>

      {/* Workspace Selector Modal */}
      <Dialog open={wsModalOpen} onOpenChange={setWsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Switch Workspace</DialogTitle>
            <DialogDescription>
              Select or create a workspace to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {isPending ? (
              <div className="flex items-center justify-center py-4">
                <Loader className="w-5 h-5 animate-spin text-blue-500" />
              </div>
            ) : (
              workspaces?.map((ws) => (
                <button
                  key={ws._id}
                  onClick={() => handleWorkspaceSwitch(ws)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    ws._id === workspaceId
                      ? "bg-indigo-100 text-indigo-700 font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 text-white font-semibold text-sm flex-shrink-0">
                    {ws.name?.split(" ")?.[0]?.charAt(0)}
                  </div>
                  <span className="flex-1 truncate">{ws.name}</span>
                  {ws._id === workspaceId && <Check className="w-4 h-4 text-blue-500" />}
                </button>
              ))
            )}
          </div>
          <div className="pt-4 border-t mt-4 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={openCreateWorkspace}>
              <Plus className="w-4 h-4 mr-1" /> Create Workspace
            </Button>
            {/* Optionally, add a manage button here */}
          </div>
        </DialogContent>
      </Dialog>

      <LogoutDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default ModernSidebar;
