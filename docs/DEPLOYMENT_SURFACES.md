# Aethos Deployment Surfaces

**Last Updated:** 2026-05-12

This project treats runtime surface as a product boundary, not just a URL.

## Current Domains

| Domain | Surface | Default Mode | Purpose |
| --- | --- | --- | --- |
| `app.aethoswork.com` | Live | Live Mode | Real client and live-tenant testing. No fixture data should appear as customer data. |
| `demo.aethoswork.com` | Demo | Demo Mode | Sales/demo walkthroughs using optimized fixture data. |
| Localhost | Local | Env/local override | Development and QA. Browser override is allowed locally. |

Legacy `*.aethos.com` hostnames are still recognized by the runtime guard while DNS/domain setup transitions.

## Runtime Rules

- `app.aethoswork.com` is domain-locked to Live Mode.
- `demo.aethoswork.com` is domain-locked to Demo Mode.
- Local development can still use the browser override for fast switching.
- `VITE_AETHOS_SURFACE` can explicitly set `live`, `demo`, `pre-release`, or `local` for deployments where hostname detection is not enough.
- `VITE_DEMO_MODE` can still set a default, but the app/domain guard wins for known live/demo client domains.
- `VITE_ALLOW_DEMO_OVERRIDE=true` should only be used for internal QA deployments, never the live client URL.

## Vercel Environment Targets

For the live deployment:

```text
VITE_AETHOS_SURFACE=live
VITE_DEMO_MODE=false
VITE_ALLOW_DEMO_OVERRIDE=false
```

For the demo deployment:

```text
VITE_AETHOS_SURFACE=demo
VITE_DEMO_MODE=true
VITE_ALLOW_DEMO_OVERRIDE=false
```

For a future pre-release demo deployment:

```text
VITE_AETHOS_SURFACE=pre-release
VITE_DEMO_MODE=true
VITE_ALLOW_DEMO_OVERRIDE=true
```

## Feature Promotion Path

New capability should move through these states:

1. `pre-release`: available only on an internal pre-release demo URL.
2. `demo`: stable enough for customer-facing demo fixtures.
3. `live`: backed by real APIs, tenant-scoped data, empty/error states, and tests.

Before a feature moves to `live`, confirm:

- It does not rely on mock data in Live Mode.
- It has a clear empty state for tenants with no indexed content.
- It shows errors honestly instead of falling back to fixture data.
- Any destructive or source-system-changing action defaults to dry-run or explicit confirmation.
- The feature flag is documented in the build queue or relevant roadmap.
