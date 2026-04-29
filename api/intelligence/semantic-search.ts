/**
 * Semantic Search API - V1.5 AI+ Feature
 * 
 * PURPOSE: Perform semantic search using vector similarity
 * ALGORITHM: Cosine similarity on embeddings
 * PROVIDER: Supabase pgvector extension
 * 
 * WORKFLOW:
 * 1. Convert user query to embedding
 * 2. Search for similar embeddings using pgvector
 * 3. Return relevant content chunks with source artifacts
 * 4. Rank by relevance score
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, tenantId, limit = 10, threshold = 0.7 } = req.body;

    if (!query || !tenantId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if tenant has AI+ subscription
    const { data: tenant } = await supabase
      .from('tenants')
      .select('ai_features_enabled')
      .eq('id', tenantId)
      .single();

    if (!tenant?.ai_features_enabled) {
      return res.status(403).json({ error: 'AI+ features not enabled for this tenant' });
    }

    // Generate embedding for the search query
    const queryEmbedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });

    const embedding = queryEmbedding.data[0].embedding;

    // Perform vector similarity search using pgvector
    // Note: This uses Supabase's pgvector extension with cosine similarity
    const { data: results, error } = await supabase.rpc('semantic_search', {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit,
      tenant_id_filter: tenantId,
    });

    if (error) {
      console.error('Semantic search error:', error);
      throw error;
    }

    // Enrich results with artifact metadata
    const artifactIds = [...new Set(results.map((r: any) => r.artifact_id))];
    
    const { data: artifacts } = await supabase
      .from('artifacts')
      .select('id, name, enriched_name, path, owner, provider, tags, last_modified')
      .in('id', artifactIds)
      .eq('tenant_id', tenantId);

    // Combine results with artifact metadata
    const enrichedResults = results.map((result: any) => {
      const artifact = artifacts?.find((a) => a.id === result.artifact_id);
      return {
        ...result,
        artifact,
      };
    });

    return res.status(200).json({
      success: true,
      query,
      results: enrichedResults,
      count: enrichedResults.length,
    });
  } catch (error: any) {
    console.error('Error in semantic search:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
