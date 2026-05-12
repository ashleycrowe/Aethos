import { describe, expect, it } from 'vitest';
import { buildReportSummary, type ReportFileRow } from './reportSummaryCore';

const baseFile = (overrides: Partial<ReportFileRow>): ReportFileRow => ({
  id: crypto.randomUUID(),
  provider_type: 'sharepoint',
  name: 'Policy.docx',
  path: '/sites/ops/Policy.docx',
  size_bytes: 1024,
  modified_at: '2026-01-01T00:00:00.000Z',
  owner_email: 'owner@example.com',
  owner_name: 'Owner',
  is_stale: false,
  is_orphaned: false,
  has_external_share: false,
  external_user_count: 0,
  risk_score: 0,
  intelligence_score: 50,
  ai_tags: ['policy'],
  ai_category: 'operations',
  ...overrides,
});

describe('buildReportSummary', () => {
  it('suppresses tenant health score for low-maturity tenants', () => {
    const summary = buildReportSummary({
      tenantId: 'tenant-1',
      files: [baseFile({})],
      sites: [{ id: 'site-1', provider_type: 'sharepoint' }],
      scans: [],
      generatedAt: '2026-05-12T00:00:00.000Z',
    });

    expect(summary.healthScore.score).toBeNull();
    expect(summary.healthScore.label).toBe('not_enough_data');
    expect(summary.healthScore.dataMaturity).toBe('low');
    expect(summary.globalRisk.riskRating).toBe('Not Enough Data');
  });

  it('prioritizes external shares and owner liability for messy tenants', () => {
    const files = Array.from({ length: 60 }, (_, index) =>
      baseFile({
        id: `file-${index}`,
        provider_type: index < 40 ? 'onedrive' : 'sharepoint',
        owner_email: index < 30 ? 'alex@example.com' : index < 45 ? null : 'clean@example.com',
        owner_name: index < 30 ? 'Alex' : index < 45 ? null : 'Clean Owner',
        has_external_share: index < 20,
        risk_score: index < 12 ? 85 : 20,
        is_stale: index >= 30 && index < 55,
      })
    );

    const summary = buildReportSummary({
      tenantId: 'tenant-1',
      files,
      sites: [
        { id: 'site-1', provider_type: 'sharepoint' },
        { id: 'site-2', provider_type: 'teams' },
        { id: 'site-3', provider_type: 'sharepoint' },
      ],
      scans: [
        {
          id: 'scan-1',
          status: 'completed',
          completed_at: '2026-05-12T00:00:00.000Z',
          started_at: '2026-05-12T00:00:00.000Z',
          files_discovered: 60,
          sites_discovered: 3,
          new_files: 60,
          errors: [],
        },
      ],
      remediationActions: [
        {
          id: 'action-2',
          action_type: 'delete',
          file_count: 99,
          status: 'completed',
          executed_at: '2026-05-12T02:00:00.000Z',
          completed_at: '2026-05-12T02:00:01.000Z',
          success_count: 99,
          failed_count: 0,
          metadata: { dry_run: false },
        },
        {
          id: 'action-1',
          action_type: 'revoke_links',
          file_count: 3,
          status: 'completed',
          executed_at: '2026-05-12T01:00:00.000Z',
          completed_at: '2026-05-12T01:00:01.000Z',
          success_count: 3,
          failed_count: 0,
          metadata: { dry_run: true },
        },
      ],
      remediationDryRunTotal: 7,
      generatedAt: '2026-05-12T00:00:00.000Z',
    });

    expect(summary.healthScore.score).not.toBeNull();
    expect(summary.globalRisk.tenantExposureIndex).not.toBeNull();
    expect(summary.healthScore.drivers[0]).toBe('Unsecured External Shares');
    expect(summary.ownership.topRiskOwners[0].ownerLiabilityScore).toBeGreaterThan(0);
    expect(summary.ownership.ownerMetadataCoverage).toMatchObject({
      filesWithOwner: 45,
      coveragePercent: 75,
      status: 'partial',
    });
    expect(summary.risk.externallySharedFiles).toBe(20);
    expect(summary.risk.missingOwnerFiles).toBe(15);
    expect(summary.exposureReview.externalUsersTotal).toBe(0);
    expect(summary.exposureReview.externalSharesOnStaleFiles).toBe(0);
    expect(summary.exposureReview.providerBreakdown[0]).toMatchObject({
      label: 'onedrive',
      fileCount: 20,
    });
    expect(summary.staleContentReview.providerBreakdown[0]).toMatchObject({
      label: 'sharepoint',
      fileCount: 15,
    });
    expect(summary.exposureReview.topFiles.length).toBeGreaterThan(0);
    expect(summary.staleContentReview.topFiles.length).toBeGreaterThan(0);
    expect(summary.exposureReview.topFiles[0]).toMatchObject({
      name: 'Policy.docx',
      riskScore: expect.any(Number),
    });
    expect(summary.remediationDryRun.totalDryRuns).toBe(7);
    expect(summary.remediationDryRun.recentDryRuns).toHaveLength(1);
    expect(summary.remediationDryRun.recentDryRuns[0]).toMatchObject({
      actionType: 'revoke_links',
      fileCount: 3,
    });
    expect(summary.workspaceOpportunities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'Alex Handoff Review',
          suggestedTags: expect.arrayContaining(['owner-risk', 'handoff']),
        }),
      ])
    );
  });
});
