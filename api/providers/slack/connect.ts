/**
 * Slack OAuth Connection API - V2 Feature
 * 
 * PURPOSE: Connect Slack workspace to Aethos for discovery and workspace aggregation
 * OAUTH: Slack OAuth 2.0 flow
 * PERMISSIONS: channels:read, files:read, users:read, search:read
 * 
 * WORKFLOW:
 * 1. Redirect user to Slack OAuth page
 * 2. User authorizes Aethos
 * 3. Receive OAuth callback with code
 * 4. Exchange code for access token
 * 5. Store token securely in Supabase
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID;
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;
const REDIRECT_URI = process.env.SLACK_REDIRECT_URI || 'https://app.aethos.com/api/providers/slack/callback';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Initiate OAuth flow
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({ error: 'Missing tenantId' });
    }

    const state = Buffer.from(JSON.stringify({ tenantId })).toString('base64');

    const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=channels:read,files:read,users:read,search:read,channels:history&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}`;

    return res.redirect(slackAuthUrl);
  }

  if (req.method === 'POST') {
    // Handle OAuth callback manually (if not using redirect)
    try {
      const { code, tenantId } = req.body;

      if (!code || !tenantId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Exchange code for access token
      const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: SLACK_CLIENT_ID!,
          client_secret: SLACK_CLIENT_SECRET!,
          code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenData.ok) {
        return res.status(400).json({ error: tokenData.error });
      }

      // Store Slack connection in Supabase
      const { data, error } = await supabase
        .from('provider_connections')
        .insert({
          tenant_id: tenantId,
          provider: 'slack',
          workspace_id: tokenData.team.id,
          workspace_name: tokenData.team.name,
          access_token: tokenData.access_token, // Should be encrypted in production
          bot_user_id: tokenData.bot_user_id,
          scope: tokenData.scope,
          connected_at: new Date().toISOString(),
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        console.error('Error storing Slack connection:', error);
        throw error;
      }

      // Trigger initial discovery scan
      await fetch(`${process.env.API_BASE_URL}/api/providers/slack/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, connectionId: data.id }),
      });

      return res.status(200).json({
        success: true,
        connection: data,
        message: 'Slack workspace connected successfully',
      });
    } catch (error: any) {
      console.error('Slack OAuth error:', error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
