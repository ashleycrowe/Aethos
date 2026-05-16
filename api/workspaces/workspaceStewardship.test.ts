import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const migrationSource = readFileSync(new URL('../../supabase/migrations/008_workspace_stewardship.sql', import.meta.url), 'utf8');
const createSource = readFileSync(new URL('./create.ts', import.meta.url), 'utf8');
const listSource = readFileSync(new URL('./list.ts', import.meta.url), 'utf8');
const detailSource = readFileSync(new URL('./[id]/index.ts', import.meta.url), 'utf8');
const seedSource = readFileSync(new URL('../../supabase/seed_v1_test.sql', import.meta.url), 'utf8');

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
      expect(source).toContain('handoffPacket');
      expect(source).toContain('source_of_truth_item_ids');
      expect(source).toContain('suggestion_decisions');
      expect(source).toContain('steward_notes');
    });
  });

  it('returns source permission signals without making Aethos permission-authoritative', () => {
    expect(detailSource).toContain('url');
    expect(detailSource).toContain('owner_email');
    expect(detailSource).toContain('owner_name');
    expect(detailSource).toContain('has_external_share');
    expect(detailSource).toContain('external_user_count');
    expect(detailSource).not.toContain('grant');
  });

  it('surfaces derived workspace access visibility for Blind Steward review', () => {
    expect(listSource).toContain('isAccessible');
    expect(detailSource).toContain('isAccessible');
    expect(detailSource).toContain('STEWARD_ACCESS_GAP');
    expect(detailSource).toContain('EXTERNAL_SHARE');
    expect(detailSource).toContain('OWNERSHIP_UNKNOWN');
  });

  it('keeps local seed fixtures aligned with stewardship and handoff UX', () => {
    expect(seedSource).toContain('steward_owner_email');
    expect(seedSource).toContain('handoff_reason_codes');
    expect(seedSource).toContain('source_of_truth_item_ids');
    expect(seedSource).toContain('"handoffPacket"');
    expect(seedSource).toContain('Seed stewardship data intentionally exercises handoff packets');
    expect(seedSource).toContain("'handoff'");
    expect(seedSource).toContain('ON CONFLICT (id) DO UPDATE SET');
  });
});
