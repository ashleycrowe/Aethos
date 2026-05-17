# V1.5 AI+ Setup Checklist

**Purpose:** Steps Ashley needs to complete before V1.5 AI+ manual testing.

V1.5 AI+ covers content indexing, semantic search, summaries, PII scans, and review-first AI+ metadata suggestions. Keep this off for normal V1 validation.

Paid AI+ launch also needs usage controls. See `docs/AI_PLUS_USAGE_GUARDRAILS.md`.

---

## 1. OpenAI

Create or use an OpenAI API key with access to:

- `text-embedding-3-small`
- `gpt-4o-mini`

Add the key as a backend-only secret:

```env
OPENAI_API_KEY=sk-...
```

Do not create `VITE_OPENAI_API_KEY`. Anything with `VITE_` can be exposed to the browser.

Local `.env` should include:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

Vercel should also have `OPENAI_API_KEY` set for the environment you are testing.

---

## 2. Supabase

Apply the V1.5 migration:

```text
supabase/migrations/003_v15_to_v4_features.sql
supabase/migrations/009_ai_credit_accounting.sql
supabase/migrations/010_graph_consent_recovery.sql
```

It creates or updates:

- `vector` extension
- `tenants.ai_features_enabled`
- `content_embeddings`
- `content_summaries`
- `pii_detections`
- `semantic_search(...)`
- `tenant_ai_settings`
- `ai_credit_balances`
- `ai_credit_ledger`
- `ai_job_queue`
- `tenants.api_consent_revoked`
- `tenants.missing_graph_scopes`

If the migration was already applied before the latest changes, manually confirm these two statements have run:

```sql
create extension if not exists vector;

alter table tenants
add column if not exists ai_features_enabled boolean default false;
```

Enable AI+ only for the intended test tenant:

```sql
update tenants
set ai_features_enabled = true,
    subscription_tier = 'v1.5'
where id = '<tenant-id>';

insert into tenant_ai_settings (tenant_id, monthly_credit_limit, trial_credit_grant, indexing_file_limit)
values ('<tenant-id>', 5000, 100, 1000)
on conflict (tenant_id) do update
set monthly_credit_limit = excluded.monthly_credit_limit,
    trial_credit_grant = excluded.trial_credit_grant,
    indexing_file_limit = excluded.indexing_file_limit;
```

Keep strict credit enforcement off for the first manual pass unless you are explicitly testing the out-of-credits flow:

```sql
update tenant_ai_settings
set credits_enforced = false,
    allow_overage = false
where tenant_id = '<tenant-id>';
```

Useful validation queries:

```sql
select id, name, subscription_tier, ai_features_enabled
from tenants
order by created_at desc;

select api_consent_revoked, missing_graph_scopes, last_graph_error
from tenants
where id = '<tenant-id>';

select count(*) as indexed_chunks
from content_embeddings
where tenant_id = '<tenant-id>';

select count(*) as pii_scans
from pii_detections
where tenant_id = '<tenant-id>';

select count(*) as pending_ai_suggestions
from metadata_suggestions
where tenant_id = '<tenant-id>'
  and suggestion_type = 'content_enrichment'
  and status = 'pending';

select monthly_credit_limit, trial_credit_grant, indexing_file_limit, credits_enforced
from tenant_ai_settings
where tenant_id = '<tenant-id>';

select action_type, credit_cost, cached, status, created_at
from ai_credit_ledger
where tenant_id = '<tenant-id>'
order by created_at desc
limit 20;

select period_month, monthly_credit_limit, credits_used, status
from ai_credit_balances
where tenant_id = '<tenant-id>'
order by period_month desc;
```

---

## 3. Vercel

For the V1.5 test deployment, confirm these server env vars:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

Frontend env vars remain:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_MICROSOFT_CLIENT_ID=
VITE_API_BASE_URL=/api
VITE_DEMO_MODE=false
```

For local V1.5 testing, use Live Mode:

```env
VITE_AETHOS_SURFACE=local
VITE_DEMO_MODE=false
VITE_ALLOW_DEMO_OVERRIDE=true
```

Then use Admin Center if you need to force Live Mode in the browser session.

Important: V1.5 AI+ is intentionally not promoted for the normal live/demo surfaces yet. Validate locally or in an internal pre-release setup where Live Mode can call APIs.

---

## 4. Microsoft

The existing Microsoft app registration must keep these delegated Graph permissions:

- `User.Read`
- `Files.Read.All`
- `Sites.Read.All`
- `Group.Read.All`

V1.5 content indexing uses the signed-in user token to call:

```text
GET https://graph.microsoft.com/v1.0/drives/{driveId}/items/{fileId}/content
```

That means the tester must sign in with an account that can actually read the selected Microsoft file. If the file is restricted, indexing should fail with an actionable error rather than silently pretending content was indexed.

No application permission flow is required for this V1.5 pass.

If an admin revokes a previously granted permission, AI+ content indexing should trap the Microsoft Graph 403, set `tenants.api_consent_revoked = true`, and show Admin Center `AI+ Action Required`. Use the Admin Center `Re-Authenticate` button to reopen Microsoft consent with `prompt=consent`.

---

## 5. Manual V1.5 Validation Path

1. Sign in with Microsoft in Live Mode.
2. Run Admin Discovery so files and Graph drive metadata exist in Supabase.
3. Open Admin Center and check `AI+ Readiness`.
4. Fix any readiness blockers:
   - Missing `OPENAI_API_KEY`
   - Tenant AI+ flag off
   - Zero indexed chunks
   - Microsoft Graph consent revoked
5. Open Oracle.
6. Search for a real Microsoft file.
7. Click `Index Content` on a small file.
8. Toggle/use AI+ Content Search and confirm content matches appear.
9. Click `Scan PII` and confirm the risk badge/result feedback.
10. Click `Summarize` and confirm summary feedback.
11. Open Intelligence Center -> Metadata Quality.
12. Click `Run AI+ Suggestions`.
13. Review pending suggestions and accept/edit/reject/block them.

---

## 6. Guardrail Checkpoints

These are not visual QA checks. They verify V1.5 behaves like the pricing model.

### Cache Test

1. Click `Summarize` on an indexed file.
2. Wait 60 seconds.
3. Click `Summarize` again.

Expected result: the second response should reuse the cached summary. Once credit enforcement is wired, the cached response should not create a full-cost ledger debit.

Ledger check: `ai_credit_ledger` should show the first `summarize_document` entry with a positive credit cost and the cached repeat with `cached = true` and `credit_cost = 0`.

Admin check: Admin Center should show the monthly Intelligence Credit usage meter and recent ledger rows.

### Graceful Degrade Test

Temporarily disable AI+ for the test tenant:

```sql
update tenants
set ai_features_enabled = false
where id = '<tenant-id>';
```

Expected result: AI+ content actions show a clear upgrade/setup blocker, while metadata Oracle, Discovery, Workspaces, and cached or previously generated results remain usable.

Turn AI+ back on before continuing:

```sql
update tenants
set ai_features_enabled = true,
    subscription_tier = 'v1.5'
where id = '<tenant-id>';
```

### Credit Limit Test

Only run this after the happy-path V1.5 flow works.

```sql
update tenant_ai_settings
set credits_enforced = true,
    monthly_credit_limit = 1,
    allow_overage = false
where tenant_id = '<tenant-id>';
```

Expected result: a higher-cost action such as `Summarize` or `Scan PII` with AI assist should return a clear out-of-credits message instead of calling OpenAI. Metadata search and other V1 workflows should continue.

Restore the validation budget afterward:

```sql
update tenant_ai_settings
set credits_enforced = false,
    monthly_credit_limit = 5000
where tenant_id = '<tenant-id>';
```

### Regex Efficiency Test

Run `Scan PII` on an indexed file that should not contain emails, SSNs, phone numbers, card numbers, or IP addresses.

Expected result: the API completes a deterministic regex-only pass, reports low/no findings, and skips OpenAI AI-assist work unless explicitly requested or deterministic patterns make a deeper pass useful.

Ledger check: clean regex-only scans should record `pii_scan_regex` with `credit_cost = 0`. AI-assisted scans should record `pii_scan_ai_assist` with a positive credit cost.

### Microsoft Consent Recovery Test

Only run this if you are comfortable temporarily changing the Microsoft app consent state.

1. Revoke or remove `Files.Read.All` consent for Aethos Production Tenant in Entra ID.
2. Try Oracle `Index Content` on a Microsoft file.
3. Confirm the user-facing toast says an Aethos admin needs to re-authorize document access.
4. Confirm no `content_indexing` credit debit was added for the failed attempt.
5. Open Admin Center and confirm `AI+ Action Required` shows the missing scope and scope documentation link.
6. Click `Re-Authenticate` and complete Microsoft consent.
7. Refresh AI+ readiness and confirm the consent blocker clears.

---

## Expected Blockers Are Okay

Before setup is complete, the product should clearly report blockers instead of failing vaguely. Expected blockers include:

- OpenAI key missing
- Supabase migration not applied
- Tenant AI+ flag off
- No indexed content chunks
- Microsoft account cannot download the selected file

Once those are resolved, Admin Center `AI+ Readiness` should move toward ready.
