# Aethos Production Deployment Guide (V1-V4)

**Target:** Production-ready deployment of all features V1 through V4  
**Timeline:** 2-4 hours (depending on experience)  
**Last Updated:** 2026-03-01

---

## ✅ Pre-Deployment Checklist

Before deploying to production, ensure you have:

- [ ] Azure account with admin access (for Microsoft Entra ID app registration)
- [ ] Supabase Pro account ($25/month minimum for production features)
- [ ] Vercel Pro account ($20/month for production deployments)
- [ ] OpenAI API key with billing enabled (for V1.5 features)
- [ ] Slack workspace admin access (for V2 Slack integration)
- [ ] Google Workspace admin access (for V2 Google integration)
- [ ] Domain name configured (e.g., app.aethos.com)
- [ ] SSL certificate (automatic with Vercel)

---

## 📋 Deployment Steps

### Step 1: Setup Azure Entra ID (Microsoft Authentication)

#### 1.1 Create App Registration

1. Go to https://portal.azure.com
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
   - **Name:** Aethos
   - **Supported account types:** Multi-tenant (if targeting multiple organizations)
   - **Redirect URI:** `https://app.aethos.com`
4. Click **Register**

#### 1.2 Configure API Permissions

1. In your app, go to **API permissions**
2. Click **Add a permission** → **Microsoft Graph** → **Delegated permissions**
3. Add the following permissions:
   - `User.Read` (user profile)
   - `Files.Read.All` (OneDrive/Teams files)
   - `Sites.Read.All` (SharePoint sites)
   - `Group.Read.All` (Teams/Groups)
   - `Mail.Read` (optional, for future email integration)
4. Click **Grant admin consent** (requires Global Admin)

#### 1.3 Configure Authentication

1. Go to **Authentication**
2. Add platform: **Single-page application (SPA)**
   - Redirect URI: `https://app.aethos.com`
   - Logout URL: `https://app.aethos.com/logout`
3. Enable **ID tokens** and **Access tokens**
4. Save

#### 1.4 Copy Credentials

- **Application (client) ID:** Copy to `.env` as `VITE_MICROSOFT_CLIENT_ID`
- **Directory (tenant) ID:** Copy to `.env` as `VITE_MICROSOFT_TENANT_ID`

---

### Step 2: Setup Supabase Database

#### 2.1 Create Supabase Project

1. Go to https://supabase.com
2. Click **New project**
   - **Name:** aethos-production
   - **Database Password:** Generate strong password (save securely)
   - **Region:** Choose closest to your users (e.g., US East)
   - **Plan:** Pro ($25/month minimum for production)
3. Wait ~2 minutes for project creation

#### 2.2 Enable pgvector Extension (Required for V1.5)

1. Go to **SQL Editor** in Supabase dashboard
2. Run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Verify:
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'vector';
   ```

#### 2.3 Run Database Migrations

1. Open **SQL Editor**
2. Paste contents of `/supabase/migrations/001_initial_schema.sql`
3. Click **Run**
4. Repeat for `002_additional_tables.sql`
5. Repeat for `003_v15_to_v4_features.sql`

#### 2.4 Verify Database Schema

Run this query to verify all tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected tables (23 total):
- tenants
- users
- artifacts
- workspaces
- workspace_artifacts
- workspace_sync_rules
- tags
- artifact_tags
- discovery_scans
- content_embeddings (V1.5)
- content_summaries (V1.5)
- pii_detections (V1.5)
- provider_connections (V2)
- retention_policies (V3)
- compliance_audit_logs (V3)
- anomaly_detections (V3)
- storage_snapshots (V3)
- tenant_relationships (V4)
- federation_audit_logs (V4)
- api_keys (V4)
- api_usage (V4)
- webhook_subscriptions (V4)
- webhook_deliveries (V4)

#### 2.5 Copy Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL:** → `VITE_SUPABASE_URL`
   - **anon public key:** → `VITE_SUPABASE_ANON_KEY`
3. Go to **Project Settings** → **Database**
4. Under **Connection string**, copy **Service Role key** → `SUPABASE_SERVICE_ROLE_KEY`

---

### Step 3: Setup OpenAI (V1.5 AI+ Features)

1. Go to https://platform.openai.com
2. Navigate to **API keys**
3. Click **Create new secret key**
   - **Name:** Aethos Production
   - **Permissions:** All (or restrict to models: `text-embedding-3-small`, `gpt-4o-mini`)
4. Copy key → `OPENAI_API_KEY`
5. Setup billing limits:
   - Go to **Settings** → **Billing** → **Usage limits**
   - Set hard limit: $100/month (adjust based on usage)

---

### Step 4: Setup Slack Integration (V2 - Optional)

#### 4.1 Create Slack App

1. Go to https://api.slack.com/apps
2. Click **Create New App** → **From scratch**
   - **App Name:** Aethos
   - **Workspace:** Your workspace
3. Click **Create App**

#### 4.2 Configure OAuth & Permissions

1. Go to **OAuth & Permissions**
2. Under **Scopes**, add **Bot Token Scopes:**
   - `channels:read`
   - `channels:history`
   - `files:read`
   - `users:read`
   - `search:read`
3. Under **Redirect URLs**, add:
   - `https://app.aethos.com/api/providers/slack/callback`
4. Save URLs

#### 4.3 Copy Credentials

1. Go to **Basic Information**
2. Copy:
   - **Client ID** → `SLACK_CLIENT_ID`
   - **Client Secret** → `SLACK_CLIENT_SECRET`

---

### Step 5: Setup Google Workspace (V2 - Optional)

#### 5.1 Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Create new project: **Aethos**
3. Enable **Google Drive API**
   - Search for "Drive API" in API Library
   - Click **Enable**

#### 5.2 Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
   - **Application type:** Web application
   - **Name:** Aethos
   - **Authorized redirect URIs:**
     - `https://app.aethos.com/api/providers/google/callback`
3. Click **Create**

#### 5.3 Configure OAuth Consent Screen

1. Go to **OAuth consent screen**
2. Choose **External** (for multi-tenant)
3. Fill in app information:
   - **App name:** Aethos
   - **User support email:** support@aethos.com
   - **Developer contact:** engineering@aethos.com
4. Add scopes:
   - `https://www.googleapis.com/auth/drive.readonly`
   - `https://www.googleapis.com/auth/drive.metadata.readonly`
5. Save and continue

#### 5.4 Copy Credentials

- **Client ID** → `GOOGLE_CLIENT_ID`
- **Client Secret** → `GOOGLE_CLIENT_SECRET`

---

### Step 6: Deploy to Vercel

#### 6.1 Install Vercel CLI

```bash
npm install -g vercel
```

#### 6.2 Login to Vercel

```bash
vercel login
```

#### 6.3 Initialize Project

```bash
# From project root
vercel

# Follow prompts:
# - Setup and deploy? Yes
# - Scope: Your team/personal
# - Link to existing project? No
# - Project name: aethos
# - Directory: ./
# - Override settings? No
```

#### 6.4 Add Environment Variables

```bash
# Core (V1)
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add VITE_MICROSOFT_CLIENT_ID
vercel env add VITE_MICROSOFT_TENANT_ID
vercel env add API_BASE_URL

# V1.5 AI+
vercel env add OPENAI_API_KEY
vercel env add ENABLE_AI_FEATURES

# V2 Multi-Provider
vercel env add SLACK_CLIENT_ID
vercel env add SLACK_CLIENT_SECRET
vercel env add SLACK_REDIRECT_URI
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GOOGLE_REDIRECT_URI

# V3 Governance
vercel env add ENABLE_COMPLIANCE_MODULE
vercel env add ENABLE_V3_FEATURES

# V4 Federation
vercel env add ENABLE_FEDERATION
vercel env add ENABLE_PUBLIC_API
vercel env add ENABLE_V4_FEATURES

# Security
vercel env add JWT_SECRET
vercel env add ENCRYPTION_KEY
```

For each variable, choose:
- **Environment:** Production
- **Value:** Paste the actual value

#### 6.5 Deploy to Production

```bash
vercel --prod
```

Wait for deployment (usually 2-3 minutes).

#### 6.6 Configure Custom Domain

1. Go to Vercel dashboard → Your project
2. Click **Settings** → **Domains**
3. Add domain: `app.aethos.com`
4. Follow DNS configuration instructions
5. Wait for DNS propagation (~5-60 minutes)

---

### Step 7: Setup Cron Jobs (V3 Scheduled Tasks)

Cron jobs are automatically configured via `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/anomaly-detection",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/retention-policies",
      "schedule": "0 3 * * *"
    }
  ]
}
```

Verify in Vercel dashboard:
1. Go to **Settings** → **Cron Jobs**
2. Confirm jobs are listed and enabled

---

### Step 8: Post-Deployment Verification

#### 8.1 Health Check Endpoints

```bash
# Test API is responding
curl https://app.aethos.com/api/health
# Expected: { "status": "ok" }

# Test Supabase connection
curl https://app.aethos.com/api/health/database
# Expected: { "status": "connected" }
```

#### 8.2 Test V1 Core Features

```bash
# Test Microsoft authentication flow
# 1. Open https://app.aethos.com
# 2. Click "Login with Microsoft"
# 3. Should redirect to Microsoft login
# 4. After auth, should redirect back to app

# Test discovery scan (requires logged-in user)
# Use browser console or Postman
```

#### 8.3 Test V1.5 AI+ Features

```bash
# Test semantic search (requires AI+ enabled)
curl -X POST https://app.aethos.com/api/intelligence/semantic-search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "query": "test query",
    "tenantId": "test-uuid",
    "limit": 5
  }'
```

#### 8.4 Monitor Logs

```bash
# View real-time logs
vercel logs --follow

# Filter by function
vercel logs --follow /api/discovery/scan
```

---

### Step 9: Setup Monitoring & Alerts

#### 9.1 Vercel Analytics (Built-in)

1. Go to Vercel dashboard → Your project
2. Click **Analytics**
3. Review metrics:
   - **Web Vitals** (Lighthouse scores)
   - **Audience** (traffic sources)
   - **Top Pages** (most visited)

#### 9.2 Supabase Monitoring

1. Go to Supabase dashboard
2. Click **Database** → **Health**
3. Monitor:
   - **Connection pooling**
   - **Query performance**
   - **Disk usage**

#### 9.3 OpenAI Usage Tracking

1. Go to https://platform.openai.com
2. Navigate to **Usage**
3. Monitor monthly spend
4. Set up email alerts for usage thresholds

#### 9.4 Error Tracking (Optional)

Install Sentry for error monitoring:

```bash
npm install @sentry/react @sentry/node

# Add to vercel.json
{
  "env": {
    "SENTRY_DSN": "@sentry-dsn"
  }
}
```

---

## 🔒 Security Hardening

### 1. Rotate Secrets Regularly

```bash
# Rotate every 90 days
- Supabase service role key
- OpenAI API key
- OAuth client secrets (Slack, Google)
- JWT secret
- Encryption key
```

### 2. Enable Row-Level Security (RLS)

Verify RLS is enabled on all tables:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All should have `rowsecurity = true`.

### 3. Setup Rate Limiting

Add rate limiting middleware (already included in API endpoints):

```typescript
// Example: /api/public/v1/artifacts.ts
// Rate limit: 10,000 calls/month per API key
// Enforced via api_usage table
```

### 4. Enable HTTPS Only

Vercel enforces HTTPS by default, but verify:

```bash
curl -I http://app.aethos.com
# Should redirect to https://
```

### 5. Configure CORS

Update `/api/_middleware.ts`:

```typescript
export const config = {
  matcher: '/api/:path*',
};

export default function middleware(req: Request) {
  const origin = req.headers.get('origin');
  const allowedOrigins = ['https://app.aethos.com'];

  if (!allowedOrigins.includes(origin || '')) {
    return new Response('CORS not allowed', { status: 403 });
  }

  // Continue to API handler
  return NextResponse.next();
}
```

---

## 📊 Performance Optimization

### 1. Enable Vercel Edge Caching

Add cache headers to static endpoints:

```typescript
// Example: /api/discovery/dashboard
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
  // ... handler logic
}
```

### 2. Optimize Database Queries

```sql
-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_artifacts_tenant_provider 
ON artifacts(tenant_id, provider);

CREATE INDEX IF NOT EXISTS idx_artifacts_search 
ON artifacts USING gin(to_tsvector('english', name || ' ' || enriched_name));
```

### 3. Enable Supabase Connection Pooling

1. Go to Supabase **Database** settings
2. Enable **Connection Pooler**
3. Use pooled connection string in `.env`:
   ```
   SUPABASE_URL=postgres://postgres.pooler.supabase.co:6543/postgres
   ```

### 4. Optimize OpenAI Costs

```typescript
// Batch embedding generation
const embeddings = await Promise.all(
  chunks.map(chunk => openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: chunk
  }))
);

// Cache summaries for 24 hours
const cachedSummary = await supabase
  .from('content_summaries')
  .select('*')
  .eq('artifact_id', artifactId)
  .gte('created_at', new Date(Date.now() - 24*60*60*1000).toISOString())
  .single();
```

---

## 🧪 Testing in Production

### 1. Create Test Tenant

```sql
-- In Supabase SQL Editor
INSERT INTO tenants (id, name, microsoft_tenant_id, subscription_tier, status)
VALUES (
  gen_random_uuid(),
  'Test Organization',
  'test-tenant-id',
  'v1',
  'active'
);
```

### 2. Run Smoke Tests

```bash
# Test discovery scan
curl -X POST https://app.aethos.com/api/discovery/scan \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -d '{"tenantId": "test-uuid"}'

# Test semantic search
curl -X POST https://app.aethos.com/api/intelligence/semantic-search \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -d '{"query": "test", "tenantId": "test-uuid"}'

# Test retention policy
curl -X POST https://app.aethos.com/api/compliance/retention-policies \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -d '{
    "action": "create",
    "tenant_id": "test-uuid",
    "name": "Test Policy",
    "rule_type": "inactivity",
    "rule_criteria": {"days_inactive": 180},
    "action": "flag",
    "schedule": "daily"
  }'
```

### 3. Load Testing

Use Apache Bench or k6:

```bash
# Install k6
brew install k6  # macOS
# or https://k6.io/docs/getting-started/installation/

# Run load test
k6 run loadtest.js

# loadtest.js
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
};

export default function () {
  let res = http.get('https://app.aethos.com/api/health');
  check(res, { 'status 200': (r) => r.status === 200 });
}
```

---

## 🚨 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:**
1. Verify `.env` file exists in project root
2. Check Vercel environment variables are set:
   ```bash
   vercel env ls
   ```
3. Redeploy:
   ```bash
   vercel --prod
   ```

### Issue: "MSAL authentication not configured"

**Solution:**
1. Verify Azure app registration completed
2. Check `VITE_MICROSOFT_CLIENT_ID` and `VITE_MICROSOFT_TENANT_ID` are set
3. Ensure redirect URI matches in Azure portal

### Issue: "Semantic search returns empty results"

**Solution:**
1. Verify pgvector extension is installed:
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'vector';
   ```
2. Check embeddings were generated:
   ```sql
   SELECT COUNT(*) FROM content_embeddings WHERE tenant_id = 'your-uuid';
   ```
3. Verify OpenAI API key is valid

### Issue: "Cron jobs not running"

**Solution:**
1. Verify `vercel.json` contains cron configuration
2. Check Vercel plan supports cron (Pro plan required)
3. View cron job logs:
   ```bash
   vercel logs /api/cron/anomaly-detection
   ```

---

## 📈 Post-Launch Checklist

- [ ] Monitor error rates (target: <0.1%)
- [ ] Monitor API response times (target: P95 <500ms)
- [ ] Review Supabase query performance
- [ ] Check OpenAI usage vs budget
- [ ] Setup automated backups (Supabase Point-in-Time Recovery)
- [ ] Configure alerting (email/Slack for critical errors)
- [ ] Document runbook for common incidents
- [ ] Schedule weekly reviews of anomaly detections
- [ ] Plan capacity scaling strategy

---

## 🎉 Deployment Complete!

You now have a **production-ready Aethos deployment** with all V1-V4 features enabled:

✅ V1: Core discovery, workspaces, metadata search  
✅ V1.5: AI-powered semantic search, summarization, PII detection  
✅ V2: Multi-provider integration (Slack, Google Workspace)  
✅ V3: Automated governance and compliance  
✅ V4: Federation for MSPs and public REST API  

**Next steps:**
1. Invite first users
2. Run initial discovery scans
3. Monitor performance metrics
4. Gather user feedback
5. Iterate based on usage patterns

---

**Deployment Support:** engineering@aethos.com  
**Documentation:** https://docs.aethos.com  
**Status Page:** https://status.aethos.com
