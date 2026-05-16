# AI+ Usage Guardrails

**Status:** Schema scaffold, successful-action ledger recording, and opt-in credit enforcement started. Admin usage meters are still required before paid AI+ launch. Not required for local/pre-release V1.5 validation.

V1.5 now has the technical path for content indexing, semantic search, summaries, PII scans, and review-first metadata suggestions. Before AI+ is sold as a paid add-on, Aethos needs usage controls so content AI is valuable without becoming unlimited cost exposure.

---

## Packaging Rule

Base remains metadata intelligence:

- Discovery
- Oracle metadata search
- Workspaces
- ownership, exposure, freshness, and remediation signals
- no document-body reading

AI+ is content intelligence:

- opt-in content indexing
- semantic search across indexed chunks
- summaries
- PII scans
- content-aware metadata suggestions

Use this language:

> Discover everything. Deep-index what matters first.

Avoid "index everything" as the default content-AI motion.

---

## Required Controls Before Paid AI+

- Tenant-level AI+ enablement: already started with `tenants.ai_features_enabled`.
- Admin-visible readiness: already started with Admin Center `AI+ Readiness`.
- Monthly usage ledger: schema scaffolded in `supabase/migrations/009_ai_credit_accounting.sql`.
- Monthly AI credit budget: schema scaffolded in `ai_credit_balances` and `tenant_ai_settings`.
- Per-action credit accounting: schema scaffolded in `ai_credit_ledger`; successful AI+ actions now record ledger rows.
- Per-tenant hard cap or admin-approved overage: opt-in API enforcement is wired through `tenant_ai_settings.credits_enforced` and `allow_overage`.
- Bulk-job queue for large indexing/enrichment jobs: schema scaffolded in `ai_job_queue`; worker processing not wired yet.
- Cached-result reuse for summaries, PII scans, suggestions, and common answers: partially started for summaries.

---

## AI Credit Model

Do not expose tokens to customers. Use AI Credits as normalized action units.

Suggested starting credit weights:

| Action | Credit Cost | Notes |
| --- | ---: | --- |
| Semantic search query | 1 | Query embedding plus vector retrieval |
| Summarize document | 5 | Cache hits should cost 0 or 1 |
| PII scan document | 5 | Regex-only pass can stay free; AI assist consumes credits |
| Metadata suggestion for one file | 2 | Batchable and review-first |
| Conversational Oracle answer | 10 | Higher risk because context and output can grow |
| Large-document deep summary | 20-50 | Admin-approved or queued |

Suggested monthly entitlements:

| Tier | Monthly AI Credits | Overage |
| --- | ---: | --- |
| Base | 0 content credits | Upgrade to AI+ |
| AI+ Starter | 5,000 | Buy 5,000-credit packs |
| AI+ Growth | 15,000 | Expansion pack or tier upgrade |
| AI+ Scale | 50,000 | Expansion pack or custom |

---

## Technical Foundation

`supabase/migrations/009_ai_credit_accounting.sql` creates:

- `ai_credit_balances`
- `ai_credit_ledger`
- `ai_job_queue`
- `tenant_ai_settings`

Minimum fields in `ai_credit_ledger`:

- `tenant_id`
- `user_id`
- `file_id`
- `action_type`
- `credit_cost`
- `model`
- `input_tokens`
- `output_tokens`
- `cached`
- `status`
- `created_at`

Minimum endpoint behavior:

- Check `ai_features_enabled`.
- Check monthly credit budget when `credits_enforced = true`.
- Prefer cached results before charging.
- Record usage after successful AI work.
- Queue or block bulk jobs when over budget.
- Never block V1 metadata workflows when AI+ credits are exhausted.

The migration establishes launch accounting primitives, and the V1.5 pre-release API records successful AI+ usage into the ledger. If `credits_enforced = true`, AI+ endpoints check the tenant's remaining monthly credits before model work and return a graceful `402 CREDIT_LIMIT_EXCEEDED` response when the tenant is out of capacity. Paid AI+ should not launch until admin usage meters and over-budget queue behavior are wired.

---

## Graceful Degradation

When AI+ is unavailable or over budget:

- Discovery continues.
- Metadata Oracle continues.
- Workspaces continue.
- Remediation dry-runs continue.
- Cached summaries and prior suggestions remain visible.
- New bulk AI jobs pause or queue.
- Admin sees the budget/blocker reason.

---

## V1.5 Validation Boundary

For the current pre-release/local V1.5 pass, it is acceptable that AI+ actions are controlled by:

- `OPENAI_API_KEY`
- `tenants.ai_features_enabled`
- manual file-level `Index Content`
- Admin `AI+ Readiness`

Before paid AI+ launch, the accounting and budget controls above should become P0.
