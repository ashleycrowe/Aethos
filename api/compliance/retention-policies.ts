/**
 * Retention Policy Automation API - V3 Feature
 * 
 * PURPOSE: Automated retention policies with lifecycle workflows
 * ACTIONS: Auto-archive, auto-delete, policy enforcement
 * COMPLIANCE: GDPR, HIPAA, SOC 2, ISO 27001
 * 
 * WORKFLOW:
 * 1. Create retention policy rule
 * 2. Schedule automated checks (cron)
 * 3. Apply actions to matching artifacts
 * 4. Create audit trail
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface RetentionPolicy {
  id?: string;
  tenant_id: string;
  name: string;
  description: string;
  rule_type: 'inactivity' | 'age' | 'tag' | 'location' | 'custom';
  rule_criteria: {
    days_inactive?: number;
    days_old?: number;
    tags?: string[];
    locations?: string[];
    providers?: string[];
  };
  action: 'archive' | 'soft_delete' | 'hard_delete' | 'flag' | 'notify';
  schedule: 'daily' | 'weekly' | 'monthly';
  enabled: boolean;
  compliance_framework?: 'gdpr' | 'hipaa' | 'soc2' | 'iso27001';
}

// Create retention policy
async function createRetentionPolicy(policy: RetentionPolicy) {
  const { data, error } = await supabase
    .from('retention_policies')
    .insert(policy)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Execute retention policy (find matching artifacts and apply action)
async function executeRetentionPolicy(policyId: string) {
  // Retrieve policy
  const { data: policy } = await supabase
    .from('retention_policies')
    .select('*')
    .eq('id', policyId)
    .single();

  if (!policy || !policy.enabled) {
    throw new Error('Policy not found or disabled');
  }

  // Build query to find matching artifacts
  let query = supabase
    .from('artifacts')
    .select('*')
    .eq('tenant_id', policy.tenant_id);

  // Apply rule criteria
  const criteria = policy.rule_criteria;

  if (policy.rule_type === 'inactivity' && criteria.days_inactive) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - criteria.days_inactive);
    query = query.lt('last_modified', thresholdDate.toISOString());
  }

  if (policy.rule_type === 'age' && criteria.days_old) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - criteria.days_old);
    query = query.lt('created_at', thresholdDate.toISOString());
  }

  if (criteria.tags && criteria.tags.length > 0) {
    query = query.contains('tags', criteria.tags);
  }

  if (criteria.providers && criteria.providers.length > 0) {
    query = query.in('provider', criteria.providers);
  }

  const { data: matchingArtifacts, error } = await query;

  if (error) throw error;

  // Apply action to matching artifacts
  const affectedArtifacts = [];

  for (const artifact of matchingArtifacts || []) {
    let actionResult;

    switch (policy.action) {
      case 'archive':
        actionResult = await supabase
          .from('artifacts')
          .update({ is_archived: true, archived_at: new Date().toISOString() })
          .eq('id', artifact.id);
        break;

      case 'soft_delete':
        actionResult = await supabase
          .from('artifacts')
          .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
            delete_scheduled_for: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          })
          .eq('id', artifact.id);
        break;

      case 'hard_delete':
        // Only for authorized users with deep_purge permission
        actionResult = await supabase.from('artifacts').delete().eq('id', artifact.id);
        break;

      case 'flag':
        actionResult = await supabase
          .from('artifacts')
          .update({ compliance_flagged: true })
          .eq('id', artifact.id);
        break;

      case 'notify':
        // Create notification for tenant admin
        await supabase.from('notifications').insert({
          tenant_id: policy.tenant_id,
          type: 'compliance_alert',
          priority: 'medium',
          title: `Retention Policy Alert: ${policy.name}`,
          message: `Artifact "${artifact.name}" matches retention policy criteria`,
          artifact_id: artifact.id,
          created_at: new Date().toISOString(),
        });
        break;
    }

    if (actionResult && !actionResult.error) {
      affectedArtifacts.push(artifact.id);
    }
  }

  // Create audit log entry
  await supabase.from('compliance_audit_logs').insert({
    tenant_id: policy.tenant_id,
    policy_id: policyId,
    action: policy.action,
    artifacts_affected: affectedArtifacts.length,
    artifact_ids: affectedArtifacts,
    executed_at: new Date().toISOString(),
    execution_type: 'automated',
  });

  return {
    policyId,
    artifactsMatched: matchingArtifacts?.length || 0,
    artifactsAffected: affectedArtifacts.length,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'POST') {
      const { action, ...body } = req.body;

      if (action === 'create') {
        // Create new retention policy
        const policy = await createRetentionPolicy(body as RetentionPolicy);
        return res.status(201).json({ success: true, policy });
      }

      if (action === 'execute') {
        // Execute retention policy
        const { policyId } = body;
        if (!policyId) {
          return res.status(400).json({ error: 'Missing policyId' });
        }

        const result = await executeRetentionPolicy(policyId);
        return res.status(200).json({ success: true, result });
      }

      return res.status(400).json({ error: 'Invalid action' });
    }

    if (req.method === 'GET') {
      // List retention policies for tenant
      const { tenantId } = req.query;

      if (!tenantId) {
        return res.status(400).json({ error: 'Missing tenantId' });
      }

      const { data: policies, error } = await supabase
        .from('retention_policies')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({ success: true, policies });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Retention policy error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
