import WorkspaceHeader from "@/components/workspace/common/workspace-header";
import EditWorkspaceForm from "@/components/workspace/edit-workspace-form";
import DeleteWorkspaceCard from "@/components/workspace/settings/delete-workspace-card";
import { Permissions } from "@/constant";
import withPermission from "@/hoc/with-permission";
import { Settings as SettingsIcon, Shield } from "lucide-react";

const Settings = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <WorkspaceHeader />
      
      <main className="pt-8 pb-16">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          {/* Modern Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Workspace Settings
              </h1>
            </div>
            <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Customize your workspace configuration, manage permissions, and control access settings
            </p>
          </div>

          {/* Settings Grid Layout */}
          <div className="grid gap-8 lg:gap-12">
            {/* General Settings Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <SettingsIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-gray-900">General Settings</h2>
                  <p className="text-sm text-gray-600">Basic workspace information and preferences</p>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 
                              hover:shadow-md transition-all duration-300">
                <EditWorkspaceForm />
              </div>
            </section>

            {/* Advanced Settings Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-red-200">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-gray-900">Advanced Settings</h2>
                  <p className="text-sm text-gray-600">Sensitive actions that require elevated permissions</p>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-red-200/50 
                              hover:shadow-md transition-all duration-300">
                <DeleteWorkspaceCard />
              </div>
            </section>
          </div>

          {/* Footer Info */}
          <div className="mt-16 text-center">
            <div className="bg-blue-50/50 border border-blue-200/60 rounded-xl p-6 max-w-2xl mx-auto">
              <p className="text-sm text-blue-800 leading-relaxed">
                <strong className="font-medium">Need help?</strong> Changes to workspace settings may affect 
                all team members. Contact your administrator if you're unsure about any setting.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SettingsWithPermission = withPermission(
  Settings,
  Permissions.MANAGE_WORKSPACE_SETTINGS
);

export default SettingsWithPermission;
