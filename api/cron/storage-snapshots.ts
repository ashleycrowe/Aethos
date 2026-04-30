/**
 * Vercel Cron Job: Storage Snapshots
 * 
 * SCHEDULE: Daily at 4:00 AM (configured in vercel.json)
 * PURPOSE: Create daily storage snapshots for anomaly detection baseline
 * VERSION: V3 feature
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify this is a cron job request
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get all active tenants
    const { data: tenants, error } = await supabase
      .from('tenants')
      .select('id, name')
      .eq('status', 'active');

    if (error) throw error;

    if (!tenants || tenants.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No active tenants found',
        snapshotsCreated: 0,
      });
    }

    const results = [];
    const today = new Date().toISOString().split('T')[0];

    for (const tenant of tenants) {
      try {
        // Calculate storage statistics for this tenant
        const { data: files, error: filesError } = await supabase
          .from('files')
          .select('size_bytes, provider')
          .eq('tenant_id', tenant.id)
          .not('is_deleted', 'eq', true);

        if (filesError) throw filesError;

        const totalBytes = files?.reduce((sum, a) => sum + (a.size_bytes || 0), 0) || 0;
        const fileCount = files?.length || 0;

        // Calculate per-provider breakdown
        const providerBreakdown: Record<string, number> = {};
        files?.forEach((file) => {
          const provider = file.provider || 'unknown';
          providerBreakdown[provider] = (providerBreakdown[provider] || 0) + (file.size_bytes || 0);
        });

        // Insert snapshot (upsert to handle reruns)
        const { error: insertError } = await supabase
          .from('storage_snapshots')
          .upsert(
            {
              tenant_id: tenant.id,
              snapshot_date: today,
              total_bytes: totalBytes,
              file_count: fileCount,
              provider_breakdown: providerBreakdown,
              created_at: new Date().toISOString(),
            },
            { onConflict: 'tenant_id,snapshot_date' }
          );

        if (insertError) throw insertError;

        results.push({
          tenantId: tenant.id,
          tenantName: tenant.name,
          success: true,
          totalBytes,
          fileCount,
          totalGB: (totalBytes / 1024 / 1024 / 1024).toFixed(2),
        });

        console.log(
          `Storage snapshot created for tenant ${tenant.name}: ${(totalBytes / 1024 / 1024 / 1024).toFixed(2)} GB, ${fileCount} files`
        );
      } catch (error: any) {
        console.error(`Error creating snapshot for tenant ${tenant.name}:`, error);
        results.push({
          tenantId: tenant.id,
          tenantName: tenant.name,
          success: false,
          error: error.message,
        });
      }
    }

    // Log cron execution
    await supabase.from('cron_executions').insert({
      job_name: 'storage-snapshots',
      executed_at: new Date().toISOString(),
      tenants_processed: tenants.length,
      success: true,
      results: results,
    });

    return res.status(200).json({
      success: true,
      snapshotsCreated: tenants.length,
      results,
      executedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Cron job error:', error);

    // Log failed execution
    await supabase.from('cron_executions').insert({
      job_name: 'storage-snapshots',
      executed_at: new Date().toISOString(),
      success: false,
      error_message: error.message,
    });

    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}
