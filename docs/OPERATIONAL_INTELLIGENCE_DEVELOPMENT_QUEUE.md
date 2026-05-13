# Operational Intelligence Development Queue

**Last Updated:** 2026-05-12  
**Owner:** V1/V1.5 product and engineering queue  
**Related:** `docs/DATA_DISCOVERY_SELLABILITY_AUDIT.md`, `docs/METADATA_CLASSIFICATION_AUDIT.md`, `V1_TESTABLE_QUEUE.md`

---

## Product Goal

Make the Operational Intelligence tab the place where an IT/admin buyer can answer:

- What did Aethos discover?
- What needs attention first?
- Who owns the risk?
- What should become a workspace?
- What can we safely clean up?
- How does this improve Microsoft 365 and future AI readiness?

The V1 surface must be honest in Live Mode and impressive in Demo Mode. Demo can tell the full story with fixtures; Live must only show tenant-backed data, empty states, or setup CTAs.

---

## P0 - Live/Demo Boundary Cleanup

- [x] Hide demo-only Intelligence Stream recommendations in Live Mode.
- [x] Hide prototype Identity tab in Live Mode.
- [x] Hide the bottom version/demo floater on locked live production domains.
- [ ] Audit every tab under Operational Intelligence for static numbers, fake people, fake projects, or demo-only labels.
- [x] Add a persistent, subtle `Data source: Live tenant` / `Data source: Demo fixtures` label to each report card.
- [ ] Add a shared `LiveDataBoundary` helper/component for empty/error/fixture states.
- [ ] Add tests for `demo.aethoswork.com` and `app.aethoswork.com` runtime decisions.

Acceptance:

- On `app.aethoswork.com`, Operational Intelligence never shows fictional insights, savings, people, or storage totals.
- On `demo.aethoswork.com`, fixture data is intentionally visible and labeled.
- Data source labels are visible without hover or interaction.

---

## P0 - Operational Intelligence Structure

Replace the current broad tab concept with a V1 report-card layout:

- [x] Rename `Overview` to `Discovery Summary`.
- [x] Keep `Metadata` as `Metadata Quality`.
- [x] Replace `Stream` in Live Mode with `Signal Queue`.
- [ ] Add `Ownership` / `Offboarding Risk` as a V1 identity-adjacent report card.
- [ ] Keep full `Identity Engine` demo-only until V1.5/V2.
- [x] Add a top `Tenant Health Score` for executive/founder buyers.
- [x] Add a top `Last scan` strip: status, completed time, files, sites/Teams, errors.
- [x] Add CTA routing:
  - No scan -> Admin: Run Discovery.
  - Scan with no data -> Path to Value checklist / Create Workspace / Demo walkthrough.
  - Scan with risks -> Signal Queue and Remediation.
  - Scan with good metadata -> Search / Workspace.

Acceptance:

- A first-time tester understands what to do next within 30 seconds.
- [x] Empty tenants still produce a useful `Path to Value` / first-scan readiness experience.
- Medium/large tenants see prioritized next actions instead of raw inventory.

---

## P0 - Reports API

Create a live-backed reporting endpoint:

`POST /api/intelligence/report-summary`

Initial response shape:

```ts
type ReportSummary = {
  tenantId: string;
  generatedAt: string;
  healthScore: {
    score: number | null;
    label: 'not_enough_data' | 'healthy' | 'needs_review' | 'high_risk';
    dataMaturity: 'none' | 'low' | 'medium' | 'large';
    drivers: string[];
  };
  globalRisk: {
    tenantExposureIndex: number | null;
    riskRating: 'Not Enough Data' | 'Low' | 'Medium' | 'High' | 'Critical';
    primaryRiskFactor: string | null;
  };
  trend: {
    previousScanId: string | null;
    healthScoreDelta: number | null;
    externalShareDelta: number | null;
    staleFileDelta: number | null;
    missingOwnerDelta: number | null;
  };
  lastScan: {
    id: string | null;
    status: 'none' | 'running' | 'completed' | 'partial' | 'failed';
    completedAt: string | null;
    filesDiscovered: number;
    sitesDiscovered: number;
    newFiles: number;
    errorCount: number;
  };
  discovery: {
    totalFiles: number;
    totalSites: number;
    sharePointFiles: number;
    oneDriveFiles: number;
    teamsFiles: number;
    totalStorageBytes: number;
  };
  risk: {
    staleFiles: number;
    staleBytes: number;
    externallySharedFiles: number;
    highRiskFiles: number;
    missingOwnerFiles: number;
  };
  ownership: {
    uniqueOwners: number;
    unknownOwnerFiles: number;
    topRiskOwners: Array<{
      ownerEmail: string | null;
      ownerName: string | null;
      fileCount: number;
      highRiskCount: number;
      externalShareCount: number;
      staleCount: number;
      missingOwnerCount: number;
      oneDriveFileCount: number;
      ownerLiabilityScore: number;
      primaryRiskFactor: string;
    }>;
  };
  workspaceOpportunities: Array<{
    label: string;
    reason: string;
    fileCount: number;
    suggestedTags: string[];
  }>;
};
```

Implementation tasks:

- [x] Aggregate `files` by provider type.
- [x] Aggregate stale files and stale storage.
- [x] Aggregate external share count.
- [x] Aggregate missing/unknown owner count.
- [x] Aggregate top owners by risk.
- [x] Calculate tenant health score, tenant exposure index, and owner liability score.
- [x] Include trend delta fields when a previous completed scan exists.
- [x] Add latest `discovery_scans` summary.
- [x] Return clean empty summary when tenant has no data.
- [x] Add unit tests for empty/low-maturity and messy sample datasets.

Acceptance:

- Operational Intelligence reads this endpoint in Live Mode.
- No report card uses hardcoded live values.

---

## P0 - Risk And Health Score Formula

Keep V1 scoring explainable and visibly tied to counts the user can inspect.

### Tenant Health Score

Customer-facing global score for executive/founder buyers. It answers: `Are we getting healthier?`

Use `tenantHealthScore = 100 - tenantExposureIndex`.

Initial tenant exposure weights:

- External sharing exposure: 35%.
- Unknown or missing ownership: 25%.
- High-risk file burden: 20%.
- Stale content burden: 10%.
- Metadata quality gaps: 5%.
- Scan errors or incomplete coverage: 5%.

Scoring rules:

- If there is no completed scan or the tenant is below the maturity floor, return `score: null` and `label: not_enough_data`.
- Show the top 2-3 score drivers next to the score.
- Never imply a tenant is safe just because Aethos has not scanned enough data.
- Use `Tenant Health Score` in UI copy, and `tenantExposureIndex` in the API for the inverse risk score.

### Data Maturity Floor

Use the maturity floor to keep early scans from producing jumpy or overconfident scores.

- `none`: no completed scan, 0 indexed files, or 0 indexed sites.
- `low`: completed scan with 1-49 indexed files or fewer than 3 indexed sites.
- `medium`: completed scan with 50-4,999 indexed files and at least 3 indexed sites.
- `large`: completed scan with 5,000+ indexed files or 100+ indexed sites.

Low maturity tenants should still show useful counts and setup guidance, but the global health score should remain `not_enough_data` until the tenant reaches the medium threshold.

### Owner Liability Score

Admin-facing ranked score for the Ownership & Offboarding Risk report. It answers: `Who needs review first?`

Use `ownerLiabilityScore = externalExposure * 0.40 + ownershipGap * 0.25 + highRiskFiles * 0.20 + staleBurden * 0.10 + oneDriveConcentration * 0.05`.

Normalize each component to 0-100 before applying weights.

Component guidance:

- External exposure is the highest-weighted signal because it maps to immediate security review.
- Ownership gap applies strongly to the `Unknown Owner` group and later to inactive/departed owners.
- High-risk files are a first-class signal for sensitive or architecturally deficient content.
- Stale burden catches handoff and archive risk without making old files sound like an emergency by default.
- Size concentration helps surface OneDrive/archive-heavy owners, but it should not dominate the score.
- Use ratio-based scoring with an absolute floor so one sensitive external file still registers.

Acceptance:

- Every score has a visible explanation.
- Medium/large tenants get prioritization, not just totals.
- No-data and low-data tenants get a readiness checklist instead of a misleading score.
- Small-but-leaky tenants can score high even with a low file count.
- Large tenants with a small absolute issue count still get Signal Queue items without making the whole tenant look critical.

### Risk Driver Library

Start with deterministic, plain-language drivers generated from the highest weighted component contributions.

| Category | Driver string | Trigger | Deep-link / filter |
| --- | --- | --- | --- |
| External | `Unsecured External Shares` | external exposure score > 60 | `/remediation?issue=external_share` |
| Ownership | `Unmanaged Knowledge Gaps` | ownership gap score > 50 | `/remediation?issue=missing_owner` |
| High-risk | `Critical Knowledge Exposure` | high-risk file score > 40 | `/remediation?issue=high_risk` |
| Stale | `Accumulated Stale Burden` | stale burden score > 70 | `/remediation?issue=stale` |
| Storage | `High OneDrive Concentration` | OneDrive concentration score > 80 | `/remediation?issue=onedrive_silo` |

Dynamic summary copy:

- Primary: `Your score is mainly impacted by {driver}.`
- Secondary: `Secondary risks include {driverA} and {driverB}.`
- Low maturity: `Aethos is warming up. We have indexed {fileCount} files, but need more data to calculate a reliable Health Score.`

API driver selection:

```ts
const weightedContributions = [
  { label: 'Unsecured External Shares', value: externalScore * 0.40 },
  { label: 'Unmanaged Knowledge Gaps', value: ownershipScore * 0.25 },
  { label: 'Critical Knowledge Exposure', value: highRiskScore * 0.20 },
  { label: 'Accumulated Stale Burden', value: staleScore * 0.10 },
  { label: 'High OneDrive Concentration', value: oneDriveScore * 0.05 },
].sort((a, b) => b.value - a.value);

const drivers = weightedContributions.slice(0, 3).map((driver) => driver.label);
```

Driver scenarios:

- Leaving employee scenario: `Unmanaged Knowledge Gaps` deep-links to Ownership & Offboarding Risk filtered to the top high-liability owners.
- Startup leak scenario: `Unsecured External Shares` deep-links to Exposure Review filtered to external shares, and later to `Anyone with link` / consumer email domains when Graph metadata supports it.

Driver acceptance:

- Drivers must map to inspectable counts.
- Drivers must deep-link to the relevant report or Signal Queue filter.
- Drivers must not mention departed users until Entra status enrichment exists.
- `Critical Knowledge Exposure` is the V1 high-risk label because it works for both technical admins and non-technical operators. Use `Sensitive Technical Liabilities` only as secondary/detail copy when the risk is specifically architectural or technical.
- [x] Live Signal Queue is generated from report-summary counts and routes to Admin, Remediation, or Workspaces.

---

## P0 - Discovery Summary Report

Purpose:

Show what Aethos indexed and whether the first scan is useful.

Report cards:

- Files indexed.
- Sites/Teams indexed.
- Provider breakdown: SharePoint, OneDrive, Teams.
- Last scan status.
- Scan errors.
- Next action.

Customer messaging:

- No data: `Aethos is connected. Complete the readiness checklist to get your first Risk Report.`
- Medium data: `Aethos found enough metadata to start search, risk review, and workspace creation.`
- Large data: `Aethos indexed a large knowledge estate. Start with prioritized risk and ownership views.`

Tasks:

- [ ] Replace session-only scan result with persisted last-scan summary.
- [ ] Add scan history link in Admin.
- [ ] Add post-scan CTA to Search, Remediation, Workspace.
- [ ] Add `partial scan` state with clear errors.
- [x] Add no-data `Path to Value` checklist:
  - Connect Microsoft account.
  - Confirm permissions/capabilities.
  - Run first discovery.
  - Review first report.
  - Create first workspace.

---

## P0 - Exposure Review

Purpose:

Show externally shared files and owner/site patterns.

Report cards:

- Externally shared files.
- External users total, if available.
- External shares on stale files.
- External shares by owner.
- External shares by provider type.

Tasks:

- [x] Add exposure aggregation to `report-summary`.
- [x] Add top externally shared files table.
- [x] Add filter handoff to Remediation: `issue=external_share`.
- [x] Add exportable CSV data model.

Sales angle:

> "Aethos shows which shared files deserve review before they become an incident."

---

## P0 - Stale Content Review

Purpose:

Show old content that may need archive, handoff, or workspace cleanup.

Report cards:

- Stale files.
- Stale storage.
- Largest stale files.
- Stale files by owner.
- Stale files by site/team.

Tasks:

- [x] Add stale storage aggregation.
- [x] Add top stale files table.
- [x] Add handoff to Remediation: `issue=stale`.
- [ ] Avoid hard-coded dollar savings until pricing/storage assumptions are configurable.

Sales angle:

> "Aethos shows where old content is creating drag, clutter, and search noise."

---

## P0 - Ownership & Offboarding Risk

This is the V1 identity feature to promote.

V1 scope:

- Owner visibility.
- Unknown owner files.
- High-risk files by owner.
- Externally shared files by owner.
- Stale files by owner.
- OneDrive concentration by owner.
- Workspace handoff suggestions.

V1.5 scope:

- Entra user status enrichment if permissions allow.
- Departed/inactive owner detection.
- Manager/department grouping.
- `Leaving employee handoff packet` report.
- Suggested replacement owners or workspace stewards.

Do not include in V1:

- Identity velocity.
- Skill synthesis.
- Badges/merit.
- Talent clusters.
- HRIS/SCIM.
- Cross-platform identity reconciliation.

Implementation tasks:

- [x] Add ownership aggregation to `report-summary`.
- [x] Add `ownerLiabilityScore` calculation:
  - high-risk files
  - external shares
  - stale files
  - missing owner
  - OneDrive concentration
- [x] Add `Ownership & Offboarding Risk` card to Operational Intelligence.
- [x] Add owner drilldown table.
- [x] Add CTA: create workspace/handoff packet from selected owner risk group.
- [x] Add empty state when Graph does not return owner fields.
- [x] Use `Ownership & Offboarding Risk` as the V1 product name.

V1.5 implementation tasks:

- [x] Add Entra user lookup/cache spike: active, disabled, guest, not found, or permission-required.
- [x] Add `owner_status` fields or owner status cache table.
- [x] Surface owner-status enrichment in Ownership & Offboarding Risk.
- [x] Add owner-status sync action with permission-required feedback.
- [x] Add departed/inactive owner report.
- [ ] Add handoff workflow: selected files -> suggested workspace -> assign steward.

Sales angle:

> "When people leave, Aethos helps you find what knowledge, files, and exposure they leave behind."

---

## P1 - Metadata Quality And AI Readiness

Purpose:

Tie discovery to the AI-readiness story without overpromising content intelligence.

V1 tasks:

- [x] Separate source metadata score from Aethos-side enrichment score.
- [x] Add `AI readiness blockers`:
  - generic names
  - missing owner
  - stale files
  - external exposure
  - missing tags/categories
- [x] Add conservative filename/path/owner-based suggestions.
- [x] Add CTA to Metadata Suggestions panel.
- [x] Route metadata suggestions to review packets, remediation filters, or workspace review.
- [x] Add manual admin action helpers:
  - Copy issue list to clipboard.
  - Export CSV for review.
  - Export dry-run PowerShell/Graph script only when every action is review-first and non-destructive by default.

V1.5 tasks:

- [x] Add review lifecycle states: accepted, edited, rejected, blocked.
- [x] Preserve an audit trail of metadata suggestion decisions.
- [ ] Add content-aware tags/categories.
- [ ] Add content-aware summaries.
- [ ] Add PII/sensitive content flags.
- [ ] Add topic clusters.
- [ ] Add confidence and rationale.

Sales angle:

> "Aethos helps clean the knowledge layer that Microsoft Copilot depends on."

V1 claim boundary:

> `Aethos identifies the metadata and ownership gaps that can weaken Microsoft 365 search and Copilot readiness. Source-system writeback remains explicit, reviewed, and outside the default V1 flow.`

---

## P1 - Workspace Opportunities

Purpose:

Turn discovery into action, not inventory.

Tasks:

- [x] Suggest workspaces from path/category/tag/owner clusters.
- [x] Suggest offboarding/handoff workspaces from owner risk.
- [x] Add `Create workspace from this report` CTA.
- [ ] Allow manual workspace creation even with zero matching files.
- [ ] Add preview count and sample files before workspace creation.

Sales angle:

> "Aethos turns scattered documents into working context without moving the source files."

---

## P1 - Remediation Dry-Run Report

Purpose:

Make cleanup safe and testable.

Remediation alignment principle:

- Remediation is the action layer for Operational Intelligence, not a generic delete/archive queue.
- Every report driver should map to a clear remediation attitude:
  - External sharing -> security review and targeted link revocation.
  - Missing owner -> assign stewardship or create handoff workspace before cleanup.
  - High-risk files -> preserve context, reduce exposure, and avoid automatic deletion.
  - Stale content -> archive review before deletion.
  - OneDrive concentration -> handoff/workspace creation before offboarding.

Tasks:

- [x] Preserve dry-run actions in `remediation_actions`.
- [x] Add dry-run history to Operational Intelligence.
- [x] Show estimated affected files and action type.
- [x] Add CSV export for dry-run recommendations.
- [x] Add `no destructive action taken` label.
- [x] Add issue-specific remediation playbooks that match report drivers.

Sales angle:

> "Aethos lets IT preview cleanup safely before touching source systems."

---

## Cleanup Tasks

- [ ] Remove or gate `ReportingCenterV1` mock report data from any live route.
- [ ] Replace encoding artifacts and smart quote corruption in visible UI/docs.
- [ ] Rename `Nexus` to `Workspaces` or `Nexus Workspaces` in V1 copy.
- [ ] Standardize terms:
  - Live Mode
  - Demo Mode
  - Discovery
  - Operational Intelligence
  - Metadata Quality
  - Ownership & Offboarding Risk
  - Remediation Dry Run
- [ ] Ensure every live API failure has a clear user action.
- [ ] Ensure every report card has empty, loading, error, demo, and live states.
- [ ] Add mobile checks for Operational Intelligence report cards.

---

## Automated Test Queue

- [ ] `demoMode.test.ts`
  - `app.aethoswork.com` is locked live.
  - `demo.aethoswork.com` is locked demo.
  - localhost override is allowed.

- [ ] `report-summary.test.ts`
  - empty tenant returns zero counts and `lastScan.status = none`.
  - medium tenant returns stale/external/owner counts.
  - large tenant returns top owner groups and does not exceed response shape.

- [ ] `IntelligenceDashboard.test.tsx`
  - Live Mode hides demo Identity tab.
  - Live Mode stream shows empty signal queue when no report data exists.
  - Demo Mode shows fixture-rich stream and Identity tab.

- [ ] `RemediationCenterV1.test.tsx`
  - Live Mode loads candidates from API.
  - Live Mode dry-run is default.
  - Demo Mode uses fixtures.

- [ ] `AdminCenter.test.tsx`
  - Scan history renders.
  - Discovery errors show clearly.
  - Mode lock state renders correctly on known domains.

---

## Manual Smoke Testing Workflows

### Workflow 1 - Demo Route Story Check

URL: `https://demo.aethoswork.com`

Expected:

- No Microsoft login.
- `Demo: fixture data` visible.
- Version/demo controls can be visible.
- Operational Intelligence shows rich demo story.
- Identity demo can remain visible.

Steps:

1. Open demo route in a fresh browser profile.
2. Open Operational Intelligence.
3. Check Overview, Stream, Metadata, Identity.
4. Run demo Discovery simulation.
5. Search with demo Oracle prompts.
6. Create a demo workspace.
7. Open Remediation and perform a demo action.

Pass:

- The product story is impressive and clearly demo-labeled.

Fail:

- Demo asks for Microsoft login.
- Demo claims live tenant data.
- Demo routes to `app.aethoswork.com`.

### Workflow 2 - Live Route Empty Tenant

URL: `https://app.aethoswork.com`

Expected:

- Microsoft login required.
- `Live: real tenant data` visible.
- No bottom demo/version floater.
- No fake intelligence recommendations.

Steps:

1. Sign in with Microsoft.
2. Confirm return URL remains `app.aethoswork.com`.
3. Open Admin and verify tenant/session context.
4. Open Operational Intelligence before running Discovery.
5. Confirm empty state explains what to do.
6. Create a manual workspace.
7. Search for a generic query.

Pass:

- Empty states are honest and useful.

Fail:

- Fake storage savings, fake people, fake stale files, or demo projects appear.

### Workflow 3 - Live Route First Discovery

Expected:

- Discovery writes real indexed metadata.
- Intelligence updates from real counts.
- Search/remediation use indexed files.

Steps:

1. Sign in.
2. Admin -> Run Discovery.
3. Wait for completion or partial completion.
4. Verify Discovery Summary counts.
5. Search Oracle for `policy`, `budget`, `recently modified`, and an owner email if available.
6. Open Remediation.
7. Confirm candidates are real or honest empty.
8. Run remediation dry-run on one candidate if present.

Pass:

- Counts and files reflect the signed-in tenant.

Fail:

- Demo fixtures appear in live.
- Discovery succeeds but downstream screens remain empty without explanation.

### Workflow 4 - Ownership & Offboarding Risk

Expected:

- Report groups risk by owner.

Steps:

1. Run discovery.
2. Open Operational Intelligence -> Ownership.
3. Review unknown owner count.
4. Review top owners by risk.
5. Filter external/stale files by owner.
6. Create a handoff workspace from a selected owner group.

Pass:

- The user can answer `who owns the risky or stale content?`

Fail:

- Owner data is missing without explanation.
- The report implies departed employee detection before Entra status is implemented.

### Workflow 5 - V1.5 Content Intelligence

Expected:

- Content intelligence is opt-in and clearly marked AI+.

Steps:

1. Enable V1.5/demo or pre-release mode.
2. Run enrichment on a small file set.
3. Review suggested summaries/tags/categories.
4. Confirm confidence/rationale appears.
5. Accept/edit/reject suggestions.
6. Verify accepted metadata improves search/workspace suggestions.

Pass:

- Users understand content reading is a higher-trust paid/AI+ capability.

Fail:

- V1 implies content-level understanding when only metadata was scanned.

---

## Product Decisions For Ashley / Gemini

Resolved decisions:

- Data source labels should be persistent and subtle, not hover-only.
- V1 identity feature name is `Ownership & Offboarding Risk`.
- External sharing and missing ownership are the highest-weighted V1 risk signals.
- V1 owner scoring uses `Owner Liability Score`: 40% external exposure, 25% ownership gap, 20% high-risk files, 10% stale burden, 5% OneDrive concentration.
- No-data tenants should see a `Path to Value` readiness checklist, not an empty dashboard.
- Operational Intelligence needs a `Tenant Health Score` for founder/COO buyers and detailed report cards for IT/admin buyers.
- Report summaries should include trend deltas once there is more than one completed scan.

Use these as remaining prompts for you or Gemini when you want strategic help:

1. **Risk Scoring Calibration**
   - Do the 40/25/20/10/5 owner-liability weights produce sensible rankings for messy, typical, and clean tenants?

2. **No-Data Sales Story**
   - What exact readiness checklist copy makes an empty tenant feel useful without pretending there is risk?

3. **Report Packaging**
   - Should reports live as cards inside Operational Intelligence, or should we reintroduce a dedicated Reporting Center once live-backed?

4. **Identity Scope**
   - Should disabled/departed Entra user detection be a V1.5 paid feature or pulled into late V1 if permissions are easy?

5. **AI Readiness Language**
   - Which buyer-facing claim best explains Aethos as the pre-processor for Microsoft 365 and Copilot readiness?

6. **Demo Story**
   - Which three demo insights best sell Aethos in under five minutes?

7. **Buyer Persona**
   - Is the first buyer IT admin, operations lead, security/compliance lead, or founder/COO at a messy SMB?

---

## Recommended Build Order

1. Build `report-summary` API.
2. Replace Operational Intelligence Overview with live report cards.
3. Add Ownership & Offboarding Risk card.
4. Add Exposure Review and Stale Content Review.
5. Add scan history to Admin.
6. Add report-card smoke tests.
7. Add V1.5 owner status enrichment spike.
8. Add Metadata Suggestions panel.
9. Add workspace opportunities from report groups.
10. Reassess whether a dedicated Reporting Center should return.
