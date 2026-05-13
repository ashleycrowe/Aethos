import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireApiContext, sendApiError, supabase } from '../_lib/apiAuth.js';

const MAX_MESSAGE_LENGTH = 2000;
const MAX_METADATA_BYTES = 6000;
const DEFAULT_LIST_LIMIT = 25;
const MAX_LIST_LIMIT = 100;

type DiagnosticPayload = {
  action?: string;
  tenantId?: string | null;
  userId?: string | null;
  sessionId?: string | null;
  severity?: string;
  source?: string;
  eventName?: string;
  message?: string;
  route?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
};

type DiagnosticRow = {
  id: string;
  session_id: string | null;
  severity: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  source: string;
  event_name: string;
  message: string;
  route: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function allowedSeverity(value: unknown) {
  const severity = asString(value, 'error');
  return ['debug', 'info', 'warn', 'error', 'fatal'].includes(severity) ? severity : 'error';
}

function allowedSource(value: unknown) {
  const source = asString(value, 'client');
  return ['client', 'api', 'auth', 'graph', 'supabase'].includes(source) ? source : 'client';
}

function safeMetadata(metadata: unknown) {
  if (!metadata || typeof metadata !== 'object') return {};

  const serialized = JSON.stringify(metadata, (_key, value) => {
    if (typeof value === 'string') {
      return value
        .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer [redacted]')
        .replace(/eyJ[A-Za-z0-9._-]+/g, '[jwt-redacted]');
    }
    return value;
  });

  if (serialized.length > MAX_METADATA_BYTES) {
    return { truncated: true, preview: serialized.slice(0, MAX_METADATA_BYTES) };
  }

  return JSON.parse(serialized);
}

function normalizeLimit(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_LIST_LIMIT;
  return Math.min(Math.floor(parsed), MAX_LIST_LIMIT);
}

function getMetadataString(metadata: Record<string, unknown> | null, key: string) {
  const value = metadata?.[key];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function getLastAction(metadata: Record<string, unknown> | null) {
  const value = metadata?.lastAction;
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null;
}

async function listDiagnostics(req: VercelRequest, res: VercelResponse) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  try {
    const limit = normalizeLimit(req.body?.limit);
    const { tenantId } = context;

    const { data, error } = await supabase
      .from('app_diagnostics')
      .select('id,session_id,severity,source,event_name,message,route,user_agent,metadata,created_at')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const events = ((data || []) as unknown as DiagnosticRow[]).map((event) => {
      const metadata = event.metadata || {};
      const lastAction = getLastAction(metadata);
      const actionTaken =
        getMetadataString(metadata, 'actionTaken') ||
        (typeof lastAction?.actionTaken === 'string' ? lastAction.actionTaken : undefined);
      const expectedResult =
        getMetadataString(metadata, 'expectedResult') ||
        (typeof lastAction?.expectedResult === 'string' ? lastAction.expectedResult : undefined);

      return {
        id: event.id,
        createdAt: event.created_at,
        sessionId: event.session_id,
        severity: event.severity,
        source: event.source,
        eventName: event.event_name,
        message: event.message,
        route: event.route || 'Unknown route',
        userAgent: event.user_agent,
        actionTaken: actionTaken || 'No recent UI action captured',
        expectedResult:
          expectedResult || 'The selected app action completes without a browser or API error.',
        actualResult: getMetadataString(metadata, 'actualResult') || event.message,
        metadata,
      };
    });

    return res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error('Error fetching diagnostics:', error);
    return sendApiError(res, 500, 'Failed to fetch diagnostics');
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (process.env.DIAGNOSTICS_ENABLED === 'false') {
    return res.status(204).end();
  }

  const payload = (req.body || {}) as DiagnosticPayload;
  if (payload.action === 'list') {
    return listDiagnostics(req, res);
  }

  const message = asString(payload.message, 'Client diagnostic event').slice(0, MAX_MESSAGE_LENGTH);
  const eventName = asString(payload.eventName, 'client.event').slice(0, 120);

  try {
    const { error } = await supabase.from('app_diagnostics').insert({
      tenant_id: payload.tenantId || null,
      user_id: payload.userId || null,
      session_id: asString(payload.sessionId) || null,
      severity: allowedSeverity(payload.severity),
      source: allowedSource(payload.source),
      event_name: eventName,
      message,
      route: asString(payload.route).slice(0, 500) || null,
      user_agent: asString(payload.userAgent).slice(0, 500) || null,
      metadata: safeMetadata(payload.metadata),
    });

    if (error) {
      console.error('Failed to store client diagnostic:', error);
      return res.status(202).json({ success: false, stored: false });
    }

    return res.status(202).json({ success: true, stored: true });
  } catch (error) {
    console.error('Diagnostic endpoint failed:', error);
    return res.status(202).json({ success: false, stored: false });
  }
}
