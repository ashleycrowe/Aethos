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
VITE_MICROSOFT_TENANT_ID=
VITE_API_BASE_URL=/api
```

Backend-only env vars should not use the `VITE_` prefix.

---

## Test Status

Automated tests are not configured yet. Add Vitest before Phase 1 backend beta testing.
