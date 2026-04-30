export const isDemoModeEnabled = () => {
  return String(import.meta.env.VITE_DEMO_MODE ?? 'false').toLowerCase() === 'true';
};

export const DEMO_MODE_MESSAGE = 'Demo mode is enabled by VITE_DEMO_MODE';
