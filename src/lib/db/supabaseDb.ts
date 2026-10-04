import { supabaseAdmin } from '@/lib/supabase/admin';
import { User, UserRole, DEFAULT_SUPER_ADMIN_PERMISSIONS } from '@/types/auth';
import { Lead } from '@/types/lead';
import { FolderItem, FileItem, PublicSharedResource } from '@/types/document';
import { ClientPortal, PortalUpdate } from '@/types/portal';
import { Deliverable } from '@/types/deliverable';
import { Project } from '@/types/project';
import { EmailLog } from '@/types/email';
import { hashPassword } from '@/lib/auth/password';

// ============================================================================
// Transformers: Supabase snake_case <-> Application camelCase
// ============================================================================

function mapUserFromDb(row: any): User & { passwordHash: string } {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    name: row.name,
    role: row.role,
    permissions: row.permissions || {},
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapLeadFromDb(row: any): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    company: row.company || '',
    roleTitle: row.role_title || '',
    source: row.source || 'Website',
    status: row.status || 'New',
    dealValue: Number(row.deal_value) || 0,
    revenueCollected: Number(row.revenue_collected) || 0,
    currency: row.currency || 'INR',
    notes: row.notes || '',
    remarks: row.remarks || '',
    portalAccessCode: row.portal_access_code || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapFolderFromDb(row: any, leadsMap?: Map<string, string>): FolderItem {
  return {
    id: row.id,
    name: row.name,
    parentId: row.parent_id || null,
    leadId: row.lead_id || undefined,
    leadName: row.lead_id && leadsMap ? leadsMap.get(row.lead_id) : undefined,
    shareToken: row.share_token || undefined,
    isShared: !!row.is_shared,
    createdBy: row.created_by || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapFileFromDb(row: any, leadsMap?: Map<string, string>): FileItem {
  return {
    id: row.id,
    folderId: row.folder_id || null,
    leadId: row.lead_id || undefined,
    leadName: row.lead_id && leadsMap ? leadsMap.get(row.lead_id) : undefined,
    name: row.name,
    size: Number(row.size) || 0,
    mimeType: row.mime_type || 'application/octet-stream',
    storagePath: row.storage_path,
    publicUrl: row.public_url || undefined,
    shareToken: row.share_token || undefined,
    isShared: !!row.is_shared,
    uploadedBy: row.uploaded_by || undefined,
    createdAt: row.created_at,
  };
}

function mapPortalFromDb(row: any, updates: any[] = [], lead?: any): ClientPortal & { passwordHash: string } {
  return {
    id: row.id,
    leadId: row.lead_id,
    leadName: lead?.name || row.lead_name || 'Client',
    leadEmail: lead?.email || row.lead_email || 'client@example.com',
    company: lead?.company || row.company || undefined,
    slug: row.slug,
    passwordHash: row.password_hash,
    projectGrowth: row.project_growth || 0,
    statusMessage: row.status_message || '',
    isActive: row.is_active !== false,
    lastAccessedAt: row.last_accessed_at,
    updates: updates.map((u) => ({
      id: u.id,
      portalId: u.portal_id,
      title: u.title,
      content: u.content,
      updateType: u.update_type || 'notice',
      pinned: !!u.pinned,
      postedBy: u.posted_by,
      createdAt: u.created_at,
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDeliverableFromDb(row: any, leadsMap?: Map<string, string>): Deliverable {
  let daysRemaining: number | null = null;
  let hoursRemaining: number | null = null;
  let isExpired = false;

  if (row.soft_delete_at) {
    const diffMs = new Date(row.soft_delete_at).getTime() - Date.now();
    if (diffMs <= 0) {
      isExpired = true;
      daysRemaining = 0;
      hoursRemaining = 0;
    } else {
      const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
      hoursRemaining = totalHours;
      daysRemaining = Math.floor(totalHours / 24);
    }
  }

  return {
    id: row.id,
    leadId: row.lead_id,
    leadName: row.lead_id && leadsMap ? leadsMap.get(row.lead_id) : undefined,
    title: row.title,
    description: row.description || '',
    category: row.category,
    fileUrl: row.file_url || '',
    storagePath: row.storage_path || '',
    fileName: row.file_name,
    fileSize: Number(row.file_size) || 0,
    downloadedAt: row.downloaded_at,
    downloadCount: Number(row.download_count) || 0,
    softDeleteAt: row.soft_delete_at,
    isSoftDeleted: !!row.is_soft_deleted || isExpired,
    uploadedBy: row.uploaded_by,
    createdAt: row.created_at,
    daysRemaining,
    hoursRemaining,
    isExpired,
  };
}

function mapProjectFromDb(row: any, leadsMap?: Map<string, string>): Project {
  return {
    id: row.id,
    leadId: row.lead_id || undefined,
    leadName: row.lead_id && leadsMap ? leadsMap.get(row.lead_id) : undefined,
    title: row.title,
    description: row.description || '',
    status: row.status || 'In Progress',
    budget: Number(row.budget) || 0,
    currency: row.currency || 'INR',
    kanbanUrl: row.kanban_url || undefined,
    startDate: row.start_date || undefined,
    targetDate: row.target_date || undefined,
    assignedTeammates: row.assigned_teammates || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Helper to get lead ID to name lookup map
async function getLeadsNameMap(): Promise<Map<string, string>> {
  const { data } = await supabaseAdmin.from('leads').select('id, name');
  const map = new Map<string, string>();
  if (data) {
    data.forEach((l) => map.set(l.id, l.name));
  }
  return map;
}

// ============================================================================
// Supabase Database Service
// ============================================================================

export const supabaseDb = {
  // Settings & Retention
  async getSettings(): Promise<Record<string, any>> {
    const { data } = await supabaseAdmin.from('settings').select('*');
    const settings: Record<string, any> = {
      retentionDays: Number(process.env.RETENTION_DAYS) || 3,
    };
    if (data) {
      data.forEach((row) => {
        settings[row.key] = row.value;
      });
    }
    return settings;
  },

  async updateSetting(key: string, value: any): Promise<void> {
    await supabaseAdmin
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  },

  async getRetentionDays(): Promise<number> {
    const { data } = await supabaseAdmin.from('settings').select('value').eq('key', 'retentionDays').single();
    if (data && typeof data.value === 'number') return data.value;
    return Number(process.env.RETENTION_DAYS) || 3;
  },

  async setRetentionDays(days: number): Promise<void> {
    await this.updateSetting('retentionDays', days);
  },

  // Users
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabaseAdmin.from('users').select('*').order('created_at', { ascending: true });
    if (error || !data) return [];
    return data.map((u) => {
      const mapped = mapUserFromDb(u);
      const { passwordHash, ...userWithoutPassword } = mapped;
      return userWithoutPassword;
    });
  },

  async getUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .ilike('email', email)
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return mapUserFromDb(data);
  },

  async getUserById(id: string): Promise<(User & { passwordHash: string }) | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return mapUserFromDb(data);
  },

  async createUser(data: {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
    permissions?: User['permissions'];
  }): Promise<User> {
    const now = new Date().toISOString();
    const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const passwordHash = await hashPassword(data.password);
    const role = data.role || 'teammate';
    const permissions = data.permissions || (role === 'super_admin' ? DEFAULT_SUPER_ADMIN_PERMISSIONS : {});

    const { data: inserted, error } = await supabaseAdmin
      .from('users')
      .insert({
        id,
        email: data.email.toLowerCase(),
        password_hash: passwordHash,
        name: data.name,
        role,
        permissions,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    const mapped = mapUserFromDb(inserted);
    const { passwordHash: _, ...user } = mapped;
    return user;
  },

  async updateUserPermissions(userId: string, permissions: User['permissions']): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ permissions, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error || !data) return null;
    const mapped = mapUserFromDb(data);
    const { passwordHash: _, ...user } = mapped;
    return user;
  },

  async deleteUser(userId: string): Promise<boolean> {
    const { error } = await supabaseAdmin.from('users').delete().eq('id', userId);
    return !error;
  },

  // Leads
  async getLeads(): Promise<Lead[]> {
    const { data, error } = await supabaseAdmin.from('leads').select('*').order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(mapLeadFromDb);
  },

  async getLeadById(id: string): Promise<Lead | null> {
    const { data, error } = await supabaseAdmin.from('leads').select('*').eq('id', id).maybeSingle();
    if (error || !data) return null;
    return mapLeadFromDb(data);
  },

  async createLead(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    const now = new Date().toISOString();
    const id = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const portalAccessCode = data.portalAccessCode || `tc-${Math.random().toString(36).substring(2, 8)}`;

    const { data: inserted, error } = await supabaseAdmin
      .from('leads')
      .insert({
        id,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        role_title: data.roleTitle || null,
        source: data.source || 'Website',
        status: data.status || 'New',
        deal_value: data.dealValue || 0,
        revenue_collected: data.revenueCollected || 0,
        currency: data.currency || 'INR',
        notes: data.notes || null,
        remarks: data.remarks || null,
        portal_access_code: portalAccessCode,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Auto-create client portal
    const portalPasswordHash = await hashPassword(portalAccessCode);
    await supabaseAdmin.from('client_portals').insert({
      id: `portal-${id}`,
      lead_id: id,
      slug: portalAccessCode,
      password_hash: portalPasswordHash,
      project_growth: 15,
      status_message: 'Project onboarding initialized. Welcome to your client portal!',
      is_active: true,
      created_at: now,
      updated_at: now,
    });

    // Auto-create client folder
    await supabaseAdmin.from('folders').insert({
      id: `folder-client-${id}`,
      name: `${data.company || data.name} (${data.name})`,
      lead_id: id,
      is_shared: true,
      share_token: `share-${portalAccessCode}`,
      created_at: now,
      updated_at: now,
    });

    return mapLeadFromDb(inserted);
  },

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
    const dbPayload: any = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) dbPayload.name = updates.name;
    if (updates.email !== undefined) dbPayload.email = updates.email;
    if (updates.phone !== undefined) dbPayload.phone = updates.phone;
    if (updates.company !== undefined) dbPayload.company = updates.company;
    if (updates.roleTitle !== undefined) dbPayload.role_title = updates.roleTitle;
    if (updates.source !== undefined) dbPayload.source = updates.source;
    if (updates.status !== undefined) dbPayload.status = updates.status;
    if (updates.dealValue !== undefined) dbPayload.deal_value = updates.dealValue;
    if (updates.revenueCollected !== undefined) dbPayload.revenue_collected = updates.revenueCollected;
    if (updates.currency !== undefined) dbPayload.currency = updates.currency;
    if (updates.notes !== undefined) dbPayload.notes = updates.notes;
    if (updates.remarks !== undefined) dbPayload.remarks = updates.remarks;
    if (updates.portalAccessCode !== undefined) dbPayload.portal_access_code = updates.portalAccessCode;

    const { data, error } = await supabaseAdmin
      .from('leads')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error || !data) return null;
    return mapLeadFromDb(data);
  },

  async deleteLead(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin.from('leads').delete().eq('id', id);
    return !error;
  },

  // Folders & Files
  async getFolders(parentId?: string | null): Promise<FolderItem[]> {
    let query = supabaseAdmin.from('folders').select('*').order('name', { ascending: true });
    if (parentId !== undefined) {
      if (parentId === null) {
        query = query.is('parent_id', null);
      } else {
        query = query.eq('parent_id', parentId);
      }
    }
    const { data, error } = await query;
    if (error || !data) return [];
    const leadsMap = await getLeadsNameMap();
    return data.map((f) => mapFolderFromDb(f, leadsMap));
  },

  async getFiles(folderId?: string | null): Promise<FileItem[]> {
    let query = supabaseAdmin.from('files').select('*').order('created_at', { ascending: false });
    if (folderId !== undefined) {
      if (folderId === null) {
        query = query.is('folder_id', null);
      } else {
        query = query.eq('folder_id', folderId);
      }
    }
    const { data, error } = await query;
    if (error || !data) return [];
    const leadsMap = await getLeadsNameMap();
    return data.map((f) => mapFileFromDb(f, leadsMap));
  },

  async getFileById(id: string): Promise<FileItem | null> {
    const { data, error } = await supabaseAdmin.from('files').select('*').eq('id', id).maybeSingle();
    if (error || !data) return null;
    const leadsMap = await getLeadsNameMap();
    return mapFileFromDb(data, leadsMap);
  },

  async createFolder(data: {
    name: string;
    parentId?: string | null;
    leadId?: string;
    createdBy?: string;
  }): Promise<FolderItem> {
    const now = new Date().toISOString();
    const id = `folder-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const shareToken = `share-folder-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // Defensively verify created_by matches an existing user ID to avoid FK violations
    let validUserId: string | null = null;
    if (data.createdBy) {
      const { data: u } = await supabaseAdmin.from('users').select('id').eq('id', data.createdBy).maybeSingle();
      if (u) validUserId = u.id;
    }

    const { data: inserted, error } = await supabaseAdmin
      .from('folders')
      .insert({
        id,
        name: data.name,
        parent_id: data.parentId || null,
        lead_id: data.leadId || null,
        created_by: validUserId,
        share_token: shareToken,
        is_shared: false,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    const leadsMap = await getLeadsNameMap();
    return mapFolderFromDb(inserted, leadsMap);
  },

  async createFile(data: Omit<FileItem, 'id' | 'createdAt'>): Promise<FileItem> {
    const now = new Date().toISOString();
    const id = `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const shareToken = `share-file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // Defensively verify uploaded_by matches an existing user ID to avoid FK violations
    let validUserId: string | null = null;
    if (data.uploadedBy) {
      const { data: u } = await supabaseAdmin.from('users').select('id').eq('id', data.uploadedBy).maybeSingle();
      if (u) validUserId = u.id;
    }

    const { data: inserted, error } = await supabaseAdmin
      .from('files')
      .insert({
        id,
        folder_id: data.folderId || null,
        lead_id: data.leadId || null,
        name: data.name,
        size: data.size || 0,
        mime_type: data.mimeType || 'application/octet-stream',
        storage_path: data.storagePath,
        public_url: data.publicUrl || null,
        share_token: shareToken,
        is_shared: !!data.isShared,
        uploaded_by: validUserId,
        created_at: now,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    const leadsMap = await getLeadsNameMap();
    return mapFileFromDb(inserted, leadsMap);
  },

  async deleteFolder(folderId: string): Promise<boolean> {
    const { error } = await supabaseAdmin.from('folders').delete().eq('id', folderId);
    return !error;
  },

  async deleteFile(fileId: string): Promise<boolean> {
    const { error } = await supabaseAdmin.from('files').delete().eq('id', fileId);
    return !error;
  },

  async shareFolder(folderId: string, isShared: boolean): Promise<FolderItem | null> {
    const { data, error } = await supabaseAdmin
      .from('folders')
      .update({ is_shared: isShared, updated_at: new Date().toISOString() })
      .eq('id', folderId)
      .select()
      .maybeSingle();

    if (error || !data) return null;
    const leadsMap = await getLeadsNameMap();
    return mapFolderFromDb(data, leadsMap);
  },

  async shareFile(fileId: string, isShared: boolean): Promise<FileItem | null> {
    const { data, error } = await supabaseAdmin
      .from('files')
      .update({ is_shared: isShared })
      .eq('id', fileId)
      .select()
      .maybeSingle();

    if (error || !data) return null;
    const leadsMap = await getLeadsNameMap();
    return mapFileFromDb(data, leadsMap);
  },

  async getSharedResourceByToken(token: string): Promise<PublicSharedResource | null> {
    // 1. Check folders
    const { data: folder } = await supabaseAdmin
      .from('folders')
      .select('*')
      .eq('share_token', token)
      .eq('is_shared', true)
      .maybeSingle();

    if (folder) {
      const leadsMap = await getLeadsNameMap();
      const mappedFolder = mapFolderFromDb(folder, leadsMap);

      // Recursively fetch all children folders & files
      const { data: allFolders } = await supabaseAdmin.from('folders').select('*');
      const { data: allFiles } = await supabaseAdmin.from('files').select('*');

      const folderIds = new Set<string>([folder.id]);
      let added = true;
      while (added) {
        added = false;
        if (allFolders) {
          allFolders.forEach((f) => {
            if (f.parent_id && folderIds.has(f.parent_id) && !folderIds.has(f.id)) {
              folderIds.add(f.id);
              added = true;
            }
          });
        }
      }

      const recursiveFolders = (allFolders || [])
        .filter((f) => folderIds.has(f.id))
        .map((f) => mapFolderFromDb(f, leadsMap));
      const recursiveFiles = (allFiles || [])
        .filter((f) => f.folder_id && folderIds.has(f.folder_id))
        .map((f) => mapFileFromDb(f, leadsMap));

      return {
        type: 'folder',
        token,
        item: mappedFolder,
        subfolders: recursiveFolders,
        files: recursiveFiles,
      };
    }

    // 2. Check files
    const { data: file } = await supabaseAdmin
      .from('files')
      .select('*')
      .eq('share_token', token)
      .eq('is_shared', true)
      .maybeSingle();

    if (file) {
      const leadsMap = await getLeadsNameMap();
      return {
        type: 'file',
        token,
        item: mapFileFromDb(file, leadsMap),
      };
    }

    return null;
  },

  // Portals
  async getPortals(): Promise<ClientPortal[]> {
    const { data: portals } = await supabaseAdmin.from('client_portals').select('*');
    if (!portals) return [];
    const { data: updates } = await supabaseAdmin.from('portal_updates').select('*');
    const updatesByPortal = new Map<string, any[]>();
    (updates || []).forEach((u) => {
      const list = updatesByPortal.get(u.portal_id) || [];
      list.push(u);
      updatesByPortal.set(u.portal_id, list);
    });

    return portals.map((p) => {
      const mapped = mapPortalFromDb(p, updatesByPortal.get(p.id) || []);
      const { passwordHash: _, ...portal } = mapped;
      return portal;
    });
  },

  async getPortalBySlug(slug: string): Promise<(ClientPortal & { passwordHash: string }) | null> {
    let { data: portal } = await supabaseAdmin
      .from('client_portals')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (!portal) {
      const { data: pById } = await supabaseAdmin
        .from('client_portals')
        .select('*')
        .eq('id', slug)
        .maybeSingle();
      if (pById) portal = pById;
    }

    if (!portal) {
      const { data: lead } = await supabaseAdmin
        .from('leads')
        .select('id')
        .or(`id.eq.${slug},portal_access_code.eq.${slug}`)
        .maybeSingle();
      if (lead) {
        const { data: pByLead } = await supabaseAdmin
          .from('client_portals')
          .select('*')
          .eq('lead_id', lead.id)
          .maybeSingle();
        if (pByLead) portal = pByLead;
      }
    }

    if (!portal) return null;

    const { data: updates } = await supabaseAdmin
      .from('portal_updates')
      .select('*')
      .eq('portal_id', portal.id)
      .order('created_at', { ascending: false });

    const { data: leadData } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', portal.lead_id)
      .maybeSingle();

    return mapPortalFromDb(portal, updates || [], leadData);
  },

  async getPortalByLeadId(leadId: string): Promise<(ClientPortal & { passwordHash: string }) | null> {
    const { data: portal, error } = await supabaseAdmin
      .from('client_portals')
      .select('*')
      .eq('lead_id', leadId)
      .maybeSingle();

    if (error || !portal) return null;
    const { data: updates } = await supabaseAdmin
      .from('portal_updates')
      .select('*')
      .eq('portal_id', portal.id)
      .order('created_at', { ascending: false });

    const { data: leadData } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .maybeSingle();

    return mapPortalFromDb(portal, updates || [], leadData);
  },

  async updatePortal(portalId: string, updates: Partial<ClientPortal>): Promise<ClientPortal | null> {
    const dbPayload: any = { updated_at: new Date().toISOString() };
    if (updates.projectGrowth !== undefined) dbPayload.project_growth = updates.projectGrowth;
    if (updates.statusMessage !== undefined) dbPayload.status_message = updates.statusMessage;
    if (updates.isActive !== undefined) dbPayload.is_active = updates.isActive;

    const { data, error } = await supabaseAdmin
      .from('client_portals')
      .update(dbPayload)
      .eq('id', portalId)
      .select()
      .maybeSingle();

    if (error || !data) return null;
    const { data: portalUpdates } = await supabaseAdmin
      .from('portal_updates')
      .select('*')
      .eq('portal_id', portalId);

    const mapped = mapPortalFromDb(data, portalUpdates || []);
    const { passwordHash: _, ...portal } = mapped;
    return portal;
  },

  async addPortalUpdate(
    portalId: string,
    update: Omit<PortalUpdate, 'id' | 'portalId' | 'createdAt'>
  ): Promise<PortalUpdate> {
    const id = `update-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('portal_updates')
      .insert({
        id,
        portal_id: portalId,
        title: update.title,
        content: update.content,
        update_type: update.updateType || 'notice',
        pinned: !!update.pinned,
        posted_by: update.postedBy || null,
        created_at: now,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      portalId: data.portal_id,
      title: data.title,
      content: data.content,
      updateType: data.update_type,
      pinned: data.pinned,
      postedBy: data.posted_by,
      createdAt: data.created_at,
    };
  },

  async deletePortalUpdate(portalId: string, updateId: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('portal_updates')
      .delete()
      .eq('id', updateId)
      .eq('portal_id', portalId);
    return !error;
  },

  // Deliverables
  async getDeliverables(leadId?: string): Promise<Deliverable[]> {
    let query = supabaseAdmin.from('deliverables').select('*').order('created_at', { ascending: false });
    if (leadId) {
      query = query.eq('lead_id', leadId);
    }
    const { data, error } = await query;
    if (error || !data) return [];
    const leadsMap = await getLeadsNameMap();
    return data.map((d) => mapDeliverableFromDb(d, leadsMap));
  },

  async getDeliverableById(id: string): Promise<Deliverable | null> {
    const { data, error } = await supabaseAdmin.from('deliverables').select('*').eq('id', id).maybeSingle();
    if (error || !data) return null;
    const leadsMap = await getLeadsNameMap();
    return mapDeliverableFromDb(data, leadsMap);
  },

  async createDeliverable(
    data: Omit<Deliverable, 'id' | 'downloadCount' | 'isSoftDeleted' | 'createdAt'>
  ): Promise<Deliverable> {
    const id = `deliv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const { data: inserted, error } = await supabaseAdmin
      .from('deliverables')
      .insert({
        id,
        lead_id: data.leadId,
        title: data.title,
        description: data.description || null,
        category: data.category,
        file_url: data.fileUrl || null,
        storage_path: data.storagePath || null,
        file_name: data.fileName,
        file_size: data.fileSize || 0,
        download_count: 0,
        is_soft_deleted: false,
        uploaded_by: data.uploadedBy || null,
        created_at: now,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    const leadsMap = await getLeadsNameMap();
    return mapDeliverableFromDb(inserted, leadsMap);
  },

  async trackDeliverableDownload(id: string): Promise<Deliverable | null> {
    const deliverable = await this.getDeliverableById(id);
    if (!deliverable) return null;

    const retentionDays = await this.getRetentionDays();
    const now = new Date();
    const softDeleteAt = deliverable.softDeleteAt
      ? deliverable.softDeleteAt
      : new Date(now.getTime() + retentionDays * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabaseAdmin
      .from('deliverables')
      .update({
        download_count: deliverable.downloadCount + 1,
        downloaded_at: now.toISOString(),
        soft_delete_at: softDeleteAt,
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error || !data) return null;
    const leadsMap = await getLeadsNameMap();
    return mapDeliverableFromDb(data, leadsMap);
  },

  async restoreDeliverable(id: string): Promise<Deliverable | null> {
    const { data, error } = await supabaseAdmin
      .from('deliverables')
      .update({
        is_soft_deleted: false,
        soft_delete_at: null,
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error || !data) return null;
    const leadsMap = await getLeadsNameMap();
    return mapDeliverableFromDb(data, leadsMap);
  },

  async deleteDeliverable(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin.from('deliverables').delete().eq('id', id);
    return !error;
  },

  // Projects
  async getProjects(leadId?: string): Promise<Project[]> {
    let query = supabaseAdmin.from('projects').select('*').order('created_at', { ascending: false });
    if (leadId) {
      query = query.eq('lead_id', leadId);
    }
    const { data, error } = await query;
    if (error || !data) return [];
    const leadsMap = await getLeadsNameMap();
    return data.map((p) => mapProjectFromDb(p, leadsMap));
  },

  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const id = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const { data: inserted, error } = await supabaseAdmin
      .from('projects')
      .insert({
        id,
        lead_id: data.leadId || null,
        title: data.title,
        description: data.description || null,
        status: data.status || 'In Progress',
        budget: data.budget || 0,
        currency: data.currency || 'INR',
        kanban_url: data.kanbanUrl || null,
        start_date: data.startDate || null,
        target_date: data.targetDate || null,
        assigned_teammates: data.assignedTeammates || [],
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    const leadsMap = await getLeadsNameMap();
    return mapProjectFromDb(inserted, leadsMap);
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const dbPayload: any = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) dbPayload.title = updates.title;
    if (updates.description !== undefined) dbPayload.description = updates.description;
    if (updates.status !== undefined) dbPayload.status = updates.status;
    if (updates.budget !== undefined) dbPayload.budget = updates.budget;
    if (updates.currency !== undefined) dbPayload.currency = updates.currency;
    if (updates.kanbanUrl !== undefined) dbPayload.kanban_url = updates.kanbanUrl;
    if (updates.startDate !== undefined) dbPayload.start_date = updates.startDate;
    if (updates.targetDate !== undefined) dbPayload.target_date = updates.targetDate;
    if (updates.assignedTeammates !== undefined) dbPayload.assigned_teammates = updates.assignedTeammates;

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error || !data) return null;
    const leadsMap = await getLeadsNameMap();
    return mapProjectFromDb(data, leadsMap);
  },

  async deleteProject(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
    return !error;
  },

  // Email Logs
  async logEmail(data: Omit<EmailLog, 'id' | 'createdAt'>): Promise<EmailLog> {
    const id = `elog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const { data: inserted, error } = await supabaseAdmin
      .from('email_logs')
      .insert({
        id,
        recipient: data.recipient,
        subject: data.subject,
        template_type: data.templateType,
        status: data.status || 'sent',
        error_message: data.errorMessage || null,
        sent_by: data.sentBy || null,
        created_at: now,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: inserted.id,
      recipient: inserted.recipient,
      subject: inserted.subject,
      templateType: inserted.template_type,
      status: inserted.status,
      errorMessage: inserted.error_message,
      sentBy: inserted.sent_by,
      createdAt: inserted.created_at,
    };
  },

  async getEmailLogs(): Promise<EmailLog[]> {
    const { data, error } = await supabaseAdmin
      .from('email_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((e) => ({
      id: e.id,
      recipient: e.recipient,
      subject: e.subject,
      templateType: e.template_type,
      status: e.status,
      errorMessage: e.error_message,
      sentBy: e.sent_by,
      createdAt: e.created_at,
    }));
  },
};
