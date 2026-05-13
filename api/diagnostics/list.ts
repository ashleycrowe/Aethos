import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireApiContext, sendApiError, supabase } from '../_lib/apiAuth.js';

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

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

function normalizeLimit(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_LIMIT;
  return Math.min(Math.floor(parsed), MAX_LIMIT);
}

function getMetadataString(metadata: Record<string, unknown> | null, key: string) {
  const value = metadata?.[key];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function getLastAction(metadata: Record<string, unknown> | null) {
  const value = metadata?.lastAction;
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    const events = ((data || []) as DiagnosticRow[]).map((event) => {
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

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error('Error fetching diagnostics:', error);
    sendApiError(res, 500, 'Failed to fetch diagnostics');
  }
}
