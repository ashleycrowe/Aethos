import { describe, expect, it, vi } from 'vitest';
import { getApiRequestId, logApiEvent } from './apiLogger';

describe('apiLogger', () => {
  it('prefers platform request IDs when present', () => {
    expect(getApiRequestId({
      headers: {
        'x-vercel-id': 'iad1::abc123',
      },
    } as any)).toBe('iad1::abc123');
  });

  it('writes structured JSON logs', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    logApiEvent('info', 'test.event', {
      route: '/api/test',
      tenantId: 'tenant-1',
      requestId: 'req-1',
      statusCode: 200,
      durationMs: 12,
    });

    expect(spy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(spy.mock.calls[0][0] as string);
    expect(payload).toMatchObject({
      level: 'info',
      event: 'test.event',
      route: '/api/test',
      tenantId: 'tenant-1',
      requestId: 'req-1',
      statusCode: 200,
      durationMs: 12,
    });

    spy.mockRestore();
  });
});
