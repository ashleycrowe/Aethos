import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { DEMO_MODE_STORAGE_KEY, getRuntimeSurface, isDemoModeEnabled } from './demoMode';

const versionToggleSource = readFileSync(
  new URL('../components/VersionToggle.tsx', import.meta.url),
  'utf8'
);

function stubWindow(initialValue: string | null, hostname = 'localhost') {
  const store = new Map<string, string>();
  if (initialValue !== null) {
    store.set(DEMO_MODE_STORAGE_KEY, initialValue);
  }

  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
    },
    location: {
      hostname,
    },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('demo mode config', () => {
  it('uses the browser session override before the environment default', () => {
    stubWindow('true');
    expect(isDemoModeEnabled()).toBe(true);

    stubWindow('false');
    expect(isDemoModeEnabled()).toBe(false);
  });

  it('locks known client domains to their runtime surfaces', () => {
    stubWindow('true', 'app.aethoswork.com');
    expect(getRuntimeSurface()).toBe('live');
    expect(isDemoModeEnabled()).toBe(false);

    stubWindow('false', 'demo.aethoswork.com');
    expect(getRuntimeSurface()).toBe('demo');
    expect(isDemoModeEnabled()).toBe(true);
  });

  it('keeps the global version toggle visible in live and demo sessions', () => {
    expect(versionToggleSource).toContain("{isDemoMode ? 'Demo Mode' : 'Live Mode'}");
    expect(versionToggleSource).not.toContain('return null; // Hide completely when demo mode is off');
  });
});
