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
