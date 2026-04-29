# 📘 Aethos v1 - The Complete Specification (v2.0)

**Document Version:** 2.0  
**Last Updated:** 2026-02-27  
**Status:** ✅ Engineering-Ready  
**Owner:** Product Lead / CEO

---

## 📋 **Document Overview**

**Purpose:** This is THE authoritative specification for Aethos v1. All product, technical, and business decisions are documented here.

**What This Document Covers:**
- ✅ Product vision and positioning
- ✅ Architecture and technology stack
- ✅ All 3 core modules (Constellation, Nexus, Oracle)
- ✅ Pricing and monetization strategy
- ✅ Design system and UX guidelines
- ✅ Future vision (Phase 2+)

**Supporting Documents:**
- **`/docs/SIMPLIFIED_ARCHITECTURE.md`** - Technical architecture deep-dive
- **`/docs/ORACLE_SEARCH_PERSONAS.md`** - User search patterns and AI+ positioning
- **`/docs/PRICING_STRATEGY_CLARITY.md`** - Pricing analysis and recommendations
- **`/docs/V1_IMPLEMENTATION_ROADMAP.md`** - Implementation planning reference (you and your friend will finalize this together)
- **`/docs/MASTER_DESIGN_GUIDE.md`** - Complete visual & interaction design system (THE definitive design reference for all development)

**For Engineers:** Start here, then reference supporting docs as needed.

---

# 📖 Table of Contents

1. [Vision & Positioning](#1-vision--positioning)
2. [Architecture Overview](#2-architecture-overview)
3. [Module 1: The Constellation (Discovery)](#3-module-1-the-constellation-discovery)
4. [Module 2: The Nexus (Workspaces)](#4-module-2-the-nexus-workspaces)
5. [Module 3: The Oracle (Search & Intelligence)](#5-module-3-the-oracle-search--intelligence)
6. [RBAC & Permissions](#6-rbac--permissions)
7. [Pricing & Monetization](#7-pricing--monetization)
8. [Design System (Aethos Glass)](#8-design-system-aethos-glass)
9. [Future Vision (Phase 2+)](#9-future-vision-phase-2)

---

# 1. Vision & Positioning

## 1.1 The Vision: Organizational Clarity Through Intelligence

**What We Believe:**
> "Every enterprise has a constellation of knowledge scattered across platforms, buried in poor metadata, and hidden behind forgotten folders. The result? **Operational chaos disguised as productivity.** Teams waste hours searching. IT drowns in storage alerts. Executives make decisions without context. The knowledge exists—it's just invisible."

**The Aethos Vision:**
> "We bring **organizational clarity** to the modern enterprise by creating an **intelligence layer** that makes scattered knowledge visible, searchable, and actionable. Not by replacing your tools. Not by forcing migration. But by **shining light on what already exists** and helping you operate like the architects you are, not the janitors you've become."

**What This Means:**
- **Clarity Over Chaos:** Transform the dark matter of your digital workspace into a visible, organized constellation
- **Intelligence Over Inventory:** Don't just list files—understand context, extract meaning, surface insights
- **Curation Over Clutter:** Focus teams on the 20 files that matter, not the 10,000 that don't
- **Federation Over Fragmentation:** One search, one workspace, spanning Microsoft 365, Slack, Google Workspace—wherever your knowledge lives

---

## 1.2 The Problem: The Dark Matter of Enterprise Knowledge

**What Enterprises Face:**

**1. Storage Waste Disguised as "Archive"**
- 30-40% of enterprise storage is "dead capital": files untouched for 6+ months, duplicates, abandoned projects
- IT receives alerts but has no visibility into *what* is wasted or *why* it matters
- Cost: $50K-200K/year in storage fees for data nobody uses

**2. Metadata Poverty**
- Files named "Document1.docx", "Copy of final_v2_FINAL.xlsx", "Untitled.pdf"
- SharePoint libraries with no tags, no descriptions, no structure
- Search returns 10,000 results (all irrelevant) or 0 results (the answer exists, but search can't find it)

**3. Knowledge Fragmentation**
- Budget discussions split across: SharePoint folder, Teams channel, Slack thread, email chain, Google Drive
- New hires ask "Where is the [X]?" and get 5 different answers
- Teams recreate work that already exists because they can't find the original

**4. Governance Blindness**
- IT admins have no way to answer: "Show me all files shared externally" or "Find PII stored in wrong locations"
- Compliance audits become 6-week fire drills of manual investigation
- Security violations hide in plain sight until they become breaches

---

## 1.3 The Solution: Aethos as Your Intelligence Layer

**Aethos sits on top of your existing systems (Microsoft 365, Slack, Google Workspace) and provides three pillars of organizational clarity:**

### **Pillar 1: The Constellation (Discovery & Governance)**
**What It Does:**
- Scans your entire Microsoft 365 tenant in minutes (SharePoint, OneDrive, Teams)
- Identifies **dead capital**: storage waste, duplicates, orphaned content, stale files
- Surfaces **security exposure**: externally shared files, permission sprawl, PII in wrong locations
- Provides **one-click remediation**: bulk archive, bulk delete, with provider-specific safety gates

**The Benefit:**
> "In 10 minutes, see the full constellation of your digital assets. In 10 days, reclaim 30% of your storage. In 10 weeks, establish governance that prevents future chaos."

**User Persona:** IT Admins, Compliance Officers, Operations Managers

---

### **Pillar 2: The Nexus (Workspaces as Operational Anchors)**
**What It Does:**
- Creates **curated workspaces** that aggregate content from multiple platforms (SharePoint + Teams + Slack + Google Drive)
- Provides **Intelligence Score** (0-100) rating metadata quality and organizational clarity
- Enables **auto-sync rules**: "Automatically add new budget files from Finance folder to my Budget Workspace"
- Offers **workspace protocols**: pre-built templates (Client Engagement, Project Kickoff, Employee Onboarding)

**The Benefit:**
> "Give your team a workspace with the 20 essential files, 3 key channels, and 5 critical links—not the 10,000 irrelevant files drowning them today. Turn workspaces into **operational anchors**, not junk drawers."

**User Persona:** Department Heads, Project Managers, Team Leads

---

### **Pillar 3: The Oracle (Intelligent Search & Metadata Enrichment)**
**What It Does:**
- **Base Tier (Always On):** Search across all connected systems (M365, Slack, Google) using enriched metadata (AI-improved titles/tags, one-time enrichment, no ongoing cost)
- **AI+ Tier (Opt-In):** Search *inside* document contents, semantic understanding ("files about budget planning" finds "financial forecasting"), AI summaries, question answering
- **Toggleable AI:** Privacy-friendly—some customers don't want AI reading files, so all AI features can be turned off

**The Benefit:**
> "Transform enterprise search from 'find files' to 'get answers.' Base tier: fast, metadata-rich search. AI+ tier: semantic intelligence that reads contents and understands context. You choose the level of intelligence you need."

**User Persona:** Everyone (especially knowledge workers who "know it's somewhere")

---

## 1.4 Brand Philosophy: The Operational Architect

**Who You Are (With Aethos):**
- **Architect**, not Janitor: You design clarity, not just clean up messes
- **Strategist**, not Sysadmin: You identify dead capital and recover it, not just manage storage alerts
- **Curator**, not Collector: You focus teams on what matters, not hoard everything "just in case"
- **Oracle**, not Search Engine: You surface insights, not just file lists

**Language We Use:**
- ✅ "**Operational Clarity**" (not "risk mitigation")
- ✅ "**Dead Capital Recovery**" (not "storage cleanup")
- ✅ "**Intelligence Federation**" (not "search aggregation")
- ✅ "**Operational Anchor**" (not "document hub")
- ✅ "**Metadata Enrichment**" (not "file tagging")

**Language We Avoid:**
- ❌ "Security Janitor" language: "Risk Detected", "Cleanup Required", "Violations Found"
- ❌ "IT Drudgery" language: "Scan Complete", "Data Processed", "Files Indexed"
- ❌ "Corporate Beige" language: "Document Management System", "Content Repository", "Knowledge Base"

**Design Philosophy (Aethos Glass):**
> "Enterprise software doesn't have to be boring. **Cinematic glassmorphism** on deep space backgrounds (#0B0F19). Starlight Cyan (#00F0FF) for growth. Supernova Orange (#FF5733) for waste. Every UI element contributes to **operational clarity**, not noise."

---

## 1.5 Value Propositions by Persona

### **For IT Admins:**
**The Promise:**
> "Find 30-40% storage waste, security violations, and orphaned content across your entire Microsoft 365 tenant in under 10 minutes. Then remediate it in bulk with one-click actions. Governance that takes 10 minutes, not 10 weeks."

**Outcome:**
- **Cost Savings:** Reclaim $50K-200K/year in wasted storage
- **Risk Reduction:** Find and fix security exposures before they become breaches
- **Time Savings:** Automated discovery replaces 40 hours/month of manual audits

---

### **For Knowledge Workers:**
**The Promise:**
> "Search your entire company's knowledge (M365 + Slack + Google) in one place. Get answers, not file lists. Find the 'pricing model doc' even when it's named 'Document1.docx' buried in a forgotten folder."

**Outcome:**
- **Productivity:** 5-10 hours/week saved searching for content
- **Confidence:** Know you found the *right* file, not just *a* file
- **Clarity:** See context (when was this created? who worked on it? is it still relevant?)

---

### **For Department Heads:**
**The Promise:**
> "Create curated workspaces that bring together the 20 files, 5 channels, and 3 SharePoint sites your team actually needs—without the 10,000 files they don't. Turn workspaces into operational anchors, not information graveyards."

**Outcome:**
- **Team Focus:** Stop drowning in noise, focus on what matters
- **Onboarding:** New hires get "here's everything you need" not "good luck finding stuff"
- **Context Preservation:** When someone leaves, their knowledge doesn't disappear

---

### **For Executives:**
**The Promise:**
> "Get strategic context without digging through 50 files. AI reads your documents and answers: 'Why did we choose AWS over Azure?' 'What was our Q4 revenue?' 'What did legal say about the acquisition?' Insights, not file lists."

**Outcome:**
- **Decision Speed:** Get answers in 2 minutes, not 2 hours
- **Strategic Clarity:** Understand past decisions without asking your assistant
- **Operational Visibility:** See what's working (high Intelligence Score workspaces) vs. what's chaos (low scores)

---

### **For Compliance/Legal:**
**The Promise:**
> "Find every document mentioning 'Johnson lawsuit' or containing PII in seconds. eDiscovery that takes 2 hours, not 2 weeks. Compliance audits with one-click exports. Find what regulators will find, before they find it."

**Outcome:**
- **Risk Mitigation:** Discover PII exposure, external sharing violations, retention gaps
- **Audit Readiness:** Instant reports for compliance officers and regulators
- **Legal Defensibility:** Complete audit trails for every search, access, and remediation action

---

## 1.6 Market Positioning: The Anti-Intranet

**Why "Anti-Intranet"?**

Traditional intranets failed because they:
- ❌ Tried to replace existing tools (forcing migration = adoption failure)
- ❌ Became "one more place to check" (adding noise, not reducing it)
- ❌ Focused on content creation (news feeds, wikis) not content discovery
- ❌ Required manual curation (unsustainable at scale)

**Aethos succeeds because we:**
- ✅ **Enhance existing tools** (sit on top of M365, Slack, Google—no migration)
- ✅ **Reduce noise** (curated workspaces focus on what matters)
- ✅ **Focus on discovery** (find what exists, don't create more content)
- ✅ **Automate intelligence** (AI enriches metadata, auto-sync rules maintain workspaces)

**The Tagline:**
> **"Aethos: Organizational Clarity Through Intelligence"**  
> *(Not another intranet. Not another content dump. An intelligence layer that makes your existing knowledge visible, searchable, and actionable.)*

---

## 1.7 Target Market & Distribution

### **Primary Market (v1):**

**Customer Profile:**
- **Company Size:** 500-2,000 employees (mid-market, not SMB, not true enterprise)
- **Industry:** Tech, Professional Services, Financial Services, Healthcare (knowledge-intensive)
- **Pain Point:** "We have 10TB of SharePoint and nobody can find anything"
- **Budget Authority:** IT Director, CIO, VP of Operations, Head of Compliance
- **Pricing Sensitivity:** $500-700/month is acceptable for clear ROI (20-40 hours/month time savings = $5K-10K/month value)

**Why This Segment?**
- ✅ Large enough to have pain (500+ employees = significant knowledge chaos)
- ✅ Small enough to move fast (not 12-month enterprise sales cycles)
- ✅ Microsoft 365 maturity (already invested in M365, not Google-only shops)
- ✅ Budget flexibility (can approve $499/mo SaaS without procurement hell)

---

### **Distribution Strategy:**

**Primary Channel: Microsoft AppSource**
- ✅ Native M365 integration (customers trust AppSource apps)
- ✅ Delegated permissions (no scary "Application" permissions)
- ✅ Microsoft's distribution engine (they promote quality apps)
- ✅ Pricing alignment (AppSource customers expect $500-2,000/mo per-tenant pricing)

**Secondary Channel: Direct Sales**
- ✅ LinkedIn outreach (IT Directors at 500-2,000 employee companies)
- ✅ Cold email (personalized: "I see your company uses M365. Storage waste is costing you $X...")
- ✅ Free trial (14 days, no credit card, auto-run Discovery to show waste)

**Future Channel: Partner Network (Phase 2)**
- ✅ Microsoft MSPs (Managed Service Providers who support M365 customers)
- ✅ Implementation consultants (SharePoint/Teams consultants can resell Aethos)
- ✅ Referral program (20% revenue share for partners)

---

### **Competitive Positioning:**

| Competitor | Their Pitch | Our Counter-Positioning |
|------------|-------------|-------------------------|
| **SharePoint Search** | "We're built into M365" | "You're metadata-only with terrible metadata. We enrich metadata + read contents (AI+)." |
| **Elastic/Algolia Enterprise Search** | "We're fast and powerful" | "You're infrastructure, not intelligence. We understand M365 permissions, context, and business logic." |
| **AvePoint/Metalogix (Governance)** | "We provide compliance and migration" | "You're compliance-first, we're intelligence-first. Governance as a benefit, not the entire product." |
| **Google Workspace** | "Switch from Microsoft to us" | "We integrate with both. No migration needed. Intelligence across all platforms." |
| **Traditional Intranets (SharePoint, Confluence)** | "Create more content in our system" | "We help you find what exists. Intelligence over bloat. The Anti-Intranet." |

---

## 1.8 Success Metrics: What Organizational Clarity Looks Like

**3 Months After Deployment:**

**IT Metrics:**
- ✅ **30-40% storage waste identified** (and 50% of it archived/deleted)
- ✅ **10-15 security violations remediated** (external shares revoked, PII moved to secure locations)
- ✅ **40 hours/month time savings** (automated discovery replaces manual audits)

**User Metrics:**
- ✅ **5-10 hours/week per knowledge worker** (time saved searching)
- ✅ **80%+ search success rate** (find what they're looking for on first try)
- ✅ **50+ active workspaces** (teams curating operational anchors)

**Business Metrics:**
- ✅ **$50K-200K/year cost savings** (storage reclamation)
- ✅ **3x faster onboarding** (new hires have curated workspaces, not chaos)
- ✅ **70+ Intelligence Score average** (workspaces are well-organized, not junk drawers)

**Executive Visibility:**
- ✅ **"Where is the [X]?" answered in <2 minutes** (not 2 hours of hunting)
- ✅ **Strategic context recovered** (Oracle AI+ reads past decisions, surfaces insights)
- ✅ **Operational dashboard** (see which teams have clarity vs. chaos)

---

## 1.9 The Aethos Promise

**To IT Admins:**
> "We give you governance visibility in 10 minutes that used to take 10 weeks. Your storage waste, security exposure, and orphaned content—visible, quantified, and remediable with one-click bulk actions."

**To Knowledge Workers:**
> "We make enterprise search work like Google: fast, relevant, and actually helpful. Search across M365, Slack, Google in one place. Get answers, not file lists."

**To Department Heads:**
> "We help you curate operational anchors, not manage information graveyards. Give your team the 20 files that matter, hide the 10,000 that don't."

**To Executives:**
> "We surface strategic context without the dig. Your company's past decisions, current initiatives, and future plans—intelligently organized and instantly searchable."

**To Compliance Officers:**
> "We find what regulators will find, before they find it. eDiscovery in hours, not weeks. PII detection that actually reads file contents, not just filenames."

---

**The Ultimate Vision:**
> "Every enterprise should have **organizational clarity**—the ability to see their full constellation of knowledge, understand what matters, and act with confidence. Aethos makes this possible by being the intelligence layer that sits on top of the chaos, bringing light to the dark matter of enterprise knowledge."

> "We're not here to replace your tools. We're here to make them work together. To turn scattered data into federated intelligence. To transform operational chaos into architectural clarity."

> "**This is Aethos. The Anti-Intranet. Organizational Clarity Through Intelligence.**"

---

# 2. Architecture Overview

## 2.1 Technology Stack (Simplified Architecture)

**Decision:** Use Vercel + Supabase for v1, migrate to Azure only when needed (>1,000 tenants or enterprise deals require it).

### **Frontend**
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite (fast dev server, optimized builds)
- **Styling:** Tailwind CSS v4 (CSS-first, no config file)
- **State Management:** React Context API (no Redux/Zustand)
- **Routing:** React Router v6 (Data mode with loaders)
- **Deployment:** Vercel (auto-deploy from Git, edge CDN)

### **Backend**
- **API Layer:** Vercel Serverless Functions (Node.js + Express)
- **Database:** Supabase PostgreSQL with Row-Level Security (RLS)
- **Authentication:** Microsoft Entra ID via MSAL.js (delegated permissions)
- **External APIs:** Microsoft Graph API (primary), Slack API, Google Workspace API

### **Data Layer**
- **Primary Database:** Supabase PostgreSQL (metadata storage)
- **File Storage:** None (metadata-only architecture, pointers to source)
- **Caching:** Vercel Edge Cache + Supabase connection pooling
- **Search Index:** PostgreSQL full-text search (base tier) + OpenAI embeddings (AI+ tier)

### **AI Services (Optional - AI+ Tier Only)**
- **Provider:** OpenAI API (GPT-4 for summarization, text-embedding-3-large for semantic search)
- **Cost Model:** Pass-through to customer (included in $199/mo AI+ tier)
- **Toggle:** All AI features can be turned on/off per tenant

### **Why This Stack?**

| Requirement | Solution | Cost |
|-------------|----------|------|
| **Multi-tenant database** | Supabase PostgreSQL + RLS | $0-25/mo |
| **Serverless backend** | Vercel Functions | $0-20/mo |
| **Static hosting + CDN** | Vercel | $0 |
| **M365 integration** | MSAL.js + Microsoft Graph API | $0 |
| **Build time** | Vite + Vercel (30-60 sec) | $0 |
| **Total MVP cost** | | **$0-45/mo** |

**Future Migration to Azure:**
- **Trigger:** Monthly revenue >$50K OR active tenants >1,000 OR enterprise deals require Azure
- **Timeline:** 3-6 months migration effort
- **Why defer?** No need for Azure complexity until we prove product-market fit

---

## 2.2 Multi-Tenant Architecture

### **Tenant Isolation Strategy**

**Database Level:**
```sql
-- Every table has tenant_id for isolation
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row-Level Security (RLS) enforces tenant boundaries
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON workspaces
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

**Why RLS?**
- ✅ Impossible to accidentally query another tenant's data
- ✅ Enforced at database level (not application level)
- ✅ Auditable (every query is tenant-scoped)

**Application Level:**
```javascript
// Set tenant context on every request
app.use((req, res, next) => {
  const tenantId = req.user.tenantId; // From MSAL auth token
  req.db.query('SET app.current_tenant_id = $1', [tenantId]);
  next();
});
```

### **Tenant Provisioning Flow**

1. **Admin installs Aethos from AppSource**
2. **Microsoft redirects to Aethos with tenant_id**
3. **Aethos creates:**
   - `tenants` row (tenant_id, domain, subscription status)
   - `users` row for admin (linked to Entra ID)
   - `tenant_settings` row (default configuration)
4. **Admin grants Microsoft Graph permissions** (read M365 metadata)
5. **Aethos kicks off initial Discovery scan** (background job)

**Tenant De-provisioning (GDPR Compliance):**
```sql
-- DELETE CASCADE removes all tenant data
DELETE FROM tenants WHERE id = 'tenant-uuid';
-- Deletes: workspaces, assets, enrichments, users, settings (all tables)
```

---

## 2.3 Authentication & Authorization

### **Authentication Flow (MSAL.js)**

```javascript
// Step 1: User clicks "Sign in with Microsoft"
const loginRequest = {
  scopes: ['User.Read', 'Files.Read.All', 'Sites.Read.All']
};

const result = await msalInstance.loginPopup(loginRequest);
// Returns: { accessToken, account: { tenantId, username, name } }

// Step 2: Send token to Aethos backend
const aethosToken = await fetch('/api/auth/exchange', {
  method: 'POST',
  body: JSON.stringify({ msftToken: result.accessToken })
});

// Step 3: Backend validates token, creates session
// Step 4: Frontend stores Aethos session token
```

**What We DON'T Store:**
- ❌ User passwords (use Microsoft's auth)
- ❌ File contents (metadata-only)
- ❌ Microsoft access tokens beyond request lifetime

**What We DO Store:**
- ✅ User profile (name, email, tenant_id)
- ✅ Aethos-specific permissions (Admin, Creator, Member)
- ✅ Metadata pointers (file IDs, URLs, not contents)

### **Authorization Model (RBAC)**

**Plain English Roles (not technical jargon):**

| Role | Description | Permissions |
|------|-------------|-------------|
| **Admin** | Tenant administrator | Full control: Discovery, Workspaces, Oracle, Settings, Billing |
| **Creator** | Can create workspaces | Create/edit workspaces, search, view Discovery |
| **Member** | Read-only user | Search, view workspaces (no editing) |

**Permission Checks:**
```javascript
// Example: Check if user can edit workspace
function canEditWorkspace(user, workspace) {
  if (user.role === 'Admin') return true; // Admins can edit anything
  if (user.role === 'Creator' && workspace.created_by === user.id) return true;
  return false;
}
```

**Future Roles (Phase 2+):**
- **Auditor:** Read-only access to Discovery + audit logs (compliance use case)
- **Curator:** Can archive/delete content (governance use case)
- **Custom Roles:** Fine-grained permissions per workspace (enterprise use case)

---

## 2.4 Data Architecture Principles

### **Principle 1: Metadata-Only Storage**

**What We Store:**
```json
{
  "asset_id": "uuid",
  "source_id": "microsoft:drive-item-abc123",
  "name": "Q4_Budget_Final.xlsx",
  "url": "https://tenant.sharepoint.com/sites/Finance/...",
  "author": "sarah.johnson@company.com",
  "modified_date": "2025-01-15T10:30:00Z",
  "size_bytes": 2457600,
  "location_path": "Finance Team > Budget",
  "enriched_title": "Q4 2024 Budget - Finance Department", // AI-enriched
  "enriched_tags": ["budget", "finance", "q4", "planning"] // AI-enriched
}
```

**What We DON'T Store:**
- ❌ File contents (unless AI+ tier, temporarily for processing)
- ❌ Copies of documents
- ❌ Backup/archive of source data

**Why Metadata-Only?**
- ✅ **Compliance:** We're not a "system of record" (no GDPR data controller burden)
- ✅ **Performance:** 1GB of metadata = 1TB of files (1000:1 ratio)
- ✅ **Cost:** PostgreSQL storage << Azure Blob storage
- ✅ **Simplicity:** No sync conflicts, source is always truth

### **Principle 2: Side-Car Database**

```
┌─────────────────────────────────────────────────────────┐
│                  Microsoft 365 Tenant                   │
│  (Source of Truth - files, permissions, users)          │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ Microsoft Graph API (read metadata)
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Aethos Side-Car Database                   │
│  (Enriched Metadata - tags, Intelligence Score, etc.)   │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   assets     │  │ enrichments  │  │  workspaces  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Benefits:**
- ✅ Source system remains unchanged (no M365 modifications)
- ✅ Can enrich metadata without affecting source
- ✅ Can delete Aethos entirely without data loss (just lose enrichments)

### **Principle 3: Sync, Don't Store**

**Discovery Sync Pattern:**
1. **Scan:** Query Microsoft Graph API for file metadata
2. **Diff:** Compare with existing `assets` table (detect new/modified/deleted)
3. **Update:** Upsert changes to Aethos database
4. **Enrich:** Run AI enrichment on new/modified assets (if AI+ enabled)

**Frequency:**
- **Initial scan:** Full sync (all files)
- **Incremental sync:** Every 6 hours (Microsoft Graph delta queries)
- **Real-time:** Not supported in v1 (defer to v2 via webhooks)

---

# 3. Module 1: The Constellation (Discovery)

## 3.1 Overview

**Purpose:** Scan the Microsoft 365 tenant (+ connected systems like Slack) to inventory all digital assets and identify operational inefficiencies.

**User Persona:** IT Admin, Compliance Officer, Operations Manager

**Key Metrics:**
- **Storage Waste:** Files not accessed in 6+ months, duplicates, orphaned content
- **Security Exposure:** Files shared externally, broken permissions, PII in wrong locations
- **Structural Health:** Abandoned Teams, over-complicated hierarchies, naming chaos

**User Experience:**
```
Admin lands on Discovery Dashboard
↓
Sees: "3.2TB storage, 847GB waste detected (26%)"
↓
Clicks: "Show me the waste"
↓
Sees: List of 2,847 files (sortable, filterable)
↓
Selects: 500 files to archive
↓
Clicks: "Archive Selected" (bulk action)
↓
Aethos: Sends archive command to Microsoft Graph API
↓
Confirmation: "500 files archived successfully"
```

---

## 3.2 Core Features

### **Feature 1: Asset Inventory**

**What Gets Scanned:**
- ✅ **SharePoint Sites:** Document libraries, lists, pages
- ✅ **OneDrive:** User files (respects privacy settings)
- ✅ **Teams:** Channels, tabs, files, chats (metadata only)
- ✅ **Slack:** Channels, files, messages (metadata only, if connected)
- ⚠️ **Google Workspace:** Read-only discovery (no management) - Phase 1.1

**What Gets Stored (Per Asset):**
```typescript
interface Asset {
  id: string; // Aethos UUID
  tenant_id: string; // Multi-tenant isolation
  source_provider: 'microsoft' | 'slack' | 'google'; // Provider
  source_id: string; // Provider's unique ID (e.g., SharePoint Item ID)
  source_url: string; // Direct link to asset
  
  // Core Metadata
  name: string; // Original filename
  type: 'file' | 'folder' | 'site' | 'channel' | 'page';
  mime_type: string; // e.g., "application/pdf"
  size_bytes: number;
  
  // People
  author_email: string;
  author_name: string;
  modified_by_email: string;
  
  // Timestamps
  created_date: string; // ISO 8601
  modified_date: string;
  last_accessed_date: string | null; // May not be available
  
  // Location
  location_path: string; // e.g., "Finance Team > Budget > 2024"
  parent_id: string | null; // For hierarchy
  
  // Sharing & Permissions
  is_shared_externally: boolean;
  share_count: number;
  permission_type: 'private' | 'team' | 'org' | 'public';
  
  // Intelligence (Enriched)
  enriched_title: string | null; // AI-improved title
  enriched_tags: string[]; // AI-extracted tags from Metadata Intelligence Layer
  user_tags: string[]; // Manually assigned tags by users/admins
  intelligence_score: number | null; // 0-100
  
  // Combined tags for workspace sync matching
  get all_tags(): string[] {
    return [...this.user_tags, ...this.enriched_tags];
  }
  
  // Operational Flags
  is_orphaned: boolean; // No owner or inactive owner
  is_duplicate: boolean; // Duplicate hash detected
  is_stale: boolean; // Not accessed in 6+ months
  
  // Sync Metadata
  last_synced_at: string;
  sync_status: 'active' | 'error' | 'deleted';
}
```

### **Feature 2: Storage Waste Detection**

**Waste Categories:**

1. **Stale Content** (40-50% of waste)
   - Files not accessed in 6+ months
   - Files in archived Teams still taking up storage
   - OneDrive files from former employees

2. **Duplicates** (20-30% of waste)
   - Exact hash matches (same file, different locations)
   - Near-duplicates (e.g., "Budget v1", "Budget v2", "Budget FINAL")

3. **Orphaned Content** (10-15% of waste)
   - Files with no owner (user deleted/left company)
   - Teams with no active members
   - SharePoint sites with no site collection admin

4. **Oversized Files** (10-15% of waste)
   - Files >100MB that could be compressed
   - Video files stored in SharePoint (should be in Stream)
   - Backup files (e.g., .bak, .tmp) in production locations

**Detection Logic:**
```sql
-- Example: Find stale files
SELECT name, size_bytes, last_accessed_date, location_path
FROM assets
WHERE tenant_id = 'current-tenant'
  AND type = 'file'
  AND last_accessed_date < NOW() - INTERVAL '6 months'
  AND sync_status = 'active'
ORDER BY size_bytes DESC
LIMIT 1000;
```

**UI Display:**
```
┌────────────────────────────────────────────────────────┐
│ 💾 Storage Waste Detected                              │
│ ─────────────────────────────────────────────────────  │
│ Total Storage: 3.2 TB                                  │
│ Wasted Storage: 847 GB (26%)                           │
│ Potential Savings: $127/month (Azure storage cost)    │
│                                                        │
│ [ View Stale Files ]  [ View Duplicates ]             │
└────────────────────────────────────────────────────────┘
```

### **Feature 3: Security Exposure Detection**

**Security Flags:**

1. **External Sharing Risks**
   - Files shared with external domains
   - Files with "Anyone with the link" permissions
   - Files shared with personal email addresses (@gmail.com, @yahoo.com)

2. **Permission Sprawl**
   - Files with 50+ direct sharers (indicates over-sharing)
   - SharePoint sites with broken permission inheritance
   - Users with Owner access who shouldn't have it

3. **PII Exposure (AI+ Tier Only)**
   - Documents containing SSN, credit card numbers, health data
   - PII stored outside approved locations (e.g., HR folder)
   - Sensitive data in non-encrypted files

**Detection Logic (Base Tier - Metadata Only):**
```sql
-- Find externally shared files
SELECT name, source_url, modified_by_email, location_path
FROM assets
WHERE tenant_id = 'current-tenant'
  AND is_shared_externally = true
  AND sync_status = 'active'
ORDER BY modified_date DESC;
```

**Detection Logic (AI+ Tier - Content Reading):**
```javascript
// Scan file contents for PII patterns
const piiPatterns = {
  ssn: /\b\d{3}-\d{2}-\d{4}\b/,
  creditCard: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/,
  phone: /\b\d{3}[- ]?\d{3}[- ]?\d{4}\b/
};

async function scanForPII(fileContent) {
  const violations = [];
  for (const [type, pattern] of Object.entries(piiPatterns)) {
    if (pattern.test(fileContent)) {
      violations.push(type);
    }
  }
  return violations;
}
```

---

## 3.3 Continuous Discovery (Retention Strategy)

> **Critical for Business:** Discovery must NOT feel like a one-time audit. These features ensure ongoing value and prevent churn.

### **Weekly Intelligence Reports (Automated)**

**Purpose:** Show new waste emerging every week, proving ongoing need for Aethos.

**Report Contents:**
```typescript
interface WeeklyDiscoveryReport {
  week_ending: string; // "2026-03-07"
  tenant_id: string;
  
  new_waste_detected: {
    stale_files: number; // Files that became stale this week (crossed 6-month threshold)
    stale_files_size_gb: number;
    duplicates: number; // New duplicate files detected
    duplicates_size_gb: number;
    orphaned_items: number; // Files with no owner or broken permissions
  };
  
  growth_metrics: {
    storage_added_gb: number; // New storage consumed this week
    files_created: number;
    fastest_growing_user: string; // User who added most storage
    fastest_growing_location: string; // Site/folder with most growth
  };
  
  workspace_health: {
    workspaces_declining: number; // Workspaces where Intelligence Score dropped >5%
    workspaces_improving: number;
    avg_intelligence_score: number;
  };
  
  predictive_alerts: {
    days_until_storage_limit: number | null; // Based on growth trend
    workspaces_at_risk: number; // No activity in 90+ days
    security_exposures_new: number; // New external shares detected
  };
}
```

**Email Template (Sent to Admins):**
```
Subject: Weekly Aethos Intelligence Report - March 7, 2026

📊 This Week's Discovery Highlights:

🗑️ NEW WASTE DETECTED
• 47 files became stale (no access in 6+ months) - 12.3 GB
• 8 duplicate files detected - 2.1 GB waste
• 3 orphaned SharePoint sites (no owner)

📈 STORAGE GROWTH
• 18.7 GB added this week (+1.2% growth)
• Sarah Thompson added most (4.2 GB in OneDrive)
• Marketing workspace growing fastest (8.1 GB)

⚠️ PREDICTIVE ALERTS
• At current rate, you'll hit storage limit in 47 days
• 5 workspaces have had no activity in 90+ days
• 12 new files shared externally this week

💡 OPERATIONAL CLARITY
• Average Intelligence Score: 78% (up from 76% last week)
• 3 workspaces declining in quality (need attention)

[View Full Report in Aethos →]
```

**Delivery Schedule:**
- Sent every Monday at 9 AM (tenant's local timezone)
- Stored in database for historical comparison
- Displayed in dashboard as "Latest Intelligence Report" widget

---

### **Trend Analysis Dashboard**

**Purpose:** Show progress over time = clients see value of keeping Aethos.

**Charts to Display:**

1. **Storage Waste Over Time**
   ```
   Chart: Line graph (last 6 months)
   Y-axis: Waste % (0-100%)
   X-axis: Months
   
   Shows: Declining trend = "Aethos is working!"
   Message: "You've reduced waste from 38% → 14% in 6 months"
   ```

2. **Dead Capital Recovered**
   ```
   Chart: Cumulative bar graph
   Y-axis: Storage reclaimed (GB)
   X-axis: Months
   
   Shows: Total waste archived/deleted since deployment
   Message: "You've recovered 427 GB of dead capital ($64/mo saved)"
   ```

3. **Operational Clarity Score**
   ```
   Chart: Gauge/speedometer
   Current: 81%
   Previous: 67%
   Industry Average: 58%
   
   Message: "You're in the top 15% of companies for operational clarity"
   ```

4. **Workspace Health Distribution**
   ```
   Chart: Stacked bar
   Categories: Excellent (90%+), Good (70-89%), Needs Work (<70%)
   
   Shows: Distribution of workspaces by Intelligence Score
   Message: "23 workspaces excellent, 8 good, 2 need attention"
   ```

---

### **Predictive Alerts (Proactive Intelligence)**

**Alert Types:**

1. **Storage Capacity Warning**
   ```typescript
   if (projectedDaysUntilLimit < 90) {
     createAlert({
       severity: 'high',
       title: 'Storage limit approaching',
       message: `At current growth rate, you'll hit your storage limit in ${days} days`,
       recommended_actions: [
         'Review stale files (847 GB available to archive)',
         'Check fastest-growing users for cleanup opportunities',
         'Consider increasing Microsoft 365 storage allocation'
       ]
     });
   }
   ```

2. **Workspace Quality Decline**
   ```typescript
   if (workspace.intelligenceScore < previousScore - 5) {
     createAlert({
       severity: 'medium',
       title: 'Workspace quality declining',
       message: `${workspace.name} Intelligence Score dropped from 85% → 72%`,
       causes: [
         '12 files added with poor metadata',
         '3 files haven't been accessed in 90 days',
         'Auto-sync rule may need adjustment'
       ]
     });
   }
   ```

3. **Stale Workspace Detection**
   ```typescript
   if (daysSinceLastActivity > 90) {
     createAlert({
       severity: 'low',
       title: 'Workspace appears abandoned',
       message: `${workspace.name} has had no activity in ${days} days`,
       suggested_action: 'Archive workspace or investigate if project is complete'
     });
   }
   ```

4. **New Waste Spike**
   ```typescript
   if (newWasteThisWeek > avgNewWaste * 2) {
     createAlert({
       severity: 'medium',
       title: 'Unusual waste detected',
       message: `${newWasteGB} GB of waste detected this week (2x normal)`,
       investigation: 'Check recent file uploads or project completions'
     });
   }
   ```

---

### **Automated Governance Rules (Set-and-Forget)**

**Purpose:** Make Aethos indispensable through automation. If they cancel, they lose the automation.

**Rule Types:**

1. **Auto-Archive Stale Content**
   ```typescript
   interface GovernanceRule {
     id: string;
     tenant_id: string;
     type: 'auto_archive';
     enabled: boolean;
     
     conditions: {
       days_since_last_access: number; // Default: 365
       exclude_locations: string[]; // Don't auto-archive HR folder
       exclude_file_types: string[]; // Don't auto-archive .xlsx (active reports)
     };
     
     action: 'archive' | 'notify_owner' | 'tag_for_review';
     schedule: 'weekly' | 'monthly'; // When to run
   }
   ```

2. **Auto-Tag New Files (AI Pattern Matching)**
   ```typescript
   // When new file is synced
   if (file.metadata.tags.length === 0) {
     const suggestedTags = await enrichMetadata(file.name, file.location);
     
     if (governanceRule.type === 'auto_tag' && governanceRule.enabled) {
       await updateAsset(file.id, { 
         enriched_tags: suggestedTags,
         enriched_by: 'aethos_auto_tag'
       });
     }
   }
   ```

3. **Auto-Add to Workspaces (Sync Rules)**
   ```typescript
   // Already exists in Workspaces module, but emphasize for retention
   interface AutoSyncRule {
     workspace_id: string;
     trigger: 'location_match' | 'author_match' | 'tag_match';
     
     // Example: Auto-add all files from "/Marketing/2026 Campaigns"
     location_pattern: '/Marketing/2026 Campaigns/**';
     
     // Run every 6 hours (incremental sync)
     last_run: string;
     next_run: string;
   }
   ```

**Admin UI:**
```
┌──────────────────────────────────────────────────┐
│ ⚙️ Automated Governance Rules                    │
│ ──────────────────────────────────────────────── │
│                                                  │
│ ✅ Auto-archive files after 12 months no access │
│    └─ Excludes: /Legal, /HR folders             │
│    └─ Last run: 47 files archived (Mar 3)       │
│                                                  │
│ ✅ Auto-tag new files with AI suggestions       │
│    └─ Applied to 234 files this month           │
│                                                  │
│ ✅ Alert on new external shares                 │
│    └─ 3 alerts sent this week                   │
│                                                  │
│ [ + Add New Rule ]                              │
└──────────────────────────────────────────────────┘
```

---

### **Why This Prevents Churn**

**Without Continuous Discovery:**
- ❌ One-time audit → "We're done, cancel subscription"
- ❌ No visibility into new waste emerging
- ❌ No automation = manual work resumes after canceling
- ❌ Feels transactional, not sticky

**With Continuous Discovery:**
- ✅ Weekly reports show new waste = "We still need this"
- ✅ Trend analysis shows progress = "We're getting better"
- ✅ Predictive alerts catch problems early = "This is proactive, not reactive"
- ✅ Automated rules = "If we cancel, we lose automation"
- ✅ Clients fear losing visibility/control if they cancel

**Retention Impact:**
- Expected churn reduction: 40-60% → 10-20%
- Annual contracts lock in 12 months regardless
- Continuous value = easier renewal conversations

---

## 3.4 Provider Adapters (Tiered Strategy)

**Philosophy:** Not all providers are equal. Focus full integration on core systems, surface-level discovery on periphery.

### **Tier 1: Core Synthesis (Full Management)**

**Providers:** Microsoft 365, Slack

**Capabilities:**
- ✅ Full metadata sync (read all properties)
- ✅ Bi-directional management (archive, delete, move)
- ✅ Permission management (grant/revoke access)
- ✅ Real-time updates (webhooks for instant sync) - v1.1

**Why These?**
- **M365:** Primary target market, deepest integration, Microsoft AppSource distribution
- **Slack:** #1 team communication tool, easy API, high ROI for search

**Microsoft Graph API Endpoints:**
```javascript
// Get all SharePoint sites
GET /v1.0/sites?search=*

// Get all files in a site
GET /v1.0/sites/{site-id}/drive/root/children

// Get file metadata
GET /v1.0/drives/{drive-id}/items/{item-id}

// Archive a file (set to read-only)
PATCH /v1.0/drives/{drive-id}/items/{item-id}
Body: { "deleted": { "state": "softDeleted" } }

// Delete a file
DELETE /v1.0/drives/{drive-id}/items/{item-id}
```

### **Tier 2: Shadow Discovery (Read-Only)**

**Providers:** Google Workspace, Box, Dropbox, Local File Shares

**Capabilities:**
- ✅ Metadata sync (inventory assets)
- ✅ Search (find content across providers)
- ⚠️ Limited management (no archive/delete)
- ❌ No permission management

**Why Limited?**
- **Use Case:** Find "shadow IT" (content outside M365)
- **Priority:** Lower than Tier 1 (most customers are M365-heavy)
- **Complexity:** Each provider has different API quirks

**Google Workspace API Example:**
```javascript
// Get all Google Drive files
GET https://www.googleapis.com/drive/v3/files
?q=mimeType!='application/vnd.google-apps.folder'
&fields=files(id,name,mimeType,size,createdTime,modifiedTime)

// Note: No management capabilities in v1
```

**Implementation Timeline:**
- **v1.0:** Microsoft 365 + Slack only
- **v1.1:** Google Workspace (read-only) - 2-week sprint
- **v1.2:** Box (read-only) - 1-week sprint
- **v2.0:** Full management for Google/Box - 4-week sprint

---

## 3.5 Remediation Protocols

**Philosophy:** Give users control, but make safe defaults.

### **Action 1: Archive**

**What Happens:**
```
User selects files to archive
↓
Aethos UI: "Archive 500 files?"
↓
User confirms
↓
Aethos backend: Loops through each file
↓
For each file: Send Microsoft Graph API request
  PATCH /drives/{drive-id}/items/{item-id}
  Body: { "deleted": { "state": "softDeleted" } }
↓
Microsoft: Moves file to Recycle Bin (30-day retention)
↓
Aethos: Updates asset record (sync_status = 'deleted')
```

**Provider-Specific Behavior:**
| Provider | Archive Action | Reversible? | Retention |
|----------|----------------|-------------|-----------|
| **Microsoft 365** | Move to Recycle Bin | ✅ Yes | 30 days |
| **Slack** | Native channel archive | ✅ Yes | Permanent (searchable but not interactive) |
| **Google Workspace** | Move to Trash | ✅ Yes | 30 days |
| **Box** | Move to Trash | ✅ Yes | 30 days |

### **Action 2: Delete**

**Safety Gates:**
1. **Soft Delete by Default:** Always use provider's trash/recycle bin first
2. **Deep Purge Requires Permission:** Only Admins can permanently delete
3. **Batch Limits:** Max 100 files per delete request (prevent accidental mass deletion)
4. **Audit Trail:** Every delete is logged with user, timestamp, reason

**Confirmation UI:**
```
┌─────────────────────────────────────────────────────────┐
│ ⚠️ Confirm Deletion                                     │
│ ─────────────────────────────────────────────────────   │
│ You're about to delete 47 files.                       │
│                                                         │
│ These files will be moved to the Recycle Bin and      │
│ permanently deleted after 30 days.                     │
│                                                         │
│ [ ✅ Soft Delete (Recycle Bin) ]  [ 🔥 Permanent ]     │
│ [ Cancel ]                                              │
└─────────────────────────────────────────────────────────┘
```

### **Action 3: Bulk Tagging (AI+ Tier)**

**Use Case:** IT Admin wants to tag all "client contracts" for easy discovery.

**Flow:**
```
User searches: "client contracts"
↓
AI+ reads file contents, finds 234 matching files
↓
User clicks: "Bulk Tag Selected"
↓
Aethos: Adds tag "client-contract" to asset records
↓
Future searches: "client-contract" tag returns these 234 files
```

**Why AI+ Only?**
- Base tier can only tag based on metadata (filename, location)
- AI+ tier reads contents to accurately identify contract docs

---

# 4. Module 2: The Nexus (Workspaces)

## 4.1 Overview

**Purpose:** Create curated collections of content from across M365, Slack, Google Workspace—like "playlists for work."

**User Persona:** Department Heads, Project Managers, Team Leads

**Analogy:** "If SharePoint is a messy library, Workspaces are like coffee table books—curated collections of the best content."

**Key Difference from SharePoint:**
- ❌ SharePoint: Stores files in rigid hierarchies (sites → libraries → folders)
- ✅ Aethos Workspaces: References files wherever they live (no moving, no duplicating)

**User Experience:**
```
Manager creates "Q1 Planning" workspace
↓
Adds:
  - 5 budget spreadsheets (from SharePoint)
  - 2 Teams channels (#planning, #budget-discussion)
  - 1 Slack thread (pricing negotiation)
  - 3 Google Slides (strategy decks)
↓
Result: One unified view of all Q1 planning content
↓
Team members: See only what matters (not 10,000 irrelevant files)
```

---

## 4.2 Core Features

### **Feature 1: Workspace Creation**

**Workspace Structure:**
```typescript
interface Workspace {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  created_by: string; // User ID
  created_at: string;
  
  // Intelligence
  intelligence_score: number; // 0-100 (based on metadata quality)
  
  // Visibility
  visibility: 'private' | 'team' | 'org'; // Who can see this workspace
  
  // Members
  member_ids: string[]; // Users who can access
  
  // Settings
  auto_sync: boolean; // Auto-add new content matching criteria?
  sync_rules: SyncRule[]; // e.g., "Auto-add files from Finance folder"
}

interface WorkspaceAsset {
  id: string;
  workspace_id: string;
  asset_id: string; // FK to assets table
  added_by: string; // User who added it
  added_at: string;
  pinned: boolean; // Pin to top of workspace
  notes: string | null; // User notes about why this asset is here
}
```

**Creation Flow:**
```
User clicks: "New Workspace"
↓
Form:
  - Name: "Q1 Budget Planning"
  - Description: "All budget files and discussions for Q1 2025"
  - Visibility: Team (Finance team only)
  - Auto-sync: ON (auto-add files from "Finance > Budget > Q1" folder)
↓
Clicks: "Create Workspace"
↓
Aethos: Creates workspace record + applies sync rules
↓
Result: Workspace pre-populated with 47 files matching rules
```

### **Feature 2: Cross-Platform Aggregation**

**What Can Be Added to a Workspace:**
- ✅ **Files:** SharePoint docs, OneDrive files, Google Drive files, Box files
- ✅ **Channels:** Teams channels, Slack channels
- ✅ **Sites:** SharePoint sites, Confluence pages (read-only)
- ✅ **Conversations:** Specific Slack threads, Teams chats (links, not full content)
- ✅ **External Links:** Any URL (e.g., Figma, Miro, Notion)

**Storage Model:**
```sql
-- Workspaces table
CREATE TABLE workspaces (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  intelligence_score INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspace assets (join table)
CREATE TABLE workspace_assets (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  added_by UUID NOT NULL REFERENCES users(id),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  pinned BOOLEAN DEFAULT FALSE,
  notes TEXT,
  UNIQUE(workspace_id, asset_id) -- Prevent duplicates
);
```

**UI Display:**
```
┌────────────────────────────────────────────────────────┐
│ 📁 Q1 Budget Planning                       Score: 87  │
│ ─────────────────────────────────────────────────────  │
│ 📌 Pinned Items                                        │
│   📄 Q1_Budget_Final.xlsx (SharePoint)                 │
│   💬 #budget-discussion (Teams)                        │
│                                                        │
│ 📂 Files (23)                                          │
│   📄 Revenue_Forecast_Q1.xlsx (OneDrive - Sarah)      │
│   📄 Expense_Breakdown.pdf (SharePoint)                │
│   📊 Q1_Presentation.pptx (Google Slides)              │
│                                                        │
│ 💬 Conversations (5)                                   │
│   🗨️ Pricing negotiation thread (Slack)               │
│   💬 Budget approval discussion (Teams)                │
└────────────────────────────────────────────────────────┘
```

### **Feature 3: Intelligence Score**

**Purpose:** Rate the quality and completeness of a workspace's metadata.

**Scoring Logic (Updated with Tag Quality):**
```javascript
function calculateIntelligenceScore(workspace) {
  let score = 0;
  const assets = getWorkspaceAssets(workspace.id);
  
  // Factor 1: Metadata completeness (20 points) - REDUCED
  const avgMetadataQuality = assets.reduce((sum, asset) => {
    let assetScore = 0;
    if (asset.enriched_title) assetScore += 33;
    if (asset.author_name) assetScore += 33;
    if (asset.modified_date) assetScore += 34;
    return sum + assetScore;
  }, 0) / assets.length;
  score += (avgMetadataQuality / 100) * 20;
  
  // Factor 2: Tag quality (15 points) - NEW
  const filesWithTags = assets.filter(a => 
    (a.user_tags?.length > 0 || a.enriched_tags?.length > 0)
  ).length;
  const tagCoveragePct = (filesWithTags / assets.length) * 100;
  
  const avgTagsPerFile = assets.reduce((sum, asset) => {
    const totalTags = (asset.user_tags?.length || 0) + (asset.enriched_tags?.length || 0);
    return sum + totalTags;
  }, 0) / assets.length;
  
  // Score: 80%+ files tagged = full points
  if (tagCoveragePct >= 80) {
    score += 15;
  } else {
    score += (tagCoveragePct / 80) * 15;
  }
  
  // Bonus: Average 2-5 tags per file is ideal
  if (avgTagsPerFile >= 2 && avgTagsPerFile <= 5) {
    // Already at full points
  } else if (avgTagsPerFile > 5) {
    // Too many tags (over-tagging)
    score -= 2; // Small penalty
  }
  
  // Factor 3: Naming clarity (15 points) - REDUCED
  if (workspace.name.length > 10 && !workspace.name.includes('untitled')) {
    score += 8;
  }
  if (workspace.description?.length > 20) {
    score += 7;
  }
  
  // Factor 4: Organizational structure (15 points) - REDUCED
  const hasPinnedItems = assets.some(a => a.pinned);
  if (hasPinnedItems) score += 8;
  
  const hasNotes = assets.some(a => a.notes);
  if (hasNotes) score += 7;
  
  // Factor 5: Cross-references (15 points) - NEW
  // Files that appear in multiple workspaces = better connected
  const crossReferencedAssets = assets.filter(a => a.workspace_count > 1).length;
  const crossRefPct = (crossReferencedAssets / assets.length) * 100;
  score += (crossRefPct / 100) * 15;
  
  // Factor 6: Ownership clarity (10 points) - NEW
  const filesWithOwners = assets.filter(a => a.author_email && a.author_name).length;
  const ownershipPct = (filesWithOwners / assets.length) * 100;
  score += (ownershipPct / 100) * 10;
  
  // Factor 7: Duplicates penalty (10 points) - NEW
  // Penalize workspaces with duplicate files
  const duplicates = assets.filter(a => a.is_duplicate).length;
  const duplicatePct = (duplicates / assets.length) * 100;
  if (duplicatePct < 5) {
    score += 10; // Few duplicates = full points
  } else {
    score += Math.max(0, 10 - (duplicatePct / 10)); // Lose points as duplicates increase
  }
  
  return Math.round(Math.min(100, score)); // Cap at 100
}
```

**Score Breakdown Display:**
```
Intelligence Score: 87%

Breakdown:
✅ Metadata completeness: 92% (18.4/20 pts)
✅ Tag quality: 85% (12.75/15 pts)     ← NEW
  └─ 120/142 files have tags (85% coverage)
  └─ Average 3.2 tags per file (ideal range)
✅ Naming clarity: 100% (15/15 pts)
✅ Organizational structure: 100% (15/15 pts)
✅ Cross-references: 89% (13.35/15 pts)  ← NEW
✅ Ownership clarity: 94% (9.4/10 pts)   ← NEW
⚠️ Duplicates: 68% (6.8/10 pts)         ← NEW
  └─ 12 duplicate files detected

💡 Improvement Tips:
• Add tags to 22 remaining files to reach 100% coverage
• Remove 12 duplicate files to improve score
• Pin key files for better organization

[Bulk Tag Files] [Remove Duplicates]
```

**Score Interpretation:**
- **90-100:** Exceptional (Clear structure, rich metadata, actively maintained)
- **70-89:** Good (Most content tagged, reasonable organization)
- **50-69:** Fair (Basic organization, some metadata gaps)
- **0-49:** Poor (Unclear structure, missing metadata, stale content)

**Why This Matters:**
- Helps users identify which workspaces need cleanup
- Gamifies metadata quality (users want high scores)
- Surfaces workspaces that are "operational anchors" vs. "junk drawers"

### **Feature 4: Auto-Sync Rules**

**Use Case:** "Automatically add all new files from the Finance > Budget folder to my Budget Workspace"

**Rule Structure:**
```typescript
interface SyncRule {
  id: string;
  workspace_id: string;
  rule_type: 'location' | 'tag' | 'author' | 'keyword';
  enabled: boolean; // Can disable without deleting
  
  // Location-based rule
  location_path?: string; // e.g., "Finance Team > Budget"
  
  // Tag-based rule (ENHANCED - Base Tier)
  tags_include_all?: string[]; // Must have ALL these tags (AND logic)
  tags_include_any?: string[]; // Must have ANY of these tags (OR logic)
  tags_exclude?: string[]; // Must NOT have these tags
  
  // Author-based rule
  author_emails?: string[]; // e.g., ["sarah@company.com"]
  
  // Keyword-based rule (AI+ tier only)
  keywords?: string[]; // Search in file content, e.g., ["budget", "forecast"]
  
  // Filters
  file_types?: string[]; // e.g., [".xlsx", ".pdf"] - empty = all types
  min_size_bytes?: number;
  max_size_bytes?: number;
  date_range?: { after?: string; before?: string }; // Only files created in range
  exclude_locations?: string[]; // Don't sync from these paths (e.g., /HR, /Legal)
  
  // Behavior
  auto_add: boolean; // Automatically add matching assets
  auto_remove: boolean; // Remove assets that no longer match
  max_files?: number; // Safety limit to prevent workspace bloat
  
  // Audit
  last_run?: string;
  files_added_count?: number; // Total files added by this rule
  created_at: string;
  created_by: string; // User who created the rule
}
```

**Example Rules:**

**Rule 1: Location-based**
```json
{
  "rule_type": "location",
  "location_path": "Finance Team > Budget > 2025",
  "file_types": [".xlsx", ".pdf"],
  "auto_add": true,
  "auto_remove": false
}
```
→ Every new file in "Finance > Budget > 2025" folder gets added to workspace

**Rule 2: Tag-based (Base Tier - Enhanced)**
```json
{
  "rule_type": "tag",
  "tags_include_any": ["q1-2026", "product-launch", "new-product"],
  "tags_include_all": ["approved"],
  "tags_exclude": ["archived", "obsolete", "draft"],
  "file_types": [".pdf", ".docx", ".pptx"],
  "date_range": { "after": "2026-01-01" },
  "exclude_locations": ["/HR", "/Finance/Payroll"],
  "auto_add": true,
  "auto_remove": true,
  "max_files": 500
}
```
→ Files with tags (q1-2026 OR product-launch OR new-product) AND approved, but NOT (archived OR obsolete OR draft), created after Jan 1 2026, excluding HR/Payroll folders

**Rule 2b: Simple Tag-based**
```json
{
  "rule_type": "tag",
  "tags_include_all": ["client-contract", "acme-corp"],
  "auto_add": true,
  "auto_remove": true
}
```
→ Any file tagged "client-contract" AND "acme-corp" is added automatically

**Rule 3: Author-based**
```json
{
  "rule_type": "author",
  "author_emails": ["sarah@company.com", "john@company.com"],
  "file_types": [".docx", ".pdf"],
  "auto_add": true
}
```
→ Any Word/PDF file created by Sarah or John is added automatically

**Sync Execution:**
```javascript
// Runs every 6 hours (after Discovery sync)
async function executeSyncRules(workspaceId) {
  const rules = await db.query(
    'SELECT * FROM sync_rules WHERE workspace_id = $1 AND enabled = true', 
    [workspaceId]
  );
  
  for (const rule of rules) {
    const matchingAssets = await findAssetsMatchingRule(rule);
    
    // Apply max_files safety limit
    const assetsToProcess = rule.max_files 
      ? matchingAssets.slice(0, rule.max_files)
      : matchingAssets;
    
    if (rule.auto_add) {
      // Add new assets that aren't already in workspace
      const currentAssets = await getWorkspaceAssets(workspaceId);
      const newAssets = assetsToProcess.filter(a => 
        !currentAssets.some(ca => ca.asset_id === a.id)
      );
      
      if (newAssets.length > 0) {
        await addAssetsToWorkspace(workspaceId, newAssets, 'system');
        
        // Update rule audit trail
        await db.query(
          'UPDATE sync_rules SET last_run = NOW(), files_added_count = files_added_count + $1 WHERE id = $2',
          [newAssets.length, rule.id]
        );
      }
    }
    
    if (rule.auto_remove) {
      // Remove assets that no longer match
      const currentAssets = await getWorkspaceAssets(workspaceId);
      const matchingIds = new Set(assetsToProcess.map(a => a.id));
      const assetsToRemove = currentAssets.filter(a => !matchingIds.has(a.asset_id));
      
      if (assetsToRemove.length > 0) {
        await removeAssetsFromWorkspace(workspaceId, assetsToRemove);
      }
    }
  }
}

// Enhanced asset matching for tag-based rules
async function findAssetsMatchingRule(rule) {
  let query = 'SELECT * FROM assets WHERE tenant_id = $1 AND sync_status = $2';
  const params = [rule.tenant_id, 'active'];
  
  if (rule.rule_type === 'tag') {
    // Tag-based matching (uses both user_tags and enriched_tags)
    if (rule.tags_include_all && rule.tags_include_all.length > 0) {
      // Must have ALL tags (AND logic)
      query += ' AND (user_tags @> $3 OR enriched_tags @> $3)';
      params.push(JSON.stringify(rule.tags_include_all));
    }
    
    if (rule.tags_include_any && rule.tags_include_any.length > 0) {
      // Must have ANY tag (OR logic)
      query += ' AND (user_tags ?| $' + (params.length + 1) + ' OR enriched_tags ?| $' + (params.length + 1) + ')';
      params.push(rule.tags_include_any);
    }
    
    if (rule.tags_exclude && rule.tags_exclude.length > 0) {
      // Must NOT have excluded tags
      for (const excludeTag of rule.tags_exclude) {
        query += ' AND NOT (user_tags @> $' + (params.length + 1) + ' OR enriched_tags @> $' + (params.length + 1) + ')';
        params.push(JSON.stringify([excludeTag]));
      }
    }
  }
  
  if (rule.rule_type === 'location' && rule.location_path) {
    query += ' AND location_path LIKE $' + (params.length + 1);
    params.push(rule.location_path + '%');
  }
  
  if (rule.rule_type === 'author' && rule.author_emails) {
    query += ' AND author_email = ANY($' + (params.length + 1) + ')';
    params.push(rule.author_emails);
  }
  
  // Apply filters
  if (rule.file_types && rule.file_types.length > 0) {
    query += ' AND mime_type = ANY($' + (params.length + 1) + ')';
    params.push(rule.file_types);
  }
  
  if (rule.date_range?.after) {
    query += ' AND created_date >= $' + (params.length + 1);
    params.push(rule.date_range.after);
  }
  
  if (rule.date_range?.before) {
    query += ' AND created_date <= $' + (params.length + 1);
    params.push(rule.date_range.before);
  }
  
  if (rule.exclude_locations && rule.exclude_locations.length > 0) {
    for (const excludePath of rule.exclude_locations) {
      query += ' AND location_path NOT LIKE $' + (params.length + 1);
      params.push(excludePath + '%');
    }
  }
  
  query += ' ORDER BY created_date DESC';
  
  return await db.query(query, params);
}
```

---

### **Feature 5: Tag Management & Assignment**

> **Critical for Tag-Based Sync:** Tags must be easy to assign/edit for the feature to be useful.

**Tag Sources (Two Types):**

1. **User-Assigned Tags** (`user_tags` field)
   - Manually added by admins/users
   - Authoritative (never overwritten by AI)
   - Used for workspace sync rules

2. **AI-Enriched Tags** (`enriched_tags` field)
   - Automatically generated by Metadata Intelligence Layer
   - Based on filename, location, content (AI+ tier)
   - Suggestions only (users can accept/reject)

**Data Model Update:**
```typescript
interface Asset {
  // ... existing fields ...
  
  // Tags (two sources)
  user_tags: string[]; // Manually assigned by users
  enriched_tags: string[]; // AI-suggested tags from Metadata Intelligence Layer
  
  // Combined view (for sync rule matching)
  get all_tags(): string[] {
    return [...this.user_tags, ...this.enriched_tags];
  }
}
```

**UI Location 1: Bulk Tag Editor (Discovery Module)**

```
┌────────────────────────────────────────────────────┐
│ 📋 Bulk Tag Editor                                 │
│ ──────────────────────────────────────────────────│
│ Selected: 23 files                                │
│                                                   │
│ 🏷️ Add Tags (comma-separated):                   │
│ ┌─────────────────────────────────────┐          │
│ │ q1-2026, marketing-campaign, final  │ [Add]    │
│ └─────────────────────────────────────┘          │
│                                                   │
│ Existing Tags (across 23 files):                 │
│ • draft (12 files) [Remove from all]             │
│ • review-needed (8 files) [Remove from all]      │
│ • confidential (3 files) [Remove from all]       │
│                                                   │
│ 🤖 AI Tag Suggestions (based on patterns):       │
│ [+ campaign] [+ product-launch] [+ external]     │
│                                                   │
│ 💡 Tip: Add 'q1-2026' tag to enable auto-sync to │
│         Q1 Planning workspace                     │
│                                                   │
│ [Apply to 23 Files] [Cancel]                     │
└────────────────────────────────────────────────────┘
```

**UI Location 2: File Detail Panel (Sidebar)**

```
┌────────────────────────────────────────────────────┐
│ 📄 2026-Q1-Marketing-Plan.pdf                      │
│ ──────────────────────────────────────────────────│
│ 📁 Location: /Marketing/Campaigns/Q1              │
│ 👤 Author: Sarah Thompson                         │
│ 📅 Modified: Feb 15, 2026                         │
│ 💾 Size: 2.4 MB                                   │
│                                                   │
│ 🏷️ Tags:                                          │
│ [marketing ×] [q1-2026 ×] [strategy ×]           │
│                                                   │
│ Add tag: [_________________] [+]                  │
│                                                   │
│ 🤖 AI-Suggested Tags:                             │
│ [+ quarterly-plan] [+ budget] [+ approved]        │
│ (From Metadata Intelligence Layer)                │
│                                                   │
│ 📂 In Workspaces:                                 │
│ • Marketing Strategy (location rule)              │
│ • Q1 Planning (tag rule: q1-2026) ←              │
│                                                   │
│ 💡 Removing 'q1-2026' tag will remove this file  │
│    from Q1 Planning workspace (auto-remove rule)  │
│                                                   │
│ [Open in SharePoint] [Add to Workspace]          │
└────────────────────────────────────────────────────┘
```

**UI Location 3: Workspace Settings - Sync Rules**

```
┌────────────────────────────────────────────────────┐
│ Workspace: Q1 2026 Product Launch                  │
│ ──────────────────────────────────────────────────│
│ ⚙️ Auto-Sync Rules                                 │
│                                                   │
│ ✅ Rule 1: Tag-based sync                         │
│    Auto-add files with tags:                      │
│    • Include ANY: [q1-2026, product-launch]       │
│    • Must also have: [approved]                   │
│    • Exclude: [archived, draft]                   │
│                                                   │
│    Additional filters:                            │
│    • File types: .pdf, .docx, .pptx               │
│    • Created after: Jan 1, 2026                   │
│    • Exclude locations: /HR, /Finance             │
│                                                   │
│    Status: ✅ Active (47 files synced)            │
│    Last run: 2 hours ago                          │
│    [Preview Matches] [Edit] [Disable]             │
│                                                   │
│ ✅ Rule 2: Location-based sync                    │
│    Auto-add files from:                           │
│    • Location: /Product/Launch/*                  │
│                                                   │
│    Status: ✅ Active (31 files synced)            │
│    Last run: 2 hours ago                          │
│    [Edit] [Disable]                               │
│                                                   │
│ [+ Add New Rule]                                  │
└────────────────────────────────────────────────────┘
```

**UI Location 4: Workspace Tag Cloud (Overview)**

```
┌────────────────────────────────────────────────────┐
│ 📁 Workspace: Q1 2026 Product Launch                │
│ ──────────────────────────────────────────────────│
│ 142 files | Intelligence Score: 87%               │
│                                                   │
│ 🏷️ Tag Cloud (most common tags in workspace):     │
│                                                   │
│   q1-2026 (47)    product-launch (38)             │
│   approved (29)   marketing (22)                  │
│   sales-enablement (15)   external (12)           │
│   presentation (10)   budget (8)                  │
│                                                   │
│ 🔍 Filter by tag: [___________] 🔎               │
│                                                   │
│ 🤖 Auto-Sync Status:                              │
│ • 2 active rules                                  │
│ • 78 files auto-synced (55% of workspace)         │
│ • Last sync: 2 hours ago                          │
│ • [Manage Sync Rules]                             │
│                                                   │
│ 📊 Intelligence Score Breakdown:                  │
│ ✅ Tag quality: 85% (120/142 files have tags)     │
│ ✅ Metadata completeness: 92%                     │
│ ⚠️ Recency: 78% (some stale files)                │
│                                                   │
│ [Add Files] [Tag All Files] [Settings]            │
└────────────────────────────────────────────────────┘
```

**Tag Assignment API:**
```typescript
// POST /api/assets/bulk-tag
interface BulkTagRequest {
  asset_ids: string[];
  tags_to_add: string[];
  tags_to_remove: string[];
}

// Example request
{
  "asset_ids": ["uuid-1", "uuid-2", "uuid-3"],
  "tags_to_add": ["q1-2026", "approved"],
  "tags_to_remove": ["draft"]
}

// Backend logic
async function bulkUpdateTags(req: BulkTagRequest) {
  for (const assetId of req.asset_ids) {
    const asset = await db.query('SELECT * FROM assets WHERE id = $1', [assetId]);
    
    // Add new tags
    const updatedTags = [...new Set([...asset.user_tags, ...req.tags_to_add])];
    
    // Remove tags
    const finalTags = updatedTags.filter(tag => !req.tags_to_remove.includes(tag));
    
    // Update database
    await db.query(
      'UPDATE assets SET user_tags = $1, updated_at = NOW() WHERE id = $2',
      [JSON.stringify(finalTags), assetId]
    );
    
    // Trigger workspace sync (check if any workspaces have tag-based rules)
    await triggerWorkspaceSyncForAsset(assetId);
  }
  
  return { success: true, assets_updated: req.asset_ids.length };
}
```

**Tag Validation & Warnings:**
```typescript
// Warn if tag is too broad
function validateTag(tag: string, tenantId: string): ValidationResult {
  const matchCount = await db.query(
    'SELECT COUNT(*) FROM assets WHERE tenant_id = $1 AND (user_tags @> $2 OR enriched_tags @> $2)',
    [tenantId, JSON.stringify([tag])]
  );
  
  if (matchCount > 1000) {
    return {
      valid: true,
      warning: `⚠️ Tag "${tag}" matches ${matchCount} files. Consider more specific tags for better workspace organization.`
    };
  }
  
  if (tag.length < 3) {
    return {
      valid: false,
      error: 'Tags must be at least 3 characters long.'
    };
  }
  
  // Suggest lowercase with hyphens
  const suggested = tag.toLowerCase().replace(/\s+/g, '-');
  if (tag !== suggested) {
    return {
      valid: true,
      suggestion: `Suggested format: "${suggested}" (lowercase with hyphens)`
    };
  }
  
  return { valid: true };
}
```

**Preview Matches (Before Enabling Rule):**
```typescript
// GET /api/workspaces/:id/sync-rules/preview
// Preview what files would match a rule before enabling it

async function previewSyncRule(rule: SyncRule): Promise<PreviewResult> {
  const matchingAssets = await findAssetsMatchingRule(rule);
  
  return {
    match_count: matchingAssets.length,
    sample_files: matchingAssets.slice(0, 10), // Show first 10
    total_size_gb: matchingAssets.reduce((sum, a) => sum + a.size_bytes, 0) / 1e9,
    warnings: [
      matchingAssets.length > 500 ? `⚠️ Rule matches ${matchingAssets.length} files (consider max_files limit)` : null,
      matchingAssets.length === 0 ? '⚠️ No files match this rule' : null
    ].filter(Boolean)
  };
}
```

**Why This Prevents Churn:**
- ✅ Tags make AI enrichment **actionable** (not just informational)
- ✅ Workspaces auto-organize based on tags = **mission-critical feature**
- ✅ Cross-platform aggregation = **can't replicate with native tools**
- ✅ More tags applied → more accurate workspaces → **virtuous cycle**
- ✅ Lose Aethos → lose smart aggregation → **organizational chaos**

---

### **Feature 5.1: Complete Tag Management UI Implementation (Feb 2026)**

> **Status:** ✅ **Production-Ready** - All 4 user flows fully designed and built  
> **Components:** 11 production-ready React components  
> **Revenue Impact:** +33% ARR from improved retention (60% → 80%)

**Documentation:** See `/docs/TAG_MANAGEMENT_COMPLETE_UI_SUMMARY.md` for full technical details and `/docs/TAG_MANAGEMENT_QUICK_DEMO_GUIDE.md` for demo script.

**The 4 Complete User Flows:**
1. **Workspace Creation Wizard** - 4-step flow with Smart/Manual/Hybrid choice + review
2. **Bulk Tag → Smart Suggestion** - Auto-suggests workspaces after tagging
3. **Pending Approvals Queue** - Review auto-synced files with approve/reject/block
4. **Workspace Settings** - Manage sync rules, configure auto-approval behavior

**Backend Requirements:**
- `POST /api/workspaces/create` with sync rules
- `GET/POST/PUT/DELETE /api/workspaces/:id/sync-rules`
- `GET /api/workspaces/:id/pending-files`
- `POST /api/assets/bulk-tag`
- Background job for sync rule execution (every 6 hours)
- WebSocket notifications for pending approvals

---

## 4.3 Workspace Protocols

**What Are Protocols?**
> "Pre-configured workspace templates for common use cases" (e.g., "Onboarding Protocol", "Client Engagement Protocol")

**Examples:**

### **Protocol 1: Client Engagement**
**Purpose:** Organize all content for a specific client relationship

**Pre-configured Structure:**
- 📁 **Contracts & Agreements** (auto-sync: files tagged "contract" + client name)
- 📁 **Project Files** (auto-sync: files in "Clients > [Client Name]" folder)
- 💬 **Communication Channels** (manually add: Teams channel, Slack channel, email folder link)
- 📊 **Reports & Deliverables** (auto-sync: files with ".pdf" or ".pptx" extensions)

**Auto-Generated Intelligence:**
- Last interaction date
- Contract renewal date (extracted from contract metadata)
- Total storage used by client
- Key contacts (extracted from file metadata)

### **Protocol 2: Employee Onboarding**
**Purpose:** Give new hires a curated view of essential resources

**Pre-configured Structure:**
- 📋 **Required Reading** (manually curated: employee handbook, policies)
- 🎥 **Training Videos** (auto-sync: files in "Training > New Hire" folder)
- 🔗 **Essential Links** (IT support, benefits portal, org chart)
- 👥 **Your Team** (auto-populated: manager, team members, their profiles)

### **Protocol 3: Project Kickoff**
**Purpose:** Start new projects with a clear structure

**Pre-configured Structure:**
- 🎯 **Project Brief** (template: pre-filled Word doc with sections)
- 📅 **Timeline & Milestones** (auto-sync: files with "timeline" or "roadmap" tags)
- 👥 **Team Directory** (auto-populated: project members from Teams channel)
- 📁 **Working Files** (auto-sync: all files in project folder)

**Implementation:**
```typescript
interface WorkspaceProtocol {
  id: string;
  name: string;
  description: string;
  icon: string;
  
  // Template structure
  sections: {
    name: string;
    type: 'files' | 'channels' | 'links' | 'people';
    sync_rule?: SyncRule; // Optional auto-sync
  }[];
  
  // Intelligence
  required_fields: string[]; // e.g., ["client_name", "contract_date"]
  intelligence_extractors: {
    field: string;
    extraction_logic: string; // e.g., "Extract date from file named '*contract*'"
  }[];
}
```

---

# 5. Module 3: The Oracle (Search & Intelligence)

## 5.1 Overview

**Purpose:** Unified search across all connected systems (M365, Slack, Google) with AI-powered intelligence.

**User Persona:** Everyone (but especially knowledge workers who "know it's somewhere")

**Key Differentiator:** 
- **Base Tier:** Search filenames, authors, dates, locations (metadata-only, fast, free)
- **AI+ Tier:** Search inside document contents, semantic search, summarization (+$199/mo)

**User Experience:**
```
User searches: "pricing model for enterprise customers"
↓
Base Tier:
  - Finds 3 files with "pricing" or "enterprise" in filename
  - Shows: "Pricing_2024.xlsx", "Enterprise_Sales_Deck.pptx"
↓
AI+ Tier:
  - Reads contents of 127 files
  - Finds 8 files that DISCUSS pricing models (even if not in filename)
  - Shows excerpts: "We recommend tiered pricing: $499 base, $199 AI add-on..."
  - Summarizes: "Your pricing model uses a base+upsell strategy..."
```

---

## 5.2 Core Features

### **Feature 1: Unified Search (Base Tier - Metadata Only)**

**What Gets Searched:**
```sql
-- PostgreSQL full-text search on metadata fields
SELECT 
  id, name, author_name, location_path, source_url, modified_date
FROM assets
WHERE tenant_id = 'current-tenant'
  AND (
    to_tsvector('english', name) @@ to_tsquery('pricing & model')
    OR to_tsvector('english', enriched_title) @@ to_tsquery('pricing & model')
    OR to_tsvector('english', array_to_string(enriched_tags, ' ')) @@ to_tsquery('pricing & model')
  )
  AND sync_status = 'active'
ORDER BY ts_rank(to_tsvector('english', name), to_tsquery('pricing & model')) DESC
LIMIT 50;
```

**Searchable Fields (Base Tier):**
- ✅ Filename (`name`)
- ✅ Enriched title (`enriched_title` - AI-generated in Phase 0, no ongoing cost)
- ✅ Enriched tags (`enriched_tags` - AI-generated in Phase 0, no ongoing cost)
- ✅ Author name/email
- ✅ Location path
- ✅ File type
- ❌ File contents (requires AI+ tier)

**Search Filters:**
```typescript
interface SearchFilters {
  // Provider
  providers?: ('microsoft' | 'slack' | 'google')[];
  
  // File properties
  file_types?: string[]; // e.g., [".pdf", ".docx"]
  min_size?: number; // bytes
  max_size?: number;
  
  // People
  authors?: string[]; // email addresses
  modified_by?: string[];
  
  // Dates
  created_after?: string; // ISO 8601
  created_before?: string;
  modified_after?: string;
  modified_before?: string;
  
  // Location
  locations?: string[]; // e.g., ["Finance Team", "HR"]
  
  // Sharing
  is_shared_externally?: boolean;
  
  // Workspace
  workspace_id?: string; // Search within specific workspace
}
```

**Search Result:**
```typescript
interface SearchResult {
  asset: Asset; // Full asset record
  match_type: 'filename' | 'enriched_title' | 'tag' | 'author' | 'content'; // What matched
  relevance_score: number; // 0-100
  snippet?: string; // Preview text (AI+ tier only)
}
```

### **Feature 2: AI+ Content Reading (Opt-In, +$199/mo)**

**What Changes with AI+ Enabled:**

1. **Full-Text Search:**
   - Reads file contents (PDF, Word, Excel, PowerPoint, plaintext)
   - Stores embeddings in vector database (pgvector extension in PostgreSQL)
   - Enables semantic search ("files about budget planning" matches "financial forecasting" docs)

2. **Content Snippets:**
   - Shows relevant excerpts from files (like Google Search)
   - Highlights matching keywords in context

3. **Summarization:**
   - Provides 2-3 sentence summary of each file
   - Extracts key entities (dates, names, amounts)

4. **Question Answering:**
   - User asks: "What was our Q4 revenue?"
   - Oracle reads financial docs, extracts: "$1.2M in Q4 2024"

**Technical Architecture:**

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: Content Extraction (Runs during sync)          │
├─────────────────────────────────────────────────────────┤
│ Discovery syncs new file → Triggers AI+ enrichment     │
│                                                         │
│ 1. Download file from source (temporary, in-memory)    │
│ 2. Extract text:                                       │
│    - PDF: pdf-parse library                            │
│    - Word: mammoth.js library                          │
│    - Excel: xlsx library → concatenate cell values     │
│    - PowerPoint: similar to Word                       │
│ 3. Chunk text (500-word chunks with 50-word overlap)   │
│ 4. Generate embeddings (OpenAI text-embedding-3-large) │
│ 5. Store in database:                                  │
│    - asset_embeddings table (vector column)            │
│    - asset_content_chunks table (text + metadata)      │
│ 6. Delete temp file (no permanent storage)             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Step 2: Semantic Search (When user searches)           │
├─────────────────────────────────────────────────────────┤
│ User query: "pricing model for enterprise customers"   │
│                                                         │
│ 1. Generate embedding for query (OpenAI API)           │
│ 2. Vector similarity search:                           │
│    SELECT asset_id, content_chunk, similarity          │
│    FROM asset_embeddings                               │
│    ORDER BY embedding <=> query_embedding              │
│    LIMIT 20                                            │
│ 3. Re-rank results by relevance                        │
│ 4. Return top 10 with snippets                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Step 3: Summarization (On-demand)                      │
├─────────────────────────────────────────────────────────┤
│ User clicks: "Summarize this file"                     │
│                                                         │
│ 1. Retrieve relevant content chunks (from DB)          │
│ 2. Send to OpenAI GPT-4:                               │
│    Prompt: "Summarize the following in 2-3 sentences:  │
│             [chunk 1] [chunk 2] [chunk 3]..."          │
│ 3. Return summary to user                              │
│ 4. Cache summary for 24 hours (reduce API costs)       │
└─────────────────────────────────────────────────────────┘
```

**Database Schema (AI+ Tables):**

```sql
-- Store embeddings for semantic search
CREATE TABLE asset_embeddings (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL, -- Which chunk (0, 1, 2...)
  content_chunk TEXT NOT NULL, -- Actual text (for snippets)
  embedding VECTOR(1536), -- OpenAI embedding (1536 dimensions)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(asset_id, chunk_index)
);

-- Index for fast vector similarity search
CREATE INDEX asset_embeddings_vector_idx 
ON asset_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Store summaries (cached)
CREATE TABLE asset_summaries (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  key_entities JSONB, -- { "dates": [...], "amounts": [...], "people": [...] }
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- Cache expiration
  UNIQUE(asset_id)
);
```

**Cost Analysis (AI+ Tier):**

| Operation | Cost per Asset | Frequency | Monthly Cost (1,000 assets) |
|-----------|----------------|-----------|------------------------------|
| **Embedding Generation** | $0.0001 | Once per new file | $0.10 |
| **Search Query** | $0.0001 | Per search | ~$3 (30 searches/day) |
| **Summarization** | $0.01 | On-demand | ~$10 (100 summaries/month) |
| **Total** | | | **~$13/month** |

**Pricing Strategy:**
- Charge customer: $199/month
- Actual cost: ~$13/month
- Margin: $186/month (93% gross margin)

### **Feature 3: Search UI/UX**

**Search Bar (Omnipresent):**
```
┌─────────────────────────────────────────────────────────┐
│ 🔍  Search across M365, Slack, Google...               │
└─────────────────────────────────────────────────────────┘
```
- Fixed at top of every page
- Keyboard shortcut: `Cmd+K` or `Ctrl+K`
- Auto-suggest as user types (metadata-based, fast)

**Search Results Page:**

**Base Tier (Metadata-Only):**
```
┌────────────────────────────────────────────────────────┐
│ 🔍 "pricing model"                        3 results    │
│ ─────────────────────────────────────────────────────  │
│                                                        │
│ 📄 Pricing_2024.xlsx                       ⭐⭐⭐⭐⭐   │
│ Modified by Sarah Johnson on Jan 15, 2025             │
│ Location: Finance Team > Pricing                      │
│ [ Open ] [ Add to Workspace ]                         │
│                                                        │
│ 📄 Enterprise_Sales_Deck.pptx              ⭐⭐⭐⭐     │
│ Modified by John Doe on Dec 10, 2024                  │
│ Location: Sales Team > Presentations                  │
│ [ Open ] [ Add to Workspace ]                         │
│                                                        │
│ 📄 Pricing_Strategy_2023.pdf               ⭐⭐⭐       │
│ Modified by Sarah Johnson on Mar 5, 2023              │
│ Location: Finance Team > Archive                      │
│ [ Open ] [ Add to Workspace ]                         │
│                                                        │
│ ⚠️ Limited Results (Filename Search Only)             │
│ To search INSIDE document contents, upgrade to AI+.   │
│ [ Upgrade to AI+ ] [ Learn More ]                     │
└────────────────────────────────────────────────────────┘
```

**AI+ Tier (Content Reading):**
```
┌────────────────────────────────────────────────────────┐
│ 🔍 "pricing model for enterprise customers"           │
│ 8 results (read contents of 127 files)                │
│ ─────────────────────────────────────────────────────  │
│                                                        │
│ 📄 Enterprise_Pricing_Strategy.docx        ⭐⭐⭐⭐⭐   │
│ Modified by Sarah Johnson on Jan 15, 2025             │
│ 💡 AI Summary: "Recommends tiered pricing model:      │
│    $499 base tier + $199 AI add-on for enterprise     │
│    features. Targets 500-2,000 employee companies."   │
│                                                        │
│ 🔖 Relevant excerpt:                                   │
│ "...our **pricing model** should target **enterprise  │
│ customers** with 500-2,000 employees. We recommend    │
│ a base price of $499/month per tenant..."             │
│                                                        │
│ [ Open ] [ Add to Workspace ] [ Ask AI ]              │
│                                                        │
│ 📊 Sales_Enablement_Q4.pptx                ⭐⭐⭐⭐     │
│ Modified by John Doe on Dec 10, 2024                  │
│ 💡 AI Summary: "Sales deck covering enterprise        │
│    pricing objections, ROI calculator, and            │
│    competitive positioning vs. Microsoft."            │
│                                                        │
│ 🔖 Relevant excerpt:                                   │
│ "Slide 7: Enterprise Pricing - When customers ask     │
│ about **pricing**, emphasize ROI: 20 hours saved..."  │
│                                                        │
│ [ Open ] [ Add to Workspace ] [ Ask AI ]              │
└────────────────────────────────────────────────────────┘
```

**"Ask AI" Feature (AI+ Tier Only):**
```
User clicks: "Ask AI" on a search result
↓
Modal appears:
┌────────────────────────────────────────────────────────┐
│ 💬 Ask AI about this document                          │
│ ─────────────────────────────────────────────────────  │
│ 📄 Enterprise_Pricing_Strategy.docx                    │
│                                                        │
│ Your question:                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ What is the recommended enterprise pricing?       │ │
│ └────────────────────────────────────────────────────┘ │
│ [ Ask ]                                                │
│                                                        │
│ 🤖 AI Answer:                                          │
│ "The document recommends a tiered pricing model:      │
│  - Base Tier: $499/month per tenant                   │
│  - AI+ Add-On: +$199/month                            │
│  Target market is companies with 500-2,000 employees  │
│  in tech, professional services, and financial        │
│  services industries."                                │
│                                                        │
│ 📍 Source: Page 3, Section 2.1 "Pricing Strategy"     │
└────────────────────────────────────────────────────────┘
```

### **Feature 4: Metadata Intelligence Layer (Always-On, $0 Ongoing Cost)**

**What Is This?**
> "AI-powered metadata enrichment that runs ONCE during initial Discovery sync, improves poor enterprise filenames/tags, and stores enriched data in side-car database. No ongoing AI cost after initial enrichment."

**Problem:**
- Enterprise files have terrible names: "Document1.docx", "Copy of final_FINAL_v3.xlsx"
- SharePoint metadata is often empty (no tags, no descriptions)
- Search is bad because there's nothing to search

**Solution:**
```
Phase 0 (One-Time, During Initial Discovery Sync):
  1. Scan file (read first page or sample content)
  2. Use AI to generate:
     - Enriched title (e.g., "Document1.docx" → "Q4 Budget Forecast - Finance")
     - Enriched tags (e.g., [] → ["budget", "finance", "forecast", "q4"])
  3. Store in `asset_enrichments` table
  4. Use enriched data for search (Base tier)

Phase 1+ (Incremental Sync):
  - Only enrich NEW files (not re-enrich existing)
  - Batch processing (100 files at a time, not real-time)
  - Low priority (run during off-hours)
```

**Database Schema:**
```sql
CREATE TABLE asset_enrichments (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  
  -- Enriched metadata
  enriched_title TEXT, -- AI-improved title
  enriched_tags TEXT[], -- AI-extracted tags
  enriched_description TEXT, -- AI-generated description
  
  -- Source tracking
  enrichment_method VARCHAR(50), -- 'ai' or 'manual'
  enriched_at TIMESTAMPTZ DEFAULT NOW(),
  enriched_by UUID REFERENCES users(id), -- NULL if AI
  
  -- Quality score
  confidence_score FLOAT, -- 0-1 (AI confidence in enrichment)
  
  UNIQUE(asset_id)
);
```

**Example Enrichment:**

**Before (Raw Metadata):**
```json
{
  "name": "Copy of final_v2_FINAL.docx",
  "author": "sarah.johnson@company.com",
  "modified_date": "2025-01-15",
  "location": "Shared Documents"
}
```

**After (Enriched):**
```json
{
  "name": "Copy of final_v2_FINAL.docx",
  "enriched_title": "Q4 2024 Budget Proposal - Finance Department",
  "enriched_tags": ["budget", "finance", "q4", "proposal", "2024"],
  "enriched_description": "Annual budget proposal for Q4 2024 including revenue forecasts, expense breakdown, and hiring plan",
  "confidence_score": 0.92
}
```

**Cost Analysis:**
- **Initial enrichment (10,000 files):** ~$50 (one-time, $0.005/file)
- **Incremental (100 new files/month):** ~$0.50/month
- **Total ongoing cost:** <$1/month (negligible)

**Why Include in Base Tier?**
- Dramatically improves search quality (even without content reading)
- One-time cost (not recurring)
- Differentiator vs. native M365 search (which is metadata-only AND bad metadata)
- **Powers tag-based workspace auto-sync** (enriched tags enable smart organization)

**How It Enables Workspace Intelligence:**
```
1. AI enriches file during Discovery sync
   → "Copy of final_v2_FINAL.docx" gets tags: [budget, finance, q4, proposal]

2. User creates workspace "Q4 Budget Planning"
   → Enables tag-based sync rule: "Auto-add files with tags [budget, q4]"

3. Workspace auto-populates with relevant files
   → Including files with poor names that would've been missed

4. New files added to tenant
   → If AI tags them with [budget, q4], they auto-sync to workspace

Result: Workspaces self-organize based on content meaning, not just location
```

**Strategic Value:**
- Makes metadata cleanup **actionable** (not just informational)
- Enables cross-platform aggregation (SharePoint + OneDrive + Teams)
- Creates **lock-in** (lose Aethos → lose smart aggregation)
- Differentiates from competitors (native tools can't do this)

---

## 5.3 AI+ Upsell Strategy

**When to Show AI+ Upsell:**

1. **Low Result Count:** User searches, gets <5 results (suggests metadata-only missed content)
2. **Content-Heavy Query:** Query contains words like "mention", "about", "containing", "discuss", "why", "how"
3. **Advanced Features:** User clicks "Summarize" or "Ask AI" (blocked for Base tier)
4. **Power User:** User runs >50 searches/week (likely needs better tools)

**Upsell UI Pattern:**
```
┌────────────────────────────────────────────────────────┐
│ ⚠️ Limited Results (Filename Search Only)             │
│ ─────────────────────────────────────────────────────  │
│ We found 3 files with "pricing model" in the filename.│
│                                                        │
│ 🚀 With AI+ Content Intelligence, we would:           │
│ ✅ Search INSIDE 127 files (not just filenames)       │
│ ✅ Find documents that DISCUSS pricing (semantic)     │
│ ✅ Show relevant excerpts with highlights             │
│ ✅ Provide AI summaries of each result                │
│                                                        │
│ [ Upgrade to AI+ ($199/mo) ] [ See Example Search ]   │
└────────────────────────────────────────────────────────┘
```

**"See Example Search" Flow:**
```
User clicks: "See Example Search"
↓
Modal with side-by-side comparison:
┌────────────────────────────────────────────────────────┐
│ 🆚 Base Tier vs. AI+ Tier                              │
│ ─────────────────────────────────────────────────────  │
│ Query: "pricing model for enterprise customers"       │
│                                                        │
│ 🟢 Base Tier (Metadata Only)     ⚡ AI+ Tier          │
│ ─────────────────────────────    ─────────────────── │
│ 3 results (filename match)       8 results (content)  │
│                                                        │
│ 📄 Pricing_2024.xlsx              📄 Enterprise_...   │
│ 📄 Enterprise_Sales_Deck.pptx    💡 "Recommends..."   │
│ 📄 Pricing_Strategy_2023.pdf     🔖 Excerpt: "..."    │
│                                                        │
│ [ Upgrade to AI+ ($199/mo) ] [ Maybe Later ]          │
└────────────────────────────────────────────────────────┘
```

**Conversion Tracking:**
```typescript
// Track upsell opportunities
interface UpsellEvent {
  user_id: string;
  event_type: 'upsell_shown' | 'upsell_clicked' | 'upsell_dismissed';
  search_query: string;
  result_count: number;
  timestamp: string;
}

// Show upsell after 3 low-result searches
if (user.upsell_shown_count < 5 && resultCount < 5) {
  showUpsellModal();
  trackEvent({ event_type: 'upsell_shown', ... });
}
```

**Target Conversion Rate:**
- **All Users:** 30% conversion to AI+ tier
- **High-Value Personas:** 70-90% conversion (Compliance, Executives)
- **Revenue Impact:** $35K/year extra for 50-customer base

---

# 6. RBAC & Permissions

## 6.1 Role-Based Access Control

**Philosophy:** Use plain English role names (not technical jargon like "Owner", "Contributor", "Reader").

### **Tenant-Level Roles**

| Role | Description | Permissions |
|------|-------------|-------------|
| **Admin** | Tenant administrator | Everything: manage users, billing, settings, Discovery, Workspaces, Oracle |
| **Creator** | Can create content | Create/edit own workspaces, search, view Discovery (read-only) |
| **Member** | Standard user | Search, view workspaces (read-only), no Discovery access |

**Role Assignment:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  
  -- Role
  role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Creator', 'Member')),
  
  -- Auth
  entra_id VARCHAR(255), -- Microsoft Entra ID (Azure AD) user ID
  last_login_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);
```

### **Workspace-Level Permissions**

**Who Can Access a Workspace?**
1. **Creator:** User who created the workspace (full control)
2. **Admins:** All tenant Admins (full control)
3. **Members:** Users explicitly added to workspace (read or write access)

**Permission Model:**
```typescript
interface WorkspaceMember {
  user_id: string;
  workspace_id: string;
  permission: 'read' | 'write'; // Read = view only, Write = can edit
  added_by: string; // User who added this member
  added_at: string;
}
```

**Permission Checks:**
```javascript
function canEditWorkspace(user, workspace) {
  // Admins can edit anything
  if (user.role === 'Admin') return true;
  
  // Creator can edit their own workspace
  if (workspace.created_by === user.id) return true;
  
  // Members with 'write' permission can edit
  const membership = workspace.members.find(m => m.user_id === user.id);
  if (membership?.permission === 'write') return true;
  
  return false;
}

function canViewWorkspace(user, workspace) {
  // Admins can view anything
  if (user.role === 'Admin') return true;
  
  // Creator can view their own workspace
  if (workspace.created_by === user.id) return true;
  
  // Members can view
  const membership = workspace.members.find(m => m.user_id === user.id);
  if (membership) return true;
  
  // Workspace visibility: 'org' = anyone in tenant can view
  if (workspace.visibility === 'org') return true;
  
  return false;
}
```

---

## 6.2 Data Isolation (Multi-Tenancy)

**Strategy:** Row-Level Security (RLS) in PostgreSQL enforces tenant boundaries at database level.

**How It Works:**
```sql
-- Every request sets the tenant context
SET app.current_tenant_id = 'tenant-uuid';

-- RLS policies automatically filter queries
SELECT * FROM workspaces; -- Only returns workspaces for 'tenant-uuid'
```

**Policy Examples:**
```sql
-- Workspaces: Users can only see workspaces in their tenant
CREATE POLICY tenant_isolation ON workspaces
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Assets: Users can only see assets in their tenant
CREATE POLICY tenant_isolation ON assets
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Users: Users can only see other users in their tenant
CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

**Benefits:**
- ✅ **Impossible to accidentally query another tenant's data** (enforced at DB level)
- ✅ **Auditable** (every query is tenant-scoped, logged automatically)
- ✅ **Simpler application code** (no need to add `WHERE tenant_id = ?` to every query)

---

## 6.3 Microsoft Graph API Permissions

**What Permissions Aethos Requests:**

| Permission | Scope | Purpose | Required? |
|------------|-------|---------|-----------|
| **User.Read** | Delegated | Read user profile (name, email) | ✅ Yes |
| **Files.Read.All** | Delegated | Read all files in M365 (Discovery, Search) | ✅ Yes |
| **Sites.Read.All** | Delegated | Read SharePoint sites (Discovery) | ✅ Yes |
| **Group.Read.All** | Delegated | Read Teams channels (Discovery) | ✅ Yes |
| **Files.ReadWrite.All** | Delegated | Archive/delete files (Remediation) | ⚠️ Optional (for remediation features) |

**Delegated vs. Application Permissions:**
- ✅ **Delegated:** User grants permission (Aethos acts on behalf of user)
- ❌ **Application:** Tenant admin grants permission (Aethos acts independently)

**Why Delegated?**
- Respects user's existing M365 permissions (if user can't see file, Aethos can't either)
- Easier admin approval (less scary than "Application" permissions)
- Better for security/compliance (audits show user actions, not "Aethos" actions)

**Consent Flow:**
```
1. User clicks "Sign in with Microsoft"
2. Microsoft shows consent screen:
   "Aethos wants to:
    - Read your profile
    - Read your files
    - Read your SharePoint sites
    - Read your Teams"
3. User clicks "Accept"
4. Microsoft redirects to Aethos with access token
5. Aethos stores token (encrypted, short-lived)
```

---

# 7. Pricing & Monetization

> ⚠️ **IMPORTANT:** This pricing model is **suggested/reference only**. We need to work through pricing strategy, test with customers, and validate willingness to pay. The numbers below are a starting point based on market research, but should be treated as flexible. Annual vs. monthly, tier structure, and exact pricing points will be refined based on customer feedback and business model validation.

## 7.1 Pricing Model (Suggested)

**Proposed Strategy:** Annual contracts (20% discount) + AI+ upsell + continuous value delivery

### **Base Tier Pricing**

| Billing Cycle | Price | Effective Monthly | Annual Savings |
|---------------|-------|-------------------|----------------|
| **Monthly** | $499/mo | $499/mo | - |
| **Annual** ⭐ | $4,788/year | **$399/mo** | **$1,188/year (20%)** |

**Recommendation:** Default to annual contracts (standard B2B SaaS practice) with monthly option for pilots/trials.

**What's Included:**
- ✅ **The Constellation (Discovery)** - **Continuous Monitoring, Not One-Time**
  - Full M365 + Slack sync (inventory all assets)
  - **Weekly waste reports** (new stale files, duplicates, orphaned content)
  - **Trend analysis** (storage growth over time, waste recovered)
  - **Predictive alerts** (storage limit warnings, declining workspace quality)
  - Security exposure alerts
  - Remediation actions (archive, delete)
  - **Automated governance rules** (auto-archive stale content, configurable policies)

- ✅ **The Nexus (Workspaces)** - **Organizational Lock-In**
  - Unlimited workspaces
  - Cross-platform aggregation (M365, Slack, Google read-only)
  - Intelligence Score with improvement suggestions (includes tag quality metrics)
  - **Tag-based auto-sync rules** (files auto-organize based on AI + user tags)
  - Location, author, and keyword-based sync rules
  - Bulk tag editor + individual tag assignment
  - Tag cloud & workspace tag management
  - **Position as mission-critical:** "The place your team works" (not just cleanup tool)

- ✅ **The Oracle (Search - Metadata Only)**
  - Search by filename, author, date, location
  - Metadata Intelligence Layer (AI-enriched titles/tags, one-time enrichment, no ongoing cost)
  - Filters & sorting
  - Add to workspace

- ✅ **Unlimited Users**
  - No per-seat pricing (flat rate per tenant)
  - Plain English roles (Admin, Creator, Member)

- ✅ **Value Tracking & ROI Reporting**
  - Dashboard showing storage costs recovered
  - Operational clarity score over time
  - Monthly executive reports (PDF to CEO/CTO)
  - Usage analytics (adoption metrics, search activity)

**Who It's For:**
- Companies with 500-2,000 employees
- IT Admins who need governance + continuous monitoring
- Teams who need better search (but metadata-only is enough)

---

### **AI+ Tier: Add-On Pricing**

| Billing Cycle | Price | Effective Monthly | Annual Savings |
|---------------|-------|-------------------|----------------|
| **Monthly** | +$199/mo | +$199/mo | - |
| **Annual** ⭐ | +$1,908/year | **+$159/mo** | **+$468/year (20%)** |

**Total Cost (Base + AI+):**
- Monthly: $698/mo
- Annual: $558/mo effective ($6,696/year) - **Save $1,680/year**

**What's Added:**
- ⚡ **Content Reading**
  - Search INSIDE document contents (PDF, Word, Excel, PowerPoint)
  - Semantic search (understands meaning, not just keywords)
  - Content snippets with highlights

- ⚡ **AI Summaries**
  - 2-3 sentence summary of each file
  - Key entity extraction (dates, names, amounts)
  - "Ask AI" feature (question answering)

- ⚡ **Advanced Intelligence**
  - PII detection in file contents (SSN, credit cards, etc.)
  - Duplicate detection (near-duplicates, not just exact matches)
  - Content-based auto-sync rules (e.g., "auto-add files mentioning 'budget'")

**Who It's For:**
- **Compliance/Legal:** Must-have for eDiscovery, PII detection (90% conversion expected)
- **Executives:** Want insights, not file lists (70% conversion expected)
- **Department Heads:** Need context, not just filenames (60% conversion expected)

**Economics:**
- Actual cost: ~$13/month (OpenAI API fees)
- Margin (monthly): $186/month (93% gross margin)
- Margin (annual): $146/month (92% gross margin)
- Perceived value: High (semantic search is "magic" to users)

**Toggleable:**
- Admins can turn AI+ on/off per tenant
- Privacy-friendly (some customers don't want AI reading files)

---

## 7.2 Retention Strategy: Solving the "One-Time Cleanup" Churn Risk

### **The Problem**

**Churn Scenario:**
1. Month 1: Client signs up, runs Discovery, finds 500GB of waste
2. Month 2: Client archives/deletes everything, workspace looks clean
3. Month 3: Client cancels → "We got what we needed, thanks!"

**Why This Kills the Business:**
- ❌ CAC doesn't recover after 1-2 months
- ❌ No predictable revenue
- ❌ Discovery feels like transactional audit, not ongoing value

### **The Solution: Make Aethos Indispensable**

#### **1. Continuous Discovery (Not One-Time)**

**Weekly Intelligence Reports** (automated):
- "This week, 47 files became stale (no access in 6 months)"
- "12 new duplicate files detected (+18GB waste)"
- "Sarah's OneDrive grew 15GB this month (possible orphaned content)"
- "Marketing workspace quality declining: Intelligence Score 85% → 72%"

**Trend Analysis Dashboard:**
- Storage waste over time (chart showing declining waste = we're helping!)
- Operational clarity score progression (67% → 81%)
- "You're recovering dead capital 12% faster than last quarter"

**Predictive Alerts:**
- "At current growth rate, you'll hit storage limit in 60 days"
- "5 workspaces have stale content (no activity in 90 days)"
- "20% of your content is undiscoverable (poor metadata quality)"

**Automated Governance:**
- Auto-archive files after 12 months no access (configurable)
- Auto-tag new files based on AI pattern matching
- Auto-add files to Workspaces via sync rules
- Set-it-and-forget-it = clients fear losing automation if they cancel

#### **2. Workspace Lock-In Strategy**

**Position Workspaces as "Where Work Happens":**
- Not just "cleanup tool" → "Organizational operating system"
- Cross-platform aggregation = teams depend on it daily
- If Workspaces become mission-critical → canceling = organizational chaos
- Think: "Notion for enterprise content" (not just discovery)

**Network Effects:**
- More integrations (M365 + Slack + Google) = harder to leave
- More workspaces created = more organizational investment
- More users onboarded = higher switching cost

#### **3. ROI Tracking & Executive Visibility**

**Monthly Executive Reports** (automated PDF to CEO/CTO):
- "State of Operational Clarity" report
- Storage costs recovered this month/quarter/year
- Example: "You've recovered $127,000 in storage costs since deployment"
- Adoption metrics: "85% of your team uses Oracle weekly"
- Makes canceling visible to leadership = social pressure to keep

**Dashboard Widgets:**
- Real-time ROI tracker ("$X saved this year")
- Operational clarity score (gamification = FOMO if they cancel)
- Benchmark vs. industry: "You're in the top 10% for operational clarity"

#### **4. Annual Contracts (Primary Driver)**

**Why Annual Contracts Solve Churn:**
- ✅ 12-month commitment upfront = guaranteed revenue
- ✅ Standard in B2B SaaS (Microsoft 365, Slack, Salesforce all use this)
- ✅ Better cash flow ($4,788 upfront vs. hoping for 12x $499)
- ✅ 20% discount incentivizes annual, but monthly exists for trials

**Pilot → Annual Conversion:**
1. Offer monthly for 1-2 month pilot
2. Show value (waste recovered, ROI dashboard, team adoption)
3. Convert to annual at discount: "Save $1,680/year if you commit now"

### **Expected Outcomes**

**With These Strategies:**
- ✅ Discovery = ongoing monitoring (not one-time audit)
- ✅ Workspaces = organizational lock-in (mission-critical)
- ✅ Oracle = daily search habit (can't live without it)
- ✅ Annual contracts = forcing function (12-month commitment)
- ✅ ROI tracking = justifies renewal to leadership

**Projected Churn:**
- Without retention features: 40-60% annual churn (disaster)
- With retention features: 10-20% annual churn (healthy SaaS)

---

### **What's Deferred**

❌ **Enterprise Tier:** Defer to v1.1+ (no white-glove service for v1)
- Custom pricing (negotiated deals)
- Dedicated support
- Advanced compliance features (legal hold, eDiscovery exports)

❌ **Phase 3+ Add-Ons:** Pricing TBD (defer until features built)
- People Directory
- Communication Bridge
- Collaboration Studio
- Learning Module

**Why Defer?**
- Focus on nailing the core product (v1)
- Avoid complexity (solo founder, limited resources)
- Enterprise deals require white-glove service (not ready yet)

---

## 7.3 Pricing Philosophy

**"Suggested, Not Locked"**

**Why?**
- Allows market testing without rigid commitment
- Can adjust based on customer willingness to pay
- Enables custom enterprise deals
- Beta customers get grandfathered rates (marketing advantage)

**Flexibility Examples:**
- One customer says $499 is high → Test $399 with next cohort
- Enterprise customer wants $48K/year → Negotiate custom deal
- Customer wants only AI+ → Offer standalone pricing (future)

**Hard Rules:**
- ✅ Build billing infrastructure (Stripe, subscription management)
- ✅ Two-tier model exists (Base + AI Add-On)
- ⚠️ Exact dollar amounts can flex

---

## 7.4 Billing Implementation

**Payment Provider:** Stripe

**Subscription Model:**
```typescript
interface TenantSubscription {
  tenant_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  
  // Plan details
  plan_tier: 'base' | 'base_plus_ai'; // Base or Base+AI
  billing_cycle: 'monthly' | 'annual'; // Billing frequency
  
  // Billing
  current_period_start: string;
  current_period_end: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  
  // Trial
  trial_end_date: string | null; // 14-day free trial
  
  // Add-ons
  ai_plus_enabled: boolean; // Toggle for AI+ features
  
  // Payment
  payment_method_last4: string; // Last 4 digits of card
  next_billing_date: string;
  amount_due: number; // In cents
  // Monthly: 49900 (Base) or 69800 (Base+AI)
  // Annual: 478800 (Base) or 669600 (Base+AI)
}
```

**Stripe Setup:**
```javascript
// Create products
const baseProduct = await stripe.products.create({
  name: 'Aethos Base',
  description: 'Discovery + Workspaces + Oracle (Metadata Search)'
});

const aiPlusProduct = await stripe.products.create({
  name: 'Aethos AI+ Add-On',
  description: 'Content Reading, Semantic Search, Summarization'
});

// Create prices (both monthly and annual)
const basePriceMonthly = await stripe.prices.create({
  product: baseProduct.id,
  unit_amount: 49900, // $499/mo in cents
  currency: 'usd',
  recurring: { interval: 'month' }
});

const basePriceAnnual = await stripe.prices.create({
  product: baseProduct.id,
  unit_amount: 478800, // $4,788/year in cents (20% discount)
  currency: 'usd',
  recurring: { interval: 'year' }
});

const aiPlusPriceMonthly = await stripe.prices.create({
  product: aiPlusProduct.id,
  unit_amount: 19900, // $199/mo in cents
  currency: 'usd',
  recurring: { interval: 'month' }
});

const aiPlusPriceAnnual = await stripe.prices.create({
  product: aiPlusProduct.id,
  unit_amount: 190800, // $1,908/year in cents (20% discount)
  currency: 'usd',
  recurring: { interval: 'year' }
});
```

**Subscription Creation:**
```javascript
// When tenant signs up (default to annual)
const subscription = await stripe.subscriptions.create({
  customer: customer.id,
  items: [{ price: basePriceAnnual.id }], // Start with Base annual
  trial_period_days: 14, // 14-day free trial
  metadata: { 
    tenant_id: 'tenant-uuid',
    billing_cycle: 'annual' // or 'monthly'
  }
});

// Or monthly for pilots/trials
const subscriptionMonthly = await stripe.subscriptions.create({
  customer: customer.id,
  items: [{ price: basePriceMonthly.id }],
  trial_period_days: 14,
  metadata: { 
    tenant_id: 'tenant-uuid',
    billing_cycle: 'monthly'
  }
});
```

**Upgrade to AI+:**
```javascript
// When user clicks "Upgrade to AI+" (match billing cycle)
const isAnnual = subscription.metadata.billing_cycle === 'annual';

await stripe.subscriptions.update(subscription.id, {
  items: [
    { price: isAnnual ? basePriceAnnual.id : basePriceMonthly.id }, // Keep Base
    { price: isAnnual ? aiPlusPriceAnnual.id : aiPlusPriceMonthly.id } // Add AI+
  ]
});
// Total (monthly): $499 + $199 = $698/month
// Total (annual): $4,788 + $1,908 = $6,696/year ($558/mo effective)
```

**Downgrade from AI+:**
```javascript
// When user clicks "Cancel AI+"
const isAnnual = subscription.metadata.billing_cycle === 'annual';

await stripe.subscriptions.update(subscription.id, {
  items: [{ price: isAnnual ? basePriceAnnual.id : basePriceMonthly.id }] // Remove AI+, keep Base
});
// Total (monthly): $499/month
// Total (annual): $4,788/year ($399/mo effective)
```

---

## 7.5 Revenue Projections (Suggested Model)

> **Note:** These are illustrative projections based on suggested pricing. Actual revenue will depend on finalized pricing model, customer acquisition, and retention rates.

**Assumptions:**
- 50 customers in first year
- 70% choose annual contracts (35 annual, 15 monthly)
- 30% adopt AI+ tier (15 customers)
- Annual churn: 15% (with retention strategies vs. 40%+ without)

**Blended Monthly Recurring Revenue (MRR):**

**Base Tier Only:**
- 25 annual @ $399/mo effective = $9,975/mo
- 10 monthly @ $499/mo = $4,990/mo
- **Base Subtotal: $14,965/mo**

**Base + AI+:**
- 10 annual @ $558/mo effective = $5,580/mo
- 5 monthly @ $698/mo = $3,490/mo
- **AI+ Subtotal: $9,070/mo**

**Total MRR: $24,035/month**

**Annual Contract Value (ACV) - Collected Upfront:**
- 25 Base annual @ $4,788 = $119,700
- 10 Base+AI annual @ $6,696 = $66,960
- **Total ACV: $186,660** (collected in first 12 months)

**Annual Recurring Revenue (ARR):**
- **$288,420/year** (includes monthly subscriptions)

**Costs (v1 - Vercel + Supabase):**
- Infrastructure: ~$50-100/month (all customers)
- OpenAI API: ~$195/month (15 AI+ customers × $13)
- **Total Costs: ~$250-300/month** (~$3,600/year)

**Net Profit:**
- Monthly: $24,035 - $300 = **$23,735/month**
- Annual: **$284,820/year** (after costs)
- **Gross Margin: ~99%** (SaaS standard)

**Cash Flow Advantage (Annual Contracts):**
- Year 1 cash collected: $186,660 (upfront) + $101,760 (monthly subs) = **$288,420**
- No waiting for 12 months of monthly payments
- Can reinvest capital faster

**When to Migrate to Azure:**
- Monthly revenue >$50K (would be ~100 customers)
- Active tenants >1,000 (would be years away)
- Enterprise deals require Azure (case-by-case)

---

# 8. Design System (Aethos Glass)

> **📖 COMPLETE DESIGN REFERENCE:** See **`/docs/MASTER_DESIGN_GUIDE.md`** for the comprehensive design system with detailed component specs, interaction patterns, animation guidelines, accessibility standards, and implementation examples. This section provides a high-level overview only.

## 8.1 Visual Identity

**Design Philosophy:** "Cinematic Glassmorphism" - Deep space backgrounds with translucent glass cards.

### **Color Palette**

**Background:**
- **Deep Space:** `#0B0F19` (near-black with blue undertone)

**Primary Actions:**
- **Starlight Cyan:** `#00F0FF` (all primary CTAs, growth indicators, active sync states)

**Alerts/Warnings:**
- **Supernova Orange:** `#FF5733` (storage waste, orphaned containers, high-exposure risks)

**Text:**
- **Primary Text:** `#FFFFFF` (white, high contrast)
- **Secondary Text:** `#94A3B8` (slate-400, muted)
- **Tertiary Text:** `#64748B` (slate-500, very muted)

**Glass Cards:**
- **Background:** `rgba(255, 255, 255, 0.05)` (5% white, heavily blurred)
- **Border:** `rgba(255, 255, 255, 0.1)` (10% white)
- **Backdrop Blur:** `12px` minimum (creates frosted glass effect)

### **Typography**

**Font Family:** Inter (system font stack fallback)

**Hierarchy:**
- **Headings:** `font-weight: 900` (Black), `uppercase`, `tracking-tight`
- **Body:** `font-weight: 500` (Medium)
- **Labels:** `font-weight: 700` (Bold), `uppercase`, `tracking-widest`, `text-[10px]`

**Example:**
```css
h1 { font-size: 2.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em; }
h2 { font-size: 2rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em; }
h3 { font-size: 1.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.025em; }
p  { font-size: 0.875rem; font-weight: 500; line-height: 1.5; }
```

---

## 8.2 Component Patterns

### **GlassCard Component**

**Purpose:** Standard container for all content areas.

**Usage:**
```tsx
<GlassCard>
  <h2>Storage Waste Detected</h2>
  <p>847 GB (26%) of your storage is wasted.</p>
  <Button>View Details</Button>
</GlassCard>
```

**Style:**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 1.5rem; /* 24px */
  padding: 2rem; /* 32px */
}
```

### **Button Component**

**Variants:**
1. **Primary:** Starlight Cyan background, black text
2. **Secondary:** Transparent background, Starlight Cyan border
3. **Danger:** Supernova Orange background, white text
4. **Ghost:** Transparent, no border, subtle hover

**Example:**
```tsx
<Button variant="primary">Upgrade to AI+</Button>
<Button variant="secondary">Learn More</Button>
<Button variant="danger">Delete Files</Button>
<Button variant="ghost">Cancel</Button>
```

### **MetricCard Component**

**Purpose:** Display key metrics with icon, value, and trend.

**Example:**
```tsx
<MetricCard
  icon={<Database />}
  label="Total Storage"
  value="3.2 TB"
  trend="+12%"
  trendDirection="up"
/>
```

**Visual:**
```
┌─────────────────────────────────────┐
│ 💾                                  │
│ TOTAL STORAGE                       │
│ 3.2 TB          ▲ +12%              │
└─────────────────────────────────────┘
```

---

## 8.3 Terminology Standards

**Avoid "Hub" Language:**
- ❌ "Communication Hub" → ✅ "Communication Bridge"
- ❌ "Document Hub" → ✅ "Discovery" or "Content Discovery"
- ❌ "Hub" (anywhere) → ✅ Use "Module", "Space", "Bridge", or specific feature name

**Use "Operational Architect" Language:**
- ❌ "Risk Detected" (security janitor) → ✅ "Operational Inefficiency Identified"
- ❌ "Cleanup Required" → ✅ "Optimization Opportunity"
- ❌ "Files Deleted" → ✅ "Dead Capital Recovered"

**Module Names:**
- ✅ "The Constellation" (Discovery)
- ✅ "The Nexus" (Workspaces)
- ✅ "The Oracle" (Search & Intelligence)

---

# 9. Future Vision (Phase 2+)

## 9.1 Deferred Modules (Post-v1)

**Modules NOT Included in v1:**
1. **People Directory** - Enterprise directory with skills, org charts, cross-platform presence
2. **Communication Bridge** - Unified messaging layer bridging Teams, Slack, email
3. **Collaboration Studio** - Real-time co-working features, project rooms, shared task lists
4. **Learning Module** - Training delivery, onboarding automation, knowledge base

**Monetization:** Future modules offered as **add-on packages** with additional licensing fees (pricing TBD when built).

**Timeline:** Phase 3+ (2027+)

---

## 9.2 Azure Migration Plan

**Current State:** Vercel + Supabase (v1)  
**Future State:** Azure enterprise architecture (when needed)

**Trigger Conditions (Any of These):**
- Monthly revenue >$50K
- Active tenants >1,000
- Enterprise deals require Azure (compliance, data residency, SLAs)

**Migration Timeline:** 3-6 months effort

**See:** `/docs/AZURE_MIGRATION_PLAYBOOK.md` for complete strategy

**Decision Status:** Deferred (focus on v1 product-market fit first)

---

## 9.3 Enterprise Tier (Post-v1.1)

**Deferred Until:** v1.1+ (after PMF with SMB customers)

**Features:**
- Custom pricing (negotiated deals)
- Dedicated support (white-glove onboarding)
- Advanced compliance (legal hold, eDiscovery exports, audit trails)
- Data residency (choose Azure region)
- SSO (SAML, OIDC beyond Microsoft)

**Why Defer?**
- No white-glove capacity (solo founder)
- SMB market is sufficient for v1
- Enterprise deals are slow (6-12 month sales cycles)

---

# 📋 Appendix

## A. Glossary of Terms

**Asset:** Any digital content item (file, channel, site, etc.) tracked by Aethos

**Discovery:** Module 1 (The Constellation) - scans and inventories M365 tenant

**Enrichment:** AI-powered metadata improvement (titles, tags, descriptions)

**Intelligence Score:** 0-100 rating of workspace metadata quality

**Metadata-Only:** Architecture where Aethos stores pointers (metadata) not file contents

**Oracle:** Module 3 - Search and intelligence layer

**Provider Adapter:** Integration code for specific platform (M365, Slack, Google)

**RLS:** Row-Level Security - PostgreSQL feature for multi-tenant data isolation

**Side-Car Database:** Separate database that enriches data from source systems without modifying them

**Sync:** Process of fetching metadata from source systems (M365, Slack) and updating Aethos database

**Tenant:** A single customer organization (e.g., "Acme Corp")

**Workspace:** Module 2 (The Nexus) - curated collection of content from multiple sources

---

## B. Key Decision Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Architecture** | Vercel + Supabase | Simpler, cheaper, faster for v1 |
| **Content Oracle** | v1 (not v2) | Core value prop, not nice-to-have |
| **AI Features** | Toggleable | Privacy-friendly, some customers don't want AI |
| **AI Pricing** | Base ($499) + AI+ upsell ($199) | Test value prop, build infrastructure |
| **RBAC** | Plain English roles | Simpler than technical jargon |
| **Connectors** | Tiered (M365/Slack full, Google read-only) | Focus on high-ROI integrations |
| **Data Storage** | Metadata-only | Compliance, performance, cost |
| **Enterprise Tier** | Defer to v1.1+ | Focus on SMB, avoid white-glove distraction |
| **Phase 3+ Modules** | Defer to 2027+ | Nail v1 first, expand later |

---

## C. Supporting Documentation

**Must-Read:**
- `/docs/SIMPLIFIED_ARCHITECTURE.md` - Technical architecture deep-dive
- `/docs/ORACLE_SEARCH_PERSONAS.md` - User search patterns and AI+ positioning
- `/docs/V1_IMPLEMENTATION_ROADMAP.md` - Detailed week-by-week build plan

**Reference:**
- `/docs/PRICING_STRATEGY_CLARITY.md` - Pricing analysis and recommendations
- `/docs/AZURE_MIGRATION_PLAYBOOK.md` - Future migration plan (when needed)
- `/src/standards/DECISION-LOG.md` - Why decisions were made

---

## D. Contact & Questions

**Product Owner:** CEO / Product Lead  
**Engineering Lead:** [Your Friend's Name]  
**Questions?** Check docs first, then ask in Slack/email

---

**Document Version:** 2.0  
**Last Updated:** 2026-02-27  
**Status:** ✅ Engineering-Ready

---

🎉 **You're ready to build Aethos v1!** Everything you need is documented here. Let's ship it! 🚀
