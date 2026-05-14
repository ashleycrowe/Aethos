import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const dashboardSource = readFileSync(new URL('./IntelligenceDashboard.tsx', import.meta.url), 'utf8');
const streamSource = readFileSync(new URL('./IntelligenceStream.tsx', import.meta.url), 'utf8');
const discoverySource = readFileSync(new URL('./DiscoveryScanSimulation.tsx', import.meta.url), 'utf8');

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

  it('surfaces workspace opportunity handoff packets from live reports', () => {
    expect(dashboardSource).toContain('copyWorkspaceOpportunityHandoff');
    expect(dashboardSource).toContain('reasonCodes');
    expect(dashboardSource).toContain('Copy Handoff');
    expect(dashboardSource).toContain('Owner Review Required');
    expect(dashboardSource).toContain('Microsoft 365 remains the source of truth');
  });

  it('keeps demo stream fixtures out of Live Mode signal queue', () => {
    expect(streamSource).toContain('const sourceInsights = isDemoMode ? insights : []');
    expect(streamSource).toContain("Data source: {isDemoMode ? 'Demo fixtures' : 'Live tenant'}");
    expect(streamSource).toContain("title: 'Run first Microsoft Discovery'");
    expect(streamSource).toContain("summary.lastScan.status === 'none'");
    expect(streamSource).toContain('Refresh Live Signals');
    expect(streamSource).toContain('No Demo Insights Match This Filter');
  });

  it('keeps discovery scan copy metadata-only for V1 trial scans', () => {
    expect(discoverySource).toContain('indexes metadata only');
    expect(discoverySource).toContain('does not read');
    expect(discoverySource).toContain('Content scanning stays opt-in');
    expect(discoverySource).not.toContain('AI enrichment included');
  });

  it('keeps Live Mode metadata guidance review-first before content scanning', () => {
    const metadataSource = readFileSync(new URL('./MetadataIntelligenceDashboard.tsx', import.meta.url), 'utf8');
    expect(metadataSource).toContain('review metadata suggestions before considering AI+ content scanning');
    expect(metadataSource).toContain('Content-aware enrichment remains an explicit AI+ step after V1 metadata review is working.');
  });

  it('keeps intelligence reports mobile-first', () => {
    expect(dashboardSource).toContain('overflow-x-hidden');
    expect(dashboardSource).toContain('grid w-full grid-cols-2 gap-2 sm:grid-cols-5');
    expect(dashboardSource).toContain('break-words text-sm font-black');
    expect(dashboardSource).toContain('md:w-auto md:min-w-[420px]');
    expect(dashboardSource).toContain('min-h-[44px] w-full rounded-xl');
  });
});
