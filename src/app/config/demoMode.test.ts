import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { DEMO_MODE_STORAGE_KEY, isDemoModeEnabled } from './demoMode';

const versionToggleSource = readFileSync(
  new URL('../components/VersionToggle.tsx', import.meta.url),
  'utf8'
);

function stubLocalStorage(initialValue: string | null) {
  const store = new Map<string, string>();
  if (initialValue !== null) {
    store.set(DEMO_MODE_STORAGE_KEY, initialValue);
  }

  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
    },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('demo mode config', () => {
  it('uses the browser session override before the environment default', () => {
    stubLocalStorage('true');
    expect(isDemoModeEnabled()).toBe(true);

    stubLocalStorage('false');
    expect(isDemoModeEnabled()).toBe(false);
  });

  it('keeps the global version toggle visible in live and demo sessions', () => {
    expect(versionToggleSource).toContain("{isDemoMode ? 'Demo Mode' : 'Live Mode'}");
    expect(versionToggleSource).not.toContain('return null; // Hide completely when demo mode is off');
  });
});
