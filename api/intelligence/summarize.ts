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
import { requireApiContext, supabase } from '../_lib/apiAuth';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  try {
    const { tenantId } = context;
    const { fileId, artifactId, summaryType = 'concise' } = req.body;
    const targetFileId = fileId || artifactId;

    if (!targetFileId) {
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
      return res.status(404).json({ error: 'No content found for this file' });
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
    const keyPointsMatch = summaryText.match(/[-•]\s(.+?)(?=\n[-•]|\n\n|$)/g);
    const keyPoints = keyPointsMatch
      ? keyPointsMatch.map((p) => p.replace(/^[-•]\s/, '').trim())
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

    return res.status(200).json({
      success: true,
      summary: summaryText,
      keyPoints,
      cached: false,
    });
  } catch (error: any) {
    console.error('Error generating summary:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
