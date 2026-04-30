/**
 * Google Drive Discovery Scan API - V2 Feature
 * 
 * PURPOSE: Scan Google Drive for shadow discovery (Tier 2 - Alert & Redirect)
 * DETECTION: Storage waste, external shares, stale files
 * STRATEGY: Identify leakage outside M365/Slack operational anchors
 * 
 * WORKFLOW:
 * 1. Retrieve Google access token
 * 2. Fetch Drive files and folders
 * 3. Identify external shares
 * 4. Detect stale files
 * 5. Store metadata (no content reading in V2)
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { decryptSecret, encryptSecret } from '../../_lib/encryption';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime: string;
  modifiedTime: string;
  owners: Array<{ displayName: string; emailAddress: string }>;
  shared: boolean;
  permissions?: Array<{ type: string; role: string; emailAddress?: string }>;
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json();
  return data.access_token;
}

async function fetchGoogleDriveFiles(accessToken: string): Promise<GoogleDriveFile[]> {
  const allFiles: GoogleDriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL('https://www.googleapis.com/drive/v3/files');
    url.searchParams.set('pageSize', '1000');
    url.searchParams.set('fields', 'nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, owners, shared, permissions)');
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const response = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    const data = await response.json();
    if (data.files) {
      allFiles.push(...data.files);
    }
    pageToken = data.nextPageToken;
  } while (pageToken);

  return allFiles;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tenantId, connectionId } = req.body;

    if (!tenantId || !connectionId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Retrieve Google connection
    const { data: connection } = await supabase
      .from('provider_connections')
      .select('*')
      .eq('id', connectionId)
      .eq('tenant_id', tenantId)
      .eq('provider', 'google')
      .single();

    if (!connection) {
      return res.status(404).json({ error: 'Google connection not found' });
    }

    // Check if token needs refresh
    let accessToken = decryptSecret(connection.access_token);
    if (!accessToken) {
      return res.status(500).json({ error: 'Google connection is missing an access token' });
    }

    if (new Date(connection.expires_at) < new Date()) {
      const refreshToken = decryptSecret(connection.refresh_token);
      if (!refreshToken) {
        return res.status(500).json({ error: 'Google connection is missing a refresh token' });
      }

      accessToken = await refreshAccessToken(refreshToken);
      
      // Update token in database
      await supabase
        .from('provider_connections')
        .update({
          access_token: encryptSecret(accessToken),
          expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        })
        .eq('id', connectionId);
    }

    // Fetch all Drive files
    const files = await fetchGoogleDriveFiles(accessToken);

    // Process files and categorize
    const now = Date.now();
    const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

    const artifacts = files.map((file) => {
      const lastModified = new Date(file.modifiedTime);
      const isStale = (now - lastModified.getTime()) > NINETY_DAYS_MS;

      // Detect external shares
      const hasExternalShare = file.permissions?.some(
        (p) => p.type === 'anyone' || (p.type === 'user' && !p.emailAddress?.endsWith(connection.workspace_id))
      ) || false;

      return {
        tenant_id: tenantId,
        provider: 'google',
        provider_id: file.id,
        name: file.name,
        enriched_name: file.name,
        artifact_type: file.mimeType.includes('folder') ? 'google_folder' : 'google_file',
        path: `/google-drive/${file.name}`,
        size_bytes: file.size ? parseInt(file.size, 10) : 0,
        mime_type: file.mimeType,
        owner: file.owners?.[0]?.emailAddress || 'Unknown',
        is_stale: isStale,
        has_external_share: hasExternalShare,
        exposure_level: hasExternalShare ? 'high' : 'low',
        last_modified: file.modifiedTime,
        metadata: {
          shared: file.shared,
          permissions_count: file.permissions?.length || 0,
          workspace_id: connection.workspace_id,
        },
        tags: [
          ...(isStale ? ['stale'] : []),
          ...(hasExternalShare ? ['external-share'] : []),
        ],
        created_at: new Date().toISOString(),
      };
    });

    // Insert all artifacts
    const { error: insertError } = await supabase
      .from('artifacts')
      .upsert(artifacts, { onConflict: 'tenant_id,provider,provider_id' });

    if (insertError) {
      console.error('Error inserting artifacts:', insertError);
      throw insertError;
    }

    // Update connection last_sync_at
    await supabase
      .from('provider_connections')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', connectionId);

    // Calculate shadow discovery statistics
    const staleFiles = artifacts.filter((a) => a.is_stale).length;
    const externalShares = artifacts.filter((a) => a.has_external_share).length;
    const totalStorageBytes = artifacts.reduce((sum, a) => sum + a.size_bytes, 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalFiles: files.length,
        staleFiles,
        externalShares,
        totalStorageBytes,
        totalStorageGB: (totalStorageBytes / 1024 / 1024 / 1024).toFixed(2),
        leakageWarning: externalShares > 0 || staleFiles > 10,
      },
      artifactsCreated: artifacts.length,
      message: 'Shadow discovery complete. Redirect to M365/Slack for primary management.',
    });
  } catch (error: any) {
    console.error('Google Drive scan error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
