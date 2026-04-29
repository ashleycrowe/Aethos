# Aethos Master Project Plan (MVP to Market)

**Location:** `/docs/3-standards/MASTER-PROJECT-PLAN.md`  
**Last Updated:** 2026-02-27  
**Status:** Active

---

## 📋 Project Status: 🟢 v1 DEVELOPMENT

**Target AppSource Submission:** April 2026  
**Target Public Launch:** May 2026

**Current Phase:** Building Content Oracle v1 (Discovery + Workspaces + Oracle modules)

---

## 🎯 v1 Product Scope

**Product Name:** Content Oracle  
**Tagline:** Organizational Clarity Through Intelligence  
**Pricing:** $499/mo base + $199/mo AI+ upsell  
**Architecture:** Simplified (Vercel + Supabase)

### Core Modules (v1)

1. **Discovery (The Constellation)**
   - SharePoint site/library/folder visualization
   - Intelligence scoring (metadata quality)
   - Ghost Town identification
   - Storage waste calculation

2. **Workspaces (The Nexus)**
   - Tag-based workspace auto-sync
   - Multi-container grouping
   - Aethos Notes (metadata enrichment layer)
   - Workspace intelligence scoring

3. **Oracle (Search & Intelligence)**
   - **Base Tier ($499/mo):** Metadata-only search, tag-based filtering
   - **AI+ Tier (+$199/mo):** Content reading, semantic search, AI enrichment

---

## 🛠️ Track 1: Discovery Module (The Constellation)

*Focus: Metadata Intelligence Layer, Pattern Detection*

### ✅ Completed Features

- [x] **Metadata Intelligence Scoring**
  - [x] Title quality analysis (generic vs descriptive)
  - [x] Description completeness check
  - [x] Tag coverage analysis
  - [x] Custom metadata field utilization
  - [x] Intelligence score calculation (0-100)

- [x] **Pattern Detection**
  - [x] Ghost Town identification (dormancy > 180 days)
  - [x] Poor metadata patterns (missing fields)
  - [x] Storage waste calculation
  - [x] External exposure detection

- [x] **Visualization**
  - [x] Star Map constellation view
  - [x] Intelligence score heat mapping
  - [x] Provider badge overlays (M365/Slack/Google)

### 🚧 In Progress

- [ ] **Advanced Analytics**
  - [ ] Metadata trend analysis (improving vs declining)
  - [ ] Cross-workspace pattern detection
  - [ ] Anomaly detection (sudden metadata degradation)

### 📅 Planned (Q2 2026)

- [ ] **Bulk Actions**
  - [ ] Mass metadata enrichment suggestions
  - [ ] Automated tag propagation
  - [ ] Ghost Town archival recommendations

---

## 🏗️ Track 2: Workspaces Module (The Nexus)

*Focus: Tag-Based Auto-Sync, Intelligence Federation*

### ✅ Completed Features

- [x] **Tag-Based Auto-Sync (Full UI)**
  - [x] Workspace creation with auto-sync enabled
  - [x] Tag definition interface
  - [x] Live container matching preview
  - [x] Sync status dashboard
  - [x] Manual sync trigger
  - [x] Tag editing interface
  - [x] Auto-sync pause/resume
  - [x] Workspace settings management
  - [x] Tag conflict resolution UI
  - [x] Bulk tag management
  - [x] Sync history tracking

- [x] **Workspace Intelligence**
  - [x] Aggregate intelligence scoring
  - [x] Container grouping logic
  - [x] Cross-provider federation (M365 + Slack + Google)

- [x] **Aethos Notes Layer**
  - [x] Per-container metadata enrichment
  - [x] Non-invasive overlay (doesn't modify source)
  - [x] Tag management

### 🚧 In Progress

- [ ] **Advanced Sync Features**
  - [ ] Scheduled sync (hourly/daily)
  - [ ] Conditional sync rules (e.g., "only if intelligence < 50")
  - [ ] Sync conflict notifications

### 📅 Planned (Q2 2026)

- [ ] **Workspace Templates**
  - [ ] Pre-configured tag patterns for common use cases
  - [ ] Department-specific workspaces
  - [ ] Project workspace templates

---

## 🔮 Track 3: Oracle Module (Search & Intelligence)

*Focus: Metadata Intelligence First, AI+ as Upsell*

### ✅ Completed (Base Tier - $499/mo)

- [x] **Metadata Search**
  - [x] Tag-based filtering
  - [x] Intelligence score filtering
  - [x] Provider filtering (M365/Slack/Google)
  - [x] Date range filtering

### 🚧 In Progress (AI+ Tier - +$199/mo)

- [ ] **Content Reading (Opt-in)**
  - [ ] Permission-based file body reading
  - [ ] Document text extraction
  - [ ] Privacy controls (toggleable per tenant)

- [ ] **Semantic Search**
  - [ ] OpenAI embeddings generation
  - [ ] Vector similarity search (pgvector in Supabase)
  - [ ] Natural language queries

- [ ] **AI Enrichment**
  - [ ] Automatic topic extraction
  - [ ] Document summaries
  - [ ] Suggested metadata improvements
  - [ ] Content classification

### 📅 Planned (Q3 2026)

- [ ] **Advanced AI Features**
  - [ ] Duplicate content detection
  - [ ] Related document suggestions
  - [ ] Intelligent workspace recommendations

---

## 🚀 Track 4: Platform & Infrastructure

*Focus: Simplified Architecture (Vercel + Supabase)*

### ✅ Completed

- [x] **Simplified Architecture Decision**
  - [x] Vercel deployment (free tier → pro at scale)
  - [x] Supabase PostgreSQL (free tier → pro at scale)
  - [x] Row-Level Security (RLS) for multi-tenancy
  - [x] MSAL.js for Microsoft authentication

- [x] **Multi-Tenant Foundation**
  - [x] Database schema with tenant_id on all tables
  - [x] RLS policies enforcing tenant isolation
  - [x] Tenant purge API (GDPR compliance)

- [x] **Microsoft Integration**
  - [x] Entra ID authentication
  - [x] Graph API integration
  - [x] Delegated permissions flow

### 🚧 In Progress

- [ ] **Production Readiness**
  - [ ] Environment configuration (dev/staging/prod)
  - [ ] Database migrations strategy
  - [ ] Monitoring & logging (Vercel Analytics)
  - [ ] Error tracking (Sentry or similar)

- [ ] **Performance Optimization**
  - [ ] Database query optimization
  - [ ] API response caching
  - [ ] Bundle size optimization (<300KB gzipped)

### 📅 Planned (Q2 2026)

- [ ] **Scaling Strategy**
  - [ ] Supabase connection pooling
  - [ ] Redis caching layer (optional)
  - [ ] CDN for static assets

- [ ] **Migration Plan** (when needed)
  - [ ] Azure migration playbook ready
  - [ ] Trigger: >1,000 tenants OR >$50K MRR OR enterprise requirement
  - [ ] See `/docs/2-ARCHITECTURE/AZURE_MIGRATION_PLAYBOOK.md`

---

## 📋 Track 5: Compliance & Legal

*Focus: AppSource Requirements, GDPR, SOC 2*

### 🚧 In Progress

- [ ] **AppSource Requirements**
  - [ ] Multi-tenant architecture (✅ Complete)
  - [ ] Privacy policy documentation
  - [ ] Terms of service
  - [ ] Support documentation
  - [ ] Demo video
  - [ ] App listing content

- [ ] **GDPR Compliance**
  - [ ] Right to be forgotten (tenant purge API - ✅ Complete)
  - [ ] Data portability (export API - ✅ Complete)
  - [ ] Privacy policy review
  - [ ] Data processing agreement template

- [ ] **Security Certifications**
  - [ ] SOC 2 Type 1 (via Vanta or Drata - 3-6 months)
  - [ ] Penetration testing
  - [ ] Security audit

### 📅 Planned (Q2-Q3 2026)

- [ ] **Legal Documentation**
  - [ ] Master Services Agreement (MSA)
  - [ ] Service Level Agreement (SLA)
  - [ ] Data Processing Agreement (DPA)

---

## 🎯 Track 6: Go-To-Market (GTM)

*Focus: AppSource Launch, Initial Customers*

### 🚧 In Progress

- [ ] **AppSource Strategy**
  - [ ] App listing optimization
  - [ ] Submission timeline (April 2026)
  - [ ] Microsoft co-sell enablement (future)

- [ ] **Customer Acquisition**
  - [ ] Beta customer outreach (target: 10 customers)
  - [ ] Case study development
  - [ ] Testimonial collection

- [ ] **Pricing Validation**
  - [ ] $499/mo base tier testing
  - [ ] $199/mo AI+ upsell validation
  - [ ] Enterprise tier research ($48K/year - defer to v1.1)

### 📅 Planned (Q2 2026)

- [ ] **Marketing Materials**
  - [ ] Product demo video
  - [ ] Website launch
  - [ ] Case studies
  - [ ] Sales deck

- [ ] **Channel Strategy**
  - [ ] Microsoft partner program enrollment
  - [ ] AppSource optimization
  - [ ] Direct sales outreach

---

## 📅 2026 Milestones

| Date | Milestone | Goal | Status |
| :--- | :--- | :--- | :--- |
| **Feb 27** | Standards Migration | Consolidate docs to `/docs/3-standards/` | ✅ Complete |
| **Mar 15** | Oracle MVP | Complete metadata intelligence features | 🚧 In Progress |
| **Mar 31** | Beta Testing | 5 pilot customers using product | 🔜 Upcoming |
| **Apr 15** | AppSource Submission | Submit to Microsoft AppSource | 🔜 Upcoming |
| **Apr 30** | SOC 2 Kickoff | Begin SOC 2 certification process | 🔜 Upcoming |
| **May 15** | Public Launch | General availability on AppSource | 🎯 Target |
| **Jun 30** | 50 Customers | Reach 50 paying tenants ($25K MRR) | 🎯 Target |
| **Sep 30** | 200 Customers | Scale to 200 tenants ($100K MRR) | 🎯 Target |
| **Dec 31** | 500 Customers | 500 tenants, consider Azure migration | 🎯 Target |

---

## 🚧 Current Sprint (Feb 27 - Mar 12)

### High Priority
1. Complete Oracle metadata search UI
2. Implement tag-based filtering
3. Set up Vercel production environment
4. Create database migration scripts

### Medium Priority
5. Draft privacy policy
6. Create AppSource app listing content
7. Set up error tracking (Sentry)
8. Optimize database queries

### Low Priority
9. Design demo video script
10. Draft customer case study template

---

## 📝 Open Questions / Blockers

### Technical
- [ ] **OpenAI Integration:** Finalize embedding strategy for semantic search
- [ ] **Database Indexes:** Review query performance with >10K containers
- [ ] **Caching Strategy:** Decide on Redis vs in-memory caching

### Business
- [ ] **SOC 2 Provider:** Choose between Vanta ($2K/mo) vs Drata ($3K/mo)
- [ ] **Pricing Validation:** Test $499 price point with beta customers
- [ ] **AppSource Timeline:** Confirm realistic approval timeline (2-6 weeks?)

### Legal
- [ ] **Privacy Policy:** Legal review required before AppSource submission
- [ ] **GDPR Compliance:** Verify tenant purge API meets all requirements
- [ ] **DPA Template:** Need lawyer to draft data processing agreement

---

## 🔄 Document Maintenance

**Review Cycle:** Bi-weekly (every other Monday)  
**Owner:** Product Lead + Engineering Lead  
**Last Updated:** 2026-02-27  
**Next Review:** 2026-03-10

---

## 📚 Related Documents

- **Product Spec:** `/docs/AETHOS_CONSOLIDATED_SPEC_V2.md`
- **Architecture:** `/docs/2-ARCHITECTURE/SIMPLIFIED_ARCHITECTURE.md`
- **Design System:** `/docs/MASTER_DESIGN_GUIDE.md`
- **Implementation Roadmap:** `/docs/V1_IMPLEMENTATION_ROADMAP.md`
- **Decision Log:** `/docs/3-standards/DECISION-LOG.md`
