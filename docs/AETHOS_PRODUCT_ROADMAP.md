# Aethos Product Roadmap (V1 → V4)

**Strategic Vision:** The Operational Clarity Layer for Enterprise Knowledge  
**Launch Target:** V1 in 8-10 weeks  
**Last Updated:** 2026-02-27

---

## Roadmap Philosophy

Aethos is not building toward a single fixed product. It is building a **platform that sequences ambition**.

Each version unlocks a new capability layer **only after validating the previous foundation**. This approach:

- Reduces execution risk
- Validates demand before heavy investment
- Allows strategic pivots based on real user behavior
- Builds competitive moat progressively

---

## The Complete Vision (2026-2028)

By 2028, Aethos becomes the **Enterprise Knowledge Operating System**:

1. **Discovery** → Restore visibility across Microsoft 365, Slack, Google Workspace, Box, and local storage
2. **Organization** → Tag-based workspace auto-sync that creates operational anchors teams rely on daily
3. **Intelligence** → AI-powered semantic search, content summarization, and predictive recommendations
4. **Governance** → Automated compliance, retention policies, and threat detection
5. **Federation** → Cross-tenant search for MSPs and multi-subsidiary enterprises
6. **Ecosystem** → API marketplace, integrations, white-label options

**But we don't ship this all at once.**

---

## Version Strategy Overview

| Version  | Core Focus                            | Timeline    | Revenue Target | Primary Buyer            | Key Validation Signal               |
| -------- | ------------------------------------- | ----------- | -------------- | ------------------------ | ----------------------------------- |
| **V1**   | Discovery + Workspaces + Basic Search | Weeks 1-10  | $8K-20K MRR    | IT Admin                 | 10-20 paying tenants                |
| **V1.5** | AI+ Content Intelligence              | Months 3-4  | $15K-35K MRR   | IT + Knowledge Workers   | Users request "search inside docs"  |
| **V2**   | Multi-Provider Expansion (Slack)      | Months 5-7  | $30K-60K MRR   | IT + Ops Teams           | Customers ask for Slack visibility  |
| **V3**   | Predictive Analytics + Compliance     | Months 8-12 | $60K-120K MRR  | IT + Compliance Officers | Enterprise deals require governance |
| **V4**   | Federation + Ecosystem                | Year 2+     | $150K-300K MRR | MSPs + Enterprises       | MSPs request multi-tenant features  |

---

## V1: The Sharp Wedge (Weeks 1-10)

### Core Value Proposition

**"See your Microsoft 365 tenant clearly in 10 minutes — and organize what matters without moving a single file."**

### What Ships

✅ **Discovery (The Constellation)**

- M365 metadata scan (SharePoint, Teams, OneDrive)
- V1 data scope: files/documents, containers, ownership, permissions, activity, and metadata signals
- Storage intelligence dashboard
- Waste detection (stale, orphaned, duplicate files)
- Exposure visibility (external shares, guest access)
- Basic remediation (archive, revoke links)
- Explicitly defer SharePoint Lists and SharePoint pages/news from first testable V1

✅ **Workspaces (The Nexus)**

- Workspace creation & asset aggregation
- Tag-based auto-sync rules (THE RETENTION ENGINE)
- User-applied + AI-suggested tags
- Basic intelligence score (metadata quality)
- Workspace activity feed

✅ **Oracle (Basic Metadata Search)**

- Fast metadata search (filename, tags, author, location)
- Advanced filters (provider, date, file type, tags)
- Search history (last 10 queries)

✅ **Infrastructure**

- Microsoft Entra ID authentication (MSAL.js)
- Supabase PostgreSQL with Row-Level Security
- Vercel serverless backend
- Stripe billing (banded tenant pricing)

### Pricing (V1)

- **Starter**: $399/mo (1-250 users)
- **Growth**: $799/mo (251-1,000 users)
- **Scale**: $1,499/mo (1,001-2,500 users)
- **Enterprise**: Custom (2,500+ users)

### Success Metrics

- 10-20 paying tenants in 90 days
- 70%+ complete first scan within 24 hours
- 50%+ create at least 1 workspace within 7 days
- 30%+ set up tag-based sync rules within 14 days

### Key Validation Signal

**If users ask:** "Can't you search inside the document?" or "I can't find what I'm looking for by filename alone"  
**Then:** AI+ content intelligence is validated for V1.5

### Native AI Positioning

V1 should position Aethos as an AI-readiness layer for Microsoft 365. Aethos improves native Copilot outcomes indirectly by making the source tenant cleaner: better ownership, safer permissions, clearer metadata, fewer stale files, and more useful workspace organization.

Do not claim native Microsoft 365 Copilot automatically reads Aethos-side metadata. Direct Copilot visibility requires either approved source-system writeback or a later Microsoft Graph/Copilot connector path.

---

## V1.5: AI+ Content Intelligence (Months 3-4)

### Strategic Rationale

After V1 validation, users will encounter **metadata search limitations**:

- Poorly named files ("Budget_FINAL_v3_REAL.xlsx")
- Content buried in documents (answers hidden in 50-page PDFs)
- No contextual understanding (can't search by concepts, only keywords)

V1.5 introduces **content reading capabilities** as a **paid upgrade tier**.

### What Ships

✅ **AI+ Upgrade Tier** (+$199/mo per tenant)

- Content extraction & indexing (Word, Excel, PowerPoint, PDF)
- Embeddings generation (OpenAI `text-embedding-3-small`)
- Vector storage (Supabase `pgvector` extension)
- Semantic search ("Find budget projections for Q2 2026")
- Content chunk retrieval (show relevant paragraphs)
- AI summarization ("Summarize this 40-page proposal")
- PII detection (flag SSNs, credit cards, email addresses)

✅ **Conversational Oracle Interface**

- Chat-based search ("What was the Q1 marketing budget?")
- Contextual follow-up questions
- Source citations (link to exact page/paragraph)
- Response streaming (progressive text generation)

✅ **Enhanced Discovery**

- Content-based duplicate detection (not just metadata)
- Topic clustering (group similar documents)
- Key entity extraction (people, companies, dates, locations)
- SharePoint pages/news inventory as Published Knowledge
- SharePoint Lists discovery spike focused on list inventory and schema intelligence, not default row-level ingestion

### Data Scope Notes

V1.5 expands from file metadata into content intelligence and published knowledge, but it should not become a full structured-data platform in the same release. SharePoint Lists are likely high-value for clients with mature SharePoint usage, especially AI-readiness work, but the recommended path is staged:

1. Inventory lists by site, owner, item count, modified date, and permissions.
2. Classify list schema and likely business purpose.
3. Flag stale, ownerless, exposed, or business-critical lists.
4. Add row sampling only with explicit customer permission.
5. Defer full searchable row-level ingestion until governance controls are designed.

### Copilot And Native AI Integration Path

V1.5 should make the metadata/classification layer strong enough to support future native-AI integrations:

1. Generate and review Aethos-side metadata suggestions.
2. Let users approve, edit, reject, or block suggestions.
3. Distinguish Aethos-side classification from source-system metadata changes.
4. Identify which approved improvements can write back to Microsoft 365.
5. Prepare a future Microsoft 365 Copilot connector path for curated Aethos intelligence.

This same pattern should guide later Google and Slack expansion: improve source-system clarity first, then expose approved Aethos intelligence through the native connector or agent ecosystem where available.

### Pricing Impact

- **Base tier**: $399/mo (metadata-only, V1 features)
- **AI+ Upgrade**: +$199/mo (content intelligence)
- **Total for AI+ Customer**: $598/mo (Starter + AI+)

### Cost Structure (AI+)

| Component       | Monthly Cost (1,000 users) | Notes                  |
| --------------- | -------------------------- | ---------------------- |
| Embeddings      | $20-40                     | One-time + incremental |
| Semantic search | $5-10                      | Query-based            |
| Summarization   | $15-30                     | GPT-4o-mini, on-demand |
| Vector storage  | $10-20                     | Supabase `pgvector`    |
| **Total COGS**  | **$50-100**                | Margin: 50-66%         |

### Success Metrics

- 30%+ of V1 customers upgrade to AI+ within 60 days
- 10+ "aha moments" per tenant per month (successful semantic searches)
- 80%+ retention for AI+ tier (vs 70% for base tier)

### Key Validation Signal

**If customers say:** "This is finding things I forgot existed" or "Can you do this for Slack too?"  
**Then:** Multi-provider expansion is validated for V2

---

## V2: Multi-Provider Expansion (Months 5-7)

### Strategic Rationale

By V2, customers have validated that Aethos creates **organizational value**. The next pain they'll surface:

> "This is amazing for Microsoft 365, but half our company lives in Slack. Can you do this there too?"

V2 brings **Slack as a Tier 1 Provider** alongside Microsoft 365.

### What Ships

✅ **Slack Integration (Full Bi-Directional)**

- Slack workspace metadata ingestion (channels, DMs, threads)
- Message indexing (with AI+ tier, content embeddings)
- Slack-based workspace aggregation ("Auto-add from #marketing channel")
- Cross-platform workspaces (M365 files + Slack threads in one view)
- Tag-based sync for Slack messages
- Discovery for Slack (inactive channels, large file attachments)

✅ **Universal Workspace Model**

- Workspaces now aggregate: M365 files, Slack channels, Slack threads, Slack files
- Unified activity feed (M365 + Slack events)
- Cross-provider search (search M365 and Slack simultaneously)

✅ **Enhanced Discovery (Slack)**

- Slack storage waste (large attachments duplicated across channels)
- Inactive channel detection (no activity in 90+ days)
- External Slack Connect exposure visibility
- Guest user audit across Slack + M365

✅ **Google Workspace (Shadow Discovery Only - Tier 2)**

- Metadata scan for Google Drive
- Storage waste detection
- External share visibility
- **No full management** (alert & redirect to M365/Slack)
- Positioned as "leakage detection" not primary anchor

### Pricing Impact

- **Slack Add-On**: +$199/mo (includes Slack discovery + workspace aggregation)
- **Google Workspace Add-On**: +$99/mo (shadow discovery only, no AI+)
- **Example Total**: $399 (base) + $199 (AI+) + $199 (Slack) = **$797/mo**

### New Pricing Tiers (Simplified)

- **Base (M365 Only)**: $399-1,499/mo (depending on user count)
- **AI+ Module**: +$199/mo (content intelligence)
- **Slack Module**: +$199/mo (full Slack integration)
- **Google Workspace Module**: +$99/mo (shadow discovery)

### Success Metrics

- 40%+ of V2 customers adopt Slack module within 90 days
- Cross-platform workspaces account for 60%+ of new workspaces
- NPS score improves by 10+ points (from single-provider baseline)

### Key Validation Signal

**If customers say:** "We need to enforce retention policies" or "Can you auto-archive based on rules?"  
**Then:** Compliance automation is validated for V3

---

## V3: Predictive Analytics + Compliance (Months 8-12)

### Strategic Rationale

By V3, Aethos has proven **visibility** (V1), **intelligence** (V1.5), and **cross-platform aggregation** (V2). Enterprise buyers now ask:

> "Can Aethos enforce our retention policies automatically?" or "Can you predict security risks before they happen?"

V3 introduces **governance automation** and **predictive intelligence**.

### What Ships

✅ **Compliance Automation Module**

- Retention policy engine (auto-archive after X days of inactivity)
- Lifecycle workflows (auto-delete soft-deleted items after 30 days)
- Compliance scoring (tenant-level GDPR/HIPAA readiness)
- Audit trail export (immutable log for compliance reviews)
- Policy templates (GDPR, HIPAA, SOC 2, ISO 27001)

✅ **Predictive Analytics Engine**

- Anomaly detection (unusual sharing activity, storage spikes)
- Drift detection (content moving outside operational anchors)
- Budget forecasting (storage cost projections)
- User behavior analytics (identify power users vs inactive users)
- Risk scoring (predict high-exposure artifacts before external share)

✅ **Executive Intelligence Dashboard**

- Tenant health overview (C-suite friendly)
- Cost recovery summary (cumulative savings)
- Compliance posture visualization
- Predictive alerts (upcoming risks/opportunities)
- Exportable reports (PDF, PowerPoint-ready)

✅ **Advanced Remediation Workflows**

- Approval chains (request → review → approve → execute)
- Scheduled remediation (bulk archive every Friday at 11 PM)
- Simulation mode (dry-run before real execution)
- Remediation impact preview (show affected users/teams)

✅ **Box Integration (Tier 2 Provider)**

- Shadow discovery (like Google Workspace)
- Storage waste + exposure visibility
- Alert & redirect strategy (not full management)

### Pricing Impact

- **Compliance Module**: +$299/mo (retention policies, audit trails)
- **Predictive Analytics Module**: +$199/mo (anomaly detection, forecasting)
- **Box Add-On**: +$99/mo (shadow discovery)

### New Customer Segments

- **IT Admin** (primary since V1)
- **Compliance Officer** (new in V3)
- **CFO / Finance Ops** (cost recovery + forecasting)
- **CIO** (executive dashboards)

### Success Metrics

- 25%+ of V3 customers adopt Compliance Module
- 3+ enterprise deals (2,500+ users) closed in 90 days
- $60K-120K MRR by end of month 12

### Key Validation Signal

**If customers say:** "We manage 50 client tenants. Can Aethos work across all of them?" or "Can we white-label this?"  
**Then:** Federation and ecosystem features are validated for V4

---

## V4: Federation + Ecosystem (Year 2+)

### Strategic Rationale

By V4, Aethos is an **established platform** with proven value. Two new buyer personas emerge:

1. **MSPs (Managed Service Providers)** → "We manage 50 Microsoft 365 tenants. Can we see them all in one place?"
2. **Enterprise IT Leaders** → "Can we integrate Aethos with our ITSM tool (ServiceNow)?"

V4 unlocks **multi-tenant federation** and **ecosystem extensibility**.

### What Ships

✅ **Multi-Tenant Federation (MSP Platform)**

- Master dashboard (see all managed tenants)
- Cross-tenant search (find artifacts across customer tenants)
- Tenant comparison (benchmarking across clients)
- Per-tenant billing + reseller margin
- White-label branding (MSP can brand as their own)

✅ **API Marketplace & Integrations**

- Public REST API (developer docs + SDKs)
- Webhook system (real-time event notifications)
- Pre-built integrations:
  - ServiceNow (create tickets from Aethos alerts)
  - Jira (link artifacts to issues)
  - Power BI (export data for custom dashboards)
  - Zapier (low-code automation)
- OAuth 2.0 for third-party apps

✅ **Advanced Enterprise Features**

- Enterprise SSO (SAML, Okta, Auth0)
- Advanced RBAC (custom roles beyond Viewer/Curator/Architect)
- Data residency options (EU, US, APAC)
- Dedicated instances (for ultra-large enterprises)
- SLA guarantees (99.9% uptime, <50ms P50 response time)

✅ **Advanced AI Features**

- Custom LLM fine-tuning (train on tenant-specific patterns)
- Multi-language support (search/summarize in 10+ languages)
- Knowledge graph visualization (entity relationships)
- Conversational workspace creation ("Create a Q1 Budget workspace with all finance docs from last quarter")

### Pricing Impact (V4)

- **MSP Platform**: $2,999/mo (base for 10 tenants) + $199/tenant thereafter
- **API Access**: $499/mo (10,000 API calls/mo) + usage-based overage
- **White-Label**: +$999/mo (custom branding + subdomain)
- **Enterprise SLA**: +$1,999/mo (99.9% uptime, priority support)

### New Customer Segments

- **MSPs** (new primary for V4)
- **Multi-subsidiary enterprises** (Fortune 500 IT departments)
- **Independent Software Vendors (ISVs)** (embed Aethos in their products)

### Success Metrics

- 10+ MSP customers (managing 500+ total tenants)
- 50+ third-party integrations built by ecosystem
- $150K-300K MRR by end of Year 2

---

## Feature Dependency Map

This chart shows how features unlock sequentially:

```
V1: Discovery + Workspaces + Basic Search
    ↓
    ├─> V1.5: AI+ (Content Intelligence)
    │       ↓
    │       ├─> Semantic Search
    │       ├─> Summarization
    │       └─> PII Detection
    ↓
    ├─> V2: Multi-Provider (Slack + Google Workspace)
    │       ↓
    │       ├─> Cross-Platform Workspaces
    │       ├─> Universal Search
    │       └─> Shadow Discovery
    ↓
    ├─> V3: Predictive Analytics + Compliance
    │       ↓
    │       ├─> Retention Policies
    │       ├─> Anomaly Detection
    │       ├─> Executive Dashboards
    │       └─> Advanced Remediation
    ↓
    └─> V4: Federation + Ecosystem
            ↓
            ├─> Multi-Tenant Platform (MSP)
            ├─> API Marketplace
            ├─> White-Label
            └─> Advanced Enterprise Features
```

---

## Revenue Projection Model (2026-2028)

### Assumptions

- Average V1 tenant: $499/mo (blended across tiers)
- 30% adopt AI+ in month 3 → +$199/mo
- 40% adopt Slack module in V2 → +$199/mo
- 25% adopt Compliance module in V3 → +$299/mo
- 10% churn annually (90% retention)

### Growth Trajectory

| Timeline     | Version         | Paying Tenants | Avg MRR/Tenant | Total MRR | Annual Run Rate |
| ------------ | --------------- | -------------- | -------------- | --------- | --------------- |
| **Month 3**  | V1 Launch       | 15             | $499           | $7,485    | $90K            |
| **Month 6**  | V1.5 (AI+)      | 35             | $598           | $20,930   | $251K           |
| **Month 9**  | V2 (Slack)      | 60             | $747           | $44,820   | $538K           |
| **Month 12** | V3 (Compliance) | 100            | $896           | $89,600   | $1.07M          |
| **Month 18** | V3 Expansion    | 180            | $946           | $170,280  | $2.04M          |
| **Month 24** | V4 (Federation) | 300            | $1,046         | $313,800  | $3.77M          |

**Note:** These are optimistic targets. Adjust based on early validation signals.

---

## Go/No-Go Decision Points

Each version has a **validation gate** before proceeding to the next:

### V1 → V1.5 Decision Point (Month 3)

**Go Criteria:**

- ✅ 10+ paying tenants
- ✅ 70%+ retention after 60 days
- ✅ Users explicitly request "search inside documents" or complain about metadata-only limitations

**No-Go Signal:**

- ❌ <5 paying tenants after 90 days
- ❌ Users don't engage with search (low query volume)
- ❌ Churn >30% in first 60 days

**If No-Go:** Revisit V1 positioning, improve discovery ROI messaging, extend V1 phase

---

### V1.5 → V2 Decision Point (Month 4)

**Go Criteria:**

- ✅ 30%+ AI+ adoption rate
- ✅ Users request Slack/Google Workspace integration
- ✅ Cross-platform use cases validated (customers manually link Slack threads in workspaces)

**No-Go Signal:**

- ❌ <10% AI+ adoption (price sensitivity or low perceived value)
- ❌ No customer requests for additional providers
- ❌ Customers satisfied with M365-only solution

**If No-Go:** Reduce AI+ pricing, improve content search UX, extend V1.5 phase

---

### V2 → V3 Decision Point (Month 7)

**Go Criteria:**

- ✅ 40%+ Slack module adoption
- ✅ Enterprise deals (2,500+ users) in pipeline requiring compliance features
- ✅ Users request automated retention policies

**No-Go Signal:**

- ❌ <20% Slack adoption (provider expansion not valued)
- ❌ No enterprise pipeline (mid-market only)
- ❌ Customers don't mention governance pain

**If No-Go:** Improve Slack integration depth, focus on mid-market expansion, defer V3

---

### V3 → V4 Decision Point (Month 12)

**Go Criteria:**

- ✅ 25%+ Compliance module adoption
- ✅ MSP or multi-tenant requests (3+ inquiries)
- ✅ $60K+ MRR with healthy unit economics

**No-Go Signal:**

- ❌ <10% Compliance adoption (governance not valued)
- ❌ No MSP interest
- ❌ Negative cash flow (COGS >70% of revenue)

**If No-Go:** Optimize V3 pricing, focus on vertical expansion (healthcare, finance), defer V4

---

## Strategic Risks & Contingencies

### Risk 1: Microsoft Expands Native Features

**Scenario:** Microsoft releases unified admin dashboard with workspace-like features

**Mitigation:**

- Emphasize **operational clarity narrative** (not just tooling)
- Lean into **tag-based auto-sync** (hard for Microsoft to replicate quickly)
- Position as "usability layer" on top of Microsoft (complement, not compete)

**Contingency:**

- Accelerate Slack/Google Workspace expansion (multi-provider moat)
- Pivot to MSP platform (manage multiple tenants)

---

### Risk 2: Slow V1 Adoption

**Scenario:** <5 paying tenants after 90 days

**Mitigation:**

- Offer extended trial (30 days instead of 14)
- Reduce entry price (launch at $299/mo for Starter tier)
- Partner with Microsoft consultants (reseller channel)

**Contingency:**

- Pivot to **vertical-specific version** (e.g., Aethos for Healthcare, targeting HIPAA compliance)
- Shift to **services-led model** (sell managed cleanup as service, Aethos as tool)

---

### Risk 3: AI+ Costs Too High

**Scenario:** COGS >70% due to embedding + summarization costs

**Mitigation:**

- Batch processing (embed only on-demand, not all artifacts)
- Use cheaper models (GPT-4o-mini instead of GPT-4)
- Offer usage-based pricing (e.g., $199/mo + $0.10/semantic search)

**Contingency:**

- Remove real-time summarization (batch nightly instead)
- Limit AI+ to Enterprise tier only (higher margin customers)

---

### Risk 4: Compliance Features Commoditized

**Scenario:** Governance vendors (ShareGate, Syskit) add workspace features

**Mitigation:**

- Emphasize **user experience** and **operational clarity framing** (not admin-heavy)
- Accelerate **predictive analytics** (harder to replicate)
- Build **switching cost** via tag intelligence and habit formation

**Contingency:**

- Focus on **SMB/mid-market** (governance tools target enterprise)
- Lean into **AI+ differentiation** (semantic search not common in governance tools)

---

## Success Playbook Summary

### V1 (Months 1-3): Prove the Wedge

**Goal:** 10-20 paying tenants  
**Strategy:** Discovery as hook, Workspaces as retention  
**Key Metric:** Tag-based sync rule adoption (30%+ of tenants)

### V1.5 (Months 3-4): Validate AI Value

**Goal:** 30%+ AI+ adoption rate  
**Strategy:** Offer as upgrade after metadata search friction surfaces  
**Key Metric:** AI+ retention vs base tier (10%+ higher)

### V2 (Months 5-7): Expand the Anchor

**Goal:** 40%+ Slack module adoption  
**Strategy:** Cross-platform workspaces as core value prop  
**Key Metric:** Customers with M365 + Slack > M365-only churn

### V3 (Months 8-12): Land Enterprise Deals

**Goal:** 3+ enterprise contracts (2,500+ users)  
**Strategy:** Compliance automation + predictive analytics as differentiators  
**Key Metric:** $60K+ MRR, expansion revenue >40% of new revenue

### V4 (Year 2+): Build the Ecosystem

**Goal:** 10+ MSP customers, 50+ integrations  
**Strategy:** Platform play, API marketplace, white-label  
**Key Metric:** Ecosystem-driven ARR >20% of total ARR

---

## Final Strategic Guidance

Aethos has a **category-defining vision**, but category-defining companies don't launch fully formed.

They launch a **sharp wedge** (V1), then expand methodically:

1. **V1**: Prove visibility + organization = daily value
2. **V1.5**: Add intelligence when users hit limitations
3. **V2**: Expand platforms when customers ask for Slack
4. **V3**: Add governance when enterprise pipeline requires it
5. **V4**: Build ecosystem when scale demands it

**Discipline beats ambition.**

Ship V1 in 8-10 weeks. Let the market pull you toward V2, V3, V4.

---

**Prepared for:** Aethos Founder / Product Lead  
**Status:** Strategic Roadmap Complete  
**Next Step:** Execute V1 Spec → Validate → Expand
