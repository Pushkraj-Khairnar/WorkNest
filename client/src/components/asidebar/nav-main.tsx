"use client";

import {
  LucideIcon,
  Settings,
  Users,
  CheckCircle,
  LayoutDashboard,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useAuthContext } from "@/context/auth-provider";
import { Permissions } from "@/constant";

type ItemType = {
  title: string;
  url: string;
  icon: LucideIcon;
  description?: string;
  gradient?: string;
};

export function NavMain() {
  const { hasPermission } = useAuthContext();

  const canManageSettings = hasPermission(
    Permissions.MANAGE_WORKSPACE_SETTINGS
  );

  const workspaceId = useWorkspaceId();
  const location = useLocation();

  const pathname = location.pathname;

  const items: ItemType[] = [
    {
      title: "Dashboard",
      url: `/workspace/${workspaceId}`,
      icon: LayoutDashboard,
      description: "Overview & analytics",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Tasks",
      url: `/workspace/${workspaceId}/tasks`,
      icon: CheckCircle,
      description: "Manage tasks & projects",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Members",
      url: `/workspace/${workspaceId}/members`,
      icon: Users,
      description: "Team management",
      gradient: "from-purple-500 to-pink-500",
    },
    ...(canManageSettings
      ? [
          {
            title: "Settings",
            url: `/workspace/${workspaceId}/settings`,
            icon: Settings,
            description: "Workspace configuration",
            gradient: "from-slate-500 to-gray-500",
          },
        ]
      : []),
  ];

  return (
    <SidebarGroup>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Navigation
        </h3>
      </div>
      <SidebarMenu className="space-y-1">
        {items.map((item) => {
          const isActive = item.url === pathname;
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                isActive={isActive} 
                asChild
                className={`group relative overflow-hidden transition-all duration-200 min-h-[56px] py-2 px-2 flex items-start gap-3 ${
                  isActive 
                    ? 'bg-white/80 dark:bg-slate-800/80 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50' 
                    : 'hover:bg-white/40 dark:hover:bg-slate-800/40'
                } rounded-xl`}
              >
                <Link to={item.url} className="flex items-start gap-3 w-full">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient} shadow-sm group-hover:shadow-md transition-all duration-200 flex-shrink-0`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className={`font-medium leading-tight ${
                      isActive 
                        ? 'text-slate-900 dark:text-white' 
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {item.title}
                    </span>
                    {item.description && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight truncate">
                        {item.description}
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
