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
