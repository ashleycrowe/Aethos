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

  it('labels V1 Oracle results by data class and defers future classes', () => {
    expect(source).toContain("const V1_DATA_CLASS = 'Document'");
    expect(source).toContain("const FUTURE_DATA_CLASSES = ['Published Knowledge', 'Structured List', 'Container', 'Signal']");
    expect(source).toContain('V1 search indexes Microsoft file metadata as Document results');
    expect(source).toContain('classes stay deferred until their ingestion boundaries are live-backed');
  });

  it('keeps V1.5 AI+ search wired to semantic results and summary actions', () => {
    expect(source).toContain('indexFileContent({');
    expect(source).toContain('detectPii({');
    expect(source).toContain('semanticSearch({');
    expect(source).toContain('summarizeFile({');
    expect(source).toContain('AI+ Search Results');
    expect(source).toContain('Content Match');
    expect(source).toContain('Index Content');
    expect(source).toContain('Scan PII');
    expect(source).toContain('AI+ results also require content indexing');
  });

  it('keeps Oracle search mobile-first', () => {
    expect(source).toContain('overflow-x-hidden');
    expect(source).toContain("animate={{ width: 'auto', opacity: 1 }}");
    expect(source).toContain('grid w-full grid-cols-1 gap-2 sm:w-auto');
    expect(source).toContain('break-words rounded-3xl');
    expect(source).toContain('min-h-[44px] min-w-[44px]');
  });
});
