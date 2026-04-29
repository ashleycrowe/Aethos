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
import { createClient } from '@supabase/supabase-js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '' // Service role for backend operations
);

// Content extraction helpers (simplified - in production use libraries like pdf-parse, mammoth, etc.)
async function extractTextContent(fileUrl: string, mimeType: string): Promise<string> {
  // In production, use appropriate libraries:
  // - pdf-parse for PDFs
  // - mammoth for Word docs
  // - xlsx for Excel
  // - node-unzipper for PowerPoint (extract XML)
  
  // For now, return placeholder
  return `[Content extraction would happen here for ${mimeType}]\n\nThis is sample text content that would be extracted from the document at ${fileUrl}.`;
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { artifactId, tenantId, fileUrl, mimeType } = req.body;

    if (!artifactId || !tenantId || !fileUrl) {
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
          artifact_id: artifactId,
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

    // Update artifact to mark as indexed
    await supabase
      .from('artifacts')
      .update({
        content_indexed: true,
        content_chunk_count: chunks.length,
        last_indexed_at: new Date().toISOString(),
      })
      .eq('id', artifactId);

    return res.status(200).json({
      success: true,
      artifactId,
      chunksProcessed: chunks.length,
      embeddings: embeddingResults,
    });
  } catch (error: any) {
    console.error('Error generating embeddings:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
