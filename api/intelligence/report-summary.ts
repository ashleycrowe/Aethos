/**
 * Operational Intelligence Report Summary
 *
 * PURPOSE: Live-backed discovery, risk, ownership, and health-score rollup.
 * VERSION: V1
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireApiContext, sendApiError, supabase } from '../_lib/apiAuth.js';
import {
  buildReportSummary,
  type ReportFileRow,
  type ReportRemediationActionRow,
  type ReportScanRow,
  type ReportSiteRow,
  type ReportOwnerStatusRow,
} from './reportSummaryCore.js';

async function fetchFiles(tenantId: string): Promise<ReportFileRow[]> {
  const pageSize = 1000;
  const rows: ReportFileRow[] = [];

  for (let from = 0; ; from += pageSize) {
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from('files')
      .select(
        [
          'id',
          'provider_type',
          'name',
          'path',
          'size_bytes',
          'modified_at',
          'owner_email',
          'owner_name',
          'is_stale',
          'is_orphaned',
          'has_external_share',
          'external_user_count',
          'risk_score',
          'intelligence_score',
          'ai_tags',
          'ai_category',
        ].join(',')
      )
      .eq('tenant_id', tenantId)
      .range(from, to);

    if (error) throw error;
    rows.push(...((data || []) as ReportFileRow[]));

    if (!data || data.length < pageSize) break;
  }

  return rows;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  try {
    const { tenantId } = context;

    const [
      { data: sites, error: sitesError },
      { data: scans, error: scansError },
      { data: remediationActions, error: remediationError, count: remediationDryRunCount },
      { data: ownerStatuses, error: ownerStatusError },
      files,
    ] = await Promise.all([
      supabase
        .from('sites')
        .select('id, provider_type')
        .eq('tenant_id', tenantId),
      supabase
        .from('discovery_scans')
        .select('id,status,completed_at,started_at,files_discovered,sites_discovered,new_files,errors')
        .eq('tenant_id', tenantId)
        .order('started_at', { ascending: false })
        .limit(2),
      supabase
        .from('remediation_actions')
        .select('id,action_type,file_count,status,executed_at,completed_at,success_count,failed_count,metadata', { count: 'exact' })
        .eq('tenant_id', tenantId)
        .contains('metadata', { dry_run: true })
        .order('executed_at', { ascending: false })
        .limit(5),
      supabase
        .from('owner_status_cache')
        .select('owner_email,owner_name,status,lookup_status,account_enabled,user_type,last_checked_at')
        .eq('tenant_id', tenantId),
      fetchFiles(tenantId),
    ]);

    if (sitesError) throw sitesError;
    if (scansError) throw scansError;
    if (remediationError) throw remediationError;
    if (ownerStatusError) throw ownerStatusError;

    const summary = buildReportSummary({
      tenantId,
      files,
      sites: (sites || []) as ReportSiteRow[],
      scans: (scans || []) as ReportScanRow[],
      remediationActions: (remediationActions || []) as ReportRemediationActionRow[],
      remediationDryRunTotal: remediationDryRunCount ?? undefined,
      ownerStatuses: (ownerStatuses || []) as ReportOwnerStatusRow[],
    });

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error('Error generating report summary:', error);
    sendApiError(res, 500, 'Failed to generate report summary');
  }
}
