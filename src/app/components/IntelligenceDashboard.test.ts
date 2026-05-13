import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const dashboardSource = readFileSync(new URL('./IntelligenceDashboard.tsx', import.meta.url), 'utf8');
const streamSource = readFileSync(new URL('./IntelligenceStream.tsx', import.meta.url), 'utf8');

describe('IntelligenceDashboard live/demo smoke contract', () => {
  it('keeps the prototype Identity tab demo-only', () => {
    expect(dashboardSource).toContain("...(isDemoMode ? [{ id: 'identity' as IntelligenceView, label: 'Identity', icon: Fingerprint }] : [])");
    expect(dashboardSource).toContain("if (!isDemoMode && activeView === 'identity')");
    expect(dashboardSource).toContain('return <IdentityEngine />');
  });

  it('labels live reporting as tenant-backed and routes live tabs to report-summary data', () => {
    expect(dashboardSource).toContain("Data source: {mode === 'live' ? 'Live tenant' : 'Demo fixtures'}");
    expect(dashboardSource).toContain("label: isDemoMode ? 'Stream' : 'Signal Queue'");
    expect(dashboardSource).toContain('getReportSummary({ accessToken: await getAccessToken() })');
    expect(dashboardSource).toContain('LiveDataBoundary');
    expect(dashboardSource).toContain('Ownership & Offboarding Risk');
  });

  it('keeps demo stream fixtures out of Live Mode signal queue', () => {
    expect(streamSource).toContain('const sourceInsights = isDemoMode ? insights : []');
    expect(streamSource).toContain("Data source: {isDemoMode ? 'Demo fixtures' : 'Live tenant'}");
    expect(streamSource).toContain("title: 'Run first Microsoft Discovery'");
    expect(streamSource).toContain("summary.lastScan.status === 'none'");
  });
});
