---
status: Active
type: Core Strategic Standard
phase: All Phases
audience: [All Teams, Developers, Architects]
working_group: [Technical, Architecture]
priority: Critical
last_updated: 2026-02-04
tags: [performance, sidecar, nextjs, azure-functions, metrics, standards]
document_id: STD-PERF-001
---

<!--
📌 CORE STRATEGIC DOCUMENT - AI MAINTENANCE INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  DO NOT DELETE - Source of truth for Aethos Performance
🔄 KEEP UPDATED - Update when Sidecar latency or bundle targets change
📋 WHAT TO UPDATE:
   - Lighthouse targets for Aethos Glass rendering
   - Sidecar (Azure Functions) cold-start & execution limits
   - Graph API batching efficiency thresholds
   - Metadata persistence (Cosmos DB) RUs/latency targets
🚫 WHAT NOT TO CHANGE:
   - Core performance principles (Sidecar efficiency, zero-body overhead)
   - YAML front matter structure
   - Critical rules section
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-->

# [STANDARD] Aethos Performance & Optimization Standards
## High-Fidelity Performance Requirements for the Aethos Sidecar Architecture

**Version:** 1.0  
**Date:** February 4, 2026  
**Status:** 🟢 ACTIVE  
**Owner:** Architecture Team  
**SME:** Performance Architect / Sidecar Lead  
**Description:** Performance benchmarks, bundle size limits, and Sidecar optimization techniques for the Aethos intelligence layer.  
**Tags:** performance, sidecar, nextjs, azure-functions, metrics, standards  
**Authority:** MANDATORY  
**Document ID:** STD-PERF-001

---

## 🚨 CRITICAL RULES (MANDATORY)

1. ✅ **SIDECAR LATENCY < 200ms** - All Sidecar (Azure Function) orchestration must complete in <200ms (excluding Graph API wait time).
2. ✅ **LIGHTHOUSE SCORE ≥ 90** - All Aethos Glass views must maintain a score of 90+ across Performance, Accessibility, and Best Practices.
3. ✅ **AGGRESSIVE BATCHING** - Microsoft Graph calls MUST be batched (max 20 per request) to minimize network round-trips.
4. ✅ **CINEMATIC OPTIMIZATION** - All glassmorphism effects (backdrop-filter) must be GPU-accelerated and tested for frame-rate stability (60fps).
5. ✅ **ZERO-BODY OVERHEAD** - No file bodies or binary data may be processed by the Sidecar; metadata-only pointers ensure low memory footprint.
6. ✅ **DELTA SYNC ONLY** - Background synchronization for "The Flashlight" must use Delta Queries to avoid full tenant re-scans.
7. ❌ **NO COLD STARTS** - Production Sidecar functions must use Premium/Dedicated plans to eliminate cold-start latency for end-users.

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

### 1.2 Aethos Glass Rendering Standards
- **Backdrop-Filters:** Limit the use of `backdrop-filter: blur()` to 3 concurrent layers to prevent GPU throttling.
- **Motion:** All animations in "The Nexus" must use `motion/react` with `transform` and `opacity` to avoid layout thrashing.
- **Images:** All cinematic backgrounds must be served via WebP/AVIF and lazy-loaded using `ImageWithFallback`.

---

## 🏗️ PART 2: SIDECAR & API PERFORMANCE

### 2.1 Sidecar (Azure Functions) Benchmarks
- **Execution Time:** Internal logic (excluding external API calls) must be <50ms.
- **Orchestration:** Use `Promise.all()` for parallel Graph/Cosmos DB lookups.
- **Memory:** Functions must stay under 256MB RAM per execution to maintain high density and low cost.

### 2.2 Microsoft Graph Batching Policy
- **Minimum Batch Size:** 1 (if individual)
- **Target Batch Size:** 15-20 (for "The Flashlight" scanning)
- **Error Handling:** Batches must handle individual 429/503 responses within the set without failing the entire request.

### 2.3 Persistence (Cosmos DB) Efficiency
- **Point Reads:** 90% of metadata lookups must be point reads (id + partition key).
- **Latency:** DB response time should be <10ms for 99th percentile of read operations.

---

## 📦 PART 3: BUNDLE SIZE & ASSETS

### 3.1 JavaScript Budgets
- **Initial JS Bundle:** < 150 KB (gzipped).
- **Total JS per View:** < 400 KB (gzipped).
- **Third-Party Libraries:** Any dependency > 25 KB must be reviewed by the Architecture Team.

### 3.2 Tree Shaking & Code Splitting
- **Dynamic Imports:** Use `React.lazy()` for heavy components like the "Star Map" or "Demo Lab."
- **Icons:** Use `lucide-react` with proper tree-shaking; never import the entire library.

---

## 🧪 PART 4: MONITORING & GOVERNANCE

### 4.1 Continuous Performance Testing
- **Lighthouse CI:** Integrated into all Pull Requests.
- **App Insights:** Custom telemetry for `sidecar_round_trip_ms` and `graph_api_latency_ms`.
- **RUM (Real User Monitoring):** Core Web Vitals tracked via Vercel/Azure telemetry.

### 4.2 Regression Triggers
A performance review is MANDATORY if:
- Bundle size increases by >10% in a single PR.
- Sidecar execution time increases by >50ms.
- Lighthouse scores drop below 85 on any tracked view.

---

## ✅ COMPLIANCE CHECKLIST

- [ ] All Graph calls in "The Flashlight" are batched.
- [ ] Sidecar functions use Premium tier (No cold starts).
- [ ] Cinematic backgrounds are optimized and lazy-loaded.
- [ ] `motion/react` animations are GPU-optimized.
- [ ] Lighthouse score is 90+ for Dashboard, Nexus, and Admin views.
- [ ] No binary data or file bodies are processed in the Sidecar.

---

## 🔄 MAINTENANCE
**Review Cycle:** Quarterly.  
**Owner:** Performance Architecture Team.  
**Authority:** CRITICAL. Failure to meet these standards results in a "Blocker" status for production deployment.

---

**Document ID:** STD-PERF-001  
**Status:** 🟢 ACTIVE STANDARD  
**Authority:** MANDATORY for all Aethos Developers.
