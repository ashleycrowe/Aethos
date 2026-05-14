/**
 * Metadata Suggestion Decision API
 *
 * PURPOSE: Record review decisions for Aethos-side metadata suggestions.
 * V1.5 SCOPE: Audit-only. This endpoint does not write metadata back to Microsoft 365.
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireApiContext, sendApiError, supabase } from '../_lib/apiAuth.js';

const VALID_STATUSES = new Set(['accepted', 'edited', 'rejected', 'blocked']);
const VALID_TYPES = new Set(['title', 'tag', 'category', 'owner']);
const VALID_CONFIDENCE = new Set(['high', 'medium', 'low']);

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  const {
    suggestionId,
    suggestionType,
    decisionStatus,
    affectedCount = 0,
    confidence,
    sourceSignals = [],
    rationale,
    suggestedValue = {},
    editedValue = {},
    metadata = {},
  } = req.body;

  if (!suggestionId || typeof suggestionId !== 'string') {
    return sendApiError(res, 400, 'Missing suggestion ID', 'VALIDATION_ERROR');
  }

  if (!VALID_TYPES.has(suggestionType)) {
    return sendApiError(res, 400, 'Invalid suggestion type', 'VALIDATION_ERROR');
  }

  if (!VALID_STATUSES.has(decisionStatus)) {
    return sendApiError(res, 400, 'Invalid decision status', 'VALIDATION_ERROR');
  }

  if (confidence && !VALID_CONFIDENCE.has(confidence)) {
    return sendApiError(res, 400, 'Invalid confidence value', 'VALIDATION_ERROR');
  }

  const { data: decision, error } = await supabase
    .from('metadata_suggestion_decisions')
    .insert({
      tenant_id: context.tenantId,
      suggestion_id: suggestionId,
      suggestion_type: suggestionType,
      decision_status: decisionStatus,
      affected_count: Number.isFinite(Number(affectedCount)) ? Math.max(0, Number(affectedCount)) : 0,
      confidence: confidence || null,
      source_signals: stringArray(sourceSignals),
      rationale: typeof rationale === 'string' ? rationale : null,
      suggested_value: suggestedValue && typeof suggestedValue === 'object' ? suggestedValue : {},
      edited_value: editedValue && typeof editedValue === 'object' ? editedValue : {},
      decided_by: context.userId || null,
      metadata: metadata && typeof metadata === 'object'
        ? {
            ...metadata,
            source_system_writeback: false,
            review_first: true,
          }
        : {
            source_system_writeback: false,
            review_first: true,
          },
    })
    .select('id, suggestion_id, decision_status, decided_at')
    .single();

  if (error || !decision) {
    console.error('Metadata suggestion decision insert failed:', error);
    return sendApiError(res, 500, 'Failed to record metadata suggestion decision', 'DATABASE_ERROR');
  }

  return res.status(200).json({
    success: true,
    decision: {
      id: decision.id,
      suggestionId: decision.suggestion_id,
      decisionStatus: decision.decision_status,
      decidedAt: decision.decided_at,
    },
  });
}
