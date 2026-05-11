import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireApiContext } from '../_lib/apiAuth.js';

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

  return res.status(200).json({
    success: true,
    tenantId: context.tenantId,
    userId: context.userId,
    microsoftTenantId: context.microsoftTenantId,
  });
}
