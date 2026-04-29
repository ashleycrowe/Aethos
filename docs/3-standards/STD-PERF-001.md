---
status: Active
type: Core Strategic Standard
phase: All Phases
audience: [All Teams, Developers, Architects]
working_group: [Technical, Architecture]
priority: Critical
last_updated: 2026-02-27
location: /docs/3-standards/
tags: [performance, vercel, supabase, nextjs, serverless, metrics, standards]
document_id: STD-PERF-001
---

<!--
📌 CORE STRATEGIC DOCUMENT - AI MAINTENANCE INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  DO NOT DELETE - Source of truth for Aethos Performance
🔄 KEEP UPDATED - Update when performance or bundle targets change
📋 WHAT TO UPDATE:
   - Lighthouse targets for Aethos Glass rendering
   - Vercel Serverless Functions cold-start & execution limits
   - Graph API batching efficiency thresholds
   - Metadata persistence (Supabase PostgreSQL) latency targets
🚫 WHAT NOT TO CHANGE:
   - Core performance principles (serverless efficiency, zero-body overhead)
   - YAML front matter structure
   - Critical rules section
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-->

# [STANDARD] Aethos Performance & Optimization Standards
## High-Fidelity Performance Requirements for the Simplified Vercel + Supabase Architecture

**Version:** 2.0  
**Date:** February 27, 2026  
**Status:** 🟢 ACTIVE  
**Owner:** Architecture Team  
**SME:** Performance Architect / Frontend Lead  
**Description:** Performance benchmarks, bundle size limits, and serverless optimization techniques for the Aethos intelligence layer on Vercel + Supabase.  
**Tags:** performance, vercel, supabase, nextjs, serverless, metrics, standards  
**Authority:** MANDATORY  
**Document ID:** STD-PERF-001

---

## 🚨 CRITICAL RULES (MANDATORY)

1. ✅ **SERVERLESS LATENCY < 300ms** - All Vercel Serverless Functions must complete in <300ms (P95), excluding external Graph API wait time.
2. ✅ **LIGHTHOUSE SCORE ≥ 90** - All Aethos Glass views must maintain a score of 90+ across Performance, Accessibility, and Best Practices.
3. ✅ **AGGRESSIVE BATCHING** - Microsoft Graph calls MUST be batched (max 20 per request) to minimize network round-trips.
4. ✅ **CINEMATIC OPTIMIZATION** - All glassmorphism effects (backdrop-filter) must be GPU-accelerated and tested for frame-rate stability (60fps).
5. ✅ **ZERO-BODY OVERHEAD** - No file bodies or binary data may be processed server-side; metadata-only pointers ensure low memory footprint.
6. ✅ **DELTA SYNC ONLY** - Background synchronization must use Delta Queries to avoid full tenant re-scans.
7. ✅ **EDGE-FIRST CACHING** - Static assets and API responses must use Vercel Edge Network caching where appropriate.

---

## 📊 PART 1: FRONTEND PERFORMANCE (Aethos Glass)

### 1.1 Web Vitals Targets

| Metric | Target (P95) | Critical Threshold |
| :--- | :--- | :--- |
| **First Contentful Paint (FCP)** | < 1.0s | < 2.0s |
| **Largest Contentful Paint (LCP)** | < 1.8s | < 3.0s |
| **Cumulative Layout Shift (CLS)** | < 0.05 | < 0.1 |
| **Total Blocking Time (TBT)** | < 150ms | < 400ms |
| **Time to Interactive (TTI)** | < 2.5s | < 4.5s |
| **First Input Delay (FID)** | < 50ms | < 100ms |

### 1.2 Aethos Glass Rendering Standards

**GPU Acceleration:**
- **Backdrop-Filters:** Limit `backdrop-filter: blur()` to 3 concurrent layers to prevent GPU throttling
- **Transforms:** All animations must use `transform` and `opacity` (no layout properties)
- **Will-Change:** Use sparingly and only during active animations

**Asset Optimization:**
- **Images:** Serve via WebP/AVIF with `<ImageWithFallback>` component
- **Lazy Loading:** All images below the fold must use native `loading="lazy"`
- **Responsive Images:** Use `srcset` for multi-resolution support

**Motion & Animation:**
```typescript
// ✅ GOOD: GPU-accelerated transform
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// ❌ BAD: Layout-thrashing properties
<motion.div
  initial={{ height: 0 }}
  animate={{ height: 'auto' }}
>
  Content
</motion.div>
```

---

## 🏗️ PART 2: SERVERLESS & API PERFORMANCE

### 2.1 Vercel Serverless Functions Benchmarks

**Execution Targets:**
- **Internal Logic:** < 100ms (excluding external API calls)
- **Total Function Time:** < 300ms (P95)
- **Cold Start Tolerance:** < 1s (acceptable for non-critical endpoints)
- **Memory Limit:** 1024MB (Vercel default)

**Optimization Patterns:**
```typescript
// ✅ GOOD: Parallel execution
const [userData, workspaces, assets] = await Promise.all([
  getUser(userId),
  getWorkspaces(tenantId),
  getAssets(workspaceId)
]);

// ❌ BAD: Sequential execution
const userData = await getUser(userId);
const workspaces = await getWorkspaces(tenantId);
const assets = await getAssets(workspaceId);
```

### 2.2 Microsoft Graph Batching Policy

**Batch Configuration:**
- **Minimum Batch Size:** 1 (individual requests OK for user actions)
- **Target Batch Size:** 15-20 (for background sync operations)
- **Max Batch Size:** 20 (Microsoft Graph limit)
- **Retry Logic:** Individual 429/503 responses must be retried without failing entire batch

**Example Implementation:**
```typescript
// Batch Graph API requests
async function batchGraphRequests(requests: GraphRequest[]) {
  const batchSize = 20;
  const batches = chunk(requests, batchSize);
  
  return await Promise.all(
    batches.map(batch => graphClient.batch(batch))
  );
}
```

### 2.3 Supabase Database Performance

**Query Optimization:**
- **Indexes:** All frequently queried columns must have indexes
- **Connection Pooling:** Use Supabase's built-in Supavisor pooler
- **Row-Level Security:** Keep RLS policies simple to avoid query performance degradation

**Latency Targets:**
| Operation | Target (P50) | Target (P99) |
| :--- | :--- | :--- |
| **Point Reads** | < 10ms | < 50ms |
| **Simple Queries** | < 30ms | < 100ms |
| **Complex Joins** | < 100ms | < 300ms |
| **Writes** | < 20ms | < 80ms |

**Example Query Optimization:**
```sql
-- ✅ GOOD: Indexed query with explicit columns
SELECT id, name, tenant_id, intelligence_score
FROM assets
WHERE tenant_id = $1 AND source_provider = $2
LIMIT 100;

-- ❌ BAD: SELECT * with no index
SELECT *
FROM assets
WHERE metadata->'tags' @> '["priority"]';
```

---

## 📦 PART 3: BUNDLE SIZE & ASSETS

### 3.1 JavaScript Budgets

**Bundle Targets:**
- **Initial JS Bundle:** < 200 KB (gzipped) - higher than premium due to free tier constraints
- **Total JS per View:** < 400 KB (gzipped)
- **Per-Route Chunks:** < 50 KB (gzipped)
- **Third-Party Libraries:** Any dependency > 25 KB must be reviewed by Architecture Team

**Bundle Analysis:**
```bash
# Run bundle analyzer
npm run build
npm run analyze

# Check gzipped sizes
npx @next/bundle-analyzer
```

### 3.2 Tree Shaking & Code Splitting

**Dynamic Imports:**
```typescript
// ✅ GOOD: Lazy-load heavy components
const MetadataIntelligenceDashboard = lazy(() => 
  import('./components/MetadataIntelligenceDashboard')
);

// ✅ GOOD: Icon tree-shaking
import { Search, Bell, Settings } from 'lucide-react';

// ❌ BAD: Import entire library
import * as LucideIcons from 'lucide-react';
```

**Route-Based Code Splitting:**
- Use React Router or Next.js dynamic imports for route-level splitting
- Each major view (Oracle, Nexus, Discovery) should be its own chunk

---

## ⚡ PART 4: CACHING & EDGE OPTIMIZATION

### 4.1 Vercel Edge Caching

**Static Assets:**
- **Cache-Control:** `public, max-age=31536000, immutable` for hashed assets
- **CDN:** All images, fonts, and static JS/CSS served from Edge Network

**API Response Caching:**
```typescript
// Example: Cache metadata responses
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const data = await getMetadata();
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
```

### 4.2 Client-Side Caching

**React Query Configuration:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

---

## 🧪 PART 5: MONITORING & GOVERNANCE

### 5.1 Continuous Performance Testing

**Automated Checks:**
- **Lighthouse CI:** Runs on every PR (must pass 90+ threshold)
- **Bundle Size Tracking:** CI fails if bundle increases > 10%
- **Vercel Analytics:** Core Web Vitals tracked automatically
- **Supabase Metrics:** Query performance monitored via Supabase Dashboard

**Monitoring Tools:**
```bash
# Local Lighthouse audit
npm run lighthouse

# Bundle size check
npm run build
npm run size-check
```

### 5.2 Regression Triggers

**Performance review is MANDATORY if:**
- Bundle size increases by > 10% in a single PR
- Lighthouse score drops below 85 on any tracked view
- Serverless function P95 latency exceeds 300ms
- Database query P99 latency exceeds 300ms
- Any Web Vital moves from "Good" to "Needs Improvement"

### 5.3 Performance Budget Enforcement

**Pre-Merge Requirements:**
- Lighthouse CI must pass (>= 90 on Performance, A11y, Best Practices)
- Bundle analysis must show no significant regressions
- New heavy dependencies require Architecture Team approval

---

## ✅ COMPLIANCE CHECKLIST

- [ ] All Graph API calls are batched where appropriate
- [ ] Serverless functions complete in < 300ms (P95)
- [ ] Cinematic backgrounds are optimized and lazy-loaded
- [ ] `motion/react` animations use GPU-accelerated properties only
- [ ] Lighthouse score is 90+ for Dashboard, Nexus, Oracle, and Discovery views
- [ ] No binary data or file bodies are processed server-side
- [ ] Supabase queries use indexes for all frequent operations
- [ ] Bundle size is within limits (< 200 KB initial, < 400 KB total)
- [ ] Static assets use aggressive caching headers
- [ ] Core Web Vitals meet "Good" thresholds in production

---

## 🔄 MAINTENANCE

**Review Cycle:** Quarterly or when infrastructure changes  
**Owner:** Performance Architecture Team  
**Authority:** CRITICAL. Failure to meet these standards results in a "Blocker" status for production deployment.

---

## 📚 RELATED STANDARDS

- **STD-CODE-001** - Code Quality & Review Standards
- **STD-API-001** - API & Integration Standards (Vercel Functions)
- **STD-DATA-001** - Data Management & Multi-Tenant Standards
- **STD-DESIGN-001** - Design System Quick Reference (Aethos Glass)

---

**Document ID:** STD-PERF-001  
**Status:** 🟢 ACTIVE STANDARD  
**Authority:** MANDATORY for all Aethos Developers  
**Location:** `/docs/3-standards/STD-PERF-001.md`
