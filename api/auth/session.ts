import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireApiContext, supabase } from '../_lib/apiAuth.js';

const REQUIRED_GRAPH_SCOPES = ['Files.Read.All', 'Sites.Read.All', 'Group.Read.All'];

function getGrantedScopes(claims?: Record<string, unknown>) {
  const scopeClaim = typeof claims?.scp === 'string' ? claims.scp : '';
  return new Set(scopeClaim.split(/\s+/).filter(Boolean));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const context = await requireApiContext(req, res, {
    methods: ['POST'],
    requireTenant: false,
  });

  if (!context) return;

  if (!context.tenantId) {
    return res.status(400).json({
      success: false,
      error: 'Unable to resolve tenant from Microsoft token',
    });
  }

  const grantedScopes = getGrantedScopes(context.tokenClaims);
  const hasRequiredGraphScopes = REQUIRED_GRAPH_SCOPES.every((scope) => grantedScopes.has(scope));

  if (hasRequiredGraphScopes) {
    await supabase
      .from('tenants')
      .update({
        api_consent_revoked: false,
        api_consent_revoked_at: null,
        missing_graph_scopes: [],
        last_graph_error: {},
      })
      .eq('id', context.tenantId);
  }

  return res.status(200).json({
    success: true,
    tenantId: context.tenantId,
    userId: context.userId,
    microsoftTenantId: context.microsoftTenantId,
  });
}
