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
import { requireApiContext, supabase } from '../_lib/apiAuth.js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type PdfParse = (buffer: Buffer) => Promise<{ text?: string }>;

const MAX_EXTRACTED_CHARS = 500_000;

async function downloadFile(fileUrl: string): Promise<Buffer> {
  const response = await fetch(fileUrl);

  if (!response.ok) {
    throw new Error(`Failed to download file content: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
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

async function extractTextContent(fileUrl: string, mimeType: string): Promise<string> {
  const normalizedMimeType = (mimeType || '').toLowerCase();
  const fileBuffer = await downloadFile(fileUrl);
  let extractedText = '';

  if (normalizedMimeType.includes('pdf')) {
    const pdfParseModule = await import('pdf-parse');
    const pdfParse = ('default' in pdfParseModule ? pdfParseModule.default : pdfParseModule) as PdfParse;
    const data = await pdfParse(fileBuffer);
    extractedText = data.text || '';
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
    const { tenantId } = context;
    const { fileId, artifactId, fileUrl, mimeType } = req.body;
    const targetFileId = fileId || artifactId;

    if (!targetFileId || !fileUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if tenant has AI+ subscription
    const { data: tenant } = await supabase
      .from('tenants')
      .select('subscription_tier, ai_features_enabled')
      .eq('id', tenantId)
      .single();

    if (!tenant?.ai_features_enabled) {
      return res.status(403).json({ error: 'AI+ features not enabled for this tenant' });
    }

    // Extract text content from document
    const textContent = await extractTextContent(fileUrl, mimeType);

    // Chunk the content
    const chunks = chunkText(textContent);

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

    return res.status(200).json({
      success: true,
      fileId: targetFileId,
      chunksProcessed: chunks.length,
      embeddings: embeddingResults,
    });
  } catch (error: any) {
    console.error('Error generating embeddings:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
