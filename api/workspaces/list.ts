/**
 * Workspace List API Endpoint
 *
 * PURPOSE: List all workspaces for a tenant
 * VERSION: V1
 *
 * Returns workspaces with their basic info and sync status
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tenantId } = req.body;

  if (!tenantId) {
    return res.status(400).json({ error: 'Missing tenant ID' });
  }

  try {
    // Get workspaces for the tenant
    const { data: workspaces, error } = await supabase
      .from('workspaces')
      .select(`
        id,
        name,
        description,
        icon,
        color,
        tags,
        auto_sync_enabled,
        sync_rules,
        created_at,
        updated_at,
        last_sync_at,
        created_by
      `)
      .eq('tenant_id', tenantId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Get workspace item counts for each workspace
    const workspaceIds = workspaces?.map(ws => ws.id) || [];
    const { data: itemCounts } = await supabase
      .from('workspace_items')
      .select('workspace_id')
      .in('workspace_id', workspaceIds);

    // Count items per workspace
    const counts: { [key: string]: number } = {};
    itemCounts?.forEach(item => {
      counts[item.workspace_id] = (counts[item.workspace_id] || 0) + 1;
    });

    // Format the response
    const formattedWorkspaces = workspaces?.map(workspace => ({
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
      icon: workspace.icon,
      color: workspace.color,
      tags: workspace.tags || [],
      autoSyncEnabled: workspace.auto_sync_enabled,
      syncRules: workspace.sync_rules,
      itemCount: counts[workspace.id] || 0,
      createdAt: workspace.created_at,
      updatedAt: workspace.updated_at,
      lastSyncAt: workspace.last_sync_at
    })) || [];

    res.status(200).json({
      success: true,
      workspaces: formattedWorkspaces
    });

  } catch (error) {
    console.error('Error fetching workspaces:', error);
    res.status(500).json({ error: 'Failed to fetch workspaces' });
  }
}