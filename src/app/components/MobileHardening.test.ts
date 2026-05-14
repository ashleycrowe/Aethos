import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const sources = {
  app: readFileSync(new URL('../App.tsx', import.meta.url), 'utf8'),
  admin: readFileSync(new URL('./AdminCenter.tsx', import.meta.url), 'utf8'),
  intelligence: readFileSync(new URL('./IntelligenceDashboard.tsx', import.meta.url), 'utf8'),
  oracle: readFileSync(new URL('./OracleSearchBridgeV2.tsx', import.meta.url), 'utf8'),
  remediation: readFileSync(new URL('./RemediationCenterV1.tsx', import.meta.url), 'utf8'),
  workspace: readFileSync(new URL('./WorkspaceEngine.tsx', import.meta.url), 'utf8'),
};

describe('V1 mobile hardening contract', () => {
  it('contains horizontal overflow on core V1 screens', () => {
    expect(sources.app).toContain('overflow-hidden transition-colors');

    for (const [name, source] of Object.entries(sources).filter(([name]) => name !== 'app')) {
      expect(source, `${name} should contain overflow pressure`).toContain('overflow-x-hidden');
    }
  });

  it('keeps primary controls touch-sized across core V1 screens', () => {
    for (const [name, source] of Object.entries(sources)) {
      expect(source, `${name} should include 44px touch targets`).toMatch(/min-h-\[44px\]|min-h-12|min-h-11/);
    }
  });

  it('uses progressive grids instead of desktop-only dense layouts', () => {
    expect(sources.admin).toContain('grid w-full grid-cols-1 gap-3');
    expect(sources.intelligence).toContain('grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4');
    expect(sources.oracle).toContain('grid w-full grid-cols-1 gap-2 sm:w-auto');
    expect(sources.remediation).toContain('grid w-full grid-cols-1');
    expect(sources.workspace).toContain('grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-7');
  });

  it('reduces expensive blur on mobile before scaling up at larger breakpoints', () => {
    expect(sources.app).toContain('backdrop-blur-sm');
    expect(sources.app).toContain('sm:backdrop-blur-2xl');
    expect(sources.admin).toContain('backdrop-blur-sm sm:p-6 lg:backdrop-blur-2xl');
    expect(sources.oracle).toContain('backdrop-blur-sm md:backdrop-blur-xl');
    expect(sources.workspace).toContain('backdrop-blur-sm md:backdrop-blur-xl');
    expect(sources.remediation).toContain('backdrop-blur-sm');
  });

  it('keeps long labels and file names from forcing mobile overflow', () => {
    expect(sources.admin).toContain('break-words');
    expect(sources.intelligence).toContain('break-words');
    expect(sources.oracle).toContain('break-words');
    expect(sources.remediation).toContain('break-words');
    expect(sources.workspace).toContain('break-words');
  });
});
