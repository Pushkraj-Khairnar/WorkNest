import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/context/auth-provider";
import { toast } from "@/hooks/use-toast";
import { CheckIcon, CopyIcon, Loader, Link, UserPlus, Shield } from "lucide-react";
import { BASE_ROUTE } from "@/routes/common/routePaths";
import PermissionsGuard from "@/components/resuable/permission-guard";
import { Permissions } from "@/constant";

const InviteMember = () => {
  const { workspace, workspaceLoading } = useAuthContext();
  const [copied, setCopied] = useState(false);

  const inviteUrl = workspace
    ? `${window.location.origin}${BASE_ROUTE.INVITE_URL.replace(
        ":inviteCode",
        workspace.inviteCode
      )}`
    : "";

  const handleCopy = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl).then(() => {
        setCopied(true);
        toast({
          title: "Copied",
          description: "Invite url copied to clipboard",
          variant: "success",
        });
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
          <UserPlus className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            Invite Team Members
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Share the invite link to add new members to your workspace
          </p>
        </div>
      </div>

      {/* Invite Link Section */}
      <PermissionsGuard showMessage requiredPermission={Permissions.ADD_MEMBER}>
        {workspaceLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <Loader className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-slate-600 dark:text-slate-400">Loading invite link...</span>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Link className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  Invite Link
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Anyone with this link can join your workspace
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="invite-link" className="sr-only">
                  Invite Link
                </Label>
                <Input
                  id="invite-link"
                  disabled={true}
                  className="h-12 pl-4 pr-20 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl disabled:opacity-100 disabled:pointer-events-none font-mono text-sm"
                  value={inviteUrl}
                  readOnly
                />
                <Button
                  disabled={false}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200"
                  size="icon"
                  onClick={handleCopy}
                >
                  {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Shield className="w-4 h-4" />
                <span>Link is active and secure</span>
              </div>
            </div>
          </div>
        )}
      </PermissionsGuard>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
        <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
          How it works
        </h4>
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Share the invite link with anyone you want to add to your workspace</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>They'll be able to join and access all workspace projects and tasks</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>You can manage their roles and permissions after they join</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMember;
