---
status: Active
type: Core Strategic Standard
phase: All Phases
audience: [All Teams, Developers, Architects]
working_group: [Technical, Architecture]
priority: Critical
last_updated: 2026-02-04
tags: [planning, tasks, management, sync, governance, standards]
document_id: STD-TASK-001
---

<!--
📌 CORE STRATEGIC DOCUMENT - AI MAINTENANCE INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  DO NOT DELETE - Source of truth for Task Management & Sync
🔄 KEEP UPDATED - Update when synchronization processes or working groups change
📋 WHAT TO UPDATE:
   - Task naming conventions for new feature types (e.g., Sidecar, Nexus)
   - Microsoft Planner integration scripts or procedures
   - Acceptance criteria benchmarks for Aethos Glass components
🚫 WHAT NOT TO CHANGE:
   - Core sync principle (Markdown is the Source of Truth)
   - 6 Standard Working Group structure
   - Requirement for acceptance criteria on all tasks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-->

# [STANDARD] Task List Management & Maintenance
## STD-TASK-001: Synchronizing Project Intelligence with Task Execution

**Version:** 1.0  
**Date:** February 4, 2026  
**Status:** 🟢 ACTIVE  
**Owner:** Project Management Office  
**Description:** Standard requirements for creating, maintaining, and updating Aethos task lists, ensuring synchronization between the AI Prototype and Microsoft Planner.

---

## 🚨 MANDATORY REQUIREMENTS

1. ✅ **DOC IS SOURCE OF TRUTH** - The project task list (Markdown) is the authoritative source. Microsoft Planner is a mirror for execution tracking.
2. ✅ **6 WORKING GROUPS** - Tasks must be bucketed into: Product, Design, Technical, Enablement, Leadership, and AI.
3. ✅ **ACCEPTANCE CRITERIA (AC)** - Every task MUST have 3-10 measurable checkboxes.
4. ✅ **EFFORT IN HOURS** - Estimates must be in hours (P95 confidence), not story points.
5. ✅ **PROTOTYPE SYNC** - When a feature is added to the "Aethos Demo Lab" or prototype, the task list must be updated within 48 hours.
6. ✅ **NAMING CONVENTION** - Tasks must follow: `[PRIORITY] [TYPE] Task Name`.

---

## 📦 PART 1: TASK FORMAT STANDARDS

### 1.1 Priority Levels
- `[P0]` - Critical (Blocks release/security).
- `[P1]` - High (Required for current milestone).
- `[P2]` - Medium (Standard features/enhancements).
- `[P3]` - Low (Future roadmap/tech debt).

### 1.2 Task Types
- `[FEATURE]` - Core Aethos functionality (The Flashlight, The Nexus).
- `[SIDECAR]` - Azure Functions / API development.
- `[GLASS]` - Aethos Glass UI/UX components.
- `[GOV]` - Governance/Compliance standards implementation.
- `[BUG]` - Remediation.

---

## 🔄 PART 2: PROTOTYPE CHANGE IMPACT

**When the AI prototype evolves, PMs must:**
1. **Assess Impact:** Determine if the change affects "The Flashlight" or "The Nexus" scope.
2. **Update Markdown:** Edit `/docs/phase-[N]-task-list.md` first.
3. **Mirror to Planner:** Update the corresponding card in Microsoft Planner.
4. **Log Decision:** Record the scope adjustment in the Decision Log.

---

## 📊 PART 3: MAINTENANCE & HYGIENE

### 3.1 Weekly Review
Every Monday, Working Group leads must:
- Verify completed ACs in the Markdown list.
- Sync status between Git commits and task IDs.
- Adjust effort estimates for tasks impacted by new M365 API limitations or Sidecar performance findings.

### 3.2 Monthly Audit
A full audit of the task backlog is required to prune deferred features and ensure all "Ghost Town" remediation tasks are correctly prioritized for the upcoming sprint.

---

## ✅ COMPLIANCE CHECKLIST

- [ ] Task list document exists for the current Phase.
- [ ] Tasks follow `[PRIORITY] [TYPE]` naming.
- [ ] ACs are measurable (Specific, Testable).
- [ ] Planner is 1:1 with the Markdown document.
- [ ] Effort totals match the Phase capacity.

---

**Document ID:** STD-TASK-001  
**Status:** 🟢 ACTIVE STANDARD  
**Authority:** MANDATORY for Project Governance.
