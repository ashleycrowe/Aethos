import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const migrationSource = readFileSync(new URL('../../supabase/migrations/003_v15_to_v4_features.sql', import.meta.url), 'utf8');
const embeddingsSource = readFileSync(new URL('./embeddings.ts', import.meta.url), 'utf8');
const piiDetectionSource = readFileSync(new URL('./pii-detection.ts', import.meta.url), 'utf8');
const semanticSearchSource = readFileSync(new URL('./semantic-search.ts', import.meta.url), 'utf8');
const readinessSource = readFileSync(new URL('./ai-readiness.ts', import.meta.url), 'utf8');
const aiCreditsSource = readFileSync(new URL('../_lib/aiCredits.ts', import.meta.url), 'utf8');
const graphSource = readFileSync(new URL('../_lib/microsoftGraph.ts', import.meta.url), 'utf8');
const creditAccountingMigrationSource = readFileSync(
  new URL('../../supabase/migrations/009_ai_credit_accounting.sql', import.meta.url),
  'utf8'
);
const graphConsentMigrationSource = readFileSync(
  new URL('../../supabase/migrations/010_graph_consent_recovery.sql', import.meta.url),
  'utf8'
);

describe('V1.5 AI+ infrastructure contract', () => {
  it('creates the Supabase prerequisites needed by content intelligence endpoints', () => {
    expect(migrationSource).toContain('CREATE EXTENSION IF NOT EXISTS vector');
    expect(migrationSource).toContain('ADD COLUMN IF NOT EXISTS ai_features_enabled BOOLEAN DEFAULT FALSE');
    expect(migrationSource).toContain('CREATE TABLE IF NOT EXISTS content_embeddings');
    expect(migrationSource).toContain('CREATE TABLE IF NOT EXISTS content_summaries');
    expect(migrationSource).toContain('CREATE TABLE IF NOT EXISTS pii_detections');
    expect(migrationSource).toContain('CREATE OR REPLACE FUNCTION semantic_search');
  });

  it('supports repeat indexing and empty semantic results during AI+ validation', () => {
    expect(embeddingsSource).toContain(".from('content_embeddings')");
    expect(embeddingsSource).toContain('https://graph.microsoft.com/v1.0/drives/');
    expect(embeddingsSource).toContain('Missing Microsoft drive metadata for content indexing');
    expect(embeddingsSource).toContain('.delete()');
    expect(embeddingsSource).toContain('Unable to prepare file for re-indexing');
    expect(semanticSearchSource).toContain('results.length === 0');
    expect(semanticSearchSource).toContain('count: 0');
  });

  it('supports repeat PII scans without accumulating stale findings', () => {
    expect(piiDetectionSource).toContain(".from('pii_detections')");
    expect(piiDetectionSource).toContain('.delete()');
    expect(piiDetectionSource).toContain('Unable to prepare file for PII rescan');
    expect(piiDetectionSource).toContain('Unable to update file PII flags');
    expect(piiDetectionSource).toContain('shouldRunAiAssist');
    expect(piiDetectionSource).toContain('No deterministic PII patterns found.');
  });

  it('reports AI+ readiness blockers before manual validation', () => {
    expect(readinessSource).toContain('OPENAI_API_KEY');
    expect(readinessSource).toContain('ai_features_enabled');
    expect(readinessSource).toContain('content_embeddings');
    expect(readinessSource).toContain('Run Oracle AI+ Index Content');
    expect(readinessSource).toContain('creditUsage');
    expect(readinessSource).toContain('ai_credit_balances');
  });

  it('scaffolds paid AI+ credit accounting before launch enforcement', () => {
    expect(creditAccountingMigrationSource).toContain('CREATE TABLE IF NOT EXISTS tenant_ai_settings');
    expect(creditAccountingMigrationSource).toContain('CREATE TABLE IF NOT EXISTS ai_credit_balances');
    expect(creditAccountingMigrationSource).toContain('CREATE TABLE IF NOT EXISTS ai_credit_ledger');
    expect(creditAccountingMigrationSource).toContain('CREATE TABLE IF NOT EXISTS ai_job_queue');
    expect(creditAccountingMigrationSource).toContain('monthly_credit_limit INTEGER NOT NULL DEFAULT 5000');
    expect(creditAccountingMigrationSource).toContain('trial_credit_grant INTEGER NOT NULL DEFAULT 100');
    expect(creditAccountingMigrationSource).toContain('indexing_file_limit INTEGER NOT NULL DEFAULT 1000');
    expect(creditAccountingMigrationSource).toContain('CREATE OR REPLACE FUNCTION record_ai_credit_usage');
    expect(aiCreditsSource).toContain("supabase.rpc('record_ai_credit_usage'");
    expect(semanticSearchSource).toContain("actionType: 'semantic_search'");
  });

  it('traps Microsoft Graph consent revocation for AI+ indexing recovery', () => {
    expect(graphConsentMigrationSource).toContain('api_consent_revoked');
    expect(graphConsentMigrationSource).toContain('missing_graph_scopes');
    expect(graphSource).toContain('GraphConsentError');
    expect(graphSource).toContain('Files.Read.All');
    expect(graphSource).toContain('markTenantGraphConsentRevoked');
    expect(embeddingsSource).toContain('graphFetch');
    expect(embeddingsSource).toContain('GRAPH_CONSENT_REVOKED');
    expect(readinessSource).toContain('graphConsent');
  });
});
