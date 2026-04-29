# Aethos V1 Product Specification
**Version:** 1.0 (Launch Target)  
**Timeline:** 8-10 weeks from kickoff  
**Status:** Strategic Alignment Complete  
**Last Updated:** 2026-02-27

---

## Executive Summary

Aethos V1 is the **Operational Clarity Layer for Microsoft 365**.

It is **not**:
- A compliance suite
- An AI copilot competitor
- An enterprise search platform
- An eDiscovery tool

It **is**:
- A visibility engine that shows hidden waste and exposure
- A cleanup accelerator that recovers dead capital
- An organizational anchor layer that creates daily-use value

### Core Value Proposition
**"See your Microsoft 365 tenant clearly in 10 minutes — and organize what matters without moving a single file."**

### Primary Buyer Persona
**IT Director / Microsoft 365 Administrator**  
Company size: 500-2,000 employees  
Pain: Storage sprawl, fragmented visibility, no unified organization layer

### Strategic Wedge
1. **Discovery** (The Hook) - 10-minute clarity scan showing waste, exposure, and stale content
2. **Workspaces** (The Retention Engine) - Tag-based auto-sync that creates daily organizational value
3. **Oracle** (The Search Foundation) - Fast metadata search to validate intelligence enrichment

---

## V1 Scope: What Ships

### 1. The Constellation (Discovery Module)

#### Core Features ✅
- **Microsoft 365 Metadata Scan**
  - SharePoint sites, document libraries, Teams files
  - OneDrive user storage
  - Metadata-only ingestion (no content reading)
  - Enriched with AI pattern matching (titles, suggested tags, categories)

- **Storage Intelligence Dashboard**
  - Total storage used vs allocated
  - Storage by site/team/user
  - Trend visualization (7-day, 30-day, 90-day)
  - "Dead Capital" calculation (recoverable storage)

- **Waste Detection**
  - Stale files (no activity in 180+ days)
  - Orphaned content (owner inactive/departed)
  - Duplicate detection (by hash + metadata similarity)
  - Large files report (>100MB threshold)

- **Exposure Visibility**
  - External sharing count (by link type: anonymous, specific people, organization)
  - Public link inventory
  - Guest user access map
  - Risk scoring by exposure level (Low/Medium/High)

- **Basic Remediation**
  - Bulk archive to read-only (admin approval required)
  - Revoke external link (batch operation)
  - Move to archive location (within M365)
  - Deletion recommendations (soft-delete only)

#### Intelligence Enrichment
- **AI Metadata Enhancement**
  - Title normalization (e.g., "Budget_Q1_FINAL_v3_REAL.xlsx" → "Q1 2026 Budget")
  - Suggested tags based on filename/location patterns (not content)
  - Category prediction (Budget, Marketing, HR, Engineering, etc.)
  - Intelligence Score (0-100) based on metadata quality

- **Weekly Discovery Report** (Basic)
  - New stale content identified
  - Storage trend summary
  - New external shares detected
  - Recommendations (top 3 cleanup opportunities)

#### What's NOT in V1 Discovery
❌ Predictive anomaly detection  
❌ PII content scanning (requires content reading)  
❌ Compliance policy automation  
❌ Advanced threat detection  
❌ Multi-provider federation (Slack, Box, Google Workspace deferred to V2)

---

### 2. The Nexus (Workspaces Module)

#### Core Features ✅
- **Workspace Creation**
  - Manual workspace initialization
  - Name, description, icon selection
  - Workspace-level permissions (Creator, Contributor, Viewer)

- **Asset Aggregation**
  - Add M365 artifacts manually (via search or browse)
  - Display unified card view (file, site, team, channel)
  - Show source provider (SharePoint, Teams, OneDrive)
  - Link back to original location (no file duplication)

- **Tag-Based Auto-Sync Rules** (The Retention Engine)
  - Create sync rules: "Auto-add artifacts tagged with [Budget] to this workspace"
  - Location-based rules: "Auto-add artifacts from [Marketing Team] site"
  - Combination logic: Tags AND/OR Location
  - Real-time sync (on metadata refresh)
  - Rule priority management

- **Tag Management System**
  - User-applied tags (add/remove/bulk operations)
  - AI-suggested tags (one-click accept/reject)
  - Tag taxonomy browser (all tags across tenant)
  - Tag usage analytics (which tags are most used)

- **Basic Intelligence Score**
  - Workspace completeness indicator (0-100%)
  - Based on: metadata quality, tag coverage, recent activity
  - Visual progress bar with "Improve Score" suggestions

- **Workspace Feed**
  - Recent activity stream (artifacts added, tags applied, members joined)
  - Basic filtering (last 7 days, last 30 days, all time)

#### What's NOT in V1 Workspaces
❌ Protocol templates (pre-configured workspace blueprints)  
❌ Advanced intelligence scoring with predictive analytics  
❌ Cross-provider deep automation (Slack channels + SharePoint sites)  
❌ Workspace-level analytics dashboards  
❌ Nested workspace hierarchies  
❌ Workspace cloning/templating

---

### 3. The Oracle (Metadata Search Only)

#### Core Features ✅
- **Fast Metadata Search**
  - Search across all ingested M365 metadata
  - Search fields: filename, enriched title, tags, author, location, description
  - Boolean operators (AND, OR, NOT)
  - Instant results (<100ms response time target)

- **Search Filters**
  - Provider (SharePoint, Teams, OneDrive)
  - Date modified (last 7/30/90 days, custom range)
  - Author/Owner
  - File type (Word, Excel, PDF, PowerPoint, etc.)
  - Tags (multi-select)
  - Location (site/team/folder path)
  - Intelligence Score range (0-100)

- **Search Results Display**
  - Enriched title (AI-improved)
  - Original filename (hover to view)
  - Tags (clickable to filter)
  - Last modified date
  - Author
  - Location breadcrumb
  - Quick actions: Open in M365, Add to Workspace, View Details

- **Search History**
  - Last 10 searches stored per user
  - Quick re-run of previous searches

#### What's NOT in V1 Oracle
❌ Content embeddings (semantic search)  
❌ Content chunk storage (full-text search inside documents)  
❌ AI summarization ("Summarize this document")  
❌ Question answering ("What was the Q1 budget?")  
❌ PII detection in content  
❌ Conversational search interface (defer to V1.5)  
❌ Predictive search suggestions based on behavior

**V1 Oracle Strategy:**  
If users complain about missing contextual results or ask "Can't you search inside the document?", that **validates AI+ as V2 expansion**.

---

### 4. Core Infrastructure & Authentication

#### Authentication ✅
- **Microsoft Entra ID (Azure AD) via MSAL.js**
  - Delegated permissions only (no admin consent required for pilot)
  - OAuth 2.0 authorization code flow
  - Tenant isolation enforced at auth layer

#### Required M365 API Permissions
- `Sites.Read.All` (SharePoint metadata)
- `Files.Read.All` (OneDrive/Teams files metadata)
- `User.Read.All` (user directory for ownership mapping)
- `Group.Read.All` (Teams metadata)

#### Database Schema (Supabase PostgreSQL)
- **Core Tables**:
  - `tenants` (tenant_id, name, m365_tenant_id, created_at, subscription_tier)
  - `users` (user_id, tenant_id, email, role, created_at)
  - `artifacts` (artifact_id, tenant_id, provider, name, enriched_name, path, owner, tags, intelligence_score, metadata_json, last_modified, created_at)
  - `workspaces` (workspace_id, tenant_id, name, description, creator_id, created_at)
  - `workspace_artifacts` (workspace_id, artifact_id, added_by, added_at)
  - `workspace_sync_rules` (rule_id, workspace_id, type, criteria_json, priority, enabled, created_at)
  - `tags` (tag_id, tenant_id, name, usage_count, created_at)
  - `artifact_tags` (artifact_id, tag_id, applied_by, applied_at)
  - `discovery_scans` (scan_id, tenant_id, status, started_at, completed_at, metadata_json)

- **Row-Level Security (RLS)**
  - All tables enforce `tenant_id` isolation
  - User role-based access (Viewer, Curator, Architect, Admin)

#### Backend Architecture (Vercel Serverless Functions)
- **API Endpoints**:
  - `/api/auth/login` - Microsoft OAuth redirect
  - `/api/auth/callback` - OAuth callback handler
  - `/api/discovery/scan` - Trigger M365 metadata scan
  - `/api/discovery/status` - Check scan progress
  - `/api/discovery/dashboard` - Get storage/waste/exposure metrics
  - `/api/workspaces` - CRUD operations
  - `/api/workspaces/:id/sync` - Execute sync rules
  - `/api/artifacts/search` - Metadata search
  - `/api/tags` - Tag management
  - `/api/remediation/archive` - Bulk archive operation

#### AI Metadata Enrichment
- **Provider**: OpenAI GPT-4o-mini (cost-optimized)
- **Batch Processing**: Enrich metadata in 100-artifact batches
- **Enrichment Fields**:
  - `enriched_title` (cleaned, normalized title)
  - `suggested_tags[]` (array of 3-5 contextual tags)
  - `category` (Budget, Marketing, HR, Engineering, Legal, etc.)
  - `intelligence_score` (0-100, based on metadata completeness)

- **Cost Management**:
  - Enrichment only on initial scan + new artifacts
  - No re-enrichment unless user manually triggers
  - Estimated cost: $0.10-0.30 per 1,000 artifacts

---

### 5. User Interface Components

#### Core UI Elements ✅
- **Dashboard (Home)**
  - Tenant health overview
  - Storage utilization chart
  - Recent discovery alerts (waste, exposure)
  - Quick action cards (Run Scan, Create Workspace, Search)

- **Discovery View (Constellation)**
  - Storage breakdown (pie chart + tree map)
  - Waste detection table (sortable, filterable)
  - Exposure inventory (external shares grid)
  - Remediation action panel

- **Workspaces View (Nexus)**
  - Workspace grid (card layout)
  - Workspace detail view (artifact list, sync rules, activity feed)
  - Tag-based sync rule builder (visual rule editor)
  - Bulk tag editor

- **Search View (Oracle)**
  - Full-width search bar
  - Filter panel (collapsible sidebar)
  - Results grid with quick actions
  - Result detail modal

- **Settings**
  - Tenant settings (scan frequency, retention policies)
  - User management (invite, roles)
  - Billing & subscription
  - API access logs

#### Design System Adherence
- **Cinematic Glassmorphism** (Aethos Glass style)
  - Deep space backgrounds (#0B0F19)
  - 70-95% opacity cards with 12px+ backdrop blur
  - Starlight Cyan (#00F0FF) for primary actions
  - Supernova Orange (#FF5733) for alerts/waste indicators

- **Operational Clarity Language**
  - "Operational Inefficiency Identified" (not "Risk Detected")
  - "Dead Capital" (not "Wasted Storage")
  - "Intelligence Score" (not "Data Quality Score")

---

### 6. Billing & Subscription Management

#### Pricing Model (Banded Tenant Pricing) ✅
| Tier | User Count | Monthly Price | Annual Price (15% discount) |
|------|-----------|---------------|----------------------------|
| Starter | 1-250 | $399/mo | $407/mo ($4,888/yr) |
| Growth | 251-1,000 | $799/mo | $679/mo ($8,148/yr) |
| Scale | 1,001-2,500 | $1,499/mo | $1,274/mo ($15,288/yr) |
| Enterprise | 2,500+ | Custom | Custom |

#### Payment Processing
- **Stripe integration** (standard for SaaS)
- Self-service checkout for Starter/Growth tiers
- Sales-assisted for Scale/Enterprise

#### Trial Model
- **14-day free trial** (no credit card required)
- Full feature access during trial
- Automatic scan upon signup (the "aha moment")

#### Subscription Features
- Automatic tenant size detection (user count via M365 API)
- Auto-upgrade prompt if user count exceeds tier
- Billing portal (powered by Stripe Customer Portal)
- Invoice generation for annual contracts

---

### 7. Deployment & Distribution

#### Hosting ✅
- **Frontend**: Vercel (React + Vite + Tailwind CSS v4)
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Supabase (PostgreSQL with RLS)
- **CDN**: Vercel Edge Network (automatic)
- **SSL**: Let's Encrypt (automatic via Vercel)

#### Distribution Channels
- **Microsoft AppSource** (primary channel)
  - List as "Productivity Tool"
  - Target: IT Admins, Microsoft 365 Administrators
  - Messaging: "Operational Clarity for Microsoft 365 in 10 Minutes"

- **Direct Website** (aethos.com)
  - Self-service signup
  - Lead with "Run Your 10-Minute Clarity Scan" CTA
  - ROI calculator (storage waste × cost per GB)

#### Deployment Process
- **Development** → Push to `feature/*` → Auto-preview on Vercel
- **Staging** → Merge to `develop` → Deploy to staging.aethos.com
- **Production** → Merge to `main` → Deploy to app.aethos.com
- **Rollback** → One-click rollback in Vercel dashboard

---

## V1 Non-Goals (Explicitly Deferred)

The following are **strategically deferred** to V2+ to maintain focus and reduce time-to-market:

### Deferred to V2 (Phase 1.5)
❌ AI+ Content Reading (embeddings, semantic search, summarization)  
❌ PII Detection (requires content access)  
❌ Slack integration (discovery + workspaces)  
❌ Google Workspace integration  
❌ Conversational Oracle interface (chat-based search)

### Deferred to V3
❌ Predictive analytics (anomaly detection, forecasting)  
❌ Compliance automation (policy enforcement, retention rules)  
❌ Executive intelligence dashboards  
❌ Advanced threat detection  
❌ Box integration  
❌ Protocol templates (workspace blueprints)

### Deferred to V4
❌ Multi-tenant federation (cross-tenant search for MSPs)  
❌ API marketplace (third-party integrations)  
❌ White-label solution  
❌ Enterprise SSO (SAML, Okta, etc.)

---

## Success Metrics (V1)

### Acquisition Metrics
- **10-20 paying tenants** in first 90 days
- **50+ trial signups** in first 60 days
- **20% trial → paid conversion rate**

### Engagement Metrics
- **70%+ of tenants complete first scan** within 24 hours of signup
- **50%+ of tenants create at least 1 workspace** within 7 days
- **30%+ of tenants set up tag-based sync rules** within 14 days

### Retention Metrics
- **80%+ monthly retention** after month 3
- **Average session duration: 8+ minutes**
- **3+ logins per user per week**

### Product Validation Signals
- **User complaints about missing content search** → Validates AI+ for V2
- **Requests for Slack/Google Workspace** → Validates multi-provider expansion
- **Requests for compliance features** → Validates governance module for V3

---

## Go-To-Market (V1 Launch)

### Launch Messaging
**Homepage Headline:**  
"Bring Operational Clarity to Microsoft 365."

**Subheadline:**  
"See hidden storage waste. Find external sharing risks. Create curated Workspaces across Teams and SharePoint — without moving a single file."

**Primary CTA:**  
"Run Your 10-Minute Clarity Scan"

### Target Channels
1. **Microsoft AppSource** (submit 2 weeks before launch)
2. **LinkedIn Outbound** (IT Directors at 500-2,000 employee companies)
3. **Product Hunt** (launch day announcement)
4. **Direct outreach** (warm network, Microsoft partner ecosystem)

### Launch Timeline
- **Week 1-2**: Private beta (5-10 friendly tenants)
- **Week 3-4**: Public beta (open signups, no credit card)
- **Week 5-6**: AppSource submission + review
- **Week 7-8**: Full launch with paid tiers

---

## Technical Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| M365 API rate limits | Medium | High | Implement exponential backoff, batch processing, respect throttling headers |
| Metadata enrichment cost overrun | Low | Medium | Batch processing, one-time enrichment per artifact, use GPT-4o-mini (cheapest) |
| Supabase RLS complexity | Medium | High | Thorough testing, database migrations version-controlled, RLS policies peer-reviewed |
| AppSource approval delay | High | Low | Submit early, follow guidelines strictly, have backup direct-sales plan |
| Tag-based sync performance | Medium | Medium | Index `artifact_tags` table, limit sync frequency to 15-min intervals, async processing |

---

## Development Timeline (8-10 Weeks)

### Week 1-2: Foundation
- Vercel + Supabase setup
- MSAL.js authentication flow
- Database schema + RLS policies
- M365 API integration (read metadata)

### Week 3-4: Discovery Module
- Metadata ingestion pipeline
- Storage intelligence dashboard
- Waste detection logic
- Basic remediation actions

### Week 5-6: Workspaces Module
- Workspace CRUD
- Asset aggregation
- Tag management system
- Tag-based sync rules engine

### Week 7-8: Oracle + Polish
- Metadata search engine
- Search filters + results display
- AI metadata enrichment integration
- UI/UX polish across all modules

### Week 9-10: Launch Prep
- Stripe integration + billing
- AppSource submission
- Documentation + help center
- Beta testing + bug fixes

---

## Conclusion

Aethos V1 is a **sharply focused product** that delivers:

1. **Immediate ROI** (waste visibility + recovery)
2. **Clear differentiation** (tag-based workspace auto-sync)
3. **Low buyer friction** (metadata-only, no migration)
4. **Expansion foundation** (proven engagement before AI+)

By deferring AI+ content features, predictive analytics, and multi-provider depth to V2+, we maximize:
- **Speed to market** (8-10 weeks vs 6-9 months)
- **Product-market fit validation** (real user feedback)
- **Strategic optionality** (expand based on demand signals)

**The wedge is sharp. The vision remains intact. The sequencing maximizes survival probability.**

---

**Prepared for:** Aethos Founder / Product Lead  
**Status:** Ready for Development Kickoff  
**Next Step:** Review → Approve → Execute
