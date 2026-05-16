# Aethos Development Commands

**Last Updated:** April 30, 2026

---

## Package Manager Note

The project is intended to be a pnpm monorepo, but this checkout currently has a root `package-lock.json` and this environment does not have `pnpm` or Corepack available. Use npm locally unless/until the repo is normalized around pnpm.

---

## Local Development

```bash
npm install
npm run dev
```

Default Vite URL:

```text
http://localhost:5173
```

---

## Production Build Verification

```bash
npm run build
```

Expected output:

- Vite build completes successfully.
- `dist/` is generated.
- No large chunk warning after the current code-splitting pass.

---

## Vercel Frontend Deployment

Current Phase 1 deployment is frontend-only.

```text
.vercelignore -> api/
```

Vercel settings:

```text
Framework: Vite
Build command: npm run build
Output directory: dist
```

Required frontend env vars:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_MICROSOFT_CLIENT_ID=
VITE_API_BASE_URL=/api
VITE_DEMO_MODE=false
```

Backend-only env vars should not use the `VITE_` prefix.

Required backend env vars:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Optional V1.5 AI+ backend env vars:

```env
OPENAI_API_KEY=
```

V1.5 AI+ also requires the `003_v15_to_v4_features.sql` migration, including pgvector, and `tenants.ai_features_enabled = true` for the specific test tenant. Keep the flag off for normal V1 validation. Microsoft content indexing uses delegated Graph access from the signed-in user, so the app registration must keep `Files.Read.All` and `Sites.Read.All`.

Detailed V1.5 setup checklist: `docs/V15_AI_PLUS_SETUP_CHECKLIST.md`.

---

## Test Status

Run `npm run test` for Vitest coverage and `npm run build` for production bundle validation.
