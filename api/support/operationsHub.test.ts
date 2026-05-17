import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const migrationSource = readFileSync(new URL('../../supabase/migrations/011_operations_hub.sql', import.meta.url), 'utf8');
const triageSource = readFileSync(new URL('../_lib/operationsHub.ts', import.meta.url), 'utf8');
const ticketsSource = readFileSync(new URL('./tickets.ts', import.meta.url), 'utf8');
const searchSource = readFileSync(new URL('./search.ts', import.meta.url), 'utf8');
const intelligenceSource = readFileSync(new URL('./intelligence.ts', import.meta.url), 'utf8');

describe('Operations Hub infrastructure contract', () => {
  it('creates support, knowledge, and role tables with RBAC policy hooks', () => {
    expect(migrationSource).toContain('CREATE TABLE IF NOT EXISTS operations_user_roles');
    expect(migrationSource).toContain('CREATE TABLE IF NOT EXISTS support_tickets');
    expect(migrationSource).toContain('CREATE TABLE IF NOT EXISTS knowledge_articles');
    expect(migrationSource).toContain('embedding vector(1536)');
    expect(migrationSource).toContain("role IN ('sales_success', 'support', 'product_admin')");
    expect(migrationSource).toContain('support_tickets_ops_read');
  });

  it('uses gpt-4o-mini with deterministic fallback for ticket triage', () => {
    expect(triageSource).toContain('gpt-4o-mini');
    expect(triageSource).toContain('heuristicTriage');
    expect(triageSource).toContain('product_area_tag');
    expect(triageSource).toContain('sentiment');
  });

  it('exposes role-scoped ticket, search, and intelligence APIs', () => {
    expect(ticketsSource).toContain('triageTicketWithAI');
    expect(searchSource).toContain('support_tickets');
    expect(searchSource).toContain('knowledge_articles');
    expect(intelligenceSource).toContain('anomalyAlerts');
    expect(intelligenceSource).toContain('tenant_ai_settings');
  });
});
