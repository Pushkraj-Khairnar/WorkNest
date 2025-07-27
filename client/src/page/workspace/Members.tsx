import { Separator } from "@/components/ui/separator";
import MembersList from "@/components/workspace/member/MembersList";
import WorkspaceStats from "@/components/workspace/member/WorkspaceStats";
import RoleDistribution from "@/components/workspace/member/RoleDistribution";
import WorkspaceHeader from "@/components/workspace/common/workspace-header";

export default function Members() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-2">
      <WorkspaceHeader />
      <Separator className="my-4" />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Modern Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Team Management
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your workspace members, send invitations, and control access permissions. 
            Keep your team organized and productive.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Workspace Stats & Role Distribution */}
          <div className="xl:col-span-1 space-y-6 order-2 xl:order-1">
            <WorkspaceStats />
            <RoleDistribution />
          </div>

          {/* Right Column - Members List */}
          <div className="xl:col-span-2 order-1 xl:order-2">
            <MembersList />
          </div>
        </div>
      </main>
    </div>
  );
}
