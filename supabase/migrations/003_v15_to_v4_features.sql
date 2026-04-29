/**
 * Database Migration: V1.5 → V4 Features
 * 
 * PURPOSE: Add database schema for AI+, Multi-Provider, Governance, and Federation features
 * VERSION: V1.5, V2, V3, V4
 * 
 * TABLES CREATED:
 * - content_embeddings (V1.5)
 * - content_summaries (V1.5)
 * - pii_detections (V1.5)
 * - provider_connections (V2)
 * - retention_policies (V3)
 * - compliance_audit_logs (V3)
 * - anomaly_detections (V3)
 * - storage_snapshots (V3)
 * - tenant_relationships (V4)
 * - federation_audit_logs (V4)
 * - api_keys (V4)
 * - api_usage (V4)
 * - webhook_subscriptions (V4)
 * - webhook_deliveries (V4)
 */

-- ============================================================================
-- V1.5 AI+ CONTENT INTELLIGENCE TABLES
-- ============================================================================

-- Content Embeddings (for semantic search)
CREATE TABLE IF NOT EXISTS content_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  artifact_id UUID NOT NULL REFERENCES artifacts(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding vector(1536), -- OpenAI text-embedding-3-small dimension
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_artifact_chunk UNIQUE (artifact_id, chunk_index)
);

CREATE INDEX idx_embeddings_tenant ON content_embeddings(tenant_id);
CREATE INDEX idx_embeddings_artifact ON content_embeddings(artifact_id);
CREATE INDEX idx_embeddings_vector ON content_embeddings USING ivfflat (embedding vector_cosine_ops);

-- RLS for content_embeddings
ALTER TABLE content_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY content_embeddings_tenant_isolation ON content_embeddings
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Content Summaries (cached AI summaries)
CREATE TABLE IF NOT EXISTS content_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  artifact_id UUID NOT NULL REFERENCES artifacts(id) ON DELETE CASCADE,
  summary_type VARCHAR(50) NOT NULL, -- 'concise' or 'detailed'
  summary TEXT NOT NULL,
  key_points TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_summaries_tenant ON content_summaries(tenant_id);
CREATE INDEX idx_summaries_artifact ON content_summaries(artifact_id);

ALTER TABLE content_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY content_summaries_tenant_isolation ON content_summaries
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- PII Detections
CREATE TABLE IF NOT EXISTS pii_detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  artifact_id UUID NOT NULL REFERENCES artifacts(id) ON DELETE CASCADE,
  risk_level VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high'
  risk_score INTEGER NOT NULL,
  pattern_findings JSONB,
  ai_detected_types TEXT[],
  total_findings INTEGER NOT NULL,
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pii_tenant ON pii_detections(tenant_id);
CREATE INDEX idx_pii_artifact ON pii_detections(artifact_id);
CREATE INDEX idx_pii_risk ON pii_detections(risk_level);

ALTER TABLE pii_detections ENABLE ROW LEVEL SECURITY;

CREATE POLICY pii_detections_tenant_isolation ON pii_detections
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Update artifacts table for AI+ features
ALTER TABLE artifacts ADD COLUMN IF NOT EXISTS content_indexed BOOLEAN DEFAULT FALSE;
ALTER TABLE artifacts ADD COLUMN IF NOT EXISTS content_chunk_count INTEGER DEFAULT 0;
ALTER TABLE artifacts ADD COLUMN IF NOT EXISTS last_indexed_at TIMESTAMPTZ;
ALTER TABLE artifacts ADD COLUMN IF NOT EXISTS has_pii BOOLEAN DEFAULT FALSE;
ALTER TABLE artifacts ADD COLUMN IF NOT EXISTS pii_risk_level VARCHAR(20);

-- ============================================================================
-- V2 MULTI-PROVIDER INTEGRATION TABLES
-- ============================================================================

-- Provider Connections (Slack, Google Workspace, Box)
CREATE TABLE IF NOT EXISTS provider_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'slack', 'google', 'box'
  workspace_id VARCHAR(255) NOT NULL,
  workspace_name VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL, -- Should be encrypted in production
  refresh_token TEXT,
  bot_user_id VARCHAR(255),
  expires_at TIMESTAMPTZ,
  scope TEXT,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'revoked'
  CONSTRAINT unique_provider_workspace UNIQUE (tenant_id, provider, workspace_id)
);

CREATE INDEX idx_provider_conn_tenant ON provider_connections(tenant_id);
CREATE INDEX idx_provider_conn_provider ON provider_connections(provider);

ALTER TABLE provider_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY provider_connections_tenant_isolation ON provider_connections
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Update tenants table for multi-provider features
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS slack_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS google_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS box_enabled BOOLEAN DEFAULT FALSE;

-- ============================================================================
-- V3 GOVERNANCE & COMPLIANCE TABLES
-- ============================================================================

-- Retention Policies
CREATE TABLE IF NOT EXISTS retention_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  rule_type VARCHAR(50) NOT NULL, -- 'inactivity', 'age', 'tag', 'location', 'custom'
  rule_criteria JSONB NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'archive', 'soft_delete', 'hard_delete', 'flag', 'notify'
  schedule VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
  enabled BOOLEAN DEFAULT TRUE,
  compliance_framework VARCHAR(50), -- 'gdpr', 'hipaa', 'soc2', 'iso27001'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_retention_tenant ON retention_policies(tenant_id);
CREATE INDEX idx_retention_enabled ON retention_policies(enabled);

ALTER TABLE retention_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY retention_policies_tenant_isolation ON retention_policies
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Compliance Audit Logs
CREATE TABLE IF NOT EXISTS compliance_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  policy_id UUID REFERENCES retention_policies(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  artifacts_affected INTEGER NOT NULL,
  artifact_ids UUID[],
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  execution_type VARCHAR(20) NOT NULL, -- 'automated', 'manual'
  executed_by UUID REFERENCES users(id)
);

CREATE INDEX idx_audit_tenant ON compliance_audit_logs(tenant_id);
CREATE INDEX idx_audit_policy ON compliance_audit_logs(policy_id);
CREATE INDEX idx_audit_date ON compliance_audit_logs(executed_at);

ALTER TABLE compliance_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY compliance_audit_tenant_isolation ON compliance_audit_logs
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Anomaly Detections
CREATE TABLE IF NOT EXISTS anomaly_detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  anomaly_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
  description TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  affected_artifact_ids UUID[],
  recommendation TEXT,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'acknowledged', 'resolved'
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id)
);

CREATE INDEX idx_anomaly_tenant ON anomaly_detections(tenant_id);
CREATE INDEX idx_anomaly_severity ON anomaly_detections(severity);
CREATE INDEX idx_anomaly_status ON anomaly_detections(status);

ALTER TABLE anomaly_detections ENABLE ROW LEVEL SECURITY;

CREATE POLICY anomaly_detections_tenant_isolation ON anomaly_detections
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Storage Snapshots (for anomaly detection baseline)
CREATE TABLE IF NOT EXISTS storage_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  total_bytes BIGINT NOT NULL,
  artifact_count INTEGER NOT NULL,
  provider_breakdown JSONB, -- { "microsoft": 1000000, "slack": 500000 }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_tenant_snapshot_date UNIQUE (tenant_id, snapshot_date)
);

CREATE INDEX idx_snapshots_tenant ON storage_snapshots(tenant_id);
CREATE INDEX idx_snapshots_date ON storage_snapshots(snapshot_date);

ALTER TABLE storage_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY storage_snapshots_tenant_isolation ON storage_snapshots
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Update artifacts table for compliance features
ALTER TABLE artifacts ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;
ALTER TABLE artifacts ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE artifacts ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE artifacts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE artifacts ADD COLUMN IF NOT EXISTS delete_scheduled_for TIMESTAMPTZ;
ALTER TABLE artifacts ADD COLUMN IF NOT EXISTS compliance_flagged BOOLEAN DEFAULT FALSE;

-- ============================================================================
-- V4 FEDERATION & ECOSYSTEM TABLES
-- ============================================================================

-- Tenant Relationships (for MSP multi-tenant management)
CREATE TABLE IF NOT EXISTS tenant_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  child_tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50) NOT NULL, -- 'managed', 'subsidiary', 'partner'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_tenant_relationship UNIQUE (parent_tenant_id, child_tenant_id),
  CONSTRAINT no_self_relationship CHECK (parent_tenant_id != child_tenant_id)
);

CREATE INDEX idx_tenant_rel_parent ON tenant_relationships(parent_tenant_id);
CREATE INDEX idx_tenant_rel_child ON tenant_relationships(child_tenant_id);

-- Federation Audit Logs
CREATE TABLE IF NOT EXISTS federation_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  msp_tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  query TEXT,
  tenants_searched INTEGER,
  tenants_with_matches INTEGER,
  total_results INTEGER,
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  executed_by UUID REFERENCES users(id)
);

CREATE INDEX idx_federation_audit_msp ON federation_audit_logs(msp_tenant_id);
CREATE INDEX idx_federation_audit_date ON federation_audit_logs(executed_at);

-- API Keys (for public REST API)
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash TEXT NOT NULL UNIQUE, -- Hashed API key
  monthly_limit INTEGER DEFAULT 10000,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'revoked'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  last_used_at TIMESTAMPTZ
);

CREATE INDEX idx_api_keys_tenant ON api_keys(tenant_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY api_keys_tenant_isolation ON api_keys
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- API Usage Tracking
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  month VARCHAR(7) NOT NULL, -- 'YYYY-MM'
  calls_this_month INTEGER DEFAULT 0,
  CONSTRAINT unique_api_usage_month UNIQUE (api_key_id, month)
);

CREATE INDEX idx_api_usage_key ON api_usage(api_key_id);
CREATE INDEX idx_api_usage_month ON api_usage(month);

-- Webhook Subscriptions
CREATE TABLE IF NOT EXISTS webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_types TEXT[] NOT NULL,
  url TEXT NOT NULL,
  secret TEXT NOT NULL, -- For HMAC signature verification
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_webhooks_tenant ON webhook_subscriptions(tenant_id);
CREATE INDEX idx_webhooks_enabled ON webhook_subscriptions(enabled);

ALTER TABLE webhook_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY webhook_subscriptions_tenant_isolation ON webhook_subscriptions
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Webhook Deliveries (for monitoring and retries)
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES webhook_subscriptions(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'success', 'failed'
  attempt INTEGER NOT NULL,
  error_message TEXT,
  delivered_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_del_sub ON webhook_deliveries(subscription_id);
CREATE INDEX idx_webhook_del_status ON webhook_deliveries(status);
CREATE INDEX idx_webhook_del_date ON webhook_deliveries(delivered_at);

-- Update tenants table for federation features
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS federation_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS api_access_enabled BOOLEAN DEFAULT FALSE;

-- ============================================================================
-- POSTGRESQL FUNCTIONS FOR V1.5-V4
-- ============================================================================

-- Semantic Search Function (uses pgvector cosine similarity)
CREATE OR REPLACE FUNCTION semantic_search(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  tenant_id_filter uuid
)
RETURNS TABLE (
  artifact_id uuid,
  chunk_index int,
  chunk_text text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ce.artifact_id,
    ce.chunk_index,
    ce.chunk_text,
    1 - (ce.embedding <=> query_embedding) AS similarity
  FROM content_embeddings ce
  WHERE ce.tenant_id = tenant_id_filter
    AND 1 - (ce.embedding <=> query_embedding) > match_threshold
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Find Orphaned Artifacts (not in any workspace)
CREATE OR REPLACE FUNCTION find_orphaned_artifacts(tenant_id_param uuid)
RETURNS TABLE (
  id uuid,
  name text,
  provider varchar(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.name, a.provider
  FROM artifacts a
  WHERE a.tenant_id = tenant_id_param
    AND NOT EXISTS (
      SELECT 1 FROM workspace_artifacts wa WHERE wa.artifact_id = a.id
    );
END;
$$;

-- Increment API Usage Counter (atomic operation)
CREATE OR REPLACE FUNCTION increment_api_usage(
  api_key_id_param uuid,
  month_param varchar(7)
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO api_usage (api_key_id, month, calls_this_month)
  VALUES (api_key_id_param, month_param, 1)
  ON CONFLICT (api_key_id, month)
  DO UPDATE SET calls_this_month = api_usage.calls_this_month + 1;
END;
$$;

-- ============================================================================
-- COMPLETE
-- ============================================================================

COMMENT ON TABLE content_embeddings IS 'V1.5: Vector embeddings for semantic search';
COMMENT ON TABLE provider_connections IS 'V2: Multi-provider OAuth connections';
COMMENT ON TABLE retention_policies IS 'V3: Automated retention and compliance policies';
COMMENT ON TABLE tenant_relationships IS 'V4: MSP multi-tenant federation relationships';
COMMENT ON TABLE api_keys IS 'V4: Public REST API access keys';
COMMENT ON TABLE webhook_subscriptions IS 'V4: Real-time event webhook subscriptions';
