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

function currentPeriodMonth() {
  const period = new Date();
  period.setUTCDate(1);
  period.setUTCHours(0, 0, 0, 0);
  return period.toISOString().slice(0, 10);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  const { tenantId } = context;

  try {
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id,subscription_tier,ai_features_enabled,api_consent_revoked,api_consent_revoked_at,missing_graph_scopes,last_graph_error')
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
        graphConsent: {
          revoked: false,
          missingScopes: [],
          revokedAt: null,
          documentation: {},
        },
        creditUsage: null,
        blockers: [
          'Apply V1.5 Supabase migrations 003, 009, and 010 before validating AI+.',
        ],
        details: tenantError.message,
      });
    }

    const openAiConfigured = Boolean(process.env.OPENAI_API_KEY);
    const tenantAiEnabled = Boolean(tenant?.ai_features_enabled);
    const missingGraphScopes = Array.isArray(tenant?.missing_graph_scopes)
      ? tenant.missing_graph_scopes
      : [];
    const graphConsentRevoked = Boolean(tenant?.api_consent_revoked);
    const [indexedFiles, indexedChunks, piiScans, pendingAiSuggestions] = await Promise.all([
      countRows('files', tenantId, (query) => query.eq('content_indexed', true)),
      countRows('content_embeddings', tenantId),
      countRows('pii_detections', tenantId),
      countRows('metadata_suggestions', tenantId, (query) =>
        query.eq('suggestion_type', 'content_enrichment').eq('status', 'pending')
      ),
    ]);

    const periodMonth = currentPeriodMonth();
    const [{ data: aiSettings }, { data: creditBalance }, { data: recentLedger }] = await Promise.all([
      supabase
        .from('tenant_ai_settings')
        .select('monthly_credit_limit,trial_credit_grant,indexing_file_limit,credits_enforced,allow_overage')
        .eq('tenant_id', tenantId)
        .single(),
      supabase
        .from('ai_credit_balances')
        .select('period_month,monthly_credit_limit,credits_used,credits_reserved,status')
        .eq('tenant_id', tenantId)
        .eq('period_month', periodMonth)
        .single(),
      supabase
        .from('ai_credit_ledger')
        .select('action_type,credit_cost,cached,status,created_at')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    const creditLimit = creditBalance?.monthly_credit_limit || aiSettings?.monthly_credit_limit || 0;
    const creditsUsed = creditBalance?.credits_used || 0;
    const creditsReserved = creditBalance?.credits_reserved || 0;
    const creditsRemaining = Math.max(0, creditLimit - creditsUsed - creditsReserved);

    const blockers = [
      !openAiConfigured ? 'Set OPENAI_API_KEY in the backend environment.' : null,
      !tenantAiEnabled ? 'Enable tenants.ai_features_enabled for this test tenant.' : null,
      graphConsentRevoked ? `Microsoft Graph consent needs re-authorization for ${missingGraphScopes[0] || 'required Aethos scopes'}.` : null,
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
      graphConsent: {
        revoked: graphConsentRevoked,
        missingScopes: missingGraphScopes,
        revokedAt: tenant?.api_consent_revoked_at || null,
        lastError: tenant?.last_graph_error || {},
        documentation: {
          'Files.Read.All': 'https://learn.microsoft.com/en-us/graph/permissions-reference#filesreadall',
          'Sites.Read.All': 'https://learn.microsoft.com/en-us/graph/permissions-reference#sitesreadall',
          'Group.Read.All': 'https://learn.microsoft.com/en-us/graph/permissions-reference#groupreadall',
          'User.Read': 'https://learn.microsoft.com/en-us/graph/permissions-reference#userread',
        },
      },
      creditUsage: {
        periodMonth,
        monthlyCreditLimit: creditLimit,
        creditsUsed,
        creditsReserved,
        creditsRemaining,
        status: creditBalance?.status || 'active',
        creditsEnforced: Boolean(aiSettings?.credits_enforced),
        allowOverage: Boolean(aiSettings?.allow_overage),
        trialCreditGrant: aiSettings?.trial_credit_grant || 0,
        indexingFileLimit: aiSettings?.indexing_file_limit || 0,
        recentLedger: recentLedger || [],
      },
      blockers,
    });
  } catch (error: any) {
    console.error('AI+ readiness failed:', error);
    return sendApiError(res, 500, 'Unable to evaluate AI+ readiness', 'DATABASE_ERROR', error.message);
  }
}
