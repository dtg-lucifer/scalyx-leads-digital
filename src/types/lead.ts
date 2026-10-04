export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal Sent'
  | 'Won'
  | 'Lost'
  | 'Completed';

export type LeadSource =
  | 'Website'
  | 'Referral'
  | 'LinkedIn'
  | 'Twitter / X'
  | 'Upwork'
  | 'Fiverr'
  | 'Cold Outreach'
  | 'Personal Network'
  | 'Other';

export interface LeadNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  roleTitle?: string;
  source: LeadSource;
  status: LeadStatus;
  dealValue: number; // In currency
  revenueCollected: number; // Monetary received through this lead
  currency: string;
  notes?: string;
  remarks?: string;
  noteList?: LeadNote[];
  portalAccessCode?: string; // Auto-generated password/access token for client dashboard
  createdAt: string;
  updatedAt: string;
  // Computed relations counts
  documentsCount?: number;
  deliverablesCount?: number;
  projectsCount?: number;
}
