import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./Sidebar.tsx', import.meta.url), 'utf8');

describe('Sidebar mobile navigation contract', () => {
  it('keeps the mobile bottom nav clear of device safe areas', () => {
    expect(source).toContain('aria-label="Primary mobile navigation"');
    expect(source).toContain("bottom: 'max(0.75rem, env(safe-area-inset-bottom))'");
    expect(source).toContain('min-h-[54px]');
  });

  it('keeps desktop navigation controls touch-sized and lighter below large viewports', () => {
    expect(source).toContain('min-h-[48px]');
    expect(source).toContain('min-h-[44px]');
    expect(source).toContain('backdrop-blur-xl');
    expect(source).toContain('lg:backdrop-blur-3xl');
  });
});
