# [STANDARD] Aethos Development & Platform Standards
## Engineering Governance for M365 Intelligence & AppSource Compatibility

---
status: Active
type: Core Development Standard
phase: All Phases
audience: [Engineering, Architecture, Product]
priority: Critical
last_updated: 2026-02-04
document_id: STD-DEV-001
---

## 📋 Executive Summary
This standard defines the development workflows and platform selection criteria for Aethos. As an intelligence layer on top of Microsoft 365, all engineering decisions must prioritize AppSource compatibility, Sidecar performance, and multi-tenant security.

---

## 🚨 MANDATORY CRITICAL RULES

1.  **PNPJS FOR SHAREPOINT:** Never use raw REST calls for SharePoint metadata. Use **PnPjs** for all CRUD operations.
2.  **MICROSOFT GRAPH SDK:** All M365 tenant interactions (Users, Teams, Groups) must utilize the official Microsoft Graph SDK.
3.  **TYPESCRIPT STRICT:** Zero `any` types. Strict null checks and implicit any prevention must be enabled in `tsconfig.json`.
4.  **PII SANITIZATION:** No Personally Identifiable Information (PII) may be logged or stored in the Sidecar metadata layer (Cosmos DB).
5.  **PERFORMANCE TARGETS:** 
    - Lighthouse Performance: ≥ 90.
    - Initial Load: < 3s on standard enterprise connections.
    - Bundle Size: < 500KB (Gzipped).

---

## 🧭 Platform Decision Tree
Before initializing a new Aethos node, use this tree to determine the implementation strategy:

- **Intranet Widgets/Dashboard:** ──➤ **SPFx WebPart** (React 17 compatibility).
- **Collaboration Surfaces:** ──➤ **Teams App / Personal Tab**.
- **Intelligence Background Processing:** ──➤ **Azure Functions** (Node.js/TypeScript).
- **Standalone Management (Nexus):** ──➤ **Azure Static Web Apps** (Next.js Sidecar).

---

## ⚛️ React & TypeScript Standards

### Component Architecture
- Use **Functional Components** with Hooks.
- **Strict Typing:** All props and state must have explicit interfaces.
- **Memoization:** Use `useMemo` and `useCallback` for expensive Graph data transformations.

### M365 Compatibility
When developing components intended for the SharePoint App Catalog:
- Use **React 17.0.1** (SPFx target).
- Utilize **Fluent UI React v7** to maintain visual parity with the SharePoint modern experience.

---

## 🔒 Security & Data Privacy
- **Managed Identities:** Use Azure Managed Identities for Sidecar-to-Azure service communication.
- **Sanitization:** All user inputs must be sanitized using `DOMPurify` before rendering to prevent XSS in the governance portal.
- **Least Privilege:** Request only the minimum required Graph scopes (e.g., `Sites.Read.All` instead of `Sites.FullControl.All`).

---

## ✅ Pre-Deployment Checklist
- [ ] No `any` types in critical metadata paths.
- [ ] PnPjs/Graph logic isolated in `/services`.
- [ ] All PII redacted from telemetry logs.
- [ ] Accessibility (ARIA labels) verified for keyboard navigation.

---

## 🔄 Maintenance
**Review Cycle:** Quarterly.
**Owner:** Aethos Tech Lead + Architecture Team.
**Authority:** MANDATORY for all Aethos engineering initiatives.
