import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8');

describe('App live/demo route gating contract', () => {
  it('keeps mock reporting outside the live core tab set', () => {
    expect(source).toContain("const LIVE_CORE_TABS = new Set(['oracle', 'insights', 'nexus', 'archival', 'admin'])");
    expect(source).toContain("const DEMO_ONLY_TABS = new Set(['reports'])");
    expect(source).toContain('...(isDemoMode ? Array.from(DEMO_ONLY_TABS) : [])');
    expect(source).toContain('if (!allowedTabs.has(activeTab))');
  });
});
