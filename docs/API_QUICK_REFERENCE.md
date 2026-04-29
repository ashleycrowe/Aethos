# Aethos API Quick Reference Guide

**Status:** Complete V1-V4  
**Base URL:** `https://app.aethos.com/api`

---

## 🔑 Authentication

All API endpoints (except OAuth callbacks) require authentication.

### Frontend (MSAL)
```typescript
import { useAuth } from './context/AuthContext';

const { accessToken } = useAuth();

fetch('/api/artifacts/search', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

### Backend (Service Role)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

### Public API (API Key)
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://app.aethos.com/api/public/v1/artifacts
```

---

## 📋 V1 Core APIs

### Discovery
```typescript
// Trigger M365 metadata scan
POST /api/discovery/scan
{ "tenantId": "uuid" }

// Get scan status
GET /api/discovery/status?scanId=uuid

// Get dashboard metrics
GET /api/discovery/dashboard?tenantId=uuid
```

### Workspaces
```typescript
// Create workspace
POST /api/workspaces
{
  "name": "Q1 Budget",
  "description": "Financial planning",
  "tenantId": "uuid"
}

// Add artifact to workspace
POST /api/workspaces/:id/artifacts
{ "artifactId": "uuid" }

// Execute sync rules
POST /api/workspaces/:id/sync
```

### Search
```typescript
// Metadata search
POST /api/artifacts/search
{
  "query": "budget",
  "tenantId": "uuid",
  "filters": {
    "provider": "microsoft",
    "tags": ["finance"]
  }
}
```

### Remediation
```typescript
// Bulk archive
POST /api/remediation/archive
{
  "artifactIds": ["uuid1", "uuid2"],
  "tenantId": "uuid"
}
```

---

## 🤖 V1.5 AI+ APIs

### Embeddings
```typescript
// Generate embeddings for semantic search
POST /api/intelligence/embeddings
{
  "artifactId": "uuid",
  "tenantId": "uuid",
  "fileUrl": "https://...",
  "mimeType": "application/pdf"
}
```

### Semantic Search
```typescript
// Natural language search
POST /api/intelligence/semantic-search
{
  "query": "What was the Q1 marketing budget?",
  "tenantId": "uuid",
  "limit": 10,
  "threshold": 0.7  // Similarity threshold (0-1)
}
```

### Summarization
```typescript
// AI document summary
POST /api/intelligence/summarize
{
  "artifactId": "uuid",
  "tenantId": "uuid",
  "summaryType": "concise"  // or "detailed"
}
```

### PII Detection
```typescript
// Scan for personally identifiable information
POST /api/intelligence/pii-detection
{
  "artifactId": "uuid",
  "tenantId": "uuid"
}
```

---

## 🔗 V2 Multi-Provider APIs

### Slack
```typescript
// Initiate Slack OAuth
GET /api/providers/slack/connect?tenantId=uuid

// Scan Slack workspace
POST /api/providers/slack/scan
{
  "tenantId": "uuid",
  "connectionId": "uuid"
}
```

### Google Workspace
```typescript
// Initiate Google OAuth
GET /api/providers/google/connect?tenantId=uuid

// Scan Google Drive (shadow discovery)
POST /api/providers/google/scan
{
  "tenantId": "uuid",
  "connectionId": "uuid"
}
```

---

## 🛡️ V3 Governance APIs

### Retention Policies
```typescript
// Create retention policy
POST /api/compliance/retention-policies
{
  "action": "create",
  "tenant_id": "uuid",
  "name": "Archive Old Files",
  "rule_type": "inactivity",
  "rule_criteria": { "days_inactive": 180 },
  "action": "archive",
  "schedule": "daily",
  "enabled": true
}

// Execute policy
POST /api/compliance/retention-policies
{
  "action": "execute",
  "policyId": "uuid"
}

// List policies
GET /api/compliance/retention-policies?tenantId=uuid
```

### Anomaly Detection
```typescript
// Run anomaly detection
POST /api/analytics/anomaly-detection
{
  "tenantId": "uuid"
}

// Response includes:
// - storage_spike: Unusual storage growth
// - unusual_sharing_activity: High external share count
// - organizational_drift: Orphaned artifacts
```

---

## 🌐 V4 Federation & Ecosystem APIs

### Cross-Tenant Search (MSP)
```typescript
// Search across all managed tenants
POST /api/federation/cross-tenant-search
{
  "mspTenantId": "uuid",
  "query": "budget",
  "filters": {
    "provider": "microsoft",
    "tags": ["finance"]
  },
  "limit": 50
}
```

### Public REST API
```typescript
// List artifacts
GET /api/public/v1/artifacts?limit=100&offset=0&provider=microsoft
Authorization: Bearer YOUR_API_KEY

// Get single artifact
GET /api/public/v1/artifacts/:id
Authorization: Bearer YOUR_API_KEY

// Search artifacts
POST /api/public/v1/artifacts/search
Authorization: Bearer YOUR_API_KEY
{
  "query": "budget",
  "filters": { "tags": ["finance"] },
  "limit": 50
}
```

### Webhooks
```typescript
// Subscribe to events
POST /api/webhooks/subscribe
{
  "tenantId": "uuid",
  "eventTypes": [
    "artifact.created",
    "artifact.updated",
    "workspace.created",
    "compliance.alert",
    "anomaly.detected"
  ],
  "url": "https://your-app.com/webhooks/aethos",
  "secret": "your-webhook-secret"
}

// List subscriptions
GET /api/webhooks/subscribe?tenantId=uuid

// Delete subscription
DELETE /api/webhooks/subscribe
{ "subscriptionId": "uuid" }
```

### Webhook Payload Structure
```typescript
{
  "event_type": "artifact.created",
  "timestamp": "2026-03-01T10:30:00Z",
  "data": {
    "artifact": {
      "id": "uuid",
      "name": "Budget.xlsx",
      "provider": "microsoft",
      "tenantId": "uuid",
      ...
    }
  }
}

// Verify HMAC signature
const signature = request.headers['x-aethos-signature'];
const payload = JSON.stringify(request.body);
const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(payload)
  .digest('hex');

if (signature !== expectedSignature) {
  throw new Error('Invalid signature');
}
```

---

## 🔧 Common Patterns

### Error Handling
```typescript
// All APIs return consistent error format
{
  "error": "Error message",
  "code": "ERROR_CODE",  // Optional
  "details": {}          // Optional
}

// HTTP Status Codes:
// 400: Bad Request (missing params)
// 401: Unauthorized (invalid token)
// 403: Forbidden (insufficient permissions)
// 404: Not Found
// 429: Rate Limit Exceeded
// 500: Internal Server Error
```

### Pagination
```typescript
// List endpoints support pagination
GET /api/artifacts?limit=100&offset=0

// Response includes pagination metadata
{
  "artifacts": [...],
  "pagination": {
    "total": 5000,
    "limit": 100,
    "offset": 0,
    "hasMore": true
  }
}
```

### Filtering
```typescript
// Most endpoints support filter parameters
POST /api/artifacts/search
{
  "query": "budget",
  "filters": {
    "provider": "microsoft",          // Single value
    "tags": ["finance", "budget"],    // Array (OR logic)
    "date_range": {                   // Range
      "from": "2026-01-01",
      "to": "2026-12-31"
    }
  }
}
```

### Batch Operations
```typescript
// Many endpoints support batch operations
POST /api/remediation/archive
{
  "artifactIds": ["uuid1", "uuid2", "uuid3"],
  "tenantId": "uuid",
  "options": {
    "notify": true,
    "dryRun": false
  }
}
```

---

## 🎯 Quick Examples

### End-to-End: Semantic Search Flow
```typescript
// 1. Generate embeddings for new document
await fetch('/api/intelligence/embeddings', {
  method: 'POST',
  body: JSON.stringify({
    artifactId: 'new-doc-uuid',
    tenantId: 'tenant-uuid',
    fileUrl: 'https://sharepoint.com/doc.pdf',
    mimeType: 'application/pdf'
  })
});

// 2. Search semantically
const results = await fetch('/api/intelligence/semantic-search', {
  method: 'POST',
  body: JSON.stringify({
    query: 'What are the key performance indicators for Q1?',
    tenantId: 'tenant-uuid'
  })
}).then(r => r.json());

// 3. Summarize top result
const summary = await fetch('/api/intelligence/summarize', {
  method: 'POST',
  body: JSON.stringify({
    artifactId: results.results[0].artifact_id,
    tenantId: 'tenant-uuid'
  })
}).then(r => r.json());
```

### End-to-End: Automated Compliance
```typescript
// 1. Create retention policy
const policy = await fetch('/api/compliance/retention-policies', {
  method: 'POST',
  body: JSON.stringify({
    action: 'create',
    tenant_id: 'uuid',
    name: 'Auto-Archive Stale Files',
    rule_type: 'inactivity',
    rule_criteria: { days_inactive: 180 },
    action: 'archive',
    schedule: 'daily',
    enabled: true
  })
}).then(r => r.json());

// 2. Run anomaly detection
const anomalies = await fetch('/api/analytics/anomaly-detection', {
  method: 'POST',
  body: JSON.stringify({ tenantId: 'uuid' })
}).then(r => r.json());

// 3. Get compliance audit logs
const auditLogs = await supabase
  .from('compliance_audit_logs')
  .select('*')
  .eq('tenant_id', 'uuid')
  .order('executed_at', { ascending: false })
  .limit(50);
```

### End-to-End: MSP Platform
```typescript
// 1. Setup tenant relationships
await supabase.from('tenant_relationships').insert({
  parent_tenant_id: 'msp-uuid',
  child_tenant_id: 'client-uuid',
  relationship_type: 'managed'
});

// 2. Cross-tenant search
const results = await fetch('/api/federation/cross-tenant-search', {
  method: 'POST',
  body: JSON.stringify({
    mspTenantId: 'msp-uuid',
    query: 'compliance policy',
    limit: 50
  })
}).then(r => r.json());

// 3. Subscribe to webhooks for all clients
await fetch('/api/webhooks/subscribe', {
  method: 'POST',
  body: JSON.stringify({
    tenantId: 'msp-uuid',
    eventTypes: ['compliance.alert', 'anomaly.detected'],
    url: 'https://msp-dashboard.com/webhooks',
    secret: 'webhook-secret'
  })
});
```

---

## 📊 Rate Limits

| Tier | Requests/Minute | Semantic Searches/Day | AI Summaries/Day |
|------|-----------------|----------------------|------------------|
| Starter | 60 | 100 | 50 |
| Growth | 120 | 500 | 200 |
| Scale | 300 | 2000 | 1000 |
| Enterprise | Unlimited | Unlimited | Unlimited |

### Rate Limit Headers
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1709294400
```

---

## 🛠️ Development Tools

### Postman Collection
```bash
# Import Aethos API collection
curl -o aethos-api.postman_collection.json \
  https://docs.aethos.com/postman/collection.json
```

### cURL Examples
```bash
# Discovery scan
curl -X POST https://app.aethos.com/api/discovery/scan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{"tenantId": "uuid"}'

# Semantic search
curl -X POST https://app.aethos.com/api/intelligence/semantic-search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{"query": "budget", "tenantId": "uuid"}'
```

### TypeScript SDK (Future)
```typescript
import { AethosClient } from '@aethos/sdk';

const aethos = new AethosClient({
  apiKey: 'YOUR_API_KEY',
  environment: 'production'
});

// Semantic search
const results = await aethos.search.semantic({
  query: 'What was the Q1 budget?',
  limit: 10
});

// Create retention policy
const policy = await aethos.compliance.createRetentionPolicy({
  name: 'Archive Old Files',
  criteria: { daysInactive: 180 },
  action: 'archive'
});
```

---

## 📝 Response Time Benchmarks

| Endpoint | P50 | P95 | P99 |
|----------|-----|-----|-----|
| Metadata Search | 50ms | 150ms | 300ms |
| Semantic Search | 200ms | 500ms | 1000ms |
| Discovery Scan | 3min | 8min | 15min |
| Summarization | 2s | 5s | 10s |
| PII Detection | 1s | 3s | 8s |
| Cross-Tenant Search | 500ms | 2s | 5s |

---

**Last Updated:** 2026-03-01  
**Need Help?** Contact support@aethos.com or visit https://docs.aethos.com
