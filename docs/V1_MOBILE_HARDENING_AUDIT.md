# V1 Mobile Hardening Audit

**Last Updated:** May 14, 2026  
**Scope:** First testable V1 surfaces at phone/tablet/desktop widths.

## Automated Coverage

The V1 mobile hardening contract now checks the core V1 surfaces together:

- App shell
- Admin Center
- Operational Intelligence
- Oracle Search
- Remediation
- Workspaces

Covered by `src/app/components/MobileHardening.test.ts`:

- Horizontal overflow containment on core V1 screens.
- 44px-ish minimum touch targets through `min-h-[44px]`, `min-h-12`, or Tailwind's `min-h-11`.
- Progressive grids instead of desktop-only dense layouts.
- Mobile-first blur reduction before larger breakpoint blur effects.
- Long-label and file-name wrapping.

## Queue Items Covered By Code/Tests

- Remove accidental horizontal overflow.
- Keep primary touch targets at least 44px high.
- Keep compact interactive text readable and scale it up at larger breakpoints.
- Preserve tiny metadata labels for non-interactive/supporting text.
- Use progressive dashboard grids.
- Keep primary dashboard/report cards stacked on mobile.

## Still Needs Browser/Device Verification

These are intentionally still manual:

- Test at 375px, 390px, 768px, 820px, 1024px, 1280px, and 1920px.
- Confirm dense tables/lists convert cleanly to mobile cards where they appear.
- Confirm modals are full-screen or bottom-sheet style on mobile and centered on desktop.
- Confirm forms remain readable with stacked fields/buttons and iOS keyboard-safe spacing.
- Confirm charts render with responsive containers and reduced mobile axis pressure.
- Test with the existing bottom nav.
- Run a final iPhone SE or Chrome DevTools 375px smoke pass across the core V1 path.

## Suggested Manual Smoke Path

1. Start in Live Mode with `VITE_DEMO_MODE=false`.
2. Open Admin Center and confirm setup/scan controls do not overflow at 375px.
3. Run or inspect Discovery status.
4. Open Oracle Search and test filters, search input, no-results, and result cards.
5. Open Operational Intelligence and inspect report cards, signal queue, and metadata quality.
6. Open Workspaces and test workspace strip, trust filters, Team View, handoff packet, and audit trail.
7. Open Remediation and test filters, candidate cards, selection, copy/export actions, and dry-run confirmation.
