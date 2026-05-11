/**
 * Workspace Detail API Endpoint
 *
 * PURPOSE: Get detailed information about a specific workspace
 * VERSION: V1
 *
 * Returns workspace with all its items, sync status, and metadata
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireApiContext, supabase } from '../../_lib/apiAuth.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;
  const { tenantId } = context;
  const { id } = req.query;

  if (!tenantId || !id) {
    return res.status(400).json({ error: 'Missing tenant ID or workspace ID' });
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
        return res.status(404).json({ error: 'Workspace not found' });
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
          size_bytes,
          mime_type,
          created_at,
          modified_at,
          owner_email,
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
          sizeBytes: file.size_bytes,
          mimeType: file.mime_type,
          createdAt: file.created_at,
          modifiedAt: file.modified_at,
          ownerEmail: file.owner_email,
          intelligenceScore: file.intelligence_score,
          aiTags: file.ai_tags || [],
          aiCategory: file.ai_category,
          aiSuggestedTitle: file.ai_suggested_title
        } : null
      };
    }) || [];

    // Calculate some stats
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
    res.status(500).json({ error: 'Failed to fetch workspace details' });
  }
}
