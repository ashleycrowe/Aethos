# [STANDARD] Aethos Responsiveness & Operational Continuity
## Maintaining Clarity Across the Viewport Spectrum

---
status: Active
type: Operational Standard
phase: All Phases
audience: [Engineering, Product]
priority: Critical
last_updated: 2026-02-05
document_id: STD-RESP-001
---

## 📋 Executive Summary
Operational Clarity must be preserved regardless of screen size. Aethos is an "Adaptive Cockpit" that must function effectively as a desktop command center, a laptop workspace, or a mobile-integrated Teams tab.

---

## 🚨 CORE PRINCIPLES

1.  **CONTEXT PRESERVATION:** Moving from desktop to mobile should never hide critical context. It should re-prioritize and stack, never "delete" from view.
2.  **THE TEAMS-FIRST RULE:** Assume the viewport may be constrained within a Microsoft Teams tab. All modals and popups must be relative to the viewport, not the document.
3.  **ADAPTIVE GLASS:** Glassmorphism depth should decrease on smaller screens to prioritize text legibility and touch targets.
4.  **CHART RESILIENCE:** All charts must use `ResponsiveContainer` with defensive parent sizing (min-height/min-width) to prevent dimension calculation errors.

---

## 📏 RESPONSIVE PATTERNS

### 1. The Adaptive Grid
- **Desktop (1440px+):** 12-column grid with generous gutters (40px).
- **Laptop (1024px - 1439px):** 12-column grid with compact gutters (24px).
- **Tablet (768px - 1023px):** 8-column grid. Sidebars transition to overlays.
- **Mobile (<768px):** 4-column grid. Single stack layout.

### 2. The Nexus Popups (Modals)
- Modals must use `max-h-[90vh]` or `h-full` on mobile.
- Use `overflow-y-auto` on the content container to ensure all forms are accessible.
- Avoid multi-column forms on viewports < 1024px.

---

## 🛠 IMPLEMENTATION GUIDELINES

### Responsive Charts
Always wrap `ResponsiveContainer` in a parent with `min-h-[value]` to avoid 0-height errors.
```tsx
<div className="h-[300px] min-h-[300px] w-full min-w-0 relative">
  <ResponsiveContainer width="100%" height="100%">
    <Chart />
  </ResponsiveContainer>
</div>
```

### Mobile Touch Targets
- Buttons must be at least `44px` height on mobile.
- Padding should increase to `16px` minimum for interactive zones.

---

## ✅ COMPLIANCE CHECKLIST
- [ ] Dashboard tiles stack on mobile.
- [ ] Nexus Wizard is fully scrollable on small laptops.
- [ ] No horizontal scrollbars on standard viewports.
- [ ] Charts do not flicker or crash on resize.
