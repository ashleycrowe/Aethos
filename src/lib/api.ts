import { DEMO_MODE_MESSAGE, isDemoModeEnabled } from '@/app/config/demoMode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface ApiErrorEnvelope {
  success: false;
  error: string | {
    code?: string;
    message?: string;
    details?: unknown;
  };
}

export class ApiRequestError extends Error {
  code?: string;
  details?: unknown;
  status?: number;

  constructor(message: string, options: { code?: string; details?: unknown; status?: number } = {}) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = options.code;
    this.details = options.details;
    this.status = options.status;
  }
}

function getApiErrorMessage(errorBody: ApiErrorEnvelope | null, fallback: string) {
  if (!errorBody?.error) return fallback;
  if (typeof errorBody.error === 'string') return errorBody.error;
  const message = errorBody.error.message || fallback;
  const details = errorBody.error.details;
  const action = details && typeof details === 'object' && 'action' in details
    ? (details as { action?: unknown }).action
    : undefined;
  return typeof action === 'string' && action ? `${message} ${action}` : message;
}

export function isGraphConsentRevokedError(error: unknown) {
  return error instanceof ApiRequestError && error.code === 'GRAPH_CONSENT_REVOKED';
}

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
  scope?: {
    included: string[];
    deferred: string[];
    contentScanning: boolean;
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
      sensitiveFiles: number;
      highPiiRiskFiles: number;
    };
    exposureReview: {
      externalUsersTotal: number;
      externalSharesOnStaleFiles: number;
      providerBreakdown: Array<{
        label: string;
        fileCount: number;
        totalBytes: number;
      }>;
      ownerBreakdown: Array<{
        label: string;
        fileCount: number;
        totalBytes: number;
      }>;
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
      providerBreakdown: Array<{
        label: string;
        fileCount: number;
        totalBytes: number;
      }>;
      ownerBreakdown: Array<{
        label: string;
        fileCount: number;
        totalBytes: number;
      }>;
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
        topOwners: Array<{
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
        }>;
      };
    };
    workspaceOpportunities: Array<{
      label: string;
      reason: string;
      fileCount: number;
      suggestedTags: string[];
      reasonCodes: string[];
      handoffPacket: {
        source: 'discovery' | 'operational_intelligence' | 'owner_risk' | 'stale_content' | 'exposure' | 'metadata_quality';
        summary: string;
        reasonCodes: string[];
        suggestedAction: string;
        ownerReviewRequired: boolean;
      };
    }>;
    topicClusters: Array<{
      label: string;
      source: 'tag' | 'category';
      fileCount: number;
      confidence: 'high' | 'medium' | 'low';
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

export interface RecordMetadataSuggestionDecisionRequest {
  accessToken?: string | null;
  suggestionId: string;
  suggestionType: 'title' | 'tag' | 'category' | 'owner';
  decisionStatus: 'accepted' | 'edited' | 'rejected' | 'blocked';
  affectedCount?: number;
  confidence?: 'high' | 'medium' | 'low';
  sourceSignals?: string[];
  rationale?: string;
  suggestedValue?: Record<string, unknown>;
  editedValue?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface RecordMetadataSuggestionDecisionResponse {
  success: boolean;
  decision: {
    id: string;
    suggestionId: string;
    decisionStatus: string;
    decidedAt: string;
  };
}

export interface SyncOwnerStatusRequest {
  accessToken?: string | null;
  limit?: number;
}

export interface SyncOwnerStatusResponse {
  success: boolean;
  checked: number;
  permissionRequired: number;
  notFound: number;
  results: Array<{
    id?: string;
    ownerEmail: string;
    status: 'active' | 'disabled' | 'deleted' | 'guest' | 'unknown' | 'not_found' | 'permission_required' | 'error';
    lookupStatus: 'completed' | 'not_found' | 'permission_required' | 'error';
    fileCount?: number;
    lastCheckedAt?: string;
    error?: string;
  }>;
}

export interface DiagnosticEvent {
  id: string;
  createdAt: string;
  sessionId?: string | null;
  severity: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  source: string;
  eventName: string;
  message: string;
  route: string;
  userAgent?: string | null;
  actionTaken?: string;
  expectedResult?: string;
  actualResult?: string;
  metadata?: unknown;
}

export interface ListDiagnosticsRequest {
  accessToken?: string | null;
  limit?: number;
}

export interface ListDiagnosticsResponse {
  success: boolean;
  events: DiagnosticEvent[];
}

export interface AiPlusReadinessResponse {
  success: boolean;
  ready: boolean;
  migrationApplied: boolean;
  openAiConfigured: boolean;
  tenantAiEnabled: boolean;
  subscriptionTier: string | null;
  indexedFiles: number;
  indexedChunks: number;
  piiScans: number;
  pendingAiSuggestions: number;
  graphConsent?: {
    revoked: boolean;
    missingScopes: string[];
    revokedAt: string | null;
    lastError?: unknown;
    documentation?: Record<string, string>;
  };
  creditUsage?: {
    periodMonth: string;
    monthlyCreditLimit: number;
    creditsUsed: number;
    creditsReserved: number;
    creditsRemaining: number;
    status: string;
    creditsEnforced: boolean;
    allowOverage: boolean;
    trialCreditGrant: number;
    indexingFileLimit: number;
    recentLedger: Array<{
      action_type: string;
      credit_cost: number;
      cached: boolean;
      status: string;
      created_at: string;
    }>;
  } | null;
  blockers: string[];
  details?: string;
}

export interface SupportTicket {
  id: string;
  tenant_id?: string | null;
  user_id?: string | null;
  title: string;
  description: string;
  category: 'question' | 'issue' | 'feature' | 'billing' | 'landing_page';
  status: string;
  priority?: string;
  product_area_tag?: string | null;
  sentiment?: string | null;
  resolution_summary?: string | null;
  ui_context_dump?: unknown;
  source?: string;
  created_at: string;
  updated_at?: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content?: string;
  category: string;
  product_area_tag?: string | null;
  updated_at?: string;
}

export interface OperationsHubResponse {
  success: boolean;
  role: 'sales_success' | 'support' | 'product_admin';
  tickets: SupportTicket[];
  articles: KnowledgeArticle[];
  featureRequests: Array<{ name: string; count: number }>;
  frustrations: Array<{ name: string; count: number }>;
  anomalyAlerts: Array<{
    productAreaTag: string;
    count24h: number;
    severity: 'medium' | 'high';
    message: string;
  }>;
  creditSettings: Array<{
    tenant_id: string;
    monthly_credit_limit: number;
    trial_credit_grant: number;
    indexing_file_limit: number;
    credits_enforced: boolean;
    allow_overage: boolean;
  }>;
}

export interface SupportSearchResponse {
  success: boolean;
  role: OperationsHubResponse['role'];
  query: string;
  tickets: SupportTicket[];
  articles: KnowledgeArticle[];
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
    const errorBody = await response.json().catch(() => null) as ApiErrorEnvelope | null;
    const code = errorBody?.error && typeof errorBody.error === 'object' ? errorBody.error.code : undefined;
    const details = errorBody?.error && typeof errorBody.error === 'object' ? errorBody.error.details : undefined;
    throw new ApiRequestError(getApiErrorMessage(errorBody, `${response.status} ${response.statusText}`), {
      code,
      details,
      status: response.status,
    });
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
  stewardOwnerEmail?: string | null;
  stewardOwnerName?: string | null;
  reviewStatus?: 'admin_review' | 'steward_review' | 'team_ready' | 'archived';
  handoffReasonCodes?: string[];
  handoffPacket?: {
    source: 'discovery' | 'operational_intelligence' | 'owner_risk' | 'stale_content' | 'exposure' | 'metadata_quality';
    summary: string;
    reasonCodes: string[];
    suggestedAction: string;
    ownerReviewRequired: boolean;
  } | null;
  sourceOfTruthItemIds?: string[];
  suggestionDecisions?: Record<string, unknown>;
  stewardNotes?: string | null;
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
    stewardOwnerEmail?: string | null;
    stewardOwnerName?: string | null;
    isAccessible?: boolean;
    steward?: string | null;
    path?: string | null;
    accessRestrictionReason?: 'STEWARD_ACCESS_GAP' | 'EXTERNAL_SHARE' | 'OWNERSHIP_UNKNOWN' | null;
    reviewStatus?: 'admin_review' | 'steward_review' | 'team_ready' | 'archived';
    handoffReasonCodes?: string[];
    handoffPacket?: CreateWorkspaceRequest['handoffPacket'];
    sourceOfTruthItemIds?: string[];
    suggestionDecisions?: Record<string, unknown>;
    stewardNotes?: string | null;
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
    stewardOwnerEmail?: string | null;
    stewardOwnerName?: string | null;
    isAccessible?: boolean;
    steward?: string | null;
    path?: string | null;
    accessRestrictionReason?: 'STEWARD_ACCESS_GAP' | 'EXTERNAL_SHARE' | 'OWNERSHIP_UNKNOWN' | null;
    reviewStatus?: 'admin_review' | 'steward_review' | 'team_ready' | 'archived';
    handoffReasonCodes?: string[];
    handoffPacket?: CreateWorkspaceRequest['handoffPacket'];
    sourceOfTruthItemIds?: string[];
    suggestionDecisions?: Record<string, unknown>;
    stewardNotes?: string | null;
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
    steward_owner_email?: string | null;
    steward_owner_name?: string | null;
    is_accessible?: boolean;
    steward?: string | null;
    path?: string | null;
    access_restriction_reason?: 'STEWARD_ACCESS_GAP' | 'EXTERNAL_SHARE' | 'OWNERSHIP_UNKNOWN' | null;
    review_status?: 'admin_review' | 'steward_review' | 'team_ready' | 'archived';
    handoff_reason_codes?: string[];
    source_of_truth_item_ids?: string[];
    suggestion_decisions?: Record<string, unknown>;
    steward_notes?: string | null;
    created_at?: string;
    updated_at?: string;
    last_sync_at?: string;
  };
  syncedCount: number;
}

export interface SemanticSearchRequest {
  tenantId?: string;
  query: string;
  limit?: number;
  threshold?: number;
  accessToken?: string | null;
}

export interface SemanticSearchResponse {
  success: boolean;
  query: string;
  results: Array<{
    id?: string;
    file_id: string;
    chunk_text: string;
    similarity?: number;
    file?: {
      id: string;
      name?: string | null;
      ai_suggested_title?: string | null;
      path?: string | null;
      owner_email?: string | null;
      provider?: string | null;
      ai_tags?: string[] | null;
      modified_at?: string | null;
    } | null;
  }>;
  count: number;
}

export interface SummarizeFileRequest {
  fileId: string;
  summaryType?: 'concise' | 'detailed';
  accessToken?: string | null;
}

export interface SummarizeFileResponse {
  success: boolean;
  summary: string;
  keyPoints: string[];
  cached: boolean;
}

export interface IndexFileContentRequest {
  fileId: string;
  fileUrl?: string | null;
  mimeType?: string | null;
  accessToken?: string | null;
}

export interface IndexFileContentResponse {
  success: boolean;
  fileId: string;
  chunksProcessed: number;
  embeddings: unknown[];
}

export interface DetectPiiRequest {
  fileId: string;
  accessToken?: string | null;
}

export interface DetectPiiResponse {
  success: boolean;
  fileId: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  findings: {
    patterns: Array<{ type: string; value: string; position: number }>;
    aiDetected: string[];
  };
  totalFindings: number;
}

export interface RunMetadataEnrichmentRequest {
  fileIds?: string[];
  batchSize?: number;
  accessToken?: string | null;
}

export interface RunMetadataEnrichmentResponse {
  success: boolean;
  message?: string;
  suggestionsCreated: number;
  enrichedCount: number;
  totalProcessed?: number;
  reviewRequired?: boolean;
  skippedPending?: number;
  errors?: Array<{ fileId: string; error: string }>;
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

export async function indexFileContent({
  accessToken,
  ...body
}: IndexFileContentRequest): Promise<IndexFileContentResponse> {
  return request<IndexFileContentResponse>(
    '/intelligence/embeddings',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    accessToken
  );
}

export async function runMetadataEnrichment({
  accessToken,
  ...body
}: RunMetadataEnrichmentRequest = {}): Promise<RunMetadataEnrichmentResponse> {
  return request<RunMetadataEnrichmentResponse>(
    '/intelligence/enrich',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    accessToken
  );
}

export async function detectPii({
  accessToken,
  ...body
}: DetectPiiRequest): Promise<DetectPiiResponse> {
  return request<DetectPiiResponse>(
    '/intelligence/pii-detection',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    accessToken
  );
}

export async function semanticSearch({
  accessToken,
  ...body
}: SemanticSearchRequest): Promise<SemanticSearchResponse> {
  return request<SemanticSearchResponse>(
    '/intelligence/semantic-search',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    accessToken
  );
}

export async function summarizeFile({
  accessToken,
  ...body
}: SummarizeFileRequest): Promise<SummarizeFileResponse> {
  return request<SummarizeFileResponse>(
    '/intelligence/summarize',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    accessToken
  );
}

export async function getOperationsHub({
  accessToken,
}: { accessToken?: string | null } = {}): Promise<OperationsHubResponse> {
  return request<OperationsHubResponse>(
    '/support/intelligence',
    {
      method: 'POST',
      body: JSON.stringify({}),
    },
    accessToken
  );
}

export async function searchOperationsHub({
  query,
  accessToken,
}: { query: string; accessToken?: string | null }): Promise<SupportSearchResponse> {
  return request<SupportSearchResponse>(
    '/support/search',
    {
      method: 'POST',
      body: JSON.stringify({ query }),
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

export async function getAiPlusReadiness({
  accessToken,
}: {
  accessToken?: string | null;
} = {}): Promise<AiPlusReadinessResponse> {
  return request<AiPlusReadinessResponse>(
    '/intelligence/ai-readiness',
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

export async function recordMetadataSuggestionDecision({
  accessToken,
  ...body
}: RecordMetadataSuggestionDecisionRequest): Promise<RecordMetadataSuggestionDecisionResponse> {
  return request<RecordMetadataSuggestionDecisionResponse>(
    '/intelligence/metadata-suggestion-decision',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    accessToken
  );
}

export async function syncOwnerStatus({
  accessToken,
  ...body
}: SyncOwnerStatusRequest): Promise<SyncOwnerStatusResponse> {
  return request<SyncOwnerStatusResponse>(
    '/intelligence/owner-status-sync',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    accessToken
  );
}

export async function listDiagnostics({
  accessToken,
  ...body
}: ListDiagnosticsRequest = {}): Promise<ListDiagnosticsResponse> {
  return request<ListDiagnosticsResponse>(
    '/diagnostics/client-log',
    {
      method: 'POST',
      body: JSON.stringify({ ...body, action: 'list' }),
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
