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
import { requireApiContext, sendApiError, supabase } from '../_lib/apiAuth.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  const {
    name,
    description,
    icon,
    color = '#00F0FF',
    tags = [],
    autoSyncEnabled = true,
    syncRules = {},
    stewardOwnerEmail = null,
    stewardOwnerName = null,
    reviewStatus = 'admin_review',
    handoffReasonCodes = [],
    sourceOfTruthItemIds = [],
    suggestionDecisions = {},
    stewardNotes = null,
  } = req.body;
  const { tenantId, userId } = context;

  if (!tenantId || !userId || !name) {
    return sendApiError(res, 400, 'Missing required parameters', 'VALIDATION_ERROR', {
      required: ['tenant context', 'user context', 'name'],
    });
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
        steward_owner_email: stewardOwnerEmail,
        steward_owner_name: stewardOwnerName,
        review_status: reviewStatus,
        handoff_reason_codes: handoffReasonCodes,
        source_of_truth_item_ids: sourceOfTruthItemIds,
        suggestion_decisions: suggestionDecisions,
        steward_notes: stewardNotes,
        created_by: userId,
      })
      .select()
      .single();

    if (workspaceError) {
      console.error('Error creating workspace:', workspaceError);
      return sendApiError(res, 500, 'Failed to create workspace', 'DATABASE_ERROR');
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
    sendApiError(res, 500, error.message, 'INTERNAL_ERROR');
  }
}
