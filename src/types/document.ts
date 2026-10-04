export interface FolderItem {
  id: string;
  name: string;
  leadId?: string;
  leadName?: string;
  parentId?: string | null;
  createdBy?: string;
  shareToken?: string;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
  // Sub-items count
  subfoldersCount?: number;
  filesCount?: number;
}

export interface FileItem {
  id: string;
  name: string;
  folderId?: string | null;
  leadId?: string;
  leadName?: string;
  size: number; // in bytes
  mimeType?: string;
  storagePath: string;
  publicUrl?: string;
  shareToken?: string;
  isShared: boolean;
  uploadedBy?: string;
  createdAt: string;
}

export interface BreadcrumbItem {
  id: string | null;
  name: string;
}

export interface PublicSharedResource {
  type: 'folder' | 'file';
  token: string;
  item: FolderItem | FileItem;
  ancestors?: { id: string; name: string }[];
  subfolders?: FolderItem[];
  files?: FileItem[];
}
