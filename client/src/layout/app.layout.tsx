import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/context/auth-provider";
import ModernSidebar from "@/components/asidebar/modern-sidebar";
import CreateWorkspaceDialog from "@/components/workspace/create-workspace-dialog";
import CreateProjectDialog from "@/components/workspace/project/create-project-dialog";

const AppLayout = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <ModernSidebar />
        <div className="ml-24">
          <Outlet />
        </div>
        <CreateWorkspaceDialog />
        <CreateProjectDialog />
      </div>
    </AuthProvider>
  );
};

export default AppLayout;
