# Metadata Classification Audit

**Status:** Working audit notes  
**Last Updated:** 2026-05-12  
**Purpose:** Preserve the current state, gaps, and recommended roadmap for Aethos metadata classification, tag suggestions, enrichment, and workspace auto-organization.

---

## Why This Matters

Auto-metadata classification is likely one of Aethos's highest-value selling points. It creates value before a customer has to reorganize files, and it makes the rest of the product feel smarter:

- Search gets better.
- Workspaces become easier to create.
- Remediation candidates become more explainable.
- AI-readiness becomes visible.
- Customers see messy Microsoft 365 data become usable.

This should be treated as a core product pillar, not a side utility.

---

## Current Implementation Snapshot

### Database Support Exists

The V1 schema already has useful fields on `files`:

- `ai_tags`
- `ai_category`
- `ai_suggested_title`
- `ai_summary`
- `ai_enriched_at`
- `intelligence_score`
- `risk_score`
- `metadata`

Search indexes include AI title/summary fields, and `ai_tags` has a GIN index.

### Backend Enrichment Exists, But Is V1.5-Oriented

`api/intelligence/enrich.ts` can:

- Select unenriched files for a tenant.
- Send filename/path/owner/size/extension/provider context to OpenAI.
- Write `ai_suggested_title`, `ai_tags`, `ai_category`, `ai_summary`, and `intelligence_score`.

Important limitations:

- It depends on `OPENAI_API_KEY`.
- It is not surfaced clearly in the V1 first-run setup flow.
- It does not currently expose suggestion confidence or rationale.
- It writes directly to final AI fields rather than storing pending suggestions first.
- It does not appear to track accept/reject/edit history.

### Search Uses Metadata Enrichment

`api/search/query.ts` searches against:

- filename
- path
- owner
- `ai_suggested_title`
- `ai_category`
- `ai_tags`

This is a good foundation. It means better metadata immediately improves search quality.

### UI Prototype Coverage Is Strong

Relevant components:

- `BulkTagEditor.tsx`
- `FileTagEditor.tsx`
- `TagManagementDemo.tsx`
- `TagManagementFlowDemo.tsx`
- `AutoWorkspaceSuggestion.tsx`
- `WorkspaceCreationWizard.tsx`
- `WorkspaceSyncManager.tsx`
- `WorkspaceSettingsPanel.tsx`
- `TagCloud.tsx`
- `OracleMetadataSearch.tsx`

The demo components tell the right story:

- AI-suggested tags.
- User-applied tags.
- Bulk tagging.
- Tag cloud.
- Workspace auto-sync from tags.
- Pending approvals for auto-synced content.
- Reject/block tag feedback loops.

### Live Product Gap

The best workflows are not yet fully live-backed. In Live Mode, we need to be careful not to imply that Aethos has already classified, suggested, accepted, rejected, or auto-tuned metadata unless those actions are persisted through the backend.

---

## Recommended Product Model

Metadata classification should use a suggestion lifecycle:

1. **Detected Signal**
   - filename
   - path
   - owner
   - extension
   - modified date
   - site/library context
   - sharing posture
   - content text if AI+ is enabled

2. **Generated Suggestion**
   - suggested title
   - tags
   - category
   - document type
   - business function
   - confidence
   - rationale

3. **Human Decision**
   - accept
   - edit
   - reject
   - block this tag/category pattern

4. **Learning Signal**
   - accepted suggestions increase trust in similar patterns
   - rejected suggestions reduce future use
   - edited suggestions teach preferred taxonomy

5. **Operational Outcome**
   - better search
   - workspace auto-sync
   - cleaner reporting
   - AI-readiness score

---

## V1 Scope Recommendation

V1 should support metadata classification as a metadata-only feature, without requiring content body reads.

Prioritize:

- Filename/path/owner-based suggestions.
- Metadata quality score.
- Conservative tag suggestions.
- Bulk apply/edit/remove tags.
- Clear distinction between AI-suggested and user-approved metadata.
- Workspace creation that benefits from approved tags.
- Admin/setup CTA to run enrichment after discovery.

Avoid in V1:

- Overconfident summaries from metadata only.
- Claiming semantic understanding without content reads.
- Auto-applying tags without review for live tenants.
- Hidden changes to customer metadata in Microsoft 365.

V1 should persist Aethos-side metadata first. Writing back to Microsoft should be a later explicit feature.

---

## V1.5 Scope Recommendation

V1.5 can expand classification with AI+ content intelligence:

- Content-aware tags.
- Content-aware categories.
- Better suggested titles.
- Summaries.
- Topic clusters.
- PII/sensitive content flags.
- Suggested workspace groupings based on content similarity.

V1.5 should still preserve human review:

- Show confidence and rationale.
- Let users accept/edit/reject.
- Track decisions.
- Keep row-level audit history.

---

## Data Model Gaps To Consider

Current `files` fields are useful, but they mix suggestions and accepted metadata. Consider adding a separate table later:

`metadata_suggestions`

Candidate fields:

- `id`
- `tenant_id`
- `file_id`
- `suggestion_type` (`title`, `tag`, `category`, `summary`, `business_function`)
- `suggested_value`
- `confidence`
- `rationale`
- `source` (`filename`, `path`, `owner`, `content`, `manual`, `rule`)
- `status` (`pending`, `accepted`, `edited`, `rejected`, `blocked`)
- `final_value`
- `created_at`
- `decided_at`
- `decided_by`

This lets the product show suggestions honestly without overwriting final fields too early.

---

## UX Gaps To Audit Next

- Is there a Live Mode entry point for enrichment after discovery?
- Can users see pending metadata suggestions outside demo components?
- Can users bulk accept/edit/reject suggestions?
- Can users tell suggested tags from approved tags?
- Can users see why a tag was suggested?
- Can users undo or block bad suggestions?
- Does workspace creation use approved metadata, suggested metadata, or both?
- Do empty states explain that enrichment has not run yet?
- Does Demo Mode show richer data without leaking into Live Mode?

---

## Highest-Value Next Build Items

1. **Metadata Suggestions Panel**
   - Live-backed list of pending suggestions.
   - Filter by confidence, type, category, owner, and file type.

2. **Suggestion Rationale**
   - Explain why Aethos suggested a tag or title.
   - Example: `Suggested because path contains /Finance/Reports and filename includes Budget.`

3. **Bulk Review Workflow**
   - Accept selected.
   - Edit selected.
   - Reject selected.
   - Block pattern.

4. **Workspace Tie-In**
   - After accepting tags, show matching workspace suggestions.
   - Make metadata cleanup visibly improve workspace automation.

5. **Metadata Quality Score**
   - Score files based on title clarity, owner presence, tag coverage, stale status, path context, and exposure state.

6. **Audit Trail**
   - Track suggestion decisions.
   - Show accepted/rejected counts.
   - Preserve who changed what and when.

---

## Reminder For Next Session

Start with this question:

> How do we turn the existing metadata/tagging demos into a live-backed V1 metadata classification workflow without overpromising AI+ content understanding?

Recommended first implementation target:

> A live-backed Metadata Suggestions panel after Discovery, using filename/path/owner heuristics first, with accept/edit/reject and workspace tie-in.
