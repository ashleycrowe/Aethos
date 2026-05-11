/**
 * Remediation Execution API Endpoint
 * 
 * PURPOSE: Execute remediation actions (archive, delete, revoke links)
 * ACTIONS:
 * - archive: Make files read-only (add metadata tag)
 * - delete: Move to Recycle Bin (soft delete, 30-day recovery)
 * - revoke_links: Remove all external/anonymous sharing links
 * 
 * V1 SCOPE: Microsoft 365 only
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireApiContext, sendApiError, supabase } from '../_lib/apiAuth.js';
import {
  archiveFile,
  deleteFile,
  revokeExternalLinks,
} from '../../src/lib/microsoftGraph.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  const { tenantId, userId, accessToken } = context;
  const { action, fileIds, dryRun = true } = req.body;
  const isDryRun = dryRun !== false;

  if (!action || !Array.isArray(fileIds) || fileIds.length === 0) {
    return sendApiError(res, 400, 'Missing required parameters');
  }

  // Validate action type
  if (!['archive', 'delete', 'revoke_links'].includes(action)) {
    return sendApiError(res, 400, 'Invalid action type');
  }

  const { data: files, error: filesError } = await supabase
    .from('files')
    .select('*')
    .in('id', fileIds)
    .eq('tenant_id', tenantId);

  if (filesError) {
    return sendApiError(res, 500, 'Failed to fetch files from database');
  }

  const matchedFiles = files || [];

  // Create remediation action record
  const { data: actionRecord, error: actionError } = await supabase
    .from('remediation_actions')
    .insert({
      tenant_id: tenantId,
      action_type: action,
      file_ids: fileIds,
      file_count: fileIds.length,
      executed_by: userId,
      status: isDryRun ? 'completed' : 'in_progress',
      completed_at: isDryRun ? new Date().toISOString() : null,
      success_count: isDryRun ? matchedFiles.length : 0,
      failed_count: isDryRun ? Math.max(0, fileIds.length - matchedFiles.length) : 0,
      errors: isDryRun && matchedFiles.length !== fileIds.length
        ? [{ error: 'Some requested files were not found for this tenant' }]
        : [],
      metadata: {
        dry_run: isDryRun,
        intent_logged: true,
        requested_file_count: fileIds.length,
        matched_file_count: matchedFiles.length,
        preview: matchedFiles.slice(0, 10).map((file) => ({
          id: file.id,
          name: file.name,
          provider_id: file.provider_id,
        })),
      },
    })
    .select()
    .single();

  if (actionError) {
    return sendApiError(res, 500, 'Failed to create action record');
  }

  const actionId = actionRecord.id;

  try {
    if (isDryRun) {
      return res.status(200).json({
        success: true,
        dryRun: true,
        actionId,
        message: 'Remediation intent logged. No provider or file mutations were executed.',
        results: {
          successCount: matchedFiles.length,
          failedCount: Math.max(0, fileIds.length - matchedFiles.length),
          errors: matchedFiles.length !== fileIds.length
            ? [{ error: 'Some requested files were not found for this tenant' }]
            : [],
        },
      });
    }

    if (!accessToken) {
      return sendApiError(res, 401, 'Missing authorization token');
    }

    let successCount = 0;
    let failedCount = 0;
    const errors: any[] = [];

    // Execute action on each file
    for (const file of matchedFiles) {
      try {
        // Extract driveId and fileId from metadata
        const driveId = file.metadata?.parentReference?.driveId || file.raw_api_response?.parentReference?.driveId;
        const providerId = file.provider_id;

        if (!driveId) {
          throw new Error('Missing driveId for file');
        }

        let success = false;

        switch (action) {
          case 'archive':
            success = await archiveFile(accessToken, driveId, providerId);
            break;

          case 'delete':
            success = await deleteFile(accessToken, driveId, providerId);
            break;

          case 'revoke_links':
            const result = await revokeExternalLinks(accessToken, driveId, providerId);
            success = result.revoked > 0 || result.failed === 0;
            
            // Update file in database to reflect revoked links
            if (success) {
              await supabase
                .from('files')
                .update({
                  has_external_share: false,
                  external_user_count: 0,
                  risk_score: Math.max(0, file.risk_score - 40), // Reduce risk score
                })
                .eq('id', file.id);
            }
            break;
        }

        if (success) {
          successCount++;

          // Update file status in database for archive/delete
          if (action === 'archive') {
            await supabase
              .from('files')
              .update({
                metadata: {
                  ...file.metadata,
                  archived: true,
                  archived_at: new Date().toISOString(),
                  archived_by: userId,
                },
              })
              .eq('id', file.id);
          } else if (action === 'delete') {
            // Mark as deleted (soft delete in our DB)
            await supabase
              .from('files')
              .update({
                metadata: {
                  ...file.metadata,
                  deleted: true,
                  deleted_at: new Date().toISOString(),
                  deleted_by: userId,
                },
              })
              .eq('id', file.id);
          }
        } else {
          failedCount++;
          errors.push({
            fileId: file.id,
            fileName: file.name,
            error: 'Action failed',
          });
        }
      } catch (error: any) {
        failedCount++;
        errors.push({
          fileId: file.id,
          fileName: file.name,
          error: error.message,
        });
        console.error(`Error executing ${action} on file ${file.name}:`, error);
      }
    }

    // Update remediation action record
    await supabase
      .from('remediation_actions')
      .update({
        status: failedCount > 0 && successCount === 0 ? 'failed' : failedCount > 0 ? 'partial' : 'completed',
        completed_at: new Date().toISOString(),
        success_count: successCount,
        failed_count: failedCount,
        errors: errors.length > 0 ? errors : null,
      })
      .eq('id', actionId);

    // Create notification for user
    if (userId) {
      const actionLabels = {
        archive: 'archived',
        delete: 'deleted',
        revoke_links: 'had links revoked',
      };

      await supabase.from('notifications').insert({
        tenant_id: tenantId,
        user_id: userId,
        type: successCount > 0 ? 'insight' : 'alert',
        priority: 'medium',
        title: `Remediation ${actionLabels[action]} complete`,
        message: `${successCount} file${successCount !== 1 ? 's' : ''} successfully ${actionLabels[action]}. ${failedCount > 0 ? `${failedCount} failed.` : ''}`,
        related_action_id: actionId,
      });
    }

    res.status(200).json({
      success: true,
      actionId,
      results: {
        successCount,
        failedCount,
        errors,
      },
    });
  } catch (error: any) {
    console.error('Remediation execution failed:', error);

    // Mark action as failed
    await supabase
      .from('remediation_actions')
      .update({
        status: 'failed',
        errors: [{ error: error.message }],
        completed_at: new Date().toISOString(),
      })
      .eq('id', actionId);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
