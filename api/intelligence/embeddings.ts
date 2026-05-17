/**
 * Content Embeddings API - V1.5 AI+ Feature
 * 
 * PURPOSE: Extract content from documents and generate embeddings for semantic search
 * PROVIDER: OpenAI (text-embedding-3-small for cost optimization)
 * STORAGE: Supabase with pgvector extension
 * 
 * WORKFLOW:
 * 1. Extract text content from document (Word, Excel, PDF, PowerPoint)
 * 2. Chunk content into manageable pieces (500 tokens per chunk)
 * 3. Generate embeddings using OpenAI
 * 4. Store embeddings in Supabase with pgvector
 * 5. Enable semantic search queries
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { XMLParser } from 'fast-xml-parser';
import { recordAiCreditUsage, verifyAiCreditsAvailable } from '../_lib/aiCredits.js';
import { requireApiContext, sendApiError, supabase } from '../_lib/apiAuth.js';
import { graphFetch, isGraphConsentError } from '../_lib/microsoftGraph.js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_EXTRACTED_CHARS = 500_000;

async function downloadFile(
  fileUrl: string,
  accessToken?: string,
  tenantId?: string,
  requiredScope?: string
): Promise<Buffer> {
  const isGraphUrl = /^https:\/\/graph\.microsoft\.com\//i.test(fileUrl);
  const response = isGraphUrl
    ? await graphFetch(fileUrl, { accessToken, tenantId, requiredScope })
    : await fetch(fileUrl, accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined);

  if (!response.ok) {
    throw new Error(`Failed to download file content: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function getMicrosoftDriveId(fileRecord: any): string | null {
  return (
    fileRecord?.metadata?.parentReference?.driveId ||
    fileRecord?.raw_api_response?.parentReference?.driveId ||
    null
  );
}

async function resolveDownloadBuffer({
  fileRecord,
  fileUrl,
  accessToken,
  tenantId,
}: {
  fileRecord?: any;
  fileUrl?: string | null;
  accessToken?: string;
  tenantId?: string;
}): Promise<Buffer> {
  if (fileRecord?.provider === 'microsoft') {
    const driveId = getMicrosoftDriveId(fileRecord);
    if (!driveId || !fileRecord.provider_id) {
      throw new Error('Missing Microsoft drive metadata for content indexing');
    }

    return downloadFile(
      `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${fileRecord.provider_id}/content`,
      accessToken,
      tenantId,
      'Files.Read.All'
    );
  }

  if (!fileUrl) {
    throw new Error('Missing fileUrl for non-Microsoft content indexing');
  }

  return downloadFile(fileUrl);
}

function normalizeExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, MAX_EXTRACTED_CHARS);
}

function collectXmlText(value: unknown, output: string[]): void {
  if (typeof value === 'string') {
    const normalized = value.trim();
    if (normalized) output.push(normalized);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => collectXmlText(entry, output));
    return;
  }

  if (!value || typeof value !== 'object') return;

  for (const [key, nestedValue] of Object.entries(value)) {
    if (key === 'a:t' || key.endsWith(':t')) {
      collectXmlText(nestedValue, output);
    } else {
      collectXmlText(nestedValue, output);
    }
  }
}

async function extractPowerPointText(fileBuffer: Buffer): Promise<string> {
  const unzipper = await import('unzipper');
  const directory = await unzipper.Open.buffer(fileBuffer);
  const parser = new XMLParser({ ignoreAttributes: true });
  const textParts: string[] = [];

  const slideFiles = directory.files
    .filter((file) => /^ppt\/slides\/slide\d+\.xml$/.test(file.path))
    .sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }));

  for (const file of slideFiles) {
    const slideBuffer = await file.buffer();
    const parsed = parser.parse(slideBuffer.toString('utf8'));
    collectXmlText(parsed, textParts);
  }

  return normalizeExtractedText(textParts.join('\n'));
}

async function extractTextContent(fileBuffer: Buffer, mimeType: string): Promise<string> {
  const normalizedMimeType = (mimeType || '').toLowerCase();
  let extractedText = '';

  if (normalizedMimeType.includes('pdf')) {
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: fileBuffer });
    try {
      const data = await parser.getText();
      extractedText = data.text || '';
    } finally {
      await parser.destroy();
    }
  } else if (
    normalizedMimeType.includes('word') ||
    normalizedMimeType.includes('document') ||
    normalizedMimeType.includes('officedocument.wordprocessingml')
  ) {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    extractedText = result.value || '';
  } else if (
    normalizedMimeType.includes('spreadsheet') ||
    normalizedMimeType.includes('excel') ||
    normalizedMimeType.includes('officedocument.spreadsheetml')
  ) {
    const xlsx = await import('xlsx');
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    extractedText = workbook.SheetNames
      .map((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const sheetText = xlsx.utils.sheet_to_csv(sheet);
        return sheetText ? `Sheet: ${sheetName}\n${sheetText}` : '';
      })
      .filter(Boolean)
      .join('\n\n');
  } else if (
    normalizedMimeType.includes('presentation') ||
    normalizedMimeType.includes('powerpoint') ||
    normalizedMimeType.includes('officedocument.presentationml')
  ) {
    extractedText = await extractPowerPointText(fileBuffer);
  } else if (normalizedMimeType.startsWith('text/') || normalizedMimeType.includes('json')) {
    extractedText = fileBuffer.toString('utf8');
  } else {
    throw new Error(`Unsupported file type for content extraction: ${mimeType || 'unknown'}`);
  }

  const normalizedText = normalizeExtractedText(extractedText);
  if (!normalizedText) {
    throw new Error('No text content could be extracted from this file');
  }

  return normalizedText;
}

// Chunk text into smaller pieces for embedding
function chunkText(text: string, maxTokens: number = 500): string[] {
  // Rough tokenization: ~4 chars per token
  const maxChars = maxTokens * 4;
  const chunks: string[] = [];
  
  // Split by paragraphs first
  const paragraphs = text.split(/\n\n+/);
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    if ((currentChunk + paragraph).length > maxChars && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = paragraph;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

// Generate embeddings for a single text chunk
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small', // Cost-optimized model
    input: text,
  });
  
  return response.data[0].embedding;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  try {
    const { tenantId, accessToken, userId } = context;
    const { fileId, artifactId, fileUrl, mimeType } = req.body;
    const targetFileId = fileId || artifactId;

    if (!targetFileId) {
      return sendApiError(res, 400, 'Missing required fields', 'VALIDATION_ERROR', {
        required: ['fileId'],
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return sendApiError(res, 503, 'AI+ content indexing is not configured. Add OPENAI_API_KEY.', 'SERVER_NOT_CONFIGURED');
    }

    // Check if tenant has AI+ subscription
    const { data: tenant } = await supabase
      .from('tenants')
      .select('subscription_tier, ai_features_enabled')
      .eq('id', tenantId)
      .single();

    if (!tenant?.ai_features_enabled) {
      return sendApiError(res, 403, 'AI+ features are not enabled for this tenant.', 'TENANT_INACTIVE', {
        action: 'Enable ai_features_enabled for this tenant before indexing document content.',
      });
    }

    const { data: fileRecord, error: fileError } = await supabase
      .from('files')
      .select('id, provider, provider_id, url, mime_type, metadata, raw_api_response')
      .eq('tenant_id', tenantId)
      .eq('id', targetFileId)
      .single();

    if (fileError || !fileRecord) {
      return sendApiError(res, 404, 'File metadata was not found for content indexing.', 'RESOURCE_NOT_FOUND', {
        action: 'Run Microsoft Discovery before indexing file content.',
      });
    }

    // Extract text content from document
    const fileBuffer = await resolveDownloadBuffer({
      fileRecord,
      fileUrl: fileUrl || fileRecord.url,
      accessToken,
      tenantId,
    });
    const textContent = await extractTextContent(fileBuffer, mimeType || fileRecord.mime_type);

    // Chunk the content
    const chunks = chunkText(textContent);
    const indexingCreditCost = Math.max(1, chunks.length);

    const creditCheck = await verifyAiCreditsAvailable({
      tenantId,
      requiredCredits: indexingCreditCost,
      actionType: 'content_indexing',
    });

    if (!creditCheck.allowed) {
      return sendApiError(res, 402, creditCheck.message || 'Insufficient Intelligence Credits.', 'CREDIT_LIMIT_EXCEEDED', creditCheck);
    }

    const { error: deleteError } = await supabase
      .from('content_embeddings')
      .delete()
      .eq('tenant_id', tenantId)
      .eq('file_id', targetFileId);

    if (deleteError) {
      console.error('Error clearing existing embeddings:', deleteError);
      return sendApiError(res, 500, 'Unable to prepare file for re-indexing', 'DATABASE_ERROR', deleteError.message);
    }

    // Generate embeddings for each chunk
    const embeddingResults = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateEmbedding(chunk);

      // Store embedding in Supabase
      const { data, error } = await supabase
        .from('content_embeddings')
        .insert({
          tenant_id: tenantId,
          file_id: targetFileId,
          chunk_index: i,
          chunk_text: chunk,
          embedding: embedding, // pgvector column
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error storing embedding:', error);
        throw error;
      }

      embeddingResults.push(data);
    }

    // Update file to mark as indexed
    await supabase
      .from('files')
      .update({
        content_indexed: true,
        content_chunk_count: chunks.length,
        last_indexed_at: new Date().toISOString(),
      })
      .eq('id', targetFileId);

    await recordAiCreditUsage({
      tenantId,
      userId,
      fileId: targetFileId,
      actionType: 'content_indexing',
      creditCost: indexingCreditCost,
      model: 'text-embedding-3-small',
      metadata: {
        chunksProcessed: chunks.length,
        mimeType: mimeType || fileRecord.mime_type || null,
      },
    });

    return res.status(200).json({
      success: true,
      fileId: targetFileId,
      chunksProcessed: chunks.length,
      embeddings: embeddingResults,
    });
  } catch (error: any) {
    console.error('Error generating embeddings:', error);
    if (isGraphConsentError(error)) {
      return sendApiError(res, 403, error.message, 'GRAPH_CONSENT_REVOKED', error.details);
    }
    return sendApiError(res, 500, error.message || 'Internal server error', 'INTERNAL_ERROR');
  }
}
