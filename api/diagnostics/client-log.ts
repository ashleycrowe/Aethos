import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/apiAuth.js';

const MAX_MESSAGE_LENGTH = 2000;
const MAX_METADATA_BYTES = 6000;

type DiagnosticPayload = {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (process.env.DIAGNOSTICS_ENABLED === 'false') {
    return res.status(204).end();
  }

  const payload = (req.body || {}) as DiagnosticPayload;
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
