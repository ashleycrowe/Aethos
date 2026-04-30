# Aethos Beta Testing Guide

**Last Updated:** April 30, 2026  
**Audience:** Internal testers and early pilot reviewers  
**Current Deployment Mode:** Frontend-only Vercel deployment

---

## What Is Testable Today

- Vite/React frontend deployment.
- Main shell, navigation, theme/version controls, and prototype screens.
- V1-facing UI flows for Intelligence, Oracle, Nexus, Remediation, Reports, and Admin.
- Demo/mock data surfaces where still enabled.

---

## Expected Limitations

- The production Vercel deployment intentionally excludes `/api` via `.vercelignore`.
- Any deployed UI action that calls `/api/...` may fail until the backend is re-enabled.
- Microsoft OAuth values may still be placeholders unless configured in Vercel.
- Supabase-backed flows require real `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Document Control remains demo-mode only.

These are expected during the frontend-only beta preparation phase.

---

## Tester Checklist

- [ ] App loads on the Vercel URL without a blank screen.
- [ ] Sidebar navigation works across V1-visible sections.
- [ ] Search input focuses or routes to the Oracle experience.
- [ ] Version toggle does not expose confusing unfinished flows by default.
- [ ] Loading states appear when switching lazy-loaded views.
- [ ] No overlapping text or broken layout on desktop.
- [ ] Key screens render on mobile/tablet viewport widths.
- [ ] API-backed actions fail gracefully where backend is parked.

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
