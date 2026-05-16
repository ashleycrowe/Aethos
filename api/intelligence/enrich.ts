/**
 * AI Metadata Enrichment API Endpoint
 * 
 * PURPOSE: Use OpenAI to generate reviewable metadata suggestions
 * VERSION: V1.5+ (AI+ subscription tier)
 * 
 * V1.5 BOUNDARY: Suggestions are staged for review and do not write final
 * ai_* fields or Microsoft 365 metadata by default.
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { recordAiCreditUsage, verifyAiCreditsAvailable } from '../_lib/aiCredits.js';
import { requireApiContext, sendApiError, supabase } from '../_lib/apiAuth.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const OPENAI_ENRICHMENT_SOURCES = ['openai_enrich', 'openai_metadata_enrich', 'openai_content_enrich'];
const CONTENT_EXCERPT_LIMIT = 12_000;

type EnrichmentResult = {
  title?: unknown;
  tags?: unknown;
  category?: unknown;
  summary?: unknown;
  score?: unknown;
  confidence?: unknown;
  rationale?: unknown;
};

function cleanString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function cleanTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
    .map((tag) => tag.toLowerCase().trim().replace(/\s+/g, '-'))
    .slice(0, 8);
}

function cleanScore(value: unknown): number {
  const score = Number(value);
  if (!Number.isFinite(score)) return 50;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function confidenceFromScore(score: number): 'high' | 'medium' | 'low' {
  if (score >= 80) return 'high';
  if (score >= 55) return 'medium';
  return 'low';
}

async function getContentExcerpt(tenantId: string, fileId: string): Promise<string | null> {
  const { data: chunks, error } = await supabase
    .from('content_embeddings')
    .select('chunk_text,chunk_index')
    .eq('tenant_id', tenantId)
    .eq('file_id', fileId)
    .order('chunk_index', { ascending: true })
    .limit(8);

  if (error) {
    console.warn(`Unable to load content chunks for ${fileId}:`, error.message);
    return null;
  }

  const excerpt = (chunks || [])
    .map((chunk) => chunk.chunk_text)
    .filter((text): text is string => typeof text === 'string' && text.trim().length > 0)
    .join('\n\n')
    .trim()
    .slice(0, CONTENT_EXCERPT_LIMIT);

  return excerpt || null;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  const { tenantId } = context;
  const { fileIds, batchSize = 10 } = req.body;

  if (fileIds !== undefined && !Array.isArray(fileIds)) {
    return sendApiError(res, 400, 'fileIds must be an array when provided.', 'VALIDATION_ERROR');
  }

  if (!process.env.OPENAI_API_KEY) {
    return sendApiError(res, 503, 'AI+ metadata enrichment is not configured. Add OPENAI_API_KEY.', 'SERVER_NOT_CONFIGURED');
  }

  try {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('ai_features_enabled')
      .eq('id', tenantId)
      .single();

    if (!tenant?.ai_features_enabled) {
      return sendApiError(res, 403, 'AI+ features are not enabled for this tenant.', 'TENANT_INACTIVE', {
        action: 'Enable ai_features_enabled before generating AI+ metadata suggestions.',
      });
    }

    let filesToEnrich: any[];

    if (fileIds && fileIds.length > 0) {
      // Generate suggestions for specific files
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .in('id', fileIds)
        .eq('tenant_id', tenantId);

      if (error) {
        return sendApiError(res, 500, 'Unable to load files for AI+ metadata enrichment.', 'DATABASE_ERROR', error.message);
      }
      filesToEnrich = data || [];
    } else {
      // Generate suggestions for files that do not already have final AI metadata.
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('tenant_id', tenantId)
        .is('ai_enriched_at', null)
        .limit(batchSize);

      if (error) {
        return sendApiError(res, 500, 'Unable to load files for AI+ metadata enrichment.', 'DATABASE_ERROR', error.message);
      }
      filesToEnrich = data || [];
    }

    if (!filesToEnrich || filesToEnrich.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No files need metadata suggestions',
        suggestionsCreated: 0,
        enrichedCount: 0,
      });
    }

    const { data: existingPendingSuggestions, error: pendingError } = await supabase
      .from('metadata_suggestions')
      .select('file_id')
      .eq('tenant_id', tenantId)
      .eq('suggestion_type', 'content_enrichment')
      .in('source', OPENAI_ENRICHMENT_SOURCES)
      .eq('status', 'pending')
      .in('file_id', filesToEnrich.map((file) => file.id));

    if (pendingError) {
      return sendApiError(res, 500, 'Unable to check pending metadata suggestions.', 'DATABASE_ERROR', pendingError.message);
    }

    const pendingFileIds = new Set((existingPendingSuggestions || []).map((suggestion) => suggestion.file_id));
    filesToEnrich = filesToEnrich.filter((file) => !pendingFileIds.has(file.id));

    if (filesToEnrich.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Pending metadata suggestions already exist for the selected files',
        suggestionsCreated: 0,
        enrichedCount: 0,
        skippedPending: pendingFileIds.size,
      });
    }

    let suggestionsCreated = 0;
    const errors: any[] = [];

    for (const file of filesToEnrich) {
      try {
        // Build metadata-only context for AI. File bodies are not read here.
        const fileContext = {
          filename: file.name,
          path: file.path,
          size: file.size_bytes,
          extension: file.file_extension,
          owner: file.owner_name || file.owner_email,
          modified: file.modified_at,
          provider: file.provider_type,
        };
        const contentExcerpt = await getContentExcerpt(tenantId, file.id);
        const hasContentExcerpt = Boolean(contentExcerpt);
        const suggestionSource = hasContentExcerpt ? 'openai_content_enrich' : 'openai_metadata_enrich';
        const sourceSignals = hasContentExcerpt
          ? ['content chunks', 'filename', 'path', 'extension', 'owner', 'modified date', 'provider']
          : ['filename', 'path', 'extension', 'owner', 'modified date', 'provider'];

        // Call OpenAI to enrich metadata
        const prompt = `Analyze this file and provide reviewable metadata suggestions.

File: ${fileContext.filename}
Path: ${fileContext.path || 'Unknown'}
Type: ${fileContext.extension || 'Unknown'}
Size: ${formatBytes(fileContext.size)}
Owner: ${fileContext.owner || 'Unknown'}
Last Modified: ${fileContext.modified ? new Date(fileContext.modified).toLocaleDateString() : 'Unknown'}
Provider: ${fileContext.provider}
${hasContentExcerpt ? `
Document text excerpt:
${contentExcerpt}
` : `
Document text excerpt: Not available. Use metadata only and say so in the rationale.
`}

Provide:
1. A clean, human-readable title (without file extension)
2. 3-5 relevant descriptive tags (lowercase, single words)
3. A category from: Finance, Marketing, HR, Engineering, Legal, Operations, Sales, Product, Design, Other
4. A brief 1-sentence summary. If document text is unavailable, make it a metadata-based description and do not imply body content was read.
5. An intelligence score (0-100) based on how well-organized and named the file is
6. A confidence value: high, medium, or low
7. A concise rationale

Return JSON only with keys: title, tags, category, summary, score, confidence, rationale`;

        const creditCheck = await verifyAiCreditsAvailable({
          tenantId,
          requiredCredits: 2,
          actionType: 'metadata_suggestion',
        });

        if (!creditCheck.allowed) {
          errors.push({ fileId: file.id, error: creditCheck.message || 'Insufficient Intelligence Credits.' });
          break;
        }

        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You generate conservative enterprise metadata suggestions for human review. Be explicit when only metadata was available.',
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

        const result = JSON.parse(response.choices[0].message.content || '{}') as EnrichmentResult;
        const score = cleanScore(result.score);
        const confidence = cleanString(result.confidence);
        const normalizedConfidence = confidence === 'high' || confidence === 'medium' || confidence === 'low'
          ? confidence
          : confidenceFromScore(score);

        const suggestedValue = {
          title: cleanString(result.title),
          tags: cleanTags(result.tags),
          category: cleanString(result.category),
          summary: cleanString(result.summary),
          score,
        };

        const { error: insertError } = await supabase
          .from('metadata_suggestions')
          .insert({
            tenant_id: tenantId,
            file_id: file.id,
            suggestion_type: 'content_enrichment',
            status: 'pending',
            confidence: normalizedConfidence,
            source: suggestionSource,
            source_signals: sourceSignals,
            rationale: cleanString(result.rationale) || (hasContentExcerpt
              ? 'Generated from indexed content chunks for human review before applying final AI fields.'
              : 'Generated from metadata-only context for human review before applying final AI fields.'),
            suggested_value: suggestedValue,
            generated_by: context.userId || null,
            metadata: {
              review_first: true,
              source_system_writeback: false,
              writes_final_ai_fields: false,
              content_aware: hasContentExcerpt,
              prompt_context: hasContentExcerpt ? 'content_chunks' : 'metadata_only',
            },
          })
          .select('id')
          .single();

        if (insertError) {
          console.error(`Error staging metadata suggestion for ${file.id}:`, insertError);
          errors.push({ fileId: file.id, error: insertError.message });
        } else {
          await recordAiCreditUsage({
            tenantId,
            userId: context.userId,
            fileId: file.id,
            actionType: 'metadata_suggestion',
            creditCost: 2,
            model: 'gpt-4o-mini',
            inputTokens: response.usage?.prompt_tokens ?? null,
            outputTokens: response.usage?.completion_tokens ?? null,
            metadata: {
              contentAware: hasContentExcerpt,
              source: suggestionSource,
            },
          });
          suggestionsCreated++;
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
      suggestionsCreated,
      enrichedCount: 0,
      totalProcessed: filesToEnrich.length,
      reviewRequired: true,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('AI enrichment failed:', error);
    return sendApiError(res, 500, error.message || 'AI enrichment failed', 'INTERNAL_ERROR');
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i];
}
