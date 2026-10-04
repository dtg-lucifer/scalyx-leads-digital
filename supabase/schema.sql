-- LeadsDigital Schema Initialization Script
-- Comprehensive schema for PostgreSQL & Supabase

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users & RBAC
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'teammate', -- 'super_admin', 'teammate', 'viewer'
    permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    role_title TEXT,
    source TEXT NOT NULL DEFAULT 'Website',
    status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost', 'Completed'
    deal_value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    revenue_collected NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    notes TEXT,
    remarks TEXT,
    portal_access_code TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Folders
CREATE TABLE IF NOT EXISTS folders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    lead_id TEXT REFERENCES leads(id) ON DELETE CASCADE,
    parent_id TEXT REFERENCES folders(id) ON DELETE CASCADE,
    created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    share_token TEXT UNIQUE,
    is_shared BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Files
CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    folder_id TEXT REFERENCES folders(id) ON DELETE CASCADE,
    lead_id TEXT REFERENCES leads(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    size BIGINT NOT NULL DEFAULT 0,
    mime_type TEXT,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    share_token TEXT UNIQUE,
    is_shared BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Client Portals (Public Dashboard)
CREATE TABLE IF NOT EXISTS client_portals (
    id TEXT PRIMARY KEY,
    lead_id TEXT UNIQUE NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    project_growth INTEGER NOT NULL DEFAULT 0, -- 0 to 100%
    status_message TEXT DEFAULT 'Project initialized. Welcome to your client portal!',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_accessed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Portal Updates & Notices
CREATE TABLE IF NOT EXISTS portal_updates (
    id TEXT PRIMARY KEY,
    portal_id TEXT NOT NULL REFERENCES client_portals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    update_type TEXT NOT NULL DEFAULT 'notice', -- 'notice', 'milestone', 'announcement', 'changelog'
    pinned BOOLEAN NOT NULL DEFAULT FALSE,
    posted_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Deliverables and Collectibles
CREATE TABLE IF NOT EXISTS deliverables (
    id TEXT PRIMARY KEY,
    lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'deliverable_from_us' or 'collectible_from_client'
    file_url TEXT,
    storage_path TEXT,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    downloaded_at TIMESTAMPTZ,
    download_count INTEGER NOT NULL DEFAULT 0,
    soft_delete_at TIMESTAMPTZ,
    is_soft_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    lead_id TEXT REFERENCES leads(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'In Progress', -- 'Planning', 'Design', 'In Progress', 'Testing', 'Completed', 'On Hold'
    budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    kanban_url TEXT,
    start_date DATE,
    target_date DATE,
    assigned_teammates TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Global Settings
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Email Sending Logs
CREATE TABLE IF NOT EXISTS email_logs (
    id TEXT PRIMARY KEY,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    template_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'failed'
    error_message TEXT,
    sent_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes (Following Supabase Postgres Best Practices)
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_portal_access ON leads(portal_access_code);

CREATE INDEX IF NOT EXISTS idx_folders_lead_id ON folders(lead_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_folders_share_token ON folders(share_token);

CREATE INDEX IF NOT EXISTS idx_files_folder_id ON files(folder_id);
CREATE INDEX IF NOT EXISTS idx_files_lead_id ON files(lead_id);
CREATE INDEX IF NOT EXISTS idx_files_share_token ON files(share_token);

CREATE INDEX IF NOT EXISTS idx_portals_lead_id ON client_portals(lead_id);
CREATE INDEX IF NOT EXISTS idx_portals_slug ON client_portals(slug);

CREATE INDEX IF NOT EXISTS idx_portal_updates_portal_id ON portal_updates(portal_id);
CREATE INDEX IF NOT EXISTS idx_portal_updates_created_at ON portal_updates(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_deliverables_lead_id ON deliverables(lead_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_category ON deliverables(category);
CREATE INDEX IF NOT EXISTS idx_deliverables_soft_delete ON deliverables(is_soft_deleted, soft_delete_at);

CREATE INDEX IF NOT EXISTS idx_projects_lead_id ON projects(lead_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);

-- ============================================================================
-- Supabase Storage Buckets & Policies
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('documents', 'documents', true, 52428800, NULL),
  ('deliverables', 'deliverables', true, 104857600, NULL)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies if re-running
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public Documents Access" ON storage.objects;
  DROP POLICY IF EXISTS "Public Documents Upload" ON storage.objects;
  DROP POLICY IF EXISTS "Public Documents Update" ON storage.objects;
  DROP POLICY IF EXISTS "Public Documents Delete" ON storage.objects;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

CREATE POLICY "Public Documents Access" ON storage.objects 
  FOR SELECT USING (bucket_id IN ('documents', 'deliverables'));

CREATE POLICY "Public Documents Upload" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id IN ('documents', 'deliverables'));

CREATE POLICY "Public Documents Update" ON storage.objects 
  FOR UPDATE USING (bucket_id IN ('documents', 'deliverables'));

CREATE POLICY "Public Documents Delete" ON storage.objects 
  FOR DELETE USING (bucket_id IN ('documents', 'deliverables'));

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_portals ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Allow full access to service_role and backend operations
CREATE POLICY "Full access for service role on users" ON users FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service role on leads" ON leads FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service role on folders" ON folders FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service role on files" ON files FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service role on client_portals" ON client_portals FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service role on portal_updates" ON portal_updates FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service role on deliverables" ON deliverables FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service role on projects" ON projects FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service role on settings" ON settings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service role on email_logs" ON email_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Allow public read access for shared items & client portal
CREATE POLICY "Public portal read" ON client_portals FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public portal updates read" ON portal_updates FOR SELECT TO anon USING (true);
CREATE POLICY "Public shared folders read" ON folders FOR SELECT TO anon USING (is_shared = true);
CREATE POLICY "Public shared files read" ON files FOR SELECT TO anon USING (is_shared = true);
CREATE POLICY "Public deliverables read" ON deliverables FOR SELECT TO anon USING (is_soft_deleted = false);

