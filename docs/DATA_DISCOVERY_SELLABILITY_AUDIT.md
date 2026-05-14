# Data Discovery Sellability Audit

**Last Updated:** 2026-05-12  
**Scope:** V1 discovery, reports, remediation, identity/offboarding relevance, and sales story by customer data maturity.  
**Related:** `docs/WORKSPACE_PERSONAS.md`

---

## Executive Take

Aethos V1 is sellable if it stays focused on **Microsoft 365 discovery, ownership clarity, exposure review, stale-content detection, metadata quality, search, workspaces, and safe cleanup dry-runs**.

The current Identity prototype should not be promoted wholesale into V1. However, a narrow identity-adjacent story should move into V1:

> Who owns this content, what is tied to people who left or are leaving, and what shared/exposed content needs review before knowledge walks out the door?

That is much more sellable than generic identity analytics, especially in an environment where employee turnover is high.

Workspace sellability depends on three personas working as a loop: Systems Admins generate handoff candidates, Context Stewards curate source-of-truth context, and Knowledge Workers consume the cleaned workspace as a trusted playlist of documents.

---

## Current Live-Backed Discovery Capabilities

The live discovery endpoint indexes Microsoft 365 metadata from:

- SharePoint sites and document libraries.
- OneDrive files for the signed-in user.
- Teams files.

For each indexed file, V1 currently stores useful operational metadata:

- Name.
- Path.
- Provider type: SharePoint, OneDrive, Teams.
- URL.
- Size.
- MIME type.
- Created and modified timestamps.
- Owner email/name when Graph provides it.
- Stale flag based on 180+ days since modification.
- External sharing flag and external user count.
- Risk score based on exposure, staleness, and large file size.
- Raw Graph metadata.

This is a strong V1 foundation. It supports search, workspace creation, remediation candidates, and basic intelligence metrics without reading document contents.

---

## Current Report-Like Outputs

### Live-Backed Today

1. **Discovery Scan Result**
   - Files found.
   - Sites/Teams found.
   - New indexed files.
   - Error count.
   - Scan status in session.

2. **Operational Intelligence Overview**
   - Total indexed files.
   - Discoverable/searchable file count.
   - Metadata quality indicators.
   - Provider status for Microsoft 365.
   - Empty/error states when no live data exists.

3. **Metadata Intelligence**
   - Total files.
   - Files with AI title/description fields.
   - Files with tags/categories.
   - Meaningful-name count.
   - Average name length.
   - Category breakdown when enrichment exists.
   - Improvement opportunities: low confidence, generic names, no enrichment.

4. **Remediation Candidates**
   - Live candidates from indexed files.
   - Risk filtering.
   - Issue filtering: external share, stale, orphaned, waste.
   - Safe dry-run default for archive/delete/revoke actions.

5. **Oracle Search Results**
   - Metadata search across indexed file name, path, owner, AI title, category, and tags.
   - Generic live prompts that do not invent customer data.

### Not Yet Live-Backed

The `ReportingCenterV1` component currently uses static mock reporting data:

- Total storage.
- Waste identified.
- Stale content.
- Recovery potential.
- Storage trends.
- Waste breakdown.
- Provider breakdown.
- Top waste files.
- Weekly summary insights.
- CSV export.

It is not currently visible in the default V1 sidebar, which is good. It should not be sold as live until it reads from the indexed `files`, `sites`, and `discovery_scans` tables.

---

## Identity: Should It Move Into V1?

### Recommendation

Move **Identity Signals** into V1, but do not move the full Identity Engine into V1.

The V1 identity story should be:

- Content owner visibility.
- Unknown/missing owner detection.
- Former employee or inactive owner risk, once available.
- Externally shared files owned by departing/departed people.
- Stale files tied to inactive owners.
- Workspace handoff candidates.

This fits the market moment. When people leave companies, customers worry about:

- Losing context.
- Orphaned files.
- Exposed documents no one monitors.
- Knowledge trapped in personal OneDrives.
- Projects losing ownership.
- Cleanup work nobody wants to do manually.

### Do Not Sell In V1 Yet

Avoid selling these as V1 until backed by real data:

- Identity velocity.
- Skill synthesis.
- Talent clusters.
- Badge/merit systems.
- Cross-platform identity reconciliation.
- HRIS/SCIM integration.
- Advanced identity risk matrices.

### V1 Identity Report To Add

**Ownership & Offboarding Risk Report**

Minimum fields:

- Files with no owner.
- Files owned by inactive/departed users, when Graph/Entra data is available.
- Externally shared files owned by inactive/departed users.
- Stale files by owner.
- Top owners by high-risk file count.
- OneDrive-heavy ownership concentration.
- Recommended handoff workspaces.

This is the highest-value identity-adjacent V1 feature.

---

## Sellability By Customer Data Size

### No Or Little Data

Typical customer state:

- Small tenant.
- Few files indexed.
- New Microsoft environment.
- Limited SharePoint usage.
- Test account with almost no files.

What Aethos should show:

- Honest empty states.
- Setup guidance.
- Search prompts by document type/owner/date.
- `Create first workspace` path.
- `Path to Value` readiness checklist.
- Demo mode CTA for seeing the full product story.
- Admin capability status and scan result summary.

Sell the value as:

> Aethos gives you the operating model before the mess gets expensive. Start with clean workspaces, ownership habits, and searchable metadata now.

Reports to provide:

- First Scan Readiness Report.
- Metadata Baseline Report.
- Workspace Starter Recommendations.
- `No risk found yet` reassurance.

Avoid:

- Fake savings.
- Fake stale content.
- Fake exposure numbers.
- Overclaiming AI intelligence.

### Medium Data Sets

Typical customer state:

- Enough SharePoint/OneDrive/Teams content to have sprawl.
- Some stale files.
- Some external shares.
- Mixed ownership quality.
- Teams/projects with scattered documents.

What Aethos should show:

- Tenant Health Score for executive buyers.
- Indexed file count.
- Stale file count.
- External share count.
- High-risk remediation candidates.
- Top owner/path/category patterns.
- Metadata quality score.
- Workspace candidates.

Sell the value as:

> Aethos shows where the knowledge mess is starting to cost you: stale files, unclear ownership, exposed content, and teams recreating work because they cannot find the right source.

Reports to provide:

- Discovery Summary.
- Exposure Review.
- Stale Content Review.
- Metadata Quality Report.
- Workspace Candidate Report.
- Remediation Dry-Run Report.
- Ownership & Offboarding Risk Report.

### Large Data Sets

Typical customer state:

- Many SharePoint sites, Teams, and OneDrive files.
- M&A history or long-lived departments.
- High employee churn.
- Large archives.
- External sharing risk.
- Copilot/native AI readiness concerns.

What Aethos should show:

- Tenant Health Score with clear drivers and trend deltas.
- Scan coverage and partial failure details.
- Top risky containers/sites.
- Top owners by risk.
- Largest stale content clusters.
- External exposure hotspots.
- Metadata gaps by department/site.
- Workspace automation opportunities.
- Prioritized cleanup batches.

Sell the value as:

> Aethos turns Microsoft 365 from a black box into an actionable knowledge estate map. Before you trust Copilot, AI search, or another migration, you can see what is stale, exposed, ownerless, duplicated, and worth organizing.

Reports to provide:

- Executive Discovery Summary.
- Risk Heatmap by Site/Team/Owner.
- External Sharing Exposure Report.
- Stale/Archive Candidate Report.
- Ownership & Offboarding Risk Report.
- AI Readiness / Metadata Quality Report.
- Workspace Automation Opportunity Report.
- Remediation Dry-Run Export.

Large tenants also need:

- Pagination and scan history.
- Background scan status.
- Partial scan visibility.
- Exportable CSVs.
- Clear `sample of top risks` rather than trying to render everything.

---

## Product Gaps To Close Before Selling Reports

1. **Live Reports API**
   - Build report summaries from `files`, `sites`, and `discovery_scans`.
   - Do not use the current mock `ReportingCenterV1` data in Live Mode.
   - Include `Tenant Health Score`, `tenantExposureIndex`, score drivers, and trend deltas after there is more than one completed scan.
   - Suppress the global score as `not_enough_data` until a completed scan has at least 50 indexed files and 3 indexed sites.

2. **Scan History**
   - Show last scan, status, duration, file count, site count, error count.
   - Keep historical scan records visible in Admin and reports.

3. **Ownership Signals**
   - Add owner risk aggregation.
   - Later enrich with Entra user active/departed status.
   - Use `Owner Liability Score` for the admin action queue.
   - Use this initial owner-liability weighting: 40% external exposure, 25% missing/inactive ownership, 20% high-risk files, 10% stale burden, 5% storage/OneDrive concentration.

4. **External Exposure Report**
   - Count and list externally shared files.
   - Group by owner, site/team, and stale status.

5. **Stale Content Report**
   - Count stale files.
   - Sum stale storage.
   - Group by site/team/owner.

6. **Metadata Quality Report**
   - Improve the score model.
   - Separate source metadata quality from Aethos-side AI suggestions.

7. **Report Language**
   - For no/little data, avoid `savings` language.
   - For medium data, emphasize clarity and safe cleanup.
   - For large data, emphasize risk prioritization, ownership, and AI readiness.

8. **Manual Admin Action Exports**
   - Add CSV export for review.
   - Add copy-to-clipboard summaries for issue lists.
   - Add PowerShell/Graph export only as a reviewed, dry-run-first helper until remediation writeback is mature.

---

## Recommended V1 Report Menu

Do not expose a broad `Reporting Center` yet. Instead, add focused report cards inside Intelligence/Admin:

1. Discovery Summary.
2. Exposure Review.
3. Stale Content Review.
4. Metadata Quality.
5. Ownership & Offboarding Risk.
6. Workspace Opportunities.
7. Remediation Dry Run.

This keeps V1 sellable without making the product feel like it promises more than it can back up.
