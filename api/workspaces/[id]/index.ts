/**
 * Workspace Detail API Endpoint
 *
 * PURPOSE: Get detailed information about a specific workspace
 * VERSION: V1
 *
 * Returns workspace with all its items, sync status, and metadata
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireApiContext, sendApiError, supabase } from '../../_lib/apiAuth.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;
  const { tenantId } = context;
  const { id } = req.query;

  if (!tenantId || !id) {
    return sendApiError(res, 400, 'Missing tenant ID or workspace ID', 'VALIDATION_ERROR', {
      required: ['tenant context', 'workspace id'],
    });
  }

  try {
    // Get workspace details
    const { data: workspace, error: workspaceError } = await supabase
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
        steward_owner_email,
        steward_owner_name,
        review_status,
        handoff_reason_codes,
        source_of_truth_item_ids,
        suggestion_decisions,
        steward_notes,
        created_at,
        updated_at,
        last_sync_at,
        created_by
      `)
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .single();

    if (workspaceError) {
      if (workspaceError.code === 'PGRST116') {
        return sendApiError(res, 404, 'Workspace not found', 'RESOURCE_NOT_FOUND');
      }
      throw workspaceError;
    }

    // Get workspace items with file details
    const { data: workspaceItems, error: itemsError } = await supabase
      .from('workspace_items')
      .select(`
        id,
        file_id,
        added_by,
        added_method,
        pinned,
        added_at,
        files (
          id,
          name,
          path,
          url,
          size_bytes,
          mime_type,
          created_at,
          modified_at,
          owner_email,
          owner_name,
          has_external_share,
          external_user_count,
          is_stale,
          risk_score,
          intelligence_score,
          ai_tags,
          ai_category,
          ai_suggested_title
        )
      `)
      .eq('workspace_id', id)
      .order('pinned', { ascending: false })
      .order('added_at', { ascending: false });

    if (itemsError) {
      throw itemsError;
    }

    // Format workspace items
    const formattedItems = workspaceItems?.map(item => {
      const file = Array.isArray(item.files) ? item.files[0] : item.files;

      return {
        id: item.id,
        fileId: item.file_id,
        addedBy: item.added_by,
        addedMethod: item.added_method,
        pinned: item.pinned,
        addedAt: item.added_at,
        file: file ? {
          id: file.id,
          name: file.name,
          path: file.path,
          url: file.url,
          sizeBytes: file.size_bytes,
          mimeType: file.mime_type,
          createdAt: file.created_at,
          modifiedAt: file.modified_at,
          ownerEmail: file.owner_email,
          ownerName: file.owner_name,
          hasExternalShare: file.has_external_share,
          externalUserCount: file.external_user_count,
          isStale: file.is_stale,
          riskScore: file.risk_score,
          intelligenceScore: file.intelligence_score,
          aiTags: file.ai_tags || [],
          aiCategory: file.ai_category,
          aiSuggestedTitle: file.ai_suggested_title
        } : null
      };
    }) || [];

    // Calculate some stats
    const hasStewardAccessGap = formattedItems.some((item) => {
      const stewardEmail = workspace.steward_owner_email?.toLowerCase();
      const ownerEmail = item.file?.ownerEmail?.toLowerCase();
      return Boolean(stewardEmail && ownerEmail && stewardEmail !== ownerEmail);
    });
    const hasExternalExposure = formattedItems.some((item) => (item.file?.externalUserCount || 0) > 0);
    const accessRestrictionReason = hasStewardAccessGap
      ? 'STEWARD_ACCESS_GAP'
      : hasExternalExposure
        ? 'EXTERNAL_SHARE'
        : workspace.steward_owner_email || workspace.steward_owner_name
          ? null
          : 'OWNERSHIP_UNKNOWN';

    const stats = {
      totalItems: formattedItems.length,
      pinnedItems: formattedItems.filter(item => item.pinned).length,
      totalSizeBytes: formattedItems.reduce((sum, item) =>
        sum + (item.file?.sizeBytes || 0), 0),
      avgIntelligenceScore: formattedItems.length > 0
        ? formattedItems.reduce((sum, item) =>
            sum + (item.file?.intelligenceScore || 0), 0) / formattedItems.length
        : 0
    };

    // Format the response
    const formattedWorkspace = {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
      icon: workspace.icon,
      color: workspace.color,
      tags: workspace.tags || [],
      autoSyncEnabled: workspace.auto_sync_enabled,
      syncRules: workspace.sync_rules,
      stewardOwnerEmail: workspace.steward_owner_email,
      stewardOwnerName: workspace.steward_owner_name,
      isAccessible: !hasStewardAccessGap,
      steward: workspace.steward_owner_name || workspace.steward_owner_email || null,
      path: `/Aethos Workspaces/${workspace.name}`,
      accessRestrictionReason,
      reviewStatus: workspace.review_status,
      handoffReasonCodes: workspace.handoff_reason_codes || [],
      handoffPacket: workspace.suggestion_decisions?.handoffPacket || null,
      sourceOfTruthItemIds: workspace.source_of_truth_item_ids || [],
      suggestionDecisions: workspace.suggestion_decisions || {},
      stewardNotes: workspace.steward_notes,
      items: formattedItems,
      stats,
      createdAt: workspace.created_at,
      updatedAt: workspace.updated_at,
      lastSyncAt: workspace.last_sync_at
    };

    res.status(200).json({
      success: true,
      workspace: formattedWorkspace
    });

  } catch (error) {
    console.error('Error fetching workspace details:', error);
    sendApiError(res, 500, 'Failed to fetch workspace details', 'DATABASE_ERROR');
  }
}
