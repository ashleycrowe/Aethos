# Aethos Phase 1 Deployment Review

**Last Updated:** April 30, 2026  
**Review Scope:** Codebase, API contracts, database migrations, frontend readiness, documentation accuracy  
**Phase 1 Target:** First testable V1 for internal/customer pilot validation

---

## Executive Summary

Aethos has a strong prototype surface and meaningful backend scaffolding, but it is not yet ready for a Phase 1 tester without a focused hardening pass. The first deployment should narrow to V1: Microsoft auth, Microsoft discovery, metadata search, workspaces, safe remediation, and reporting. V1.5+ features should remain available in code but gated until the V1 data contracts are stable.

The highest-risk issue is schema drift: the V1 schema uses `files`, while later migrations and several advanced APIs refer to `artifacts`. Until that is resolved, semantic search, provider scans, analytics, and some docs cannot all be correct at the same time.

---

## Phase 1 Scope

### Include

- Microsoft Entra login through MSAL.
- Supabase tenant/user setup.
- Microsoft 365 metadata discovery.
- Oracle metadata search against indexed files.
- Workspace creation and tag-based sync.
- Safe remediation dry-runs and limited Microsoft Graph actions.
- Basic reporting and operational metrics.

### Gate Or Defer

- Slack/Google UI flows.
- Document Control production mode.
- Federation/MSP features.
- Public API marketplace.
- Advanced compliance automation.
- AI+ content search for external testers until content extraction is validated with real files.

---

## P0 Blockers

1. **Schema drift: `files` vs `artifacts`.**  
   V1 migrations create `files`; V1.5+ migrations refer to `artifacts`, `workspace_artifacts`, and artifact columns. Pick a canonical table name and migrate APIs accordingly. Current references include `supabase/migrations/003_v15_to_v4_features.sql` lines 32, 92, 229, and 388.

2. **API auth boundary is too loose for tester traffic.**  
   Several service-role endpoints accept `tenantId` in request bodies. Add shared token verification and derive tenant authorization server-side before querying with service role. Representative examples: `api/discovery/scan.ts` line 37, `api/search/query.ts` line 31, `api/workspaces/create.ts` lines 28-29, and `api/remediation/execute.ts` line 34.

3. **Demo mode remains the default shell behavior.**  
   `VersionProvider` and Document Control default to demo mode. For Phase 1, demo surfaces should be explicit and not quietly mixed into real tester flows.

4. **Frontend has broad prototype imports and navigation.**  
   The shell imports many non-V1 screens up front. This increases bundle size and presents features that are not ready to test.

5. **Testing is effectively absent.**  
   There is no active test harness in the repo. Add focused smoke coverage before inviting testers.

6. **Metadata search references a missing full-text column.**  
   `api/search/query.ts` calls `.textSearch('search_vector', ...)`, but the V1 migration creates an expression index with `to_tsvector(...)` and does not define a `search_vector` column. Add a generated `search_vector` column or change the query strategy.

7. **Deployment cron configuration is incomplete.**  
   `vercel.json` schedules only `/api/cron/daily-scan`, while additional cron endpoints exist for anomaly detection, retention policies, and storage snapshots. Decide what belongs in Phase 1 and configure or gate the rest.

---

## Recommended Build Order

1. Normalize schema and API table contracts.
2. Add API auth/tenant validation helper and apply it to V1 endpoints.
3. Gate demo/prototype modules and reduce default navigation to V1.
4. Finish wiring V1 screens to real APIs.
5. Add remediation dry-run.
6. Add Vitest smoke tests.
7. Implement route-level code splitting.
8. Clean docs and create beta testing guide.

---

## Today's Vercel Deployment Plan

For the initial Vercel deployment, ship the frontend only and intentionally exclude the root `api/` folder with `.vercelignore`.

Rationale:

- Vercel treats a root `api/` directory as serverless functions.
- The current backend is not Phase 1 hardened yet.
- Excluding `api/` avoids deploying unfinished backend functions while still allowing the Vite frontend to go live today.

Current `.vercelignore`:

```text
api/
```

After the frontend is live, re-enable backend deployment only after the P0 API/schema/auth items in `V1_TESTABLE_QUEUE.md` are resolved.

---

## Review Notes By Area

### Database

- Canonicalize `files` vs `artifacts`.
- Add or remove generated search vector support consistently.
- Re-run migrations against a clean Supabase project before frontend testing.

### API

- Add a shared backend client factory for Supabase env validation.
- Add `requireTenantAccess(req)` or equivalent auth helper.
- Stop trusting caller-supplied `tenantId` without token/tenant verification.
- Add dry-run support before destructive remediation.

### Frontend

- Replace global demo defaults with environment-controlled behavior.
- Gate non-V1 navigation and remove unfinished modules from the default tester path.
- Keep Oracle search real-data wiring and repeat the pattern for Dashboard, Workspaces, and Remediation.
- Add route-level lazy loading after the V1 surface is narrowed.

### Documentation

- Treat `V1_TESTABLE_QUEUE.md` as active queue.
- Treat this review as the current readiness assessment.
- Update production-ready claims before sharing docs externally.

---

## Code Splitting Recommendation

Code splitting has received a first implementation pass. `App.tsx` now lazy-loads major tab content and forensic overlays, and `vite.config.ts` defines stable vendor chunks for React, platform SDKs, charts, motion, MUI, and Radix.

Completed:

- Providers, layout shell, sidebar, and active V1 shell remain eager.
- Tab content components are lazy loaded.
- Dynamic content is wrapped in `Suspense`.
- Prototype and non-V1 screens load only when opened.
- Production build no longer emits the large chunk warning.

Future tuning:

- Gate non-V1 routes before beta.
- Consider removing heavy unused libraries after the V1 surface is narrowed.
- Add route-level smoke tests after navigation is stable.

---

## Documentation Notes

- Keep `IMPLEMENTATION_TASKS.md` as the broad production-readiness backlog.
- Use `V1_TESTABLE_QUEUE.md` as the active engineering queue.
- Record architecture/security/schema decisions in `docs/3-standards/DECISION-LOG.md`.
- Update docs that still claim full production readiness before beta testers see them.
