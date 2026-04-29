/**
 * Public REST API - Artifacts Endpoint - V4 Feature
 * 
 * PURPOSE: Public API for third-party integrations
 * AUTHENTICATION: OAuth 2.0 bearer tokens
 * RATE LIMITING: 10,000 calls/month base, usage-based overage
 * 
 * ENDPOINTS:
 * GET /api/public/v1/artifacts - List artifacts
 * GET /api/public/v1/artifacts/:id - Get artifact details
 * POST /api/public/v1/artifacts/search - Search artifacts
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Verify API token and check rate limits
async function verifyApiToken(token: string): Promise<{ tenantId: string; rateLimitOk: boolean } | null> {
  const { data: apiKey } = await supabase
    .from('api_keys')
    .select('*, tenant:tenants!tenant_id(*)')
    .eq('key_hash', token) // In production, hash the token
    .eq('status', 'active')
    .single();

  if (!apiKey) {
    return null;
  }

  // Check rate limit
  const { data: usage } = await supabase
    .from('api_usage')
    .select('calls_this_month')
    .eq('api_key_id', apiKey.id)
    .gte('month', new Date().toISOString().substring(0, 7)) // Current month (YYYY-MM)
    .single();

  const callsThisMonth = usage?.calls_this_month || 0;
  const rateLimitOk = callsThisMonth < apiKey.monthly_limit;

  // Increment usage counter
  if (rateLimitOk) {
    await supabase.rpc('increment_api_usage', {
      api_key_id_param: apiKey.id,
      month_param: new Date().toISOString().substring(0, 7),
    });
  }

  return {
    tenantId: apiKey.tenant_id,
    rateLimitOk,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Extract API token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);

    // Verify token and check rate limits
    const auth = await verifyApiToken(token);
    if (!auth) {
      return res.status(401).json({ error: 'Invalid API token' });
    }

    if (!auth.rateLimitOk) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    const { tenantId } = auth;

    // Handle different HTTP methods
    if (req.method === 'GET') {
      // List artifacts or get single artifact
      const { id } = req.query;

      if (id) {
        // Get single artifact
        const { data: artifact, error } = await supabase
          .from('artifacts')
          .select('*')
          .eq('id', id)
          .eq('tenant_id', tenantId)
          .single();

        if (error || !artifact) {
          return res.status(404).json({ error: 'Artifact not found' });
        }

        return res.status(200).json({ artifact });
      } else {
        // List artifacts with pagination
        const { limit = 100, offset = 0, provider, tags } = req.query;

        let query = supabase
          .from('artifacts')
          .select('*', { count: 'exact' })
          .eq('tenant_id', tenantId);

        if (provider) {
          query = query.eq('provider', provider);
        }

        if (tags) {
          const tagArray = (tags as string).split(',');
          query = query.contains('tags', tagArray);
        }

        const { data: artifacts, error, count } = await query
          .range(Number(offset), Number(offset) + Number(limit) - 1)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        return res.status(200).json({
          artifacts,
          pagination: {
            total: count || 0,
            limit: Number(limit),
            offset: Number(offset),
          },
        });
      }
    }

    if (req.method === 'POST') {
      // Search artifacts
      const { query, filters = {}, limit = 50 } = req.body;

      if (!query) {
        return res.status(400).json({ error: 'Missing search query' });
      }

      let searchQuery = supabase
        .from('artifacts')
        .select('*')
        .eq('tenant_id', tenantId)
        .or(`name.ilike.%${query}%,enriched_name.ilike.%${query}%`);

      if (filters.provider) {
        searchQuery = searchQuery.eq('provider', filters.provider);
      }

      if (filters.tags && filters.tags.length > 0) {
        searchQuery = searchQuery.contains('tags', filters.tags);
      }

      const { data: results, error } = await searchQuery.limit(limit);

      if (error) {
        throw error;
      }

      return res.status(200).json({
        results,
        count: results?.length || 0,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Public API error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
