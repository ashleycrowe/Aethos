# Operations Hub Setup

**Purpose:** Enable the internal Aethos Operations Hub for beta support, product intelligence, and AI-assisted ticket triage.

The hub covers:

- support ticket intake
- automated product-area and sentiment tagging
- knowledge articles with optional pgvector embeddings
- Sales/Success, Support, and Product Intelligence views
- AI+ credit visibility for customer-success workflows

---

## 1. Supabase Migration

Apply:

```text
supabase/migrations/011_operations_hub.sql
```

It creates:

- `operations_user_roles`
- `support_tickets`
- `knowledge_articles`
- `match_knowledge_articles(...)`

It also enables RLS policies for:

- `sales_success`: billing and landing-page intake
- `support`: questions and issues
- `product_admin`: all operations intelligence

Assign internal roles after the user exists in `users`:

```sql
insert into operations_user_roles (tenant_id, user_id, role)
values ('<tenant-id>', '<user-id>', 'product_admin')
on conflict (user_id, role) do update
set active = true;
```

Other allowed roles:

```text
sales_success
support
product_admin
```

---

## 2. OpenAI

Ticket auto-triage uses:

```env
OPENAI_API_KEY=
```

Model:

```text
gpt-4o-mini
```

If `OPENAI_API_KEY` is missing, the backend uses deterministic keyword triage so ticket creation still works.

---

## 3. Backend APIs

New API routes:

```text
GET/POST /api/support/tickets
POST     /api/support/search
POST     /api/support/intelligence
```

`/api/support/tickets` creates a ticket and immediately writes:

- `product_area_tag`
- `sentiment`
- `priority`

`/api/support/search` searches both:

- resolved or visible `support_tickets`
- published `knowledge_articles`

`/api/support/intelligence` powers the dashboard views:

- Sales/Success queue and AI+ credit panel
- Support queue and answer finder
- Product Intelligence feature/frustration/anomaly summaries

---

## 4. Frontend

The internal view is mounted as:

```text
Ops Hub
```

Component:

```text
src/app/components/OperationsHub.tsx
```

Visible views depend on backend role:

- `sales_success`: billing and landing-page tickets
- `support`: questions and issues
- `product_admin`: all views

---

## 5. Knowledge Articles

Seed an article:

```sql
insert into knowledge_articles (tenant_id, title, content, category, product_area_tag, status)
values (
  '<tenant-id>',
  'How to re-authorize Microsoft Graph consent',
  'Open Admin Center, review AI+ Action Required, then use Re-Authenticate to reopen Microsoft consent.',
  'troubleshooting',
  'auth',
  'published'
);
```

Embeddings are optional for this pass. The search API currently performs keyword search across tickets and articles. The schema is ready for semantic KB search when article embedding generation is added.

---

## 6. Validation

1. Apply migration `011_operations_hub.sql`.
2. Assign your user `product_admin` in `operations_user_roles`.
3. Confirm `OPENAI_API_KEY` is present for AI triage.
4. Open Aethos and go to `Ops Hub`.
5. Confirm Product Intelligence shows:
   - most requested features
   - frequent frustrations
   - anomaly alerts
6. Search a phrase in Support view and confirm both ticket and article columns render.
7. Confirm Sales/Success view shows the AI+ credit control panel when tenant credit settings exist.

## Known Remaining Work

- Add article embedding generation and semantic KB search.
- Add ticket mutation actions for assigning, resolving, and editing summaries.
- Move the existing Admin Center diagnostics issue logs into this hub when the customer-management/support dashboard is expanded.
