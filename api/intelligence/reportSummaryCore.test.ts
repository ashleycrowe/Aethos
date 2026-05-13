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
    expect(summary.ownership.ownerStatusCoverage).toMatchObject({
      ownersWithStatus: 0,
      permissionRequired: 0,
      disabledOwners: 0,
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

  it('suggests workspaces from repeated metadata clusters', () => {
    const files = Array.from({ length: 6 }, (_, index) =>
      baseFile({
        id: `metadata-${index}`,
        path: `/sites/finance/Budget/${index}.docx`,
        ai_category: index < 4 ? 'financial-planning' : 'operations',
        ai_tags: index < 5 ? ['budget', 'planning'] : ['policy'],
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
      scans: [],
      generatedAt: '2026-05-12T00:00:00.000Z',
    });

    expect(summary.workspaceOpportunities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'Finance Workspace',
          fileCount: 6,
          suggestedTags: ['path', 'finance'],
        }),
        expect.objectContaining({
          label: 'Budget Workspace',
          fileCount: 5,
          suggestedTags: ['tag', 'budget'],
        }),
        expect.objectContaining({
          label: 'Financial Planning Workspace',
          fileCount: 4,
          suggestedTags: ['category', 'financial-planning'],
        }),
      ])
    );
  });

  it('includes owner status enrichment when cached', () => {
    const files = [
      baseFile({
        id: 'active-owner-file',
        owner_email: 'active@example.com',
        owner_name: 'Active Owner',
        has_external_share: true,
      }),
      baseFile({
        id: 'disabled-owner-file',
        owner_email: 'disabled@example.com',
        owner_name: 'Disabled Owner',
        risk_score: 90,
      }),
    ];

    const summary = buildReportSummary({
      tenantId: 'tenant-1',
      files,
      sites: [
        { id: 'site-1', provider_type: 'sharepoint' },
        { id: 'site-2', provider_type: 'teams' },
        { id: 'site-3', provider_type: 'sharepoint' },
      ],
      scans: [],
      ownerStatuses: [
        {
          owner_email: 'active@example.com',
          owner_name: 'Active Owner',
          status: 'active',
          lookup_status: 'completed',
          account_enabled: true,
          user_type: 'Member',
          last_checked_at: '2026-05-12T00:00:00.000Z',
        },
        {
          owner_email: 'disabled@example.com',
          owner_name: 'Disabled Owner',
          status: 'disabled',
          lookup_status: 'completed',
          account_enabled: false,
          user_type: 'Member',
          last_checked_at: '2026-05-11T00:00:00.000Z',
        },
      ],
      generatedAt: '2026-05-12T00:00:00.000Z',
    });

    expect(summary.ownership.ownerStatusCoverage).toMatchObject({
      ownersWithStatus: 2,
      disabledOwners: 1,
      guestOwners: 0,
      notFoundOwners: 0,
      staleStatusCount: 0,
      lastCheckedAt: '2026-05-12T00:00:00.000Z',
    });
    expect(summary.ownership.ownerStatusReview).toMatchObject({
      reviewRequiredOwners: 1,
      permissionRequiredOwners: 0,
      guestOwners: 0,
    });
    expect(summary.ownership.ownerStatusReview.topOwners[0]).toMatchObject({
      ownerEmail: 'disabled@example.com',
      status: 'disabled',
      highRiskCount: 1,
    });
    expect(summary.ownership.topRiskOwners).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ownerEmail: 'disabled@example.com',
          ownerStatus: 'disabled',
          ownerLookupStatus: 'completed',
        }),
      ])
    );
    expect(summary.workspaceOpportunities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'Disabled Owner Status Handoff',
          suggestedTags: expect.arrayContaining(['owner-status', 'handoff', 'disabled']),
        }),
      ])
    );
  });
});
