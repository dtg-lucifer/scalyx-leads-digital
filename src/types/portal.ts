export interface PortalUpdate {
  id: string;
  portalId: string;
  title: string;
  content: string;
  updateType: 'notice' | 'milestone' | 'announcement' | 'changelog';
  pinned: boolean;
  postedBy?: string;
  createdAt: string;
}

export interface ClientPortal {
  id: string;
  leadId: string;
  leadName: string;
  leadEmail: string;
  company?: string;
  slug: string;
  passwordPlainText?: string; // Generated password sent via Resend
  projectGrowth: number; // 0 to 100%
  statusMessage: string;
  isActive: boolean;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
  updates: PortalUpdate[];
}
