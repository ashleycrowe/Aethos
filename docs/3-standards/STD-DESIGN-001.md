# [STANDARD] Aethos Glass Design System Reference
## The Intelligence Layer Visual Framework

---
status: Active → **See Master Design Guide**
type: Core Strategic Standard  
phase: All Phases  
audience: [Design, Engineering, Product]  
priority: Critical  
last_updated: 2026-02-27  
document_id: STD-DESIGN-001  
location: `/docs/3-standards/STD-DESIGN-001.md`
**superseded_by:** `/docs/MASTER_DESIGN_GUIDE.md` (Complete 150+ page design system)

---

## 📘 REDIRECT NOTICE

**This standard has been consolidated into the comprehensive Master Design Guide.**

**For complete design specifications, see:** `/docs/MASTER_DESIGN_GUIDE.md`

The Master Design Guide includes:
- Complete atomic design system (Atoms → Molecules → Organisms)
- All component specifications with code examples
- Full color system, typography, and spacing standards
- Interaction patterns and animation guidelines
- Accessibility standards (WCAG 2.1 AA compliance)
- Responsive design patterns
- Implementation guidelines and QA checklists

---

## 🚨 CRITICAL RULES (Quick Reference)

**Use the Master Design Guide for full specifications. These are quick reminders only:**

1. **DARK MODE PRIMARY:** The Aethos primary interface is optimized for dark environments (`#0B0F19` Deep Space background). Light mode ("Daylight Mode") exists for accessibility.

2. **NEON INDICATORS:** 
   - `#00F0FF` (Starlight Cyan) for all primary actions and "Optimal" states
   - `#FF5733` (Supernova Orange) for waste, risk, and "Ghost Town" indicators

3. **GLASSMORPHISM:** Components must use the `GlassCard` abstraction:
   ```css
   backdrop-blur-xl bg-white/5 border-white/10 rounded-2xl
   ```

4. **TYPOGRAPHY HIERARCHY:** 
   - **Space Grotesk:** Primary headings and brand-critical labels
   - **Inter:** Body text and secondary UI labels
   - **JetBrains Mono:** Metadata, data IDs, and technical readouts

5. **ATOMIC DESIGN:** All components follow Atoms → Molecules → Organisms hierarchy

6. **NARRATIVE BEFORE CALCULATION:** Show the story version of metrics by default. Hide raw calculations behind info icons.

7. **SIDECAR PATTERN:** Design emphasizes we're "pointing to" M365 resources, not storing them

---

## 🎨 Quick Color Reference

| Token | Hex | Usage |
|-------|-----|-------|
| Deep Space | `#0B0F19` | Primary background |
| Starlight Cyan | `#00F0FF` | Primary actions, intelligence indicators |
| Supernova Orange | `#FF5733` | Alerts, waste, risk |
| Nebula Slate | `#94A3B8` | Muted text, metadata |
| Void Border | `rgba(255,255,255,0.1)` | Glass card borders |

---

## 🔷 Atomic Design Quick Reference

### Level 1: Atoms
- Glass Card: `backdrop-blur-xl bg-white/5 border-white/10`
- Primary Action: `bg-[#00F0FF] text-black`
- Risk Badge: `bg-[#FF5733]/10 text-[#FF5733]`

### Level 2: Molecules
- Waste Meter (storage gauge)
- Metric Card (narrative + calculation)
- Empty State (icon + message + CTA)
- Provider Badge Overlay

### Level 3: Organisms
- Bulk Actions Toolbar (floating multi-select controller)
- Star Map (tenant visualization)
- Workspace Cluster (multi-platform aggregation)
- Sidecar Details Drawer (metadata panel)

---

## ✅ Compliance Checklist (Quick)

Before marking any component as design-complete:

- [ ] Uses Deep Space background (`#0B0F19`)
- [ ] Primary actions use Starlight Cyan (`#00F0FF`)
- [ ] All containers use glassmorphism (backdrop-blur-xl)
- [ ] Typography follows hierarchy (Space Grotesk / Inter / JetBrains Mono)
- [ ] Icons from Lucide React only
- [ ] Spacing is multiples of 4px
- [ ] Keyboard navigation works
- [ ] Screen reader accessible (ARIA labels)
- [ ] Mobile responsive (< 768px tested)

---

## 📖 For Complete Specifications

**See:** `/docs/MASTER_DESIGN_GUIDE.md`

Sections include:
1. Design Philosophy (The Anti-Intranet, Cinematic Intelligence)
2. Atomic Design System (Full atom/molecule/organism catalog)
3. Visual Foundation (Colors, typography, spacing, glassmorphism specs)
4. Component Design Specifications (9 core components with code)
5. Layout & Grid System
6. Interaction Patterns
7. Animation & Motion
8. Accessibility Standards
9. Responsive Design
10. Implementation Guidelines

---

## 🔄 Maintenance

**Review Cycle:** Monthly  
**Owner:** Design & Engineering Team  
**Authority:** MANDATORY for all Aethos UI development  
**Master Reference:** `/docs/MASTER_DESIGN_GUIDE.md`

**Last Updated:** 2026-02-27 (Consolidated into Master Design Guide, moved to /docs/3-standards/)
