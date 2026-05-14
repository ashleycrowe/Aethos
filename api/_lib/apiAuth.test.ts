import { describe, expect, it } from 'vitest';

function request(overrides: Record<string, unknown>) {
  return {
    headers: {},
    body: {},
    query: {},
    ...overrides,
  } as any;
}

function unsignedJwt(payload: Record<string, unknown>) {
  const encodedPayload = Buffer.from(JSON.stringify(payload))
    .toString('base64url');
  return `header.${encodedPayload}.signature`;
}

describe('apiAuth request parsing', () => {
  it('extracts bearer tokens from authorization headers', async () => {
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

    const req = request({
      headers: {
        authorization: 'Bearer test-token-123',
      },
    });

    const { getBearerToken } = await import('./apiAuth');
    expect(getBearerToken(req)).toBe('test-token-123');
  });

  it('reads tenant and user IDs from body before query params', async () => {
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

    const req = request({
      body: {
        tenantId: 'tenant-from-body',
        userId: 'user-from-body',
      },
      query: {
        tenantId: 'tenant-from-query',
        userId: 'user-from-query',
      },
    });

    const { getRequestTenantId, getRequestUserId } = await import('./apiAuth');
    expect(getRequestTenantId(req)).toBe('tenant-from-body');
    expect(getRequestUserId(req)).toBe('user-from-body');
  });

  it('extracts the Microsoft tenant ID from JWT tid claims', async () => {
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

    const token = unsignedJwt({
      tid: 'microsoft-tenant-123',
      oid: 'microsoft-user-456',
    });

    const { decodeJwtPayload, getTokenTenantId } = await import('./apiAuth');

    expect(decodeJwtPayload(token)).toMatchObject({
      tid: 'microsoft-tenant-123',
      oid: 'microsoft-user-456',
    });
    expect(getTokenTenantId(token)).toBe('microsoft-tenant-123');
  });

  it('emits structured API error envelopes', async () => {
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

    const payloads: unknown[] = [];
    const res = {
      statusCode: 0,
      status(status: number) {
        this.statusCode = status;
        return this;
      },
      json(payload: unknown) {
        payloads.push(payload);
        return payload;
      },
    } as any;

    const { sendApiError } = await import('./apiAuth');
    sendApiError(res, 400, 'Missing name', 'VALIDATION_ERROR', { field: 'name' });

    expect(res.statusCode).toBe(400);
    expect(payloads[0]).toEqual({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Missing name',
        details: { field: 'name' },
      },
    });
  });

  it('tracks per-key rate limits with reset windows', async () => {
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

    const { checkRateLimit } = await import('./apiAuth');
    const key = `test-key-${Date.now()}`;

    expect(checkRateLimit(key, 2, 1000, 1000)).toMatchObject({
      allowed: true,
      remaining: 1,
    });
    expect(checkRateLimit(key, 2, 1000, 1100)).toMatchObject({
      allowed: true,
      remaining: 0,
    });
    expect(checkRateLimit(key, 2, 1000, 1200)).toMatchObject({
      allowed: false,
      remaining: 0,
    });
    expect(checkRateLimit(key, 2, 1000, 2101)).toMatchObject({
      allowed: true,
      remaining: 1,
    });
  });
});
