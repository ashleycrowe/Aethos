import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./OracleSearchBridgeV2.tsx', import.meta.url), 'utf8');

describe('OracleSearchBridgeV2 smoke contract', () => {
  it('keeps the frontend wired to searchFiles with demo fallback support', () => {
    expect(source).toContain('export const OracleSearchBridgeV2');
    expect(source).toContain('searchFiles<SearchFileResult>');
    expect(source).toContain('demoSearchResults');
    expect(source).toContain('isDemoModeEnabled()');
  });

  it('keeps demo-only predictive filters out of Live Mode', () => {
    expect(source).toContain("globalDemoMode ? 'Intelligence Score' : 'Metadata Score'");
    expect(source).toContain('Live tag filters populate from accepted metadata suggestions');
    expect(source).toContain('Predictive demo anchors are hidden in Live Mode');
    expect(source).toContain("globalDemoMode ? 'Apply Filters' : 'Search With Current Filters'");
  });
});
