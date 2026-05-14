# Aethos V1 Testable Queue

**Last Updated:** May 14, 2026  
**Status:** V1 live walkthrough blocked by Live-vs-Demo boundary polish  
**Scope:** First testable V1, not full production readiness

---

## Goal

Make Aethos V1 testable end to end:

`Microsoft auth -> tenant/user setup -> discovery scan -> metadata search -> workspace creation -> safe remediation/reporting`

This file is the short-cycle engineering queue. Keep `IMPLEMENTATION_TASKS.md` as the broader production-readiness backlog.

---

## Definition Of Testable

- Microsoft login works with real MSAL configuration.
- Tenant and user records are created or loaded from Supabase.
- Microsoft 365 discovery scan writes real metadata.
- Oracle search reads real indexed metadata.
- Workspace creation reads and writes real workspace data.
- Remediation supports safe dry-run behavior before destructive actions.
- Demo/prototype-only surfaces are hidden, gated, or clearly labeled.
- Live Mode never renders seeded/mock tenant data as if it came from the signed-in customer.
- Demo Mode remains intentionally available for sales/testing fixtures and later-feature walkthroughs.
- First-run users have a clear setup path from sign-in to discovery to first workspace.
- Smoke tests cover the main V1 flow.
- Documentation accurately distinguishes implemented, partial, and deferred work.

---

## P0 - Required For First Testable V1

- [x] Add frontend-only `.vercelignore` for initial Vercel deployment.
- [x] Resolve `files` vs `artifacts` schema drift across migrations and APIs.
- [x] Standardize backend Supabase environment variables on `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- [x] Add a shared API auth/tenant validation helper for Vercel functions.
- [x] Apply auth/tenant validation to V1 endpoints: discovery, search, workspaces, remediation, intelligence.
- [x] Add remediation dry-run mode and make dry-run the default UI path for first tester sessions.
- [x] Wire `IntelligenceDashboard` to real discovery/search metrics in Live Mode.
- [x] Wire `WorkspaceEngine` to real workspace creation/list/detail APIs.
- [x] Prevent `WorkspaceEngine` from falling back to demo workspaces in Live Mode.
- [x] Make Workspace creation obvious in V1 Workspaces, even when no indexed files exist.
- [x] Refactor existing UI components (`IntelligenceDashboard`, `WorkspaceEngine`, `DesignCenter`) to meet Mobile-First standards.
- [x] Add workspace list/detail endpoints if the frontend needs them.
- [x] Gate non-V1 prototype modules behind feature flags or hide them from the default nav.
- [x] Turn global demo mode into an explicit environment-controlled setting.
- [x] Enforce a strict Live Mode vs Demo Mode data boundary across V1 modules.
- [x] Replace Live Mode mock/simulation surfaces in Intelligence with real scan status, empty states, or setup CTAs.
- [x] Replace Live Mode mock remediation queue with real candidates from indexed `files` metadata.
- [x] Add Phase 1 first-run setup guidance after Microsoft sign-in.
- [x] Finish Phase 1 Admin Center with scan status, tenant capability status, sign-out, and mode controls.
- [x] Add Vitest configuration and smoke tests for the V1 happy path.

---

## Active Workstream - Live vs Demo Boundary

**Principle:** Demo data is allowed and useful, but only when Demo Mode is explicitly active. Live Mode must be boringly honest: if the tenant has no files, scans, workspaces, or remediation candidates, the UI should say that.

- [x] Keep `VITE_DEMO_MODE` as the environment default.
- [x] Keep the browser/session Demo Mode override for intentional testing.
- [x] Add Admin control to force Live Mode or Demo Mode.
- [x] Add Admin action to run Microsoft Discovery against the signed-in Microsoft tenant.
- [x] Stop Oracle metadata search from silently falling back to demo results in Live Mode.
- [x] Add a global visual status that distinguishes `Live: real tenant data` from `Demo: fixture data`.
- [x] Lock `app.aethoswork.com` to Live Mode and `demo.aethoswork.com` to Demo Mode.
- [x] Audit all V1 screens for mock data in Live Mode.
- [x] Add clear empty states for real tenants with little or no Microsoft content.
- [x] Preserve seeded Supabase/demo fixtures for Demo Mode.
- [x] Document deployment surfaces and how to switch between Live Mode and Demo Mode for testing.
- [x] Document the V1 Live/Demo boundary audit and preserved demo fixture sources.

Known follow-up from the latest audit:

- [x] Add an explicit app-shell tab allow-list so Live Mode only opens live-backed V1 surfaces and demo-only reporting stays gated.
- [x] Stop Metadata Intelligence from falling back to sample metrics when the Live Mode metrics API fails.
- [x] Remove demo-only federated provider claims from Live Mode Oracle/Workspace copy.
- [x] Finish a full pass on secondary Intelligence tabs for remaining prototype-only controls.

---

## Active Workstream - Phase 1 Setup And Admin

- [x] Add a first-run setup panel/wizard after successful Microsoft sign-in.
- [x] Step 1: show signed-in account and tenant.
- [x] Step 2: run Microsoft capability checks for OneDrive, SharePoint, Teams/groups.
- [x] Step 3: run Microsoft Discovery scan.
- [x] Step 4: show scan results and route to Oracle Search or Create Workspace.
- [x] Add Admin scan history: last scan status, file count, site count, errors.
- [x] Add Admin capability status: connected, missing permission, needs admin consent, unavailable.
- [x] Keep Sign Out visible and confirm it clears local Aethos session state.
- [x] Add a reset/debug section for local demo override and cached MSAL state guidance.
- [x] Add V1 diagnostics capture for browser errors, console warnings/errors, and unhandled promise rejections.
- [x] Add Admin diagnostics viewer for recent `app_diagnostics` events.

---

## Active Workstream - Operational Intelligence And Discovery Reports

See `docs/OPERATIONAL_INTELLIGENCE_DEVELOPMENT_QUEUE.md` for the detailed implementation queue, report API shape, smoke workflows, and product-decision prompts.

- [x] Build `POST /api/intelligence/report-summary` from `files`, `sites`, and `discovery_scans`.
- [x] Replace Operational Intelligence overview cards with live report-summary data.
- [x] Add `Tenant Health Score`, inverse `tenantExposureIndex`, top score drivers, and trend deltas to the report summary.
- [x] Add data maturity floors: `not_enough_data` until a completed scan has at least 50 indexed files and 3 indexed sites.
- [x] Add no-data `Path to Value` checklist for connected tenants with little or no content.
- [x] Add focused report cards: Discovery Summary, Exposure Review, Stale Content Review, Metadata Quality, Ownership & Offboarding Risk, Workspace Opportunities, Remediation Dry Run.
  - [x] Exposure Review live card and remediation handoff.
  - [x] Stale Content Review live card and remediation handoff.
  - [x] Ownership & Offboarding Risk live card.
  - [x] Workspace Opportunities card.
  - [x] Remediation Dry Run report card.
- [x] Promote V1 identity scope as Ownership & Offboarding Risk, not the full prototype Identity Engine, using the 40/25/20/10/5 Owner Liability Score model.
- [x] Add V1 risk-driver library: Unsecured External Shares, Unmanaged Knowledge Gaps, Critical Knowledge Exposure, Accumulated Stale Burden, High OneDrive Concentration.
- [x] Add manual admin action exports: copy issue list, CSV, and dry-run-first PowerShell/Graph helper.
- [x] Align Remediation playbooks with Operational Intelligence report drivers.
- [x] Add V1.5 identity readiness boundary for Entra owner-status enrichment.
- [x] Rename Operational Intelligence tabs to Discovery Summary, Signal Queue, and Metadata Quality with persistent data-source labels.
- [x] Add a persisted Last Scan strip to Operational Intelligence.
- [x] Back Live Mode Signal Queue with report-summary signals and actionable routing.
- [x] Add exposure and stale-content aggregation breakdowns to live report cards.
- [x] Add owner-risk handoff workspace opportunities and owner-row handoff CTAs.
- [x] Add owner metadata coverage and missing-owner empty states for live reports.
- [x] Suggest workspace opportunities from repeated path, tag, category, and owner clusters.
- [x] Add V1.5 identity enrichment spike for Entra active/disabled/guest/not-found owner status.
- [x] Surface cached owner-status enrichment in Ownership & Offboarding Risk.
- [x] Add owner-status sync action with permission-required feedback.
- [x] Add V1.5 inactive owner review report from cached Entra status.
- [x] Suggest handoff workspaces from inactive owner status review.
- [x] Add smoke tests for demo route, live empty tenant, live first discovery, ownership/offboarding risk, and V1.5 content intelligence.
- [x] Keep mock `ReportingCenterV1` hidden from Live Mode until it is live-backed.

---

## Active Workstream - Workspace V1

- [x] Capture Workspace personas: Systems Admin generates, Context Steward curates, Knowledge Worker consumes.
- [x] Surface Workspace personas in the live Workspace empty state and context sidebar.
- [x] Add persona-aware Workspace modes: Admin Review, Steward Curation, and Team View.
- [x] Rename or clarify `Nexus` as the Workspace area in V1 navigation/copy.
- [x] Add a primary `Create Workspace` button to the Workspace header.
- [x] Show real empty state when the live tenant has zero workspaces.
- [x] Allow manual workspace creation without requiring discovered files.
- [x] Make API failure state distinct from Demo Mode fallback.
- [x] Add a post-discovery CTA: `Create a workspace from these results`.
- [x] Persist workspace stewardship metadata: steward owner, review status, source-of-truth pins, and suggestion decisions.
- [x] Add Permission Bridge scaffolding: steward visibility state, access-gap flag, copy outreach packet, and source deep-link posture without source permission mutation.
- [x] Add Workspace handoff packets with reason codes from Discovery, Operational Intelligence, owner risk, stale content, exposure, and metadata quality.
- [x] Add workspace-scoped trust filters for source-of-truth, freshness, owner, external share, stale, and needs-review state.
- [x] Add read-focused Team View for Knowledge Workers with fewer admin/remediation controls.
- [x] Add steward audit trail before Microsoft 365 write-back or destructive remediation actions.

---

## Active Product Boundary - Data Classification

**Principle:** Aethos will eventually understand multiple Microsoft 365 knowledge-object types, but V1 remains disciplined around files/documents and their operational metadata.

- [x] Define V1 data scope as files/documents, metadata, permissions, activity, containers, workspaces, and safe remediation.
- [x] Define V1.5 direction as content intelligence plus SharePoint pages/news inventory as published knowledge.
- [x] Keep SharePoint Lists out of first testable V1 implementation.
- [ ] Add SharePoint Lists as a V1.5/V2 discovery spike after Live Mode auth, discovery, search, and workspace creation are stable.
- [x] Add data-class labels to future search/results UX: Document, Published Knowledge, Structured List, Container, Signal.
- [ ] Validate customer demand for SharePoint Lists with pilot users before ingesting row-level list data.
- [ ] Keep full row-level SharePoint List ingestion opt-in only until privacy/governance controls are designed.

---

## Active Product Pillar - Metadata Classification

**Principle:** Auto-metadata classification and metadata suggestions are a core selling point. They should be audited and built with the same care as Search, Workspaces, Discovery, and Remediation.

- [x] Capture current metadata classification audit notes.
- [x] Review `docs/METADATA_CLASSIFICATION_AUDIT.md` at the start of the next working session.
- [x] Audit live vs demo behavior for tag suggestions, AI titles, categories, and intelligence scores.
- [x] Add source metadata score, Aethos enrichment score, and AI-readiness blockers to live Metadata Quality.
- [x] Add conservative metadata suggestions panel with review-first lifecycle language.
- [x] Tie metadata suggestions to review packets, remediation filters, and workspace review routing.
- [x] Decide the V1 suggestion lifecycle: pending, accepted, edited, rejected, blocked.
- [x] Design a live-backed Metadata Suggestions panel after Discovery.
- [x] Add confidence and rationale to metadata suggestions.
- [x] Add bulk accept/edit/reject/block lifecycle controls for visible suggestions.
- [x] Add edited-value capture for suggestions marked `edited`.
- [x] Tie accepted metadata directly into workspace suggestions and tag-based auto-sync.
- [x] Preserve an audit trail of metadata suggestion decisions.
- [x] Add Copilot/native-AI readiness language that distinguishes Aethos-side suggestions from source-system improvements.
- [x] Define which approved metadata improvements can eventually write back to Microsoft 365 or publish through Copilot connectors.
- [x] Route content-aware enrichment output through pending metadata suggestions before writing final AI fields.
- [x] Generate content-aware tag/category suggestions from indexed content chunks when available.
- [x] Generate content-aware summary suggestions from indexed content chunks when available.
- [x] Surface PII/sensitive content flags in live risk reporting.
- [x] Surface topic clusters from repeated Aethos-side tags and categories.

---

## P1 - Important Before Beta

- [x] Re-enable Vercel API deployment after backend P0 hardening.
- [x] Implement route/component code splitting in `src/app/App.tsx`.
- [x] Add consistent API error envelopes and status codes.
- [x] Add loading, error, and empty state audit for V1 screens.
- [x] Update inaccurate docs that still claim full V1-V4 production readiness.
- [x] Create `BETA_TESTING_GUIDE.md`.
- [x] Add seed data or fixture scripts for a local test tenant.
- [x] Add CI command documentation for build and test verification.

---

## P2 - Later

- [ ] Document Control production mode.
- [ ] Slack and Google connection UI flows.
- [x] Rate limit enforcement for non-public APIs.
- [x] Observability/logging pass with structured logs.
- [ ] AppSource preparation docs, privacy policy, support docs, and demo video checklist.
- [ ] Advanced bundle tuning after first lazy-loading pass.
- [x] Add formal feature promotion flags for `pre-release -> demo -> live` rollout.

---

## Pre-Release - Mobile Responsiveness Hardening

**Principle:** Aethos must be usable at 375px width without accidental horizontal overflow, unreadable controls, or hover-only workflows.

Priority order:
1. IntelligenceDashboard.
2. OracleSearch.
3. WorkspaceEngine.
4. RemediationCenter.
5. AdminCenter.

Completed component passes:
- [x] IntelligenceDashboard: remove mobile overflow pressure from scan strips and owner/report cards, reduce tight tracking, and wrap long owner/file labels.
- [x] OracleSearch: make filter panel full-width on mobile, stack status controls, wrap chat/result text, and keep core search controls touch-sized.
- [x] WorkspaceEngine: reduce tight label tracking, make workspace/lattice actions touch-sized on phones, and wrap resource titles/labels.
- [x] Mobile contract coverage: add a V1 cross-screen smoke test for overflow containment, touch targets, progressive grids, blur reduction, and long-label wrapping.
- [x] ReportingCenter: stack report controls at mobile widths, reduce chart/card padding, wrap waste-file rows, and remove hard-coded dollar savings.
- [x] PeopleCenter: stack directory/manager controls, wrap identity card labels, and make the profile modal phone-friendly.
- [x] App shell and navigation: reduce mobile blur cost, tighten shell labels, touch-size header/sidebar controls, and add bottom-nav content clearance.
- [x] RemediationCenter: stack filters/tabs/actions at mobile widths, make candidate cards wrap instead of truncate, and use a bottom-sheet confirmation dialog on phones.
- [x] AdminCenter: stack header/setup/diagnostic controls at mobile widths, reduce tight tracking, wrap long status values, and reduce mobile backdrop cost.

Audit rules:
- [ ] Test at 375px, 390px, 768px, 820px, 1024px, 1280px, and 1920px.
- [x] Remove accidental horizontal overflow; allow only intentional tab/filter/stat-pill carousels.
- [x] Ensure primary touch targets are at least 44px x 44px.
- [x] Keep interactive control text readable: `text-sm` preferred, `text-xs` acceptable for compact tabs/pills that scale up at `sm:`.
- [x] Preserve Aethos tiny metadata labels for non-interactive/supporting text only.
- [x] Use progressive dashboard grids: 1 col mobile, 2 col small tablet, 3-4 col desktop.
- [x] Keep primary dashboard/report cards stacked vertically on mobile instead of horizontal carousels.
- [ ] Convert dense tables/lists to mobile cards using `hidden lg:block` desktop tables and `lg:hidden` card lists.
- [ ] Make modals full-screen or bottom-sheet style on mobile, centered on desktop.
- [ ] Keep forms readable with stacked fields/buttons and iOS keyboard-safe spacing.
- [ ] Make charts responsive with aspect-ratio containers and reduced mobile axis labels.
- [ ] Reduce expensive blur/backdrop effects on mobile: `backdrop-blur-sm sm:backdrop-blur-md lg:backdrop-blur-xl`.
- [x] Add `scrollbar-hide` and `safe-area-inset` utilities if missing; `snap-x` and `snap-start` are native Tailwind utilities.
- [ ] Test with the existing bottom nav; do not replace it with a drawer unless testing proves the bottom nav fails.
- [ ] Run a final smoke test on real iPhone SE or Chrome DevTools 375px: navigate core V1 screens, tap every button, open every modal, verify forms and charts.

---

## Current Review Findings

See `docs/PHASE_1_DEPLOYMENT_REVIEW.md` for the full current review and deployment recommendations.

---

## Current Manual Testing Focus

- Verify `VITE_DEMO_MODE=false` starts the app in Live Mode.
- Confirm the floating version toggle can deliberately switch Demo Mode on/off and persists the browser-session override.
- Walk the V1 path in Live Mode: Microsoft auth, tenant/user setup, discovery, Oracle search, Workspace creation/detail, and remediation dry-run.
- Capture any manual test failures back into this queue before expanding P1/P2 work.
