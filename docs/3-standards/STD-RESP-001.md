---
status: Active
type: Core UI Standard
phase: All Phases
audience: [Developers, Designers]
priority: High
last_updated: 2026-02-27
location: /docs/3-standards/
tags: [responsive, mobile, tailwind, breakpoints]
document_id: STD-RESP-001
---

# [STANDARD] Aethos Responsiveness Standards
## Mobile-First Design for Enterprise Intelligence

**Version:** 2.0  
**Date:** February 27, 2026  
**Status:** 🟢 ACTIVE  
**Owner:** Design & Engineering Team  
**Authority:** MANDATORY  
**Document ID:** STD-RESP-001

---

## 🚨 MANDATORY RULES

1. ✅ **MOBILE-FIRST** - Design for mobile (375px) first, then scale up
2. ✅ **DESKTOP OPTIMIZED** - Primary use case is desktop (1920x1080)
3. ✅ **TAILWIND BREAKPOINTS** - Use standard Tailwind breakpoints (sm/md/lg/xl/2xl)
4. ✅ **NO HORIZONTAL SCROLL** - Content must fit viewport at all breakpoints
5. ✅ **TOUCH TARGETS** - Minimum 44x44px for mobile interactive elements

---

## 📐 Breakpoint Strategy

| Breakpoint | Width | Target Device | Aethos Usage |
| :--- | :--- | :--- | :--- |
| `xs` | < 640px | Mobile | Simplified views, stacked layout |
| `sm` | ≥ 640px | Large mobile/tablet | 2-column grids |
| `md` | ≥ 768px | Tablet | Sidebar visible |
| `lg` | ≥ 1024px | Laptop | Full features |
| `xl` | ≥ 1280px | Desktop | Optimal layout |
| `2xl` | ≥ 1536px | Large desktop | Max content width |

---

## 💻 Implementation Patterns

**Responsive Grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

**Responsive Typography:**
```tsx
<h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black">
  Title
</h1>
```

**Collapsible Sidebar:**
```tsx
{/* Desktop: Always visible, Mobile: Collapsible */}
<div className="hidden lg:block w-64">
  <Sidebar />
</div>
```

---

## ✅ COMPLIANCE CHECKLIST

- [ ] Tested on mobile (375px), tablet (768px), desktop (1920px)
- [ ] No horizontal scrolling at any breakpoint
- [ ] Touch targets ≥ 44x44px on mobile
- [ ] Text readable without zoom (min 14px mobile)
- [ ] Images/media use responsive sizing

---

**Document ID:** STD-RESP-001  
**Location:** `/docs/3-standards/STD-RESP-001.md`
