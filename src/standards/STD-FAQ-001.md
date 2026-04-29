# [STANDARD] Aethos FAQ Management & Maintenance
## Knowledge Base Governance for Internal & Client Success

---
status: Active
type: Core Documentation Standard
phase: All Phases
audience: [Product, Engineering, Support, Customer Success]
priority: Medium
last_updated: 2026-02-04
document_id: STD-FAQ-001
---

## 📋 Executive Summary
This standard establishes the requirements for creating and maintaining Aethos FAQs. We distinguish between **Project FAQs** (Internal development intelligence) and **Product FAQs** (Client-facing intelligence). These living documents reduce repetitive inquiries and ensure visual/technical consistency across the "Sidecar" ecosystem.

---

## 🚨 MANDATORY CRITICAL RULES

1.  **3-STRIKE RULE:** Any question asked 3+ times MUST be added to the appropriate FAQ document within 48 hours.
2.  **AUDIENCE TAGGING:** Product FAQs must be clearly marked as **🔒 INTERNAL ONLY** or **🌐 CLIENT-FACING**.
3.  **PII STRIPPING:** Client-facing FAQs must never contain internal server IDs, tenant names, or developer-specific metadata.
4.  **CINEMATIC TONE:** Product FAQs must reflect the Aethos brand voice—intelligent, visionary, yet accessible. No marketing fluff.
5.  **MONTHLY AUDIT:** During active development phases, FAQs must be audited on the first Monday of every month for accuracy.

---

## 📚 FAQ Categorization

### Type 1: Project FAQ (Internal)
*   **Purpose:** Answers common technical or process questions for the Aethos engineering team.
*   **Location:** `/src/docs/project-faq.md`
*   **Topics:** SPFx versions, Sidecar connectivity, Graph API scopes, Admin Center tokens.

### Type 2: Product FAQ (Client-Facing)
*   **Purpose:** Answers questions about Aethos features, value proposition, and M365 integration.
*   **Location:** `/src/docs/product-faq.md`
*   **Topics:** What is Aethos Glass? How does "The Flashlight" detect waste? Is my data stored in Aethos?

---

## 🏗️ Document Structure Standard

Every Aethos FAQ must include:
1.  **Metadata Block:** Version, Owner, Audience, and Last Reviewed date.
2.  **About This Document:** Brief usage instructions.
3.  **Categorized Q&A:** Direct answers (1-3 sentences) followed by context/examples.
4.  **Version History:** Detailed log of when questions were added or modified.

---

## 🔄 Maintenance Workflow
1.  **Capture:** Identify repeated questions in Teams or Support tickets.
2.  **Draft:** Create concise, Aethos-branded answers.
3.  **Review:** Technical SME review for Project FAQs; Product Lead review for Product FAQs.
4.  **Publish:** Update the markdown source and notify the team.
5.  **Archive:** Move obsolete questions to the "Archives" section—never delete historical intelligence.

---

## ✅ Compliance Checklist
- [ ] Questions organized by logical categories.
- [ ] 🔒/🌐 markers applied to all Product FAQ entries.
- [ ] Links to detailed documentation (e.g., STD-DEV-001) provided for technical answers.
- [ ] Monthly review cycle documented in version history.

---

## 🔄 Maintenance
**Review Cycle:** Quarterly.
**Owner:** Documentation Lead / Product Lead.
**Authority:** MANDATORY for all Aethos feature teams.
