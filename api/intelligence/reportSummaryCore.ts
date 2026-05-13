export type ReportFileRow = {
  id: string;
  provider_type: string | null;
  name: string | null;
  path: string | null;
  size_bytes: number | null;
  modified_at: string | null;
  owner_email: string | null;
  owner_name: string | null;
  is_stale: boolean | null;
  is_orphaned: boolean | null;
  has_external_share: boolean | null;
  external_user_count: number | null;
  risk_score: number | null;
  intelligence_score: number | null;
  ai_tags: string[] | null;
  ai_category: string | null;
  has_pii?: boolean | null;
  pii_risk_level?: string | null;
};

export type ReportSiteRow = {
  id: string;
  provider_type: string | null;
};

export type ReportScanRow = {
  id: string;
  status: string | null;
  completed_at: string | null;
  started_at: string | null;
  files_discovered: number | null;
  sites_discovered: number | null;
  new_files: number | null;
  errors: string[] | null;
};

export type ReportRemediationActionRow = {
  id: string;
  action_type: 'archive' | 'delete' | 'revoke_links' | string;
  file_count: number | null;
  status: string | null;
  executed_at: string | null;
  completed_at: string | null;
  success_count: number | null;
  failed_count: number | null;
  metadata: Record<string, unknown> | null;
};

export type ReportOwnerStatusRow = {
  owner_email: string | null;
  owner_name: string | null;
  status: 'active' | 'disabled' | 'deleted' | 'guest' | 'unknown' | 'not_found' | 'permission_required' | 'error' | string;
  lookup_status: 'pending' | 'completed' | 'not_found' | 'permission_required' | 'error' | string;
  account_enabled: boolean | null;
  user_type: string | null;
  last_checked_at: string | null;
};

export type ReportMetadataDecisionRow = {
  suggestion_id: string;
  suggestion_type: 'title' | 'tag' | 'category' | 'owner' | string;
  decision_status: 'accepted' | 'edited' | 'rejected' | 'blocked' | string;
  affected_count: number | null;
  decided_at: string | null;
  suggested_value: Record<string, unknown> | null;
  edited_value: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
};

export type RiskDriver = {
  label: string;
  category: 'external' | 'ownership' | 'high_risk' | 'stale' | 'storage';
  value: number;
  filterTarget: string;
};

export type ReportFileSample = {
  id: string;
  name: string;
  ownerEmail: string | null;
  ownerName: string | null;
  providerType: string | null;
  sizeBytes: number;
  modifiedAt: string | null;
  riskScore: number;
  externalUserCount: number;
};

export type ReportBucket = {
  label: string;
  fileCount: number;
  totalBytes: number;
};

export type TopicCluster = {
  label: string;
  source: 'tag' | 'category';
  fileCount: number;
  confidence: 'high' | 'medium' | 'low';
  suggestedTags: string[];
};

export type OwnerStatusReviewItem = {
  ownerEmail: string;
  ownerName: string | null;
  status: string;
  lookupStatus: string;
  fileCount: number;
  highRiskCount: number;
  externalShareCount: number;
  staleCount: number;
  ownerLiabilityScore: number;
  lastCheckedAt: string | null;
};

export type ReportSummary = {
  tenantId: string;
  generatedAt: string;
  healthScore: {
    score: number | null;
    label: 'not_enough_data' | 'healthy' | 'needs_review' | 'high_risk';
    dataMaturity: 'none' | 'low' | 'medium' | 'large';
    drivers: string[];
  };
  globalRisk: {
    tenantExposureIndex: number | null;
    riskRating: 'Not Enough Data' | 'Low' | 'Medium' | 'High' | 'Critical';
    primaryRiskFactor: string | null;
  };
  trend: {
    previousScanId: string | null;
    healthScoreDelta: number | null;
    externalShareDelta: number | null;
    staleFileDelta: number | null;
    missingOwnerDelta: number | null;
  };
  lastScan: {
    id: string | null;
    status: 'none' | 'running' | 'completed' | 'partial' | 'failed';
    completedAt: string | null;
    filesDiscovered: number;
    sitesDiscovered: number;
    newFiles: number;
    errorCount: number;
  };
  discovery: {
    totalFiles: number;
    totalSites: number;
    sharePointFiles: number;
    oneDriveFiles: number;
    teamsFiles: number;
    totalStorageBytes: number;
  };
  risk: {
    staleFiles: number;
    staleBytes: number;
    externallySharedFiles: number;
    highRiskFiles: number;
    missingOwnerFiles: number;
    sensitiveFiles: number;
    highPiiRiskFiles: number;
  };
  exposureReview: {
    externalUsersTotal: number;
    externalSharesOnStaleFiles: number;
    providerBreakdown: ReportBucket[];
    ownerBreakdown: ReportBucket[];
    topFiles: ReportFileSample[];
  };
  staleContentReview: {
    providerBreakdown: ReportBucket[];
    ownerBreakdown: ReportBucket[];
    topFiles: ReportFileSample[];
  };
  remediationDryRun: {
    totalDryRuns: number;
    recentDryRuns: Array<{
      id: string;
      actionType: string;
      fileCount: number;
      status: string;
      executedAt: string | null;
      successCount: number;
      failedCount: number;
    }>;
  };
  ownership: {
    uniqueOwners: number;
    unknownOwnerFiles: number;
    ownerMetadataCoverage: {
      filesWithOwner: number;
      coveragePercent: number;
      status: 'none' | 'partial' | 'complete';
    };
    topRiskOwners: Array<{
      ownerEmail: string | null;
      ownerName: string | null;
      ownerStatus: string | null;
      ownerLookupStatus: string | null;
      ownerStatusCheckedAt: string | null;
      fileCount: number;
      highRiskCount: number;
      externalShareCount: number;
      staleCount: number;
      missingOwnerCount: number;
      oneDriveFileCount: number;
      ownerLiabilityScore: number;
      primaryRiskFactor: string;
    }>;
    ownerStatusCoverage: {
      ownersWithStatus: number;
      permissionRequired: number;
      disabledOwners: number;
      guestOwners: number;
      notFoundOwners: number;
      staleStatusCount: number;
      lastCheckedAt: string | null;
    };
    ownerStatusReview: {
      reviewRequiredOwners: number;
      permissionRequiredOwners: number;
      guestOwners: number;
      staleStatusOwners: number;
      topOwners: OwnerStatusReviewItem[];
    };
  };
  workspaceOpportunities: Array<{
    label: string;
    reason: string;
    fileCount: number;
    suggestedTags: string[];
  }>;
  topicClusters: TopicCluster[];
  riskDrivers: RiskDriver[];
};

type BuildReportSummaryInput = {
  tenantId: string;
  files: ReportFileRow[];
  sites: ReportSiteRow[];
  scans: ReportScanRow[];
  remediationActions?: ReportRemediationActionRow[];
  remediationDryRunTotal?: number;
  ownerStatuses?: ReportOwnerStatusRow[];
  metadataDecisions?: ReportMetadataDecisionRow[];
  generatedAt?: string;
};

const HIGH_RISK_THRESHOLD = 70;
const STALE_DAYS = 180;
const MIN_WORKSPACE_CLUSTER_SIZE = 3;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function ratioScore(count: number, total: number, absoluteFloor = 0): number {
  if (total <= 0) return count > 0 ? absoluteFloor : 0;
  return clampScore(Math.max((count / total) * 100, count > 0 ? absoluteFloor : 0));
}

function hasOwner(file: ReportFileRow): boolean {
  return Boolean(file.owner_email?.trim() || file.owner_name?.trim());
}

function isHighRisk(file: ReportFileRow): boolean {
  return (file.risk_score || 0) >= HIGH_RISK_THRESHOLD;
}

function isOneDrive(file: ReportFileRow): boolean {
  return (file.provider_type || '').toLowerCase().includes('onedrive');
}

function isSharePoint(file: ReportFileRow): boolean {
  return (file.provider_type || '').toLowerCase().includes('sharepoint');
}

function isTeams(file: ReportFileRow): boolean {
  return (file.provider_type || '').toLowerCase().includes('team');
}

function isStale(file: ReportFileRow): boolean {
  if (file.is_stale) return true;
  if (!file.modified_at) return false;

  const modified = new Date(file.modified_at).getTime();
  if (Number.isNaN(modified)) return false;

  return Date.now() - modified > STALE_DAYS * 24 * 60 * 60 * 1000;
}

function isSensitiveFile(file: ReportFileRow): boolean {
  return Boolean(file.has_pii || file.pii_risk_level);
}

function isHighPiiRisk(file: ReportFileRow): boolean {
  return (file.pii_risk_level || '').toLowerCase() === 'high';
}

function titleCase(value: string): string {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getPathCluster(file: ReportFileRow): string | null {
  if (!file.path) return null;

  const ignoredSegments = new Set(['sites', 'drives', 'root', 'shared documents', 'documents', 'general']);
  const segments = file.path
    .split(/[\\/]/)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .filter((segment) => !ignoredSegments.has(segment.toLowerCase()))
    .filter((segment, index, all) => index < all.length - 1 || !segment.includes('.'));

  return segments[0] || null;
}

function getDataMaturity(fileCount: number, siteCount: number): ReportSummary['healthScore']['dataMaturity'] {
  if (fileCount === 0 || siteCount === 0) return 'none';
  if (fileCount < 50 || siteCount < 3) return 'low';
  if (fileCount >= 5000 || siteCount >= 100) return 'large';
  return 'medium';
}

function getHealthLabel(score: number | null): ReportSummary['healthScore']['label'] {
  if (score === null) return 'not_enough_data';
  if (score >= 85) return 'healthy';
  if (score >= 65) return 'needs_review';
  return 'high_risk';
}

function getRiskRating(exposureIndex: number | null): ReportSummary['globalRisk']['riskRating'] {
  if (exposureIndex === null) return 'Not Enough Data';
  if (exposureIndex >= 75) return 'Critical';
  if (exposureIndex >= 50) return 'High';
  if (exposureIndex >= 25) return 'Medium';
  return 'Low';
}

function statusFromScan(scan?: ReportScanRow): ReportSummary['lastScan']['status'] {
  if (!scan) return 'none';
  if (scan.status === 'completed' && (scan.errors?.length || 0) > 0) return 'partial';
  if (scan.status === 'running') return 'running';
  if (scan.status === 'failed' || scan.status === 'cancelled') return 'failed';
  if (scan.status === 'completed') return 'completed';
  return 'running';
}

function scoreMetadataGap(files: ReportFileRow[]): number {
  if (files.length === 0) return 0;

  const weakMetadata = files.filter((file) => {
    const name = file.name || '';
    const genericName = /^(document|untitled|new|copy)/i.test(name);
    const noTags = !file.ai_tags || file.ai_tags.length === 0;
    const noCategory = !file.ai_category;
    return genericName || (noTags && noCategory);
  }).length;

  return ratioScore(weakMetadata, files.length);
}

function buildRiskDrivers(scores: {
  externalScore: number;
  ownershipScore: number;
  highRiskScore: number;
  staleScore: number;
  oneDriveScore: number;
}): RiskDriver[] {
  const drivers: RiskDriver[] = [
    {
      label: 'Unsecured External Shares',
      category: 'external',
      value: scores.externalScore * 0.4,
      filterTarget: '/remediation?issue=external_share',
    },
    {
      label: 'Unmanaged Knowledge Gaps',
      category: 'ownership',
      value: scores.ownershipScore * 0.25,
      filterTarget: '/remediation?issue=missing_owner',
    },
    {
      label: 'Critical Knowledge Exposure',
      category: 'high_risk',
      value: scores.highRiskScore * 0.2,
      filterTarget: '/remediation?issue=high_risk',
    },
    {
      label: 'Accumulated Stale Burden',
      category: 'stale',
      value: scores.staleScore * 0.1,
      filterTarget: '/remediation?issue=stale',
    },
    {
      label: 'High OneDrive Concentration',
      category: 'storage',
      value: scores.oneDriveScore * 0.05,
      filterTarget: '/remediation?issue=onedrive_silo',
    },
  ];

  return drivers.sort((a, b) => b.value - a.value);
}

function primaryRiskFactor(drivers: RiskDriver[]): string {
  return drivers.find((driver) => driver.value > 0)?.label || 'No material risk driver detected';
}

function buildOwnerGroups(files: ReportFileRow[]) {
  const groups = new Map<string, { ownerEmail: string | null; ownerName: string | null; files: ReportFileRow[] }>();

  files.forEach((file) => {
    const ownerEmail = file.owner_email?.trim().toLowerCase() || null;
    const ownerName = file.owner_name?.trim() || null;
    const key = ownerEmail || ownerName || '__unknown__';

    if (!groups.has(key)) {
      groups.set(key, {
        ownerEmail,
        ownerName: key === '__unknown__' ? 'Unknown Owner' : ownerName,
        files: [],
      });
    }

    groups.get(key)?.files.push(file);
  });

  return Array.from(groups.values());
}

function buildOwnerStatusMap(ownerStatuses: ReportOwnerStatusRow[]) {
  const statusMap = new Map<string, ReportOwnerStatusRow>();

  ownerStatuses.forEach((status) => {
    const email = status.owner_email?.trim().toLowerCase();
    if (!email) return;
    statusMap.set(email, status);
  });

  return statusMap;
}

function isStaleOwnerStatus(status: ReportOwnerStatusRow, generatedAt: string): boolean {
  if (!status.last_checked_at) return true;

  const checkedAt = new Date(status.last_checked_at).getTime();
  const generated = new Date(generatedAt).getTime();
  if (Number.isNaN(checkedAt) || Number.isNaN(generated)) return true;

  return generated - checkedAt > 7 * 24 * 60 * 60 * 1000;
}

function shouldReviewOwnerStatus(status?: ReportOwnerStatusRow): boolean {
  return status?.status === 'disabled' || status?.status === 'not_found';
}

function buildWorkspaceOpportunities(
  files: ReportFileRow[],
  ownerStatuses: ReportOwnerStatusRow[] = [],
  metadataDecisions: ReportMetadataDecisionRow[] = []
): ReportSummary['workspaceOpportunities'] {
  const externalFiles = files.filter((file) => file.has_external_share);
  const staleFiles = files.filter(isStale);
  const unknownOwnerFiles = files.filter((file) => !hasOwner(file));
  const ownerStatusMap = buildOwnerStatusMap(ownerStatuses);
  const ownerStatusReviewGroup = buildOwnerGroups(files)
    .filter((group) => group.ownerEmail)
    .map((group) => {
      const ownerStatus = group.ownerEmail ? ownerStatusMap.get(group.ownerEmail) : undefined;
      return {
        ownerLabel: group.ownerName || group.ownerEmail || 'Owner',
        ownerEmail: group.ownerEmail,
        status: ownerStatus?.status || 'unknown',
        fileCount: group.files.length,
        riskSignalCount:
          group.files.filter((file) => file.has_external_share).length +
          group.files.filter(isHighRisk).length +
          group.files.filter(isStale).length,
      };
    })
    .filter((group) => ['disabled', 'not_found'].includes(group.status))
    .sort((a, b) => b.riskSignalCount - a.riskSignalCount || b.fileCount - a.fileCount)[0];
  const topOwnerRiskGroup = buildOwnerGroups(files)
    .filter((group) => group.ownerEmail || (group.ownerName && group.ownerName !== 'Unknown Owner'))
    .map((group) => {
      const externalCount = group.files.filter((file) => file.has_external_share).length;
      const highRiskCount = group.files.filter(isHighRisk).length;
      const staleCount = group.files.filter(isStale).length;
      const oneDriveCount = group.files.filter(isOneDrive).length;
      const riskSignalCount = externalCount + highRiskCount + staleCount + oneDriveCount;

      return {
        ownerLabel: group.ownerName || group.ownerEmail || 'Owner',
        fileCount: group.files.length,
        riskSignalCount,
      };
    })
    .filter((group) => group.riskSignalCount > 0)
    .sort((a, b) => b.riskSignalCount - a.riskSignalCount || b.fileCount - a.fileCount)[0];

  const riskOpportunities = [
    externalFiles.length > 0
      ? {
          label: 'External Sharing Review',
          reason: 'Group externally shared files for owner review and safe remediation.',
          fileCount: externalFiles.length,
          suggestedTags: ['external-share', 'review'],
        }
      : null,
    staleFiles.length > 0
      ? {
          label: 'Stale Content Cleanup',
          reason: 'Create an archive review workspace before taking cleanup actions.',
          fileCount: staleFiles.length,
          suggestedTags: ['stale', 'archive-review'],
        }
      : null,
    unknownOwnerFiles.length > 0
      ? {
          label: 'Ownership Handoff',
          reason: 'Collect unowned files so a steward can be assigned.',
          fileCount: unknownOwnerFiles.length,
          suggestedTags: ['missing-owner', 'handoff'],
        }
      : null,
    topOwnerRiskGroup
      ? {
          label: `${topOwnerRiskGroup.ownerLabel} Handoff Review`,
          reason: 'Create an owner-focused workspace before cleanup, offboarding, or stewardship changes.',
          fileCount: topOwnerRiskGroup.fileCount,
          suggestedTags: ['owner-risk', 'handoff', topOwnerRiskGroup.ownerLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')],
        }
      : null,
    ownerStatusReviewGroup
      ? {
          label: `${ownerStatusReviewGroup.ownerLabel} Status Handoff`,
          reason: 'Create a handoff workspace for files owned by a disabled or not-found Entra account.',
          fileCount: ownerStatusReviewGroup.fileCount,
          suggestedTags: [
            'owner-status',
            'handoff',
            ownerStatusReviewGroup.status,
            slugify(ownerStatusReviewGroup.ownerLabel),
          ],
        }
      : null,
  ].filter(Boolean) as ReportSummary['workspaceOpportunities'];

  return [
    ...riskOpportunities,
    ...buildAcceptedMetadataWorkspaceOpportunities(metadataDecisions),
    ...buildMetadataWorkspaceClusters(files),
  ];
}

function buildAcceptedMetadataWorkspaceOpportunities(
  metadataDecisions: ReportMetadataDecisionRow[]
): ReportSummary['workspaceOpportunities'] {
  return metadataDecisions
    .filter((decision) => decision.decision_status === 'accepted' || decision.decision_status === 'edited')
    .filter((decision) => decision.suggestion_type === 'tag' || decision.suggestion_type === 'category')
    .sort((a, b) => new Date(b.decided_at || 0).getTime() - new Date(a.decided_at || 0).getTime())
    .slice(0, 2)
    .map((decision) => {
      const label = typeof decision.suggested_value?.label === 'string'
        ? decision.suggested_value.label
        : decision.suggestion_type === 'tag'
        ? 'Approved Tag Review'
        : 'Approved Category Review';

      return {
        label: `${label} Workspace`,
        reason: 'Approved Aethos-side metadata can now seed workspace review without Microsoft 365 writeback.',
        fileCount: decision.affected_count || 0,
        suggestedTags: [
          'approved-metadata',
          decision.suggestion_type,
          decision.decision_status,
          slugify(decision.suggestion_id),
        ],
      };
    });
}

function buildMetadataWorkspaceClusters(files: ReportFileRow[]): ReportSummary['workspaceOpportunities'] {
  const clusters = new Map<string, { kind: 'path' | 'category' | 'tag'; label: string; reason: string; files: ReportFileRow[]; suggestedTags: string[] }>();

  const addCluster = (
    kind: 'path' | 'category' | 'tag',
    rawLabel: string | null | undefined,
    file: ReportFileRow,
    reason: string
  ) => {
    const cleanLabel = rawLabel?.trim();
    if (!cleanLabel) return;

    const slug = slugify(cleanLabel);
    if (!slug) return;

    const key = `${kind}:${slug}`;
    const existing = clusters.get(key) || {
      kind,
      label: `${titleCase(cleanLabel)} Workspace`,
      reason,
      files: [],
      suggestedTags: [kind, slug],
    };

    existing.files.push(file);
    clusters.set(key, existing);
  };

  files.forEach((file) => {
    addCluster('path', getPathCluster(file), file, 'Files share a source-system path pattern that may be useful as working context.');
    addCluster('category', file.ai_category, file, 'Files share an Aethos-side category that may be ready for workspace review.');
    (file.ai_tags || []).forEach((tag) => {
      addCluster('tag', tag, file, 'Files share an Aethos-side tag that may be ready for workspace review.');
    });
  });

  const eligibleClusters = Array.from(clusters.values())
    .filter((cluster) => cluster.files.length >= MIN_WORKSPACE_CLUSTER_SIZE)
    .sort((a, b) => b.files.length - a.files.length || a.label.localeCompare(b.label));

  return (['path', 'category', 'tag'] as const)
    .map((kind) => eligibleClusters.find((cluster) => cluster.kind === kind))
    .filter(Boolean)
    .map((cluster) => ({
      label: cluster!.label,
      reason: cluster!.reason,
      fileCount: cluster!.files.length,
      suggestedTags: cluster!.suggestedTags,
    }));
}

function buildTopicClusters(files: ReportFileRow[]): TopicCluster[] {
  const clusters = new Map<string, { label: string; source: 'tag' | 'category'; files: ReportFileRow[] }>();

  const addCluster = (source: 'tag' | 'category', value: string | null | undefined, file: ReportFileRow) => {
    const cleanValue = value?.trim();
    if (!cleanValue) return;
    const slug = slugify(cleanValue);
    if (!slug) return;

    const key = `${source}:${slug}`;
    const cluster = clusters.get(key) || {
      label: titleCase(cleanValue),
      source,
      files: [],
    };
    cluster.files.push(file);
    clusters.set(key, cluster);
  };

  files.forEach((file) => {
    addCluster('category', file.ai_category, file);
    (file.ai_tags || []).forEach((tag) => addCluster('tag', tag, file));
  });

  return Array.from(clusters.values())
    .filter((cluster) => cluster.files.length >= MIN_WORKSPACE_CLUSTER_SIZE)
    .sort((a, b) => b.files.length - a.files.length || a.label.localeCompare(b.label))
    .slice(0, 6)
    .map((cluster) => ({
      label: cluster.label,
      source: cluster.source,
      fileCount: cluster.files.length,
      confidence: cluster.files.length >= 10 ? 'high' : cluster.files.length >= 5 ? 'medium' : 'low',
      suggestedTags: ['topic-cluster', cluster.source, slugify(cluster.label)],
    }));
}

function toFileSample(file: ReportFileRow): ReportFileSample {
  return {
    id: file.id,
    name: file.name || 'Untitled file',
    ownerEmail: file.owner_email || null,
    ownerName: file.owner_name || null,
    providerType: file.provider_type || null,
    sizeBytes: file.size_bytes || 0,
    modifiedAt: file.modified_at || null,
    riskScore: file.risk_score || 0,
    externalUserCount: file.external_user_count || 0,
  };
}

function buildBuckets(files: ReportFileRow[], getLabel: (file: ReportFileRow) => string): ReportBucket[] {
  const buckets = new Map<string, ReportBucket>();

  files.forEach((file) => {
    const label = getLabel(file) || 'Unknown';
    const current = buckets.get(label) || { label, fileCount: 0, totalBytes: 0 };
    current.fileCount += 1;
    current.totalBytes += file.size_bytes || 0;
    buckets.set(label, current);
  });

  return Array.from(buckets.values())
    .sort((a, b) => b.fileCount - a.fileCount || b.totalBytes - a.totalBytes)
    .slice(0, 5);
}

export function buildReportSummary({
  tenantId,
  files,
  sites,
  scans,
  remediationActions = [],
  remediationDryRunTotal,
  ownerStatuses = [],
  metadataDecisions = [],
  generatedAt = new Date().toISOString(),
}: BuildReportSummaryInput): ReportSummary {
  const latestScan = scans[0];
  const previousScan = scans[1];

  const totalFiles = files.length;
  const totalSites = sites.length;
  const totalStorageBytes = files.reduce((sum, file) => sum + (file.size_bytes || 0), 0);
  const staleFiles = files.filter(isStale);
  const externallySharedFiles = files.filter((file) => file.has_external_share);
  const highRiskFiles = files.filter(isHighRisk);
  const sensitiveFiles = files.filter(isSensitiveFile);
  const highPiiRiskFiles = files.filter(isHighPiiRisk);
  const missingOwnerFiles = files.filter((file) => !hasOwner(file));
  const oneDriveFiles = files.filter(isOneDrive);
  const filesWithOwner = totalFiles - missingOwnerFiles.length;
  const ownerCoveragePercent = totalFiles > 0 ? clampScore((filesWithOwner / totalFiles) * 100) : 0;
  const ownerCoverageStatus = totalFiles === 0 || filesWithOwner === 0
    ? 'none'
    : filesWithOwner === totalFiles
    ? 'complete'
    : 'partial';

  const dataMaturity = getDataMaturity(totalFiles, totalSites);
  const externalScore = ratioScore(externallySharedFiles.length, totalFiles, 35);
  const ownershipScore = ratioScore(missingOwnerFiles.length, totalFiles, 25);
  const highRiskScore = ratioScore(highRiskFiles.length, totalFiles, 30);
  const staleScore = ratioScore(staleFiles.length, totalFiles);
  const oneDriveScore = ratioScore(oneDriveFiles.length, totalFiles);
  const metadataGapScore = scoreMetadataGap(files);
  const scanErrorScore = latestScan?.errors?.length ? clampScore((latestScan.errors.length || 0) * 20) : 0;

  const drivers = buildRiskDrivers({
    externalScore,
    ownershipScore,
    highRiskScore,
    staleScore,
    oneDriveScore,
  });

  const tenantExposureRaw =
    externalScore * 0.35 +
    ownershipScore * 0.25 +
    highRiskScore * 0.2 +
    staleScore * 0.1 +
    metadataGapScore * 0.05 +
    scanErrorScore * 0.05;
  const tenantExposureIndex = dataMaturity === 'medium' || dataMaturity === 'large' ? clampScore(tenantExposureRaw) : null;
  const healthScore = tenantExposureIndex === null ? null : clampScore(100 - tenantExposureIndex);

  const ownerGroups = buildOwnerGroups(files);
  const ownerStatusMap = buildOwnerStatusMap(ownerStatuses);
  const topRiskOwners = ownerGroups
    .map((group) => {
      const ownerFiles = group.files;
      const ownerFileCount = ownerFiles.length;
      const externalShareCount = ownerFiles.filter((file) => file.has_external_share).length;
      const missingOwnerCount = ownerFiles.filter((file) => !hasOwner(file)).length;
      const highRiskCount = ownerFiles.filter(isHighRisk).length;
      const staleCount = ownerFiles.filter(isStale).length;
      const oneDriveFileCount = ownerFiles.filter(isOneDrive).length;
      const ownerScores = {
        externalScore: ratioScore(externalShareCount, ownerFileCount, 35),
        ownershipScore: ratioScore(missingOwnerCount, ownerFileCount, 25),
        highRiskScore: ratioScore(highRiskCount, ownerFileCount, 30),
        staleScore: ratioScore(staleCount, ownerFileCount),
        oneDriveScore: ratioScore(oneDriveFileCount, ownerFileCount),
      };
      const ownerDrivers = buildRiskDrivers(ownerScores);
      const ownerLiabilityScore = clampScore(
        ownerScores.externalScore * 0.4 +
          ownerScores.ownershipScore * 0.25 +
          ownerScores.highRiskScore * 0.2 +
          ownerScores.staleScore * 0.1 +
          ownerScores.oneDriveScore * 0.05
      );

      return {
        ownerEmail: group.ownerEmail,
        ownerName: group.ownerName,
        ownerStatus: group.ownerEmail ? ownerStatusMap.get(group.ownerEmail)?.status || null : null,
        ownerLookupStatus: group.ownerEmail ? ownerStatusMap.get(group.ownerEmail)?.lookup_status || null : null,
        ownerStatusCheckedAt: group.ownerEmail ? ownerStatusMap.get(group.ownerEmail)?.last_checked_at || null : null,
        fileCount: ownerFileCount,
        highRiskCount,
        externalShareCount,
        staleCount,
        missingOwnerCount,
        oneDriveFileCount,
        ownerLiabilityScore,
        primaryRiskFactor: primaryRiskFactor(ownerDrivers),
      };
    })
    .sort((a, b) => b.ownerLiabilityScore - a.ownerLiabilityScore)
    .slice(0, 10);

  const uniqueOwners = new Set(files.map((file) => file.owner_email?.trim().toLowerCase()).filter(Boolean)).size;
  const ownerStatusRows = Array.from(ownerStatusMap.values());
  const ownerStatusCoverage = {
    ownersWithStatus: ownerStatusRows.filter((status) => status.lookup_status === 'completed').length,
    permissionRequired: ownerStatusRows.filter((status) => status.lookup_status === 'permission_required').length,
    disabledOwners: ownerStatusRows.filter((status) => status.status === 'disabled').length,
    guestOwners: ownerStatusRows.filter((status) => status.status === 'guest').length,
    notFoundOwners: ownerStatusRows.filter((status) => status.status === 'not_found').length,
    staleStatusCount: ownerStatusRows.filter((status) => isStaleOwnerStatus(status, generatedAt)).length,
    lastCheckedAt: ownerStatusRows
      .map((status) => status.last_checked_at)
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] || null,
  };
  const ownerStatusReviewOwners = ownerGroups
    .filter((group) => Boolean(group.ownerEmail))
    .map((group) => {
      const status = group.ownerEmail ? ownerStatusMap.get(group.ownerEmail) : undefined;
      const ownerFiles = group.files;
      const ownerFileCount = ownerFiles.length;
      const externalShareCount = ownerFiles.filter((file) => file.has_external_share).length;
      const missingOwnerCount = ownerFiles.filter((file) => !hasOwner(file)).length;
      const highRiskCount = ownerFiles.filter(isHighRisk).length;
      const staleCount = ownerFiles.filter(isStale).length;
      const oneDriveFileCount = ownerFiles.filter(isOneDrive).length;
      const ownerScores = {
        externalScore: ratioScore(externalShareCount, ownerFileCount, 35),
        ownershipScore: ratioScore(missingOwnerCount, ownerFileCount, 25),
        highRiskScore: ratioScore(highRiskCount, ownerFileCount, 30),
        staleScore: ratioScore(staleCount, ownerFileCount),
        oneDriveScore: ratioScore(oneDriveFileCount, ownerFileCount),
      };

      return {
        ownerEmail: group.ownerEmail!,
        ownerName: group.ownerName,
        status: status?.status || 'unknown',
        lookupStatus: status?.lookup_status || 'pending',
        fileCount: ownerFileCount,
        highRiskCount,
        externalShareCount,
        staleCount,
        ownerLiabilityScore: clampScore(
          ownerScores.externalScore * 0.4 +
            ownerScores.ownershipScore * 0.25 +
            ownerScores.highRiskScore * 0.2 +
            ownerScores.staleScore * 0.1 +
            ownerScores.oneDriveScore * 0.05
        ),
        lastCheckedAt: status?.last_checked_at || null,
      };
    });
  const ownerStatusReview = {
    reviewRequiredOwners: ownerStatusReviewOwners.filter((owner) => ['disabled', 'not_found'].includes(owner.status)).length,
    permissionRequiredOwners: ownerStatusReviewOwners.filter((owner) => owner.lookupStatus === 'permission_required').length,
    guestOwners: ownerStatusReviewOwners.filter((owner) => owner.status === 'guest').length,
    staleStatusOwners: ownerStatusReviewOwners.filter((owner) => {
      const status = ownerStatusMap.get(owner.ownerEmail);
      return status ? isStaleOwnerStatus(status, generatedAt) : false;
    }).length,
    topOwners: ownerStatusReviewOwners
      .filter((owner) => shouldReviewOwnerStatus(ownerStatusMap.get(owner.ownerEmail)))
      .sort((a, b) => b.ownerLiabilityScore - a.ownerLiabilityScore || b.fileCount - a.fileCount)
      .slice(0, 5),
  };
  const topExposureFiles = externallySharedFiles
    .slice()
    .sort((a, b) => (b.external_user_count || 0) - (a.external_user_count || 0) || (b.risk_score || 0) - (a.risk_score || 0))
    .slice(0, 5)
    .map(toFileSample);
  const topStaleFiles = staleFiles
    .slice()
    .sort((a, b) => (b.size_bytes || 0) - (a.size_bytes || 0) || (b.risk_score || 0) - (a.risk_score || 0))
    .slice(0, 5)
    .map(toFileSample);
  const dryRunActions = remediationActions
    .filter((action) => action.metadata?.dry_run === true)
    .sort((a, b) => {
      const aTime = new Date(a.executed_at || a.completed_at || 0).getTime();
      const bTime = new Date(b.executed_at || b.completed_at || 0).getTime();
      return bTime - aTime;
    });

  return {
    tenantId,
    generatedAt,
    healthScore: {
      score: healthScore,
      label: getHealthLabel(healthScore),
      dataMaturity,
      drivers: tenantExposureIndex === null ? [] : drivers.slice(0, 3).map((driver) => driver.label),
    },
    globalRisk: {
      tenantExposureIndex,
      riskRating: getRiskRating(tenantExposureIndex),
      primaryRiskFactor: tenantExposureIndex === null ? null : primaryRiskFactor(drivers),
    },
    trend: {
      previousScanId: previousScan?.id || null,
      healthScoreDelta: null,
      externalShareDelta: null,
      staleFileDelta: null,
      missingOwnerDelta: null,
    },
    lastScan: {
      id: latestScan?.id || null,
      status: statusFromScan(latestScan),
      completedAt: latestScan?.completed_at || null,
      filesDiscovered: latestScan?.files_discovered || 0,
      sitesDiscovered: latestScan?.sites_discovered || 0,
      newFiles: latestScan?.new_files || 0,
      errorCount: latestScan?.errors?.length || 0,
    },
    discovery: {
      totalFiles,
      totalSites,
      sharePointFiles: files.filter(isSharePoint).length,
      oneDriveFiles: oneDriveFiles.length,
      teamsFiles: files.filter(isTeams).length,
      totalStorageBytes,
    },
    risk: {
      staleFiles: staleFiles.length,
      staleBytes: staleFiles.reduce((sum, file) => sum + (file.size_bytes || 0), 0),
      externallySharedFiles: externallySharedFiles.length,
      highRiskFiles: highRiskFiles.length,
      missingOwnerFiles: missingOwnerFiles.length,
      sensitiveFiles: sensitiveFiles.length,
      highPiiRiskFiles: highPiiRiskFiles.length,
    },
    exposureReview: {
      externalUsersTotal: externallySharedFiles.reduce((sum, file) => sum + (file.external_user_count || 0), 0),
      externalSharesOnStaleFiles: externallySharedFiles.filter(isStale).length,
      providerBreakdown: buildBuckets(externallySharedFiles, (file) => file.provider_type || 'Microsoft 365'),
      ownerBreakdown: buildBuckets(externallySharedFiles, (file) => file.owner_name || file.owner_email || 'Unknown Owner'),
      topFiles: topExposureFiles,
    },
    staleContentReview: {
      providerBreakdown: buildBuckets(staleFiles, (file) => file.provider_type || 'Microsoft 365'),
      ownerBreakdown: buildBuckets(staleFiles, (file) => file.owner_name || file.owner_email || 'Unknown Owner'),
      topFiles: topStaleFiles,
    },
    remediationDryRun: {
      totalDryRuns: remediationDryRunTotal ?? dryRunActions.length,
      recentDryRuns: dryRunActions.slice(0, 5).map((action) => ({
        id: action.id,
        actionType: action.action_type,
        fileCount: action.file_count || 0,
        status: action.status || 'unknown',
        executedAt: action.executed_at || action.completed_at || null,
        successCount: action.success_count || 0,
        failedCount: action.failed_count || 0,
      })),
    },
    ownership: {
      uniqueOwners,
      unknownOwnerFiles: missingOwnerFiles.length,
      ownerMetadataCoverage: {
        filesWithOwner,
        coveragePercent: ownerCoveragePercent,
        status: ownerCoverageStatus,
      },
      topRiskOwners,
      ownerStatusCoverage,
      ownerStatusReview,
    },
    workspaceOpportunities: buildWorkspaceOpportunities(files, ownerStatuses, metadataDecisions),
    topicClusters: buildTopicClusters(files),
    riskDrivers: drivers,
  };
}
