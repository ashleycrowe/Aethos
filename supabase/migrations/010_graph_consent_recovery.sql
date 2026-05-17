-- ============================================================================
-- Microsoft Graph Consent Recovery State
-- ============================================================================
-- Tracks when a previously granted Microsoft Graph permission appears revoked
-- or insufficient so Admin Center can guide re-authorization instead of leaving
-- users with unhandled AI+ failures.

ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS api_consent_revoked BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS api_consent_revoked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS missing_graph_scopes TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS last_graph_error JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_tenants_api_consent_revoked
  ON tenants(api_consent_revoked)
  WHERE api_consent_revoked = TRUE;

COMMENT ON COLUMN tenants.api_consent_revoked IS
  'True when Microsoft Graph returns an authorization/consent failure for previously required Aethos scopes.';

COMMENT ON COLUMN tenants.missing_graph_scopes IS
  'Graph delegated scopes that appear missing or revoked, such as Files.Read.All.';

COMMENT ON COLUMN tenants.last_graph_error IS
  'Last trapped Microsoft Graph authorization error used for Admin Center recovery guidance.';
