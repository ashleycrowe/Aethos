# 🚧 Aethos Implementation Tasks - Production Readiness Gaps

**Status:** Prototype → Beta  
**Goal:** Fix blocking issues for customer deployment  
**Timeline:** 3-4 weeks  
**Last Updated:** April 29, 2026

---

## 📊 Overall Progress

**Backend:** 75% complete  
**Frontend:** 25% complete  
**Testing:** 0% complete  
**Security:** Critical issues present

---

## 🔴 BLOCKING ISSUES (Must Fix Before Launch)

### P0-1: Content Extraction Implementation ⚠️ IN PROGRESS

**File:** `/api/intelligence/embeddings.ts`  
**Current Status:** Placeholder function (line 32-40)  
**Issue:** Returns `[Content extraction would happen here...]` instead of real content

**What needs to be done:**
1. Install content parsing libraries:
   ```bash
   pnpm add pdf-parse mammoth xlsx node-unzipper
   ```

2. Replace placeholder function with real implementation:
   ```typescript
   async function extractTextContent(fileUrl: string, mimeType: string): Promise<string> {
     // Download file from Microsoft Graph
     const fileBuffer = await downloadFile(fileUrl);
     
     // Extract based on mime type
     if (mimeType.includes('pdf')) {
       const pdfParse = require('pdf-parse');
       const data = await pdfParse(fileBuffer);
       return data.text;
     } else if (mimeType.includes('word') || mimeType.includes('document')) {
       const mammoth = require('mammoth');
       const result = await mammoth.extractRawText({ buffer: fileBuffer });
       return result.value;
     } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
       const xlsx = require('xlsx');
       const workbook = xlsx.read(fileBuffer);
       let text = '';
       workbook.SheetNames.forEach(sheetName => {
         const sheet = workbook.Sheets[sheetName];
         text += xlsx.utils.sheet_to_txt(sheet);
       });
       return text;
     } else if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
       // PowerPoint requires XML extraction from .pptx zip
       const unzipper = require('node-unzipper');
       // TODO: Extract slide text from XML
       return '[PowerPoint extraction not yet implemented]';
     } else {
       throw new Error(`Unsupported file type: ${mimeType}`);
     }
   }
   
   async function downloadFile(fileUrl: string): Promise<Buffer> {
     // Use Microsoft Graph to download file content
     const response = await fetch(fileUrl);
     const arrayBuffer = await response.arrayBuffer();
     return Buffer.from(arrayBuffer);
   }
   ```

3. Test with real files:
   - [ ] Test PDF extraction
   - [ ] Test Word document extraction
   - [ ] Test Excel spreadsheet extraction
   - [ ] Test PowerPoint extraction (or mark as unsupported)

**Acceptance Criteria:**
- Extract text from PDF, Word, Excel files successfully
- Handle errors gracefully (unsupported formats, corrupted files)
- Return actual content, not placeholders

**Estimated Time:** 2-3 days

---

### P0-2: Create Semantic Search Endpoint ❌ NOT STARTED

**File:** `/api/intelligence/semantic-search.ts` (DOES NOT EXIST)  
**Current Status:** Missing entirely  
**Documentation Claims:** "✅ Complete" in BACKEND_V1_V4_COMPLETE.md (FALSE)

**What needs to be done:**
1. Create new file `/api/intelligence/semantic-search.ts`

2. Implement vector similarity search:
   ```typescript
   import { VercelRequest, VercelResponse } from '@vercel/node';
   import { createClient } from '@supabase/supabase-js';
   import { OpenAI } from 'openai';
   
   const supabase = createClient(
     process.env.VITE_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!
   );
   
   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
   
   export default async function handler(req: VercelRequest, res: VercelResponse) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }
   
     const { query, tenantId, limit = 20 } = req.body;
   
     if (!query || !tenantId) {
       return res.status(400).json({ error: 'Missing required parameters' });
     }
   
     try {
       // 1. Generate embedding for search query
       const embeddingResponse = await openai.embeddings.create({
         model: 'text-embedding-3-small',
         input: query,
       });
   
       const queryEmbedding = embeddingResponse.data[0].embedding;
   
       // 2. Perform vector similarity search in Supabase
       const { data: results, error } = await supabase.rpc('match_documents', {
         query_embedding: queryEmbedding,
         match_threshold: 0.7, // Similarity threshold (0-1)
         match_count: limit,
         filter_tenant_id: tenantId,
       });
   
       if (error) {
         console.error('Semantic search error:', error);
         return res.status(500).json({ error: 'Search failed' });
       }
   
       // 3. Return results with similarity scores
       res.status(200).json({
         success: true,
         query,
         results: results.map((r: any) => ({
           file_id: r.file_id,
           name: r.name,
           content_preview: r.content_preview,
           similarity: r.similarity,
           url: r.url,
         })),
       });
     } catch (error: any) {
       console.error('Semantic search failed:', error);
       res.status(500).json({ error: error.message });
     }
   }
   ```

3. Create database function in Supabase:
   ```sql
   -- Add to supabase migrations
   CREATE OR REPLACE FUNCTION match_documents(
     query_embedding vector(1536),
     match_threshold float,
     match_count int,
     filter_tenant_id uuid
   )
   RETURNS TABLE (
     file_id uuid,
     name text,
     content_preview text,
     similarity float,
     url text
   )
   LANGUAGE plpgsql
   AS $$
   BEGIN
     RETURN QUERY
     SELECT
       f.id,
       f.name,
       LEFT(ce.extracted_content, 200) as content_preview,
       1 - (ce.embedding <=> query_embedding) as similarity,
       f.url
     FROM content_embeddings ce
     JOIN files f ON f.id = ce.file_id
     WHERE f.tenant_id = filter_tenant_id
       AND 1 - (ce.embedding <=> query_embedding) > match_threshold
     ORDER BY ce.embedding <=> query_embedding
     LIMIT match_count;
   END;
   $$;
   ```

**Acceptance Criteria:**
- Returns semantically similar documents for natural language queries
- Handles queries like "What was the Q1 budget?" or "Show me compliance documents"
- Returns results sorted by relevance with similarity scores

**Estimated Time:** 2 days

---

### P0-3: Create AI Summarization Endpoint ❌ NOT STARTED

**File:** `/api/intelligence/summarize.ts` (DOES NOT EXIST)  
**Current Status:** Missing entirely  
**Documentation Claims:** "✅ Complete" (FALSE)

**What needs to be done:**
1. Create new file `/api/intelligence/summarize.ts`

2. Implement document summarization:
   ```typescript
   import { VercelRequest, VercelResponse } from '@vercel/node';
   import { createClient } from '@supabase/supabase-js';
   import { OpenAI } from 'openai';
   
   const supabase = createClient(
     process.env.VITE_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!
   );
   
   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
   
   export default async function handler(req: VercelRequest, res: VercelResponse) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }
   
     const { fileId, tenantId, summaryType = 'short' } = req.body;
   
     if (!fileId || !tenantId) {
       return res.status(400).json({ error: 'Missing required parameters' });
     }
   
     try {
       // 1. Check if summary already exists (24-hour cache)
       const { data: existingSummary } = await supabase
         .from('content_summaries')
         .select('*')
         .eq('file_id', fileId)
         .eq('summary_type', summaryType)
         .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
         .single();
   
       if (existingSummary) {
         return res.status(200).json({
           success: true,
           summary: existingSummary.summary,
           cached: true,
         });
       }
   
       // 2. Get file content from embeddings table
       const { data: embedding } = await supabase
         .from('content_embeddings')
         .select('extracted_content')
         .eq('file_id', fileId)
         .single();
   
       if (!embedding) {
         return res.status(404).json({ error: 'File content not indexed yet' });
       }
   
       // 3. Generate summary with GPT-4o-mini
       const systemPrompt = summaryType === 'short'
         ? 'Summarize this document in 2-3 sentences.'
         : 'Provide a comprehensive summary with key points, main topics, and important details.';
   
       const completion = await openai.chat.completions.create({
         model: 'gpt-4o-mini',
         messages: [
           { role: 'system', content: systemPrompt },
           { role: 'user', content: embedding.extracted_content },
         ],
         max_tokens: summaryType === 'short' ? 150 : 500,
       });
   
       const summary = completion.choices[0].message.content;
   
       // 4. Cache summary in database
       await supabase.from('content_summaries').insert({
         file_id: fileId,
         summary,
         summary_type: summaryType,
         model_used: 'gpt-4o-mini',
         tokens_used: completion.usage?.total_tokens || 0,
       });
   
       res.status(200).json({
         success: true,
         summary,
         cached: false,
       });
     } catch (error: any) {
       console.error('Summarization failed:', error);
       res.status(500).json({ error: error.message });
     }
   }
   ```

**Acceptance Criteria:**
- Generate short (2-3 sentence) and long summaries
- Cache summaries for 24 hours to save costs
- Handle files without embeddings gracefully

**Estimated Time:** 1 day

---

### P0-4: Fix OAuth Token Encryption 🔴 SECURITY CRITICAL

**File:** `/api/providers/slack/connect.ts` (line 81)  
**File:** `/api/providers/google/connect.ts` (likely same issue)  
**Current Status:** Plain-text storage with comment "Should be encrypted in production"

**Security Issue:**
```typescript
// Line 81 - CURRENT CODE (INSECURE)
access_token: tokenData.access_token, // Should be encrypted in production
refresh_token: tokenData.refresh_token,
```

**What needs to be done:**
1. Install encryption library:
   ```bash
   pnpm add @supabase/supabase-js crypto
   ```

2. Create encryption utility `/src/lib/encryption.ts`:
   ```typescript
   import crypto from 'crypto';
   
   const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // Must be 32 bytes
   const ALGORITHM = 'aes-256-gcm';
   
   export function encrypt(text: string): string {
     const iv = crypto.randomBytes(16);
     const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
     
     let encrypted = cipher.update(text, 'utf8', 'hex');
     encrypted += cipher.final('hex');
     
     const authTag = cipher.getAuthTag();
     
     return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
   }
   
   export function decrypt(encryptedText: string): string {
     const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
     
     const iv = Buffer.from(ivHex, 'hex');
     const authTag = Buffer.from(authTagHex, 'hex');
     const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
     
     decipher.setAuthTag(authTag);
     
     let decrypted = decipher.update(encrypted, 'hex', 'utf8');
     decrypted += decipher.final('utf8');
     
     return decrypted;
   }
   ```

3. Update OAuth endpoints to use encryption:
   ```typescript
   import { encrypt, decrypt } from '../../src/lib/encryption';
   
   // When storing tokens
   await supabase.from('provider_connections').insert({
     tenant_id: tenantId,
     provider: 'slack',
     access_token: encrypt(tokenData.access_token), // ENCRYPTED
     refresh_token: encrypt(tokenData.refresh_token), // ENCRYPTED
     // ...
   });
   
   // When retrieving tokens
   const { data: connection } = await supabase
     .from('provider_connections')
     .select('*')
     .eq('id', connectionId)
     .single();
   
   const accessToken = decrypt(connection.access_token);
   ```

4. Add `ENCRYPTION_KEY` to `.env.example`:
   ```env
   # Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ENCRYPTION_KEY=your-64-character-hex-key-here
   ```

**Acceptance Criteria:**
- All OAuth tokens encrypted before storage
- Decryption works correctly for API calls
- Encryption key stored securely in environment variables
- No plain-text tokens in database

**Estimated Time:** 1 day

---

### P0-5: Connect Frontend to Backend APIs ⚠️ MAJOR WORK

**Files:** Multiple frontend components  
**Current Status:** Using `generateMockAssets()` and fake data  
**Issue:** Customers would see fake data in production

**Example Issue:**
```typescript
// src/app/components/Oracle/OracleMetadataSearch.tsx line 42-90
function generateMockAssets() {
  return Array.from({ length: 50 }, (_, i) => ({
    id: `asset-${i}`,
    name: `Document ${i}.docx`, // FAKE
    provider: 'microsoft', // FAKE
    // ... all fake data
  }));
}

// Line 99
const [assets, setAssets] = useState(generateMockAssets()); // USING MOCKS
```

**What needs to be done:**

1. Create API client utility `/src/lib/api.ts`:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
   
   export async function searchFiles(query: string, filters: any) {
     const response = await fetch(`${API_BASE_URL}/search/query`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${getAccessToken()}`,
       },
       body: JSON.stringify({ query, ...filters }),
     });
     
     if (!response.ok) {
       throw new Error(`Search failed: ${response.statusText}`);
     }
     
     return response.json();
   }
   
   export async function startDiscoveryScan(tenantId: string) {
     const response = await fetch(`${API_BASE_URL}/discovery/scan`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${getAccessToken()}`,
       },
       body: JSON.stringify({ tenantId }),
     });
     
     return response.json();
   }
   
   // Add more API functions...
   ```

2. Replace mock data with real API calls in components:
   ```typescript
   // BEFORE (MOCK)
   const [assets, setAssets] = useState(generateMockAssets());
   
   // AFTER (REAL)
   const [assets, setAssets] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   
   useEffect(() => {
     async function loadAssets() {
       try {
         setLoading(true);
         const data = await searchFiles('', { limit: 50 });
         setAssets(data.results);
       } catch (err) {
         setError(err.message);
       } finally {
         setLoading(false);
       }
     }
     
     loadAssets();
   }, []);
   
   if (loading) return <LoadingSpinner />;
   if (error) return <ErrorMessage error={error} />;
   ```

3. Update these components (minimum):
   - `OracleMetadataSearch.tsx` - Connect to `/api/search/query`
   - `DiscoveryScanSimulation.tsx` - Connect to `/api/discovery/scan`
   - `WorkspaceEngine.tsx` - Connect to `/api/workspaces/create`
   - `IntelligenceDashboard.tsx` - Connect to real metrics
   - `RemediationCenter.tsx` - Connect to `/api/remediation/execute`

**Acceptance Criteria:**
- No mock data generators in production code
- All API calls use real backend endpoints
- Loading states and error handling implemented
- User sees actual data from their M365 tenant

**Estimated Time:** 3-5 days

---

### P0-6: Add Basic Testing Coverage ❌ 0% COVERAGE

**Current Status:**  
- Test files: 0  
- Coverage: 0%  
- Risk: Any code change could break production

**What needs to be done:**

1. Install testing dependencies:
   ```bash
   pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
   ```

2. Create test config `vitest.config.ts`:
   ```typescript
   import { defineConfig } from 'vitest/config';
   import react from '@vitejs/plugin-react';
   
   export default defineConfig({
     plugins: [react()],
     test: {
       globals: true,
       environment: 'jsdom',
       setupFiles: './src/test/setup.ts',
       coverage: {
         provider: 'v8',
         reporter: ['text', 'json', 'html'],
       },
     },
   });
   ```

3. Write tests for critical paths:

   **Backend API Tests** (`/api/__tests__/discovery.test.ts`):
   ```typescript
   import { describe, it, expect, vi } from 'vitest';
   import handler from '../discovery/scan';
   
   describe('Discovery Scan API', () => {
     it('should require POST method', async () => {
       const req = { method: 'GET' };
       const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
       
       await handler(req, res);
       
       expect(res.status).toHaveBeenCalledWith(405);
     });
     
     it('should require accessToken and tenantId', async () => {
       const req = { method: 'POST', body: {} };
       const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
       
       await handler(req, res);
       
       expect(res.status).toHaveBeenCalledWith(400);
     });
     
     // More tests...
   });
   ```

   **Frontend Component Tests** (`/src/app/components/__tests__/OracleSearch.test.tsx`):
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { render, screen, waitFor } from '@testing-library/react';
   import { OracleMetadataSearch } from '../OracleMetadataSearch';
   
   describe('OracleMetadataSearch', () => {
     it('should render search interface', () => {
       render(<OracleMetadataSearch />);
       expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
     });
     
     it('should load assets on mount', async () => {
       render(<OracleMetadataSearch />);
       
       await waitFor(() => {
         expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
       });
       
       expect(screen.getByText(/document/i)).toBeInTheDocument();
     });
     
     // More tests...
   });
   ```

4. Add test scripts to `package.json`:
   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:ui": "vitest --ui",
       "test:coverage": "vitest --coverage"
     }
   }
   ```

5. Test critical paths:
   - [ ] Discovery scan endpoint
   - [ ] Search query endpoint
   - [ ] Workspace creation
   - [ ] Remediation actions
   - [ ] OAuth token storage/retrieval
   - [ ] Frontend search component
   - [ ] Frontend dashboard

**Acceptance Criteria:**
- Minimum 60% test coverage on critical paths
- All API endpoints have basic tests
- Key frontend components have tests
- CI can run tests automatically

**Estimated Time:** 3-5 days

---

## 🟡 HIGH PRIORITY (Should Fix)

### P1-1: Fix Broken Documentation References ⚠️ IN PROGRESS

**Files:** Multiple documentation files  
**Issue:** Reference files that don't exist or are being deleted

**What needs to be done:**
1. Update `/docs/3-standards/README.md`:
   - Remove reference to `CONSOLIDATED_STANDARDS.md` (being deleted)
   - Remove reference to `V1_IMPLEMENTATION_ROADMAP.md` (being deleted)
   - Remove reference to `MASTER_DESIGN_GUIDE.md` (doesn't exist)
   - Remove `STD-TASK-001.md` from listing (doesn't exist)

2. Update `BACKEND_V1_V4_COMPLETE.md`:
   - Change "✅ Complete" to "⚠️ Partial" for embeddings
   - Change "✅ Complete" to "❌ Missing" for semantic-search
   - Change "✅ Complete" to "❌ Missing" for summarize
   - Add "Known Gaps" section

3. Update `SIMPLIFIED_ARCHITECTURE.md`:
   - Update last modified date to April 29, 2026
   - Add note that this is V1 reference (full schema in migrations)
   - Add Document Control module to diagram

**Estimated Time:** 0.5 days

---

### P1-2: Add Token Refresh Logic ⚠️ IMPORTANT

**Files:** All OAuth provider endpoints  
**Current Issue:** Tokens expire after 60 days, scans fail silently

**What needs to be done:**
1. Modify all API calls to check token expiration
2. Automatically refresh tokens before they expire
3. Handle refresh failures gracefully

**Estimated Time:** 1 day

---

## 🟢 MEDIUM PRIORITY (Nice to Have)

### P2-1: Complete Anomaly Detection Logic

**File:** `/api/analytics/anomaly-detection.ts`  
**Status:** Likely stub/incomplete

**What needs to be done:**
- Implement statistical analysis for storage spikes
- Add trending algorithms
- Create baseline snapshots

**Estimated Time:** 2-3 days

---

### P2-2: Implement PowerPoint Content Extraction

**File:** `/api/intelligence/embeddings.ts`  
**Current:** Returns placeholder for .pptx files

**What needs to be done:**
- Extract XML from PowerPoint .pptx zip
- Parse slide text content
- Handle notes and speaker notes

**Estimated Time:** 1 day

---

### P2-3: Add Rate Limiting Enforcement

**Files:** `/api/public/v1/artifacts.ts` and others  
**Current:** Tracks usage but doesn't enforce limits

**What needs to be done:**
- Add middleware to enforce rate limits
- Return 429 Too Many Requests when exceeded
- Add usage reset logic

**Estimated Time:** 1 day

---

## 📝 DOCUMENTATION TASKS

### DOC-1: Update Backend Documentation to Reflect Reality ✅ CRITICAL

**File:** `/docs/BACKEND_V1_V4_COMPLETE.md`  
**Action:** Remove false "✅ Complete" claims

### DOC-2: Add "Known Limitations" Section to README

**File:** `/README.md`  
**Action:** Add honest assessment of current state

### DOC-3: Create BETA_TESTING_GUIDE.md

**Action:** Document what works and what doesn't for beta testers

---

## ✅ COMPLETION CRITERIA

Before considering this "production ready":

- [ ] All P0 blocking issues resolved
- [ ] Test coverage ≥ 60% on critical paths
- [ ] No mock data in frontend components
- [ ] All OAuth tokens encrypted
- [ ] Content extraction working for PDF/Word/Excel
- [ ] Semantic search endpoint functional
- [ ] AI summarization endpoint functional
- [ ] Documentation accurate and honest
- [ ] Beta testing with 3-5 users successful

---

## 📊 TRACKING PROGRESS

**Update this file as you complete tasks:**
- Change ❌ to ⚠️ when you start working
- Change ⚠️ to ✅ when completed
- Add completion date next to ✅

**Example:**
```
### P0-1: Content Extraction Implementation ✅ COMPLETED (May 5, 2026)
```

---

## 🤝 WORKING WITH GITHUB COPILOT

When using Copilot to implement these tasks:

1. **Open this file** - Copilot will read it for context
2. **Open the target file** - Navigate to the file you're fixing
3. **Start typing** - Copilot will suggest implementations
4. **Reference patterns** - Keep similar working files open
5. **Test immediately** - Don't trust AI code without testing

**Example workflow:**
- Open `IMPLEMENTATION_TASKS.md` (this file)
- Open `/api/intelligence/embeddings.ts`
- Start typing: `async function extractTextContent(fileUrl: string, mimeType: string): Promise<string> {`
- Copilot suggests the implementation based on this task file
- Review, test, commit

---

**This file serves as your single source of truth for what needs to be done. Update it as you progress!**
