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
 * 3. Return relevant content chunks with source files
 * 4. Rank by relevance score
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { recordAiCreditUsage, verifyAiCreditsAvailable } from '../_lib/aiCredits.js';
import { requireApiContext, sendApiError, supabase } from '../_lib/apiAuth.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  try {
    const { tenantId, userId } = context;
    const { query, limit = 10, threshold = 0.7 } = req.body;

    if (!query) {
      return sendApiError(res, 400, 'Missing required fields', 'VALIDATION_ERROR', {
        required: ['query'],
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return sendApiError(res, 503, 'AI+ semantic search is not configured. Add OPENAI_API_KEY.', 'SERVER_NOT_CONFIGURED');
    }

    // Check if tenant has AI+ subscription
    const { data: tenant } = await supabase
      .from('tenants')
      .select('ai_features_enabled')
      .eq('id', tenantId)
      .single();

    if (!tenant?.ai_features_enabled) {
      return sendApiError(res, 403, 'AI+ features are not enabled for this tenant.', 'TENANT_INACTIVE', {
        action: 'Enable ai_features_enabled for this tenant before using content search.',
      });
    }

    const creditCheck = await verifyAiCreditsAvailable({
      tenantId,
      requiredCredits: 1,
      actionType: 'semantic_search',
    });

    if (!creditCheck.allowed) {
      return sendApiError(res, 402, creditCheck.message || 'Insufficient Intelligence Credits.', 'CREDIT_LIMIT_EXCEEDED', creditCheck);
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
      return sendApiError(res, 500, 'Semantic search failed', 'DATABASE_ERROR', error.message);
    }

    await recordAiCreditUsage({
      tenantId,
      userId,
      actionType: 'semantic_search',
      creditCost: 1,
      model: 'text-embedding-3-small',
      inputTokens: queryEmbedding.usage?.total_tokens ?? null,
      metadata: {
        resultCount: results?.length || 0,
        threshold,
        limit,
      },
    });

    if (!results || results.length === 0) {
      return res.status(200).json({
        success: true,
        query,
        results: [],
        count: 0,
      });
    }

    // Enrich results with file metadata
    const fileIds = [...new Set(results.map((r: any) => r.file_id))];
    
    const { data: files } = await supabase
      .from('files')
      .select('id, name, ai_suggested_title, path, owner_email, provider, ai_tags, modified_at')
      .in('id', fileIds)
      .eq('tenant_id', tenantId);

    // Combine results with file metadata
    const enrichedResults = results.map((result: any) => {
      const file = files?.find((a) => a.id === result.file_id);
      return {
        ...result,
        file,
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
    return sendApiError(res, 500, error.message || 'Internal server error', 'INTERNAL_ERROR');
  }
}
