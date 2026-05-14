# Gemini, Figma, and Product Team Question Brief

**Purpose:** Working question list for shaping the next Aethos product decisions, design follow-up, and Gemini strategy prompts.

**Source context:** Consolidated from the recent Operational Intelligence, Oracle Search, and Workspace Persona planning notes.

---

## 1. Strategic Product Questions

### Risk Scoring Calibration

- Do the current Owner Liability Score weights produce sensible rankings across messy, typical, and clean tenants?
- Current proposed weighting:
  - 40% external exposure
  - 25% ownership gap
  - 20% high-risk files
  - 10% stale burden
  - 5% OneDrive concentration
- Should external sharing and missing ownership remain the highest-weighted V1 risk signals?

### No-Data Sales Story

- What exact readiness checklist copy makes an empty tenant feel useful without pretending there is risk?
- Should no-data tenants see a "Path to Value" checklist instead of an empty dashboard?
- What should the checklist ask the user to do first: connect Microsoft 365, run Discovery, create a workspace, invite a steward, or review setup health?

### Report Packaging

- Should reports live as cards inside Operational Intelligence?
- Or should Aethos reintroduce a dedicated Reporting Center once reporting is live-backed?
- What report layout best serves both founder/COO buyers and IT/admin buyers?

### Identity Scope

- Should disabled/departed Entra user detection be a V1.5 paid feature?
- Or should it be pulled into late V1 if permissions are easy?
- Is the current V1 identity feature name, "Ownership & Offboarding Risk," clear enough for buyers?

### AI Readiness Language

- Which buyer-facing claim best explains Aethos as the pre-processor for Microsoft 365 and Copilot readiness?
- How should we describe Aethos without sounding like it replaces Microsoft Copilot, Gemini, or native AI tools?
- What wording makes metadata cleanup, ownership clarity, and workspace curation feel essential to AI readiness?

### Demo Story

- Which three demo insights best sell Aethos in under five minutes?
- Should the demo lead with external exposure, missing ownership, stale content, workspace handoff, or AI readiness?
- What should the "before and after" story be for a messy SMB tenant?

### Buyer Persona

- Who is the first buyer?
  - IT admin
  - Operations lead
  - Security/compliance lead
  - Founder/COO at a messy SMB
- Is the buyer trying to force organization onto the company from IT?
- Or is the buyer an operations/founder/department leader trying to rescue teams from data chaos?

---

## 2. Figma and Product Design Questions

### Operational Intelligence

- How should the Tenant Health Score appear for founder/COO buyers without hiding the detailed report cards IT/admin users need?
- Should report cards visually separate risk, cleanup, ownership, and readiness signals?
- What is the clearest empty-state design for a tenant with no scan data yet?

### Workspace Personas

- How should the three workspace personas show up in the UI without becoming heavy role-based access control in V1?
  - Systems Admin: generates handoff candidates.
  - Context Steward: curates source-of-truth context.
  - Knowledge Worker: consumes trusted files and workspaces.
- Should persona modes be visible as tabs, badges, filters, or contextual actions?

### Workspace Handoff

- What should a workspace handoff packet look like when copied or exported for use outside Aethos?
- What fields are required for a useful handoff packet?
  - Reason codes
  - Suggested steward
  - Suggested action
  - Source files
  - Risk or readiness rationale
  - Owner review requirement
- How should Aethos show "blind steward" permission gaps without implying it changes Microsoft 365 permissions?

### Oracle Search

- How should live-mode prompt suggestions look when Aethos does not know whether specific files exist?
- Should prompts be grouped by document type, business function, risk posture, owner, and date?
- What should the no-results path say when live search returns nothing?

---

## 3. Gemini Prompt Starters

Use these directly with Gemini or adapt them into more targeted prompts.

### Product Strategy Prompt

"Given Aethos as an intelligence layer for Microsoft 365 data chaos, evaluate whether the first buyer should be IT admin, operations lead, security/compliance lead, or founder/COO at a messy SMB. Recommend the best first buyer, the strongest demo story, and the objections we need to answer."

### Risk Scoring Prompt

"Review this proposed Owner Liability Score: 40% external exposure, 25% ownership gap, 20% high-risk files, 10% stale burden, and 5% OneDrive concentration. Does this weighting create sensible rankings for messy, typical, and clean Microsoft 365 tenants? Suggest improvements."

### Empty-State Prompt

"Write a Path to Value checklist for a new Aethos tenant with little or no scan data. The copy should feel useful and honest, not like fake risk analysis. The user should understand what to connect, scan, review, and create next."

### AI Readiness Prompt

"Help position Aethos as the pre-processor for Microsoft 365 and Copilot readiness. The message should explain why metadata cleanup, ownership clarity, stale content review, and workspace curation make enterprise AI more useful without claiming Aethos replaces Microsoft Copilot or Gemini."

### Demo Narrative Prompt

"Design a five-minute Aethos demo narrative for a messy SMB tenant. Pick the three strongest insights to show first and explain the before/after story for a founder, COO, or IT admin buyer."

### Figma Design Prompt

"Create design recommendations for an Aethos Operational Intelligence dashboard that serves both executives and IT admins. Include a Tenant Health Score, detailed report cards, no-data Path to Value state, and workspace handoff actions. Keep the UI practical, trustworthy, and enterprise-ready."

---

## 4. Resolved Decisions To Preserve

- Data source labels should be persistent and subtle, not hover-only.
- V1 identity feature name is `Ownership & Offboarding Risk`.
- External sharing and missing ownership are the highest-weighted V1 risk signals.
- V1 owner scoring uses `Owner Liability Score`: 40% external exposure, 25% ownership gap, 20% high-risk files, 10% stale burden, 5% OneDrive concentration.
- No-data tenants should see a `Path to Value` readiness checklist, not an empty dashboard.
- Operational Intelligence needs a `Tenant Health Score` for founder/COO buyers and detailed report cards for IT/admin buyers.
- Report summaries should include trend deltas once there is more than one completed scan.
- V1 should expose the three Workspace persona modes in the UI and route users to the right surfaces.
- V1.5 should persist the underlying stewardship and review-state model.

---

## 5. Suggested Working Order

1. Confirm the first buyer persona.
2. Tighten the five-minute demo story.
3. Calibrate Owner Liability Score weighting.
4. Finalize no-data Path to Value copy.
5. Decide whether reporting stays inside Operational Intelligence or returns as a dedicated Reporting Center.
6. Sketch Figma states for Operational Intelligence, Workspace handoff, and Oracle Search empty/no-results flows.
7. Use Gemini to pressure-test the AI readiness language and buyer objections.
