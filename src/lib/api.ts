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
  userId: string;
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
