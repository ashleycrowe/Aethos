# Aethos Feature Matrix
**Version-Gated Feature Reference**  
**Last Updated:** 2026-02-27

This document serves as the **single source of truth** for which features are available in which product versions. Use this when developing version-gated components.

---

## Quick Reference

| Version | Release Target | Primary Focus | Feature Count |
|---------|----------------|---------------|---------------|
| **V1** | Weeks 1-10 | Discovery + Workspaces + Basic Search | 9 core features |
| **V1.5** | Months 3-4 | AI+ Content Intelligence | +8 features |
| **V2** | Months 5-7 | Multi-Provider Expansion | +7 features |
| **V3** | Months 8-12 | Predictive Analytics + Compliance | +11 features |
| **V4** | Year 2+ | Federation + Ecosystem | +11 features |

---

## Feature Availability Matrix

### Legend
- ✅ **Available** - Feature is fully enabled
- ❌ **Not Available** - Feature is disabled/hidden
- 🔜 **Coming Soon** - Documented but not yet implemented

---

## V1 Core Features (Metadata Intelligence Layer)

| Feature | V1 | V1.5 | V2 | V3 | V4 | Component Reference |
|---------|----|----|----|----|-----|---------------------|
| **Discovery (The Constellation)** | ✅ | ✅ | ✅ | ✅ | ✅ | `IntelligenceDashboard` |
| **Workspaces (The Nexus)** | ✅ | ✅ | ✅ | ✅ | ✅ | `WorkspaceEngine` |
| **Basic Search (The Oracle)** | ✅ | ✅ | ✅ | ✅ | ✅ | `OracleSearchBridgeV2` |
| **Tag-Based Sync** | ✅ | ✅ | ✅ | ✅ | ✅ | `WorkspaceEngine` (sync rules) |
| **Storage Intelligence** | ✅ | ✅ | ✅ | ✅ | ✅ | `IntelligenceDashboard` (storage tab) |
| **Exposure Visibility** | ✅ | ✅ | ✅ | ✅ | ✅ | `IntelligenceDashboard` (exposure tab) |
| **Basic Remediation** | ✅ | ✅ | ✅ | ✅ | ✅ | `RemediationCenter` |
| **AI Metadata Enrichment** | ✅ | ✅ | ✅ | ✅ | ✅ | Backend service (title/tags) |
| **Weekly Reports** | ✅ | ✅ | ✅ | ✅ | ✅ | `ReportingCenter` |

**V1 Summary:**
- Microsoft 365 only (SharePoint, Teams, OneDrive)
- Metadata-only (no content reading)
- Tag-based workspace auto-sync (the retention engine)
- Basic remediation (archive, revoke links)

---

## V1.5 Features (AI+ Content Intelligence Upgrade)

| Feature | V1 | V1.5 | V2 | V3 | V4 | Component Reference | Pricing Impact |
|---------|----|----|----|----|-----|---------------------|----------------|
| **AI Content Search** | ❌ | ✅ | ✅ | ✅ | ✅ | `OracleSearchBridgeV2` (AI mode) | +$199/mo |
| **Semantic Search** | ❌ | ✅ | ✅ | ✅ | ✅ | `OracleSearchBridgeV2` (vector search) | Included in AI+ |
| **Summarization** | ❌ | ✅ | ✅ | ✅ | ✅ | `OracleSearchBridgeV2` (doc summary) | Included in AI+ |
| **PII Detection** | ❌ | ✅ | ✅ | ✅ | ✅ | `IntelligenceDashboard` (PII alerts) | Included in AI+ |
| **Content Chunk Retrieval** | ❌ | ✅ | ✅ | ✅ | ✅ | `OracleSearchBridgeV2` (snippets) | Included in AI+ |
| **Conversational Oracle** | ❌ | ✅ | ✅ | ✅ | ✅ | `OracleSearchBridgeV2` (chat mode) | Included in AI+ |
| **Topic Clustering** | ❌ | ✅ | ✅ | ✅ | ✅ | `IntelligenceDashboard` (clusters) | Included in AI+ |
| **Entity Extraction** | ❌ | ✅ | ✅ | ✅ | ✅ | Artifact detail view (entities) | Included in AI+ |

**V1.5 Summary:**
- Content reading & indexing (Word, Excel, PowerPoint, PDF)
- Vector embeddings for semantic search
- AI summarization on demand
- PII detection (SSN, credit cards, emails)
- Pricing: Base tier + $199/mo

---

## V2 Features (Multi-Provider Expansion)

| Feature | V1 | V1.5 | V2 | V3 | V4 | Component Reference | Pricing Impact |
|---------|----|----|----|----|-----|---------------------|----------------|
| **Slack Integration** | ❌ | ❌ | ✅ | ✅ | ✅ | `SlackIntegrationPanel` (TBD) | +$199/mo |
| **Google Workspace Shadow** | ❌ | ❌ | ✅ | ✅ | ✅ | `IntelligenceDashboard` (shadow tab) | +$99/mo |
| **Cross-Platform Workspaces** | ❌ | ❌ | ✅ | ✅ | ✅ | `WorkspaceEngine` (M365 + Slack) | Included in Slack |
| **Universal Search** | ❌ | ❌ | ✅ | ✅ | ✅ | `OracleSearchBridgeV2` (all providers) | Included in modules |
| **Slack Waste Detection** | ❌ | ❌ | ✅ | ✅ | ✅ | `IntelligenceDashboard` (Slack storage) | Included in Slack |
| **Multi-Provider Tag Sync** | ❌ | ❌ | ✅ | ✅ | ✅ | `WorkspaceEngine` (cross-provider tags) | Included in modules |
| **Box Shadow Discovery** | ❌ | ❌ | ❌ | ✅ | ✅ | `IntelligenceDashboard` (Box tab) | Deferred to V3 |

**V2 Summary:**
- Slack as Tier 1 provider (full bi-directional)
- Google Workspace as Tier 2 (shadow discovery only)
- Cross-platform workspaces (M365 + Slack in one view)
- Universal search across all connected providers
- Pricing: Add-on modules (+$199 Slack, +$99 Google)

---

## V3 Features (Predictive Analytics + Compliance)

| Feature | V1 | V1.5 | V2 | V3 | V4 | Component Reference | Pricing Impact |
|---------|----|----|----|----|-----|---------------------|----------------|
| **Compliance Automation** | ❌ | ❌ | ❌ | ✅ | ✅ | `ComplianceCenter` (TBD) | +$299/mo |
| **Retention Policies** | ❌ | ❌ | ❌ | ✅ | ✅ | `ComplianceCenter` (policies) | Included in Compliance |
| **Audit Trails** | ❌ | ❌ | ❌ | ✅ | ✅ | `ComplianceCenter` (audit logs) | Included in Compliance |
| **Policy Templates** | ❌ | ❌ | ❌ | ✅ | ✅ | `ComplianceCenter` (GDPR/HIPAA) | Included in Compliance |
| **Predictive Analytics** | ❌ | ❌ | ❌ | ✅ | ✅ | `PredictiveDashboard` (TBD) | +$199/mo |
| **Anomaly Detection** | ❌ | ❌ | ❌ | ✅ | ✅ | `IntelligenceDashboard` (alerts) | Included in Predictive |
| **Drift Detection** | ❌ | ❌ | ❌ | ✅ | ✅ | `IntelligenceDashboard` (drift) | Included in Predictive |
| **Budget Forecasting** | ❌ | ❌ | ❌ | ✅ | ✅ | `ReportingCenter` (forecasts) | Included in Predictive |
| **Executive Dashboard** | ❌ | ❌ | ❌ | ✅ | ✅ | `ExecutiveView` (TBD) | Included in Predictive |
| **Advanced Remediation** | ❌ | ❌ | ❌ | ✅ | ✅ | `RemediationCenter` (workflows) | Included in Compliance |
| **Simulation Mode** | ❌ | ❌ | ❌ | ✅ | ✅ | `RemediationCenter` (dry-run) | Included in Compliance |

**V3 Summary:**
- Automated retention policies (auto-archive/delete)
- Predictive analytics (anomaly detection, forecasting)
- Executive intelligence dashboard (C-suite view)
- Advanced remediation workflows (approval chains, scheduled)
- Box shadow discovery added
- Pricing: +$299/mo Compliance, +$199/mo Predictive Analytics

---

## V4 Features (Federation + Ecosystem)

| Feature | V1 | V1.5 | V2 | V3 | V4 | Component Reference | Pricing Impact |
|---------|----|----|----|----|-----|---------------------|----------------|
| **Multi-Tenant Federation** | ❌ | ❌ | ❌ | ❌ | ✅ | `MSPDashboard` (TBD) | $2,999/mo base |
| **Cross-Tenant Search** | ❌ | ❌ | ❌ | ❌ | ✅ | `OracleSearchBridgeV2` (MSP mode) | Included in MSP |
| **Tenant Benchmarking** | ❌ | ❌ | ❌ | ❌ | ✅ | `MSPDashboard` (compare) | Included in MSP |
| **API Marketplace** | ❌ | ❌ | ❌ | ❌ | ✅ | `APIMarketplace` (TBD) | +$499/mo |
| **Webhooks** | ❌ | ❌ | ❌ | ❌ | ✅ | API backend | Included in API |
| **White-Label** | ❌ | ❌ | ❌ | ❌ | ✅ | Settings (branding) | +$999/mo |
| **Enterprise SSO** | ❌ | ❌ | ❌ | ❌ | ✅ | Auth flow (SAML/Okta) | +$499/mo |
| **Advanced RBAC** | ❌ | ❌ | ❌ | ❌ | ✅ | `AdminCenter` (custom roles) | Included in Enterprise |
| **Knowledge Graph** | ❌ | ❌ | ❌ | ❌ | ✅ | `KnowledgeGraphView` (TBD) | Included in API |
| **Multi-Language** | ❌ | ❌ | ❌ | ❌ | ✅ | Oracle (10+ languages) | Included in AI+ |
| **Custom LLM Fine-Tuning** | ❌ | ❌ | ❌ | ❌ | ✅ | AI service backend | Custom pricing |

**V4 Summary:**
- MSP platform (manage 10+ tenants from master dashboard)
- Public API + webhook system + marketplace
- White-label branding options
- Enterprise SSO (SAML, Okta, Auth0)
- Knowledge graph visualization
- Multi-language support
- Pricing: MSP $2,999/mo, API +$499/mo, White-Label +$999/mo

---

## Feature Development Checklist

When implementing a new feature, follow this workflow:

### 1. Determine Version Assignment
- Review `/docs/AETHOS_PRODUCT_ROADMAP.md` to see which version the feature belongs to
- Update this document if the feature is new

### 2. Update VersionContext
- Add feature flag to `VersionFeatures` interface in `/src/app/context/VersionContext.tsx`
- Set `true/false` for each version in `VERSION_FEATURES` mapping

### 3. Implement Feature with Gates
```tsx
import { useFeature, FeatureGate } from '../context/VersionContext';

// Option 1: Hook-based
function MyComponent() {
  const hasAI = useFeature('aiContentSearch');
  
  return (
    <div>
      {hasAI && <SemanticSearchBar />}
    </div>
  );
}

// Option 2: Component-based
function MyComponent() {
  return (
    <FeatureGate feature="slackIntegration">
      <SlackPanel />
    </FeatureGate>
  );
}

// Option 3: Fallback UI
function MyComponent() {
  return (
    <FeatureGate 
      feature="predictiveAnalytics" 
      fallback={<UpgradePrompt />}
    >
      <PredictiveDashboard />
    </FeatureGate>
  );
}
```

### 4. Update Component Documentation
- Add version comment to component file header
```tsx
/**
 * SemanticSearchBar
 * 
 * VERSION: V1.5+
 * FEATURE FLAG: aiContentSearch
 * PRICING: Requires AI+ upgrade (+$199/mo)
 */
```

### 5. Test Across Versions
- Use version toggle (Cmd+Shift+V) to test feature visibility
- Verify feature is hidden in lower versions
- Verify feature appears in correct version+

---

## Mock Data Strategy by Version

Different versions require different mock datasets:

### V1 Mock Data
- **Artifacts**: 500 M365 files (SharePoint, Teams, OneDrive)
- **Workspaces**: 5 workspaces with tag-based sync rules
- **Tags**: 20 user-applied tags, 30 AI-suggested tags
- **Discovery**: 50 stale files, 20 orphaned, 10 external shares

### V1.5 Additions
- **Embeddings**: Add `embedding_vector` field to artifacts
- **Content Summaries**: Add `ai_summary` field
- **PII Detections**: 5 artifacts flagged with PII

### V2 Additions
- **Slack Messages**: 200 mock messages across 15 channels
- **Slack Channels**: 15 channels (5 inactive, 3 high-activity)
- **Cross-Platform Workspaces**: 3 workspaces with M365 + Slack artifacts
- **Google Workspace**: 100 shadow discovery items (read-only)

### V3 Additions
- **Compliance Policies**: 3 retention policies (GDPR, HIPAA, SOC 2)
- **Predictive Alerts**: 10 anomaly/drift alerts
- **Executive Metrics**: Monthly trend data for C-suite dashboard

### V4 Additions
- **MSP Tenants**: 5 client tenant records
- **API Keys**: 3 active API keys with usage logs
- **Webhook Events**: 20 event stream records

**Location:** `/src/app/context/mockData/` (organized by version)

---

## Pricing Summary by Version

| Version | Base Price | Add-Ons | Total Example |
|---------|-----------|---------|---------------|
| **V1** | $399-1,499/mo (tenant-based) | None | $499/mo (typical mid-market) |
| **V1.5** | V1 base | +$199 AI+ | $698/mo |
| **V2** | V1.5 total | +$199 Slack, +$99 Google | $996/mo |
| **V3** | V2 total | +$299 Compliance, +$199 Predictive | $1,494/mo |
| **V4** | V3 total | +$499 API, +$999 White-Label | $2,992/mo (or MSP pricing) |

**Note:** These are modular. Customers can skip tiers (e.g., V1 → V3 without V2 if no Slack needed).

---

## Version Migration Notes

### V1 → V1.5
- **Database**: Add `artifact_embeddings`, `artifact_content_chunks` tables
- **Backend**: Integrate OpenAI embeddings API
- **UI**: Add semantic search toggle to Oracle

### V1.5 → V2
- **Database**: Add `slack_messages`, `slack_channels`, expand `provider` enum
- **Backend**: Add Slack OAuth + API integration
- **UI**: Add provider filter to Discovery, cross-platform workspace cards

### V2 → V3
- **Database**: Add `compliance_policies`, `retention_rules`, `predictive_alerts`
- **Backend**: Add policy enforcement engine, anomaly detection service
- **UI**: Add Compliance Center, Predictive Dashboard

### V3 → V4
- **Database**: Add `msp_tenants`, `api_keys`, `webhook_subscriptions`
- **Backend**: Add MSP multi-tenant architecture, public REST API
- **UI**: Add MSP Dashboard, API Marketplace, white-label settings

---

## Feature Request Validation

Use this matrix to **validate demand signals** before building:

| Version | Key Validation Signal | Decision Gate |
|---------|----------------------|---------------|
| **V1 → V1.5** | Users complain "Can't search inside documents" | 30%+ of users request content search |
| **V1.5 → V2** | Users ask "Can you do this for Slack?" | 3+ customer requests for Slack integration |
| **V2 → V3** | Enterprise buyers require compliance features | 3+ enterprise deals blocked by missing compliance |
| **V3 → V4** | MSPs ask "Can we manage multiple tenants?" | 3+ MSP inquiries or multi-subsidiary requests |

---

## Component Inventory by Version

### V1 Components (Core)
- `IntelligenceDashboard` - Discovery module
- `WorkspaceEngine` - Workspace management
- `OracleSearchBridgeV2` - Metadata search
- `RemediationCenter` - Basic remediation
- `ReportingCenter` - Weekly reports
- `GlassCard` - Universal card component
- `Sidebar` - Main navigation

### V1.5 Components (AI+)
- `SemanticSearchBar` - AI-powered search input (TBD)
- `SummarizationPanel` - Document summarizer (TBD)
- `PIIDetectionAlert` - PII warning badges (TBD)
- `ContentChunkView` - Relevant paragraph display (TBD)

### V2 Components (Multi-Provider)
- `SlackIntegrationPanel` - Slack connection UI (TBD)
- `CrossPlatformWorkspaceCard` - M365 + Slack unified view (TBD)
- `ProviderFilterPanel` - Multi-provider selector (TBD)
- `ShadowDiscoveryView` - Google Workspace read-only view (TBD)

### V3 Components (Compliance + Analytics)
- `ComplianceCenter` - Retention policy builder (TBD)
- `PredictiveDashboard` - Forecasting charts (TBD)
- `ExecutiveView` - C-suite intelligence dashboard (TBD)
- `RemediationWorkflowBuilder` - Approval chain editor (TBD)

### V4 Components (Federation)
- `MSPDashboard` - Multi-tenant master view (TBD)
- `APIMarketplace` - Integration gallery (TBD)
- `WhiteLabelConfigurator` - Branding settings (TBD)
- `KnowledgeGraphView` - Entity relationship visualization (TBD)

---

## Status Legend

| Status | Meaning | Action Required |
|--------|---------|-----------------|
| ✅ **Implemented** | Feature is live in prototype | None |
| 🚧 **In Progress** | Currently being developed | Continue work |
| 📋 **Planned** | Documented but not started | Ready for development |
| 🔜 **Backlog** | Future version, not prioritized | No action until version validated |
| ❌ **Deferred** | Explicitly not in this version | Do not implement yet |

---

## Questions or Conflicts?

If you're unsure which version a feature belongs to:

1. Check `/docs/AETHOS_PRODUCT_ROADMAP.md` for strategic context
2. Check `/docs/AETHOS_V1_SPEC.md` for V1-specific boundaries
3. Consult this document for feature flag assignments
4. If still unclear, default to **deferring to next version** (ship simple first)

---

**Maintained by:** Product & Engineering  
**Review Cadence:** After each version ships  
**Last Audit:** V1 Spec Finalization (2026-02-27)
