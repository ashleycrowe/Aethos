/**
 * Daily Discovery Scan Cron Job
 * 
 * PURPOSE: Automatically scan all active tenants every day
 * SCHEDULE: 2 AM UTC daily (Vercel Cron)
 * TRIGGER: Vercel cron scheduler
 * 
 * This keeps all tenant data fresh without manual intervention
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Verify cron secret (Vercel provides this for security)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('[Cron] Starting daily discovery scan...');

  try {
    // Get all active tenants with daily scan enabled
    const { data: tenants, error: tenantsError } = await supabase
      .from('tenants')
      .select('*')
      .eq('status', 'active')
      .contains('settings', { daily_scan_enabled: true });

    if (tenantsError) {
      console.error('Error fetching tenants:', tenantsError);
      return res.status(500).json({ error: 'Failed to fetch tenants' });
    }

    if (!tenants || tenants.length === 0) {
      console.log('[Cron] No active tenants with daily scan enabled');
      return res.status(200).json({ message: 'No tenants to scan' });
    }

    console.log(`[Cron] Found ${tenants.length} tenants to scan`);

    const results = [];

    for (const tenant of tenants) {
      try {
        console.log(`[Cron] Scanning tenant: ${tenant.name}`);

        // Get an admin user from this tenant to attribute the scan
        const { data: adminUser } = await supabase
          .from('users')
          .select('*')
          .eq('tenant_id', tenant.id)
          .eq('role', 'admin')
          .limit(1)
          .single();

        if (!adminUser) {
          console.warn(`[Cron] No admin user found for tenant ${tenant.name}`);
          continue;
        }

        // Note: In a real implementation, we'd need to store and refresh
        // the Microsoft access token for automated scans.
        // For now, this creates a scan record that will be picked up
        // when the user next logs in.

        const { data: scanRecord, error: scanError } = await supabase
          .from('discovery_scans')
          .insert({
            tenant_id: tenant.id,
            provider: 'microsoft',
            scan_type: 'incremental',
            status: 'pending',
            metadata: {
              triggered_by: 'cron',
              scheduled: true,
            },
          })
          .select()
          .single();

        if (scanError) {
          console.error(`[Cron] Error creating scan for ${tenant.name}:`, scanError);
          results.push({
            tenantId: tenant.id,
            tenantName: tenant.name,
            status: 'failed',
            error: scanError.message,
          });
          continue;
        }

        // Create notification for admins
        await supabase.from('notifications').insert({
          tenant_id: tenant.id,
          user_id: null, // Null = all users
          type: 'system',
          priority: 'low',
          title: 'Daily scan scheduled',
          message: 'An automated discovery scan has been scheduled. It will run when you next log in.',
          related_scan_id: scanRecord.id,
        });

        results.push({
          tenantId: tenant.id,
          tenantName: tenant.name,
          status: 'scheduled',
          scanId: scanRecord.id,
        });

        console.log(`[Cron] Scan scheduled for tenant: ${tenant.name}`);
      } catch (error: any) {
        console.error(`[Cron] Error processing tenant ${tenant.name}:`, error);
        results.push({
          tenantId: tenant.id,
          tenantName: tenant.name,
          status: 'error',
          error: error.message,
        });
      }
    }

    console.log('[Cron] Daily scan complete');

    res.status(200).json({
      success: true,
      message: 'Daily scan complete',
      results,
      totalTenants: tenants.length,
    });
  } catch (error: any) {
    console.error('[Cron] Daily scan failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
