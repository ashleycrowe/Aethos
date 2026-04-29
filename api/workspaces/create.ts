/**
 * Workspace Creation API Endpoint
 * 
 * PURPOSE: Create a new workspace (The Nexus)
 * V1 KEY FEATURE: Tag-based auto-sync
 * 
 * When a workspace is created with tags, it automatically syncs files
 * that have matching AI tags.
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    tenantId,
    userId,
    name,
    description,
    icon,
    color = '#00F0FF',
    tags = [],
    autoSyncEnabled = true,
    syncRules = {},
  } = req.body;

  if (!tenantId || !userId || !name) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Create workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert({
        tenant_id: tenantId,
        name,
        description,
        icon,
        color,
        tags,
        auto_sync_enabled: autoSyncEnabled,
        sync_rules: {
          include_tags: tags,
          exclude_tags: [],
          include_providers: ['microsoft'],
          include_owners: [],
          min_intelligence_score: 0,
          ...syncRules,
        },
        created_by: userId,
      })
      .select()
      .single();

    if (workspaceError) {
      console.error('Error creating workspace:', workspaceError);
      return res.status(500).json({ error: 'Failed to create workspace' });
    }

    // If auto-sync is enabled and tags are provided, sync immediately
    let syncedCount = 0;
    if (autoSyncEnabled && tags.length > 0) {
      // Call the sync function
      const { data: syncResult } = await supabase.rpc('sync_workspace_items', {
        workspace_uuid: workspace.id,
      });

      syncedCount = syncResult || 0;
    }

    // Create notification
    await supabase.from('notifications').insert({
      tenant_id: tenantId,
      user_id: userId,
      type: 'insight',
      priority: 'low',
      title: 'Workspace created',
      message: `Workspace "${name}" created successfully. ${syncedCount > 0 ? `${syncedCount} files auto-synced based on tags.` : ''}`,
    });

    res.status(200).json({
      success: true,
      workspace,
      syncedCount,
    });
  } catch (error: any) {
    console.error('Workspace creation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
