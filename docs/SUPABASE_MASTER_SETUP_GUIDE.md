# 🚀 Aethos Platform - Complete Supabase Setup Guide

**Version:** 2.0 (Master Edition)  
**Date:** April 6, 2026  
**Coverage:** Base Product (V1-V4) + Document Control Add-on  
**Time:** 30-45 minutes  
**Cost:** $0 (Supabase Free Tier)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [**PART 1: Base Aethos Platform Setup (V1-V4)**](#part-1-base-aethos-platform-setup)
   - Phase 1: Project Creation
   - Phase 2: Core Database Schema (V1)
   - Phase 3: Row-Level Security
   - Phase 4: AI+ Features (V1.5)
   - Phase 5: Multi-Provider Integration (V2)
   - Phase 6: Governance & Compliance (V3)
   - Phase 7: Federation & Public API (V4)
   - Phase 8: Database Functions & Triggers
4. [**PART 2: Document Control Add-on**](#part-2-document-control-add-on)
   - Phase 9: Document Control Schema
   - Phase 10: Document Control RLS
   - Phase 11: Document Control Functions
5. [**PART 3: Integration & Testing**](#part-3-integration-testing)
   - Phase 12: Environment Setup
   - Phase 13: Frontend Integration
   - Phase 14: Testing & Verification
6. [Database Summary](#database-summary)
7. [Troubleshooting](#troubleshooting)
8. [Cost Projections](#cost-projections)

---

## 🎯 Overview

This guide sets up a **complete production-ready database** for:

### **Base Aethos Platform:**
- ✅ **V1 Core:** Microsoft 365 discovery, workspaces, metadata search
- ✅ **V1.5 AI+:** Semantic search, AI summarization, PII detection
- ✅ **V2 Multi-Provider:** Slack, Google Workspace, Box integration
- ✅ **V3 Governance:** Retention policies, anomaly detection, compliance
- ✅ **V4 Federation:** Cross-tenant search, public API, webhooks

### **Document Control Add-on (+$299/mo):**
- ✅ **Libraries:** Document organization with compliance standards
- ✅ **Auto-numbering:** Sequential document numbering (e.g., POL-HR-2026-0001)
- ✅ **Approval Workflows:** Multi-stage approval routing
- ✅ **Version Control:** Git-like version tracking with branching
- ✅ **Acknowledgements:** User read receipts and training tracking
- ✅ **Compliance Tracking:** ISO 9001, FDA 21 CFR Part 11, SOC 2, GDPR, HIPAA
- ✅ **Audit Logging:** Immutable compliance trail

---

## 📦 Prerequisites

- [ ] Supabase account (free at [supabase.com](https://supabase.com))
- [ ] Microsoft Azure account (for Entra ID)
- [ ] OpenAI account (for V1.5 AI+ features)
- [ ] Slack/Google workspace accounts (optional, for V2)
- [ ] Basic SQL knowledge (helpful but not required)

---

# PART 1: Base Aethos Platform Setup

## 🚀 Phase 1: Project Creation (5 minutes)

### Step 1.1: Create Supabase Project

1. **Go to [app.supabase.com](https://app.supabase.com)**
2. Click **"New Project"**
3. Fill in details:
   - **Organization:** Your organization (or create new)
   - **Project Name:** `aethos-platform` (or any name)
   - **Database Password:** Generate strong password (SAVE THIS!)
   - **Region:** Choose closest to your users (e.g., US East, EU West)
   - **Pricing Plan:** Free
4. Click **"Create new project"**
5. ⏳ Wait 2-3 minutes for provisioning

### Step 1.2: Save Connection Details

Once provisioned, go to **Settings → API** and save:

```
Project URL: https://xxxxxxxxxx.supabase.co
Anon Key: eyJhbGc... (starts with eyJ)
Service Role Key: eyJhbGc... (starts with eyJ - KEEP SECRET!)
Database Password: [your password from step 1]
```

**⚠️ CRITICAL:** Never commit the Service Role Key to Git!

---

## 🗄️ Phase 2: Core Database Schema - V1 (10 minutes)

### Step 2.1: Open SQL Editor

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"+ New query"**
3. Name it: `Aethos V1 Core Schema`

### Step 2.2: Enable Required Extensions

```sql
-- ============================================
-- AETHOS PLATFORM - ENABLE EXTENSIONS
-- ============================================

-- UUID generation (required for all versions)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Full-text search (required for V1)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Vector similarity search (required for V1.5)
CREATE EXTENSION IF NOT EXISTS vector;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Extensions enabled: uuid-ossp, pg_trgm, vector';
END $$;
```

Click **RUN** ▶️

### Step 2.3: Create V1 Core Tables

Copy and run this **ENTIRE SCRIPT**:

```sql
-- ============================================
-- AETHOS V1 CORE - BASE TABLES
-- ============================================

-- TABLE 1: tenants (Multi-tenant foundation)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  microsoft_tenant_id TEXT UNIQUE,
  
  -- Subscription
  subscription_tier TEXT DEFAULT 'v1', -- v1, v1.5, v2, v3, v4
  subscription_status TEXT DEFAULT 'trial', -- trial, active, suspended, cancelled
  trial_ends_at TIMESTAMPTZ,
  
  -- Settings
  settings JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for tenants
CREATE INDEX idx_tenants_microsoft_id ON tenants(microsoft_tenant_id);
CREATE INDEX idx_tenants_status ON tenants(subscription_status);

-- TABLE 2: users (Tenant users with roles)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Identity
  email TEXT NOT NULL,
  name TEXT,
  microsoft_id TEXT UNIQUE,
  
  -- Role
  role TEXT DEFAULT 'CONTRIBUTOR', -- ARCHITECT, CURATOR, CONTRIBUTOR, AUDITOR
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT unique_email_per_tenant UNIQUE (tenant_id, email)
);

-- Indexes for users
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_microsoft_id ON users(microsoft_id);
CREATE INDEX idx_users_email ON users(email);

-- TABLE 3: files (Metadata-only storage, no content)
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Provider Info
  provider TEXT NOT NULL, -- microsoft, slack, google, box, local
  provider_id TEXT NOT NULL, -- External ID (SharePoint ID, Drive ID, etc.)
  
  -- File Metadata
  name TEXT NOT NULL,
  path TEXT,
  url TEXT,
  size_bytes BIGINT,
  mime_type TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ,
  modified_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  
  -- Ownership
  owner_id UUID REFERENCES users(id),
  owner_email TEXT, -- In case user not in Aethos yet
  
  -- Risk & Intelligence
  is_stale BOOLEAN DEFAULT FALSE, -- Not accessed in 180+ days
  is_orphaned BOOLEAN DEFAULT FALSE, -- Owner left organization
  has_external_share BOOLEAN DEFAULT FALSE,
  external_user_count INT DEFAULT 0,
  risk_score INT DEFAULT 0, -- 0-100
  intelligence_score INT DEFAULT 0, -- 0-100 (V1.5)
  
  -- Tags (The Nexus)
  tags TEXT[] DEFAULT '{}',
  
  -- Oracle Enrichment (V1.5)
  ai_title TEXT, -- AI-corrected title
  ai_category TEXT, -- AI-detected category
  ai_summary TEXT, -- Short AI summary
  has_pii BOOLEAN DEFAULT FALSE, -- PII detected
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Constraints
  CONSTRAINT unique_provider_file UNIQUE (tenant_id, provider, provider_id)
);

-- Indexes for files
CREATE INDEX idx_files_tenant ON files(tenant_id);
CREATE INDEX idx_files_provider ON files(provider);
CREATE INDEX idx_files_owner ON files(owner_id);
CREATE INDEX idx_files_stale ON files(is_stale) WHERE is_stale = TRUE;
CREATE INDEX idx_files_orphaned ON files(is_orphaned) WHERE is_orphaned = TRUE;
CREATE INDEX idx_files_external_share ON files(has_external_share) WHERE has_external_share = TRUE;
CREATE INDEX idx_files_tags ON files USING GIN (tags);
CREATE INDEX idx_files_search ON files USING GIN (to_tsvector('english', name || ' ' || COALESCE(path, '')));

-- TABLE 4: sites (SharePoint sites, Teams, Slack channels)
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Provider Info
  provider TEXT NOT NULL, -- microsoft, slack, google
  provider_id TEXT NOT NULL,
  
  -- Site Info
  name TEXT NOT NULL,
  url TEXT,
  description TEXT,
  
  -- Metrics
  size_bytes BIGINT DEFAULT 0,
  file_count INT DEFAULT 0,
  member_count INT DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ,
  last_activity TIMESTAMPTZ,
  
  -- Ownership
  owner_id UUID REFERENCES users(id),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_external BOOLEAN DEFAULT FALSE, -- Guest access enabled
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Constraints
  CONSTRAINT unique_provider_site UNIQUE (tenant_id, provider, provider_id)
);

-- Indexes for sites
CREATE INDEX idx_sites_tenant ON sites(tenant_id);
CREATE INDEX idx_sites_provider ON sites(provider);
CREATE INDEX idx_sites_active ON sites(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_sites_external ON sites(is_external) WHERE is_external = TRUE;

-- TABLE 5: workspaces (The Nexus - intelligent workspaces)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Workspace Info
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#00F0FF', -- Starlight Cyan
  icon TEXT DEFAULT 'Briefcase',
  
  -- Tags (auto-sync based on these)
  tags TEXT[] DEFAULT '{}',
  
  -- Auto-sync
  auto_sync_enabled BOOLEAN DEFAULT TRUE,
  sync_rules JSONB DEFAULT '{}'::jsonb, -- Advanced filtering rules
  last_sync_at TIMESTAMPTZ,
  
  -- Intelligence
  intelligence_score INT DEFAULT 0, -- 0-100
  
  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for workspaces
CREATE INDEX idx_workspaces_tenant ON workspaces(tenant_id);
CREATE INDEX idx_workspaces_created_by ON workspaces(created_by);
CREATE INDEX idx_workspaces_tags ON workspaces USING GIN (tags);

-- TABLE 6: workspace_items (Files pinned to workspaces)
CREATE TABLE workspace_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  
  -- Pinning Info
  added_at TIMESTAMPTZ DEFAULT NOW(),
  added_by UUID REFERENCES users(id),
  notes TEXT,
  is_auto_synced BOOLEAN DEFAULT FALSE, -- Added by auto-sync vs manual
  
  -- Constraints
  CONSTRAINT unique_workspace_file UNIQUE (workspace_id, file_id)
);

-- Indexes for workspace_items
CREATE INDEX idx_workspace_items_workspace ON workspace_items(workspace_id);
CREATE INDEX idx_workspace_items_file ON workspace_items(file_id);
CREATE INDEX idx_workspace_items_added_by ON workspace_items(added_by);

-- TABLE 7: remediation_actions (Action history)
CREATE TABLE remediation_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Action Details
  action_type TEXT NOT NULL, -- archive, delete, revoke_links, restore
  provider TEXT NOT NULL, -- Where action was performed
  
  -- Target Files
  file_ids UUID[] NOT NULL,
  file_count INT NOT NULL,
  
  -- Execution
  executed_by UUID REFERENCES users(id),
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'completed', -- pending, completed, failed, partial
  
  -- Results
  success_count INT DEFAULT 0,
  failure_count INT DEFAULT 0,
  error_messages TEXT[],
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for remediation_actions
CREATE INDEX idx_remediation_tenant ON remediation_actions(tenant_id);
CREATE INDEX idx_remediation_executed_by ON remediation_actions(executed_by);
CREATE INDEX idx_remediation_status ON remediation_actions(status);
CREATE INDEX idx_remediation_executed_at ON remediation_actions(executed_at DESC);

-- TABLE 8: discovery_scans (Sync job tracking)
CREATE TABLE discovery_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Scan Details
  provider TEXT NOT NULL, -- microsoft, slack, google, box
  scan_type TEXT DEFAULT 'full', -- full, incremental
  
  -- Timing
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_seconds INT,
  
  -- Status
  status TEXT DEFAULT 'running', -- running, completed, failed, cancelled
  
  -- Results
  files_discovered INT DEFAULT 0,
  files_updated INT DEFAULT 0,
  files_deleted INT DEFAULT 0,
  errors_count INT DEFAULT 0,
  error_messages TEXT[],
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for discovery_scans
CREATE INDEX idx_scans_tenant ON discovery_scans(tenant_id);
CREATE INDEX idx_scans_provider ON discovery_scans(provider);
CREATE INDEX idx_scans_status ON discovery_scans(status);
CREATE INDEX idx_scans_started_at ON discovery_scans(started_at DESC);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ V1 Core tables created: 8 tables (tenants, users, files, sites, workspaces, workspace_items, remediation_actions, discovery_scans)';
END $$;
```

Click **RUN** ▶️

---

## 🔐 Phase 3: Row-Level Security - V1 (5 minutes)

### Step 3.1: Create Tenant Context Function

```sql
-- ============================================
-- TENANT CONTEXT FUNCTION
-- This sets the current tenant/user for RLS
-- ============================================

CREATE OR REPLACE FUNCTION set_tenant_context(
  p_tenant_id UUID,
  p_user_id UUID,
  p_user_role TEXT
) RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', p_tenant_id::TEXT, false);
  PERFORM set_config('app.current_user_id', p_user_id::TEXT, false);
  PERFORM set_config('app.current_user_role', p_user_role, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Tenant context function created';
END $$;
```

### Step 3.2: Enable RLS on V1 Tables

```sql
-- ============================================
-- ENABLE ROW-LEVEL SECURITY - V1
-- ============================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE remediation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_scans ENABLE ROW LEVEL SECURITY;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '🔐 RLS enabled on 8 V1 tables';
END $$;
```

### Step 3.3: Create RLS Policies for V1

```sql
-- ============================================
-- ROW-LEVEL SECURITY POLICIES - V1
-- ============================================

-- TENANTS: Users can only see their own tenant
CREATE POLICY "Users can view their tenant"
  ON tenants FOR SELECT
  USING (id = current_setting('app.current_tenant_id', true)::UUID);

-- USERS: View all users in tenant
CREATE POLICY "Users can view users in their tenant"
  ON users FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- FILES: View all files in tenant
CREATE POLICY "Users can view files in their tenant"
  ON files FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY "Users can manage files"
  ON files FOR ALL
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::UUID
    AND current_setting('app.current_user_role', true) IN ('ARCHITECT', 'CURATOR', 'CONTRIBUTOR')
  );

-- SITES: View all sites in tenant
CREATE POLICY "Users can view sites in their tenant"
  ON sites FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- WORKSPACES: View and manage workspaces
CREATE POLICY "Users can view workspaces in their tenant"
  ON workspaces FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY "Users can create workspaces"
  ON workspaces FOR INSERT
  WITH CHECK (
    tenant_id = current_setting('app.current_tenant_id', true)::UUID
  );

CREATE POLICY "Users can update their own workspaces"
  ON workspaces FOR UPDATE
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::UUID
    AND (
      created_by = current_setting('app.current_user_id', true)::UUID
      OR current_setting('app.current_user_role', true) IN ('ARCHITECT', 'CURATOR')
    )
  );

-- WORKSPACE_ITEMS: View all items in workspace
CREATE POLICY "Users can view workspace items"
  ON workspace_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspaces w
      WHERE w.id = workspace_items.workspace_id
      AND w.tenant_id = current_setting('app.current_tenant_id', true)::UUID
    )
  );

CREATE POLICY "Users can manage workspace items"
  ON workspace_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspaces w
      WHERE w.id = workspace_items.workspace_id
      AND w.tenant_id = current_setting('app.current_tenant_id', true)::UUID
    )
  );

-- REMEDIATION_ACTIONS: View actions in tenant
CREATE POLICY "Users can view remediation actions"
  ON remediation_actions FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- DISCOVERY_SCANS: View scans in tenant
CREATE POLICY "Users can view discovery scans"
  ON discovery_scans FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '🔐 RLS policies created for V1 tables';
END $$;
```

---

## 🤖 Phase 4: AI+ Features - V1.5 (5 minutes)

### Step 4.1: Create V1.5 AI Tables

```sql
-- ============================================
-- AETHOS V1.5 - AI+ FEATURES
-- ============================================

-- TABLE 9: content_embeddings (Vector storage for semantic search)
CREATE TABLE content_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  
  -- Embedding Data
  embedding vector(1536), -- OpenAI text-embedding-3-small
  
  -- Content Source
  content_text TEXT, -- Extracted text
  content_hash TEXT, -- SHA-256 hash to detect changes
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_file_embedding UNIQUE (file_id)
);

-- Indexes for embeddings
CREATE INDEX idx_embeddings_tenant ON content_embeddings(tenant_id);
CREATE INDEX idx_embeddings_file ON content_embeddings(file_id);
CREATE INDEX idx_embeddings_vector ON content_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- TABLE 10: content_summaries (Cached AI summaries)
CREATE TABLE content_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  
  -- Summary Data
  summary_short TEXT, -- 1-2 sentences
  summary_long TEXT, -- Full summary
  key_points TEXT[], -- Bullet points
  
  -- AI Model
  model_used TEXT DEFAULT 'gpt-4o-mini',
  
  -- Cache
  content_hash TEXT, -- Detect if file changed
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_file_summary UNIQUE (file_id)
);

-- Indexes for summaries
CREATE INDEX idx_summaries_tenant ON content_summaries(tenant_id);
CREATE INDEX idx_summaries_file ON content_summaries(file_id);
CREATE INDEX idx_summaries_expires ON content_summaries(expires_at);

-- TABLE 11: pii_detections (PII scanning results)
CREATE TABLE pii_detections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  
  -- Detection Results
  has_pii BOOLEAN DEFAULT FALSE,
  pii_types TEXT[], -- ['email', 'ssn', 'credit_card', etc.]
  pii_count INT DEFAULT 0,
  confidence_score FLOAT, -- 0.0-1.0
  
  -- Detected Patterns
  detections JSONB DEFAULT '[]'::jsonb, -- Array of {type, value_redacted, location}
  
  -- Scan Info
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  scan_method TEXT DEFAULT 'regex', -- regex, ai, hybrid
  
  -- Constraints
  CONSTRAINT unique_file_pii UNIQUE (file_id)
);

-- Indexes for pii_detections
CREATE INDEX idx_pii_tenant ON pii_detections(tenant_id);
CREATE INDEX idx_pii_file ON pii_detections(file_id);
CREATE INDEX idx_pii_has_pii ON pii_detections(has_pii) WHERE has_pii = TRUE;

-- Enable RLS on V1.5 tables
ALTER TABLE content_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE pii_detections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for V1.5
CREATE POLICY "Users can view embeddings in their tenant"
  ON content_embeddings FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY "Users can view summaries in their tenant"
  ON content_summaries FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY "Users can view PII detections in their tenant"
  ON pii_detections FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ V1.5 AI+ tables created: 3 tables (embeddings, summaries, pii_detections)';
END $$;
```

---

## 🔌 Phase 5: Multi-Provider Integration - V2 (3 minutes)

### Step 5.1: Create V2 Provider Tables

```sql
-- ============================================
-- AETHOS V2 - MULTI-PROVIDER INTEGRATION
-- ============================================

-- TABLE 12: provider_connections (OAuth tokens)
CREATE TABLE provider_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Provider Info
  provider TEXT NOT NULL, -- slack, google, box, dropbox
  provider_account_id TEXT, -- External account ID
  provider_account_name TEXT, -- Workspace/domain name
  
  -- OAuth Tokens
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  scopes TEXT[], -- Granted permissions
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMPTZ,
  last_sync_status TEXT, -- success, failed
  
  -- Metadata
  connected_by UUID REFERENCES users(id),
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Constraints
  CONSTRAINT unique_provider_connection UNIQUE (tenant_id, provider, provider_account_id)
);

-- Indexes for provider_connections
CREATE INDEX idx_provider_connections_tenant ON provider_connections(tenant_id);
CREATE INDEX idx_provider_connections_provider ON provider_connections(provider);
CREATE INDEX idx_provider_connections_active ON provider_connections(is_active) WHERE is_active = TRUE;

-- Enable RLS
ALTER TABLE provider_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can view provider connections in their tenant"
  ON provider_connections FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY "Architects can manage provider connections"
  ON provider_connections FOR ALL
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::UUID
    AND current_setting('app.current_user_role', true) IN ('ARCHITECT', 'CURATOR')
  );

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ V2 Multi-provider table created: provider_connections';
END $$;
```

---

## 📊 Phase 6: Governance & Compliance - V3 (5 minutes)

### Step 6.1: Create V3 Compliance Tables

```sql
-- ============================================
-- AETHOS V3 - GOVERNANCE & COMPLIANCE
-- ============================================

-- TABLE 13: retention_policies (Automated retention rules)
CREATE TABLE retention_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Policy Info
  name TEXT NOT NULL,
  description TEXT,
  
  -- Conditions (when to apply)
  applies_to_providers TEXT[], -- ['microsoft', 'slack', etc.]
  applies_to_file_types TEXT[], -- ['pdf', 'docx', etc.]
  applies_to_tags TEXT[], -- Tag-based targeting
  
  -- Actions
  action_type TEXT NOT NULL, -- archive, delete, notify
  after_days_inactive INT NOT NULL, -- e.g., 180 days
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Schedule
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  
  -- Results
  files_affected_count INT DEFAULT 0,
  
  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for retention_policies
CREATE INDEX idx_retention_tenant ON retention_policies(tenant_id);
CREATE INDEX idx_retention_active ON retention_policies(is_active) WHERE is_active = TRUE;

-- TABLE 14: compliance_audit_logs (Immutable audit trail)
CREATE TABLE compliance_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Event
  event_type TEXT NOT NULL, -- file_archived, file_deleted, policy_created, etc.
  event_category TEXT NOT NULL, -- data_retention, access_control, discovery
  
  -- Actor
  actor_id UUID REFERENCES users(id),
  actor_email TEXT,
  actor_ip INET,
  
  -- Target
  target_type TEXT, -- file, workspace, policy
  target_id UUID,
  target_name TEXT,
  
  -- Changes
  before_state JSONB,
  after_state JSONB,
  
  -- Metadata (IMMUTABLE)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for audit logs
CREATE INDEX idx_audit_logs_tenant ON compliance_audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_event_type ON compliance_audit_logs(event_type);
CREATE INDEX idx_audit_logs_actor ON compliance_audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created ON compliance_audit_logs(created_at DESC);

-- TABLE 15: anomaly_detections (Predictive risk alerts)
CREATE TABLE anomaly_detections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Anomaly Info
  anomaly_type TEXT NOT NULL, -- storage_spike, unusual_sharing, organizational_drift
  severity TEXT NOT NULL, -- critical, high, medium, low
  title TEXT NOT NULL,
  description TEXT,
  
  -- Context
  detected_metric TEXT, -- e.g., 'storage_growth_gb_per_day'
  expected_value FLOAT,
  actual_value FLOAT,
  deviation_percentage FLOAT,
  
  -- Resolution
  status TEXT DEFAULT 'open', -- open, acknowledged, resolved, false_positive
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id),
  resolution_notes TEXT,
  
  -- Metadata
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for anomaly_detections
CREATE INDEX idx_anomalies_tenant ON anomaly_detections(tenant_id);
CREATE INDEX idx_anomalies_severity ON anomaly_detections(severity);
CREATE INDEX idx_anomalies_status ON anomaly_detections(status);
CREATE INDEX idx_anomalies_detected ON anomaly_detections(detected_at DESC);

-- TABLE 16: storage_snapshots (Baseline for anomaly detection)
CREATE TABLE storage_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Snapshot Data
  snapshot_date DATE NOT NULL,
  total_storage_gb FLOAT,
  file_count INT,
  site_count INT,
  
  -- Provider Breakdown
  storage_by_provider JSONB DEFAULT '{}'::jsonb, -- {microsoft: 500, slack: 50}
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_tenant_snapshot_date UNIQUE (tenant_id, snapshot_date)
);

-- Indexes for storage_snapshots
CREATE INDEX idx_snapshots_tenant ON storage_snapshots(tenant_id);
CREATE INDEX idx_snapshots_date ON storage_snapshots(snapshot_date DESC);

-- Enable RLS on V3 tables
ALTER TABLE retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomaly_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for V3
CREATE POLICY "Users can view retention policies in their tenant"
  ON retention_policies FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY "Architects can manage retention policies"
  ON retention_policies FOR ALL
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::UUID
    AND current_setting('app.current_user_role', true) IN ('ARCHITECT', 'CURATOR')
  );

CREATE POLICY "Architects can view audit logs in their tenant"
  ON compliance_audit_logs FOR SELECT
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::UUID
    AND current_setting('app.current_user_role', true) IN ('ARCHITECT', 'CURATOR', 'AUDITOR')
  );

CREATE POLICY "Audit logs cannot be modified"
  ON compliance_audit_logs FOR UPDATE
  USING (false);

CREATE POLICY "Audit logs cannot be deleted"
  ON compliance_audit_logs FOR DELETE
  USING (false);

CREATE POLICY "Users can view anomalies in their tenant"
  ON anomaly_detections FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY "Users can view snapshots in their tenant"
  ON storage_snapshots FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ V3 Governance tables created: 4 tables (retention_policies, compliance_audit_logs, anomaly_detections, storage_snapshots)';
END $$;
```

---

## 🌐 Phase 7: Federation & Public API - V4 (4 minutes)

### Step 7.1: Create V4 Federation Tables

```sql
-- ============================================
-- AETHOS V4 - FEDERATION & PUBLIC API
-- ============================================

-- TABLE 17: tenant_relationships (MSP parent-child mapping)
CREATE TABLE tenant_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relationship
  parent_tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, -- MSP
  child_tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, -- Client
  
  -- Permissions
  can_view_data BOOLEAN DEFAULT TRUE,
  can_manage_data BOOLEAN DEFAULT FALSE,
  allowed_features TEXT[] DEFAULT '{}', -- ['search', 'reporting', 'compliance']
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  
  -- Constraints
  CONSTRAINT unique_tenant_relationship UNIQUE (parent_tenant_id, child_tenant_id)
);

-- Indexes for tenant_relationships
CREATE INDEX idx_relationships_parent ON tenant_relationships(parent_tenant_id);
CREATE INDEX idx_relationships_child ON tenant_relationships(child_tenant_id);

-- TABLE 18: federation_audit_logs (Cross-tenant search logs)
CREATE TABLE federation_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- MSP Context
  msp_tenant_id UUID NOT NULL REFERENCES tenants(id),
  msp_user_id UUID,
  
  -- Target Tenants
  searched_tenant_ids UUID[], -- Which child tenants were searched
  
  -- Search Details
  search_query TEXT,
  results_count INT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Indexes for federation_audit_logs
CREATE INDEX idx_fed_audit_msp ON federation_audit_logs(msp_tenant_id);
CREATE INDEX idx_fed_audit_created ON federation_audit_logs(created_at DESC);

-- TABLE 19: api_keys (Public API authentication)
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Key Info
  key_name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE, -- SHA-256 hash of actual key
  key_prefix TEXT NOT NULL, -- First 8 chars for display (e.g., "aethos_pk_12345678...")
  
  -- Permissions
  scopes TEXT[] NOT NULL, -- ['read:artifacts', 'write:workspaces', etc.]
  
  -- Rate Limiting
  rate_limit_per_hour INT DEFAULT 1000,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  
  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for api_keys
CREATE INDEX idx_api_keys_tenant ON api_keys(tenant_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_active ON api_keys(is_active) WHERE is_active = TRUE;

-- TABLE 20: api_usage (Rate limiting tracking)
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Usage Details
  endpoint TEXT NOT NULL, -- e.g., '/api/v1/artifacts'
  method TEXT NOT NULL, -- GET, POST, PUT, DELETE
  status_code INT,
  
  -- Timing
  response_time_ms INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Quota Tracking
  hour_bucket TIMESTAMPTZ NOT NULL -- Truncated to hour for rate limiting
);

-- Indexes for api_usage
CREATE INDEX idx_api_usage_key ON api_usage(api_key_id);
CREATE INDEX idx_api_usage_tenant ON api_usage(tenant_id);
CREATE INDEX idx_api_usage_hour_bucket ON api_usage(api_key_id, hour_bucket);

-- TABLE 21: webhook_subscriptions (Event subscriptions)
CREATE TABLE webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Webhook Info
  url TEXT NOT NULL,
  events TEXT[] NOT NULL, -- ['artifact.created', 'workspace.updated', etc.]
  
  -- Security
  secret TEXT NOT NULL, -- For HMAC signature
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE, -- URL verification challenge passed
  
  -- Failure Tracking
  consecutive_failures INT DEFAULT 0,
  last_failure_at TIMESTAMPTZ,
  
  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for webhook_subscriptions
CREATE INDEX idx_webhooks_tenant ON webhook_subscriptions(tenant_id);
CREATE INDEX idx_webhooks_active ON webhook_subscriptions(is_active) WHERE is_active = TRUE;

-- TABLE 22: webhook_deliveries (Delivery tracking)
CREATE TABLE webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES webhook_subscriptions(id) ON DELETE CASCADE,
  
  -- Event Details
  event_type TEXT NOT NULL,
  event_payload JSONB NOT NULL,
  
  -- Delivery Status
  status TEXT NOT NULL, -- pending, delivered, failed
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  
  -- Response
  http_status_code INT,
  response_body TEXT,
  error_message TEXT,
  
  -- Timing
  created_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  next_retry_at TIMESTAMPTZ
);

-- Indexes for webhook_deliveries
CREATE INDEX idx_webhook_deliveries_subscription ON webhook_deliveries(subscription_id);
CREATE INDEX idx_webhook_deliveries_status ON webhook_deliveries(status);
CREATE INDEX idx_webhook_deliveries_next_retry ON webhook_deliveries(next_retry_at) WHERE status = 'pending';

-- Enable RLS on V4 tables (selective)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for V4
CREATE POLICY "Users can view API keys in their tenant"
  ON api_keys FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY "Architects can manage API keys"
  ON api_keys FOR ALL
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::UUID
    AND current_setting('app.current_user_role', true) IN ('ARCHITECT')
  );

CREATE POLICY "Users can view webhooks in their tenant"
  ON webhook_subscriptions FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY "Architects can manage webhooks"
  ON webhook_subscriptions FOR ALL
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::UUID
    AND current_setting('app.current_user_role', true) IN ('ARCHITECT')
  );

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ V4 Federation tables created: 6 tables (tenant_relationships, federation_audit_logs, api_keys, api_usage, webhook_subscriptions, webhook_deliveries)';
END $$;
```

---

## ⚙️ Phase 8: Database Functions & Triggers (3 minutes)

### Step 8.1: Auto-Update Timestamps

```sql
-- ============================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_embeddings_updated_at BEFORE UPDATE ON content_embeddings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_retention_policies_updated_at BEFORE UPDATE ON retention_policies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE '⏰ Timestamp triggers created for 5 tables';
END $$;
```

### Step 8.2: Auto-Create Compliance Audit Logs

```sql
-- ============================================
-- AUTO-AUDIT LOGGING FOR FILES
-- ============================================

CREATE OR REPLACE FUNCTION log_file_changes()
RETURNS TRIGGER AS $$
DECLARE
  v_action TEXT;
BEGIN
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    v_action := 'file_created';
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'file_updated';
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'file_deleted';
  END IF;

  -- Insert audit log
  INSERT INTO compliance_audit_logs (
    tenant_id,
    event_type,
    event_category,
    actor_id,
    target_type,
    target_id,
    target_name,
    before_state,
    after_state
  ) VALUES (
    COALESCE(NEW.tenant_id, OLD.tenant_id),
    v_action,
    'file_management',
    current_setting('app.current_user_id', true)::UUID,
    'file',
    COALESCE(NEW.id, OLD.id),
    COALESCE(NEW.name, OLD.name),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger to files
CREATE TRIGGER audit_file_changes
  AFTER INSERT OR UPDATE OR DELETE ON files
  FOR EACH ROW EXECUTE FUNCTION log_file_changes();

-- Success message
DO $$
BEGIN
  RAISE NOTICE '📝 Audit logging triggers created';
END $$;
```

---

# PART 2: Document Control Add-on

## 📋 Phase 9: Document Control Schema (7 minutes)

### Step 9.1: Create Document Control Tables

Create a **new SQL query** named "Document Control Schema":

```sql
-- ============================================
-- DOCUMENT CONTROL ADD-ON - SCHEMA
-- ============================================

-- TABLE 23: document_libraries
CREATE TABLE document_libraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Basic Info
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  
  -- Numbering
  numbering_prefix TEXT NOT NULL,
  next_number INTEGER DEFAULT 1,
  
  -- Compliance
  compliance_standard TEXT,
  requires_acknowledgement BOOLEAN DEFAULT true,
  acknowledgement_threshold INTEGER DEFAULT 80,
  
  -- Access Control
  is_private BOOLEAN DEFAULT false,
  allowed_roles TEXT[] DEFAULT ARRAY['ARCHITECT', 'CURATOR'],
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT unique_library_name UNIQUE (tenant_id, name)
);

CREATE INDEX idx_libraries_tenant ON document_libraries(tenant_id);
CREATE INDEX idx_libraries_compliance ON document_libraries(compliance_standard);

-- TABLE 24: controlled_documents
CREATE TABLE controlled_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  library_id UUID NOT NULL REFERENCES document_libraries(id) ON DELETE CASCADE,
  
  -- Identification
  document_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  document_type TEXT NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft',
  version TEXT DEFAULT '1.0',
  
  -- Lifecycle Dates
  effective_date TIMESTAMPTZ,
  review_due_date TIMESTAMPTZ,
  expiration_date TIMESTAMPTZ,
  
  -- Ownership
  owner_id UUID REFERENCES users(id),
  author_id UUID REFERENCES users(id),
  
  -- Health Metrics
  health_score INTEGER DEFAULT 0,
  health_level TEXT,
  last_health_check TIMESTAMPTZ,
  
  -- Compliance
  requires_signature BOOLEAN DEFAULT false,
  is_superseded_by UUID REFERENCES controlled_documents(id),
  supersedes UUID REFERENCES controlled_documents(id),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES users(id),
  published_at TIMESTAMPTZ,
  published_by UUID REFERENCES users(id),
  deleted_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT unique_document_number UNIQUE (tenant_id, document_number),
  CONSTRAINT valid_health_score CHECK (health_score >= 0 AND health_score <= 100)
);

CREATE INDEX idx_documents_tenant ON controlled_documents(tenant_id);
CREATE INDEX idx_documents_library ON controlled_documents(library_id);
CREATE INDEX idx_documents_status ON controlled_documents(status);
CREATE INDEX idx_documents_health ON controlled_documents(health_score);

-- TABLE 25: document_versions
CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES controlled_documents(id) ON DELETE CASCADE,
  
  -- Version Info
  version TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  parent_version_id UUID REFERENCES document_versions(id),
  content_id UUID,
  
  -- Changes
  change_description TEXT,
  change_type TEXT,
  diff_summary JSONB,
  contributors UUID[] DEFAULT ARRAY[]::UUID[],
  
  -- Status
  is_current BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  
  CONSTRAINT unique_version_number UNIQUE (document_id, version_number)
);

CREATE INDEX idx_versions_document ON document_versions(document_id);

-- TABLE 26: document_content
CREATE TABLE document_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES controlled_documents(id) ON DELETE CASCADE,
  
  -- Storage
  storage_provider TEXT NOT NULL DEFAULT 'supabase',
  storage_path TEXT NOT NULL,
  storage_bucket TEXT,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  checksum TEXT,
  
  -- Metadata
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES users(id)
);

CREATE INDEX idx_content_document ON document_content(document_id);

-- TABLE 27: document_numbering_sequences
CREATE TABLE document_numbering_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  library_id UUID NOT NULL REFERENCES document_libraries(id) ON DELETE CASCADE,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  next_sequence INTEGER DEFAULT 1,
  format_template TEXT DEFAULT '{prefix}-{year}-{seq:04d}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_library_year UNIQUE (library_id, year)
);

-- TABLE 28: approval_workflows
CREATE TABLE approval_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  library_id UUID REFERENCES document_libraries(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  routing_type TEXT DEFAULT 'sequential',
  sla_hours INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_workflow_name UNIQUE (tenant_id, name)
);

-- TABLE 29: approval_stages
CREATE TABLE approval_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES approval_workflows(id) ON DELETE CASCADE,
  
  stage_name TEXT NOT NULL,
  stage_order INTEGER NOT NULL,
  required_approvers UUID[] NOT NULL,
  approver_count_required INTEGER DEFAULT 1,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stages_workflow ON approval_stages(workflow_id, stage_order);

-- TABLE 30: approval_instances
CREATE TABLE approval_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES controlled_documents(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES approval_workflows(id),
  
  status TEXT NOT NULL DEFAULT 'pending',
  current_stage_id UUID REFERENCES approval_stages(id),
  current_stage_order INTEGER DEFAULT 1,
  stages_completed INTEGER DEFAULT 0,
  total_stages INTEGER NOT NULL,
  
  started_at TIMESTAMPTZ DEFAULT NOW(),
  due_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_instances_document ON approval_instances(document_id);

-- TABLE 31: approval_actions
CREATE TABLE approval_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  instance_id UUID NOT NULL REFERENCES approval_instances(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES approval_stages(id),
  
  action TEXT NOT NULL,
  actor_id UUID NOT NULL REFERENCES users(id),
  comments TEXT,
  signature_data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_actions_instance ON approval_actions(instance_id);

-- TABLE 32: acknowledgements
CREATE TABLE acknowledgements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES controlled_documents(id) ON DELETE CASCADE,
  version_id UUID REFERENCES document_versions(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMPTZ,
  signature_data JSONB,
  
  opened_at TIMESTAMPTZ,
  last_opened_at TIMESTAMPTZ,
  open_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_user_document_version UNIQUE (user_id, document_id, version_id)
);

CREATE INDEX idx_ack_document ON acknowledgements(document_id);
CREATE INDEX idx_ack_user ON acknowledgements(user_id);
CREATE INDEX idx_ack_pending ON acknowledgements(acknowledged) WHERE acknowledged = false;

-- TABLE 33: compliance_standards
CREATE TABLE compliance_standards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  requires_acknowledgement BOOLEAN DEFAULT true,
  requires_signature BOOLEAN DEFAULT false,
  min_acknowledgement_rate INTEGER DEFAULT 80,
  max_review_cycle_days INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed compliance standards
INSERT INTO compliance_standards (code, name, description, requires_signature, min_acknowledgement_rate, max_review_cycle_days) VALUES
  ('ISO_9001', 'ISO 9001:2015 Quality Management', 'International standard for quality management systems', false, 95, 365),
  ('FDA_21_CFR_PART_11', 'FDA 21 CFR Part 11', 'Electronic records and electronic signatures', true, 100, 365),
  ('SOC_2', 'SOC 2 Type II', 'Service Organization Control', false, 90, 365),
  ('GDPR', 'GDPR Data Protection', 'General Data Protection Regulation', false, 95, 730),
  ('HIPAA', 'HIPAA Privacy & Security', 'Health Insurance Portability and Accountability Act', true, 100, 365)
ON CONFLICT (code) DO NOTHING;

-- TABLE 34: compliance_gaps
CREATE TABLE compliance_gaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  document_id UUID REFERENCES controlled_documents(id) ON DELETE CASCADE,
  library_id UUID REFERENCES document_libraries(id) ON DELETE CASCADE,
  
  gap_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open',
  
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id),
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gaps_tenant ON compliance_gaps(tenant_id);
CREATE INDEX idx_gaps_severity ON compliance_gaps(severity);

-- TABLE 35: document_audit_logs
CREATE TABLE document_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  document_id UUID REFERENCES controlled_documents(id) ON DELETE SET NULL,
  
  action TEXT NOT NULL,
  actor_id UUID NOT NULL REFERENCES users(id),
  ip_address INET,
  user_agent TEXT,
  before_state JSONB,
  after_state JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_doc_audit_tenant ON document_audit_logs(tenant_id);
CREATE INDEX idx_doc_audit_document ON document_audit_logs(document_id);
CREATE INDEX idx_doc_audit_created ON document_audit_logs(created_at DESC);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Document Control tables created: 13 tables + 5 compliance standards seeded';
END $$;
```

---

## 🔐 Phase 10: Document Control RLS (2 minutes)

```sql
-- ============================================
-- DOCUMENT CONTROL - ROW-LEVEL SECURITY
-- ============================================

-- Enable RLS on all Document Control tables
ALTER TABLE document_libraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE controlled_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_numbering_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE acknowledgements ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for document_libraries
CREATE POLICY "Users can view libraries in their tenant"
  ON document_libraries FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY "Architects can manage libraries"
  ON document_libraries FOR ALL
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::UUID
    AND current_setting('app.current_user_role', true) IN ('ARCHITECT', 'CURATOR')
  );

-- Policies for controlled_documents
CREATE POLICY "Users can view documents in their tenant"
  ON controlled_documents FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY "Users can create documents"
  ON controlled_documents FOR INSERT
  WITH CHECK (
    tenant_id = current_setting('app.current_tenant_id', true)::UUID
    AND current_setting('app.current_user_role', true) IN ('ARCHITECT', 'CURATOR', 'CONTRIBUTOR')
  );

CREATE POLICY "Owners and architects can update documents"
  ON controlled_documents FOR UPDATE
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::UUID
    AND (
      owner_id = current_setting('app.current_user_id', true)::UUID
      OR current_setting('app.current_user_role', true) IN ('ARCHITECT', 'CURATOR')
    )
  );

-- Policies for versions, content, workflows, etc.
CREATE POLICY "Users can view versions in their tenant"
  ON document_versions FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY "Users can view content in their tenant"
  ON document_content FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY "Users can view workflows in their tenant"
  ON approval_workflows FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY "Users can view stages in their tenant"
  ON approval_stages FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY "Users can view instances in their tenant"
  ON approval_instances FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY "Users can view actions in their tenant"
  ON approval_actions FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Policies for acknowledgements
CREATE POLICY "Users can view acknowledgements in their tenant"
  ON acknowledgements FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY "Users can acknowledge documents"
  ON acknowledgements FOR UPDATE
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::UUID
    AND user_id = current_setting('app.current_user_id', true)::UUID
  );

-- Policies for compliance_standards (public read)
CREATE POLICY "Anyone can view standards"
  ON compliance_standards FOR SELECT
  USING (true);

-- Policies for compliance_gaps
CREATE POLICY "Users can view gaps in their tenant"
  ON compliance_gaps FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Policies for document_audit_logs (immutable, architect-only)
CREATE POLICY "Architects can view document audit logs"
  ON document_audit_logs FOR SELECT
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::UUID
    AND current_setting('app.current_user_role', true) IN ('ARCHITECT', 'CURATOR', 'AUDITOR')
  );

CREATE POLICY "Document audit logs cannot be modified"
  ON document_audit_logs FOR UPDATE
  USING (false);

CREATE POLICY "Document audit logs cannot be deleted"
  ON document_audit_logs FOR DELETE
  USING (false);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '🔐 RLS enabled and policies created for 13 Document Control tables';
END $$;
```

---

## ⚙️ Phase 11: Document Control Functions (2 minutes)

```sql
-- ============================================
-- DOCUMENT CONTROL - FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-generate document numbers
CREATE OR REPLACE FUNCTION generate_document_number(
  p_library_id UUID,
  p_tenant_id UUID
) RETURNS TEXT AS $$
DECLARE
  v_prefix TEXT;
  v_year INTEGER;
  v_sequence INTEGER;
  v_document_number TEXT;
BEGIN
  -- Get library prefix
  SELECT numbering_prefix INTO v_prefix
  FROM document_libraries
  WHERE id = p_library_id;

  -- Get current year
  v_year := EXTRACT(YEAR FROM NOW());

  -- Get or create sequence for this library + year
  INSERT INTO document_numbering_sequences (tenant_id, library_id, year, next_sequence)
  VALUES (p_tenant_id, p_library_id, v_year, 1)
  ON CONFLICT (library_id, year) DO NOTHING;

  -- Increment and get next sequence number
  UPDATE document_numbering_sequences
  SET next_sequence = next_sequence + 1
  WHERE library_id = p_library_id AND year = v_year
  RETURNING next_sequence - 1 INTO v_sequence;

  -- Generate document number
  v_document_number := v_prefix || '-' || v_year::TEXT || '-' || LPAD(v_sequence::TEXT, 4, '0');

  RETURN v_document_number;
END;
$$ LANGUAGE plpgsql;

-- Auto-audit document changes
CREATE OR REPLACE FUNCTION log_document_changes()
RETURNS TRIGGER AS $$
DECLARE
  v_action TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'created';
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'updated';
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'deleted';
  END IF;

  INSERT INTO document_audit_logs (
    tenant_id,
    document_id,
    action,
    actor_id,
    before_state,
    after_state
  ) VALUES (
    COALESCE(NEW.tenant_id, OLD.tenant_id),
    COALESCE(NEW.id, OLD.id),
    v_action,
    current_setting('app.current_user_id', true)::UUID,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger
CREATE TRIGGER audit_document_changes
  AFTER INSERT OR UPDATE OR DELETE ON controlled_documents
  FOR EACH ROW EXECUTE FUNCTION log_document_changes();

-- Auto-update timestamps for document control tables
CREATE TRIGGER update_libraries_updated_at BEFORE UPDATE ON document_libraries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON controlled_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON approval_workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Document Control functions and triggers created';
END $$;
```

---

# PART 3: Integration & Testing

## 🔌 Phase 12: Environment Setup (3 minutes)

### Step 12.1: Install Dependencies

In your Aethos project terminal:

```bash
npm install @supabase/supabase-js
```

### Step 12.2: Create Environment Variables

Create/edit `.env` in your project root:

```env
# ============================================
# SUPABASE CONNECTION
# ============================================
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key

# ============================================
# MICROSOFT ENTRA ID (V1 CORE)
# ============================================
VITE_MICROSOFT_CLIENT_ID=your-azure-app-id
VITE_MICROSOFT_TENANT_ID=your-azure-tenant-id
MICROSOFT_CLIENT_SECRET=your-azure-secret

# ============================================
# OPENAI (V1.5 AI+)
# ============================================
OPENAI_API_KEY=sk-your-openai-key
VITE_ENABLE_AI_FEATURES=true

# ============================================
# SLACK (V2 MULTI-PROVIDER)
# ============================================
SLACK_CLIENT_ID=your-slack-client-id
SLACK_CLIENT_SECRET=your-slack-secret

# ============================================
# GOOGLE WORKSPACE (V2 MULTI-PROVIDER)
# ============================================
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret

# ============================================
# FEATURE FLAGS
# ============================================
VITE_ENABLE_V1=true
VITE_ENABLE_V15_AI=true
VITE_ENABLE_V2_PROVIDERS=true
VITE_ENABLE_V3_GOVERNANCE=true
VITE_ENABLE_V4_FEDERATION=false
VITE_ENABLE_DOCUMENT_CONTROL=true

# ============================================
# DEMO/TESTING
# ============================================
VITE_DEMO_TENANT_ID=00000000-0000-0000-0000-000000000001
VITE_DEMO_USER_ID=11111111-1111-1111-1111-111111111111
```

**⚠️ Replace all placeholder values with your actual credentials!**

---

## 🧪 Phase 13: Frontend Integration (5 minutes)

### Step 13.1: Create Supabase Client

Create file: `/src/app/utils/supabaseClient.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
});

// Helper to set tenant context before queries
export async function setTenantContext(
  tenantId: string,
  userId: string,
  userRole: 'ARCHITECT' | 'CURATOR' | 'CONTRIBUTOR' | 'AUDITOR'
) {
  const { error } = await supabase.rpc('set_tenant_context', {
    p_tenant_id: tenantId,
    p_user_id: userId,
    p_user_role: userRole,
  });

  if (error) {
    console.error('Failed to set tenant context:', error);
    throw error;
  }
}

// Expose to window for testing (dev only)
if (import.meta.env.DEV) {
  (window as any).supabase = supabase;
  (window as any).setTenantContext = setTenantContext;
}
```

---

## ✅ Phase 14: Testing & Verification (5 minutes)

### Test 1: Verify Database Tables

In Supabase SQL Editor:

```sql
-- Count all tables
SELECT 
  schemaname,
  COUNT(*) as table_count
FROM pg_tables 
WHERE schemaname = 'public'
GROUP BY schemaname;
```

**Expected:** ~35 tables total

### Test 2: Verify Extensions

```sql
SELECT extname, extversion 
FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'pg_trgm', 'vector');
```

**Expected:** All 3 extensions installed

### Test 3: Test Tenant Context

In browser console:

```javascript
// Set tenant context
await window.setTenantContext(
  '00000000-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'ARCHITECT'
);

// Query files (should return empty array for new tenant)
const { data, error } = await window.supabase
  .from('files')
  .select('*')
  .limit(10);

console.log('Files:', data); // Should be []
console.log('Error:', error); // Should be null
```

### Test 4: Test Document Control

```javascript
// Query compliance standards (should be seeded)
const { data: standards } = await window.supabase
  .from('compliance_standards')
  .select('*');

console.log('Standards:', standards); // Should show 5 standards
```

### Test 5: Create First Tenant

```javascript
// Insert a demo tenant
const { data: tenant, error } = await window.supabase
  .from('tenants')
  .insert([{
    name: 'Demo Company',
    subscription_tier: 'v1',
    subscription_status: 'trial'
  }])
  .select()
  .single();

console.log('Tenant created:', tenant);
```

---

## 📊 Database Summary

### **Complete Table Count: 35 Tables**

#### **Base Aethos Platform (22 tables):**
- **V1 Core (8):** tenants, users, files, sites, workspaces, workspace_items, remediation_actions, discovery_scans
- **V1.5 AI+ (3):** content_embeddings, content_summaries, pii_detections
- **V2 Providers (1):** provider_connections
- **V3 Governance (4):** retention_policies, compliance_audit_logs, anomaly_detections, storage_snapshots
- **V4 Federation (6):** tenant_relationships, federation_audit_logs, api_keys, api_usage, webhook_subscriptions, webhook_deliveries

#### **Document Control Add-on (13 tables):**
- document_libraries, controlled_documents, document_versions, document_content, document_numbering_sequences, approval_workflows, approval_stages, approval_instances, approval_actions, acknowledgements, compliance_standards, compliance_gaps, document_audit_logs

### **PostgreSQL Extensions (3):**
- ✅ `uuid-ossp` - UUID generation
- ✅ `pg_trgm` - Full-text search
- ✅ `vector` - Semantic similarity search (pgvector)

### **Database Functions (4):**
1. `set_tenant_context()` - Multi-tenant RLS
2. `update_updated_at_column()` - Auto-update timestamps
3. `log_file_changes()` - Auto-audit files
4. `log_document_changes()` - Auto-audit documents
5. `generate_document_number()` - Auto-number documents

### **RLS Policies:** ~50+ policies across all tables

---

## 🚨 Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution:** Check `.env` file exists in project root and variables start with `VITE_`

### Issue: "RLS policy violation"
**Solution:** Always call `setTenantContext()` before queries

### Issue: "Extension vector does not exist"
**Solution:** Run `CREATE EXTENSION IF NOT EXISTS vector;` in SQL Editor

### Issue: "Connection timeout"
**Solution:** Check Supabase project is not paused (free tier pauses after 7 days inactivity)

### Issue: "Cannot find module @supabase/supabase-js"
**Solution:** Run `npm install @supabase/supabase-js`

---

## 💰 Cost Projections

### **Free Tier (Good for 0-100 tenants)**
- **Database:** 500 MB (good for ~5,000 files + 1,000 documents)
- **Storage:** 1 GB (metadata only, files stored in M365)
- **Bandwidth:** 2 GB/month
- **Cost:** $0/month

### **Pro Tier ($25/mo - Good for 100-1,000 tenants)**
- **Database:** 8 GB (good for ~50,000 files + 10,000 documents)
- **Storage:** 100 GB
- **Bandwidth:** 250 GB/month
- **Cost:** $25/month

### **Upgrade Triggers:**
- 🟡 **500 MB database usage** → Consider Pro
- 🟠 **5,000+ files** → Pro recommended
- 🔴 **10,000+ files or 1,000+ documents** → Pro required

---

## 🎉 Congratulations!

You now have a **complete, production-ready Supabase database** for:

### ✅ **Base Aethos Platform (V1-V4):**
- Multi-tenant Microsoft 365 discovery
- AI-powered content intelligence
- Multi-provider integration (Slack, Google, Box)
- Automated governance & compliance
- Cross-tenant federation & public API
- Real-time webhooks

### ✅ **Document Control Add-on:**
- Document libraries with compliance standards
- Auto-numbering (e.g., POL-HR-2026-0001)
- Multi-stage approval workflows
- Git-like version control
- User acknowledgement tracking
- ISO 9001, FDA, SOC 2, GDPR, HIPAA support
- Immutable audit logging

---

**Total Setup Time:** 30-45 minutes  
**Tables Created:** 35  
**Extensions Enabled:** 3  
**Functions Created:** 5  
**RLS Policies:** 50+  
**Cost:** $0 (free tier)

---

**Next Steps:**
1. Test creating workspaces and files
2. Enable Microsoft Graph API integration
3. Test Document Control workflows
4. Set up email notifications
5. Configure Microsoft Entra ID authentication

**Need Help?**
- 📚 [Supabase Docs](https://supabase.com/docs)
- 📋 [Aethos Backend Guide](/docs/BACKEND_V1_V4_COMPLETE.md)
- 🔧 [API Reference](/docs/API_QUICK_REFERENCE.md)

---

**Status:** ✅ Production Ready  
**Last Updated:** April 6, 2026  
**Version:** 2.0 Master Edition
