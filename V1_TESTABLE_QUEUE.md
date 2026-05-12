# Aethos V1 Testable Queue

**Last Updated:** May 12, 2026  
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
- [ ] Wire `IntelligenceDashboard` to real discovery/search metrics in Live Mode.
- [x] Wire `WorkspaceEngine` to real workspace creation/list/detail APIs.
- [x] Prevent `WorkspaceEngine` from falling back to demo workspaces in Live Mode.
- [x] Make Workspace creation obvious in V1 Nexus, even when no indexed files exist.
- [x] Refactor existing UI components (`IntelligenceDashboard`, `WorkspaceEngine`, `DesignCenter`) to meet Mobile-First standards.
- [x] Add workspace list/detail endpoints if the frontend needs them.
- [x] Gate non-V1 prototype modules behind feature flags or hide them from the default nav.
- [x] Turn global demo mode into an explicit environment-controlled setting.
- [ ] Enforce a strict Live Mode vs Demo Mode data boundary across V1 modules.
- [x] Replace Live Mode mock/simulation surfaces in Intelligence with real scan status, empty states, or setup CTAs.
- [x] Replace Live Mode mock remediation queue with real candidates from indexed `files` metadata.
- [ ] Add Phase 1 first-run setup guidance after Microsoft sign-in.
- [ ] Finish Phase 1 Admin Center with scan status, tenant capability status, sign-out, and mode controls.
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
- [ ] Audit all V1 screens for mock data in Live Mode.
- [x] Add clear empty states for real tenants with little or no Microsoft content.
- [ ] Preserve seeded Supabase/demo fixtures for Demo Mode.
- [x] Document deployment surfaces and how to switch between Live Mode and Demo Mode for testing.

Known follow-up from the latest audit:

- [x] Stop Metadata Intelligence from falling back to sample metrics when the Live Mode metrics API fails.
- [x] Remove demo-only federated provider claims from Live Mode Oracle/Workspace copy.
- [ ] Finish a full pass on secondary Intelligence tabs for remaining prototype-only controls.

---

## Active Workstream - Phase 1 Setup And Admin

- [ ] Add a first-run setup panel/wizard after successful Microsoft sign-in.
- [ ] Step 1: show signed-in account and tenant.
- [ ] Step 2: run Microsoft capability checks for OneDrive, SharePoint, Teams/groups.
- [ ] Step 3: run Microsoft Discovery scan.
- [ ] Step 4: show scan results and route to Oracle Search or Create Workspace.
- [ ] Add Admin scan history: last scan status, file count, site count, errors.
- [ ] Add Admin capability status: connected, missing permission, needs admin consent, unavailable.
- [ ] Keep Sign Out visible and confirm it clears local Aethos session state.
- [ ] Add a reset/debug section for local demo override and cached MSAL state guidance.
- [x] Add V1 diagnostics capture for browser errors, console warnings/errors, and unhandled promise rejections.
- [ ] Add Admin diagnostics viewer for recent `app_diagnostics` events.

---

## Active Workstream - Operational Intelligence And Discovery Reports

See `docs/OPERATIONAL_INTELLIGENCE_DEVELOPMENT_QUEUE.md` for the detailed implementation queue, report API shape, smoke workflows, and product-decision prompts.

- [x] Build `POST /api/intelligence/report-summary` from `files`, `sites`, and `discovery_scans`.
- [x] Replace Operational Intelligence overview cards with live report-summary data.
- [x] Add `Tenant Health Score`, inverse `tenantExposureIndex`, top score drivers, and trend deltas to the report summary.
- [x] Add data maturity floors: `not_enough_data` until a completed scan has at least 50 indexed files and 3 indexed sites.
- [x] Add no-data `Path to Value` checklist for connected tenants with little or no content.
- [ ] Add focused report cards: Discovery Summary, Exposure Review, Stale Content Review, Metadata Quality, Ownership & Offboarding Risk, Workspace Opportunities, Remediation Dry Run.
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
- [ ] Add V1.5 identity enrichment spike for Entra active/disabled/departed owner status.
- [ ] Add smoke tests for demo route, live empty tenant, live first discovery, ownership/offboarding risk, and V1.5 content intelligence.
- [ ] Keep mock `ReportingCenterV1` hidden from Live Mode until it is live-backed.

---

## Active Workstream - Workspace V1

- [ ] Rename or clarify `Nexus` as the Workspace area in V1 navigation/copy.
- [ ] Add a primary `Create Workspace` button to the Workspace/Nexus header.
- [x] Show real empty state when the live tenant has zero workspaces.
- [x] Allow manual workspace creation without requiring discovered files.
- [x] Make API failure state distinct from Demo Mode fallback.
- [ ] Add a post-discovery CTA: `Create a workspace from these results`.

---

## Active Product Boundary - Data Classification

**Principle:** Aethos will eventually understand multiple Microsoft 365 knowledge-object types, but V1 remains disciplined around files/documents and their operational metadata.

- [x] Define V1 data scope as files/documents, metadata, permissions, activity, containers, workspaces, and safe remediation.
- [x] Define V1.5 direction as content intelligence plus SharePoint pages/news inventory as published knowledge.
- [ ] Keep SharePoint Lists out of first testable V1 implementation.
- [ ] Add SharePoint Lists as a V1.5/V2 discovery spike after Live Mode auth, discovery, search, and workspace creation are stable.
- [ ] Add data-class labels to future search/results UX: Document, Published Knowledge, Structured List, Container, Signal.
- [ ] Validate customer demand for SharePoint Lists with pilot users before ingesting row-level list data.
- [ ] Keep full row-level SharePoint List ingestion opt-in only until privacy/governance controls are designed.

---

## Active Product Pillar - Metadata Classification

**Principle:** Auto-metadata classification and metadata suggestions are a core selling point. They should be audited and built with the same care as Search, Workspaces, Discovery, and Remediation.

- [x] Capture current metadata classification audit notes.
- [ ] Review `docs/METADATA_CLASSIFICATION_AUDIT.md` at the start of the next working session.
- [ ] Audit live vs demo behavior for tag suggestions, AI titles, categories, and intelligence scores.
- [ ] Decide the V1 suggestion lifecycle: pending, accepted, edited, rejected, blocked.
- [ ] Design a live-backed Metadata Suggestions panel after Discovery.
- [ ] Add confidence and rationale to metadata suggestions.
- [ ] Add bulk accept/edit/reject flows.
- [ ] Tie accepted metadata directly into workspace suggestions and tag-based auto-sync.
- [ ] Preserve an audit trail of metadata suggestion decisions.
- [ ] Add Copilot/native-AI readiness language that distinguishes Aethos-side suggestions from source-system improvements.
- [ ] Define which approved metadata improvements can eventually write back to Microsoft 365 or publish through Copilot connectors.

---

## P1 - Important Before Beta

- [ ] Re-enable Vercel API deployment after backend P0 hardening.
- [x] Implement route/component code splitting in `src/app/App.tsx`.
- [ ] Add consistent API error envelopes and status codes.
- [x] Add loading, error, and empty state audit for V1 screens.
- [x] Update inaccurate docs that still claim full V1-V4 production readiness.
- [x] Create `BETA_TESTING_GUIDE.md`.
- [x] Add seed data or fixture scripts for a local test tenant.
- [x] Add CI command documentation for build and test verification.

---

## P2 - Later

- [ ] Document Control production mode.
- [ ] Slack and Google connection UI flows.
- [ ] Rate limit enforcement for non-public APIs.
- [ ] Observability/logging pass with structured logs.
- [ ] AppSource preparation docs, privacy policy, support docs, and demo video checklist.
- [ ] Advanced bundle tuning after first lazy-loading pass.
- [ ] Add formal feature promotion flags for `pre-release -> demo -> live` rollout.

---

## Current Review Findings

See `docs/PHASE_1_DEPLOYMENT_REVIEW.md` for the full current review and deployment recommendations.

---

## Current Manual Testing Focus

- Verify `VITE_DEMO_MODE=false` starts the app in Live Mode.
- Confirm the floating version toggle can deliberately switch Demo Mode on/off and persists the browser-session override.
- Walk the V1 path in Live Mode: Microsoft auth, tenant/user setup, discovery, Oracle search, Workspace creation/detail, and remediation dry-run.
- Capture any manual test failures back into this queue before expanding P1/P2 work.
