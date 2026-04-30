/**
 * Google Workspace OAuth Connection API - V2 Feature
 * 
 * PURPOSE: Connect Google Workspace for shadow discovery (Tier 2 Provider)
 * OAUTH: Google OAuth 2.0 flow
 * SCOPE: drive.readonly, drive.metadata.readonly
 * USE CASE: Detect storage waste and external shares (no full management)
 * 
 * WORKFLOW:
 * 1. Redirect user to Google OAuth page
 * 2. User authorizes Aethos
 * 3. Receive OAuth callback with code
 * 4. Exchange code for access token
 * 5. Store token securely in Supabase
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { encryptSecret } from '../../_lib/encryption';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://app.aethos.com/api/providers/google/callback';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Initiate OAuth flow
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({ error: 'Missing tenantId' });
    }

    const state = Buffer.from(JSON.stringify({ tenantId })).toString('base64');

    const scopes = [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/drive.metadata.readonly',
    ];

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes.join(' '))}&state=${state}&access_type=offline&prompt=consent`;

    return res.redirect(googleAuthUrl);
  }

  if (req.method === 'POST') {
    // Handle OAuth callback
    try {
      const { code, tenantId } = req.body;

      if (!code || !tenantId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Exchange code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID!,
          client_secret: GOOGLE_CLIENT_SECRET!,
          code,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        return res.status(400).json({ error: tokenData.error });
      }

      // Get user info
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      const userInfo = await userInfoResponse.json();

      // Store Google Workspace connection in Supabase
      const { data, error } = await supabase
        .from('provider_connections')
        .insert({
          tenant_id: tenantId,
          provider: 'google',
          workspace_id: userInfo.email.split('@')[1], // Domain as workspace ID
          workspace_name: `Google Workspace (${userInfo.email})`,
          access_token: encryptSecret(tokenData.access_token),
          refresh_token: encryptSecret(tokenData.refresh_token),
          expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
          scope: tokenData.scope,
          connected_at: new Date().toISOString(),
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        console.error('Error storing Google connection:', error);
        throw error;
      }

      // Trigger initial discovery scan
      await fetch(`${process.env.API_BASE_URL}/api/providers/google/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, connectionId: data.id }),
      });

      return res.status(200).json({
        success: true,
        connection: data,
        message: 'Google Workspace connected successfully',
      });
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
