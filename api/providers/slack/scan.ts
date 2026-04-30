/**
 * Slack Discovery Scan API - V2 Feature
 * 
 * PURPOSE: Scan Slack workspace for channels, messages, and files
 * INGESTION: Metadata-only (channel names, message count, file metadata)
 * AI+: If enabled, index message content for semantic search
 * 
 * WORKFLOW:
 * 1. Retrieve Slack access token
 * 2. Fetch channels list
 * 3. Fetch file attachments
 * 4. Detect inactive channels (90+ days no activity)
 * 5. Store metadata in files table
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { decryptSecret } from '../../_lib/encryption';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface SlackChannel {
  id: string;
  name: string;
  is_archived: boolean;
  num_members: number;
  created: number;
  updated?: number;
}

interface SlackFile {
  id: string;
  name: string;
  size: number;
  created: number;
  user: string;
  mimetype: string;
  url_private: string;
  channels?: string[];
}

async function fetchSlackChannels(accessToken: string): Promise<SlackChannel[]> {
  const response = await fetch('https://slack.com/api/conversations.list?types=public_channel,private_channel', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data.ok ? data.channels : [];
}

async function fetchSlackFiles(accessToken: string): Promise<SlackFile[]> {
  const response = await fetch('https://slack.com/api/files.list?count=1000', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data.ok ? data.files : [];
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

    // Retrieve Slack connection
    const { data: connection } = await supabase
      .from('provider_connections')
      .select('*')
      .eq('id', connectionId)
      .eq('tenant_id', tenantId)
      .eq('provider', 'slack')
      .single();

    if (!connection) {
      return res.status(404).json({ error: 'Slack connection not found' });
    }

    const accessToken = decryptSecret(connection.access_token);
    if (!accessToken) {
      return res.status(500).json({ error: 'Slack connection is missing an access token' });
    }

    // Fetch channels
    const channels = await fetchSlackChannels(accessToken);

    // Fetch files
    const files = await fetchSlackFiles(accessToken);

    // Process channels and store as files
    const now = Date.now();
    const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

    const channelFiles = channels.map((channel) => {
      const lastActivity = channel.updated || channel.created;
      const isStale = (now - lastActivity * 1000) > NINETY_DAYS_MS;

      return {
        tenant_id: tenantId,
        provider: 'slack',
        provider_id: channel.id,
        provider_type: 'slack_channel',
        name: `#${channel.name}`,
        ai_suggested_title: `Slack Channel: ${channel.name}`,
        path: `/slack/${connection.workspace_name}/${channel.name}`,
        size_bytes: 0, // Channels don't have size
        is_stale: isStale,
        modified_at: new Date(lastActivity * 1000).toISOString(),
        metadata: {
          is_archived: channel.is_archived,
          num_members: channel.num_members,
          workspace_id: connection.workspace_id,
        },
        ai_tags: channel.is_archived ? ['archived'] : [],
        created_at: new Date().toISOString(),
      };
    });

    // Process files and store as files
    const indexedSlackFiles = files.map((file) => ({
      tenant_id: tenantId,
      provider: 'slack',
      provider_id: file.id,
      provider_type: 'slack_file',
      name: file.name,
      ai_suggested_title: file.name,
      path: `/slack/${connection.workspace_name}/files/${file.name}`,
      size_bytes: file.size,
      mime_type: file.mimetype,
      owner_email: file.user,
      modified_at: new Date(file.created * 1000).toISOString(),
      metadata: {
        url: file.url_private,
        channels: file.channels || [],
        workspace_id: connection.workspace_id,
      },
      created_at: new Date().toISOString(),
    }));

    // Insert all files into database
    const allFiles = [...channelFiles, ...indexedSlackFiles];

    const { error: insertError } = await supabase
      .from('files')
      .upsert(allFiles, { onConflict: 'tenant_id,provider,provider_id' });

    if (insertError) {
      console.error('Error inserting files:', insertError);
      throw insertError;
    }

    // Update connection last_sync_at
    await supabase
      .from('provider_connections')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', connectionId);

    // Calculate statistics
    const inactiveChannels = channelFiles.filter((c) => c.is_stale).length;
    const totalStorageBytes = indexedSlackFiles.reduce((sum, f) => sum + f.size_bytes, 0);

    return res.status(200).json({
      success: true,
      stats: {
        channels: channels.length,
        inactiveChannels,
        files: files.length,
        totalStorageBytes,
        totalStorageGB: (totalStorageBytes / 1024 / 1024 / 1024).toFixed(2),
      },
      filesIndexed: allFiles.length,
    });
  } catch (error: any) {
    console.error('Slack scan error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
