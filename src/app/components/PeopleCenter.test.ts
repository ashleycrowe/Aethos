import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const peopleSource = readFileSync(new URL('./PeopleCenter.tsx', import.meta.url), 'utf8');
const personCardSource = readFileSync(new URL('./PersonCard.tsx', import.meta.url), 'utf8');

describe('PeopleCenter mobile readiness contract', () => {
  it('keeps directory and manager controls mobile-first', () => {
    expect(peopleSource).toContain('overflow-x-hidden');
    expect(peopleSource).toContain('min-h-[44px] w-full');
    expect(peopleSource).toContain('grid flex-1 grid-cols-1');
    expect(peopleSource).toContain('sm:flex-row sm:items-center sm:justify-between');
  });

  it('keeps identity cards and profile modal usable on phones', () => {
    expect(personCardSource).toContain('break-words text-sm font-bold');
    expect(personCardSource).toContain('sm:items-center sm:p-6');
    expect(personCardSource).toContain('rounded-t-[28px]');
    expect(personCardSource).toContain('flex min-h-[44px] min-w-[44px]');
    expect(personCardSource).toContain('grid grid-cols-2 gap-3 sm:flex');
  });
});
