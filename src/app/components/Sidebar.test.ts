import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./Sidebar.tsx', import.meta.url), 'utf8');

describe('Sidebar mobile navigation contract', () => {
  it('keeps the mobile bottom nav clear of device safe areas', () => {
    expect(source).toContain('aria-label="Primary mobile navigation"');
    expect(source).toContain("bottom: 'max(0.75rem, env(safe-area-inset-bottom))'");
    expect(source).toContain('min-h-[54px]');
  });
});
