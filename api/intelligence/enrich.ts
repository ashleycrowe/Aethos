/**
 * AI Metadata Enrichment API Endpoint
 * 
 * PURPOSE: Use OpenAI to enrich file metadata with tags, categories, and better titles
 * VERSION: V1.5+ (AI+ subscription tier)
 * 
 * This is the "Content Oracle" - the AI that makes sense of poor enterprise metadata
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tenantId, fileIds, batchSize = 10 } = req.body;

  if (!tenantId) {
    return res.status(400).json({ error: 'Missing tenant ID' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ 
      error: 'AI enrichment not configured. Add OPENAI_API_KEY to environment variables.' 
    });
  }

  try {
    let filesToEnrich;

    if (fileIds && fileIds.length > 0) {
      // Enrich specific files
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .in('id', fileIds)
        .eq('tenant_id', tenantId);

      if (error) throw error;
      filesToEnrich = data;
    } else {
      // Enrich files that haven't been enriched yet (batch processing)
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('tenant_id', tenantId)
        .is('ai_enriched_at', null)
        .limit(batchSize);

      if (error) throw error;
      filesToEnrich = data;
    }

    if (!filesToEnrich || filesToEnrich.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No files to enrich',
        enrichedCount: 0,
      });
    }

    let enrichedCount = 0;
    const errors: any[] = [];

    for (const file of filesToEnrich) {
      try {
        // Build context for AI
        const context = {
          filename: file.name,
          path: file.path,
          size: file.size_bytes,
          extension: file.file_extension,
          owner: file.owner_name || file.owner_email,
          modified: file.modified_at,
          provider: file.provider_type,
        };

        // Call OpenAI to enrich metadata
        const prompt = `Analyze this file and provide enriched metadata:

File: ${context.filename}
Path: ${context.path || 'Unknown'}
Type: ${context.extension || 'Unknown'}
Size: ${formatBytes(context.size)}
Owner: ${context.owner || 'Unknown'}
Last Modified: ${new Date(context.modified).toLocaleDateString()}
Provider: ${context.provider}

Provide:
1. A clean, human-readable title (without file extension)
2. 3-5 relevant descriptive tags (lowercase, single words)
3. A category from: Finance, Marketing, HR, Engineering, Legal, Operations, Sales, Product, Design, Other
4. A brief 1-sentence summary
5. An intelligence score (0-100) based on how well-organized and named the file is

Return JSON only with keys: title, tags, category, summary, score`;

        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant that enriches enterprise file metadata to improve organizational clarity.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 300,
        });

        const result = JSON.parse(response.choices[0].message.content || '{}');

        // Update file in database
        const { error: updateError } = await supabase
          .from('files')
          .update({
            ai_suggested_title: result.title,
            ai_tags: result.tags || [],
            ai_category: result.category,
            ai_summary: result.summary,
            intelligence_score: result.score || 50,
            ai_enriched_at: new Date().toISOString(),
          })
          .eq('id', file.id);

        if (updateError) {
          console.error(`Error updating file ${file.id}:`, updateError);
          errors.push({ fileId: file.id, error: updateError.message });
        } else {
          enrichedCount++;
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error: any) {
        console.error(`Error enriching file ${file.id}:`, error);
        errors.push({ fileId: file.id, error: error.message });
      }
    }

    res.status(200).json({
      success: true,
      enrichedCount,
      totalProcessed: filesToEnrich.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('AI enrichment failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i];
}
