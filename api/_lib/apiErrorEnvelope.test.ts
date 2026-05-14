import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const authSource = readFileSync(new URL('./apiAuth.ts', import.meta.url), 'utf8');
const v1EndpointSources = [
  '../discovery/scan.ts',
  '../search/query.ts',
  '../workspaces/create.ts',
  '../workspaces/list.ts',
  '../workspaces/[id]/index.ts',
  '../remediation/execute.ts',
  '../intelligence/metrics.ts',
  '../intelligence/report-summary.ts',
  '../intelligence/metadata-suggestion-decision.ts',
  '../intelligence/owner-status-sync.ts',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));

describe('V1 API error envelope contract', () => {
  it('defines structured errors with codes and messages', () => {
    expect(authSource).toContain('export type ApiErrorEnvelope');
    expect(authSource).toContain('code: ApiErrorCode');
    expect(authSource).toContain('message: string');
    expect(authSource).toContain('details?: unknown');
  });

  it('applies a shared default rate limit to authenticated V1 APIs', () => {
    expect(authSource).toContain('const DEFAULT_RATE_LIMIT');
    expect(authSource).toContain("'RATE_LIMITED'");
    expect(authSource).toContain("'X-RateLimit-Remaining'");
    expect(authSource).toContain('sendApiError(res, 429');
  });

  it('uses sendApiError across V1 tester endpoints', () => {
    v1EndpointSources.forEach((source) => {
      expect(source).toContain('sendApiError');
    });
  });
});
