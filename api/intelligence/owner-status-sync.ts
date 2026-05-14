/**
 * Owner Status Sync API
 *
 * PURPOSE: V1.5 Entra owner-status enrichment spike.
 * Reads owner emails from indexed files, looks them up in Microsoft Graph when
 * permissions allow, and caches the result for Ownership & Offboarding Risk.
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireApiContext, sendApiError, supabase } from '../_lib/apiAuth.js';
import { lookupOwnerStatus } from '../../src/lib/microsoftGraph.js';

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  return normalized.includes('@') ? normalized : null;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  if (!context.accessToken) {
    return sendApiError(res, 401, 'Missing authorization token', 'AUTH_TOKEN_MISSING');
  }

  const limit = Math.max(1, Math.min(Number(req.body?.limit) || 25, 50));

  const { data: ownerRows, error: ownerError } = await supabase
    .from('files')
    .select('owner_email,owner_name')
    .eq('tenant_id', context.tenantId)
    .not('owner_email', 'is', null)
    .limit(500);

  if (ownerError) {
    console.error('Owner status candidate query failed:', ownerError);
    return sendApiError(res, 500, 'Failed to query owner candidates', 'DATABASE_ERROR');
  }

  const ownerCandidates = new Map<string, { ownerEmail: string; ownerName: string | null; fileCount: number }>();

  (ownerRows || []).forEach((row) => {
    const ownerEmail = normalizeEmail(row.owner_email);
    if (!ownerEmail) return;

    const existing = ownerCandidates.get(ownerEmail) || {
      ownerEmail,
      ownerName: typeof row.owner_name === 'string' ? row.owner_name : null,
      fileCount: 0,
    };
    existing.fileCount += 1;
    ownerCandidates.set(ownerEmail, existing);
  });

  const owners = Array.from(ownerCandidates.values())
    .sort((a, b) => b.fileCount - a.fileCount || a.ownerEmail.localeCompare(b.ownerEmail))
    .slice(0, limit);

  const results = [];

  for (const owner of owners) {
    const lookup = await lookupOwnerStatus(context.accessToken, owner.ownerEmail);
    const checkedAt = new Date().toISOString();

    const { data: cached, error: cacheError } = await supabase
      .from('owner_status_cache')
      .upsert(
        {
          tenant_id: context.tenantId,
          owner_email: owner.ownerEmail,
          owner_name: lookup.displayName || owner.ownerName,
          microsoft_user_id: lookup.microsoftUserId || null,
          user_principal_name: lookup.userPrincipalName || null,
          account_enabled: lookup.accountEnabled ?? null,
          user_type: lookup.userType || null,
          status: lookup.status,
          lookup_status: lookup.lookupStatus,
          last_checked_at: checkedAt,
          error_message: lookup.errorMessage || null,
          raw_response: lookup.rawResponse || {},
          metadata: {
            source: 'owner-status-sync',
            indexed_file_count: owner.fileCount,
            v15_readiness: true,
          },
        },
        { onConflict: 'tenant_id,owner_email' }
      )
      .select('id, owner_email, status, lookup_status, last_checked_at')
      .single();

    if (cacheError) {
      console.error('Owner status cache upsert failed:', cacheError);
      results.push({
        ownerEmail: owner.ownerEmail,
        status: 'error',
        lookupStatus: 'error',
        error: 'Failed to cache owner status',
      });
      continue;
    }

    results.push({
      id: cached?.id,
      ownerEmail: owner.ownerEmail,
      status: lookup.status,
      lookupStatus: lookup.lookupStatus,
      fileCount: owner.fileCount,
      lastCheckedAt: cached?.last_checked_at || checkedAt,
    });
  }

  return res.status(200).json({
    success: true,
    checked: results.length,
    permissionRequired: results.filter((result) => result.lookupStatus === 'permission_required').length,
    notFound: results.filter((result) => result.lookupStatus === 'not_found').length,
    results,
  });
}
