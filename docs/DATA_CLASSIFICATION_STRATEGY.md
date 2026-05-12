# Aethos Data Classification Strategy

**Status:** Active product direction  
**Last Updated:** 2026-05-12  
**Purpose:** Define what "data" means in Aethos so V1 and V1.5 stay focused while leaving a clear path toward SharePoint Lists and broader enterprise knowledge.

---

## Product Principle

Aethos should think in terms of **knowledge objects**, not only files. That said, the first product versions should keep execution disciplined:

- **V1:** Microsoft 365 files/documents, metadata, permissions, activity, workspaces, and safe remediation.
- **V1.5:** Content intelligence for files plus SharePoint pages/news inventory as published knowledge.
- **V2 candidate:** SharePoint Lists as structured operational data, beginning with inventory and schema intelligence before full row-level ingestion.

This gives clients immediate value without turning V1 into a sprawling data platform.

---

## Core Data Classes

### 1. Files And Documents

Examples:
- Word, Excel, PowerPoint, PDF
- Images and scanned documents
- Archives and exported reports
- Teams/SharePoint/OneDrive files

V1 treatment:
- Discover and index metadata.
- Track owner, provider, path, size, type, modified date, external sharing, stale status, and workspace membership.
- Support search, workspace creation, remediation dry-run, and reporting.

V1.5 treatment:
- Extract text where permitted.
- Generate chunks, embeddings, summaries, topic/entity signals, and PII flags.

### 2. Published Knowledge

Examples:
- SharePoint pages
- SharePoint news posts
- Intranet announcements
- Policy landing pages
- Department or project pages

V1 treatment:
- Not required for first testable V1.

V1.5 treatment:
- Inventory pages/news at the metadata level first.
- Track title, site, URL, author, created date, modified date, published date, audience where available, and stale status.
- Add search result visibility as "Published Knowledge" separate from file documents.

Why it matters:
- AI assistants and employees often rely on published intranet knowledge.
- Stale news or policy pages can become a major AI-readiness problem.

### 3. SharePoint Lists

Examples:
- Issue trackers
- Asset registers
- Risk registers
- Vendor lists
- Onboarding checklists
- Approval logs
- Project registers

V1 treatment:
- Defer from first testable V1.

V1.5 treatment:
- Optional discovery spike only if a pilot customer validates demand.
- Do not ingest full row data by default.

V2 candidate treatment:
- Inventory lists as structured datasets.
- Capture list title, site, URL, item count, column schema, modified date, owner/maintainer, permissions, and business-critical likelihood.
- Add row sampling only with explicit customer permission and clear privacy controls.

Why it matters:
- Long-running SharePoint clients often store operational truth in lists.
- Lists are a major AI-readiness hotspot because they contain structured process data that may not exist anywhere else.

### 4. Containers And Context

Examples:
- SharePoint sites
- Teams-connected sites
- Document libraries
- OneDrive roots
- Folders

V1 treatment:
- Use as discovery context, ownership context, and workspace source context.

Why it matters:
- The same file has different meaning depending on the site, library, team, or owner.

### 5. Metadata, Permissions, And Activity

Examples:
- Owner
- Modified date
- Created date
- File size
- External links
- Guest access
- Sensitivity labels
- View or activity signals where available

V1 treatment:
- Treat as first-class intelligence data.
- This layer powers search, empty states, remediation candidates, and workspace setup without reading file bodies.

Why it matters:
- Aethos can provide operational clarity without needing to inspect sensitive content.

### 6. Conversations And Messages

Examples:
- Teams messages
- Slack messages
- Comments
- Threads

V1/V1.5 treatment:
- Deferred unless a pilot requirement demands it.

V2+ treatment:
- Treat as provider-specific context after documents, pages, and lists are stable.

---

## V1 Scope Boundary

V1 should answer:

- What Microsoft 365 files exist?
- Where are they?
- Who owns them?
- What looks stale, exposed, oversized, or unorganized?
- Can I search the indexed metadata?
- Can I create a workspace and begin organizing?
- Can I safely simulate remediation?

V1 should not promise:

- Full SharePoint List intelligence.
- Content body understanding.
- Complete AI-readiness scoring across all Microsoft 365 object types.
- Teams/Slack conversation ingestion.

---

## V1.5 Scope Boundary

V1.5 should answer:

- Can Aethos search inside permitted documents?
- Can Aethos summarize or classify file contents?
- Can Aethos detect PII or sensitive content patterns?
- What published SharePoint knowledge exists and appears stale?
- Which published pages/news items might confuse users or AI assistants?

V1.5 should not yet promise:

- Full list row ingestion.
- Automated list cleanup.
- Business-process migration recommendations.

---

## SharePoint Lists Roadmap

Recommended staged approach:

1. **Inventory:** Count lists by site, owner, modified date, permissions, and item count.
2. **Schema Intelligence:** Classify columns and list type without reading rows.
3. **Risk Signals:** Flag stale, ownerless, externally exposed, or business-critical lists.
4. **AI Readiness:** Identify lists with messy columns, missing owners, unclear status fields, or duplicate process data.
5. **Controlled Row Sampling:** Let customers opt into sample-row analysis for selected lists.
6. **Full Structured Search:** Add searchable list items only after governance controls are ready.

This sequence keeps client trust intact while still acknowledging that SharePoint Lists may become one of Aethos's highest-value enterprise features.

---

## Data Labels For UI And Search

Use clear labels in the product:

- **Document** for files.
- **Published Knowledge** for SharePoint pages and news.
- **Structured List** for SharePoint Lists.
- **Container** for sites, libraries, folders, teams, and drives.
- **Signal** for metadata, permissions, risk, activity, and ownership facts.

Avoid using "artifact" as a database concept. It can remain a broad UX word only when the user does not need schema clarity.

---

## Open Questions

- Should SharePoint pages/news be included in the base V1.5 AI+ tier or a separate AI-readiness module?
- What customer permission model is needed before reading SharePoint List row data?
- Which list types should be treated as business-critical by default?
- Should Aethos create workspaces from Lists, or only surface them as intelligence objects?
