import { DEMO_MODE_MESSAGE, isDemoModeEnabled } from '@/app/config/demoMode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface SearchFilesRequest {
  tenantId: string;
  query?: string;
  filters?: Record<string, unknown>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  accessToken?: string | null;
}

export interface SearchFilesResponse<T = unknown> {
  success: boolean;
  results: T[];
  pagination?: {
    page: number;
    pageSize: number;
    totalResults: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface DiscoveryScanRequest {
  scanType?: 'full' | 'incremental';
  accessToken?: string | null;
}

export interface DiscoveryScanResponse {
  success: boolean;
  scanId: string;
  duration: number;
  results: {
    totalFiles: number;
    totalSites: number;
    newFiles: number;
    errors: number;
  };
}

export interface IntelligenceMetricsResponse {
  intelligenceScore: number;
  sourceQuality: {
    totalFiles: number;
    filesWithDescriptions: number;
    filesWithTags: number;
    filesWithMeaningfulNames: number;
    avgNameLength: number;
  };
  enrichmentStatus: {
    filesCategorized: number;
    departmentsInferred: number;
    keywordsGenerated: number;
    timePeriodsExtracted: number;
    avgConfidenceScore: number;
    filesNowDiscoverable: number;
  };
  categories: Array<{
    category: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  opportunities: Array<{
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    count: number;
    action: string;
    icon: string;
  }>;
}

export interface ReportSummaryResponse {
  success: boolean;
  summary: {
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
    };
    exposureReview: {
      topFiles: Array<{
        id: string;
        name: string;
        ownerEmail: string | null;
        ownerName: string | null;
        providerType: string | null;
        sizeBytes: number;
        modifiedAt: string | null;
        riskScore: number;
        externalUserCount: number;
      }>;
    };
    staleContentReview: {
      topFiles: Array<{
        id: string;
        name: string;
        ownerEmail: string | null;
        ownerName: string | null;
        providerType: string | null;
        sizeBytes: number;
        modifiedAt: string | null;
        riskScore: number;
        externalUserCount: number;
      }>;
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
      topRiskOwners: Array<{
        ownerEmail: string | null;
        ownerName: string | null;
        fileCount: number;
        highRiskCount: number;
        externalShareCount: number;
        staleCount: number;
        missingOwnerCount: number;
        oneDriveFileCount: number;
        ownerLiabilityScore: number;
        primaryRiskFactor: string;
      }>;
    };
    workspaceOpportunities: Array<{
      label: string;
      reason: string;
      fileCount: number;
      suggestedTags: string[];
    }>;
    riskDrivers: Array<{
      label: string;
      category: 'external' | 'ownership' | 'high_risk' | 'stale' | 'storage';
      value: number;
      filterTarget: string;
    }>;
  };
}

export interface ExecuteRemediationRequest {
  action: 'archive' | 'delete' | 'revoke_links';
  fileIds: string[];
  dryRun?: boolean;
  accessToken?: string | null;
}

export interface ExecuteRemediationResponse {
  success: boolean;
  dryRun: boolean;
  actionId: string;
  message: string;
  results: {
    successCount: number;
    failedCount: number;
    errors: Array<{ error: string }>;
  };
}

async function request<T>(path: string, options: RequestInit = {}, accessToken?: string | null): Promise<T> {
  if (isDemoModeEnabled()) {
    throw new Error(DEMO_MODE_MESSAGE);
  }

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.error || `${response.status} ${response.statusText}`);
  }

  return response.json();
}

export interface WorkspaceListRequest {
  tenantId: string;
  accessToken?: string | null;
}

export interface WorkspaceDetailRequest {
  tenantId: string;
  workspaceId: string;
  accessToken?: string | null;
}

export interface CreateWorkspaceRequest {
  tenantId: string;
  userId?: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  tags?: string[];
  autoSyncEnabled?: boolean;
  syncRules?: Record<string, unknown>;
  accessToken?: string | null;
}

export interface WorkspaceListResponse {
  success: boolean;
  workspaces: Array<{
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color: string;
    tags: string[];
    autoSyncEnabled: boolean;
    syncRules?: any;
    itemCount: number;
    createdAt: string;
    updatedAt: string;
    lastSyncAt?: string;
  }>;
}

export interface WorkspaceDetailResponse {
  success: boolean;
  workspace: {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color: string;
    tags: string[];
    autoSyncEnabled: boolean;
    syncRules?: any;
    items: Array<{
      id: string;
      fileId: string;
      addedBy: string;
      addedMethod: string;
      pinned: boolean;
      addedAt: string;
      file: any; // File details
    }>;
    stats: {
      totalItems: number;
      pinnedItems: number;
      totalSizeBytes: number;
      avgIntelligenceScore: number;
    };
    createdAt: string;
    updatedAt: string;
    lastSyncAt?: string;
  };
}

export interface CreateWorkspaceResponse {
  success: boolean;
  workspace: {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color: string;
    tags?: string[];
    auto_sync_enabled?: boolean;
    sync_rules?: Record<string, unknown>;
    created_at?: string;
    updated_at?: string;
    last_sync_at?: string;
  };
  syncedCount: number;
}

export async function searchFiles<T = unknown>({
  accessToken,
  ...body
}: SearchFilesRequest): Promise<SearchFilesResponse<T>> {
  return request<SearchFilesResponse<T>>(
    '/search/query',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    accessToken
  );
}

export async function runDiscoveryScan({
  accessToken,
  scanType = 'full',
}: DiscoveryScanRequest): Promise<DiscoveryScanResponse> {
  return request<DiscoveryScanResponse>(
    '/discovery/scan',
    {
      method: 'POST',
      body: JSON.stringify({ scanType }),
    },
    accessToken
  );
}

export async function getIntelligenceMetrics({
  accessToken,
}: {
  accessToken?: string | null;
} = {}): Promise<IntelligenceMetricsResponse> {
  return request<IntelligenceMetricsResponse>(
    '/intelligence/metrics',
    {
      method: 'POST',
      body: JSON.stringify({}),
    },
    accessToken
  );
}

export async function getReportSummary({
  accessToken,
}: {
  accessToken?: string | null;
} = {}): Promise<ReportSummaryResponse> {
  return request<ReportSummaryResponse>(
    '/intelligence/report-summary',
    {
      method: 'POST',
      body: JSON.stringify({}),
    },
    accessToken
  );
}

export async function executeRemediation({
  accessToken,
  ...body
}: ExecuteRemediationRequest): Promise<ExecuteRemediationResponse> {
  return request<ExecuteRemediationResponse>(
    '/remediation/execute',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    accessToken
  );
}

export async function listWorkspaces({
  accessToken,
  ...body
}: WorkspaceListRequest): Promise<WorkspaceListResponse> {
  return request<WorkspaceListResponse>(
    '/workspaces/list',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    accessToken
  );
}

export async function createWorkspace({
  accessToken,
  ...body
}: CreateWorkspaceRequest): Promise<CreateWorkspaceResponse> {
  return request<CreateWorkspaceResponse>(
    '/workspaces/create',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    accessToken
  );
}

export async function getWorkspaceDetail({
  accessToken,
  ...body
}: WorkspaceDetailRequest): Promise<WorkspaceDetailResponse> {
  return request<WorkspaceDetailResponse>(
    `/workspaces/${body.workspaceId}`,
    {
      method: 'POST',
      body: JSON.stringify({
        tenantId: body.tenantId
      }),
    },
    accessToken
  );
}
