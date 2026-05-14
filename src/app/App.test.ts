import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8');

describe('App shell mobile readiness contract', () => {
  it('keeps shell cards and labels readable on phones', () => {
    expect(source).toContain('w-full max-w-xl rounded-[28px]');
    expect(source).toContain('tracking-[0.18em]');
    expect(source).toContain('backdrop-blur-sm');
    expect(source).toContain('sm:backdrop-blur-2xl');
  });

  it('keeps global chrome clear of the mobile bottom nav', () => {
    expect(source).toContain('overflow-hidden transition-colors');
    expect(source).toContain('flex min-h-[44px] min-w-[44px]');
    expect(source).toContain('pb-28');
    expect(source).toContain('blur-[90px]');
  });
});

describe('App live/demo tab boundary contract', () => {
  it('keeps Live Mode constrained to live-backed V1 surfaces', () => {
    expect(source).toContain("export const LIVE_CORE_TABS = new Set(['oracle', 'insights', 'nexus', 'archival', 'admin']);");
    expect(source).toContain("export const DEMO_ONLY_TABS = new Set(['reports']);");
    expect(source).toContain('isTabAllowedForMode(activeTab, isDemoMode)');
  });

  it('keeps demo/prototype/document modules outside the Live Mode allow-list', () => {
    const liveAllowList = source.match(/LIVE_CORE_TABS = new Set\(\[(.*?)\]\);/s)?.[1] || '';
    expect(liveAllowList).toContain("'oracle'");
    expect(liveAllowList).toContain("'insights'");
    expect(liveAllowList).toContain("'nexus'");
    expect(liveAllowList).toContain("'archival'");
    expect(liveAllowList).toContain("'admin'");
    expect(liveAllowList).not.toContain("'reports'");
    expect(liveAllowList).not.toContain("'documents'");
    expect(liveAllowList).not.toContain("'lab'");
    expect(liveAllowList).not.toContain("'tag-demo'");
    expect(liveAllowList).not.toContain("'tag-flow-demo'");
    expect(liveAllowList).not.toContain("'design'");
    expect(liveAllowList).not.toContain("'voyager'");
    expect(liveAllowList).not.toContain("'pulse'");
    expect(liveAllowList).not.toContain("'people'");
  });

  it('keeps demo and prototype routes behind the coming-soon boundary unless explicitly allowed', () => {
    expect(source).toContain('return <ComingSoonView tab={activeTab} />;');
    expect(source).toContain("case 'lab':");
    expect(source).toContain("case 'tag-demo':");
    expect(source).toContain("case 'tag-flow-demo':");
  });
});
