# Frontend Loading/Error/Empty State Audit

**Last Updated:** April 30, 2026  
**Scope:** V1 beta-facing frontend surfaces

---

## Current Status

The app now has a shared lazy-view loading fallback in `src/app/App.tsx`, so route-level chunks do not switch to a blank viewport.

Because the deployed Vercel app intentionally excludes `/api`, beta-facing UI must handle API failures as expected limitations until the backend is re-enabled.

---

## V1 Screen Audit

| Screen | Current State | Beta Requirement |
| --- | --- | --- |
| Intelligence | Lazy-loaded. Mostly prototype/dashboard data. | Must render without blank states; real metrics later. |
| Oracle | Lazy-loaded. Metadata search has loading/error/empty handling around API calls. | In deployed frontend-only mode, API failure should show a graceful error. |
| Nexus | Lazy-loaded. Workspace UI still needs real API wiring. | Must not imply production write-back until backend is enabled. |
| Remediation | Lazy-loaded. Real remediation should remain parked/dry-run only. | Must avoid destructive-action language for beta. |
| Reports | Lazy-loaded. Prototype reporting surface. | Should be labeled or understood as preview data. |
| Admin | Lazy-loaded. Large screen chunk remains, but no initial bundle penalty. | Must clearly reflect placeholder env/config where applicable. |
| Document Control | Demo mode only. | Keep out of default beta narrative unless explicitly previewing. |

---

## Follow-Up Work

- Add explicit "backend parked" copy or toast for API-backed actions in the deployed frontend.
- Gate Document Control and non-V1 preview modules from tester navigation.
- Add Storybook or component snapshots later if the design system stabilizes.
- Add Playwright smoke checks after routing/navigation is finalized.
