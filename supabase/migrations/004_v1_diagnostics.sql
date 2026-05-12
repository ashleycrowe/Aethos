-- ============================================================================
-- V1 Diagnostics
-- ============================================================================
-- Stores sanitized client/runtime diagnostics during beta testing.
-- This is not a compliance audit trail; it is an engineering support log.

CREATE TABLE IF NOT EXISTS app_diagnostics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('debug', 'info', 'warn', 'error', 'fatal')),
  source TEXT NOT NULL CHECK (source IN ('client', 'api', 'auth', 'graph', 'supabase')),
  event_name TEXT NOT NULL,
  message TEXT NOT NULL,
  route TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_diagnostics_created ON app_diagnostics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_diagnostics_tenant ON app_diagnostics(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_diagnostics_session ON app_diagnostics(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_diagnostics_severity ON app_diagnostics(severity, created_at DESC);

ALTER TABLE app_diagnostics ENABLE ROW LEVEL SECURITY;

CREATE POLICY app_diagnostics_tenant_read ON app_diagnostics
  FOR SELECT USING (
    tenant_id = current_setting('app.current_tenant_id', true)::uuid
  );

COMMENT ON TABLE app_diagnostics IS 'V1 beta diagnostics for browser/API error reporting during manual testing';
