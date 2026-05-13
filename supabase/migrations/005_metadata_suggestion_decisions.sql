-- ============================================================================
-- Metadata Suggestion Decision Audit Trail
-- ============================================================================
-- V1.5 foundation: records review decisions for Aethos-side metadata
-- suggestions without writing changes back to Microsoft 365.

CREATE TABLE IF NOT EXISTS metadata_suggestion_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  suggestion_id TEXT NOT NULL,
  suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('title', 'tag', 'category', 'owner')),
  decision_status TEXT NOT NULL CHECK (decision_status IN ('accepted', 'edited', 'rejected', 'blocked')),
  affected_count INT DEFAULT 0,
  confidence TEXT CHECK (confidence IN ('high', 'medium', 'low')),
  source_signals TEXT[] DEFAULT '{}',
  rationale TEXT,
  suggested_value JSONB DEFAULT '{}'::jsonb,
  edited_value JSONB DEFAULT '{}'::jsonb,
  decided_by UUID REFERENCES users(id) ON DELETE SET NULL,
  decided_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_metadata_suggestion_decisions_tenant
  ON metadata_suggestion_decisions(tenant_id, decided_at DESC);

CREATE INDEX IF NOT EXISTS idx_metadata_suggestion_decisions_suggestion
  ON metadata_suggestion_decisions(tenant_id, suggestion_id, decided_at DESC);

CREATE INDEX IF NOT EXISTS idx_metadata_suggestion_decisions_status
  ON metadata_suggestion_decisions(tenant_id, decision_status, decided_at DESC);

ALTER TABLE metadata_suggestion_decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY metadata_suggestion_decisions_tenant_isolation ON metadata_suggestion_decisions
  FOR ALL USING (
    tenant_id = current_setting('app.current_tenant_id', true)::uuid
  );

COMMENT ON TABLE metadata_suggestion_decisions IS 'Audit trail for review-first Aethos metadata suggestion decisions';
