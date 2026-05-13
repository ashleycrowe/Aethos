export const DEMO_MODE_STORAGE_KEY = 'aethos_demo_mode';

export type RuntimeSurface = 'live' | 'demo' | 'pre-release' | 'local';

const LIVE_CLIENT_HOSTS = new Set([
  'app.aethoswork.com',
  'app.aethos.com',
]);

const DEMO_HOSTS = new Set([
  'demo.aethoswork.com',
  'demo.aethos.com',
]);

const PRE_RELEASE_HOSTS = new Set([
  'pre-demo.aethoswork.com',
  'preview-demo.aethoswork.com',
  'prerelease-demo.aethoswork.com',
]);

const getHostname = () => {
  if (typeof window === 'undefined') return '';
  return window.location?.hostname?.toLowerCase() || '';
};

export const getRuntimeSurface = (): RuntimeSurface => {
  const hostname = getHostname();
  if (LIVE_CLIENT_HOSTS.has(hostname)) return 'live';
  if (DEMO_HOSTS.has(hostname)) return 'demo';
  if (PRE_RELEASE_HOSTS.has(hostname)) return 'pre-release';

  const envSurface = String(import.meta.env.VITE_AETHOS_SURFACE ?? '').toLowerCase();
  if (['live', 'demo', 'pre-release', 'local'].includes(envSurface)) {
    return envSurface as RuntimeSurface;
  }

  return 'local';
};

const hasExplicitDemoModeEnv = () => import.meta.env.VITE_DEMO_MODE !== undefined;

export const getEnvDemoModeDefault = () => {
  if (hasExplicitDemoModeEnv()) {
    return String(import.meta.env.VITE_DEMO_MODE).toLowerCase() === 'true';
  }

  const surface = getRuntimeSurface();
  return surface === 'demo' || surface === 'pre-release';
};

export const isDemoOverrideAllowed = () => {
  if (getRuntimeSurface() !== 'local') return false;

  const explicit = String(import.meta.env.VITE_ALLOW_DEMO_OVERRIDE ?? '').toLowerCase();
  if (explicit === 'true') return true;
  if (explicit === 'false') return false;

  return true;
};

export const isDemoModeEnabled = () => {
  const surface = getRuntimeSurface();
  if (surface === 'live') return false;
  if (surface === 'demo' || surface === 'pre-release') return true;

  if (typeof window !== 'undefined' && isDemoOverrideAllowed()) {
    const sessionOverride = window.localStorage.getItem(DEMO_MODE_STORAGE_KEY);
    if (sessionOverride !== null) return sessionOverride === 'true';
  }

  return getEnvDemoModeDefault();
};

export const getRuntimeModeLabel = () => {
  if (isDemoModeEnabled()) return 'Demo: fixture data';
  return 'Live: real tenant data';
};

export const DEMO_MODE_MESSAGE = 'Demo mode is enabled for this browser session';
