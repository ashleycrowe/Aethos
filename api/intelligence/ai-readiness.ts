/**
 * AI+ Readiness API - V1.5 pre-release validation
 *
 * PURPOSE: Report whether the current tenant can validate content intelligence.
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireApiContext, sendApiError, supabase } from '../_lib/apiAuth.js';

async function countRows(table: string, tenantId: string, extra?: (query: any) => any) {
  let query = supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', tenantId);

  if (extra) query = extra(query);
  const { count, error } = await query;
  if (error) throw error;
  return count || 0;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  const { tenantId } = context;

  try {
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id,subscription_tier,ai_features_enabled')
      .eq('id', tenantId)
      .single();

    if (tenantError) {
      return res.status(200).json({
        success: true,
        ready: false,
        migrationApplied: false,
        openAiConfigured: Boolean(process.env.OPENAI_API_KEY),
        tenantAiEnabled: false,
        subscriptionTier: null,
        indexedFiles: 0,
        indexedChunks: 0,
        piiScans: 0,
        pendingAiSuggestions: 0,
        blockers: [
          'Apply supabase/migrations/003_v15_to_v4_features.sql before validating AI+.',
        ],
        details: tenantError.message,
      });
    }

    const openAiConfigured = Boolean(process.env.OPENAI_API_KEY);
    const tenantAiEnabled = Boolean(tenant?.ai_features_enabled);
    const [indexedFiles, indexedChunks, piiScans, pendingAiSuggestions] = await Promise.all([
      countRows('files', tenantId, (query) => query.eq('content_indexed', true)),
      countRows('content_embeddings', tenantId),
      countRows('pii_detections', tenantId),
      countRows('metadata_suggestions', tenantId, (query) =>
        query.eq('suggestion_type', 'content_enrichment').eq('status', 'pending')
      ),
    ]);

    const blockers = [
      !openAiConfigured ? 'Set OPENAI_API_KEY in the backend environment.' : null,
      !tenantAiEnabled ? 'Enable tenants.ai_features_enabled for this test tenant.' : null,
      indexedChunks === 0 ? 'Run Oracle AI+ Index Content on at least one Microsoft file.' : null,
    ].filter((blocker): blocker is string => Boolean(blocker));

    return res.status(200).json({
      success: true,
      ready: blockers.length === 0,
      migrationApplied: true,
      openAiConfigured,
      tenantAiEnabled,
      subscriptionTier: tenant?.subscription_tier || null,
      indexedFiles,
      indexedChunks,
      piiScans,
      pendingAiSuggestions,
      blockers,
    });
  } catch (error: any) {
    console.error('AI+ readiness failed:', error);
    return sendApiError(res, 500, 'Unable to evaluate AI+ readiness', 'DATABASE_ERROR', error.message);
  }
}
