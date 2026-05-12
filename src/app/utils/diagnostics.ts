import { DEMO_MODE_STORAGE_KEY, isDemoModeEnabled } from '@/app/config/demoMode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const DIAGNOSTICS_ENABLED =
  String(import.meta.env.VITE_DIAGNOSTICS_ENABLED ?? 'true').toLowerCase() !== 'false';
const SESSION_STORAGE_KEY = 'aethos_diagnostics_session_id';
const LOCAL_DIAGNOSTICS_KEY = 'aethos_local_diagnostics';
const MAX_LOCAL_DIAGNOSTICS = 75;
const DEFAULT_EXPECTED_RESULT = 'The selected app action completes without a browser or API error.';

export type Severity = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

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

export type StoredDiagnostic = {
  id: string;
  createdAt: string;
  severity: Severity;
  source: string;
  eventName: string;
  message: string;
  route: string;
  actionTaken?: string;
  expectedResult?: string;
  actualResult?: string;
  metadata?: unknown;
};

let installed = false;
let context: DiagnosticsContext = {};
let lastAction: {
  actionTaken: string;
  expectedResult: string;
  route: string;
  occurredAt: string;
} | null = null;

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

function sanitize(value: unknown, seen = new WeakSet<object>()): unknown {
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

  if (Array.isArray(value)) return value.map((nested) => sanitize(nested, seen));

  if (value && typeof value === 'object') {
    if (seen.has(value)) return '[circular]';
    seen.add(value);

    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
        key,
        sanitize(nested, seen),
      ])
    );
  }

  return value;
}

export function getLocalDiagnostics(): StoredDiagnostic[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(LOCAL_DIAGNOSTICS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearLocalDiagnostics() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(LOCAL_DIAGNOSTICS_KEY);
}

function storeLocalDiagnostic(event: StoredDiagnostic) {
  if (typeof window === 'undefined') return;

  try {
    const existing = getLocalDiagnostics();
    const next = [event, ...existing].slice(0, MAX_LOCAL_DIAGNOSTICS);
    window.localStorage.setItem(LOCAL_DIAGNOSTICS_KEY, JSON.stringify(next));
  } catch {
    // Local diagnostics are best-effort and must never affect app behavior.
  }
}

function compactText(value: string | null | undefined) {
  return value?.replace(/\s+/g, ' ').trim().slice(0, 160) || '';
}

function getElementLabel(element: Element) {
  const ariaLabel = compactText(element.getAttribute('aria-label'));
  const title = compactText(element.getAttribute('title'));
  const text = compactText(element.textContent);
  const placeholder =
    element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
      ? compactText(element.placeholder)
      : '';
  const value =
    element instanceof HTMLInputElement && element.type === 'submit'
      ? compactText(element.value)
      : '';

  return ariaLabel || title || value || placeholder || text || element.tagName.toLowerCase();
}

function rememberAction(actionTaken: string, expectedResult = DEFAULT_EXPECTED_RESULT) {
  lastAction = {
    actionTaken,
    expectedResult,
    route: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    occurredAt: new Date().toISOString(),
  };
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
      lastAction,
      demoMode: context.demoMode ?? isDemoModeEnabled(),
      demoOverride: window.localStorage.getItem(DEMO_MODE_STORAGE_KEY),
      isAuthenticated: context.isAuthenticated,
      version: context.version,
    }),
  };

  storeLocalDiagnostic({
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `local-diag-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
    severity: payload.severity,
    source: payload.source,
    eventName: payload.eventName,
    message: payload.message,
    route: payload.route,
    actionTaken: lastAction?.actionTaken || 'No recent UI action captured',
    expectedResult: lastAction?.expectedResult || DEFAULT_EXPECTED_RESULT,
    actualResult: payload.message,
    metadata: payload.metadata,
  });

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

  window.addEventListener(
    'click',
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const actionable = target?.closest(
        'button, a, input, select, textarea, [role="button"], [role="menuitem"], [data-diagnostic-action]'
      );
      if (!actionable) return;

      const explicitAction = compactText(actionable.getAttribute('data-diagnostic-action'));
      const label = explicitAction || getElementLabel(actionable);
      rememberAction(`Clicked ${label}`);
    },
    true
  );

  window.addEventListener(
    'submit',
    (event) => {
      const form = event.target instanceof HTMLFormElement ? event.target : null;
      if (!form) return;
      const label =
        compactText(form.getAttribute('aria-label')) ||
        compactText(form.getAttribute('name')) ||
        'form';
      rememberAction(`Submitted ${label}`);
    },
    true
  );

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
