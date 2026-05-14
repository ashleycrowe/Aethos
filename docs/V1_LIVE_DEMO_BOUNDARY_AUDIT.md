# V1 Live/Demo Boundary Audit

**Last Updated:** May 14, 2026  
**Scope:** First testable V1 runtime surfaces.

## Boundary Rule

Live Mode must show only tenant-backed V1 surfaces or honest empty/error states. Demo fixtures remain available in Demo Mode for sales and walkthroughs, but they must not appear as customer data on the live app surface.

## Live Mode Allow-List

The app shell currently allows these tabs in Live Mode:

- Oracle Search (`oracle`)
- Operational Intelligence (`insights`)
- Workspaces (`nexus`)
- Remediation (`archival`)
- Admin Center (`admin`)

These surfaces have smoke coverage for live/demo behavior and mobile readiness.

## Demo/Prototype Surfaces Kept Out Of Live Mode

The following routes remain outside the Live Mode allow-list:

- Reporting Center (`reports`) - demo-only until live-backed.
- Document Control (`documents`) - deferred until production mode.
- Prototype Lab (`lab`)
- Design Center (`design`)
- Tag Management demos (`tag-demo`, `tag-flow-demo`)
- Voyager, Pulse, and People surfaces (`voyager`, `pulse`, `people`) - available as future/prototype routes, not first V1 live surfaces.

If opened while not allowed, the app shell routes to the coming-soon boundary instead of rendering fixture-heavy UI.

## Screen Audit Summary

| Surface | Live Mode behavior | Demo data status |
| --- | --- | --- |
| Oracle Search | Uses `searchFiles` against indexed Microsoft metadata. Live prompts avoid fake people/projects. | Demo search results and federated provider claims are gated behind Demo Mode. |
| Operational Intelligence | Uses `report-summary`, last scan, live signals, and no-data Path to Value states. | Demo stream and Identity prototype tab are gated behind Demo Mode. |
| Workspaces | Uses workspace list/detail/create APIs and shows honest empty/API failure states. | Context workspaces are used only in Demo Mode. |
| Remediation | Loads live candidates from indexed `files` metadata and defaults to dry-run. | Generated remediation items are used only in Demo Mode. |
| Admin Center | Shows session, scan status, capability status, diagnostics, and mode controls. | Explicitly labels Demo Mode when active. |

## Preserved Demo Fixture Sources

Demo fixture behavior is intentionally preserved for:

- `demo.aethoswork.com`
- local/internal QA sessions with Demo Mode enabled
- the V1 seed SQL used for local test tenants
- component-level demo datasets that sit behind the app shell's demo/prototype boundary

## Verification Hooks

- `src/app/App.test.ts` verifies the Live Mode tab allow-list excludes demo/prototype/document routes.
- Component smoke tests verify each V1 surface does not silently fall back to demo data in Live Mode.
- `src/app/components/MobileHardening.test.ts` verifies core V1 screens retain mobile hardening guardrails.

## Remaining Manual Checks

- Verify `app.aethoswork.com` shows `Live: real tenant data`.
- Verify `demo.aethoswork.com` shows `Demo: fixture data`.
- Walk the live path after Microsoft sign-in: Admin setup, Discovery, Oracle Search, Workspaces, and Remediation dry-run.
