import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const migrationSource = readFileSync(new URL('../../supabase/migrations/008_workspace_stewardship.sql', import.meta.url), 'utf8');
const createSource = readFileSync(new URL('./create.ts', import.meta.url), 'utf8');
const listSource = readFileSync(new URL('./list.ts', import.meta.url), 'utf8');
const detailSource = readFileSync(new URL('./[id]/index.ts', import.meta.url), 'utf8');

describe('workspace stewardship persistence contract', () => {
  it('adds stewardship metadata columns to workspaces', () => {
    expect(migrationSource).toContain('steward_owner_email');
    expect(migrationSource).toContain('review_status');
    expect(migrationSource).toContain('handoff_reason_codes');
    expect(migrationSource).toContain('source_of_truth_item_ids');
    expect(migrationSource).toContain('suggestion_decisions');
  });

  it('round-trips stewardship metadata through create, list, and detail APIs', () => {
    [createSource, listSource, detailSource].forEach((source) => {
      expect(source).toContain('steward_owner_email');
      expect(source).toContain('review_status');
      expect(source).toContain('handoff_reason_codes');
      expect(source).toContain('source_of_truth_item_ids');
      expect(source).toContain('suggestion_decisions');
      expect(source).toContain('steward_notes');
    });
  });
});
