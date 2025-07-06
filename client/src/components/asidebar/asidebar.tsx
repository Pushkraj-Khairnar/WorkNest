import { useState } from "react";
import { EllipsisIcon, Loader, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/logo";
import LogoutDialog from "./logout-dialog";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { Separator } from "../ui/separator";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useAuthContext } from "@/context/auth-provider";

const Asidebar = () => {
  const { isLoading, user } = useAuthContext();

  const { open } = useSidebar();
  const workspaceId = useWorkspaceId();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Sidebar 
        collapsible="icon"
        className="bg-gradient-to-b from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 border-r border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm"
      >
        {/* Header */}
        <SidebarHeader className="!py-0 dark:bg-transparent border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex h-16 items-center justify-start w-full px-4">
            <Logo url={`/workspace/${workspaceId}`} />
          </div>
        </SidebarHeader>

        {/* Content */}
        <SidebarContent className="!mt-0 dark:bg-transparent">
          <SidebarGroup className="!py-0">
            <SidebarGroupContent className="space-y-4">
              {/* Workspace Switcher */}
              <div className="px-3">
                <WorkspaceSwitcher />
              </div>
              
              <Separator className="bg-slate-200/50 dark:bg-slate-700/50" />
              
              {/* Main Navigation */}
              <div className="px-3">
                <NavMain />
              </div>
              
              <Separator className="bg-slate-200/50 dark:bg-slate-700/50" />
              
              {/* Projects Navigation */}
              <div className="px-3">
                <NavProjects />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer - User Profile */}
        <SidebarFooter className="dark:bg-transparent border-t border-slate-200/50 dark:border-slate-700/50">
          <SidebarMenu>
            <SidebarMenuItem>
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center gap-3">
                    <Loader className="w-5 h-5 animate-spin text-purple-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Loading...</span>
                  </div>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-white/60 dark:data-[state=open]:bg-slate-800/60 data-[state=open]:text-slate-900 dark:data-[state=open]:text-white hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl transition-all duration-200"
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10 rounded-xl border-2 border-white dark:border-slate-700 shadow-sm">
                          <AvatarImage src={user?.profilePicture || ""} />
                          <AvatarFallback className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold border-2 border-white dark:border-slate-700">
                            {user?.name?.split(" ")?.[0]?.charAt(0)}
                            {user?.name?.split(" ")?.[1]?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white dark:border-slate-700"></div>
                      </div>
                      {open && (
                        <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                          <span className="truncate font-semibold text-slate-900 dark:text-white">
                            {user?.name}
                          </span>
                          <span className="truncate text-xs text-slate-600 dark:text-slate-400">
                            {user?.email}
                          </span>
                        </div>
                      )}
                      <EllipsisIcon className="ml-auto size-4 text-slate-400" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl"
                    side={"bottom"}
                    align="start"
                    sideOffset={4}
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <div className="flex items-center gap-3 w-full">
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user?.profilePicture || ""} />
                            <AvatarFallback className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                              {user?.name?.split(" ")?.[0]?.charAt(0)}
                              {user?.name?.split(" ")?.[1]?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-white">{user?.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
                    <DropdownMenuItem 
                      onClick={() => setIsOpen(true)}
                      className="rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <LogoutDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Asidebar;
