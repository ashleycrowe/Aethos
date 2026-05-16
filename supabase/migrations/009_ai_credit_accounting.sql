-- ============================================================================
-- AI+ Credit Accounting Foundation
-- ============================================================================
-- V1.5 launch guardrail scaffold for usage budgets, per-action ledgers, and
-- queued bulk AI jobs. Enforcement is intentionally handled in API code so
-- cached results, admin-approved overages, and graceful degradation can be
-- applied per workflow.

CREATE TABLE IF NOT EXISTS tenant_ai_settings (
  tenant_id UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  monthly_credit_limit INTEGER NOT NULL DEFAULT 5000 CHECK (monthly_credit_limit >= 0),
  trial_credit_grant INTEGER NOT NULL DEFAULT 100 CHECK (trial_credit_grant >= 0),
  indexing_file_limit INTEGER NOT NULL DEFAULT 1000 CHECK (indexing_file_limit >= 0),
  credits_enforced BOOLEAN NOT NULL DEFAULT FALSE,
  allow_overage BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_credit_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period_month DATE NOT NULL,
  monthly_credit_limit INTEGER NOT NULL DEFAULT 5000 CHECK (monthly_credit_limit >= 0),
  credits_used INTEGER NOT NULL DEFAULT 0 CHECK (credits_used >= 0),
  credits_reserved INTEGER NOT NULL DEFAULT 0 CHECK (credits_reserved >= 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'warning', 'exhausted', 'overage_approved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, period_month)
);

CREATE TABLE IF NOT EXISTS ai_credit_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  file_id UUID REFERENCES files(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL CHECK (
    action_type IN (
      'semantic_search',
      'summarize_document',
      'pii_scan_regex',
      'pii_scan_ai_assist',
      'metadata_suggestion',
      'oracle_answer',
      'content_indexing',
      'large_document_summary'
    )
  ),
  credit_cost INTEGER NOT NULL DEFAULT 0 CHECK (credit_cost >= 0),
  model TEXT,
  input_tokens INTEGER CHECK (input_tokens IS NULL OR input_tokens >= 0),
  output_tokens INTEGER CHECK (output_tokens IS NULL OR output_tokens >= 0),
  cached BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'succeeded' CHECK (status IN ('succeeded', 'failed', 'skipped', 'queued')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_job_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  job_type TEXT NOT NULL CHECK (
    job_type IN (
      'bulk_content_indexing',
      'bulk_metadata_suggestions',
      'bulk_pii_scan',
      'topic_clustering',
      'tenant_ai_readiness_report'
    )
  ),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled', 'blocked')),
  file_ids UUID[] NOT NULL DEFAULT '{}',
  credit_estimate INTEGER NOT NULL DEFAULT 0 CHECK (credit_estimate >= 0),
  priority INTEGER NOT NULL DEFAULT 100 CHECK (priority >= 0),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_credit_balances_tenant_period
  ON ai_credit_balances(tenant_id, period_month DESC);

CREATE INDEX IF NOT EXISTS idx_ai_credit_ledger_tenant_created
  ON ai_credit_ledger(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_credit_ledger_action
  ON ai_credit_ledger(tenant_id, action_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_job_queue_tenant_status
  ON ai_job_queue(tenant_id, status, priority, created_at);

INSERT INTO tenant_ai_settings (tenant_id)
SELECT id
FROM tenants
ON CONFLICT (tenant_id) DO NOTHING;

ALTER TABLE tenant_ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_credit_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_job_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_ai_settings_tenant_isolation ON tenant_ai_settings
  FOR ALL USING (
    tenant_id = current_setting('app.current_tenant_id', true)::uuid
  );

CREATE POLICY ai_credit_balances_tenant_isolation ON ai_credit_balances
  FOR ALL USING (
    tenant_id = current_setting('app.current_tenant_id', true)::uuid
  );

CREATE POLICY ai_credit_ledger_tenant_isolation ON ai_credit_ledger
  FOR ALL USING (
    tenant_id = current_setting('app.current_tenant_id', true)::uuid
  );

CREATE POLICY ai_job_queue_tenant_isolation ON ai_job_queue
  FOR ALL USING (
    tenant_id = current_setting('app.current_tenant_id', true)::uuid
  );

COMMENT ON TABLE tenant_ai_settings IS 'Tenant-level AI+ budget, trial, and indexing cap settings.';
COMMENT ON TABLE ai_credit_balances IS 'Monthly AI+ credit balance snapshots by tenant.';
COMMENT ON TABLE ai_credit_ledger IS 'Per-action AI+ usage ledger for billing, audit, and cost controls.';
COMMENT ON TABLE ai_job_queue IS 'Queued bulk AI+ jobs for controlled indexing and enrichment waves.';

CREATE OR REPLACE FUNCTION record_ai_credit_usage(
  p_tenant_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_file_id UUID DEFAULT NULL,
  p_action_type TEXT DEFAULT 'semantic_search',
  p_credit_cost INTEGER DEFAULT 0,
  p_model TEXT DEFAULT NULL,
  p_input_tokens INTEGER DEFAULT NULL,
  p_output_tokens INTEGER DEFAULT NULL,
  p_cached BOOLEAN DEFAULT FALSE,
  p_status TEXT DEFAULT 'succeeded',
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_ledger_id UUID;
  v_period_month DATE := date_trunc('month', now())::date;
  v_monthly_limit INTEGER;
BEGIN
  INSERT INTO tenant_ai_settings (tenant_id)
  VALUES (p_tenant_id)
  ON CONFLICT (tenant_id) DO NOTHING;

  SELECT monthly_credit_limit
  INTO v_monthly_limit
  FROM tenant_ai_settings
  WHERE tenant_id = p_tenant_id;

  INSERT INTO ai_credit_ledger (
    tenant_id,
    user_id,
    file_id,
    action_type,
    credit_cost,
    model,
    input_tokens,
    output_tokens,
    cached,
    status,
    metadata
  )
  VALUES (
    p_tenant_id,
    p_user_id,
    p_file_id,
    p_action_type,
    GREATEST(COALESCE(p_credit_cost, 0), 0),
    p_model,
    p_input_tokens,
    p_output_tokens,
    COALESCE(p_cached, false),
    p_status,
    COALESCE(p_metadata, '{}'::jsonb)
  )
  RETURNING id INTO v_ledger_id;

  INSERT INTO ai_credit_balances (
    tenant_id,
    period_month,
    monthly_credit_limit,
    credits_used,
    status
  )
  VALUES (
    p_tenant_id,
    v_period_month,
    COALESCE(v_monthly_limit, 5000),
    CASE
      WHEN p_status = 'succeeded' AND COALESCE(p_cached, false) = false
      THEN GREATEST(COALESCE(p_credit_cost, 0), 0)
      ELSE 0
    END,
    'active'
  )
  ON CONFLICT (tenant_id, period_month) DO UPDATE
  SET credits_used = ai_credit_balances.credits_used + EXCLUDED.credits_used,
      monthly_credit_limit = EXCLUDED.monthly_credit_limit,
      status = CASE
        WHEN ai_credit_balances.credits_used + EXCLUDED.credits_used >= EXCLUDED.monthly_credit_limit
        THEN 'exhausted'
        WHEN ai_credit_balances.credits_used + EXCLUDED.credits_used >= (EXCLUDED.monthly_credit_limit * 0.9)
        THEN 'warning'
        ELSE ai_credit_balances.status
      END,
      updated_at = NOW();

  RETURN v_ledger_id;
END;
$$;

COMMENT ON FUNCTION record_ai_credit_usage IS 'Records AI+ usage and updates the current monthly tenant credit balance.';
