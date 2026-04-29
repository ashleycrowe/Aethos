# Aethos v1 Implementation Roadmap
## Complete Guide to Building Production-Ready MVP

**Version:** 1.0.0  
**Last Updated:** 2026-02-26  
**Target Timeline:** 12 weeks  
**Status:** Engineering-Ready

---

## 🎯 What's Ready vs What's Needed

### ✅ COMPLETED (Prototype Phase)

**Documentation:**
- ✅ Consolidated Product Spec (`/docs/AETHOS_V1_CONSOLIDATED_SPEC.md`)
- ✅ Content Oracle v1 Spec (`/docs/AETHOS_CONTENT_ORACLE_V1_SPEC.md`)
- ✅ Simplified Architecture (`/docs/2-ARCHITECTURE/SIMPLIFIED_ARCHITECTURE.md`)
- ✅ Design Guidelines (`guidelines/Guidelines.md`)
- ✅ Database schemas defined (Section 5 of CONSOLIDATED_SPEC)

**UI Components (Figma Make Prototype):**
- ✅ Metadata Intelligence Dashboard (fully functional mock)
- ✅ GlassCard, Sidebar, and 60+ other components
- ✅ Design system established ("Aethos Glass" style)
- ✅ Component patterns documented

**Strategic Decisions:**
- ✅ Content Oracle moved to v1 (with opt-in model)
- ✅ Metadata enrichment as always-on feature
- ✅ Pricing strategy defined (base + add-ons)
- ✅ AI features toggle architecture
- ✅ Tiered connector strategy (T1 vs T2)

---

### ⏳ NEEDS IMPLEMENTATION (Production Phase)

**Backend (0% Complete):**
- ❌ Supabase database setup + migrations
- ❌ Vercel serverless functions
- ❌ Microsoft Graph API integration
- ❌ Slack API integration  
- ❌ Google Workspace API integration
- ❌ MetadataEnricher service
- ❌ Discovery scan pipeline
- ❌ Cleanup execution engine
- ❌ Oracle query parser
- ❌ Authentication (MSAL.js)

**Frontend Integration (30% Complete):**
- ⚠️ Components exist but not connected to backend
- ❌ API client layer
- ❌ Real-time updates (WebSockets or polling)
- ❌ Error handling & loading states
- ❌ Form validation
- ❌ Routing (React Router)

**Testing (0% Complete):**
- ❌ Unit tests
- ❌ Integration tests
- ❌ E2E tests
- ❌ Load testing
- ❌ Security audit

**Deployment (0% Complete):**
- ❌ Vercel configuration
- ❌ Supabase project setup
- ❌ Environment variables management
- ❌ CI/CD pipeline
- ❌ Monitoring & error tracking

---

## 📋 12-Week Implementation Plan

### **Week 1-2: Foundation**

**Supabase Database:**
```sql
-- Run these migrations in Supabase SQL Editor

-- Migration 001: Core tables
CREATE TABLE tenants (...);
CREATE TABLE identities (...);
CREATE TABLE sources (...);
CREATE TABLE containers (...);
CREATE TABLE assets (...);
-- See Section 5.2 of CONSOLIDATED_SPEC for full schemas

-- Migration 002: Enrichment tables
CREATE TABLE asset_enrichment (...);
CREATE TABLE tenant_ai_settings (...);
-- See CONTENT_ORACLE_V1_SPEC for full schemas

-- Migration 003: RLS policies
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON tenants...
-- Repeat for all tables
```

**Vercel Deployment:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd aethos-frontend
vercel --prod

# Deploy backend (serverless functions)
cd aethos-backend
vercel --prod

# Set environment variables in Vercel dashboard
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxx
MSAL_CLIENT_ID=xxx
MSAL_CLIENT_SECRET=xxx
```

**MSAL Authentication:**
```typescript
// src/app/config/msal.config.ts
import { Configuration } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin + '/auth/callback',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};
```

**Deliverables:**
- [ ] Supabase project created with all tables
- [ ] Vercel frontend deployed (shows UI but no backend)
- [ ] Vercel backend deployed (empty functions, returns 200)
- [ ] MSAL login flow working (redirects to Microsoft, gets token)
- [ ] Local development environment set up

**Testing:**
- [ ] Can access deployed frontend URL
- [ ] Can log in with Microsoft account
- [ ] Can see empty dashboard (no data yet)
- [ ] No console errors

---

### **Week 3-4: Discovery Module**

**Microsoft 365 Connector:**
```typescript
// backend/connectors/microsoft.ts
import { Client } from '@microsoft/microsoft-graph-client';

export class MicrosoftConnector {
  private client: Client;

  constructor(accessToken: string) {
    this.client = Client.init({
      authProvider: (done) => done(null, accessToken)
    });
  }

  async enumerateContainers(tenantId: string): Promise<Container[]> {
    // Fetch SharePoint sites
    const sites = await this.client.api('/sites').get();
    
    // Transform to Aethos format
    return sites.value.map(site => ({
      external_container_id: site.id,
      name: site.displayName,
      type: 'site',
      storage_bytes: site.quota?.used || 0,
      metadata: { webUrl: site.webUrl }
    }));
  }

  async enumerateAssets(containerId: string): Promise<Asset[]> {
    // Fetch files in SharePoint site
    const drive = await this.client.api(`/sites/${containerId}/drive`).get();
    const items = await this.client.api(`/drives/${drive.id}/root/children`).get();
    
    return items.value.map(item => ({
      external_asset_id: item.id,
      name: item.name,
      type: 'file',
      extension: item.name.split('.').pop(),
      size_bytes: item.size,
      created_at: item.createdDateTime,
      modified_at: item.lastModifiedDateTime,
      metadata: { webUrl: item.webUrl }
    }));
  }
}
```

**Discovery Scan API:**
```typescript
// backend/api/discovery/scan.ts
import { Request, Response } from 'express';
import { MicrosoftConnector } from '../connectors/microsoft';
import { supabase } from '../lib/supabase';

export async function startDiscoveryScan(req: Request, res: Response) {
  const { tenantId } = req.user; // From MSAL middleware
  const { sources } = req.body; // ['microsoft', 'slack']

  // Create discovery run record
  const { data: run } = await supabase
    .from('discovery_runs')
    .insert({
      tenant_id: tenantId,
      trigger_type: 'manual',
      status: 'running'
    })
    .select()
    .single();

  // Queue background job (or run immediately for MVP)
  runDiscoveryScan(run.id, tenantId, sources);

  res.json({ runId: run.id, status: 'started' });
}

async function runDiscoveryScan(runId: string, tenantId: string, sources: string[]) {
  let containersScanned = 0;
  let assetsScanned = 0;
  let storageDiscovered = 0;

  for (const sourceType of sources) {
    const connector = getConnector(sourceType, tenantId);
    
    // Enumerate containers
    const containers = await connector.enumerateContainers(tenantId);
    containersScanned += containers.length;

    // Upsert to database
    for (const container of containers) {
      await supabase.from('containers').upsert({
        tenant_id: tenantId,
        external_container_id: container.external_container_id,
        name: container.name,
        type: container.type,
        storage_bytes: container.storage_bytes,
        metadata: container.metadata
      });

      // Enumerate assets in container
      const assets = await connector.enumerateAssets(container.external_container_id);
      assetsScanned += assets.length;
      storageDiscovered += assets.reduce((sum, a) => sum + a.size_bytes, 0);

      // Batch insert assets
      await supabase.from('assets').upsert(assets.map(a => ({
        tenant_id: tenantId,
        container_id: container.id,
        ...a
      })));
    }
  }

  // Update discovery run
  await supabase
    .from('discovery_runs')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      containers_scanned: containersScanned,
      assets_scanned: assetsScanned,
      storage_discovered: storageDiscovered
    })
    .eq('id', runId);
}
```

**Data Map UI (Frontend):**
```typescript
// src/app/components/DataMap.tsx
import { useEffect, useState } from 'react';
import { GlassCard } from './GlassCard';

export const DataMap = () => {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/containers')
      .then(res => res.json())
      .then(data => {
        setContainers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {containers.map(container => (
        <GlassCard key={container.id} className="p-4">
          <h3>{container.name}</h3>
          <p>{formatBytes(container.storage_bytes)}</p>
        </GlassCard>
      ))}
    </div>
  );
};
```

**Deliverables:**
- [ ] Microsoft 365 connector working
- [ ] Slack connector working (channels + files)
- [ ] Discovery scan completes without errors
- [ ] Data Map UI displays real data
- [ ] Can drill down: Tenant → Source → Container → Assets

**Testing:**
- [ ] Run scan on test Microsoft 365 tenant (1,000+ files)
- [ ] Verify all containers appear in Data Map
- [ ] Verify storage totals are accurate
- [ ] Check Supabase database has correct data

---

### **Week 5-6: Cleanup Module**

**Waste Recommendation Engine:**
```typescript
// backend/services/waste-detector.ts
export class WasteDetector {
  async findLargeUnusedFiles(tenantId: string) {
    const { data } = await supabase
      .from('assets')
      .select('*')
      .eq('tenant_id', tenantId)
      .gt('size_bytes', 100_000_000) // >100MB
      .lt('last_accessed', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)); // 180 days

    return {
      category: 'Large Unused Files',
      count: data.length,
      estimatedReclaim: data.reduce((sum, a) => sum + a.size_bytes, 0),
      files: data
    };
  }

  async findOldRecordings(tenantId: string) {
    // Similar SQL query for recordings >1 year old
  }

  async findOrphanedContent(tenantId: string) {
    // Join with identities where status='departed'
  }
}
```

**Cleanup Plan Creation:**
```typescript
// backend/api/cleanup/plan.ts
export async function createCleanupPlan(req: Request, res: Response) {
  const { tenantId } = req.user;
  const { name, assetIds, actionType } = req.body;

  // Calculate estimated reclaim
  const { data: assets } = await supabase
    .from('assets')
    .select('size_bytes')
    .in('id', assetIds);
  
  const estimatedReclaim = assets.reduce((sum, a) => sum + a.size_bytes, 0);

  // Create plan
  const { data: plan } = await supabase
    .from('cleanup_plans')
    .insert({
      tenant_id: tenantId,
      name,
      status: 'draft',
      estimated_reclaim_bytes: estimatedReclaim,
      created_by: req.user.id
    })
    .select()
    .single();

  // Create actions
  await supabase.from('cleanup_actions').insert(
    assetIds.map(assetId => ({
      cleanup_plan_id: plan.id,
      target_type: 'asset',
      target_id: assetId,
      action_type: actionType,
      status: 'pending'
    }))
  );

  res.json({ plan });
}
```

**Archive Execution (Microsoft 365):**
```typescript
// backend/connectors/microsoft.ts (add method)
async archiveAsset(assetId: string): Promise<CleanupResult> {
  // Move file to "Aethos Archive" library
  await this.client.api(`/drives/${driveId}/items/${assetId}/move`)
    .post({
      parentReference: {
        id: archiveLibraryId
      }
    });

  // Set read-only permissions
  await this.client.api(`/drives/${driveId}/items/${assetId}/permissions`)
    .post({
      roles: ['read'],
      link: { type: 'view' }
    });

  return { success: true, action: 'archived' };
}
```

**Deliverables:**
- [ ] Waste detection working (3 categories: large files, recordings, orphaned)
- [ ] Cleanup plan creation UI
- [ ] Preview modal shows affected files
- [ ] Archive execution works for M365 (soft delete to recycle bin)
- [ ] Execution log shows progress

**Testing:**
- [ ] Create cleanup plan with 10 files
- [ ] Execute plan (verify files moved to archive)
- [ ] Check execution log (all 10 succeeded)
- [ ] Verify files still accessible in M365 (read-only)

---

### **Week 7-8: Workspaces Module**

**Workspace CRUD:**
```typescript
// backend/api/workspaces/index.ts
export async function createWorkspace(req: Request, res: Response) {
  const { tenantId, userId } = req.user;
  const { name, description, color, icon } = req.body;

  const { data: workspace } = await supabase
    .from('workspaces')
    .insert({
      tenant_id: tenantId,
      name,
      description,
      color: color || '#FF5733',
      icon: icon || 'Folder',
      created_by: userId
    })
    .select()
    .single();

  // Add creator as member
  await supabase.from('workspace_members').insert({
    workspace_id: workspace.id,
    identity_id: userId,
    role: 'creator'
  });

  res.json({ workspace });
}
```

**Item Pinning:**
```typescript
// backend/api/workspaces/items.ts
export async function addItemToWorkspace(req: Request, res: Response) {
  const { workspaceId } = req.params;
  const { pointerType, containerId, assetId, aethosNote } = req.body;

  const { data: item } = await supabase
    .from('workspace_items')
    .insert({
      workspace_id: workspaceId,
      pointer_type: pointerType,
      container_id: containerId,
      asset_id: assetId,
      aethos_note: aethosNote,
      pinned_by: req.user.userId
    })
    .select()
    .single();

  res.json({ item });
}
```

**Permission Reflection:**
```typescript
// backend/api/workspaces/items.ts (add permission check)
async function getWorkspaceItems(workspaceId: string, userId: string) {
  const items = await supabase
    .from('workspace_items')
    .select('*, assets(*), containers(*)')
    .eq('workspace_id', workspaceId);

  // Filter by source system permissions
  const accessibleItems = [];
  for (const item of items.data) {
    const hasAccess = await checkSourcePermission(item, userId);
    if (hasAccess) {
      accessibleItems.push(item);
    }
  }

  return accessibleItems;
}

async function checkSourcePermission(item: any, userId: string) {
  // Query Microsoft Graph to check if user has access
  const userToken = await getUserAccessToken(userId);
  const connector = new MicrosoftConnector(userToken);
  
  try {
    await connector.client.api(`/drives/${item.asset.driveId}/items/${item.asset.external_asset_id}`).get();
    return true; // User can access
  } catch (error) {
    return false; // Permission denied
  }
}
```

**Tag-Based Auto-Sync Rules (NEW - Critical for v1):**
```typescript
// backend/api/workspaces/sync-rules.ts
export async function createSyncRule(req: Request, res: Response) {
  const { workspaceId } = req.params;
  const { 
    rule_type, 
    tags_include_all, 
    tags_include_any, 
    tags_exclude,
    file_types,
    exclude_locations,
    max_files 
  } = req.body;

  const { data: rule } = await supabase
    .from('sync_rules')
    .insert({
      workspace_id: workspaceId,
      tenant_id: req.user.tenantId,
      rule_type,
      tags_include_all,
      tags_include_any,
      tags_exclude,
      file_types,
      exclude_locations,
      max_files: max_files || 500,
      auto_add: true,
      enabled: true,
      created_by: req.user.userId
    })
    .select()
    .single();

  // Preview matches before enabling
  const preview = await previewSyncRuleMatches(rule);
  
  res.json({ rule, preview });
}

// Execute sync rules (runs every 6 hours)
export async function executeSyncRules(workspaceId: string) {
  const { data: rules } = await supabase
    .from('sync_rules')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('enabled', true);

  for (const rule of rules) {
    const matchingAssets = await findAssetsMatchingRule(rule);
    
    // Apply max_files limit
    const assetsToAdd = matchingAssets.slice(0, rule.max_files || 500);
    
    if (rule.auto_add) {
      // Get existing workspace assets
      const { data: existing } = await supabase
        .from('workspace_assets')
        .select('asset_id')
        .eq('workspace_id', workspaceId);
      
      const existingIds = new Set(existing.map(e => e.asset_id));
      const newAssets = assetsToAdd.filter(a => !existingIds.has(a.id));
      
      if (newAssets.length > 0) {
        await supabase.from('workspace_assets').insert(
          newAssets.map(asset => ({
            workspace_id: workspaceId,
            asset_id: asset.id,
            added_by: 'system'
          }))
        );
        
        // Update audit trail
        await supabase
          .from('sync_rules')
          .update({ 
            last_run: new Date().toISOString(),
            files_added_count: rule.files_added_count + newAssets.length
          })
          .eq('id', rule.id);
      }
    }
  }
}

// Find assets matching tag-based rule
async function findAssetsMatchingRule(rule: SyncRule) {
  let query = supabase
    .from('assets')
    .select('*')
    .eq('tenant_id', rule.tenant_id)
    .eq('sync_status', 'active');

  if (rule.rule_type === 'tag') {
    // Tag matching using PostgreSQL array operators
    if (rule.tags_include_all && rule.tags_include_all.length > 0) {
      // Must have ALL tags (AND logic)
      query = query.or(
        `user_tags.cs.{${rule.tags_include_all.join(',')}},enriched_tags.cs.{${rule.tags_include_all.join(',')}}`
      );
    }
    
    if (rule.tags_include_any && rule.tags_include_any.length > 0) {
      // Must have ANY tag (OR logic)
      query = query.or(
        `user_tags.ov.{${rule.tags_include_any.join(',')}},enriched_tags.ov.{${rule.tags_include_any.join(',')}}`
      );
    }
    
    if (rule.tags_exclude && rule.tags_exclude.length > 0) {
      // Must NOT have excluded tags
      for (const tag of rule.tags_exclude) {
        query = query.not('user_tags', 'cs', [tag]);
        query = query.not('enriched_tags', 'cs', [tag]);
      }
    }
  }
  
  // Apply filters
  if (rule.file_types && rule.file_types.length > 0) {
    query = query.in('mime_type', rule.file_types);
  }
  
  if (rule.exclude_locations && rule.exclude_locations.length > 0) {
    for (const path of rule.exclude_locations) {
      query = query.not('location_path', 'like', `${path}%`);
    }
  }
  
  const { data } = await query.order('created_date', { ascending: false });
  return data || [];
}
```

**Bulk Tag Editor (UI + API):**
```typescript
// backend/api/assets/tags.ts
export async function bulkUpdateTags(req: Request, res: Response) {
  const { asset_ids, tags_to_add, tags_to_remove } = req.body;
  
  for (const assetId of asset_ids) {
    const { data: asset } = await supabase
      .from('assets')
      .select('user_tags')
      .eq('id', assetId)
      .single();
    
    // Add new tags (avoid duplicates)
    let updatedTags = [...new Set([...(asset.user_tags || []), ...tags_to_add])];
    
    // Remove tags
    updatedTags = updatedTags.filter(tag => !tags_to_remove.includes(tag));
    
    await supabase
      .from('assets')
      .update({ 
        user_tags: updatedTags,
        updated_at: new Date().toISOString()
      })
      .eq('id', assetId);
    
    // Trigger workspace sync check
    await checkAndExecuteSyncRules(assetId);
  }
  
  res.json({ success: true, assets_updated: asset_ids.length });
}

// Check if asset matches any workspace sync rules
async function checkAndExecuteSyncRules(assetId: string) {
  const { data: asset } = await supabase
    .from('assets')
    .select('*')
    .eq('id', assetId)
    .single();
  
  // Find all active tag-based sync rules for this tenant
  const { data: rules } = await supabase
    .from('sync_rules')
    .select('*, workspaces(id)')
    .eq('tenant_id', asset.tenant_id)
    .eq('enabled', true)
    .eq('rule_type', 'tag');
  
  for (const rule of rules) {
    const matches = await assetMatchesRule(asset, rule);
    
    if (matches && rule.auto_add) {
      // Add to workspace
      await supabase
        .from('workspace_assets')
        .upsert({
          workspace_id: rule.workspace_id,
          asset_id: asset.id,
          added_by: 'system'
        }, { onConflict: 'workspace_id,asset_id' });
    } else if (!matches && rule.auto_remove) {
      // Remove from workspace
      await supabase
        .from('workspace_assets')
        .delete()
        .eq('workspace_id', rule.workspace_id)
        .eq('asset_id', asset.id);
    }
  }
}
```

**Deliverables:**
- [ ] Workspace creation working
- [ ] Pin containers and assets
- [ ] Invite members to workspace
- [ ] Permission reflection working (users only see what they can access)
- [ ] Threaded comments on workspace items
- [ ] **Tag-based auto-sync rules UI** (create, preview, enable/disable)
- [ ] **Bulk tag editor** (Discovery module)
- [ ] **Individual tag editor** (file detail panel)
- [ ] **Sync rule execution** (background job every 6 hours)
- [ ] **Tag cloud display** (workspace overview)

**Testing:**
- [ ] Create workspace as Admin
- [ ] Pin 10 items (mix of containers + assets)
- [ ] Invite Member (without access to 3 items)
- [ ] Verify Member only sees 7 items
- [ ] Add comment, verify threaded replies work
- [ ] **Create tag-based sync rule** (tags: [q1-2026, budget])
- [ ] **Preview matches** (shows 23 files would be added)
- [ ] **Enable rule** (23 files auto-added to workspace)
- [ ] **Bulk tag 5 new files** with [q1-2026, budget]
- [ ] **Verify auto-sync** (5 files automatically appear in workspace)

---

### **Week 9-10: Oracle + Metadata Intelligence**

**Metadata Enrichment Service:**
```typescript
// backend/services/metadata-enricher.ts
export class MetadataEnricher {
  async enrichAsset(asset: Asset): Promise<AssetEnrichment> {
    return {
      asset_id: asset.id,
      tenant_id: asset.tenant_id,
      inferred_category: this.inferCategory(asset.name, asset.path),
      inferred_department: this.inferDepartment(asset.owner_email, asset.path),
      inferred_time_period: this.extractTimePeriod(asset.name, asset.created_at),
      inferred_status: this.inferStatus(asset.name),
      search_keywords: this.generateKeywords(asset),
      metadata_quality_score: this.calculateQualityScore(asset),
      confidence_score: 0.85,
      enrichment_method: 'metadata_only',
      enriched_by: 'ai'
    };
  }

  private inferCategory(name: string, path: string): string {
    // Pattern matching logic (see CONTENT_ORACLE_V1_SPEC)
    if (/budget|financial|p&l/i.test(name + path)) return 'Financial Planning';
    if (/hr|employee|policy/i.test(name + path)) return 'HR Documents';
    // ... more patterns
    return 'Uncategorized';
  }

  // ... other methods from spec
}
```

**Oracle Query Parser:**
```typescript
// backend/services/oracle-parser.ts
export class OracleParser {
  parse(query: string): ParsedQuery {
    // Intent detection
    if (/largest|biggest.*site/i.test(query)) {
      return {
        intent: 'largest_sites',
        sql: `
          SELECT name, storage_bytes 
          FROM containers 
          WHERE type='site' AND tenant_id=? 
          ORDER BY storage_bytes DESC 
          LIMIT 10
        `
      };
    }

    if (/storage.*waste/i.test(query)) {
      return {
        intent: 'storage_waste',
        // Call WasteDetector service
      };
    }

    // Default: full-text search
    return {
      intent: 'search',
      sql: `
        SELECT a.*, e.inferred_category, e.search_keywords
        FROM assets a
        LEFT JOIN asset_enrichment e ON a.id = e.asset_id
        WHERE a.tenant_id = ?
          AND (
            to_tsvector('english', a.name) @@ plainto_tsquery('english', ?)
            OR to_tsvector('english', array_to_string(e.search_keywords, ' ')) @@ plainto_tsquery('english', ?)
          )
        ORDER BY a.modified_at DESC
        LIMIT 50
      `
    };
  }
}
```

**Metadata Intelligence Dashboard (Already Built!):**
- ✅ Component exists: `/src/app/components/MetadataIntelligenceDashboard.tsx`
- ⚠️ Just needs to fetch real data from API

**Integration:**
```typescript
// src/app/components/MetadataIntelligenceDashboard.tsx (update)
const { data: stats } = useFetch('/api/metadata/intelligence');

const intelligenceScore = stats.intelligence_score;
const sourceQuality = stats.source_quality;
const enrichmentStatus = stats.enrichment_status;
// ... use real data instead of mocks
```

**Deliverables:**
- [ ] Metadata enrichment runs during Discovery scan
- [ ] 90%+ of files enriched automatically
- [ ] Oracle search works (10 common queries tested)
- [ ] Metadata Intelligence Dashboard shows real data
- [ ] Drill-down views work (low-quality files, categories)

**Testing:**
- [ ] Run Discovery scan, verify enrichment completes
- [ ] Spot-check 50 files (manual validation of categories)
- [ ] Test Oracle: "Find Q4 financial reports" returns relevant files
- [ ] Open Metadata Dashboard, verify scores are accurate

---

### **Week 11-12: Polish & Testing**

**Performance Optimization:**
- [ ] Add database indexes (see schemas)
- [ ] Enable gzip compression (Vercel automatic)
- [ ] Lazy load large components
- [ ] Implement virtual scrolling for >1,000 row tables
- [ ] Cache API responses (5 min TTL)

**Error Handling:**
- [ ] Add try/catch to all API routes
- [ ] Return consistent error format: `{ error: string, code: string }`
- [ ] Display error toasts in UI (using Sonner)
- [ ] Log errors to Sentry or Vercel Analytics

**Security:**
- [ ] HTTPS only (Vercel default)
- [ ] CORS configured (backend only accepts requests from frontend domain)
- [ ] SQL injection prevention (use parameterized queries)
- [ ] Rate limiting (100 req/min per user)
- [ ] Input validation (Zod schemas)

**Testing:**
```typescript
// Example: Unit test for MetadataEnricher
import { MetadataEnricher } from './metadata-enricher';

describe('MetadataEnricher', () => {
  const enricher = new MetadataEnricher();

  test('infers Financial Planning category', () => {
    const category = enricher.inferCategory(
      'Q4_Budget.xlsx',
      '/Finance/Budgets/2025/'
    );
    expect(category).toBe('Financial Planning');
  });

  test('extracts time period from filename', () => {
    const period = enricher.extractTimePeriod('Q1_2025_Report.pdf', new Date());
    expect(period).toBe('Q1 2025');
  });
});
```

**Load Testing:**
```bash
# Use k6 for load testing
k6 run load-test.js

# Verify:
# - P50 latency <100ms
# - P99 latency <500ms
# - No errors at 100 concurrent users
# - Database queries <50ms
```

**Deliverables:**
- [ ] Lighthouse score ≥90
- [ ] No TypeScript errors
- [ ] 80%+ test coverage
- [ ] Load test passes (100 concurrent users)
- [ ] Security audit complete (no critical vulnerabilities)

---

## 🚀 Handoff Checklist (To Your Friend)

### Documentation Ready?

- [x] Consolidated spec complete and approved
- [x] Content Oracle spec complete
- [x] Simplified architecture documented
- [x] Database schemas defined
- [x] API routes documented
- [x] Design system documented
- [x] Implementation roadmap (this document)

### Code Ready?

- [x] Prototype exists with 60+ components
- [x] Metadata Intelligence Dashboard built
- [x] Design system established
- [ ] Backend stub created (needs implementation)
- [ ] API client created (needs implementation)

### Infrastructure Ready?

- [ ] Supabase project created
- [ ] Vercel account set up
- [ ] Microsoft Azure AD app registered
- [ ] Domain purchased (aethos.com)
- [ ] Slack workspace for testing
- [ ] Google Workspace for testing

### Questions to Answer with Your Friend:

1. **Budget:** Approve $0-5/mo for Supabase/Vercel?
2. **Timeline:** Confirm 12 weeks is realistic?
3. **Roles:** Who owns backend vs frontend?
4. **Testing:** Who handles QA testing?
5. **Deployment:** Who has Vercel/Supabase access?
6. **Design:** Any changes to Aethos Glass style?
7. **Scope:** Defer Content Reading to v1.1 or include in v1?

---

## 📈 Success Metrics (Before Launch)

### Technical Metrics
- [ ] Discovery scan completes <10 min for 10K files
- [ ] Metadata enrichment: 90%+ categorized
- [ ] Oracle search: 40%+ more results (vs source metadata alone)
- [ ] Lighthouse score ≥90
- [ ] Zero TypeScript errors
- [ ] 80%+ test coverage

### User Metrics
- [ ] 10-20 pilot customers onboarded
- [ ] Average session >5 minutes
- [ ] <5% error rate
- [ ] NPS >50
- [ ] 1 customer case study

### Business Metrics
- [ ] 3+ customers willing to pay
- [ ] $10K-20K in pilot revenue
- [ ] <10% churn rate
- [ ] 2-3 customer testimonials

---

## 🎓 Learning Resources for Your Friend

### Microsoft Graph API
- [Official Documentation](https://learn.microsoft.com/graph)
- [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) - Interactive testing
- [Postman Collection](https://www.postman.com/microsoftgraph/workspace/microsoft-graph/overview)

### Supabase
- [Getting Started](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Tuning](https://supabase.com/docs/guides/database/postgres-tuning)

### Vercel
- [Deployment Guide](https://vercel.com/docs)
- [Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

### React Best Practices
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React Query (TanStack Query)](https://tanstack.com/query/latest) - For API calls
- [Zod](https://zod.dev/) - For validation

---

## 💡 Pro Tips

### Development Workflow
1. Start with Supabase (database first)
2. Build API routes (test with Postman)
3. Connect frontend (use React Query)
4. Add error handling last

### Common Pitfalls
- ❌ Don't fetch all data at once (use pagination)
- ❌ Don't store secrets in code (use .env)
- ❌ Don't skip RLS policies (security risk)
- ❌ Don't deploy without testing (use staging)

### Quick Wins
- ✅ Use Supabase real-time for live updates
- ✅ Use Vercel preview deployments for testing
- ✅ Use GitHub Copilot for boilerplate code
- ✅ Use Prettier for consistent code style

---

## 🆘 Support Channels

**For Technical Questions:**
- Supabase Discord: https://discord.supabase.com
- Vercel Discord: https://discord.gg/vercel
- Microsoft Graph Q&A: https://aka.ms/graph/qna

**For Design Questions:**
- Refer to `/guidelines/Guidelines.md`
- Aethos design principles: "Cinematic Glassmorphism"
- Deep space background: `#0B0F19`
- Primary action: `#00F0FF` (Starlight Cyan)

---

## ✅ Ready for Handoff?

### Answer These Questions:

1. **Does your friend understand the scope?**
   - [ ] Read CONSOLIDATED_SPEC.md
   - [ ] Read CONTENT_ORACLE_V1_SPEC.md
   - [ ] Understands 3 modules: Discovery, Workspaces, Oracle

2. **Does your friend have access?**
   - [ ] Supabase account
   - [ ] Vercel account
   - [ ] Azure AD account (for app registration)
   - [ ] GitHub repo access

3. **Does your friend have time?**
   - [ ] 12 weeks available
   - [ ] 20-30 hours/week commitment
   - [ ] Can start immediately

4. **Does your friend have skills?**
   - [ ] React/TypeScript experience
   - [ ] Node.js/Express experience
   - [ ] PostgreSQL knowledge
   - [ ] API integration experience

**If all ✅, you're ready to handoff!**

---

**Next Step:** Schedule kickoff meeting with your friend (1-2 hours)

**Agenda:**
1. Review CONSOLIDATED_SPEC together (30 min)
2. Walk through this implementation roadmap (30 min)
3. Assign Week 1-2 tasks (10 min)
4. Set up weekly check-ins (10 min)
5. Q&A (10 min)

**Good luck! 🚀**
