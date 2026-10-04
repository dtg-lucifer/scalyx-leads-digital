export type UserRole = 'super_admin' | 'teammate' | 'viewer';

export interface UserPermissions {
  leads: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    export: boolean;
  };
  documents: {
    view: boolean;
    upload: boolean;
    share: boolean;
    delete: boolean;
  };
  deliverables: {
    view: boolean;
    upload: boolean;
    download: boolean;
    delete: boolean;
  };
  projects: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  invoices: {
    view: boolean;
    generate: boolean;
  };
  emails: {
    view: boolean;
    send: boolean;
  };
  settings: {
    view: boolean;
    manageUsers: boolean;
    manageRbac: boolean;
    manageRetention: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: UserPermissions;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: UserPermissions;
}

export const DEFAULT_SUPER_ADMIN_PERMISSIONS: UserPermissions = {
  leads: { view: true, create: true, edit: true, delete: true, export: true },
  documents: { view: true, upload: true, share: true, delete: true },
  deliverables: { view: true, upload: true, download: true, delete: true },
  projects: { view: true, create: true, edit: true, delete: true },
  invoices: { view: true, generate: true },
  emails: { view: true, send: true },
  settings: { view: true, manageUsers: true, manageRbac: true, manageRetention: true },
};

export const DEFAULT_TEAMMATE_PERMISSIONS: UserPermissions = {
  leads: { view: true, create: true, edit: true, delete: false, export: true },
  documents: { view: true, upload: true, share: true, delete: false },
  deliverables: { view: true, upload: true, download: true, delete: false },
  projects: { view: true, create: true, edit: true, delete: false },
  invoices: { view: true, generate: true },
  emails: { view: true, send: true },
  settings: { view: false, manageUsers: false, manageRbac: false, manageRetention: false },
};

export const DEFAULT_VIEWER_PERMISSIONS: UserPermissions = {
  leads: { view: true, create: false, edit: false, delete: false, export: false },
  documents: { view: true, upload: false, share: false, delete: false },
  deliverables: { view: true, upload: false, download: true, delete: false },
  projects: { view: true, create: false, edit: false, delete: false },
  invoices: { view: true, generate: false },
  emails: { view: false, send: false },
  settings: { view: false, manageUsers: false, manageRbac: false, manageRetention: false },
};
