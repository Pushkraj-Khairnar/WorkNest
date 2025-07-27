import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import useGetUserInvitations from "@/hooks/api/use-get-user-invitations";

const InvitationNotification = () => {
  const { data: invitationsData, error } = useGetUserInvitations();
  
  // If there's an error (like 401), don't render anything
  if (error) {
    return null;
  }
  
  const invitationCount = invitationsData?.invitations?.length || 0;

  return (
    <Link to="/invitations">
      <Button variant="ghost" size="sm" className="relative">
        <Bell className="h-4 w-4" />
        {invitationCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
          >
            {invitationCount > 9 ? "9+" : invitationCount}
          </Badge>
        )}
        <span className="sr-only">
          {invitationCount > 0 
            ? `${invitationCount} pending invitation${invitationCount > 1 ? 's' : ''}`
            : 'No pending invitations'
          }
        </span>
      </Button>
    </Link>
  );
};

export default InvitationNotification;
