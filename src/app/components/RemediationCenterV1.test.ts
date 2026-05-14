import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./RemediationCenterV1.tsx', import.meta.url), 'utf8');

describe('RemediationCenterV1 live/demo smoke contract', () => {
  it('loads live remediation candidates from indexed files instead of demo fixtures', () => {
    expect(source).toContain('if (isDemoMode) {');
    expect(source).toContain('setItems(generateRemediationItems(5))');
    expect(source).toContain('const loadLiveCandidates = async () =>');
    expect(source).toContain('searchFiles<SearchFileResult>');
    expect(source).toContain("filters: filterIssue === 'all' ? { minRiskScore: 1 } : issueFilters[filterIssue]");
    expect(source).toContain('Querying indexed Microsoft metadata for stale, exposed, or high-risk files.');
  });

  it('keeps live remediation dry-run first', () => {
    expect(source).toContain('dryRun: true');
    expect(source).toContain("toast.success(`Dry run logged for ${selectedCount} item${selectedCount > 1 ? 's' : ''}`");
    expect(source).toContain('The helper prints review inventory only. It does not change Microsoft 365.');
    expect(source).toContain('Dry-run first: no destructive action taken by default');
  });

  it('shows clear live failure and empty states', () => {
    expect(source).toContain('Unable to load live remediation candidates');
    expect(source).toContain('Live Remediation Unavailable');
    expect(source).toContain('Run discovery first if this tenant has not been indexed.');
  });

  it('keeps remediation controls mobile-first', () => {
    expect(source).toContain('overflow-x-hidden');
    expect(source).toContain('grid w-full grid-cols-1');
    expect(source).toContain('sm:grid-cols-2 xl:flex');
    expect(source).toContain('break-words text-sm font-black');
    expect(source).toContain('sm:items-center sm:p-6');
  });
});
