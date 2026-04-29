/**
 * Vercel Cron Job: Retention Policy Execution
 * 
 * SCHEDULE: Daily at 3:00 AM (configured in vercel.json)
 * PURPOSE: Execute all enabled retention policies for active tenants
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
    // Get all enabled retention policies that should run today
    const today = new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    const dayOfMonth = new Date().getDate();

    const { data: policies, error } = await supabase
      .from('retention_policies')
      .select('*, tenant:tenants!tenant_id(id, name, status)')
      .eq('enabled', true)
      .eq('tenant.status', 'active');

    if (error) throw error;

    if (!policies || policies.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No enabled retention policies found',
        policiesExecuted: 0,
      });
    }

    // Filter policies by schedule
    const policiesToExecute = policies.filter((policy) => {
      switch (policy.schedule) {
        case 'daily':
          return true;
        case 'weekly':
          return dayOfWeek === 1; // Monday
        case 'monthly':
          return dayOfMonth === 1; // First of month
        default:
          return false;
      }
    });

    if (policiesToExecute.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No policies scheduled for today',
        policiesExecuted: 0,
      });
    }

    // Execute each policy
    const results = [];

    for (const policy of policiesToExecute) {
      try {
        // Call the retention policy execution API
        const response = await fetch(`${process.env.API_BASE_URL}/api/compliance/retention-policies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`,
          },
          body: JSON.stringify({
            action: 'execute',
            policyId: policy.id,
          }),
        });

        const data = await response.json();

        results.push({
          policyId: policy.id,
          policyName: policy.name,
          tenantName: policy.tenant.name,
          success: response.ok,
          artifactsAffected: data.result?.artifactsAffected || 0,
        });

        console.log(
          `Retention policy "${policy.name}" executed for tenant ${policy.tenant.name}: ${data.result?.artifactsAffected || 0} artifacts affected`
        );
      } catch (error: any) {
        console.error(`Error executing policy ${policy.name}:`, error);
        results.push({
          policyId: policy.id,
          policyName: policy.name,
          tenantName: policy.tenant.name,
          success: false,
          error: error.message,
        });
      }
    }

    // Log cron execution
    await supabase.from('cron_executions').insert({
      job_name: 'retention-policies',
      executed_at: new Date().toISOString(),
      policies_executed: policiesToExecute.length,
      success: true,
      results: results,
    });

    return res.status(200).json({
      success: true,
      policiesExecuted: policiesToExecute.length,
      results,
      executedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Cron job error:', error);

    // Log failed execution
    await supabase.from('cron_executions').insert({
      job_name: 'retention-policies',
      executed_at: new Date().toISOString(),
      success: false,
      error_message: error.message,
    });

    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}
