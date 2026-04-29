# [STANDARD] Aethos Data Management & Caching Standards
## Metadata Pointers & Multi-Tenant Database Governance

---
status: Active
type: Core Strategic Standard
phase: All Phases
audience: [Architecture, Data Engineers, Developers]
priority: Critical
last_updated: 2026-02-27
document_id: STD-DATA-001
location: `/docs/3-standards/STD-DATA-001.md`
---

## 📊 The Aethos Data Philosophy

Aethos is a "Pointer System." We never replicate file content; we only cache metadata signals (Graph delta links, storage quotas, and activity scores). Data must be fresh enough for governance decisions but cached enough to respect Microsoft Graph throttling limits.

**Architecture Context:** Supabase PostgreSQL with Row-Level Security (RLS) for multi-tenant isolation. See `/docs/2-ARCHITECTURE/SIMPLIFIED_ARCHITECTURE.md`

---

## 🚨 MANDATORY CRITICAL RULES

1. **MULTI-TENANT BY DEFAULT:** Every database table MUST include a `tenant_id` column with RLS policies enforcing isolation. See `STD-SEC-001.md`.

2. **TIERED ADAPTER LOGIC:** Data ingestion follows a strict hierarchy:
   - **Tier 1 (Anchor):** M365 & Slack. Deep metadata + full write-back capabilities.
   - **Tier 2 (Discovery):** Google/Box. Metadata-only. Restricted to discovery/leakage signals.

3. **GRAPH IS SOURCE OF TRUTH:** Microsoft Graph is the authoritative source for all Tier 1 tenant metadata. Local overrides (in Supabase) are only for "Virtual Workspace" (Nexus) logic.

4. **MANDATORY TTL:** No data entry can exist in cache indefinitely:
   - *Waste Metrics:* 1 Hour TTL
   - *Org Structure:* 24 Hour TTL
   - *User Presence:* 5 Minute TTL

5. **DELTA SYNC ONLY:** Periodic scans of "Ghost Towns" MUST use OData Delta Links to minimize bandwidth and API cost.

6. **PII MINIMALISM:** Any PII (names, emails) cached for performance must be hashed or redacted if not actively used for a displayed insight.

7. **TIERED RETRIEVAL:** Always check In-Memory Cache → Supabase → Microsoft Graph.

---

## 🗄️ Database Schema Standards

### Multi-Tenant Table Structure

**Every table must follow this pattern:**

```sql
CREATE TABLE [table_name] (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  -- Table-specific columns
  ...
);

-- Create index for tenant_id (critical for performance)
CREATE INDEX idx_[table_name]_tenant ON [table_name](tenant_id);

-- Enable Row-Level Security
ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their tenant's data
CREATE POLICY tenant_isolation_[table_name] ON [table_name]
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

### Core Tables

#### 1. Tenants Table
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  microsoft_tenant_id TEXT UNIQUE NOT NULL, -- M365 tenant ID
  name TEXT NOT NULL,
  domain TEXT,
  subscription_tier TEXT DEFAULT 'base', -- 'base' or 'ai_plus'
  subscription_status TEXT DEFAULT 'active', -- 'active', 'suspended', 'cancelled'
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  microsoft_user_id TEXT NOT NULL, -- UPN or object ID
  email TEXT NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'viewer', -- 'viewer', 'curator', 'architect', 'admin'
  is_admin BOOLEAN DEFAULT false,
  preferences JSONB DEFAULT '{}',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, microsoft_user_id)
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_users ON users
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

#### 3. Containers Table (Sites, Channels, Folders)
```sql
CREATE TABLE containers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'microsoft', 'slack', 'google', 'box'
  provider_id TEXT NOT NULL, -- External ID from provider
  container_type TEXT NOT NULL, -- 'site', 'channel', 'folder'
  name TEXT NOT NULL,
  url TEXT,
  parent_id UUID REFERENCES containers(id),
  
  -- Metadata
  size_bytes BIGINT DEFAULT 0,
  file_count INTEGER DEFAULT 0,
  last_modified_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  
  -- Intelligence scores
  intelligence_score INTEGER, -- 0-100
  waste_score INTEGER, -- 0-100
  risk_score INTEGER, -- 0-100
  
  -- Status
  is_archived BOOLEAN DEFAULT false,
  is_ghost_town BOOLEAN DEFAULT false,
  dormancy_days INTEGER,
  
  metadata JSONB DEFAULT '{}',
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, provider, provider_id)
);

CREATE INDEX idx_containers_tenant ON containers(tenant_id);
CREATE INDEX idx_containers_provider ON containers(provider);
CREATE INDEX idx_containers_ghost_town ON containers(tenant_id, is_ghost_town) WHERE is_ghost_town = true;
CREATE INDEX idx_containers_intelligence ON containers(tenant_id, intelligence_score);

ALTER TABLE containers ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_containers ON containers
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

#### 4. Workspaces Table
```sql
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id),
  
  -- Intelligence
  intelligence_score INTEGER,
  
  -- Auto-sync tags
  auto_sync_enabled BOOLEAN DEFAULT false,
  sync_tags TEXT[] DEFAULT '{}',
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_workspaces_tenant ON workspaces(tenant_id);
CREATE INDEX idx_workspaces_owner ON workspaces(owner_id);

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_workspaces ON workspaces
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

#### 5. Workspace Containers (Junction Table)
```sql
CREATE TABLE workspace_containers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  container_id UUID NOT NULL REFERENCES containers(id) ON DELETE CASCADE,
  
  -- Aethos-specific metadata
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  
  added_at TIMESTAMPTZ DEFAULT NOW(),
  added_by UUID REFERENCES users(id),
  
  UNIQUE(workspace_id, container_id)
);

CREATE INDEX idx_workspace_containers_workspace ON workspace_containers(workspace_id);
CREATE INDEX idx_workspace_containers_container ON workspace_containers(container_id);
CREATE INDEX idx_workspace_containers_tenant ON workspace_containers(tenant_id);

ALTER TABLE workspace_containers ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_workspace_containers ON workspace_containers
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

#### 6. Sync Jobs Table
```sql
CREATE TABLE sync_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL, -- 'full_scan', 'delta_sync', 'workspace_sync'
  provider TEXT NOT NULL, -- 'microsoft', 'slack', 'google'
  status TEXT DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  
  -- Progress tracking
  total_items INTEGER,
  processed_items INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  
  -- Delta sync
  delta_link TEXT,
  
  -- Timing
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sync_jobs_tenant ON sync_jobs(tenant_id);
CREATE INDEX idx_sync_jobs_status ON sync_jobs(status);

ALTER TABLE sync_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_sync_jobs ON sync_jobs
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

## 💾 Caching Strategy

### Cache Layers

1. **In-Memory Cache (React State)**
   - Duration: Component lifetime
   - Use for: UI state, temporary filters
   - Implementation: React Context API, useState

2. **Session Storage (Browser)**
   - Duration: Browser session
   - Use for: Site metadata, user preferences
   - Max size: 5MB

3. **Database Cache (Supabase)**
   - Duration: Defined TTL per table
   - Use for: Metadata pointers, intelligence scores
   - Implementation: `synced_at` timestamps

4. **Microsoft Graph (Source of Truth)**
   - Duration: N/A (always fresh)
   - Use for: Authoritative data, delta syncs
   - Rate limit: Respect 429 throttling

### Cache Durations

| Data Type | TTL | Storage Tier | Refresh Trigger |
| :--- | :--- | :--- | :--- |
| **Waste Projections** | 1 Hour | Supabase | Manual sync |
| **Site Metadata** | 4 Hours | Supabase | Delta sync (every 4h) |
| **Activity Signals** | 15 Mins | In-Memory | User action |
| **Workspace Links** | 12 Hours | Supabase | Container update |
| **User Permissions** | 24 Hours | Supabase | Role change |
| **Intelligence Scores** | 1 Hour | Supabase | Recalculation |

### Cache Invalidation

```typescript
// /src/app/services/cache/cacheManager.ts

interface CacheEntry<T> {
  data: T;
  timestamp: Date;
  ttl: number; // milliseconds
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  
  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: new Date(),
      ttl
    });
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const age = Date.now() - entry.timestamp.getTime();
    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheManager = new CacheManager();
```

---

## 🔄 Data Sync Patterns

### Delta Sync Implementation

```typescript
// /src/app/services/microsoft/deltaSync.ts

interface DeltaSyncResult {
  items: Container[];
  deltaLink: string;
  hasMore: boolean;
}

export async function performDeltaSync(
  tenantId: string,
  provider: 'microsoft' | 'slack'
): Promise<DeltaSyncResult> {
  // Get last delta link from database
  const lastJob = await supabase
    .from('sync_jobs')
    .select('delta_link')
    .eq('tenant_id', tenantId)
    .eq('provider', provider)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  const deltaLink = lastJob?.delta_link;
  
  // Call Microsoft Graph with delta link
  const url = deltaLink || `https://graph.microsoft.com/v1.0/sites/delta`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  const data = await response.json();
  
  // Update database with changes
  const items = data.value.map(site => ({
    tenant_id: tenantId,
    provider: 'microsoft',
    provider_id: site.id,
    name: site.displayName,
    url: site.webUrl,
    last_modified_at: site.lastModifiedDateTime,
    synced_at: new Date()
  }));
  
  // Upsert containers
  await supabase
    .from('containers')
    .upsert(items, {
      onConflict: 'tenant_id,provider,provider_id'
    });
  
  // Store new delta link
  const newDeltaLink = data['@odata.deltaLink'];
  if (newDeltaLink) {
    await supabase
      .from('sync_jobs')
      .insert({
        tenant_id: tenantId,
        job_type: 'delta_sync',
        provider,
        status: 'completed',
        delta_link: newDeltaLink,
        processed_items: items.length,
        completed_at: new Date()
      });
  }
  
  return {
    items,
    deltaLink: newDeltaLink,
    hasMore: !!data['@odata.nextLink']
  };
}
```

---

## 🔍 Query Optimization

### Indexing Strategy

**Always index:**
- `tenant_id` (for RLS performance)
- Foreign keys
- Columns used in WHERE clauses
- Columns used in ORDER BY

**Example:**
```sql
-- Good: Compound index for common query
CREATE INDEX idx_containers_tenant_ghost
  ON containers(tenant_id, is_ghost_town, dormancy_days DESC)
  WHERE is_ghost_town = true;

-- Query that uses this index
SELECT * FROM containers
WHERE tenant_id = '...'
  AND is_ghost_town = true
ORDER BY dormancy_days DESC;
```

### Avoiding N+1 Queries

```typescript
// ❌ BAD: N+1 query (fetches containers one by one)
const workspaces = await supabase.from('workspaces').select('*');
for (const workspace of workspaces) {
  const { data: containers } = await supabase
    .from('workspace_containers')
    .select('*')
    .eq('workspace_id', workspace.id);
  workspace.containers = containers;
}

// ✅ GOOD: Single query with join
const { data: workspaces } = await supabase
  .from('workspaces')
  .select(`
    *,
    workspace_containers (
      *,
      containers (*)
    )
  `);
```

---

## 🔄 Conflict Resolution (Hierarchy)

In the event of data mismatch, follow the **Aethos Priority Ladder**:

1. **Microsoft Graph** (Authority) - Always wins for Tier 1 data
2. **Supabase Workspace Data** (Local Configuration) - User-added notes, tags
3. **In-Memory Cache** (Transient) - UI state only

**Example:**
```typescript
async function resolveContainerData(containerId: string) {
  // 1. Check in-memory cache
  const cached = cacheManager.get(`container:${containerId}`);
  if (cached && !cached.needsRefresh) return cached;
  
  // 2. Check Supabase
  const { data: dbContainer } = await supabase
    .from('containers')
    .select('*')
    .eq('id', containerId)
    .single();
  
  // 3. If stale, fetch from Graph
  if (isStale(dbContainer.synced_at, 4 * 60 * 60 * 1000)) { // 4 hours
    const graphData = await fetchFromGraph(dbContainer.provider_id);
    
    // Merge: Graph data wins for metadata, preserve local enrichments
    const merged = {
      ...dbContainer, // Local notes, tags
      ...graphData,   // Authoritative metadata
      notes: dbContainer.notes, // Preserve user notes
      tags: dbContainer.tags     // Preserve user tags
    };
    
    // Update database
    await supabase
      .from('containers')
      .update(merged)
      .eq('id', containerId);
    
    return merged;
  }
  
  return dbContainer;
}
```

---

## ✅ Compliance Checklist (Data Ready)

- [ ] **Multi-Tenant:** All tables have `tenant_id` and RLS policies
- [ ] **Indexes:** tenant_id indexed on all tables
- [ ] **TTL Check:** Every cache entry has expiration logic
- [ ] **Delta Links:** Graph sync services persist `@odata.deltaLink`
- [ ] **PII Redaction:** Logs do not contain unhashed emails or site names
- [ ] **Throttling:** 429 errors trigger cache-fallback and exponential backoff
- [ ] **Foreign Keys:** CASCADE delete configured for tenant cleanup
- [ ] **Timestamps:** All tables have `created_at` and `updated_at`
- [ ] **Upserts:** Use `onConflict` for idempotent syncs

---

## 📚 Related Standards

- **STD-SEC-001:** Row-Level Security implementation
- **STD-API-001:** Microsoft Graph integration patterns
- **STD-PERF-001:** Database query optimization
- **STD-M365-001:** M365 metadata schema

---

## 🔄 Maintenance

**Review Cycle:** Quarterly  
**Owner:** Aethos Data Architecture Team  
**Authority:** MANDATORY for all Intelligence Layer services  
**Last Updated:** 2026-02-27 (Updated for Supabase multi-tenant architecture, moved to /docs/3-standards/)
