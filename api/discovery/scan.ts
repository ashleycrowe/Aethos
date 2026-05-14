/**
 * Discovery Scan API Endpoint
 * 
 * PURPOSE: Scan Microsoft 365 tenant and index file/site metadata
 * TRIGGER: Manual button click or scheduled cron job
 * DURATION: 5-30 minutes depending on tenant size
 * 
 * V1 SCOPE: Microsoft 365 files and containers only (SharePoint, OneDrive, Teams).
 * SharePoint Lists and row-level list data are intentionally deferred.
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireApiContext, sendApiError, supabase } from '../_lib/apiAuth.js';
import { getApiRequestId, logApiEvent } from '../_lib/apiLogger.js';
import {
  getAllSharePointSites,
  getFilesInSite,
  getUserOneDriveFiles,
  getAllTeams,
  getTeamFiles,
  hasExternalShare,
} from '../../src/lib/microsoftGraph.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const requestId = getApiRequestId(req);
  const route = '/api/discovery/scan';
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  const { accessToken, tenantId, userId } = context;
  const { scanType = 'full' } = req.body;
  if (!accessToken) {
    return sendApiError(res, 401, 'Missing authorization token', 'AUTH_TOKEN_MISSING');
  }

  // Create a discovery scan record
  const { data: scanRecord, error: scanError } = await supabase
    .from('discovery_scans')
    .insert({
      tenant_id: tenantId,
      provider: 'microsoft',
      scan_type: scanType,
      status: 'running',
    })
    .select()
    .single();

  if (scanError) {
    return sendApiError(res, 500, 'Failed to create scan record', 'DATABASE_ERROR');
  }

  const scanId = scanRecord.id;
  const startTime = Date.now();
  logApiEvent('info', 'discovery.scan.started', {
    route,
    tenantId,
    userId,
    requestId,
    metadata: { scanId, scanType },
  });

  try {
    let totalFiles = 0;
    let totalSites = 0;
    let newFiles = 0;
    let errors: string[] = [];

    // Step 1: Scan SharePoint Sites
    logApiEvent('info', 'discovery.sharepoint.started', {
      route,
      tenantId,
      userId,
      requestId,
      metadata: { scanId },
    });
    try {
      const sites = await getAllSharePointSites(accessToken);
      totalSites += sites.length;

      for (const site of sites) {
        try {
          // Save site to database
          const { error: siteError } = await supabase
            .from('sites')
            .upsert({
              tenant_id: tenantId,
              provider: 'microsoft',
              provider_id: site.id,
              provider_type: 'sharepoint',
              name: site.displayName,
              url: site.webUrl,
              created_at: site.createdDateTime,
              last_activity: site.lastModifiedDateTime,
              is_active: true,
              metadata: site,
            });

          if (siteError) {
            console.error(`Error saving site ${site.id}:`, siteError);
            errors.push(`Site ${site.displayName}: ${siteError.message}`);
            continue;
          }

          // Get all files in this site
          const files = await getFilesInSite(accessToken, site.id, true);
          totalFiles += files.length;

          // Save files to database
          for (const file of files) {
            try {
              // Check for external sharing
              const { hasExternal, externalCount } = await hasExternalShare(
                accessToken,
                file.parentReference.driveId,
                file.id
              );

              // Determine if file is stale (180+ days without modification)
              const sixMonthsAgo = new Date();
              sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
              const isStale = new Date(file.lastModifiedDateTime) < sixMonthsAgo;

              // Calculate risk score
              let riskScore = 0;
              if (hasExternal) riskScore += 40;
              if (isStale) riskScore += 20;
              if (file.size > 100 * 1024 * 1024) riskScore += 10; // 100MB+
              riskScore = Math.min(riskScore, 100);

              const { error: fileError } = await supabase
                .from('files')
                .upsert({
                  tenant_id: tenantId,
                  provider: 'microsoft',
                  provider_id: file.id,
                  provider_type: 'sharepoint',
                  name: file.name,
                  path: file.parentReference.path,
                  url: file.webUrl,
                  size_bytes: file.size || 0,
                  mime_type: file.file?.mimeType || null,
                  created_at: file.createdDateTime,
                  modified_at: file.lastModifiedDateTime,
                  owner_email: file.createdBy?.user?.email || null,
                  owner_name: file.createdBy?.user?.displayName || null,
                  is_stale: isStale,
                  has_external_share: hasExternal,
                  external_user_count: externalCount,
                  risk_score: riskScore,
                  intelligence_score: 50, // Default, will be improved by AI later
                  metadata: file,
                  raw_api_response: file,
                });

              if (fileError && fileError.code !== '23505') {
                // Ignore duplicate key errors
                console.error(`Error saving file ${file.id}:`, fileError);
              } else if (!fileError) {
                newFiles++;
              }
            } catch (fileError: any) {
              console.error(`Error processing file ${file.name}:`, fileError);
              errors.push(`File ${file.name}: ${fileError.message}`);
            }
          }
        } catch (siteError: any) {
          console.error(`Error scanning site ${site.displayName}:`, siteError);
          errors.push(`Site ${site.displayName}: ${siteError.message}`);
        }
      }
    } catch (error: any) {
      console.error('Error scanning SharePoint:', error);
      errors.push(`SharePoint scan failed: ${error.message}`);
    }

    // Step 2: Scan OneDrive (user's personal files)
    logApiEvent('info', 'discovery.onedrive.started', {
      route,
      tenantId,
      userId,
      requestId,
      metadata: { scanId },
    });
    try {
      const oneDriveFiles = await getUserOneDriveFiles(accessToken);
      totalFiles += oneDriveFiles.length;

      for (const file of oneDriveFiles) {
        try {
          const { hasExternal, externalCount } = await hasExternalShare(
            accessToken,
            file.parentReference.driveId,
            file.id
          );

          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          const isStale = new Date(file.lastModifiedDateTime) < sixMonthsAgo;

          let riskScore = 0;
          if (hasExternal) riskScore += 40;
          if (isStale) riskScore += 20;
          if (file.size > 100 * 1024 * 1024) riskScore += 10;
          riskScore = Math.min(riskScore, 100);

          await supabase.from('files').upsert({
            tenant_id: tenantId,
            provider: 'microsoft',
            provider_id: file.id,
            provider_type: 'onedrive',
            name: file.name,
            path: file.parentReference.path,
            url: file.webUrl,
            size_bytes: file.size || 0,
            mime_type: file.file?.mimeType || null,
            created_at: file.createdDateTime,
            modified_at: file.lastModifiedDateTime,
            owner_email: file.createdBy?.user?.email || null,
            owner_name: file.createdBy?.user?.displayName || null,
            is_stale: isStale,
            has_external_share: hasExternal,
            external_user_count: externalCount,
            risk_score: riskScore,
            intelligence_score: 50,
            metadata: file,
            raw_api_response: file,
          });

          newFiles++;
        } catch (error: any) {
          console.error(`Error processing OneDrive file:`, error);
        }
      }
    } catch (error: any) {
      console.error('Error scanning OneDrive:', error);
      errors.push(`OneDrive scan failed: ${error.message}`);
    }

    // Step 3: Scan Teams
    logApiEvent('info', 'discovery.teams.started', {
      route,
      tenantId,
      userId,
      requestId,
      metadata: { scanId },
    });
    try {
      const teams = await getAllTeams(accessToken);
      totalSites += teams.length;

      for (const team of teams) {
        try {
          // Save team as a site
          await supabase.from('sites').upsert({
            tenant_id: tenantId,
            provider: 'microsoft',
            provider_id: team.id,
            provider_type: 'teams',
            name: team.displayName,
            description: team.description,
            created_at: team.createdDateTime,
            is_active: true,
            metadata: team,
          });

          // Get files shared in team
          const teamFiles = await getTeamFiles(accessToken, team.id);
          totalFiles += teamFiles.length;

          for (const file of teamFiles) {
            try {
              const { hasExternal, externalCount } = await hasExternalShare(
                accessToken,
                file.parentReference.driveId,
                file.id
              );

              const sixMonthsAgo = new Date();
              sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
              const isStale = new Date(file.lastModifiedDateTime) < sixMonthsAgo;

              let riskScore = 0;
              if (hasExternal) riskScore += 40;
              if (isStale) riskScore += 20;
              if (file.size > 100 * 1024 * 1024) riskScore += 10;
              riskScore = Math.min(riskScore, 100);

              await supabase.from('files').upsert({
                tenant_id: tenantId,
                provider: 'microsoft',
                provider_id: file.id,
                provider_type: 'teams',
                name: file.name,
                path: file.parentReference.path,
                url: file.webUrl,
                size_bytes: file.size || 0,
                mime_type: file.file?.mimeType || null,
                created_at: file.createdDateTime,
                modified_at: file.lastModifiedDateTime,
                owner_email: file.createdBy?.user?.email || null,
                owner_name: file.createdBy?.user?.displayName || null,
                is_stale: isStale,
                has_external_share: hasExternal,
                external_user_count: externalCount,
                risk_score: riskScore,
                intelligence_score: 50,
                metadata: file,
                raw_api_response: file,
              });

              newFiles++;
            } catch (error: any) {
              console.error(`Error processing Teams file:`, error);
            }
          }
        } catch (teamError: any) {
          console.error(`Error scanning team ${team.displayName}:`, teamError);
          errors.push(`Team ${team.displayName}: ${teamError.message}`);
        }
      }
    } catch (error: any) {
      console.error('Error scanning Teams:', error);
      errors.push(`Teams scan failed: ${error.message}`);
    }

    // Mark scan as completed
    const duration = Math.round((Date.now() - startTime) / 1000);

    await supabase
      .from('discovery_scans')
      .update({
        status: errors.length > 0 ? 'partial' : 'completed',
        completed_at: new Date().toISOString(),
        duration_seconds: duration,
        files_discovered: totalFiles,
        sites_discovered: totalSites,
        new_files: newFiles,
        errors: errors.length > 0 ? errors : null,
      })
      .eq('id', scanId);

    // Create a notification for the user
    if (userId) {
      await supabase.from('notifications').insert({
        tenant_id: tenantId,
        user_id: userId,
        type: 'insight',
        priority: 'medium',
        title: 'Discovery scan complete',
        message: `Found ${totalFiles.toLocaleString()} files across ${totalSites} sites. ${newFiles} new files indexed.`,
        related_scan_id: scanId,
      });
    }

    logApiEvent(errors.length > 0 ? 'warn' : 'info', 'discovery.scan.completed', {
      route,
      tenantId,
      userId,
      requestId,
      statusCode: 200,
      durationMs: Date.now() - startTime,
      metadata: {
        scanId,
        status: errors.length > 0 ? 'partial' : 'completed',
        totalFiles,
        totalSites,
        newFiles,
        errors: errors.length,
      },
    });

    res.status(200).json({
      success: true,
      scanId,
      duration,
      results: {
        totalFiles,
        totalSites,
        newFiles,
        errors: errors.length,
      },
      scope: {
        included: ['sharepoint_files', 'onedrive_files', 'teams_files', 'site_metadata'],
        deferred: ['sharepoint_lists', 'list_items', 'document_body_content'],
        contentScanning: false,
      },
    });
  } catch (error: any) {
    logApiEvent('error', 'discovery.scan.failed', {
      route,
      tenantId,
      userId,
      requestId,
      statusCode: 500,
      durationMs: Date.now() - startTime,
      metadata: { scanId },
      error,
    });

    // Mark scan as failed
    await supabase
      .from('discovery_scans')
      .update({
        status: 'failed',
        errors: [error.message],
        completed_at: new Date().toISOString(),
      })
      .eq('id', scanId);

    sendApiError(res, 500, error.message, 'UPSTREAM_ERROR');
  }
}
