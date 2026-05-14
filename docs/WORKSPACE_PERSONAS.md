# Aethos Workspace Personas

**Last Updated:** 2026-05-13  
**Purpose:** Keep V1 Workspace product decisions anchored to the people who create, curate, and consume working context.

---

## Core Loop

Workspaces should bridge security and productivity:

1. **Systems Admin finds the mess and boxes it up.**
   Discovery and Operational Intelligence identify risky, stale, unowned, or scattered files and turn them into workspace handoff candidates.
2. **Context Steward labels the box and removes the trash.**
   Ops leads, founders, project owners, or department stewards review handoff packets, approve metadata suggestions, pin source-of-truth files, and route remediation dry-runs.
3. **Knowledge Worker opens the box and finds what they need.**
   End users consume curated workspaces as trusted playlists of working context without caring whether the source file lives in Teams, SharePoint, or OneDrive.

If V1 only serves the Systems Admin, Aethos risks becoming another compliance dashboard. If Workspaces also serve stewards and knowledge workers, they become the daily context layer that makes the platform sticky.

---

## Persona 1: Systems Admin

**Nickname:** The Plumber  
**Goal:** Reduce risk, lower storage cost, and prepare Microsoft 365 for AI safely.  
**Problem:** They can see exposure and sprawl, but often lack the business context needed to delete, archive, or lock files down unilaterally.

**Workspace Interaction:**

- Generates workspaces from Discovery and Operational Intelligence.
- Bundles high-risk, stale, unowned, or externally shared files into review packets.
- Hands off cleanup context instead of making blind source-system changes.

**Sales Point:**

> Aethos lets IT preview cleanup safely before touching source systems.

---

## Persona 2: Context Steward

**Nickname:** The Curator / Ops Lead  
**Goal:** Keep team knowledge accurate, manage project handoffs, and keep operations moving.  
**Problem:** When employees leave or projects shift, institutional knowledge gets lost in untagged files, stale folders, personal OneDrives, and unclear ownership.

**Workspace Interaction:**

- Manages workspaces after Admin handoff.
- Accepts or rejects handoff packets.
- Pins golden-path source files.
- Approves metadata suggestions and remediation dry-runs.
- Adds business context that IT cannot infer from metadata alone.

**Sales Point:**

> When people leave, Aethos helps you find what knowledge, files, and exposure they leave behind.

---

## Persona 3: Knowledge Worker

**Nickname:** The End User  
**Goal:** Find the exact right document quickly enough to do their job.  
**Problem:** Native Microsoft 365 search and Copilot perform poorly when the underlying metadata is stale, duplicated, scattered, or ambiguous.

**Workspace Interaction:**

- Consumes workspaces as curated playlists of working context.
- Searches inside a trusted workspace instead of hunting across Teams, SharePoint, and OneDrive.
- Uses pinned files and source-of-truth cues to avoid version anxiety.

**Sales Point:**

> Aethos turns scattered documents into working context without moving the source files.

---

## V1 Workspace Product Implications

- Workspace creation should remain easy for Admins after Discovery and Operational Intelligence.
- Workspace management should make Context Steward actions obvious: pin, review, accept suggestions, and route dry-runs.
- Workspace consumption should feel useful to Knowledge Workers: clean search, trusted files, owners, freshness, and source links.
- Risk scores and dry-run language belong mostly to Admin and Steward surfaces.
- End-user workspace views should prioritize clarity, trust, source-of-truth cues, and fewer irrelevant files.
- V1 should avoid implying that Aethos has moved, copied, or modified source files unless the user explicitly triggered a backed action.

---

## Buyer Lens

For V1 sales polish, keep asking:

- Is the buyer trying to force organization onto the company from IT?
- Or is the buyer an Ops/founder/department leader trying to rescue teams from data chaos?

The answer changes which persona needs the most polish first, but the product loop needs all three.
