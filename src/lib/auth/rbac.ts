import { SessionUser, UserPermissions } from '@/types/auth';

export type PermissionResource = keyof UserPermissions;
export type PermissionAction<R extends PermissionResource> = keyof UserPermissions[R];

export function hasPermission<R extends PermissionResource>(
  user: SessionUser | null,
  resource: R,
  action: PermissionAction<R>
): boolean {
  if (!user) return false;
  if (user.role === 'super_admin') return true;

  const resourcePerms = user.permissions[resource];
  if (!resourcePerms) return false;

  return Boolean((resourcePerms as unknown as Record<string, boolean>)[action as string]);
}
