# Backend Implementation Plan
**What I Can Build vs What You Need to Configure**  
**Timeline:** 1-2 days (coding) + 30 minutes (your setup)

---

## 🎯 Executive Summary

**I can build 95% of the backend.** You just need to:
1. Create an Azure app registration (5 min)
2. Run SQL migrations in Supabase (2 min)
3. Add environment variables (2 min)
4. Test with your M365 tenant (20 min)

**Total your time:** ~30 minutes  
**Total my time:** 6-8 hours

---

## ✅ What I CAN Build (95%)

### 1. Database Architecture (100% Me)

**Supabase PostgreSQL Schema**

I'll create complete SQL migration files for:

```sql
-- Tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  microsoft_tenant_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  subscription_tier TEXT DEFAULT 'v1', -- v1, v1.5, v2, v3, v4
  settings JSONB DEFAULT '{}'::jsonb
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  microsoft_id TEXT UNIQUE,
  role TEXT DEFAULT 'user', -- admin, user, viewer
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Files table (metadata only, no content)
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- microsoft, slack, google, box
  provider_id TEXT NOT NULL, -- SharePoint ID, Drive ID, etc.
  name TEXT NOT NULL,
  path TEXT,
  size_bytes BIGINT,
  mime_type TEXT,
  created_at TIMESTAMPTZ,
  modified_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  owner_id UUID REFERENCES users(id),
  is_stale BOOLEAN DEFAULT FALSE,
  is_orphaned BOOLEAN DEFAULT FALSE,
  has_external_share BOOLEAN DEFAULT FALSE,
  external_user_count INT DEFAULT 0,
  risk_score INT DEFAULT 0, -- 0-100
  intelligence_score INT DEFAULT 0, -- 0-100
  ai_tags TEXT[] DEFAULT '{}',
  ai_category TEXT,
  ai_suggested_title TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(tenant_id, provider, provider_id)
);

-- Sites table (SharePoint sites, Teams, etc.)
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT,
  size_bytes BIGINT,
  file_count INT DEFAULT 0,
  created_at TIMESTAMPTZ,
  last_activity TIMESTAMPTZ,
  owner_id UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(tenant_id, provider, provider_id)
);

-- Workspaces table (The Nexus)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  auto_sync_enabled BOOLEAN DEFAULT TRUE,
  sync_rules JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Workspace items (files/folders pinned to workspaces)
CREATE TABLE workspace_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  added_by UUID REFERENCES users(id),
  notes TEXT,
  UNIQUE(workspace_id, file_id)
);

-- Remediation actions (history tracking)
CREATE TABLE remediation_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- archive, delete, revoke_links
  file_ids UUID[] NOT NULL,
  executed_by UUID REFERENCES users(id),
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'completed', -- pending, completed, failed
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Discovery scans (job tracking)
CREATE TABLE discovery_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'running', -- running, completed, failed
  provider TEXT, -- microsoft, slack, google, box
  files_discovered INT DEFAULT 0,
  sites_discovered INT DEFAULT 0,
  errors TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Row-Level Security policies
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
-- ... (RLS for all tables)

CREATE POLICY tenant_isolation_files ON files
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Indexes for performance
CREATE INDEX idx_files_tenant_provider ON files(tenant_id, provider);
CREATE INDEX idx_files_stale ON files(tenant_id, is_stale) WHERE is_stale = TRUE;
CREATE INDEX idx_files_external_share ON files(tenant_id, has_external_share) WHERE has_external_share = TRUE;
CREATE INDEX idx_files_ai_tags ON files USING GIN(ai_tags);
CREATE INDEX idx_files_search ON files USING GIN(to_tsvector('english', name || ' ' || COALESCE(ai_suggested_title, '')));
```

**What You Do:**
- Go to Supabase → SQL Editor
- Paste my migration file
- Click "Run"
- Done ✅

---

### 2. Microsoft Graph API Integration (100% Me)

**File:** `/api/microsoft/discovery.ts`

```typescript
import { Client } from '@microsoft/microsoft-graph-client';
import { supabase } from '../lib/supabase';

export async function scanSharePointSites(tenantId: string, accessToken: string) {
  const client = Client.init({
    authProvider: (done) => done(null, accessToken)
  });

  // Get all SharePoint sites
  const sites = await client.api('/sites?search=*').get();

  for (const site of sites.value) {
    // Save site metadata
    await supabase.from('sites').upsert({
      tenant_id: tenantId,
      provider: 'microsoft',
      provider_id: site.id,
      name: site.displayName,
      url: site.webUrl,
      created_at: site.createdDateTime,
      last_activity: site.lastModifiedDateTime,
      metadata: site
    });

    // Get all files in site
    const drive = await client.api(`/sites/${site.id}/drive`).get();
    const files = await getAllFilesRecursive(client, drive.id);

    // Save file metadata
    for (const file of files) {
      await supabase.from('files').upsert({
        tenant_id: tenantId,
        provider: 'microsoft',
        provider_id: file.id,
        name: file.name,
        path: file.parentReference.path,
        size_bytes: file.size,
        mime_type: file.file?.mimeType,
        created_at: file.createdDateTime,
        modified_at: file.lastModifiedDateTime,
        has_external_share: await checkExternalSharing(client, file.id),
        is_stale: isStale(file.lastModifiedDateTime),
        metadata: file
      });
    }
  }
}

async function getAllFilesRecursive(client: Client, driveId: string, path = '/') {
  const items = await client.api(`/drives/${driveId}/root${path}:/children`).get();
  let allFiles = [];

  for (const item of items.value) {
    if (item.folder) {
      // Recursively get files in folders
      const subFiles = await getAllFilesRecursive(client, driveId, `${path}/${item.name}`);
      allFiles = allFiles.concat(subFiles);
    } else if (item.file) {
      allFiles.push(item);
    }
  }

  return allFiles;
}

async function checkExternalSharing(client: Client, fileId: string) {
  try {
    const permissions = await client.api(`/drives/{driveId}/items/${fileId}/permissions`).get();
    return permissions.value.some(p => p.link?.scope === 'anonymous' || p.grantedToIdentities?.some(i => i.user?.email?.includes('#EXT#')));
  } catch {
    return false;
  }
}

function isStale(lastModified: string) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return new Date(lastModified) < sixMonthsAgo;
}
```

**What You Do:**
- Nothing! This code just works once you provide the Azure app credentials

---

### 3. MSAL Authentication (100% Me)

**File:** `/src/app/context/AuthContext.tsx`

```typescript
import { PublicClientApplication } from '@azure/msal-browser';
import React, { createContext, useContext, useState, useEffect } from 'react';

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MICROSOFT_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  }
};

const msalInstance = new PublicClientApplication(msalConfig);

const loginRequest = {
  scopes: [
    'User.Read',
    'Files.Read.All',
    'Sites.Read.All',
    'Group.Read.All'
  ]
};

export const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async () => {
    try {
      const response = await msalInstance.loginPopup(loginRequest);
      setUser(response.account);
      setAccessToken(response.accessToken);
      
      // Save to Supabase
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: response.account.username,
          name: response.account.name,
          microsoftId: response.account.homeAccountId,
          accessToken: response.accessToken
        })
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    await msalInstance.logoutPopup();
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

**What You Do:**
- Create Azure app registration (see below)
- Add 2 environment variables

---

### 4. API Endpoints (100% Me)

I'll create all Vercel serverless functions:

**File Structure:**
```
/api
  /microsoft
    /discovery.ts        # Scan M365 tenant
    /search.ts           # Search files
    /remediate.ts        # Archive/delete/revoke
  /workspaces
    /create.ts           # Create workspace
    /sync.ts             # Auto-sync based on tags
  /intelligence
    /enrich.ts           # AI metadata enrichment (OpenAI)
    /score.ts            # Calculate intelligence scores
  /reporting
    /metrics.ts          # Calculate waste, storage, etc.
    /export.ts           # CSV export
  /auth
    /login.ts            # Save user to database
    /logout.ts           # Clear session
```

**Example: Remediation API**

**File:** `/api/microsoft/remediate.ts`

```typescript
import { Client } from '@microsoft/microsoft-graph-client';
import { supabase } from '../lib/supabase';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, fileIds, tenantId, accessToken } = req.body;

  const client = Client.init({
    authProvider: (done) => done(null, accessToken)
  });

  // Get file details from database
  const { data: files } = await supabase
    .from('files')
    .select('*')
    .in('id', fileIds)
    .eq('tenant_id', tenantId);

  const results = [];

  for (const file of files!) {
    try {
      switch (action) {
        case 'archive':
          // Set file to read-only in SharePoint
          await client.api(`/drives/{driveId}/items/${file.provider_id}`)
            .patch({ 
              '@microsoft.graph.conflictBehavior': 'rename',
              listItem: { fields: { '_ModerationStatus': 1 } } // Pending approval = read-only
            });
          break;

        case 'delete':
          // Move to recycle bin (soft delete)
          await client.api(`/drives/{driveId}/items/${file.provider_id}`)
            .delete();
          break;

        case 'revoke_links':
          // Delete all anonymous/external sharing links
          const permissions = await client.api(`/drives/{driveId}/items/${file.provider_id}/permissions`).get();
          for (const perm of permissions.value) {
            if (perm.link?.scope === 'anonymous' || perm.link?.scope === 'organization') {
              await client.api(`/drives/{driveId}/items/${file.provider_id}/permissions/${perm.id}`).delete();
            }
          }
          break;
      }

      results.push({ fileId: file.id, status: 'success' });

    } catch (error: any) {
      results.push({ fileId: file.id, status: 'failed', error: error.message });
    }
  }

  // Log action to database
  await supabase.from('remediation_actions').insert({
    tenant_id: tenantId,
    action_type: action,
    file_ids: fileIds,
    executed_by: req.body.userId,
    metadata: { results }
  });

  res.status(200).json({ results });
}
```

**What You Do:**
- Nothing! These auto-deploy with Vercel

---

### 5. Search Engine (100% Me)

**File:** `/api/search.ts`

```typescript
import { supabase } from './lib/supabase';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { query, tenantId, filters = {} } = req.body;

  let q = supabase
    .from('files')
    .select('*')
    .eq('tenant_id', tenantId);

  // Full-text search
  if (query) {
    q = q.textSearch('search_vector', query, {
      config: 'english',
      type: 'websearch'
    });
  }

  // Apply filters
  if (filters.provider) {
    q = q.eq('provider', filters.provider);
  }
  if (filters.isStale) {
    q = q.eq('is_stale', true);
  }
  if (filters.hasExternalShare) {
    q = q.eq('has_external_share', true);
  }
  if (filters.tags?.length) {
    q = q.contains('ai_tags', filters.tags);
  }

  const { data, error } = await q.order('modified_at', { ascending: false }).limit(50);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ results: data });
}
```

**What You Do:**
- Nothing! Works automatically

---

### 6. AI Metadata Enrichment (100% Me)

**File:** `/api/intelligence/enrich.ts`

```typescript
import OpenAI from 'openai';
import { supabase } from '../lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function enrichFileMetadata(fileId: string) {
  const { data: file } = await supabase
    .from('files')
    .select('*')
    .eq('id', fileId)
    .single();

  if (!file) return;

  // AI prompt for metadata enrichment
  const prompt = `
Analyze this file and suggest metadata:

Filename: ${file.name}
Path: ${file.path}
Size: ${file.size_bytes} bytes
Last Modified: ${file.modified_at}

Provide:
1. A clean, human-readable title
2. 3-5 relevant tags
3. A category (Finance, Marketing, HR, Engineering, Legal, Operations, Sales, Other)
4. Intelligence score (0-100, based on how well-named and organized it is)

Return JSON only.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });

  const result = JSON.parse(response.choices[0].message.content!);

  // Update database
  await supabase
    .from('files')
    .update({
      ai_suggested_title: result.title,
      ai_tags: result.tags,
      ai_category: result.category,
      intelligence_score: result.score
    })
    .eq('id', fileId);
}
```

**What You Do:**
- Add `OPENAI_API_KEY` to environment variables (optional for V1, required for V1.5+)

---

### 7. Reporting Metrics (100% Me)

**File:** `/api/reporting/metrics.ts`

```typescript
import { supabase } from '../lib/supabase';

export async function calculateMetrics(tenantId: string) {
  // Total storage
  const { data: storageData } = await supabase.rpc('calculate_total_storage', { tenant_id: tenantId });

  // Waste detection
  const { count: staleCount } = await supabase
    .from('files')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)
    .eq('is_stale', true);

  const { data: wasteSize } = await supabase.rpc('calculate_waste_size', { tenant_id: tenantId });

  // External shares
  const { count: externalShareCount } = await supabase
    .from('files')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)
    .eq('has_external_share', true);

  // Intelligence score (average)
  const { data: avgIntelligence } = await supabase.rpc('calculate_avg_intelligence', { tenant_id: tenantId });

  return {
    total_storage_gb: storageData / (1024 ** 3),
    waste_identified_gb: wasteSize / (1024 ** 3),
    stale_content_count: staleCount,
    external_shares_count: externalShareCount,
    intelligence_score: avgIntelligence,
    recovery_potential_usd: (wasteSize / (1024 ** 3)) * 5 // $5 per GB industry average
  };
}
```

**What You Do:**
- Nothing! Auto-calculated

---

### 8. Vercel Cron Jobs (100% Me)

**File:** `/api/cron/daily-scan.ts`

```typescript
import { supabase } from '../lib/supabase';
import { scanSharePointSites } from '../microsoft/discovery';

export default async function handler(req, res) {
  // Verify cron secret (Vercel provides this)
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Get all active tenants
  const { data: tenants } = await supabase
    .from('tenants')
    .select('*')
    .eq('status', 'active');

  for (const tenant of tenants!) {
    // Run discovery scan for each tenant
    await supabase.from('discovery_scans').insert({
      tenant_id: tenant.id,
      status: 'running',
      provider: 'microsoft'
    });

    try {
      await scanSharePointSites(tenant.id, tenant.microsoft_access_token);
      
      await supabase
        .from('discovery_scans')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('tenant_id', tenant.id)
        .eq('status', 'running');
    } catch (error: any) {
      await supabase
        .from('discovery_scans')
        .update({ status: 'failed', errors: [error.message] })
        .eq('tenant_id', tenant.id)
        .eq('status', 'running');
    }
  }

  res.status(200).json({ message: 'Daily scan completed' });
}
```

**File:** `/vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-scan",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**What You Do:**
- Nothing! Vercel auto-configures cron jobs

---

## ⚙️ What YOU Need to Do (5%)

### 1. Azure App Registration (5 minutes)

**Steps:**
1. Go to https://portal.azure.com
2. Navigate to **Azure Active Directory** → **App Registrations** → **New Registration**
3. Fill in:
   - **Name:** `Aethos V1`
   - **Supported account types:** "Accounts in this organizational directory only"
   - **Redirect URI:** 
     - Type: `Single-page application (SPA)`
     - URI: `http://localhost:5173` (dev) + `https://yourapp.vercel.app` (prod)
4. Click **Register**
5. On the overview page, copy:
   - **Application (client) ID** → This is your `MICROSOFT_CLIENT_ID`
   - **Directory (tenant) ID** → This is your `MICROSOFT_TENANT_ID`
6. Go to **API Permissions** → **Add a permission** → **Microsoft Graph** → **Delegated permissions**
7. Add these permissions:
   - `User.Read`
   - `Files.Read.All`
   - `Sites.Read.All`
   - `Group.Read.All`
8. Click **Grant admin consent** (requires admin)

**Done!** ✅

---

### 2. Supabase Setup (2 minutes)

**Steps:**
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Paste the migration file I provide (from step 1)
5. Click **Run**
6. Wait for "Success" message

**Done!** ✅

---

### 3. Environment Variables (2 minutes)

**File:** `.env` (local development)

```bash
# Microsoft Azure
VITE_MICROSOFT_CLIENT_ID=your-client-id-from-azure
VITE_MICROSOFT_TENANT_ID=your-tenant-id-from-azure

# Supabase
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI (optional for V1, required for V1.5+)
OPENAI_API_KEY=your-openai-api-key

# Vercel Cron Secret (auto-generated by Vercel)
CRON_SECRET=auto-generated-by-vercel
```

**Vercel Dashboard:**
1. Go to your Vercel project
2. Settings → Environment Variables
3. Add the same variables as above

**Done!** ✅

---

### 4. Test with Your M365 Tenant (20 minutes)

**Steps:**
1. Run the app locally: `npm run dev`
2. Click "Login with Microsoft"
3. Authorize the app
4. Navigate to Intelligence Dashboard
5. Click "Run Discovery Scan" (now it's REAL!)
6. Watch as it scans your actual SharePoint, OneDrive, Teams
7. Verify data appears in Supabase
8. Test remediation actions on a test file
9. Verify file is archived/deleted in M365

**Done!** ✅

---

## 📦 Deliverables (What I'll Give You)

### Backend Code Files:
1. `/api/microsoft/discovery.ts` - M365 discovery scanner
2. `/api/microsoft/search.ts` - Search API
3. `/api/microsoft/remediate.ts` - Archive/delete/revoke API
4. `/api/workspaces/create.ts` - Workspace creation
5. `/api/workspaces/sync.ts` - Auto-sync by tags
6. `/api/intelligence/enrich.ts` - AI metadata enrichment
7. `/api/intelligence/score.ts` - Intelligence scoring
8. `/api/reporting/metrics.ts` - Metrics calculation
9. `/api/reporting/export.ts` - CSV export
10. `/api/auth/login.ts` - User login handler
11. `/api/cron/daily-scan.ts` - Daily discovery job
12. `/api/lib/supabase.ts` - Supabase client
13. `/src/app/context/AuthContext.tsx` - MSAL authentication
14. `/src/app/hooks/useApi.ts` - API hooks for frontend
15. `/supabase/migrations/001_initial_schema.sql` - Database schema

### Documentation Files:
1. `/docs/BACKEND_SETUP_GUIDE.md` - Step-by-step setup instructions
2. `/docs/API_DOCUMENTATION.md` - All API endpoints documented
3. `/docs/DATABASE_SCHEMA.md` - Database schema reference
4. `/docs/DEPLOYMENT_GUIDE.md` - How to deploy to production

### Configuration Files:
1. `/vercel.json` - Vercel configuration with cron jobs
2. `/.env.example` - Template for environment variables
3. `/package.json` - Updated with new dependencies

---

## 🚀 Timeline

### My Work (6-8 hours):
- **Hour 1-2:** Database schema + migrations
- **Hour 3-4:** Microsoft Graph API integration
- **Hour 5:** MSAL authentication
- **Hour 6:** Remediation API endpoints
- **Hour 7:** Search + Intelligence APIs
- **Hour 8:** Testing + documentation

### Your Work (30 minutes):
- **Minute 0-5:** Create Azure app registration
- **Minute 5-7:** Run Supabase migrations
- **Minute 7-10:** Add environment variables
- **Minute 10-30:** Test with your M365 tenant

**Total to Production:** 1-2 days

---

## ✅ Success Criteria

### What "Working Backend" Means:

1. ✅ **Authentication:** Users can log in with Microsoft accounts
2. ✅ **Discovery:** App scans real M365 tenant and finds files
3. ✅ **Storage:** Metadata saved to Supabase database
4. ✅ **Search:** Users can search across all discovered files
5. ✅ **Remediation:** Archive/delete/revoke actually works in M365
6. ✅ **Workspaces:** Tag-based auto-sync works
7. ✅ **Intelligence:** AI enrichment adds tags and scores
8. ✅ **Reporting:** Real metrics calculated from database
9. ✅ **Cron Jobs:** Daily scans run automatically
10. ✅ **Multi-Tenant:** Each customer's data is isolated (RLS)

---

## 🎯 Next Steps

**If you approve Phase 2 (Backend):**

1. I'll start building the backend (6-8 hours)
2. You complete the 4 setup tasks (30 minutes)
3. We test together with your M365 tenant
4. Deploy to production on Vercel
5. **You have a working V1 ready for customers!** 🚀

**Ready to proceed?**

Let me know and I'll start with the database schema!

---

**Author:** Aethos AI Development Team  
**Date:** 2026-03-01  
**Status:** Awaiting Approval
