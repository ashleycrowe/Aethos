import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./AdminCenter.tsx', import.meta.url), 'utf8');

describe('AdminCenter smoke contract', () => {
  it('renders persisted scan history and post-scan routing', () => {
    expect(source).toContain('Persisted Last Scan');
    expect(source).toContain('formatScanStatus(lastScanSummary?.status)');
    expect(source).toContain('filesDiscovered');
    expect(source).toContain('sitesDiscovered');
    expect(source).toContain("onClick={() => openAppTab('oracle')}");
    expect(source).toContain("onClick={() => openAppTab('nexus')}");
    expect(source).toContain("onClick={() => openAppTab('archival')}");
  });

  it('shows discovery and partial scan errors clearly', () => {
    expect(source).toContain("toast.error('Discovery scan failed'");
    expect(source).toContain('lastScanNeedsAttention');
    expect(source).toContain('Partial scan state: review permissions or scan errors before treating reports as complete.');
    expect(source).toContain('Last scan summary unavailable');
  });

  it('keeps mode and reset controls visible with domain lock feedback', () => {
    expect(source).toContain('Runtime mode is locked for this domain');
    expect(source).toContain('Clear Demo Override');
    expect(source).toContain('Clear Diagnostics');
    expect(source).toContain('local Aethos tenant/user IDs before Microsoft redirects to logout');
  });

  it('loads live tenant diagnostics while preserving demo local diagnostics', () => {
    expect(source).toContain("listDiagnostics({");
    expect(source).toContain("limit: 25");
    expect(source).toContain("demoMode ? 'Demo Diagnostics' : 'Live Diagnostics'");
    expect(source).toContain('Sign in with Microsoft to load tenant diagnostics from Supabase.');
    expect(source).toContain('No recent backend diagnostics have been captured for this tenant.');
    expect(source).toContain('Live diagnostics are retained in Supabase');
  });

  it('surfaces tenant capability status with AI+ readiness', () => {
    expect(source).toContain('Tenant Capability Status');
    expect(source).toContain('getAiPlusReadiness');
    expect(source).toContain('AI+ Readiness');
    expect(source).toContain('AI+ Validation Snapshot');
    expect(source).toContain('AI+ Action Required');
    expect(source).toContain('Re-Authenticate');
    expect(source).toContain('Aethos Production Tenant');
    expect(source).toContain('Refresh AI+');
    expect(source).toContain('Intelligence Credits');
    expect(source).toContain('Observe Only');
    expect(source).toContain('Microsoft Sign-In');
    expect(source).toContain('Tenant Provisioning');
    expect(source).toContain('OneDrive / Files');
    expect(source).toContain('SharePoint / Teams');
  });

  it('states the V1 discovery scope after live scans', () => {
    expect(source).toContain('Metadata only; content scanning stayed off.');
    expect(source).toContain('SharePoint Lists and document bodies deferred.');
  });

  it('keeps admin setup controls mobile-first', () => {
    expect(source).toContain('overflow-x-hidden');
    expect(source).toContain('grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-2');
    expect(source).toContain('w-full shrink-0 sm:w-auto');
    expect(source).toContain('break-words text-[10px] font-black uppercase');
    expect(source).toContain('backdrop-blur-sm sm:p-6 lg:backdrop-blur-2xl');
  });
});
