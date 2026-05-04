export const DEMO_MODE_STORAGE_KEY = 'aethos_demo_mode';

export const getEnvDemoModeDefault = () => {
  return String(import.meta.env.VITE_DEMO_MODE ?? 'false').toLowerCase() === 'true';
};

export const isDemoModeEnabled = () => {
  if (typeof window !== 'undefined') {
    const sessionOverride = window.localStorage.getItem(DEMO_MODE_STORAGE_KEY);
    if (sessionOverride !== null) return sessionOverride === 'true';
  }

  return getEnvDemoModeDefault();
};

export const DEMO_MODE_MESSAGE = 'Demo mode is enabled for this browser session';
