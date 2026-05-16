import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./api.ts', import.meta.url), 'utf8');

describe('frontend API client contract', () => {
  it('preserves actionable backend error details for setup-guided V1.5 flows', () => {
    expect(source).toContain('function getApiErrorMessage');
    expect(source).toContain("'action' in details");
    expect(source).toContain('`${message} ${action}`');
  });

  it('exposes V1.5 AI+ helpers behind the shared API client', () => {
    expect(source).toContain('export async function indexFileContent');
    expect(source).toContain('export async function detectPii');
    expect(source).toContain('export async function runMetadataEnrichment');
    expect(source).toContain('export async function getAiPlusReadiness');
    expect(source).toContain("'/intelligence/enrich'");
    expect(source).toContain("'/intelligence/ai-readiness'");
  });
});
