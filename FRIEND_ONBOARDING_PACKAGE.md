# Aethos: Friend Onboarding Package
## Everything Your Collaborator Needs to Know

**Last Updated:** 2026-02-26  
**Purpose:** Help your friend understand the full Aethos vision  
**Reading Time:** 45-60 minutes (main docs), 2-3 hours (complete immersion)

---

## 🎯 Quick Start (What to Send Your Friend)

### **Primary Document (Must Read)**
📄 **`/docs/AETHOS_V1_CONSOLIDATED_SPEC.md`** ⭐ **START HERE**
- This is the **reconciled specification** based on their high-level doc + all your existing work
- Includes Discovery, Workspaces, Oracle modules (v1 scope)
- Engineering-ready (data model, API routes, technical details)
- Marks open decisions that need discussion
- **Reading time: 45 minutes**

---

## 📚 Supporting Documents (Recommended Reading Order)

### **For Context (Product Vision)**

#### 1. `/guidelines/Guidelines.md` (20 minutes)
**Why read:** Understand Aethos design philosophy  
**Key sections:**
- Operational Clarity positioning
- Aethos Glass design system (colors, typography)
- Universal Adapter Pattern (Tier 1 vs Tier 2 connectors)
- Remediation protocols

**Takeaway:** "This is what Aethos looks and feels like"

---

#### 2. `/docs/SIMPLIFIED_ARCHITECTURE.md` (30 minutes)
**Why read:** Understand technical architecture  
**Key sections:**
- Current tech stack (Vercel + Supabase, not Azure)
- Multi-tenant data model (PostgreSQL with RLS)
- Cost breakdown ($0-5/mo for MVP)
- Migration path to Azure (when needed)

**Takeaway:** "This is how we're building it (and why it's cheap)"

---

#### 3. `/docs/CONSOLIDATED_STANDARDS.md` (30 minutes)
**Why read:** Development guidelines  
**Key sections:**
- Standard 1: Code Quality & Architecture
- Standard 2: Security & Data Privacy
- Standard 3: Microsoft 365 Integration
- Standard 4: Deployment & Operations

**Takeaway:** "This is how we write code and deploy"

---

### **For Decision Context (Optional but Valuable)**

#### 4. `/src/standards/DECISION-LOG.md` (15 minutes - skim)
**Why read:** Understand major decisions made  
**Key entries to read:**
- DEC-TEC-006: Simplified Architecture (why not Azure from Day 1)
- DEC-STR-007: Multi-Tenant from Day 1 (why this matters)
- DEC-BUS-001: Pricing Model (still open decision)

**Takeaway:** "This is why we made certain choices"

---

#### 5. `/docs/ARCHITECTURE_ANALYSIS.md` (30 minutes - Executive Summary only)
**Why read:** Understand Azure vs Simplified tradeoff  
**Sections to read:**
- Executive Summary (first 3 pages)
- Final Recommendation (last 3 pages)
- Skip the 70 pages in between (unless they're curious)

**Takeaway:** "This is why we're starting simple and can scale later"

---

## 🚨 What Changed from Your Friend's Spec

### ✅ What We Kept (Aligned)
- Multi-tenant SaaS from Day 1 ✓
- Metadata-only storage (side-car pattern) ✓
- No auto-delete (explicit approval required) ✓
- Manual discovery trigger (no continuous crawling) ✓
- Workspaces as reference collections ✓
- Microsoft 365, Slack, Google Workspace support ✓

### ⚠️ What We Modified (Improved)

#### 1. **Architecture: Azure → Simplified (Vercel/Supabase)**
**Original:** Azure Functions + Cosmos DB from Day 1  
**Reconciled:** Simplified stack (free tier) for MVP, migrate to Azure later  
**Why:** Saves $70K-135K over 3 years, 20x faster deployment  
**Reference:** See DEC-TEC-006 in DECISION-LOG.md

#### 2. **RBAC: Technical Jargon → Plain English**
**Original:** Roles weren't explicitly defined  
**Reconciled:** Admin, Workspace Creator, Member, Viewer  
**Why:** Plain language better for users (per nomenclature pivot)

#### 3. **Oracle: Deferred to Metadata-Only (v1)**
**Original:** Marked as "optional/phaseable"  
**Reconciled:** Metadata-only mode in v1, content oracle in v2  
**Why:** Simpler to build, no LLM costs, still useful  
**Open Decision:** Team can override if they want content oracle in v1

#### 4. **Connector Tiering: Made Explicit**
**Original:** All connectors treated equally  
**Reconciled:** Tier 1 (M365, Slack full management), Tier 2 (Google read-only)  
**Why:** Focus engineering on primary stack, detect shadow IT without managing it  
**Reference:** See DEC-STR-006 in DECISION-LOG.md

### 🚨 Open Decisions (Need Discussion)
1. Threaded comments vs real-time chat in Workspaces
2. Map visualization format (treemap vs table vs both)
3. Exact cleanup actions per connector
4. Pricing model ($499/mo per tenant vs alternatives)
5. Teams app scope (full vs launcher)

**Action:** Schedule 1-hour meeting to resolve these together

---

## 💡 Key Concepts to Explain

### 1. "Side-Car Pattern" = We Don't Store Files

**Analogy:** Like a GPS map vs actual roads
- GPS stores coordinates, not pavement
- Aethos stores metadata, not content
- Both point you to the real thing

**Why this matters:**
- Legal: No liability for sensitive content
- Cost: Metadata is tiny (KB vs GB)
- Speed: Fast queries, no file indexing
- Compliance: Source systems control permissions

---

### 2. "Multi-Tenant" = One App, Many Customers

**Analogy:** Like Slack (one app, thousands of workspaces)
- Every customer (tenant) has their own data silo
- Database enforces isolation (can't see other tenants)
- Pricing: $499/mo per tenant (not per user)

**Why from Day 1:**
- AppSource marketplace requirement
- Refactoring later takes 6-12 months
- Easier to start multi-tenant than migrate

---

### 3. "Row-Level Security" = Database-Enforced Isolation

**Technical:** PostgreSQL RLS policies enforce tenant boundaries
**Plain English:** Even if code has a bug, database prevents data leakage
**Example:**
```sql
-- This policy makes it impossible to query other tenants
CREATE POLICY tenant_isolation ON containers
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

### 4. "Discovery" = Not Real-Time Sync

**What it is:** Periodic scans (manual or scheduled)  
**What it's not:** Google Drive real-time sync  
**Why:** Reduces API costs, respects rate limits, simpler architecture

**User flow:**
1. Admin clicks "Scan Tenant"
2. Backend fetches metadata from M365/Slack/Google
3. Database updates (containers, assets)
4. Reports show storage waste, growth trends
5. Admin creates cleanup plan

---

### 5. "Workspace" = Playlist for Data

**Analogy:** Like Spotify playlist (references songs) not folder (contains files)
- Pin items from M365, Slack, Google in one place
- Items stay in source systems
- Workspace just remembers the links
- Respects source system permissions

**Use case:** Project command center
- Pin SharePoint site
- Pin Slack channel
- Pin Google Drive folder
- Single URL to access all project context

---

## 🎨 Design Philosophy (Aethos Glass)

### Visual Identity
- **Background:** Deep Space (#0B0F19) - Dark, premium feel
- **Primary:** Starlight Cyan (#00F0FF) - Primary actions, growth
- **Alert:** Supernova Orange (#FF5733) - Waste, alerts, urgency
- **Glassmorphism:** Frosted glass cards with backdrop blur

### Language Tone
- **Not:** "Security Janitor" (negative, compliance-focused)
- **But:** "Operational Architect" (positive, value-focused)
- **Not:** "Risk Detected!" (alarm)
- **But:** "Operational Inefficiency Identified" (opportunity)

### Component Naming
- **Not:** Technical jargon (AUDITOR, CURATOR, Nexus)
- **But:** Plain English (Admin, Workspace, Discovery)
- **Exception:** "Oracle" (keeps the magic, but not overused)

---

## 📊 What's Already Built (Frontend Prototype)

### React Components (60+)
✅ **Core UI:**
- GlassCard (frosted glass container)
- UniversalCard (container cards with drill-down)
- WasteMeter (visual storage gauge)
- MetricDeepDive (expandable analytics)

✅ **Modules:**
- WorkspaceEngine (create, manage workspaces)
- IdentityEngine (user directory)
- ForensicLab (data exploration)
- OracleCommandHub (AI search UI)

✅ **Context Providers:**
- AethosContext (global state)
- UserContext (authentication)
- ThemeContext (dark mode)

### What Needs Backend Integration
❌ **Currently:** localStorage (mock data)  
✅ **After v1:** Supabase PostgreSQL (real data)

**Estimated effort:** 5-8 engineering days to connect frontend to backend

---

## 🚀 Development Plan (12 Weeks)

### Phase 1: Foundation (Week 1-2)
- Supabase database setup
- Multi-tenant RLS policies
- MSAL authentication
- Microsoft 365 connector prototype

### Phase 2: Discovery (Week 3-4)
- Full discovery scan working
- Data Map UI (treemap + table)
- User Directory
- Basic reporting

### Phase 3: Cleanup (Week 5-6)
- Waste recommendation engine
- Cleanup plan creation
- Archive execution (M365)
- Slack + Google connectors

### Phase 4: Workspaces (Week 7-8)
- Workspace CRUD
- Item pinning
- Member invitations
- Threaded comments

### Phase 5: Oracle (Week 9-10)
- Query parser (metadata-only)
- Chat UI
- 10 pre-built templates
- Result formatting

### Phase 6: Polish (Week 11-12)
- Performance optimization
- Security audit
- Load testing
- First 10 pilot customers

**Target Launch:** 12 weeks from kickoff

---

## 🎓 What Your Friend Should Understand

### Technical Concepts
1. **Multi-tenant SaaS** - One app, many customers, data isolation
2. **Side-car pattern** - Metadata storage, not content
3. **Row-Level Security** - Database-enforced tenant boundaries
4. **Connector architecture** - Standard interface for M365/Slack/Google
5. **Discovery model** - Periodic scans, not real-time

### Product Concepts
1. **Discovery module** - Digital flashlight for storage waste
2. **Workspaces** - Curated collections across silos
3. **Oracle** - AI search (metadata-only in v1)
4. **Cleanup flow** - Preview → Select → Confirm → Execute
5. **Permission reflection** - Users see what they have access to

### Business Concepts
1. **Target market** - 500-5,000 employee companies
2. **Pricing model** - $499/mo per tenant (under discussion)
3. **Go-to-market** - Microsoft AppSource marketplace
4. **Competition** - Microsoft Purview, ShareGate, AvePoint
5. **Value prop** - Operational clarity without data migration

---

## 📋 Discussion Agenda (For Your 1st Meeting)

### Part 1: Alignment (15 minutes)
- Walk through consolidated spec (high-level)
- Confirm understanding of 3 modules (Discovery, Workspace, Oracle)
- Clarify any confusing terms

### Part 2: Open Decisions (30 minutes)
Review Section 13 of consolidated spec:
1. Workspace communication (threaded vs chat)?
2. Map visualization (treemap, table, or both)?
3. Cleanup actions per connector (need design)?
4. Pricing model (still deciding)?
5. Teams app scope (launcher vs full)?

**Goal:** Make preliminary decisions, mark what needs more research

### Part 3: Architecture Review (15 minutes)
- Confirm Simplified architecture (Vercel/Supabase) vs Azure
- Review migration path (when to switch)
- Discuss cost implications ($0-5/mo vs $400-2K/mo)

### Part 4: Roles & Responsibilities (15 minutes)
- Who owns what? (Frontend, Backend, DevOps, Product)
- Meeting cadence (weekly standup?)
- Communication channel (Slack, Discord, email?)

### Part 5: Next Steps (15 minutes)
- Immediate tasks (Supabase setup, MSAL config)
- Week 1 goals (database schema, auth working)
- Blockers or questions

**Total meeting time:** 90 minutes

---

## ✅ Pre-Meeting Checklist (For Your Friend)

Before the meeting, they should:
- [ ] Read `/docs/AETHOS_V1_CONSOLIDATED_SPEC.md` (45 min)
- [ ] Skim `/guidelines/Guidelines.md` (10 min - just design system section)
- [ ] Skim `/docs/SIMPLIFIED_ARCHITECTURE.md` (10 min - just tech stack section)
- [ ] Note questions or concerns
- [ ] Think about open decisions (Section 13 of consolidated spec)

**Total prep time:** ~60 minutes

---

## 📦 What to Share with Your Friend

### Minimum Package (Send This)
1. ✅ `/docs/AETHOS_V1_CONSOLIDATED_SPEC.md` ⭐ **CRITICAL**
2. ✅ This document (`/FRIEND_ONBOARDING_PACKAGE.md`)
3. ✅ `/guidelines/Guidelines.md` (for design context)

### Extended Package (If They Want Deep Dive)
4. `/docs/SIMPLIFIED_ARCHITECTURE.md` (technical details)
5. `/docs/CONSOLIDATED_STANDARDS.md` (coding standards)
6. `/src/standards/DECISION-LOG.md` (decision history)
7. `/docs/ARCHITECTURE_ANALYSIS.md` (Azure comparison - Executive Summary only)

### Optional (For Reference)
8. `/docs/DEPLOYMENT_GUIDE.md` (when ready to deploy)
9. `/docs/DEPENDENCY_AUDIT.md` (package decisions)
10. `/docs/README_DOCUMENTATION_INDEX.md` (master catalog)

---

## 🎯 Success Criteria (For This Onboarding)

After reading these docs, your friend should be able to:
- [ ] Explain Aethos to someone else in 2 minutes
- [ ] Understand the 3 core modules (Discovery, Workspace, Oracle)
- [ ] Know why it's multi-tenant from Day 1
- [ ] Understand why we're not storing file contents
- [ ] Explain the Simplified architecture choice
- [ ] Identify the 5 open decisions
- [ ] Feel ready to start building

**If any of these are unclear, schedule a follow-up call to clarify.**

---

## 💬 Sample Talking Points (For Your Conversation)

### "What is Aethos?"
> "Aethos is an intelligence layer for Microsoft 365. It helps companies find storage waste and organize data across silos—without moving anything. Think of it like a GPS for enterprise data: we store the map, not the roads."

### "Why not just use SharePoint?"
> "SharePoint stores content but doesn't give you insights. Aethos tells you 'this site hasn't been accessed in 2 years and costs $50/month' or 'this user owns 2TB of storage.' We're the analytics layer SharePoint doesn't have."

### "Why are we starting with Vercel/Supabase instead of Azure?"
> "We can launch in 2 weeks instead of 2 months, and save $70K over 3 years. When we hit 1,000 customers, we'll migrate to Azure. But we need to validate product-market fit first before spending on enterprise infrastructure."

### "What's different about v1?"
> "We're focusing on three things: Discovery (find waste), Workspaces (organize references), and Oracle (search metadata). No file editing, no content storage, no real-time sync. Just the intelligence layer. We can add features later based on what users actually need."

### "How long until we launch?"
> "12 weeks from kickoff to first pilot customers. We're not building everything—just the MVP that proves the value."

---

## 🚧 Known Gaps (What's Not Documented Yet)

### Need to Create:
1. **Connector implementation guides** (how to build M365/Slack/Google connectors)
2. **Cleanup action specifications** (exact API calls for archive/delete)
3. **Workspace permission reflection logic** (how to check user access)
4. **Oracle query templates** (10 pre-built queries for v1)
5. **Error handling patterns** (what to show users when things fail)

**Action:** These will be created during implementation (Weeks 1-4)

---

## 🎉 Bottom Line

Your friend's high-level spec was **excellent** and showed strong product thinking. The reconciled version:
- ✅ Keeps all the good ideas (multi-tenant, metadata-only, workspace model)
- ✅ Adds technical implementation details (data model, API routes)
- ✅ Makes pragmatic architecture choices (Simplified for MVP, Azure later)
- ✅ Clarifies open decisions (5 items need discussion)
- ✅ Provides clear 12-week roadmap

**The consolidated spec is production-ready.** You can hand it to an engineering team and they can start building today.

---

## 📞 Next Steps

1. **Send your friend:**
   - `/docs/AETHOS_V1_CONSOLIDATED_SPEC.md`
   - `/FRIEND_ONBOARDING_PACKAGE.md` (this doc)
   - `/guidelines/Guidelines.md`

2. **Schedule meeting** (90 minutes)
   - Review consolidated spec
   - Resolve open decisions
   - Assign responsibilities
   - Set Week 1 goals

3. **After meeting:**
   - Update `/src/standards/DECISION-LOG.md` with final decisions
   - Create GitHub repo and issues
   - Start Week 1 implementation

---

**You're ready to build. Let's ship this. 🚀**

---

**Questions?** Reference `/docs/README_DOCUMENTATION_INDEX.md` for the complete doc catalog.
