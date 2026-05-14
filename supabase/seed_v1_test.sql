-- Aethos V1 local test seed
-- Apply after supabase/migrations/001_initial_schema.sql for local/manual testing.

INSERT INTO tenants (id, name, microsoft_tenant_id, subscription_tier, status)
VALUES (
  '00000000-0000-0000-0000-000000000101',
  'Aethos Test Tenant',
  'aethos-test-tenant',
  'v1',
  'active'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, tenant_id, email, name, microsoft_id, role)
VALUES (
  '00000000-0000-0000-0000-000000000201',
  '00000000-0000-0000-0000-000000000101',
  'tester@aethos.local',
  'Aethos Tester',
  'aethos-test-user',
  'admin'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO files (
  id,
  tenant_id,
  provider,
  provider_id,
  provider_type,
  name,
  path,
  url,
  size_bytes,
  mime_type,
  created_at,
  modified_at,
  owner_email,
  owner_name,
  is_stale,
  is_orphaned,
  has_external_share,
  external_user_count,
  risk_score,
  intelligence_score,
  ai_tags,
  ai_category,
  ai_suggested_title,
  metadata
)
VALUES
(
  '00000000-0000-0000-0000-000000000301',
  '00000000-0000-0000-0000-000000000101',
  'microsoft',
  'seed-budget-q1',
  'sharepoint',
  'Q1 Budget Review.xlsx',
  '/Finance/Budget',
  'https://example.local/q1-budget',
  4823440,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  NOW() - INTERVAL '120 days',
  NOW() - INTERVAL '12 days',
  'finance@aethos.local',
  'Finance Team',
  FALSE,
  FALSE,
  FALSE,
  0,
  15,
  82,
  ARRAY['finance', 'budget', 'q1'],
  'financial-planning',
  'Q1 Budget Review',
  '{"source":"seed"}'::jsonb
),
(
  '00000000-0000-0000-0000-000000000302',
  '00000000-0000-0000-0000-000000000101',
  'microsoft',
  'seed-legacy-archive',
  'onedrive',
  'Legacy Project Archive.zip',
  '/Operations/Archive',
  'https://example.local/legacy-archive',
  12884901888,
  'application/zip',
  NOW() - INTERVAL '600 days',
  NOW() - INTERVAL '420 days',
  'ops@aethos.local',
  'Operations',
  TRUE,
  TRUE,
  TRUE,
  3,
  85,
  31,
  ARRAY['archive', 'stale', 'operations'],
  'dead-capital',
  'Legacy Project Archive',
  '{"source":"seed"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO workspaces (
  id,
  tenant_id,
  name,
  description,
  icon,
  color,
  tags,
  auto_sync_enabled,
  steward_owner_email,
  steward_owner_name,
  review_status,
  handoff_reason_codes,
  source_of_truth_item_ids,
  suggestion_decisions,
  steward_notes,
  created_by
)
VALUES (
  '00000000-0000-0000-0000-000000000401',
  '00000000-0000-0000-0000-000000000101',
  'Finance Operating Room',
  'Seed workspace for budget and planning documents.',
  'layout-grid',
  '#00F0FF',
  ARRAY['finance', 'budget'],
  TRUE,
  'steward@aethos.local',
  'Context Steward',
  'steward_review',
  ARRAY['metadata-quality', 'stale-content', 'handoff'],
  ARRAY['00000000-0000-0000-0000-000000000301']::uuid[],
  '{
    "handoffPacket": {
      "source": "operational_intelligence",
      "summary": "Seed workspace used to verify handoff, trust filters, and steward audit trail behavior.",
      "reasonCodes": ["metadata-quality", "stale-content", "handoff"],
      "suggestedAction": "Review source-of-truth budget files, resolve stale archive exposure, and mark the workspace team-ready only after steward review.",
      "ownerReviewRequired": true
    },
    "seed-budget-q1": {
      "status": "accepted",
      "reason": "Trusted source-of-truth anchor for local V1 workspace testing."
    }
  }'::jsonb,
  'Seed stewardship data intentionally exercises handoff packets, trust filters, permission gaps, and the visible audit trail.',
  '00000000-0000-0000-0000-000000000201'
)
ON CONFLICT (id) DO UPDATE SET
  steward_owner_email = EXCLUDED.steward_owner_email,
  steward_owner_name = EXCLUDED.steward_owner_name,
  review_status = EXCLUDED.review_status,
  handoff_reason_codes = EXCLUDED.handoff_reason_codes,
  source_of_truth_item_ids = EXCLUDED.source_of_truth_item_ids,
  suggestion_decisions = EXCLUDED.suggestion_decisions,
  steward_notes = EXCLUDED.steward_notes;

INSERT INTO workspace_items (workspace_id, file_id, added_by, added_method, pinned)
VALUES
(
  '00000000-0000-0000-0000-000000000401',
  '00000000-0000-0000-0000-000000000301',
  '00000000-0000-0000-0000-000000000201',
  'manual',
  TRUE
),
(
  '00000000-0000-0000-0000-000000000401',
  '00000000-0000-0000-0000-000000000302',
  '00000000-0000-0000-0000-000000000201',
  'handoff',
  FALSE
)
ON CONFLICT (workspace_id, file_id) DO NOTHING;
