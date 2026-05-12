import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_SERVER_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(
  SUPABASE_SERVER_URL || 'https://placeholder.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key'
);

type ApiAuthOptions = {
  methods?: string[];
  requireAuth?: boolean;
  requireTenant?: boolean;
};

export type ApiAuthContext = {
  tenantId: string;
  userId?: string;
  accessToken?: string;
  microsoftTenantId?: string;
  tokenClaims?: Record<string, unknown>;
};

function firstString(value: unknown): string | undefined {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : undefined;
  return typeof value === 'string' ? value : undefined;
}

export function getBearerToken(req: VercelRequest): string | undefined {
  const header = firstString(req.headers.authorization);
  if (!header?.startsWith('Bearer ')) return undefined;
  return header.slice('Bearer '.length).trim();
}

export function getRequestTenantId(req: VercelRequest): string | undefined {
  return firstString(req.body?.tenantId) || firstString(req.query.tenantId);
}

export function getRequestUserId(req: VercelRequest): string | undefined {
  return firstString(req.body?.userId) || firstString(req.query.userId);
}

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  return Buffer.from(padded, 'base64').toString('utf8');
}

export function decodeJwtPayload(token?: string): Record<string, unknown> | null {
  if (!token) return null;

  const [, payload] = token.split('.');
  if (!payload) return null;

  try {
    return JSON.parse(base64UrlDecode(payload));
  } catch {
    return null;
  }
}

export function getTokenTenantId(token?: string): string | undefined {
  const claims = decodeJwtPayload(token);
  return firstString(claims?.tid) || firstString(claims?.tenantId);
}

function getTokenUserProfile(claims: Record<string, unknown> | null) {
  return {
    microsoftId: firstString(claims?.oid) || firstString(claims?.sub),
    email:
      firstString(claims?.preferred_username) ||
      firstString(claims?.upn) ||
      firstString(claims?.email),
    name: firstString(claims?.name),
  };
}

async function ensureTenantFromMicrosoftId(microsoftTenantId: string, claims: Record<string, unknown> | null) {
  const tenantName =
    firstString(claims?.tenant_display_name) ||
    firstString(claims?.xms_tdbr) ||
    'Self-Serve Microsoft Tenant';

  const { data: existingTenant } = await supabase
    .from('tenants')
    .select('id, status')
    .eq('microsoft_tenant_id', microsoftTenantId)
    .single();

  if (existingTenant) return existingTenant;

  const { data: newTenant, error } = await supabase
    .from('tenants')
    .upsert(
      {
        name: tenantName,
        microsoft_tenant_id: microsoftTenantId,
        subscription_tier: 'v1',
        status: 'active',
        metadata: {
          enrollment: 'jit',
          source: 'apiAuth',
          enrolled_at: new Date().toISOString(),
        },
      },
      { onConflict: 'microsoft_tenant_id' }
    )
    .select('id, status')
    .single();

  if (error || !newTenant) {
    throw error || new Error('Unable to provision tenant');
  }

  return newTenant;
}

async function ensureUserFromToken(tenantId: string, claims: Record<string, unknown> | null): Promise<string | undefined> {
  const profile = getTokenUserProfile(claims);
  if (!profile.microsoftId || !profile.email) return undefined;

  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('microsoft_id', profile.microsoftId)
    .single();

  if (existingUser?.id) {
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', existingUser.id);
    return existingUser.id;
  }

  const { count } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId);

  const { data: newUser } = await supabase
    .from('users')
    .insert({
      tenant_id: tenantId,
      email: profile.email,
      name: profile.name || profile.email,
      microsoft_id: profile.microsoftId,
      role: count === 0 ? 'admin' : 'user',
      last_login: new Date().toISOString(),
      metadata: {
        enrollment: 'jit',
        source: 'apiAuth',
      },
    })
    .select('id')
    .single();

  return newUser?.id;
}

export async function requireApiContext(
  req: VercelRequest,
  res: VercelResponse,
  options: ApiAuthOptions = {}
): Promise<ApiAuthContext | null> {
  const methods = options.methods || ['POST'];
  const requireAuth = options.requireAuth ?? true;
  const requireTenant = options.requireTenant ?? true;

  if (!methods.includes(req.method || '')) {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return null;
  }

  if (!SUPABASE_SERVER_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Supabase server environment is not configured', {
      hasSupabaseUrl: Boolean(SUPABASE_SERVER_URL),
      hasServiceRoleKey: Boolean(SUPABASE_SERVICE_ROLE_KEY),
    });
    res.status(500).json({
      success: false,
      error: 'Server Supabase environment is not configured',
    });
    return null;
  }

  const accessToken = getBearerToken(req) || firstString(req.body?.accessToken);
  const tokenClaims = decodeJwtPayload(accessToken);
  const microsoftTenantId = getTokenTenantId(accessToken);
  const requestedTenantId = getRequestTenantId(req);
  let tenantId = requestedTenantId;
  let userId = getRequestUserId(req);

  if (requireAuth && !accessToken) {
    res.status(401).json({ success: false, error: 'Missing authorization token' });
    return null;
  }

  if (!tenantId && microsoftTenantId) {
    try {
      const tenant = await ensureTenantFromMicrosoftId(microsoftTenantId, tokenClaims);
      tenantId = tenant.id;
      userId = userId || (await ensureUserFromToken(tenantId, tokenClaims));
    } catch (error) {
      console.error('Tenant JIT provisioning failed:', error);
      res.status(500).json({ success: false, error: 'Unable to provision tenant' });
      return null;
    }
  }

  if (requireTenant && !tenantId) {
    res.status(400).json({ success: false, error: 'Missing tenant ID' });
    return null;
  }

  if (!tenantId) {
    return { tenantId: '', userId, accessToken, microsoftTenantId, tokenClaims: tokenClaims || undefined };
  }

  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('id, status, microsoft_tenant_id')
    .eq('id', tenantId)
    .single();

  if (tenantError || !tenant) {
    res.status(404).json({ success: false, error: 'Tenant not found' });
    return null;
  }

  if (tenant.status && tenant.status !== 'active') {
    res.status(403).json({ success: false, error: 'Tenant is not active' });
    return null;
  }

  if (microsoftTenantId && tenant.microsoft_tenant_id && tenant.microsoft_tenant_id !== microsoftTenantId) {
    res.status(403).json({ success: false, error: 'Token tenant does not match request tenant' });
    return null;
  }

  if (microsoftTenantId && !tenant.microsoft_tenant_id) {
    await supabase
      .from('tenants')
      .update({ microsoft_tenant_id: microsoftTenantId })
      .eq('id', tenantId);
  }

  if (!userId) {
    userId = await ensureUserFromToken(tenantId, tokenClaims);
  }

  if (userId) {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .eq('tenant_id', tenantId)
      .single();

    if (userError || !user) {
      res.status(403).json({ success: false, error: 'User does not belong to tenant' });
      return null;
    }
  }

  return { tenantId, userId, accessToken, microsoftTenantId, tokenClaims: tokenClaims || undefined };
}

export function sendApiError(res: VercelResponse, status: number, error: string) {
  return res.status(status).json({ success: false, error });
}
