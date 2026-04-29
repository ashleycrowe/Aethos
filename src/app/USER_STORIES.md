# Aethos User Stories & Acceptance Criteria

## Phase 2: The Deep Nexus (Molecular Management)

## Persona: The Curator (Architect / Lead)
**Goal:** Extract signal from noise by pinning specific files and adding "Meaning."
**Simple Translation:** "I want to highlight exactly which documents matter and why."

## User Story: Deep Drill-Down & Pinning
**As a Curator,**
**I want to** look inside a SharePoint site without leaving Aethos,
**So that** I can pin a specific "Budget.xlsx" instead of the whole messy site.

### Acceptance Criteria:
- [ ] Clicking a site card opens a "Lens View" overlay.
- [ ] Users can browse a live-fetched list of files (Graph API simulation).
- [ ] Each file has a "Pin" action that adds it to the Active Workspace.

## User Story: The Meaning Layer (Aethos Notes)
**As a Curator,**
**I want to** add a custom note to a pinned file that doesn't change the source file,
**So that** my team understands the context (e.g., "This is the final approved version").

### Acceptance Criteria:
- [ ] Pinned items in the Manifest show an "Add Note" field.
- [ ] Notes are stored in the Aethos Sidecar (local state/DB) and linked via File ID.
- [ ] The note appears alongside the file in the Workspace view.

## User Story 2: AI-Assisted Semantic Clustering
**As an** Orchestrator,
**I want to** use "Ask Nexus" to find related data clusters,
**So that** I don't have to manually hunt for every relevant node across the tenant.

### Acceptance Criteria:
- [ ] Search input allows natural language queries.
- [ ] AI suggestions identify semantic relationships between disparate nodes.
- [ ] Suggested nodes can be quickly added to the current assembly manifest.

## User Story 3: The Flashlight (Universal Waste Governance)
**As an Operational Architect,**
**I want to** identify "Ghost Towns" in my core stack (M365/Slack) and "Shadow Leakage" in Tier 2 clouds (Google, Box),
**So that** I can provide operational clarity and recapture wasted capital from unmanaged infrastructure.

### Acceptance Criteria:
- [ ] Snapshot Analytics show a unified "Total Tenant Waste" figure.
- [ ] Users can filter the intelligence projection by specific provider (Microsoft, Google, etc.).
- [ ] Forensic Lab allows for deep metadata slicing.
- [ ] Tier 1 providers allow bulk remediation (Archive/Delete).
- [ ] Tier 2 providers trigger "Shadow IT Disclosure" notifications instead of native archive.

## User Story 4: The Forensic Lab (Meaning Engine)
**As a FinOps Manager,**
**I want to** query the Universal Metadata Engine for specific artifacts (e.g., >500MB, stale >1yr),
**So that** I can build business narratives for decommissioning and cost-saving.

### Acceptance Criteria:
- [ ] Search and filter by filename, owner, risk score, and waste factor.
- [ ] Sidebars provide "Business Meanings" like "Compliance Leak" or "Redundancy Audit."
- [ ] Users can export Executive Summaries of forensic findings.
