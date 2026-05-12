# Aethos Beta Testing Guide

**Last Updated:** May 4, 2026  
**Audience:** Internal testers and early pilot reviewers  
**Current Deployment Mode:** Vercel deployment with frontend and API routes enabled

---

## What Is Testable Today

- Vite/React frontend deployment.
- Main shell, navigation, theme/version controls, and prototype screens.
- V1-facing UI flows for Intelligence, Oracle, Nexus, Remediation, Reports, and Admin.
- API-backed V1 flows where Microsoft, Supabase, and backend environment variables are configured.
- Demo/mock data surfaces when Demo Mode is enabled or when a backend call falls back gracefully.

---

## Expected Limitations

- API routes are deployed, but may fail if Vercel environment variables are missing or invalid.
- Microsoft OAuth values must be configured in Vercel before real login/discovery testing.
- Supabase-backed flows require real `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Backend routes require `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and any provider/API secrets used by the route.
- Document Control remains demo-mode only.

These are expected during the first testable V1 preparation phase.

---

## Live/Demo Surfaces

- `app.aethoswork.com` is the live-client surface and should run Live Mode.
- `demo.aethoswork.com` is the customer demo surface and should run Demo Mode.
- Localhost can still use the floating version toggle for browser-session mode switching.
- Use Demo Mode when validating demo storytelling, layout, and fixture-based feature walkthroughs.
- Use Live Mode when testing Microsoft auth, Supabase-backed data, API error handling, workspace APIs, and remediation dry-run behavior.
- See `docs/DEPLOYMENT_SURFACES.md` for environment variables and the future pre-release demo lane.

---

## Tester Checklist

- [ ] App loads on the Vercel URL without a blank screen.
- [ ] Sidebar navigation works across V1-visible sections.
- [ ] Search input focuses or routes to the Oracle experience.
- [ ] `app.aethoswork.com` shows `Live: real tenant data`.
- [ ] `demo.aethoswork.com` shows `Demo: fixture data`.
- [ ] Demo Mode can be enabled and disabled from the floating toggle on localhost/internal QA only.
- [ ] Loading states appear when switching lazy-loaded views.
- [ ] No overlapping text or broken layout on desktop.
- [ ] Key screens render on mobile/tablet viewport widths.
- [ ] API-backed actions either return real data or fail gracefully with clear fallback states.
- [ ] Workspace list/create/detail flows work in Live Mode against the configured test tenant.
- [ ] Remediation actions default to dry-run behavior.

---

## Known Issues To Report

Please capture:

- Browser and viewport size.
- The page/tab being tested.
- Screenshot of the issue.
- Console errors if visible.
- Whether the problem blocks navigation or is cosmetic.

---

## Not In Scope For This Beta Pass

- Real Microsoft Graph discovery in production.
- Real remediation actions.
- Slack/Google provider onboarding.
- AI+ content extraction/search in production.
- Public API, webhooks, federation, and compliance automation.

---

## Next Milestone

The next beta milestone is a hardened V1 backend slice:

`auth -> discovery -> search -> workspace -> remediation dry-run`

Track this in `V1_TESTABLE_QUEUE.md`.
