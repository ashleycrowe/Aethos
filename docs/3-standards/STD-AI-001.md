---
status: Active
type: Core Strategic Standard
phase: All Phases
audience: [Architecture, AI Engineers, Developers]
working_group: [Technical, AI Strategy]
priority: High
last_updated: 2026-02-27
location: /docs/3-standards/
tags: [ai, openai, content-reading, metadata-enrichment, oracle]
document_id: STD-AI-001
---

<!--
📌 CORE STRATEGIC DOCUMENT - AI MAINTENANCE INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  DO NOT DELETE - Source of truth for Aethos AI integration
🔄 KEEP UPDATED - Update when AI features or pricing tiers change
📋 WHAT TO UPDATE:
   - AI+ tier features (content reading, semantic search)
   - OpenAI model versions and parameters
   - Metadata enrichment patterns
   - Privacy/sanitization rules
🚫 WHAT NOT TO CHANGE:
   - Metadata-first philosophy (Base tier)
   - Privacy/security guardrails
   - Tiered pricing strategy ($499 Base / $698 AI+)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-->

# [STANDARD] Aethos AI & Intelligence Integration Standards
## Tiered AI Strategy: Metadata Intelligence (Base) + Content Reading (AI+)

**Version:** 2.0  
**Date:** February 27, 2026  
**Status:** 🟢 ACTIVE  
**Owner:** AI Strategy & Engineering Team  
**Description:** AI integration patterns for the tiered Aethos intelligence layer: Base tier (metadata-only) and AI+ tier (content reading).  
**Authority:** MANDATORY  
**Document ID:** STD-AI-001

---

## 🤖 The Aethos AI Philosophy

**Tiered Intelligence Strategy:**
- **Base Tier ($499/mo):** Metadata-only enrichment using pattern matching and heuristics
- **AI+ Tier ($698/mo):** Content reading with OpenAI for semantic search and document analysis

**Core Principle:** AI enhances operational clarity without compromising privacy or performance.

---

## 🚨 MANDATORY CRITICAL RULES

1. ✅ **TIERED FEATURE GATING** - Content reading features MUST check `user.canReadFileContent` permission (AI+ tier only)

2. ✅ **METADATA-FIRST INFERENCE** - Base tier intelligence uses ONLY metadata (file names, paths, tags, activity logs). No file content access.

3. ✅ **AZURE OPENAI PRIMACY** - All AI features must use Azure OpenAI (not public OpenAI) for data residency and Microsoft AppSource compliance

4. ✅ **PRIVACY GUARDRAILS** - PII sanitization required before ANY AI processing (both tiers)

5. ✅ **HALLUCINATION PREVENTION** - AI-generated insights must be labeled as "AI Suggested" with confidence scores

6. ✅ **PROMPT INJECTION DEFENSE** - User inputs sanitized for malicious prompts before LLM calls

7. ✅ **TRANSPARENT PRICING** - AI features must clearly indicate they require AI+ tier

---

## 🎯 PART 1: BASE TIER - METADATA INTELLIGENCE

**Available to:** All customers ($499/mo Base tier)  
**Philosophy:** Rich intelligence without content reading

### 1.1 Metadata Enrichment Patterns

**File Name Analysis:**
```typescript
// Pattern matching for common naming conventions
function enrichFileMetadata(asset: Asset): EnrichedMetadata {
  const { name, path } = asset;
  
  // Extract semantic tags from filename
  const tags = extractTagsFromFilename(name);
  // Q1-2026-Marketing-Plan.pdf → ['q1-2026', 'marketing', 'plan']
  
  // Classify document type
  const category = classifyByExtension(name);
  // .pdf → 'document', .xlsx → 'spreadsheet'
  
  // Detect version/status indicators
  const status = detectStatus(name);
  // 'DRAFT', 'FINAL', 'v2.1' patterns
  
  return {
    enrichedTags: tags,
    enrichedTitle: generateTitle(name),
    category,
    status,
    intelligenceScore: calculateScore(asset, tags),
  };
}
```

**Location-Based Intelligence:**
```typescript
// Derive context from SharePoint path
function analyzeLocation(path: string): LocationIntelligence {
  // /Marketing/Campaigns/Q1/ → team: 'Marketing', project: 'Campaigns'
  const pathSegments = path.split('/').filter(Boolean);
  
  return {
    team: pathSegments[0],
    project: pathSegments[1],
    phase: pathSegments[2],
    suggestedTags: pathSegments.map(s => s.toLowerCase()),
  };
}
```

**Activity-Based Scoring:**
```typescript
// Calculate intelligence score from metadata only
function calculateIntelligenceScore(asset: Asset): number {
  let score = 50; // baseline
  
  // Recency bonus
  const daysSinceModified = daysBetween(asset.modifiedDate, now());
  if (daysSinceModified < 30) score += 20;
  else if (daysSinceModified > 365) score -= 30;
  
  // Engagement bonus
  if (asset.shareCount > 5) score += 10;
  if (asset.commentCount > 0) score += 10;
  
  // Completeness bonus
  if (asset.userTags.length > 0) score += 10;
  if (asset.description) score += 10;
  
  return Math.max(0, Math.min(100, score));
}
```

**No AI API calls required - Pure heuristics**

---

## 🚀 PART 2: AI+ TIER - CONTENT READING

**Available to:** AI+ customers only ($698/mo)  
**Requires:** `user.canReadFileContent === true`

### 2.1 Azure OpenAI Configuration

**Model Selection:**
```typescript
const AI_CONFIG = {
  // GPT-4 for content analysis
  contentAnalysis: {
    model: 'gpt-4-turbo',
    maxTokens: 2000,
    temperature: 0.3, // Low temperature for factual analysis
  },
  
  // GPT-3.5 for embeddings
  embeddings: {
    model: 'text-embedding-ada-002',
    dimensions: 1536,
  },
  
  // Fallback
  fallback: {
    model: 'gpt-35-turbo',
    maxTokens: 1000,
  },
};
```

**Environment Variables:**
```bash
# Required for AI+ tier
AZURE_OPENAI_ENDPOINT=https://aethos.openai.azure.com/
AZURE_OPENAI_API_KEY=xxx
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4-turbo
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

### 2.2 Content Reading Service

**Permission Check (MANDATORY):**
```typescript
async function analyzeDocumentContent(
  asset: Asset,
  user: User
): Promise<ContentAnalysis | null> {
  // CRITICAL: Check AI+ tier permission
  if (!user.canReadFileContent) {
    throw new Error('Content reading requires AI+ tier');
  }
  
  // Download file content from source
  const content = await downloadFileContent(asset.sourceUrl);
  
  // Extract text based on file type
  const text = await extractText(content, asset.mimeType);
  
  // Call Azure OpenAI for analysis
  return await analyzeWithAI(text, asset);
}
```

**Text Extraction by Type:**
```typescript
async function extractText(
  content: Buffer,
  mimeType: string
): Promise<string> {
  switch (mimeType) {
    case 'application/pdf':
      return await extractPdfText(content);
    
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return await extractDocxText(content);
    
    case 'text/plain':
    case 'text/markdown':
      return content.toString('utf-8');
    
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return await extractExcelText(content);
    
    default:
      throw new Error(`Unsupported file type: ${mimeType}`);
  }
}
```

### 2.3 AI-Powered Semantic Search

**Embedding Generation:**
```typescript
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY!)
);

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await client.getEmbeddings(
    'text-embedding-ada-002',
    [text]
  );
  return response.data[0].embedding;
}
```

**Vector Search (Supabase pgvector):**
```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to assets table
ALTER TABLE assets
ADD COLUMN embedding vector(1536);

-- Create index for similarity search
CREATE INDEX ON assets
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Semantic search query
SELECT id, name, 1 - (embedding <=> $1::vector) AS similarity
FROM assets
WHERE tenant_id = $2
ORDER BY embedding <=> $1::vector
LIMIT 20;
```

**Oracle Search with AI+:**
```typescript
async function semanticSearch(
  query: string,
  tenantId: string,
  user: User
): Promise<Asset[]> {
  // Check AI+ permission
  if (!user.canReadFileContent) {
    // Fallback to metadata-only search
    return metadataOnlySearch(query, tenantId);
  }
  
  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);
  
  // Vector similarity search
  const { data: results } = await supabase
    .rpc('semantic_search', {
      query_embedding: queryEmbedding,
      tenant_id: tenantId,
      match_threshold: 0.7,
      match_count: 20,
    });
  
  return results;
}
```

### 2.4 Document Summarization

**Content Analysis Prompt:**
```typescript
const ANALYSIS_PROMPT = `
You are an enterprise content analyst. Analyze the following document and provide:

1. **Summary** (2-3 sentences)
2. **Key Topics** (3-5 topics)
3. **Document Type** (Report, Proposal, Meeting Notes, etc.)
4. **Recommended Tags** (5-10 tags)
5. **Stakeholders Mentioned** (extract names/roles)

Document content:
{content}

Respond in JSON format.
`;

async function analyzeDocumentWithAI(
  content: string,
  asset: Asset
): Promise<AIAnalysis> {
  const response = await client.getChatCompletions(
    'gpt-4-turbo',
    [
      { role: 'system', content: 'You are a helpful enterprise content analyst.' },
      { role: 'user', content: ANALYSIS_PROMPT.replace('{content}', content.slice(0, 8000)) },
    ],
    {
      temperature: 0.3,
      maxTokens: 1000,
      responseFormat: { type: 'json_object' },
    }
  );
  
  return JSON.parse(response.choices[0].message.content);
}
```

---

## 🔒 PART 3: PRIVACY & SECURITY

### 3.1 PII Sanitization (MANDATORY for both tiers)

**Before ANY AI processing:**
```typescript
function sanitizeForAI(text: string): string {
  // Remove email addresses
  text = text.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL]');
  
  // Remove phone numbers
  text = text.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');
  
  // Remove SSN patterns
  text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');
  
  // Remove credit card patterns
  text = text.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD]');
  
  return text;
}
```

### 3.2 Prompt Injection Defense

**Forbidden Input Patterns:**
```typescript
const INJECTION_PATTERNS = [
  /ignore\s+(previous|above|all)\s+instructions/i,
  /system\s*:/i,
  /act\s+as\s+(admin|root|sudo)/i,
  /\[INST\]/i,
  /<\|im_start\|>/i,
  /you\s+are\s+now/i,
];

function detectPromptInjection(input: string): boolean {
  return INJECTION_PATTERNS.some(pattern => pattern.test(input));
}

async function safeAICall(userInput: string, context: string) {
  if (detectPromptInjection(userInput)) {
    throw new Error('Potential prompt injection detected');
  }
  
  // Proceed with AI call
  return await callAI(userInput, context);
}
```

### 3.3 Rate Limiting (AI+ tier)

**Per-Tenant Quotas:**
```typescript
const AI_RATE_LIMITS = {
  BASE_TIER: {
    enrichmentCallsPerHour: 1000, // Metadata enrichment only
  },
  AI_PLUS_TIER: {
    contentReadingCallsPerHour: 100,
    embeddingCallsPerHour: 500,
    totalTokensPerDay: 1_000_000,
  },
};
```

---

## 🎨 PART 4: UI/UX PATTERNS

### 4.1 AI+ Feature Discovery

**Upgrade Prompt (Base tier users):**
```tsx
{!user.canReadFileContent && (
  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-400/20">
    <div className="flex items-center gap-3 mb-2">
      <Sparkles className="w-5 h-5 text-purple-400" />
      <span className="text-sm font-bold text-purple-400 uppercase tracking-widest">
        AI+ Feature
      </span>
    </div>
    <p className="text-sm text-slate-300 mb-3">
      Unlock semantic search and document summarization with AI+ tier
    </p>
    <button className="px-4 py-2 bg-purple-500 text-white rounded-lg text-xs font-bold">
      Upgrade to AI+ ($199/mo)
    </button>
  </div>
)}
```

### 4.2 AI Confidence Indicators

**Display AI suggestions with transparency:**
```tsx
<div className="flex items-center gap-2">
  <Sparkles className="w-4 h-4 text-[#00F0FF]" />
  <span className="text-xs text-slate-400">AI Suggested</span>
  <span className="text-xs text-slate-500">
    ({Math.round(confidence * 100)}% confidence)
  </span>
</div>
```

### 4.3 Manual Override

**Always provide rejection option:**
```tsx
<div className="flex gap-2">
  <button
    onClick={handleAcceptAISuggestion}
    className="px-3 py-1.5 bg-[#00F0FF] text-black rounded-lg text-xs font-bold"
  >
    Accept AI Tags
  </button>
  <button
    onClick={handleRejectAISuggestion}
    className="px-3 py-1.5 bg-white/5 text-slate-400 rounded-lg text-xs font-bold hover:bg-white/10"
  >
    Reject
  </button>
</div>
```

---

## ✅ COMPLIANCE CHECKLIST (AI Governance)

**Pre-Deployment:**
- [ ] Azure OpenAI keys stored in Vercel environment variables (not code)
- [ ] All AI features check `user.canReadFileContent` permission
- [ ] PII sanitization implemented for all text processing
- [ ] Prompt injection detection active
- [ ] Rate limiting configured per tier
- [ ] AI+ features display upgrade prompts for Base tier users
- [ ] Confidence scores shown for all AI suggestions
- [ ] Manual override buttons available

**Post-Deployment:**
- [ ] Monitor Azure OpenAI costs and usage
- [ ] Track AI suggestion acceptance rates
- [ ] Review failed prompt injection attempts
- [ ] Audit PII leakage (none expected)
- [ ] Test tier-based feature gating

---

## 🔄 MAINTENANCE

**Review Cycle:** Quarterly or when OpenAI models update  
**Owner:** AI Strategy & Engineering Team  
**Authority:** MANDATORY for AI+ tier features

---

## 📚 RELATED STANDARDS

- **STD-DATA-001** - Data Management & Multi-Tenant Standards
- **STD-SEC-001** - Security & Privacy Standards
- **STD-API-001** - API & Integration Standards

---

**Document ID:** STD-AI-001  
**Status:** 🟢 ACTIVE STANDARD  
**Authority:** MANDATORY for all AI integrations  
**Location:** `/docs/3-standards/STD-AI-001.md`
