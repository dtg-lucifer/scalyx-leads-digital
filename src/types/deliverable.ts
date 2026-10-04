export type DeliverableCategory = 'deliverable_from_us' | 'collectible_from_client';

export interface Deliverable {
  id: string;
  leadId: string;
  leadName?: string;
  title: string;
  description?: string;
  category: DeliverableCategory;
  fileName: string;
  fileSize: number;
  fileUrl?: string;
  storagePath?: string;
  downloadedAt?: string | null;
  downloadCount: number;
  softDeleteAt?: string | null;
  isSoftDeleted: boolean;
  uploadedBy?: string;
  createdAt: string;
  // Computed fields
  daysRemaining?: number | null;
  hoursRemaining?: number | null;
  isExpired?: boolean;
}
