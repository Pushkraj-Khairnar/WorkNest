import { PermissionType, Permissions } from "../enums/role.enum";
import { UnauthorizedException } from "./appError";
import { RolePermissions } from "./role-permission";

export const roleGuard = (
  role: keyof typeof RolePermissions,
  requiredPermissions: PermissionType[]
) => {
  console.log("roleGuard called with role:", role, "requiredPermissions:", requiredPermissions);
  
  const permissions = RolePermissions[role];
  console.log("Found permissions for role:", permissions);
  
  // If the role doesn't exist or permissions are undefined, throw an exception
  if (!permissions || !Array.isArray(permissions)) {
    console.error("Invalid role or permissions:", { role, permissions });
    throw new UnauthorizedException(
      "Invalid role or role permissions not found"
    );
  }

  const hasPermission = requiredPermissions.every((permission) =>
    permissions.includes(permission)
  );

  console.log("Has permission:", hasPermission);

  if (!hasPermission) {
    throw new UnauthorizedException(
      "You do not have the necessary permissions to perform this action"
    );
  }
};
