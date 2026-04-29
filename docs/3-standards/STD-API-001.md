# [STANDARD] Aethos API & External Integration Standards
## Vercel Serverless Functions & Microsoft Graph Governance

---
status: Active
type: Core Strategic Standard
phase: All Phases
audience: [Architecture, Backend Developers, Security]
priority: Critical
last_updated: 2026-02-27
document_id: STD-API-001
location: `/docs/3-standards/STD-API-001.md`
---

## 🔗 The Sidecar Connectivity Principle

Aethos operates as a "Sidecar" to the M365 tenant. When integrating with external systems like HRIS (Workday, SAP SuccessFactors), the application must act as a transient bridge—ingesting identity metadata to enrich discovery visibility without persisting sensitive PII in Supabase unless explicitly required for relational mapping.

**Architecture Context:** Vercel Serverless Functions + Supabase PostgreSQL. See `/docs/2-ARCHITECTURE/SIMPLIFIED_ARCHITECTURE.md`

---

## 🚨 MANDATORY CRITICAL RULES

1. **ENVIRONMENT SECRETS:** No API keys, Client Secrets, or Bearer Tokens in code. All secrets must be stored in **Vercel Environment Variables** (encrypted at rest).

2. **RESILIENT BACKOFF:** Every external call MUST implement exponential backoff strategy (1s, 2s, 4s, 8s) to handle transient M365 Graph or HRIS API throttling (429 errors).

3. **VALIDATE & TRANSFORM:** Data from external APIs must be validated via schema validation (Zod) before being processed by the Aethos intelligence layer.

4. **CIRCUIT BREAKER:** If an endpoint fails 5 times consecutively, the connection must be "tripped" (Status: `Degraded`) to prevent cascading failures.

5. **PII REDACTION:** Any HRIS data not used for "Ghost Town" identification or "Nexus" mapping must be discarded immediately after processing.

6. **RATE LIMITING:** Implement client-side rate limiting to respect API quotas:
   - Microsoft Graph: 10,000 requests/10 minutes per app
   - Vercel Functions: 100 req/sec on free tier

7. **TIMEOUT MANAGEMENT:** All API calls must have explicit timeouts:
   - External APIs: 30s max
   - Database queries: 10s max
   - Vercel Function execution: 10s (free tier limit)

---

## 🏗️ Resilient API Architecture

### The Aethos Resilient Client

All integrations must use the standard `resilientFetch` utility which handles:
- Automatic retry logic with exponential backoff
- Telemetry logging for monitoring
- Timeout management
- Error normalization

```typescript
// /src/app/services/api/resilientClient.ts

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  backoff?: number;
}

export async function resilientFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    timeout = 30000,
    retries = 3,
    backoff = 1000,
    ...fetchOptions
  } = options;
  
  let lastError: Error;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
        await sleep(retryAfter * 1000);
        continue;
      }
      
      // Handle server errors with retry
      if (response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      // Handle client errors (don't retry)
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on abort (timeout)
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      
      // Exponential backoff before retry
      if (attempt < retries) {
        const delay = backoff * Math.pow(2, attempt);
        console.log(`Retry ${attempt + 1}/${retries} after ${delay}ms`);
        await sleep(delay);
      }
    }
  }
  
  throw lastError!;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

**Usage:**
```typescript
// Fetch from Microsoft Graph with automatic retries
const sites = await resilientFetch<{ value: Site[] }>(
  'https://graph.microsoft.com/v1.0/sites',
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'ConsistencyLevel': 'eventual'
    },
    retries: 3,
    timeout: 30000
  }
);
```

---

## 🔌 Vercel Serverless Functions

### API Route Structure

```
/api/
  ├── microsoft/
  │   ├── auth/
  │   │   └── callback.ts       # OAuth callback
  │   ├── sync/
  │   │   ├── sites.ts          # Sync SharePoint sites
  │   │   └── delta.ts          # Delta sync endpoint
  │   └── graph/
  │       └── proxy.ts          # Graph API proxy
  ├── oracle/
  │   ├── search.ts             # Semantic search
  │   └── enrich.ts             # AI metadata enrichment
  ├── tenant/
  │   ├── [id]/
  │   │   ├── purge.ts          # GDPR purge
  │   │   └── export.ts         # Data export
  │   └── settings.ts           # Tenant settings
  └── webhooks/
      └── workday.ts            # HRIS webhook handler
```

### Function Template

```typescript
// /api/microsoft/sync/sites.ts

import { NextRequest, NextResponse } from 'next/server';
import { resilientFetch } from '@/app/services/api/resilientClient';
import { supabase } from '@/app/services/supabase/client';
import { z } from 'zod';

// Input validation schema
const SyncRequestSchema = z.object({
  tenantId: z.string().uuid(),
  force: z.boolean().optional()
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request
    const body = await request.json();
    const { tenantId, force } = SyncRequestSchema.parse(body);
    
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authentication' },
        { status: 401 }
      );
    }
    
    // Fetch sites from Microsoft Graph
    const sites = await resilientFetch<{ value: Site[] }>(
      'https://graph.microsoft.com/v1.0/sites',
      {
        headers: {
          'Authorization': authHeader
        }
      }
    );
    
    // Transform and upsert to database
    const containers = sites.value.map(site => ({
      tenant_id: tenantId,
      provider: 'microsoft',
      provider_id: site.id,
      name: site.displayName,
      url: site.webUrl,
      size_bytes: site.siteCollection?.storage?.used || 0,
      last_modified_at: site.lastModifiedDateTime,
      synced_at: new Date()
    }));
    
    const { error } = await supabase
      .from('containers')
      .upsert(containers, {
        onConflict: 'tenant_id,provider,provider_id'
      });
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      synced: containers.length
    });
    
  } catch (error) {
    console.error('Sync failed:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Serverless function config
export const config = {
  maxDuration: 10, // 10 seconds (free tier limit)
  runtime: 'nodejs' // or 'edge' for faster cold starts
};
```

---

## 🏢 HRIS Integration Patterns

### 1. Workday Identity Enrichment

Used to map "Ghost Towns" to specific organizational departments.

**Sync Trigger:** Weekly via Vercel Cron Jobs  
**Data Scope:** Worker ID, Department, Manager Chain, Cost Center

```typescript
// /api/hris/workday/sync.ts

export async function syncWorkdayIdentities(tenantId: string) {
  const workdayUrl = process.env.WORKDAY_API_URL!;
  const username = process.env.WORKDAY_USERNAME!;
  const password = process.env.WORKDAY_PASSWORD!;
  
  const workers = await resilientFetch<WorkdayResponse>(
    `${workdayUrl}/Workers`,
    {
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`
      }
    }
  );
  
  // Enrich users with organizational data
  for (const worker of workers.data) {
    await supabase
      .from('users')
      .update({
        department: worker.organization.name,
        manager_id: worker.manager?.id,
        cost_center: worker.costCenter
      })
      .eq('email', worker.email)
      .eq('tenant_id', tenantId);
  }
}
```

**Vercel Cron Configuration:**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/workday-sync",
      "schedule": "0 2 * * 0" // Every Sunday at 2am UTC
    }
  ]
}
```

### 2. SAP SuccessFactors Sync

- **Protocol:** OData v2
- **Security:** OAuth 2.0 Client Credentials (stored in Vercel Environment Variables)

```typescript
// Get OAuth token
async function getSAPToken(): Promise<string> {
  const response = await fetch('https://api.successfactors.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SAP_CLIENT_ID!,
      client_secret: process.env.SAP_CLIENT_SECRET!
    })
  });
  
  const data = await response.json();
  return data.access_token;
}
```

---

## 🔒 Security & Webhook Governance

### Webhook Signature Verification

All incoming webhooks must be verified using HMAC SHA256 signatures:

```typescript
// /api/webhooks/workday.ts

import { createHmac } from 'crypto';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-workday-signature');
  const body = await request.text();
  
  // Verify signature
  const expectedSignature = createHmac('sha256', process.env.WORKDAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    );
  }
  
  // Process webhook
  const payload = JSON.parse(body);
  await processWorkdayEvent(payload);
  
  return NextResponse.json({ success: true });
}
```

### Idempotency

Webhook processing must check for duplicate events:

```typescript
async function processWorkdayEvent(event: WorkdayEvent) {
  // Check if already processed
  const { data: existing } = await supabase
    .from('processed_events')
    .select('id')
    .eq('event_id', event.id)
    .single();
  
  if (existing) {
    console.log('Event already processed:', event.id);
    return;
  }
  
  // Process event
  await updateUserFromWorkday(event.data);
  
  // Mark as processed
  await supabase
    .from('processed_events')
    .insert({
      event_id: event.id,
      event_type: 'workday_user_update',
      processed_at: new Date()
    });
}
```

---

## 📊 Rate Limiting & Circuit Breaker

### Client-Side Rate Limiter

```typescript
// /src/app/services/api/rateLimiter.ts

class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;
  
  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  async acquire(): Promise<void> {
    const now = Date.now();
    
    // Remove old requests outside window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    // Check if we're over the limit
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      await sleep(waitTime);
      return this.acquire(); // Retry
    }
    
    this.requests.push(now);
  }
}

// Microsoft Graph: 10,000 requests per 10 minutes
export const graphRateLimiter = new RateLimiter(10000, 10 * 60 * 1000);

// Usage
await graphRateLimiter.acquire();
const data = await fetch('https://graph.microsoft.com/...');
```

### Circuit Breaker

```typescript
// /src/app/services/api/circuitBreaker.ts

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime?: Date;
  private threshold = 5;
  private timeout = 60000; // 1 minute
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      // Check if timeout has passed
      if (this.lastFailureTime &&
          Date.now() - this.lastFailureTime.getTime() > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await fn();
      
      // Success: reset circuit
      this.failureCount = 0;
      this.state = 'CLOSED';
      
      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = new Date();
      
      if (this.failureCount >= this.threshold) {
        this.state = 'OPEN';
      }
      
      throw error;
    }
  }
}

// Usage
const graphCircuit = new CircuitBreaker();

try {
  const sites = await graphCircuit.execute(() =>
    resilientFetch('https://graph.microsoft.com/v1.0/sites')
  );
} catch (error) {
  console.error('Circuit breaker tripped:', error);
  // Fall back to cached data
}
```

---

## ✅ Compliance Checklist (Integration Ready)

- [ ] **Secrets:** No hardcoded API keys in code (use Vercel env vars)
- [ ] **Retry Logic:** `resilientFetch` applied to all external API calls
- [ ] **Validation:** Zod schemas defined for all incoming payloads
- [ ] **Timeouts:** All API calls have explicit timeout values
- [ ] **Rate Limiting:** Client-side rate limiter for Graph API
- [ ] **Circuit Breaker:** Circuit breaker for HRIS integrations
- [ ] **Audit Logging:** All external calls logged with correlation ID
- [ ] **Error Handling:** Graceful degradation when external services fail
- [ ] **Webhooks:** Signature verification for all incoming webhooks
- [ ] **Idempotency:** Duplicate event detection in webhook handlers

---

## 📚 Related Standards

- **STD-SEC-001:** API authentication & secrets management
- **STD-DATA-001:** Database integration patterns
- **STD-M365-001:** Microsoft Graph API specifics
- **STD-ERROR-001:** Error handling & resilience
- **STD-PERF-001:** API performance optimization

---

## 🔄 Maintenance

**Review Cycle:** Quarterly  
**Owner:** Aethos Architecture Group  
**Authority:** MANDATORY for Enterprise Deployment  
**Last Updated:** 2026-02-27 (Updated for Vercel Serverless Functions, moved to /docs/3-standards/)
