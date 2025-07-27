import { Outlet, Link } from "react-router-dom";
import useAuth from "@/hooks/api/use-auth";
import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/logo";

const SimpleAppLayout = () => {
  const { data: authData, isLoading } = useAuth();
  const user = authData?.user;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* WorkNest Logo and Brand */}
            <Link to="/" className="flex items-center gap-2 font-medium">
              <Logo size="h-7 w-7" />
              <span className="font-bold text-lg text-gray-900">WorkNest</span>
            </Link>
            <Link to={`/workspace/${user.currentWorkspace._id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Workspace
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Invitations</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.name}
            </span>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default SimpleAppLayout;
