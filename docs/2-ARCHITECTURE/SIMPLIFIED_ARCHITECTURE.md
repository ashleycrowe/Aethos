# Aethos: Simplified Production Architecture
## Real-World Deployment Without Enterprise Cloud Subscriptions

Version: 2.0.0 (Codex-Ready / Free-Tier Optimized)
Last Updated: 2026-02-26

---

## 🎯 Core Philosophy: MVP-First, Scale Later

This architecture is designed to be **immediately deployable** using free-tier services and open-source tools. No Azure enterprise subscriptions required.

---

## 📦 Tech Stack (Free Tier Compatible)

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4 (100% free, open source)
- **Animation**: Motion (open source)
- **State**: React Context API (built-in)
- **Deployment**: Vercel (free tier: unlimited hobby projects)

### Backend (Metadata API)
- **Runtime**: Node.js + Express
- **Deployment Options**:
  - **Option A (Free)**: Vercel Serverless Functions (free tier: 100GB-hours/mo)
  - **Option B (Self-hosted)**: Railway.app (free tier: $5 credit/mo)
  - **Option C (Local Dev)**: Docker Compose

### Database
- **Production**: PostgreSQL via **Supabase** (free tier: 500MB database, 2GB bandwidth/mo)
- **Development**: SQLite (zero config, file-based)
- **Schema**: Multi-tenant with `tenant_id` partition key

### Authentication
- **Microsoft 365 Integration**: MSAL.js (Microsoft's official free library)
- **Session Management**: HTTP-only cookies via backend
- **No Azure AD Premium Required**: Uses free Microsoft Entra ID OAuth flow

### AI Features (Optional - Remove for True Free Tier)
- **Oracle Search**: Client-side fuzzy search (fuse.js) for MVP
- **Future**: OpenAI API ($0.002 per 1K tokens) - pay-as-you-go only when needed

---

## 🏗️ Simplified Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    MICROSOFT 365 TENANT                     │
│  (Customer's existing M365 - no additional cost to Aethos)  │
└─────────────────┬───────────────────────────────────────────┘
                  │ Microsoft Graph API (free to call)
                  │
┌─────────────────▼───────────────────────────────────────────┐
│              AETHOS BACKEND (Node.js + Express)             │
│  • Vercel Serverless Functions (free tier)                  │
│  • Environment Variables for secrets (.env)                 │
│  • Routes: /api/scan, /api/containers, /api/workspaces     │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│         DATABASE (PostgreSQL via Supabase Free Tier)        │
│  • Tables: tenants, containers, identities, workspaces     │
│  • Row Level Security (RLS) for tenant isolation           │
│  • 500MB storage (enough for 50+ tenants in MVP)           │
└─────────────────────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│           AETHOS FRONTEND (React + Tailwind)                │
│  • Deployed on Vercel (free tier)                          │
│  • app.aethos.com (custom domain: $12/year)                │
│  • Client-side state management (React Context)            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Multi-Tenant Data Model (Supabase PostgreSQL)

### Table: `tenants`
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  microsoft_tenant_id TEXT UNIQUE NOT NULL,
  org_name TEXT NOT NULL,
  subscription_tier TEXT DEFAULT 'free', -- free, standard, enterprise
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_scan_at TIMESTAMPTZ
);
```

### Table: `containers`
```sql
CREATE TABLE containers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL, -- SharePoint Site ID from Graph API
  title TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'microsoft', 'google', 'slack', etc.
  status TEXT DEFAULT 'active',
  storage_bytes BIGINT DEFAULT 0,
  idle_days INTEGER DEFAULT 0,
  risk_level TEXT DEFAULT 'low',
  metadata JSONB, -- Flexible metadata storage
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_containers_tenant ON containers(tenant_id);
CREATE INDEX idx_containers_external ON containers(tenant_id, external_id);
```

### Table: `workspaces`
```sql
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#FF5733',
  icon TEXT DEFAULT 'Folder',
  intelligence_score INTEGER DEFAULT 0,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `assets` (Files, Channels, Pages)
```sql
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  source_provider TEXT NOT NULL, -- 'microsoft', 'slack', 'google'
  source_id TEXT NOT NULL, -- Provider's ID (e.g., SharePoint Item ID)
  source_url TEXT, -- Direct link to asset
  
  -- Core Metadata
  name TEXT NOT NULL,
  type TEXT DEFAULT 'file', -- 'file', 'folder', 'site', 'channel', 'page'
  mime_type TEXT,
  size_bytes BIGINT DEFAULT 0,
  
  -- People
  author_email TEXT,
  author_name TEXT,
  modified_by_email TEXT,
  
  -- Timestamps
  created_date TIMESTAMPTZ,
  modified_date TIMESTAMPTZ,
  last_accessed_date TIMESTAMPTZ,
  
  -- Location
  location_path TEXT, -- e.g., "Finance Team > Budget > 2024"
  parent_id UUID REFERENCES assets(id),
  
  -- Sharing & Permissions
  is_shared_externally BOOLEAN DEFAULT false,
  share_count INTEGER DEFAULT 0,
  permission_type TEXT DEFAULT 'private', -- 'private', 'team', 'org', 'public'
  
  -- Tags (for workspace auto-sync) - CRITICAL FOR TAG-BASED SYNC
  user_tags TEXT[] DEFAULT '{}', -- Manually assigned by users/admins
  enriched_tags TEXT[] DEFAULT '{}', -- AI-generated tags from Metadata Intelligence Layer
  
  -- Intelligence (Enriched)
  enriched_title TEXT, -- AI-improved title
  intelligence_score INTEGER,
  
  -- Operational Flags
  is_orphaned BOOLEAN DEFAULT false,
  is_duplicate BOOLEAN DEFAULT false,
  is_stale BOOLEAN DEFAULT false,
  
  -- Sync Metadata
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  sync_status TEXT DEFAULT 'active', -- 'active', 'error', 'deleted'
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, source_provider, source_id)
);

CREATE INDEX idx_assets_tenant ON assets(tenant_id);
CREATE INDEX idx_assets_user_tags ON assets USING GIN (user_tags);
CREATE INDEX idx_assets_enriched_tags ON assets USING GIN (enriched_tags);
CREATE INDEX idx_assets_location ON assets(tenant_id, location_path);
CREATE INDEX idx_assets_stale ON assets(tenant_id, is_stale) WHERE is_stale = true;
```

### Table: `workspace_assets` (Join Table)
```sql
CREATE TABLE workspace_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  added_by TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  pinned BOOLEAN DEFAULT false,
  notes TEXT,
  UNIQUE(workspace_id, asset_id)
);

CREATE INDEX idx_workspace_assets_workspace ON workspace_assets(workspace_id);
CREATE INDEX idx_workspace_assets_asset ON workspace_assets(asset_id);
```

### Table: `sync_rules` (Tag-Based Auto-Sync)
```sql
CREATE TABLE sync_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  rule_type TEXT NOT NULL, -- 'location', 'tag', 'author', 'keyword'
  enabled BOOLEAN DEFAULT true,
  
  -- Location-based rule
  location_path TEXT,
  
  -- Tag-based rule (NEW - enables smart workspace organization)
  tags_include_all TEXT[], -- Must have ALL these tags (AND logic)
  tags_include_any TEXT[], -- Must have ANY of these tags (OR logic)
  tags_exclude TEXT[], -- Must NOT have these tags
  
  -- Author-based rule
  author_emails TEXT[],
  
  -- Keyword-based rule (AI+ tier)
  keywords TEXT[],
  
  -- Filters
  file_types TEXT[],
  min_size_bytes BIGINT,
  max_size_bytes BIGINT,
  date_after TIMESTAMPTZ,
  date_before TIMESTAMPTZ,
  exclude_locations TEXT[],
  
  -- Behavior
  auto_add BOOLEAN DEFAULT true,
  auto_remove BOOLEAN DEFAULT false,
  max_files INTEGER DEFAULT 500, -- Safety limit
  
  -- Audit
  last_run TIMESTAMPTZ,
  files_added_count INTEGER DEFAULT 0,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sync_rules_workspace ON sync_rules(workspace_id);
CREATE INDEX idx_sync_rules_enabled ON sync_rules(workspace_id, enabled) WHERE enabled = true;
```

### Row-Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE containers ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_rules ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see data from their tenant
CREATE POLICY tenant_isolation ON containers
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON assets
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON workspaces
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation ON workspace_assets
  FOR ALL
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE tenant_id = current_setting('app.current_tenant_id')::uuid
  ));

CREATE POLICY tenant_isolation ON sync_rules
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

---

## 🔐 Authentication Flow (Free Microsoft Entra ID)

### Step 1: Frontend MSAL Configuration
```typescript
// src/app/config/msal.config.ts
import { Configuration } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.VITE_MSAL_CLIENT_ID!, // Free Azure AD app registration
    authority: 'https://login.microsoftonline.com/common', // Multi-tenant
    redirectUri: 'https://app.aethos.com/auth/callback',
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
};
```

### Step 2: Backend Validates JWT
```typescript
// backend/middleware/auth.ts
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: 'https://login.microsoftonline.com/common/discovery/v2.0/keys',
});

export async function validateMSALToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  const decoded = jwt.decode(token, { complete: true });
  const key = await client.getSigningKey(decoded.header.kid);
  
  jwt.verify(token, key.getPublicKey(), (err, payload) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = payload;
    req.tenantId = payload.tid; // Microsoft Tenant ID
    next();
  });
}
```

---

## 📊 Microsoft Graph API Integration (No Additional Cost)

### Permissions Required (Free - No Premium Needed)
- `Sites.Read.All` - Read SharePoint site metadata
- `Group.Read.All` - Read Teams and Groups
- `User.ReadBasic.All` - Read user profiles

### Backend Route: Scan Tenant
```typescript
// backend/routes/scan.ts
import { Client } from '@microsoft/microsoft-graph-client';

export async function scanTenant(req, res) {
  const { tenantId } = req.user;
  
  // Initialize Graph client with delegated permissions
  const client = Client.init({
    authProvider: (done) => {
      done(null, req.headers.authorization.split(' ')[1]);
    },
  });

  try {
    // Fetch all SharePoint sites
    const sites = await client.api('/sites').get();
    
    // Store metadata in Supabase
    for (const site of sites.value) {
      await supabase.from('containers').upsert({
        tenant_id: tenantId,
        external_id: site.id,
        title: site.displayName,
        provider: 'microsoft',
        storage_bytes: site.quota?.used || 0,
        metadata: { webUrl: site.webUrl },
      });
    }

    res.json({ scanned: sites.value.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## 💰 Cost Breakdown (Monthly)

| Service | Free Tier Limit | Estimated Cost |
|---------|----------------|----------------|
| **Vercel (Frontend)** | Unlimited hobby projects | $0 |
| **Vercel Functions (Backend)** | 100GB-hours/mo | $0 |
| **Supabase (Database)** | 500MB, 2GB bandwidth | $0 |
| **Domain Name** | N/A | $1/mo (amortized) |
| **Microsoft Graph API Calls** | No cost (uses customer's M365) | $0 |
| **Total for MVP (0-50 tenants)** | | **$1/mo** |

### When You Need to Scale (100+ Tenants)
- Supabase Pro: $25/mo (8GB database, 50GB bandwidth)
- Vercel Pro: $20/mo (unlimited team members, analytics)
- **Total: $45/mo** for 100-500 tenants

---

## 🚀 Deployment Steps (30 Minutes)

### 1. Database Setup (Supabase)
```bash
# Sign up at supabase.com (free)
# Create new project
# Copy connection string to .env
```

### 2. Backend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd backend
vercel --prod

# Set environment variables in Vercel dashboard
# SUPABASE_URL, SUPABASE_KEY, MSAL_CLIENT_ID, MSAL_CLIENT_SECRET
```

### 3. Frontend Deployment (Vercel)
```bash
cd frontend
vercel --prod
```

### 4. Microsoft App Registration (Azure Portal - Free)
- Go to portal.azure.com
- Create "App Registration"
- Set Redirect URI: `https://app.aethos.com/auth/callback`
- Copy Client ID and Secret
- Add to Vercel environment variables

---

## 🧪 Local Development (Zero Cloud Costs)

```bash
# Start PostgreSQL locally
docker-compose up -d postgres

# Run migrations
npm run migrate

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev
```

---

## 🔄 What We Removed from Original Azure Architecture

| Original (Azure Enterprise) | Simplified (Free Tier) |
|-----------------------------|------------------------|
| Azure Functions ($$$) | Vercel Serverless (free) |
| Cosmos DB ($$$) | Supabase PostgreSQL (free) |
| Azure Key Vault ($) | Environment Variables |
| Azure OpenAI ($$$) | Client-side search (free) |
| Application Insights ($$) | Console.log for MVP |
| Azure Static Web Apps ($$) | Vercel (free) |

**Savings: $200-500/month for MVP phase**

---

## 📈 Migration Path to Azure (When You're Ready)

When you have 500+ tenants and revenue, you can migrate to Azure:

1. **Database**: Supabase → Azure PostgreSQL Flexible Server
2. **Backend**: Vercel Functions → Azure Functions
3. **Secrets**: .env → Azure Key Vault
4. **Monitoring**: Console → Application Insights

But this architecture is **production-ready** for your first 1,000 customers.

---

## ✅ What's Still Enterprise-Grade

- ✅ Multi-tenant data isolation
- ✅ Microsoft Entra ID SSO
- ✅ Microsoft Graph API integration
- ✅ GDPR-compliant (metadata-only storage)
- ✅ Row-Level Security (Supabase RLS)
- ✅ Zero-downtime deployments (Vercel)

---

## 🎓 Why This Works for Real Deployment

1. **No Credit Card Required**: Can build entire MVP without paying anything
2. **AppSource Compatible**: Still works with Microsoft 365 marketplace
3. **Scales to Revenue**: Free tier handles 50+ pilot customers
4. **Professional Grade**: Vercel/Supabase used by YC startups and enterprises
5. **Quick Iteration**: Deploy in seconds, not hours

---

## 📝 Next Steps

1. **Create Supabase project**: supabase.com/dashboard
2. **Register Azure AD app**: portal.azure.com (free)
3. **Deploy to Vercel**: Connect GitHub repo, auto-deploys
4. **Add first test tenant**: Use your own M365 account

**Time to Production: 2-4 hours** (vs 2-4 weeks with full Azure setup)
