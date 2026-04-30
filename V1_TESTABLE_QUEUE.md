# Aethos V1 Testable Queue

**Last Updated:** April 30, 2026  
**Status:** Active execution queue  
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
- Smoke tests cover the main V1 flow.
- Documentation accurately distinguishes implemented, partial, and deferred work.

---

## P0 - Required For First Testable V1

- [x] Add frontend-only `.vercelignore` for initial Vercel deployment.
- [ ] Resolve `files` vs `artifacts` schema drift across migrations and APIs.
- [ ] Standardize backend Supabase environment variables on `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] Add a shared API auth/tenant validation helper for Vercel functions.
- [ ] Apply auth/tenant validation to V1 endpoints: discovery, search, workspaces, remediation, intelligence.
- [ ] Add remediation dry-run mode and make dry-run the default UI path for first tester sessions.
- [ ] Wire `IntelligenceDashboard` to real discovery/search metrics.
- [ ] Wire `WorkspaceEngine` to real workspace creation/list/detail APIs.
- [ ] Add workspace list/detail endpoints if the frontend needs them.
- [ ] Gate non-V1 prototype modules behind feature flags or hide them from the default nav.
- [ ] Turn global demo mode into an explicit environment-controlled setting.
- [ ] Add Vitest configuration and smoke tests for the V1 happy path.

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

---

## Current Review Findings

See `docs/PHASE_1_DEPLOYMENT_REVIEW.md` for the full current review and deployment recommendations.
