import { DEMO_MODE_STORAGE_KEY, isDemoModeEnabled } from '@/app/config/demoMode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const DIAGNOSTICS_ENABLED =
  String(import.meta.env.VITE_DIAGNOSTICS_ENABLED ?? 'true').toLowerCase() !== 'false';
const SESSION_STORAGE_KEY = 'aethos_diagnostics_session_id';

type Severity = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

type DiagnosticsContext = {
  tenantId?: string | null;
  userId?: string | null;
  isAuthenticated?: boolean;
  demoMode?: boolean;
  version?: string;
};

type DiagnosticEvent = {
  severity: Severity;
  source?: 'client' | 'api' | 'auth' | 'graph' | 'supabase';
  eventName: string;
  message: string;
  metadata?: Record<string, unknown>;
};

let installed = false;
let context: DiagnosticsContext = {};

function getSessionId() {
  const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;

  const next =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `diag-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, next);
  return next;
}

function sanitize(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack?.slice(0, 3000),
    };
  }

  if (typeof value === 'string') {
    return value
      .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer [redacted]')
      .replace(/eyJ[A-Za-z0-9._-]+/g, '[jwt-redacted]');
  }

  if (Array.isArray(value)) return value.map(sanitize);

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nested]) => [key, sanitize(nested)])
    );
  }

  return value;
}

export function updateDiagnosticsContext(next: DiagnosticsContext) {
  context = { ...context, ...next };
}

export function captureDiagnostic(event: DiagnosticEvent) {
  if (!DIAGNOSTICS_ENABLED || typeof window === 'undefined') return;

  const payload = {
    tenantId: context.tenantId || window.localStorage.getItem('aethos_tenant_id'),
    userId: context.userId || window.localStorage.getItem('aethos_user_id'),
    sessionId: getSessionId(),
    severity: event.severity,
    source: event.source || 'client',
    eventName: event.eventName,
    message: event.message,
    route: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    userAgent: window.navigator.userAgent,
    metadata: sanitize({
      ...event.metadata,
      demoMode: context.demoMode ?? isDemoModeEnabled(),
      demoOverride: window.localStorage.getItem(DEMO_MODE_STORAGE_KEY),
      isAuthenticated: context.isAuthenticated,
      version: context.version,
    }),
  };

  const body = JSON.stringify(payload);
  const url = `${API_BASE_URL}/diagnostics/client-log`;

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
    return;
  }

  void fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    // Diagnostics must never break the app.
  });
}

export function installDiagnostics() {
  if (installed || !DIAGNOSTICS_ENABLED || typeof window === 'undefined') return;
  installed = true;

  window.addEventListener('error', (event) => {
    captureDiagnostic({
      severity: 'error',
      eventName: 'window.error',
      message: event.message || 'Unhandled browser error',
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      },
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    captureDiagnostic({
      severity: 'error',
      eventName: 'window.unhandledrejection',
      message: event.reason?.message || String(event.reason || 'Unhandled promise rejection'),
      metadata: { reason: event.reason },
    });
  });

  const originalError = console.error.bind(console);
  const originalWarn = console.warn.bind(console);

  console.error = (...args: unknown[]) => {
    originalError(...args);
    captureDiagnostic({
      severity: 'error',
      eventName: 'console.error',
      message: args.map((arg) => (arg instanceof Error ? arg.message : String(arg))).join(' '),
      metadata: { args },
    });
  };

  console.warn = (...args: unknown[]) => {
    originalWarn(...args);
    captureDiagnostic({
      severity: 'warn',
      eventName: 'console.warn',
      message: args.map((arg) => (arg instanceof Error ? arg.message : String(arg))).join(' '),
      metadata: { args },
    });
  };
}
