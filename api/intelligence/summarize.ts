/**
 * Content Summarization API - V1.5 AI+ Feature
 * 
 * PURPOSE: Generate AI summaries of documents
 * PROVIDER: OpenAI GPT-4o-mini (cost-optimized)
 * USE CASE: "Summarize this 40-page proposal"
 * 
 * WORKFLOW:
 * 1. Retrieve content chunks from embeddings table
 * 2. Send to GPT-4o-mini with summarization prompt
 * 3. Return concise summary with key points
 * 4. Cache summary for 24 hours
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
    const { fileId, artifactId, summaryType = 'concise' } = req.body;
    const targetFileId = fileId || artifactId;

    if (!targetFileId) {
      return sendApiError(res, 400, 'Missing required fields', 'VALIDATION_ERROR', {
        required: ['fileId'],
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return sendApiError(res, 503, 'AI+ summarization is not configured. Add OPENAI_API_KEY.', 'SERVER_NOT_CONFIGURED');
    }

    // Check if tenant has AI+ subscription
    const { data: tenant } = await supabase
      .from('tenants')
      .select('ai_features_enabled')
      .eq('id', tenantId)
      .single();

    if (!tenant?.ai_features_enabled) {
      return sendApiError(res, 403, 'AI+ features are not enabled for this tenant.', 'TENANT_INACTIVE', {
        action: 'Enable ai_features_enabled for this tenant before summarizing content.',
      });
    }

    // Check for cached summary
    const { data: cachedSummary } = await supabase
      .from('content_summaries')
      .select('*')
      .eq('file_id', targetFileId)
      .eq('summary_type', summaryType)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // 24 hours
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (cachedSummary) {
      await recordAiCreditUsage({
        tenantId,
        userId,
        fileId: targetFileId,
        actionType: 'summarize_document',
        creditCost: 0,
        cached: true,
        status: 'succeeded',
        metadata: {
          summaryType,
          cacheAge: cachedSummary.created_at,
        },
      });

      return res.status(200).json({
        success: true,
        summary: cachedSummary.summary,
        keyPoints: cachedSummary.key_points,
        cached: true,
      });
    }

    // Retrieve content chunks
    const { data: chunks } = await supabase
      .from('content_embeddings')
      .select('chunk_text, chunk_index')
      .eq('file_id', targetFileId)
      .eq('tenant_id', tenantId)
      .order('chunk_index', { ascending: true });

    if (!chunks || chunks.length === 0) {
      return sendApiError(res, 404, 'No indexed content found for this file.', 'RESOURCE_NOT_FOUND', {
        action: 'Run AI+ content indexing before requesting a summary.',
      });
    }

    const summaryCreditCost = summaryType === 'concise' ? 5 : 20;
    const creditCheck = await verifyAiCreditsAvailable({
      tenantId,
      requiredCredits: summaryCreditCost,
      actionType: 'summarize_document',
    });

    if (!creditCheck.allowed) {
      return sendApiError(res, 402, creditCheck.message || 'Insufficient Intelligence Credits.', 'CREDIT_LIMIT_EXCEEDED', creditCheck);
    }

    // Combine chunks
    const fullText = chunks.map((c) => c.chunk_text).join('\n\n');

    // Generate summary using GPT-4o-mini
    const systemPrompt =
      summaryType === 'concise'
        ? 'You are a helpful assistant that creates concise summaries of documents. Provide a 2-3 paragraph summary and 3-5 key bullet points.'
        : 'You are a helpful assistant that creates detailed summaries of documents. Provide a comprehensive summary with key sections, findings, and recommendations.';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Please summarize the following document:\n\n${fullText.substring(0, 12000)}`, // Limit to ~3K tokens
        },
      ],
      temperature: 0.3,
    });

    const summaryText = completion.choices[0].message.content || '';

    // Extract key points (simple heuristic - look for bullet points or numbered lists)
    const keyPointsMatch = summaryText.match(/[-*]\s(.+?)(?=\n[-*]|\n\n|$)/g);
    const keyPoints = keyPointsMatch
      ? keyPointsMatch.map((p) => p.replace(/^[-*]\s/, '').trim())
      : [];

    // Store summary in cache
    await supabase.from('content_summaries').insert({
      tenant_id: tenantId,
      file_id: targetFileId,
      summary_type: summaryType,
      summary: summaryText,
      key_points: keyPoints,
      created_at: new Date().toISOString(),
    });

    await recordAiCreditUsage({
      tenantId,
      userId,
      fileId: targetFileId,
      actionType: 'summarize_document',
      creditCost: summaryCreditCost,
      model: 'gpt-4o-mini',
      inputTokens: completion.usage?.prompt_tokens ?? null,
      outputTokens: completion.usage?.completion_tokens ?? null,
      metadata: {
        summaryType,
      },
    });

    return res.status(200).json({
      success: true,
      summary: summaryText,
      keyPoints,
      cached: false,
    });
  } catch (error: any) {
    console.error('Error generating summary:', error);
    return sendApiError(res, 500, error.message || 'Internal server error', 'INTERNAL_ERROR');
  }
}
