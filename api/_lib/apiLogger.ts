import { VercelRequest } from '@vercel/node';

type ApiLogLevel = 'debug' | 'info' | 'warn' | 'error';

type ApiLogContext = {
  route?: string;
  tenantId?: string;
  userId?: string;
  requestId?: string;
  statusCode?: number;
  durationMs?: number;
  metadata?: Record<string, unknown>;
  error?: unknown;
};

function firstHeader(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function getApiRequestId(req: VercelRequest) {
  return (
    firstHeader(req.headers['x-vercel-id']) ||
    firstHeader(req.headers['x-request-id']) ||
    `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );
}

function normalizeError(error: unknown) {
  if (!error) return undefined;
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
    };
  }
  if (typeof error === 'object') return error;
  return { message: String(error) };
}

export function logApiEvent(level: ApiLogLevel, event: string, context: ApiLogContext = {}) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    event,
    route: context.route,
    tenantId: context.tenantId,
    userId: context.userId,
    requestId: context.requestId,
    statusCode: context.statusCode,
    durationMs: context.durationMs,
    metadata: context.metadata,
    error: normalizeError(context.error),
  };

  const line = JSON.stringify(payload);
  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}
