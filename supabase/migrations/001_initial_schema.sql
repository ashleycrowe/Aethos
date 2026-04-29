-- Aethos V1 Database Schema
-- Purpose: Multi-tenant SaaS with metadata-only storage
-- Provider: Supabase PostgreSQL
-- Security: Row-Level Security (RLS) enforced on all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TENANTS TABLE
-- ============================================================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  microsoft_tenant_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  subscription_tier TEXT DEFAULT 'v1' CHECK (subscription_tier IN ('v1', 'v1.5', 'v2', 'v3', 'v4')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  settings JSONB DEFAULT '{
    "ai_enrichment_enabled": false,
    "daily_scan_enabled": true,
    "auto_archive_stale_days": 180
  }'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_tenants_microsoft_id ON tenants(microsoft_tenant_id);
CREATE INDEX idx_tenants_status ON tenants(status) WHERE status = 'active';

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  microsoft_id TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'architect', 'curator', 'auditor', 'user', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  settings JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(tenant_id, email)
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_microsoft_id ON users(microsoft_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================================================
-- FILES TABLE (Metadata-only, no content storage)
-- ============================================================================
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Provider information
  provider TEXT NOT NULL CHECK (provider IN ('microsoft', 'slack', 'google', 'box', 'local')),
  provider_id TEXT NOT NULL, -- SharePoint ID, Drive ID, etc.
  provider_type TEXT, -- 'sharepoint', 'onedrive', 'teams', etc.
  
  -- File metadata
  name TEXT NOT NULL,
  path TEXT,
  url TEXT,
  size_bytes BIGINT DEFAULT 0,
  mime_type TEXT,
  file_extension TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ,
  modified_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  indexed_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ownership
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  owner_email TEXT,
  owner_name TEXT,
  
  -- Risk & Intelligence Flags
  is_stale BOOLEAN DEFAULT FALSE,
  is_orphaned BOOLEAN DEFAULT FALSE,
  is_duplicate BOOLEAN DEFAULT FALSE,
  has_external_share BOOLEAN DEFAULT FALSE,
  external_user_count INT DEFAULT 0,
  
  -- Scoring (0-100)
  risk_score INT DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  intelligence_score INT DEFAULT 0 CHECK (intelligence_score >= 0 AND intelligence_score <= 100),
  
  -- AI Enrichment (V1.5+)
  ai_tags TEXT[] DEFAULT '{}',
  ai_category TEXT,
  ai_suggested_title TEXT,
  ai_summary TEXT,
  ai_enriched_at TIMESTAMPTZ,
  
  -- Metadata & Raw Data
  metadata JSONB DEFAULT '{}'::jsonb,
  raw_api_response JSONB,
  
  UNIQUE(tenant_id, provider, provider_id)
);

-- Indexes for performance
CREATE INDEX idx_files_tenant ON files(tenant_id);
CREATE INDEX idx_files_tenant_provider ON files(tenant_id, provider);
CREATE INDEX idx_files_stale ON files(tenant_id, is_stale) WHERE is_stale = TRUE;
CREATE INDEX idx_files_orphaned ON files(tenant_id, is_orphaned) WHERE is_orphaned = TRUE;
CREATE INDEX idx_files_external_share ON files(tenant_id, has_external_share) WHERE has_external_share = TRUE;
CREATE INDEX idx_files_owner ON files(owner_id);
CREATE INDEX idx_files_modified ON files(tenant_id, modified_at DESC);
CREATE INDEX idx_files_size ON files(tenant_id, size_bytes DESC);

-- Full-text search index
CREATE INDEX idx_files_search ON files USING GIN(to_tsvector('english', 
  name || ' ' || 
  COALESCE(path, '') || ' ' || 
  COALESCE(ai_suggested_title, '') || ' ' || 
  COALESCE(ai_summary, '')
));

-- AI tags GIN index
CREATE INDEX idx_files_ai_tags ON files USING GIN(ai_tags);

-- ============================================================================
-- SITES TABLE (SharePoint sites, Teams, workspaces)
-- ============================================================================
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Provider information
  provider TEXT NOT NULL CHECK (provider IN ('microsoft', 'slack', 'google', 'box')),
  provider_id TEXT NOT NULL,
  provider_type TEXT, -- 'sharepoint', 'teams', 'slack_workspace', etc.
  
  -- Site metadata
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  size_bytes BIGINT DEFAULT 0,
  file_count INT DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ,
  last_activity TIMESTAMPTZ,
  indexed_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ownership
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  owner_email TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_archived BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  UNIQUE(tenant_id, provider, provider_id)
);

CREATE INDEX idx_sites_tenant ON sites(tenant_id);
CREATE INDEX idx_sites_tenant_provider ON sites(tenant_id, provider);
CREATE INDEX idx_sites_active ON sites(tenant_id, is_active) WHERE is_active = TRUE;

-- ============================================================================
-- WORKSPACES TABLE (The Nexus - V1 feature)
-- ============================================================================
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Workspace info
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- emoji or icon name
  color TEXT DEFAULT '#00F0FF',
  
  -- Auto-sync configuration (V1 key feature: tag-based sync)
  tags TEXT[] DEFAULT '{}', -- Files with these tags auto-sync
  auto_sync_enabled BOOLEAN DEFAULT TRUE,
  sync_rules JSONB DEFAULT '{
    "include_tags": [],
    "exclude_tags": [],
    "include_providers": ["microsoft"],
    "include_owners": [],
    "min_intelligence_score": 0
  }'::jsonb,
  
  -- Metadata
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync_at TIMESTAMPTZ,
  
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_workspaces_tenant ON workspaces(tenant_id);
CREATE INDEX idx_workspaces_tags ON workspaces USING GIN(tags);
CREATE INDEX idx_workspaces_auto_sync ON workspaces(tenant_id, auto_sync_enabled) WHERE auto_sync_enabled = TRUE;

-- ============================================================================
-- WORKSPACE_ITEMS TABLE (Files pinned to workspaces)
-- ============================================================================
CREATE TABLE workspace_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  
  -- Tracking
  added_at TIMESTAMPTZ DEFAULT NOW(),
  added_by UUID REFERENCES users(id) ON DELETE SET NULL,
  added_method TEXT CHECK (added_method IN ('manual', 'auto_sync', 'ai_suggestion')),
  
  -- Notes & Organization
  notes TEXT,
  pinned BOOLEAN DEFAULT FALSE,
  
  UNIQUE(workspace_id, file_id)
);

CREATE INDEX idx_workspace_items_workspace ON workspace_items(workspace_id);
CREATE INDEX idx_workspace_items_file ON workspace_items(file_id);
CREATE INDEX idx_workspace_items_added ON workspace_items(workspace_id, added_at DESC);

-- ============================================================================
-- REMEDIATION_ACTIONS TABLE (Audit log for all remediation)
-- ============================================================================
CREATE TABLE remediation_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Action details
  action_type TEXT NOT NULL CHECK (action_type IN ('archive', 'delete', 'revoke_links', 'restore', 'move')),
  file_ids UUID[] NOT NULL,
  file_count INT NOT NULL,
  
  -- Execution
  executed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'partial')),
  
  -- Results
  success_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_remediation_tenant ON remediation_actions(tenant_id);
CREATE INDEX idx_remediation_executed_by ON remediation_actions(executed_by);
CREATE INDEX idx_remediation_executed_at ON remediation_actions(tenant_id, executed_at DESC);
CREATE INDEX idx_remediation_status ON remediation_actions(tenant_id, status);

-- ============================================================================
-- DISCOVERY_SCANS TABLE (Job tracking for discovery runs)
-- ============================================================================
CREATE TABLE discovery_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Scan details
  provider TEXT NOT NULL CHECK (provider IN ('microsoft', 'slack', 'google', 'box', 'all')),
  scan_type TEXT DEFAULT 'full' CHECK (scan_type IN ('full', 'incremental', 'manual')),
  
  -- Timing
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_seconds INT,
  
  -- Status
  status TEXT DEFAULT 'running' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  
  -- Results
  files_discovered INT DEFAULT 0,
  files_updated INT DEFAULT 0,
  sites_discovered INT DEFAULT 0,
  new_files INT DEFAULT 0,
  
  -- Errors
  errors TEXT[] DEFAULT '{}',
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_discovery_tenant ON discovery_scans(tenant_id);
CREATE INDEX idx_discovery_status ON discovery_scans(tenant_id, status);
CREATE INDEX idx_discovery_started ON discovery_scans(tenant_id, started_at DESC);

-- ============================================================================
-- NOTIFICATIONS TABLE (Intelligence Stream)
-- ============================================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Notification details
  type TEXT NOT NULL CHECK (type IN ('insight', 'alert', 'recommendation', 'system')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Targeting
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL = all users in tenant
  
  -- Status
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  dismissed BOOLEAN DEFAULT FALSE,
  
  -- Context
  related_file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  related_scan_id UUID REFERENCES discovery_scans(id) ON DELETE CASCADE,
  related_action_id UUID REFERENCES remediation_actions(id) ON DELETE CASCADE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_notifications_tenant ON notifications(tenant_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(tenant_id, user_id, read) WHERE read = FALSE;
CREATE INDEX idx_notifications_created ON notifications(tenant_id, created_at DESC);

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE remediation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Tenants: Users can only see their own tenant
CREATE POLICY tenant_isolation ON tenants
  FOR ALL USING (id = current_setting('app.current_tenant_id', true)::UUID);

-- Users: Users can only see users in their tenant
CREATE POLICY tenant_isolation ON users
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Files: Tenant isolation
CREATE POLICY tenant_isolation ON files
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Sites: Tenant isolation
CREATE POLICY tenant_isolation ON sites
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Workspaces: Tenant isolation
CREATE POLICY tenant_isolation ON workspaces
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Workspace Items: Through workspace tenant isolation
CREATE POLICY tenant_isolation ON workspace_items
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE tenant_id = current_setting('app.current_tenant_id', true)::UUID
    )
  );

-- Remediation Actions: Tenant isolation
CREATE POLICY tenant_isolation ON remediation_actions
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Discovery Scans: Tenant isolation
CREATE POLICY tenant_isolation ON discovery_scans
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Notifications: User can see their own notifications or tenant-wide notifications
CREATE POLICY user_notifications ON notifications
  FOR ALL USING (
    tenant_id = current_setting('app.current_tenant_id', true)::UUID
    AND (user_id = current_setting('app.current_user_id', true)::UUID OR user_id IS NULL)
  );

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Calculate total storage for a tenant
CREATE OR REPLACE FUNCTION calculate_total_storage(tenant_uuid UUID)
RETURNS BIGINT AS $$
  SELECT COALESCE(SUM(size_bytes), 0) FROM files WHERE tenant_id = tenant_uuid;
$$ LANGUAGE SQL STABLE;

-- Calculate waste storage (stale + orphaned files)
CREATE OR REPLACE FUNCTION calculate_waste_storage(tenant_uuid UUID)
RETURNS BIGINT AS $$
  SELECT COALESCE(SUM(size_bytes), 0) 
  FROM files 
  WHERE tenant_id = tenant_uuid 
    AND (is_stale = TRUE OR is_orphaned = TRUE);
$$ LANGUAGE SQL STABLE;

-- Calculate average intelligence score
CREATE OR REPLACE FUNCTION calculate_avg_intelligence_score(tenant_uuid UUID)
RETURNS NUMERIC AS $$
  SELECT COALESCE(AVG(intelligence_score), 0)::NUMERIC(5,2) 
  FROM files 
  WHERE tenant_id = tenant_uuid;
$$ LANGUAGE SQL STABLE;

-- Update workspace auto-sync
CREATE OR REPLACE FUNCTION sync_workspace_items(workspace_uuid UUID)
RETURNS INT AS $$
DECLARE
  workspace_rec RECORD;
  matched_files RECORD;
  added_count INT := 0;
BEGIN
  -- Get workspace configuration
  SELECT * INTO workspace_rec FROM workspaces WHERE id = workspace_uuid;
  
  IF NOT workspace_rec.auto_sync_enabled THEN
    RETURN 0;
  END IF;
  
  -- Find files that match workspace tags
  FOR matched_files IN
    SELECT id FROM files
    WHERE tenant_id = workspace_rec.tenant_id
      AND ai_tags && workspace_rec.tags -- Array overlap operator
      AND id NOT IN (
        SELECT file_id FROM workspace_items WHERE workspace_id = workspace_uuid
      )
  LOOP
    INSERT INTO workspace_items (workspace_id, file_id, added_method)
    VALUES (workspace_uuid, matched_files.id, 'auto_sync')
    ON CONFLICT (workspace_id, file_id) DO NOTHING;
    
    added_count := added_count + 1;
  END LOOP;
  
  -- Update last sync timestamp
  UPDATE workspaces SET last_sync_at = NOW() WHERE id = workspace_uuid;
  
  RETURN added_count;
END;
$$ LANGUAGE plpgsql;

-- Mark stale files (untouched for 180+ days)
CREATE OR REPLACE FUNCTION mark_stale_files(tenant_uuid UUID, days_threshold INT DEFAULT 180)
RETURNS INT AS $$
DECLARE
  updated_count INT;
BEGIN
  UPDATE files
  SET is_stale = TRUE
  WHERE tenant_id = tenant_uuid
    AND modified_at < (NOW() - (days_threshold || ' days')::INTERVAL)
    AND is_stale = FALSE;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp on tenants
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Calculate file extension on insert/update
CREATE OR REPLACE FUNCTION set_file_extension()
RETURNS TRIGGER AS $$
BEGIN
  NEW.file_extension = LOWER(SUBSTRING(NEW.name FROM '\.([^.]*)$'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_file_extension_trigger
  BEFORE INSERT OR UPDATE OF name ON files
  FOR EACH ROW
  EXECUTE FUNCTION set_file_extension();

-- ============================================================================
-- INITIAL DATA (Optional: Seed data for testing)
-- ============================================================================

-- Create a demo tenant (optional, remove in production)
-- INSERT INTO tenants (name, microsoft_tenant_id, subscription_tier)
-- VALUES ('Demo Tenant', 'demo-tenant-id', 'v1');

-- ============================================================================
-- GRANTS (Supabase automatically handles this with RLS)
-- ============================================================================

-- Grant usage to authenticated users (Supabase handles this)
-- The anon key will have limited access, authenticated users get full access
-- within their tenant boundary via RLS policies

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE tenants IS 'Multi-tenant isolation: Each customer gets their own tenant';
COMMENT ON TABLE files IS 'Metadata-only storage: No file contents, only metadata pointers';
COMMENT ON TABLE workspaces IS 'The Nexus: Tag-based workspace auto-sync (V1 key feature)';
COMMENT ON COLUMN files.ai_tags IS 'AI-generated tags from OpenAI (V1.5+ feature)';
COMMENT ON FUNCTION sync_workspace_items IS 'Auto-sync files to workspaces based on tag matching';
