import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./ReportingCenterV1.tsx', import.meta.url), 'utf8');

describe('ReportingCenterV1 smoke contract', () => {
  it('keeps reporting controls mobile-first', () => {
    expect(source).toContain('overflow-x-hidden');
    expect(source).toContain('grid w-full grid-cols-2 gap-2');
    expect(source).toContain('grid w-full grid-cols-1 gap-3 sm:grid-cols-3');
    expect(source).toContain('min-h-[44px]');
    expect(source).toContain('break-words text-sm font-bold');
  });

  it('does not show hard-coded dollar savings before pricing assumptions are configurable', () => {
    expect(source).toContain("value: '3.4 TB'");
    expect(source).toContain('Configure storage assumptions before showing dollar impact.');
    expect(source).not.toContain('$12,400');
  });
});
