import { supabase } from './apiAuth.js';

export type GraphConsentErrorDetails = {
  missingScope: string;
  status: number;
  graphCode?: string;
  graphMessage?: string;
  action: string;
  documentationUrl: string;
};

export class GraphConsentError extends Error {
  details: GraphConsentErrorDetails;

  constructor(details: GraphConsentErrorDetails) {
    super('Your organization security policies have updated. An Aethos admin needs to re-authorize document access.');
    this.name = 'GraphConsentError';
    this.details = details;
  }
}

const SCOPE_DOCUMENTATION: Record<string, string> = {
  'Files.Read.All': 'https://learn.microsoft.com/en-us/graph/permissions-reference#filesreadall',
  'Sites.Read.All': 'https://learn.microsoft.com/en-us/graph/permissions-reference#sitesreadall',
  'Group.Read.All': 'https://learn.microsoft.com/en-us/graph/permissions-reference#groupreadall',
  'User.Read': 'https://learn.microsoft.com/en-us/graph/permissions-reference#userread',
};

function inferRequiredScope(url: string) {
  if (/\/drives\/.+\/items\/.+\/content/i.test(url)) return 'Files.Read.All';
  if (/\/sites/i.test(url)) return 'Sites.Read.All';
  if (/\/groups|\/teams/i.test(url)) return 'Group.Read.All';
  return 'Files.Read.All';
}

function looksLikeConsentFailure(status: number, graphBody: any) {
  if (status !== 403) return false;

  const code = String(graphBody?.error?.code || '').toLowerCase();
  const message = String(graphBody?.error?.message || '').toLowerCase();
  const innerCode = String(graphBody?.error?.innerError?.code || '').toLowerCase();
  const combined = `${code} ${message} ${innerCode}`;

  return (
    combined.includes('authorization') ||
    combined.includes('consent') ||
    combined.includes('scope') ||
    combined.includes('permission') ||
    combined.includes('access denied') ||
    combined.includes('forbidden')
  );
}

export async function markTenantGraphConsentRevoked(
  tenantId: string,
  details: GraphConsentErrorDetails
) {
  const { error } = await supabase
    .from('tenants')
    .update({
      api_consent_revoked: true,
      api_consent_revoked_at: new Date().toISOString(),
      missing_graph_scopes: [details.missingScope],
      last_graph_error: {
        code: details.graphCode || null,
        message: details.graphMessage || null,
        status: details.status,
        detected_at: new Date().toISOString(),
      },
    })
    .eq('id', tenantId);

  if (error) {
    console.error('Unable to mark tenant Graph consent as revoked:', error);
  }
}

export async function graphFetch(
  url: string,
  options: RequestInit & { accessToken?: string; tenantId?: string; requiredScope?: string } = {}
) {
  const { accessToken, tenantId, requiredScope, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers);

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (response.ok) return response;

  const graphBody = await response.clone().json().catch(() => null);

  if (looksLikeConsentFailure(response.status, graphBody)) {
    const missingScope = requiredScope || inferRequiredScope(url);
    const details: GraphConsentErrorDetails = {
      missingScope,
      status: response.status,
      graphCode: graphBody?.error?.code,
      graphMessage: graphBody?.error?.message,
      action: 'Ask an Aethos admin to re-authenticate Microsoft access with admin consent.',
      documentationUrl: SCOPE_DOCUMENTATION[missingScope] || 'https://learn.microsoft.com/en-us/graph/permissions-reference',
    };

    if (tenantId) {
      await markTenantGraphConsentRevoked(tenantId, details);
    }

    throw new GraphConsentError(details);
  }

  return response;
}

export function isGraphConsentError(error: unknown): error is GraphConsentError {
  return error instanceof GraphConsentError;
}
