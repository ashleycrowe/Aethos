# Aethos Operational Guidelines

## 🎯 Architecture Philosophy (Updated 2026-02-26)
**Current State**: Simplified free-tier architecture (Vercel + Supabase)
**Future State**: Azure enterprise architecture (when >1,000 tenants or enterprise deals require it)
**See**: `/docs/SIMPLIFIED_ARCHITECTURE.md` for current implementation, `/docs/AZURE_MIGRATION_PLAYBOOK.md` for future migration plan

## General Core Principles
- **Operational Clarity**: Every UI element must contribute to clarity, not noise. Avoid "Security Janitor" language (e.g., "Risk Detected"). Use "Operational Architect" language (e.g., "Operational Inefficiency Identified").
- **Cinematic Glassmorphism**: Use the "Aethos Glass" style. Backgrounds must be deep space (#0B0F19). Use 70-95% opacity for cards with heavy backdrop blur (12px+).
- **Universal Adapter Pattern (Tiered Strategy)**: 
    - **Tier 1 (Core Synthesis)**: Microsoft 365 & Slack. Full bi-directional management. These are the "Operational Anchors."
    - **Tier 2 (Shadow Discovery)**: Google Workspace, Box, Local. Focused on identification of leakage and storage waste. Remediation is "Alert & Redirect" rather than full management. Use these to find "Dead Capital" outside the core.

## Technology Stack (Simplified Architecture)
- **Frontend**: React 18 + Vite + Tailwind CSS v4 (deployed on Vercel)
- **Backend**: Vercel Serverless Functions (Node.js + Express)
- **Database**: Supabase PostgreSQL with Row-Level Security (RLS)
- **Authentication**: Microsoft Entra ID via MSAL.js (delegated permissions)
- **State Management**: React Context API (no Redux/Zustand)
- **Build Time**: 30-60 seconds (Vercel incremental builds)
- **Cost**: $0-5/month for MVP (0-100 tenants), $45-70/month for growth (100-500 tenants)

## Data Architecture
- **Multi-Tenant by Design**: Every database table has `tenant_id` for isolation
- **Row-Level Security**: PostgreSQL RLS policies enforce tenant boundaries
- **Metadata-Only Storage**: Never store file contents, only metadata pointers
- **GDPR Compliance**: `/api/tenant/:id/purge` deletes all tenant data

## Design System Guidelines
> **📘 Complete Design Reference**: See `/docs/MASTER_DESIGN_GUIDE.md` for comprehensive design system documentation including component specs, interaction patterns, animation guidelines, and accessibility standards.

- **Primary Action (Starlight Cyan)**: Use `#00F0FF` for all primary CTA, growth indicators, and active sync states.
- **Alert/Waste (Supernova Orange)**: Use `#FF5733` for storage waste, orphaned containers, and high-exposure risks.
- **Narrative Logic Layer**: Never show raw technical calculations by default. Hide them behind the `Cpu` or `Info` icon. Provide a "Story" version of every metric.

## Component Specifics
- **UniversalCard**: Must always have a "Deconstruct Intelligence" button leading to the drill-down view.
- **PulseFeed**:
  - Mixes manual "Blast" comms with automated "Operational Alerts."
  - Every update must support "Engagement Loops" (Like, Share, Comment).
  - High-resolution media (Work-Instagram) must use the "Aethos Cinematic Frame" (rounded corners, subtle glow).
- **MetricDeepDive**:
  - Always include "Snapshot Analytics" (the quick look).
  - Always provide a path to the "Universal Forensic Lab."
  - Logic must be interactive (Hover to see Story vs Calculation).

## Social & Communication Protocol (The Pulse)
### 1. The Communicator Role
- **Global Communicator**: Can blast to the entire tenant.
- **Workspace Communicator**: Restricted to specific "Pulse Channels" linked to their workspace.
- **Cross-Platform Sync**: Blasts are "Universal Adapters"—one Aethos post maps to Teams, Slack, and SharePoint News simultaneously.

### 2. Engagement Metadata
- **Badges**: Use "Operational Merit" badges. Automated triggering occurs when architects achieve high-impact outcomes:
  - **Waste Warrior**: Triggered after recovering 500GB+ of dead capital in one protocol execution.
  - **Clarity Architect**: Triggered when a workspace is initialized with an Intelligence Score > 90%.
  - **Oracle Sage**: Triggered after 5 successful intelligence federations via the Oracle engine.
  - **Identity Anchor**: Triggered upon manual reconciliation of 3+ provider identities.
- **Threads**: Support infinitely nested conversations for architectural review.
- **Media**: Work-Instagram style feed for operational visual records.

## Remediation Protocols (Universal Adapter Pattern)
"Archive" and "Delete" actions are provider-specific to ensure operational integrity.

### 1. The Archival Spectrum
- **Microsoft 365**: Container set to `Read-Only`. Metadata preserved. URL remains active.
- **Google Workspace**: Artifact moved to `[Aethos_Archive]` Shared Drive. Permissions revoked.
- **Slack**: Native channel archiving. Searchable but non-interactive.
- **Box**: Artifact moved to `Governance_Vault`. File locked.
- **Local/Blob**: Moved to `Cold_Tier` storage.

### 2. Deletion Logic
- **Sync**: Instruction is sent to the source.
- **Soft-Gate**: Defaults to `Soft-Delete` (Trash) for 30 days unless `Deep_Purge` is initialized.
- **Permissions**: `AUDITOR` (Simulate), `CURATOR` (Archive), `ARCHITECT` (Delete).

## Intelligence Stream Standard
- **Operational Insight Pattern**: Notifications must follow the "Insight -> Narrative -> Action" pattern. Use "Intelligence Stream" terminology.
- **Priority Signaling**: 
    - **Critical/High**: Supernova Orange pulse. Immediate Architect notification.
    - **Medium/Low**: Starlight Cyan or Slate. Batch into daily summaries.
- **Narrative Requirement**: Every notification must answer "Why does this matter for operational clarity?"

## Development Governance
- **Standards Referral**: All standards now live in `/docs/3-standards/` (CANONICAL). Before implementing any new feature, refer to:
  - `/docs/3-standards/README.md` - Complete standards index
  - `/docs/3-standards/STD-*.md` - Individual standards (24 active standards)
  - `/docs/CONSOLIDATED_STANDARDS.md` - Legacy reference (use /docs/3-standards/ instead)
- **Architecture Referral**: All backend integration must follow `/docs/2-ARCHITECTURE/SIMPLIFIED_ARCHITECTURE.md` patterns
- **Notification-First Design**: Design the notification trigger and lifecycle *simultaneously* with the feature development.
- **Database Migrations**: Always test migrations locally before running in Supabase production

## Performance Targets (Simplified Stack)
- **Lighthouse Score**: ≥90 (Performance, Accessibility, Best Practices)
- **Bundle Size**: <300KB gzipped for initial load
- **Time to Interactive**: <3 seconds on 3G
- **API Response Time**: <100ms P50, <300ms P99 (slower than Azure but acceptable)
- **Database Queries**: Use indexes, avoid N+1 queries, leverage Supabase connection pooling

## Security Requirements
- **Environment Variables**: All secrets in `.env` files (never commit to Git)
- **MSAL Authentication**: Microsoft Entra ID for M365 integration (delegated permissions)
- **Row-Level Security**: Enforced at database level via Supabase RLS policies
- **HTTPS Only**: Automatic with Vercel (Let's Encrypt SSL)
- **CORS**: Configured in backend for frontend domain only

## Deployment Process
- **Development**: Push to `feature/*` branch → Auto-deploy to Vercel preview URL
- **Staging**: Merge to `develop` → Auto-deploy to staging.aethos.com
- **Production**: Merge to `main` → Auto-deploy to app.aethos.com
- **Rollback**: One-click rollback in Vercel dashboard (instant)
- **Database**: Migrations run manually via Supabase SQL Editor

## Migration Plan to Azure (Future)
**Trigger Conditions**: Monthly revenue >$50K OR active tenants >1,000 OR enterprise deals require Azure
**Timeline**: 3-6 months migration effort
**See**: `/docs/AZURE_MIGRATION_PLAYBOOK.md` for complete migration strategy
**Decision Status**: See DECISION-LOG.md entry DEC-TEC-006 (Assumed decision pending team verification)

---

**Note**: Some of the base components you are using may have styling (e.g., gap/typography) baked in as defaults. Make sure you explicitly set any styling information from the guidelines in the generated React to override the defaults.