/**
 * Vercel Cron Job: Anomaly Detection
 * 
 * SCHEDULE: Daily at 2:00 AM (configured in vercel.json)
 * PURPOSE: Run anomaly detection for all active tenants
 * VERSION: V3 feature
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify this is a cron job request (Vercel sets special header)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get all active tenants with V3 features enabled
    const { data: tenants, error } = await supabase
      .from('tenants')
      .select('id, name')
      .eq('status', 'active')
      .eq('enable_v3_features', true);

    if (error) throw error;

    if (!tenants || tenants.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No active tenants with V3 features enabled',
        tenantsProcessed: 0,
      });
    }

    // Run anomaly detection for each tenant
    const results = [];
    
    for (const tenant of tenants) {
      try {
        // Call the anomaly detection API internally
        const response = await fetch(`${process.env.API_BASE_URL}/api/analytics/anomaly-detection`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`,
          },
          body: JSON.stringify({ tenantId: tenant.id }),
        });

        const data = await response.json();
        
        results.push({
          tenantId: tenant.id,
          tenantName: tenant.name,
          success: response.ok,
          anomaliesFound: data.summary?.total || 0,
        });

        console.log(`Anomaly detection completed for tenant ${tenant.name}: ${data.summary?.total || 0} anomalies found`);
      } catch (error: any) {
        console.error(`Error processing tenant ${tenant.name}:`, error);
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
      job_name: 'anomaly-detection',
      executed_at: new Date().toISOString(),
      tenants_processed: tenants.length,
      success: true,
      results: results,
    });

    return res.status(200).json({
      success: true,
      tenantsProcessed: tenants.length,
      results,
      executedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    
    // Log failed execution
    await supabase.from('cron_executions').insert({
      job_name: 'anomaly-detection',
      executed_at: new Date().toISOString(),
      success: false,
      error_message: error.message,
    });

    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}
