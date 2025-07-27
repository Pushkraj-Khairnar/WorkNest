import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "./ui/separator";
import { Link, useLocation } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";
import InvitationNotification from "./notifications/invitation-notification";
import Logo from "./logo";

const Header = () => {
  const location = useLocation();
  const workspaceId = useWorkspaceId();

  const pathname = location.pathname;

  const getPageLabel = (pathname: string) => {
    if (pathname.includes("/project/")) return "Project";
    if (pathname.includes("/settings")) return "Settings";
    if (pathname.includes("/tasks")) return "Tasks";
    if (pathname.includes("/members")) return "Members";
    if (pathname.includes("/invitations")) return "Invitations";
    return null; // Default label
  };

  const pageHeading = getPageLabel(pathname);
  return (
    <header className="flex sticky top-0 z-50 bg-white h-16 shrink-0 items-center border-b border-gray-200 backdrop-blur-sm bg-white/95">
      <div className="flex flex-1 items-center gap-3 px-6">
        {/* WorkNest Logo and Brand */}
        <div className="flex items-center gap-2 mr-4">
          <Logo size="h-7 w-7" />
          <span className="font-bold text-lg text-gray-900 hidden sm:block">WorkNest</span>
        </div>
        <SidebarTrigger className="text-gray-600 hover:bg-gray-100 rounded-lg p-2" />
        <Separator orientation="vertical" className="mr-2 h-5 bg-gray-200" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              {pageHeading && pageHeading !== "Invitations" ? (
                <BreadcrumbLink asChild>
                  <Link 
                    to={`/workspace/${workspaceId}`}
                    className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                  >
                    Dashboard
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="line-clamp-1 text-gray-900 font-medium text-sm">
                  {pageHeading === "Invitations" ? "Invitations" : "Dashboard"}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {pageHeading && pageHeading !== "Invitations" && (
              <>
                <BreadcrumbSeparator className="hidden md:block text-gray-300" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1 text-gray-900 font-medium text-sm">
                    {pageHeading}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="px-6">
        <InvitationNotification />
      </div>
    </header>
  );
};

export default Header;
