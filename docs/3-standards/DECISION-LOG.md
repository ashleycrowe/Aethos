# Aethos Decision & Change Log
## Project Institutional Memory

---
**Document Owner:** Aethos Tech Lead
**Last Updated:** 2026-02-27
**Status:** Active
**Location:** `/docs/3-standards/DECISION-LOG.md`

---

## 📋 Quick Reference

| ID | Title | Date | Status | Impact |
|----|-------|------|--------|--------|
| DEC-TEC-001 | Aethos Core Stack | 2026-01-15 | Approved | Critical |
| DEC-STR-001 | Sidecar Pattern Selection | 2026-01-20 | Superseded | Critical |
| DEC-TEC-002 | Strict Type Implementation | 2026-02-04 | Approved | High |
| DEC-TEC-003 | Multi-Tier Cache Governance | 2026-02-04 | Approved | High |
| DEC-STR-002 | Operational Intelligence Pivot | 2026-02-04 | Approved | Critical |
| DEC-STR-003 | Discovery-First Remediation | 2026-02-04 | Approved | High |
| DEC-TEC-004 | Risk Granularity Strategy | 2026-02-04 | Approved | Medium |
| DEC-STR-004 | Universal Intelligence Pivot | 2026-02-04 | Approved | Critical |
| DEC-STR-005 | Narrative Logic Architecture | 2026-02-04 | Approved | Medium |
| DEC-TEC-005 | Forensic Table Drill-down | 2026-02-04 | Approved | High |
| DEC-STR-006 | Tiered Adapter Strategy | 2026-02-05 | Approved | Critical |
| DEC-TEC-006 | Simplified Architecture (MVP First) | 2026-02-26 | **ASSUMED** | Critical |
| DEC-STR-007 | Multi-Tenant from Day 1 | 2026-02-26 | **ASSUMED** | Critical |
| DEC-TEC-007 | Tailwind CSS v4 Adoption | 2026-02-26 | **ASSUMED** | Medium |
| DEC-STR-008 | AppSource Submission Timing | 2026-02-26 | **PENDING** | High |
| DEC-BUS-001 | Pricing Model ($499/mo per tenant) | 2026-02-26 | **APPROVED - REFERENCE PRICING** | Critical |

---

## 🚨 ASSUMED DECISIONS (REQUIRE TEAM VERIFICATION)

These decisions have been made provisionally and require formal team verification before proceeding.

### Decision DEC-TEC-006: Simplified Architecture (MVP First)
**Date:** 2026-02-26
**Status:** **ASSUMED - REQUIRES TEAM VERIFICATION**
**Category:** Technical
**Impact:** Critical
**Decision Owner:** CTO / Engineering Lead

**Context:**
The original architecture specified Azure Functions + Cosmos DB from Day 1 at a cost of $400-2,000/month before first customer. This creates significant upfront investment without validated product-market fit.

**Decision:**
Adopt a **Simplified Architecture** for MVP phase:
- **Frontend**: Vercel (free tier)
- **Backend**: Vercel Serverless Functions (free tier)
- **Database**: Supabase PostgreSQL with RLS (free tier: 500MB)
- **Cost**: $0-5/month for 0-100 tenants
- **Migration Path**: When revenue >$50K/mo OR tenants >1,000, migrate to Azure

**Rationale:**
1. **Cost Efficiency**: Saves $400-2,000/month in Years 1-2 ($5K-24K total savings)
2. **Time to Market**: Deploy in 2-3 days vs 6-8 weeks
3. **Risk Mitigation**: Validate product-market fit before expensive infrastructure
4. **Proven Migration Path**: Can migrate to Azure in 3-6 months when needed
5. **Still Enterprise-Grade**: Multi-tenant, SOC 2, RLS, Microsoft integration

**Alternatives Considered:**
1. **Azure from Day 1**: Rejected. Too expensive without revenue, 6-8 week setup time.
2. **AWS (ECS + RDS)**: Rejected. Similar cost to Azure, no Microsoft alignment benefits.
3. **Self-Hosted (DigitalOcean)**: Rejected. Requires DevOps expertise, no SLA guarantees.

**Migration Trigger Conditions:**
- Monthly revenue >$50K/month ($600K ARR) OR
- Active tenants >1,000 OR
- Enterprise deals requiring Azure hosting OR
- Microsoft co-sell opportunity requires Azure OR
- HIPAA/FedRAMP compliance needed

**References:**
- `/docs/2-ARCHITECTURE/SIMPLIFIED_ARCHITECTURE.md` - Current implementation
- `/docs/2-ARCHITECTURE/AZURE_MIGRATION_PLAYBOOK.md` - Future migration plan

**Financial Impact:**
- Year 1 savings: $5,000-24,000
- Year 2 savings: $10,000-30,000
- Migration cost (Year 2-3): $153,000 one-time
- **Net 3-year savings: $70K-135K** (even with migration)

**Risks:**
1. **Performance**: Azure is 2x faster (15-50ms vs 30-100ms P50). **Mitigated**: Simplified is "fast enough" for <1,000 concurrent users.
2. **Microsoft Partnership**: May raise questions in AppSource submission. **Mitigated**: Vercel is SOC 2 certified, meets all technical requirements.
3. **Scale Ceiling**: Supabase maxes out at ~5,000 tenants. **Mitigated**: Will migrate before hitting limit.

**REQUIRED TEAM VERIFICATION:**
- [ ] Engineering team agrees (technical feasibility)
- [ ] Product team agrees (time-to-market priority)
- [ ] Finance team agrees (budget allocation)
- [ ] Sales/GTM team agrees (customer perception)
- [ ] CTO/CEO final approval

**Verification Deadline:** 2026-03-15 (2 weeks)
**If Not Approved:** Proceed with Azure architecture (add 6-8 weeks to timeline, increase budget by $20K Year 1)

---

### Decision DEC-STR-007: Multi-Tenant from Day 1
**Date:** 2026-02-26
**Status:** **ASSUMED - REQUIRES TEAM VERIFICATION**
**Category:** Strategic
**Impact:** Critical
**Decision Owner:** CTO / Product Lead

**Context:**
Early-stage SaaS products often start single-tenant and migrate to multi-tenant later, which is a complex and risky refactor.

**Decision:**
Build **multi-tenant architecture from Day 1**:
- Every database table has `tenant_id` column
- Row-Level Security (RLS) enforces tenant isolation
- Pricing model: $499/mo **per tenant** (not per user)
- AppSource strategy: Multi-tenant from launch

**Rationale:**
1. **AppSource Requirement**: Microsoft marketplace expects multi-tenant SaaS
2. **Pricing Model Alignment**: $499/mo per tenant (B2B model)
3. **Easier to Start Multi-Tenant**: Refactoring single→multi-tenant is 6-12 months work
4. **Free Tier Support**: Supabase RLS supports multi-tenancy at no extra cost
5. **Security Best Practice**: RLS prevents data leakage between tenants

**Alternatives Considered:**
1. **Single-Tenant**: Rejected. Would require complete rewrite for AppSource.
2. **Subdomain-per-Tenant**: Rejected. Infrastructure complexity, higher costs.
3. **Schema-per-Tenant**: Rejected. PostgreSQL limit of 1,000 schemas would cap growth.

**Implementation:**
```sql
-- Every table structure
CREATE TABLE containers (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id), -- Isolation key
  ...
);

-- RLS policy
CREATE POLICY tenant_isolation ON containers
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

**Risks:**
1. **Added Complexity**: Every query needs `WHERE tenant_id = ?`. **Mitigated**: RLS enforces automatically at DB level.
2. **Performance**: Indexes must include tenant_id. **Mitigated**: Proper indexing strategy documented.
3. **Testing Overhead**: Need multiple test tenants. **Mitigated**: Seed script creates 3 test tenants.

**REQUIRED TEAM VERIFICATION:**
- [ ] Engineering team trained on RLS patterns
- [ ] Product team confirms $499/mo per-tenant pricing
- [ ] Sales team confirms multi-tenant is selling point (not concern)
- [ ] CTO/CEO final approval

**Verification Deadline:** 2026-03-15 (2 weeks)
**If Not Approved:** Requires complete architecture redesign (4-6 weeks delay)

---

### Decision DEC-TEC-007: Tailwind CSS v4 Adoption
**Date:** 2026-02-26
**Status:** **ASSUMED - REQUIRES TEAM VERIFICATION**
**Category:** Technical
**Impact:** Medium
**Decision Owner:** Design/Engineering Lead

**Context:**
Tailwind CSS v4 was released recently with breaking changes from v3. Some older documentation references v3 patterns.

**Decision:**
Use **Tailwind CSS v4** (latest version):
- Modern CSS variables (no more JIT compilation)
- Improved performance (smaller bundle)
- Future-proof (v3 will be deprecated)

**Rationale:**
1. **Performance**: v4 is 10-20% smaller bundle size
2. **Modern Standards**: Uses native CSS features
3. **Better DX**: Improved IDE autocomplete
4. **Long-term Support**: v3 will be EOL within 2 years

**Alternatives Considered:**
1. **Tailwind v3**: Rejected. Will be deprecated, larger bundle.
2. **CSS-in-JS (styled-components)**: Rejected. Runtime overhead, worse performance.
3. **Vanilla CSS**: Rejected. Slower development, harder to maintain.

**Breaking Changes from v3:**
- Some utility classes renamed
- Config file structure changed
- Migration guide available

**Risks:**
1. **Team Learning Curve**: New syntax. **Mitigated**: 2-hour training session, migration guide.
2. **Third-Party Components**: Some UI libraries still use v3. **Mitigated**: Radix UI is v4 compatible.

**REQUIRED TEAM VERIFICATION:**
- [ ] Design team confirms no blockers
- [ ] Engineering team trained on v4 syntax
- [ ] No critical third-party dependencies broken

**Verification Deadline:** 2026-03-08 (1 week)
**If Not Approved:** Downgrade to Tailwind v3 (loses performance benefits)

---

## ⏳ PENDING DECISIONS (REQUIRE DISCUSSION)

These decisions are open questions that need team input.

### Decision DEC-STR-008: AppSource Submission Timing
**Date:** 2026-02-26
**Status:** **PENDING - REQUIRES DISCUSSION**
**Category:** Strategic
**Impact:** High
**Decision Owner:** GTM Lead / CTO

**Question:**
When should we submit Aethos to Microsoft AppSource?

**Options:**
1. **Submit Immediately** (Week 1-2)
   - Pros: Start validation process early, get feedback
   - Cons: May have incomplete features, could delay if rejected

2. **Submit After MVP Features** (Month 2-3)
   - Pros: More polished product, higher approval chance
   - Cons: Delays potential AppSource traffic, Microsoft co-sell

3. **Submit After First 10 Customers** (Month 3-6)
   - Pros: Proven product-market fit, customer testimonials
   - Cons: Miss early AppSource exposure, competitor may launch first

**Requirements for AppSource:**
- [ ] Multi-tenant architecture (✅ DEC-STR-007)
- [ ] SOC 2 certification (❌ Need Vanta or similar, 3-6 months)
- [ ] Privacy policy & terms of service (⚠️ Need legal review)
- [ ] Support documentation (⚠️ Partially complete)
- [ ] Demo video (❌ Not created yet)

**Recommendation:** Option 2 (Submit After MVP Features)
**Rationale:** Allows time to complete SOC 2, legal docs, and demo video

**REQUIRED TEAM DISCUSSION:**
- GTM team: Market timing considerations
- Engineering: Technical readiness assessment
- Legal: Compliance requirements timeline
- CEO: Strategic priority (speed vs quality)

**Discussion Deadline:** 2026-03-08 (1 week)

---

### Decision DEC-BUS-001: Pricing Model ($499/mo per tenant)
**Date:** 2026-02-26
**Status:** **APPROVED - REFERENCE PRICING**
**Category:** Business
**Priority:** Critical
**Decision Owner:** CEO / Product Lead

**Question:**
Is $499/month per tenant the right pricing model for MVP?

**DECISION:**
**Base Tier: $499/mo per tenant (reference/suggested)**
- Includes: Discovery + Workspaces + Oracle (Metadata Intelligence)
- Flat rate, unlimited users
- Multi-tenant model

**AI+ Content Intelligence: +$199/mo (reference/suggested)**
- Opt-in content reading (reads file bodies with permission)
- Semantic search with OpenAI embeddings
- Document summaries and topic extraction
- Toggleable (privacy-friendly, some customers don't want AI)

**Note:** Pricing is **reference/suggested** for testing market fit. Final pricing will be determined based on customer feedback and competitive analysis during beta.

**What's Deferred:**
- ❌ Enterprise tier ($48K/year) - Defer to v1.1 (no white-glove service for v1)
- ❌ Phase 3+ add-on pricing - Defer until features are built (2027+)

**Rationale:**
1. **Market Fit Testing**: Reference pricing allows us to test the market's willingness to pay for the base features.
2. **Customer Feedback**: We can gather feedback on the value proposition and adjust pricing accordingly.
3. **Competitive Analysis**: During beta, we can analyze competitor pricing and adjust our model to remain competitive.

**Alternatives Considered:**
1. **Per-User Pricing**: $5-10/user/month
   - Pros: More granular, aligns with Microsoft 365 pricing
   - Cons: Complex billing, small tenants may not buy

2. **Tiered Pricing**: 
   - Free tier: 0-50 users (discovery only)
   - Standard: $499/mo (50-500 users)
   - Enterprise: $1,499/mo (500+ users, full features)
   - Pros: Captures SMBs and enterprises
   - Cons: More complex to manage, may cannibalize high-end

3. **Usage-Based**: $0.10 per GB scanned per month
   - Pros: Aligns with value (more waste = higher cost)
   - Cons: Unpredictable billing, hard to forecast revenue

**Competitor Pricing:**
- Microsoft Purview: $5-10/user/month (compliance focus)
- ShareGate: $799-2,499/year (migration focus)
- AvePoint: Custom enterprise pricing (governance focus)

**Initial Market Research:**
- Target customer: 500-5,000 employee companies
- Budget: $5K-50K/year for M365 governance tools
- Decision maker: CTO, CIO, or M365 admin
- Sales cycle: 1-3 months (SMB) or 3-6 months (Enterprise)

**REQUIRED TEAM DISCUSSION:**
- Sales/GTM: Customer willingness to pay, competitive positioning
- Finance: Revenue targets, unit economics
- Product: Feature differentiation by tier (if tiered)
- CEO: Overall business model

**Discussion Deadline:** 2026-03-15 (2 weeks)
**Impact:** Affects product roadmap (freemium vs paid-only features)

---

## 🔄 SUPERSEDED DECISIONS

### Decision DEC-STR-001: Sidecar Pattern Selection (SUPERSEDED)
**Date:** 2026-01-20
**Status:** Superseded by DEC-TEC-006
**Category:** Strategic
**Impact:** Critical

**Original Decision:**
Implement the **Sidecar Pattern** using Azure Functions and Cosmos DB.

**Superseded By:**
DEC-TEC-006 (Simplified Architecture) - Now using Vercel Functions + Supabase PostgreSQL

**Why Superseded:**
Cost and time-to-market considerations favor starting with simplified architecture and migrating to Azure later when revenue justifies it.

**Migration Path:**
See `/docs/2-ARCHITECTURE/AZURE_MIGRATION_PLAYBOOK.md` for future implementation of original Azure vision.

---

## 🛠️ Technical Decisions

### Decision DEC-STR-006: Tiered Adapter Strategy
**Date:** 2026-02-05
**Status:** Approved
**Category:** Strategic
**Impact:** Critical

**Context:**
Attempting full bi-directional management for 5+ SaaS providers creates a "Wide Data" maintenance nightmare and dilutes the product's core value as an M365 intelligence layer.

**Decision:**
Implement a **Tiered Adapter Strategy**:
- **Tier 1 (Core Synthesis)**: Microsoft 365 & Slack. Full bi-directional management (Archive/Delete/Sync). These are the operational anchors.
- **Tier 2 (Shadow Discovery)**: Google Workspace, Box, Local. Focused on identification of leakage and storage waste ("Dead Capital"). Remediation is restricted to "Alert & Redirect" (Disclosure Protocols).

**Rationale:**
Focuses engineering resources on the primary enterprise stack (M365/Slack) while maintaining a competitive edge by identifying "Shadow IT" leakage in Google/Box without the liability of managing those third-party environments natively.

### Decision DEC-TEC-001: Aethos Core Stack
**Date:** 2026-01-15
**Status:** Approved
**Category:** Technical
**Impact:** Critical

**Context:**
Building a rapid-iteration intelligence layer for M365 that must feel cinematic and remain responsive under high metadata loads.

**Decision:**
Use **React 18 + Vite + Tailwind CSS v4 + TypeScript** (Updated from Next.js due to simplified architecture).

**Rationale:**
Vite provides fast dev experience and optimized builds. React 18 with React Router handles navigation. Tailwind v4 allows for the complex glassmorphism required by the "Aethos Glass" design system.

**Alternatives Considered:**
1. **Next.js:** Considered initially, but Vite is simpler for MVP without SSR requirements.
2. **SPFx Native:** Rejected. Too slow for "Cinematic" animations and heavy intelligence overlays.
3. **Vanilla React:** Rejected. Missing optimization tools available with Vite.

---

### Decision DEC-TEC-002: Strict Type Implementation (STD-CODE-001)
**Date:** 2026-02-04
**Status:** Approved
**Category:** Technical
**Impact:** High

**Context:**
Manual type-casting and `any` usage in the prototype were leading to "Ghost Town" site calculation errors.

**Decision:**
Enforce 100% Strict TypeScript and prohibit the `any` type globally.

**Rationale:**
Enables safe refactoring of the intelligence engine and ensures metadata pointers are always valid.

---

### Decision DEC-TEC-003: Multi-Tier Cache Governance (STD-DATA-001)
**Date:** 2026-02-04
**Status:** Approved
**Category:** Technical
**Impact:** High

**Context:**
Microsoft Graph throttling (429) was causing dashboard flickering during site-wide scans.

**Decision:**
Implement caching strategy with specific TTLs for Waste Metrics (1hr). Use Supabase for persistent storage.

**Rationale:**
Balances the need for fresh "Flashlight" projections with the strict throughput limits of the Graph API.

---

### Decision DEC-STR-002: Operational Intelligence Pivot
**Date:** 2026-02-04
**Status:** Approved
**Category:** Strategic
**Impact:** Critical

**Context:**
The previous "Anti-Intranet" and "Security Janitor" branding was too aggressive and created friction with internal SharePoint teams. 

**Decision:**
Remove "The Anti-Intranet" branding and pivot to **"Enterprise Intelligence Layer"** with the tagline **"Organizational Clarity Through Intelligence."** Reframe the value prop from "Risk/Security" to "Value/Efficiency."

**Rationale:**
CISOs and IT Directors buy on value and efficiency. Positioning as an "Operational Architect" aligns with business growth rather than being perceived as a cost-center auditor.

---

### Decision DEC-STR-003: Discovery-First Remediation (Simulation Strategy)
**Date:** 2026-02-04
**Status:** Approved
**Category:** Strategic
**Impact:** High

**Context:**
Automating the deletion or archiving of M365 sites is technically complex and carries high liability for an MVP.

**Decision:**
Focus the MVP on **Discovery** (External Exposure links) and **Simulation** (The Cold Archive button). 

**Rationale:**
Visualizing the "Action -> Reward" loop (archive a site -> see waste decrease) provides the emotional win for the user without requiring the high-risk engineering of destructive actions in the first release.

---

### Decision DEC-TEC-004: Risk Granularity Strategy (Critical Vectors)
**Date:** 2026-02-04
**Status:** Approved
**Category:** Technical
**Impact:** Medium

**Context:**
General "External Link" counts are noisy. A link to a PNG logo is not the same as a link to a payroll CSV.

**Decision:**
Implement a file-extension weighted risk engine that identifies **.xlsx, .csv, and .docx** as "Critical Exposure Vectors" and applies higher visual urgency.

**Rationale:**
Increases the signal-to-noise ratio of the "Flashlight" and allows users to prioritize remediation efforts on high-value data leaks.

---

### Decision DEC-STR-005: Narrative Logic Architecture
**Date:** 2026-02-04
**Status:** Approved
**Category:** Strategic
**Impact:** Medium

**Context:**
Technical calculations (e.g., `(Total_GB - Allowance) * Cost`) were overwhelming non-technical stakeholders in the Snapshot Analytics view.

**Decision:**
Implement a dual-layer logic system: **Operational Narratives** (the "Story" of the metric) and **Technical Calculations**. Raw logic is hidden behind interactive tooltips.

**Rationale:**
Allows "Executive" personas to understand the value of the metric quickly while providing "Architect" personas the exact formula on-demand.

---

### Decision DEC-TEC-005: Forensic Table Drill-down (Universal Lab)
**Date:** 2026-02-04
**Status:** Approved
**Category:** Technical
**Impact:** High

**Context:**
Users need to move from "Seeing a trend" to "Identifying the artifact" without switching dashboards.

**Decision:**
Implemented a unified **Forensic Lab** with a cross-provider table and "Business Meaning" sidebars. 

**Rationale:**
Consolidates reporting into a single "Command and Control" interface, allowing architects to slice and dice artifacts across Microsoft, Google, and Slack in a single view.

---

## 🔄 Maintenance

**Review Cycle:** Quarterly (or as needed for critical decisions)  
**Owner:** Aethos Tech Lead & Product Team  
**Authority:** MANDATORY reference for all strategic discussions  
**Last Updated:** 2026-02-27 (Moved to /docs/3-standards/)
