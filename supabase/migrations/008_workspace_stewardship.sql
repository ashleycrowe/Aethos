-- Workspace stewardship metadata for the V1 persona loop.
-- Systems Admins create handoff packets, Context Stewards curate them,
-- and Knowledge Workers consume the trusted workspace view.

ALTER TABLE public.workspaces
  ADD COLUMN IF NOT EXISTS steward_owner_email TEXT,
  ADD COLUMN IF NOT EXISTS steward_owner_name TEXT,
  ADD COLUMN IF NOT EXISTS review_status TEXT NOT NULL DEFAULT 'admin_review',
  ADD COLUMN IF NOT EXISTS handoff_reason_codes TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS source_of_truth_item_ids UUID[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS suggestion_decisions JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS steward_notes TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'workspaces_review_status_check'
      AND conrelid = 'public.workspaces'::regclass
  ) THEN
    ALTER TABLE public.workspaces
      ADD CONSTRAINT workspaces_review_status_check
      CHECK (review_status IN ('admin_review', 'steward_review', 'team_ready', 'archived'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_workspaces_review_status
  ON public.workspaces(tenant_id, review_status);

CREATE INDEX IF NOT EXISTS idx_workspaces_handoff_reason_codes
  ON public.workspaces USING GIN(handoff_reason_codes);

COMMENT ON COLUMN public.workspaces.steward_owner_email IS
  'Context Steward email responsible for curating this workspace handoff.';

COMMENT ON COLUMN public.workspaces.review_status IS
  'Persona loop state: admin_review, steward_review, team_ready, archived.';

COMMENT ON COLUMN public.workspaces.handoff_reason_codes IS
  'Reason codes from Discovery, Operational Intelligence, owner risk, stale content, exposure, or metadata quality.';

COMMENT ON COLUMN public.workspaces.source_of_truth_item_ids IS
  'Workspace item IDs or file IDs promoted by a steward as source-of-truth anchors.';
