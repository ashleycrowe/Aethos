# [STANDARD] Aethos AI & Copilot Integration Standards
## Intelligence Layer & Sidecar AI Governance

---
status: Active
type: Core Strategic Standard
phase: All Phases
audience: [Architecture, AI Engineers, Developers]
priority: High
last_updated: 2026-02-04
document_id: STD-AI-001
---

## 🤖 The Aethos Intelligence Philosophy
AI in Aethos is a "Sidecar Observer." It analyzes metadata sprawl to illuminate waste and suggests logical connectivity in the Nexus. It **never** ingests file bodies, only metadata pointers and Graph activity signals.

---

## 🚨 MANDATORY CRITICAL RULES

1.  **METADATA-ONLY INFERENCE:** AI models MUST only receive metadata (Site IDs, timestamps, storage metrics). Sending file content or PII to LLMs is strictly forbidden.
2.  **AZURE OPENAI PRIMACY:** All AI features must use Azure OpenAI via the Aethos sidecar subscription to ensure data residency and Microsoft AppSource compliance.
3.  **HALLUCINATION GUARDRAILS:** AI-generated waste projections (The Flashlight) must be labeled as "Projected" until verified by a tenant admin.
4.  **PROMPT SANITIZATION:** All user-provided workspace descriptions in The Nexus must be sanitized for injection attacks before being sent to the orchestration layer.
5.  **COPILOT EXTENSIBILITY:** Plugins for M365 Copilot must use Adaptive Cards that link back to the Aethos web app via deep-linking.

---

## 🧠 Core Integration Patterns

### 1. The Flashlight Intelligence (Waste Projection)
AI analyzes the "Ghost Town" metadata to identify patterns of sprawl.
- **Pattern:** Retrieval Augmented Generation (RAG) using *metadata indices* only.
- **Goal:** Suggest which sites are safe to archive vs. which are mission-critical.

### 2. The Nexus Orchestrator (Semantic Grouping)
Using Semantic Kernel to group disparate M365 nodes into cohesive virtual workspaces.
```typescript
// Standard: Semantic Kernel Workspace Suggestion
const plan = await kernel.invokeAsync("WorkspacePlugin", "SuggestGrouping", {
  input: "Find all sites related to 'Project Apollo' across SharePoint and Teams"
});
```

---

## 🔒 Security & Privacy (The Anti-Intranet Guard)

### PII Sanitization
Before any AI call, data must pass through the `AIPrivacyService` to redact:
- User emails (replace with hashed IDs)
- Specific project names (unless within the allowed metadata scope)
- Site URL paths that reveal PII

### Prompt Injection Prevention
Forbidden tokens in Aethos AI inputs:
- `system:`, `ignore instructions`, `act as admin`, `[REDACTED]`

---

## 🎨 AI User Experience (Aethos Glass)
- **Intelligence Badges:** AI-generated insights must use the "Starlight Cyan" glow.
- **Transparency:** Every AI insight must have a "Source Trace" link showing which Graph metadata led to the conclusion.
- **Manual Overrides:** Admins must always have a "Reject Suggestion" button for any AI-proposed action.

---

## ✅ Compliance Checklist (AI Governance)

- [ ] **Azure Key Vault:** Azure OpenAI keys are NOT in the codebase.
- [ ] **Data Residency:** All AI processing happens within the regional Azure Function sidecar.
- [ ] **Responsible AI:** Fairness audit completed for waste projection algorithms.
- [ ] **AppSource Ready:** Copilot manifest identifies Aethos as a "Data Intelligence Layer."

---

## 🔄 Maintenance
**Review Cycle:** Semi-annually.
**Owner:** Aethos AI Strategy Group.
**Authority:** High (Critical for Security & AppSource).
