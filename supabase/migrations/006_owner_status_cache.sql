-- ============================================================================
-- Owner Status Cache
-- ============================================================================
-- V1.5 foundation: stores Entra owner status lookups when Microsoft Graph
-- permissions allow. This is required before Aethos can claim inactive or
-- departed-owner detection.

CREATE TABLE IF NOT EXISTS owner_status_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  owner_email TEXT NOT NULL,
  owner_name TEXT,
  microsoft_user_id TEXT,
  user_principal_name TEXT,
  account_enabled BOOLEAN,
  user_type TEXT,
  status TEXT NOT NULL DEFAULT 'unknown'
    CHECK (status IN ('active', 'disabled', 'deleted', 'guest', 'unknown', 'not_found', 'permission_required', 'error')),
  lookup_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (lookup_status IN ('pending', 'completed', 'not_found', 'permission_required', 'error')),
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  error_message TEXT,
  raw_response JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(tenant_id, owner_email)
);

CREATE INDEX IF NOT EXISTS idx_owner_status_cache_tenant
  ON owner_status_cache(tenant_id, last_checked_at DESC);

CREATE INDEX IF NOT EXISTS idx_owner_status_cache_status
  ON owner_status_cache(tenant_id, status, last_checked_at DESC);

ALTER TABLE owner_status_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY owner_status_cache_tenant_isolation ON owner_status_cache
  FOR ALL USING (
    tenant_id = current_setting('app.current_tenant_id', true)::uuid
  );

COMMENT ON TABLE owner_status_cache IS 'V1.5 Entra owner status cache for owner/offboarding readiness reporting';
