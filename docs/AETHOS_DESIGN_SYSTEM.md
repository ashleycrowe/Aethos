# Aethos Design System
## The Complete Visual & Interaction Reference

**Version:** 3.0 (V1-V4 Updated)  
**Last Updated:** March 1, 2026  
**Status:** ✅ Production Standard  
**Owner:** Design & Product Team  

> **This is the single source of truth for all Aethos design decisions.**  
> Share this document with designers, developers, and stakeholders.

---

## 📋 Quick Navigation

**For Designers:**
- [Brand Philosophy](#brand-philosophy) - What Aethos represents
- [Color System](#color-system) - Complete palette with use cases
- [Typography](#typography) - Fonts, sizes, and hierarchy
- [Components](#component-library) - UI building blocks

**For Developers:**
- [Implementation Guide](#implementation-guide) - Code examples
- [Tailwind Classes](#tailwind-reference) - Quick lookup
- [Component Props](#component-props) - Component APIs
- [Accessibility](#accessibility) - A11y requirements

**For Product/Leadership:**
- [Design Principles](#design-principles) - The "why" behind decisions
- [User Experience Goals](#ux-goals) - What we optimize for
- [Competitive Differentiation](#differentiation) - How we stand out

---

# Brand Philosophy

## The Aethos Ethos: "Organizational Clarity Through Intelligence"

Aethos is **not** a traditional enterprise tool. It is:
- ✅ A **mission control center** for organizational content
- ✅ An **intelligence layer** that transforms chaos into clarity
- ✅ An **operational architect's dashboard** for visibility and control

It is **not**:
- ❌ A file browser
- ❌ A security janitor interface
- ❌ A cluttered admin panel

---

## Design Principles (The Non-Negotiables)

### 1. Operational Clarity Over Visual Flair
**Rule:** Every pixel serves a purpose. If it's decorative, remove it.

**Examples:**
- ✅ Color-coded risk badges (orange = waste, red = high exposure)
- ✅ Provider icons (M365, Slack, Google) for instant recognition
- ❌ Decorative background patterns
- ❌ Unnecessary animations

### 2. Cinematic Glassmorphism
**Rule:** Interfaces should feel like floating in deep space with translucent glass panels.

**Why:** Creates depth without clutter. High contrast makes information pop.

**Implementation:**
```tsx
// ✅ Aethos Glass Card (Standard)
<div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
  {/* Content floats on glass */}
</div>

// ❌ Wrong: Solid card
<div className="bg-gray-800 rounded-lg p-4">
  {/* Feels flat and dated */}
</div>
```

### 3. Narrative Over Numbers
**Rule:** Show the "story" first. Hide raw calculations behind an info icon.

**Example:**
```tsx
// User sees:
"30% of storage is dead capital (unused 6+ months)"

// Hover on ℹ️ shows:
"42.3 GB / 140 GB total = 30.2% waste ratio"
```

### 4. Dark Mode Default
**Rule:** `#0B0F19` (Deep Space) is the primary background. Light mode exists for accessibility only.

**Why:** Enterprise users work long hours. Dark mode reduces eye strain and makes neon indicators (cyan, orange) more impactful.

### 5. Three-Click Maximum
**Rule:** Critical actions must be accessible within 3 clicks from any screen.

**Examples:**
- Archive files: Discovery → Select → Archive (2 clicks)
- Create workspace: Sidebar → New Workspace (1 click)
- Search: `/` hotkey → Type → Enter (always accessible)

---

# Color System

## Primary Palette

### Starlight Cyan `#00F0FF`
**Use for:** Primary CTAs, growth indicators, active sync states, success confirmations

```tsx
// Button
className="bg-[#00F0FF] text-black"

// Glow effect
className="shadow-[0_0_20px_rgba(0,240,255,0.3)]"

// Badge
className="bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/30"
```

**Psychology:** Confidence, clarity, intelligence, forward motion

---

### Supernova Orange `#FF5733`
**Use for:** Alerts, waste indicators, deletion warnings, high-priority risks

```tsx
// Risk badge
className="bg-[#FF5733]/10 text-[#FF5733] border-[#FF5733]/30"

// Alert button
className="bg-[#FF5733] text-white hover:bg-[#FF6B47]"
```

**Psychology:** Urgency, attention, inefficiency, heat

---

### Deep Space `#0B0F19`
**Use for:** Primary background, canvas, page base

```tsx
// Page wrapper
className="bg-[#0B0F19] min-h-screen"

// Modal backdrop
className="bg-[#0B0F19]/80 backdrop-blur-sm"
```

**Psychology:** Focus, depth, professionalism, void

---

## Secondary Palette

### Void Slate `#1A1F2E`
**Use for:** Secondary backgrounds, input fields, code blocks

```tsx
className="bg-[#1A1F2E] border-white/10"
```

---

### Frost `#FFFFFF` (Used at low opacity)
**Use for:** Glass effects, borders, text overlays

```tsx
// Glass card
className="bg-white/5 border-white/10"

// Divider
className="border-t border-white/10"

// Secondary text
className="text-white/60"
```

---

### Provider-Specific Colors

```tsx
// Microsoft 365
className="text-[#0078D4]" // M365 Blue

// Slack
className="text-[#E01E5A]" // Slack Magenta

// Google Workspace
className="text-[#4285F4]" // Google Blue

// Box
className="text-[#0061D5]" // Box Blue
```

---

## Semantic Colors

### Success States
```tsx
className="text-emerald-400"        // Success text
className="bg-emerald-500/10"       // Success background
className="border-emerald-500/30"   // Success border
```

### Warning States
```tsx
className="text-amber-400"          // Warning text
className="bg-amber-500/10"         // Warning background
className="border-amber-500/30"     // Warning border
```

### Error States
```tsx
className="text-red-400"            // Error text
className="bg-red-500/10"           // Error background
className="border-red-500/30"       // Error border
```

### Info States
```tsx
className="text-sky-400"            // Info text
className="bg-sky-500/10"           // Info background
className="border-sky-500/30"       // Info border
```

---

# Typography

## Font Families

### Primary: Inter
**Use for:** UI text, body copy, labels, buttons

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Weights:**
- `font-normal` (400) - Body text, descriptions
- `font-medium` (500) - Labels, menu items
- `font-semibold` (600) - Subheadings, emphasis
- `font-bold` (700) - Headings, card titles
- `font-black` (900) - Primary buttons, hero text

---

### Monospace: JetBrains Mono
**Use for:** Code snippets, API keys, technical IDs, metrics

```css
font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

---

## Type Scale

```tsx
// Hero (Page titles)
className="text-5xl font-black text-white"  // 48px

// H1 (Section headers)
className="text-4xl font-bold text-white"   // 36px

// H2 (Card headers)
className="text-2xl font-bold text-white"   // 24px

// H3 (Subsections)
className="text-xl font-semibold text-white" // 20px

// Body (Default text)
className="text-base text-white/80"         // 16px

// Small (Captions, labels)
className="text-sm text-white/60"           // 14px

// Tiny (Badges, timestamps)
className="text-xs text-white/50"           // 12px
```

---

## Text Hierarchy Rules

### Primary Text (Most Important)
```tsx
className="text-white font-bold"
// Use for: Page titles, card headers, primary metrics
```

### Secondary Text (Supporting)
```tsx
className="text-white/80"
// Use for: Body text, descriptions, tooltips
```

### Tertiary Text (Least Important)
```tsx
className="text-white/50"
// Use for: Timestamps, metadata, subtle hints
```

---

# Component Library

## Core Components (Atoms)

### Glass Card
**Use case:** Base container for all content sections

```tsx
<div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
  <h3 className="text-xl font-bold text-white mb-4">Card Title</h3>
  <p className="text-white/70">Card content goes here.</p>
</div>
```

**Variants:**
```tsx
// Elevated (hover state)
className="hover:bg-white/10 transition-colors duration-200"

// Clickable card
className="cursor-pointer hover:border-[#00F0FF]/50"

// Danger card (warnings)
className="border-[#FF5733]/30 bg-[#FF5733]/5"
```

---

### Primary Button
**Use case:** Main call-to-action (Create, Execute, Confirm)

```tsx
<button className="bg-[#00F0FF] text-black font-black uppercase tracking-wider 
                   px-6 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.3)]
                   hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] 
                   active:scale-95 transition-all duration-200">
  Create Workspace
</button>
```

---

### Secondary Button
**Use case:** Non-primary actions (Cancel, Go Back, View Details)

```tsx
<button className="bg-white/5 text-white border border-white/20 
                   px-6 py-3 rounded-2xl hover:bg-white/10 
                   transition-colors duration-200">
  Cancel
</button>
```

---

### Danger Button
**Use case:** Destructive actions (Delete, Revoke, Purge)

```tsx
<button className="bg-[#FF5733] text-white font-bold uppercase tracking-wider
                   px-6 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(255,87,51,0.3)]
                   hover:shadow-[0_0_40px_rgba(255,87,51,0.5)]
                   transition-all duration-200">
  Delete Permanently
</button>
```

---

### Badge (Status)
**Use case:** Visual indicators for state, risk level, provider type

```tsx
// Active state (Cyan)
<span className="bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 
                 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
  Active
</span>

// Warning/Risk (Orange)
<span className="bg-[#FF5733]/10 text-[#FF5733] border border-[#FF5733]/30 
                 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
  Ghost Town
</span>

// Archived (Purple)
<span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 
                 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
  Archived
</span>
```

---

### Input Field
**Use case:** Text input, search, forms

```tsx
<input 
  type="text"
  placeholder="Search artifacts..."
  className="w-full bg-[#1A1F2E] text-white border border-white/10 
             rounded-xl px-4 py-3 placeholder:text-white/40
             focus:border-[#00F0FF]/50 focus:ring-2 focus:ring-[#00F0FF]/20
             transition-all duration-200"
/>
```

---

### Dropdown Select
**Use case:** Provider selection, filter menus

```tsx
<select className="bg-[#1A1F2E] text-white border border-white/10 
                   rounded-xl px-4 py-3 cursor-pointer
                   focus:border-[#00F0FF]/50 focus:ring-2 focus:ring-[#00F0FF]/20">
  <option>All Providers</option>
  <option>Microsoft 365</option>
  <option>Slack</option>
  <option>Google Workspace</option>
</select>
```

---

### Toggle Switch
**Use case:** Feature flags, visibility toggles

```tsx
// Using Radix UI Switch (recommended)
<Switch.Root className="w-11 h-6 bg-white/10 rounded-full 
                        data-[state=checked]:bg-[#00F0FF] 
                        transition-colors duration-200">
  <Switch.Thumb className="block w-5 h-5 bg-white rounded-full 
                           translate-x-0.5 data-[state=checked]:translate-x-5 
                           transition-transform duration-200" />
</Switch.Root>
```

---

## Complex Components (Molecules)

### Metric Card
**Use case:** Display KPIs, storage stats, intelligence scores

```tsx
<div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm text-white/60 uppercase tracking-wider">Total Storage</span>
    <InfoIcon className="w-4 h-4 text-white/40 cursor-help" />
  </div>
  <div className="text-4xl font-black text-white mb-1">1.2 TB</div>
  <div className="text-sm text-emerald-400">↑ 12% from last month</div>
</div>
```

---

### Provider Badge
**Use case:** Show which platform an artifact belongs to

```tsx
<div className="flex items-center gap-2 bg-[#0078D4]/10 border border-[#0078D4]/30 
                rounded-full px-3 py-1.5">
  <MicrosoftIcon className="w-4 h-4 text-[#0078D4]" />
  <span className="text-xs font-bold text-[#0078D4] uppercase">Microsoft 365</span>
</div>
```

---

### Artifact Card
**Use case:** Display individual files/channels/folders

```tsx
<div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4
                hover:border-[#00F0FF]/30 cursor-pointer transition-all duration-200">
  <div className="flex items-start gap-4">
    {/* Icon */}
    <div className="w-10 h-10 bg-[#00F0FF]/10 rounded-lg flex items-center justify-center">
      <FileIcon className="w-5 h-5 text-[#00F0FF]" />
    </div>
    
    {/* Content */}
    <div className="flex-1">
      <h4 className="text-white font-semibold mb-1">Q1_Budget_Final.xlsx</h4>
      <p className="text-sm text-white/50">Modified 3 days ago · 2.4 MB</p>
    </div>
    
    {/* Badges */}
    <div className="flex gap-2">
      <span className="bg-[#FF5733]/10 text-[#FF5733] border border-[#FF5733]/30 
                       rounded-full px-2 py-1 text-xs font-bold">Ghost Town</span>
    </div>
  </div>
</div>
```

---

### Search Bar (Oracle)
**Use case:** Universal search with AI-powered suggestions

```tsx
<div className="relative">
  <div className="flex items-center gap-3 bg-[#1A1F2E] border border-white/10 
                  rounded-2xl px-4 py-3 focus-within:border-[#00F0FF]/50 
                  transition-colors">
    <SearchIcon className="w-5 h-5 text-white/40" />
    <input 
      type="text"
      placeholder="Ask Oracle anything... (Press / to focus)"
      className="flex-1 bg-transparent text-white placeholder:text-white/40 
                 focus:outline-none"
    />
    <kbd className="text-xs text-white/40 px-2 py-1 bg-white/5 rounded">⌘K</kbd>
  </div>
  
  {/* Suggestions dropdown would go here */}
</div>
```

---

### Workspace Cluster Chip
**Use case:** Represent workspaces in The Nexus

```tsx
<div className="backdrop-blur-xl bg-gradient-to-br from-[#00F0FF]/20 to-purple-500/20 
                border border-[#00F0FF]/30 rounded-2xl p-6 cursor-pointer
                hover:scale-105 hover:shadow-[0_0_40px_rgba(0,240,255,0.4)]
                transition-all duration-300">
  <div className="text-2xl mb-2">💼</div>
  <h3 className="text-lg font-bold text-white mb-2">Q1 Budget</h3>
  <div className="flex items-center gap-2 text-sm text-white/60">
    <span>42 artifacts</span>
    <span>•</span>
    <span>4 sync rules</span>
  </div>
</div>
```

---

## Layout Components (Organisms)

### Page Header
**Use case:** Top section of every page with title and actions

```tsx
<header className="border-b border-white/10 px-8 py-6">
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-4xl font-black text-white mb-2">The Constellation</h1>
      <p className="text-white/60">Discover and organize your Microsoft 365 content</p>
    </div>
    <button className="bg-[#00F0FF] text-black font-black uppercase tracking-wider 
                       px-6 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.3)]">
      Start Discovery Scan
    </button>
  </div>
</header>
```

---

### Sidebar Navigation
**Use case:** Main app navigation

```tsx
<aside className="w-64 border-r border-white/10 p-6">
  <nav className="space-y-2">
    {/* Active item */}
    <a href="/constellation" 
       className="flex items-center gap-3 px-4 py-3 bg-[#00F0FF]/10 
                  text-[#00F0FF] rounded-xl font-semibold">
      <StarIcon className="w-5 h-5" />
      <span>The Constellation</span>
    </a>
    
    {/* Inactive items */}
    <a href="/nexus" 
       className="flex items-center gap-3 px-4 py-3 text-white/60 
                  hover:bg-white/5 hover:text-white rounded-xl transition-all">
      <GridIcon className="w-5 h-5" />
      <span>The Nexus</span>
    </a>
  </nav>
</aside>
```

---

### Bulk Actions Toolbar
**Use case:** Multi-select actions in tables

```tsx
<div className="fixed bottom-8 left-1/2 -translate-x-1/2 
                backdrop-blur-xl bg-white/10 border border-white/20 
                rounded-2xl px-6 py-4 shadow-2xl">
  <div className="flex items-center gap-6">
    <span className="text-white font-semibold">12 items selected</span>
    
    <div className="flex gap-3">
      <button className="px-4 py-2 bg-[#00F0FF]/10 text-[#00F0FF] 
                         rounded-xl hover:bg-[#00F0FF]/20 transition-colors">
        Archive
      </button>
      <button className="px-4 py-2 bg-white/5 text-white 
                         rounded-xl hover:bg-white/10 transition-colors">
        Add to Workspace
      </button>
      <button className="px-4 py-2 bg-[#FF5733]/10 text-[#FF5733] 
                         rounded-xl hover:bg-[#FF5733]/20 transition-colors">
        Delete
      </button>
    </div>
    
    <button className="text-white/60 hover:text-white">
      <XIcon className="w-5 h-5" />
    </button>
  </div>
</div>
```

---

# Animation & Motion

## Animation Principles

### 1. Purpose-Driven Motion
**Rule:** Animate only when it signals a state change or guides user attention.

**Examples:**
- ✅ Loading spinner during discovery scan
- ✅ Hover glow on primary buttons
- ✅ Slide-in for notifications
- ❌ Bouncing icons for decoration
- ❌ Rotating elements with no purpose

---

### 2. Performance First
**Rule:** Use CSS transforms (`translate`, `scale`, `opacity`) instead of layout properties (`top`, `left`, `width`).

**Why:** Transforms use GPU acceleration and don't trigger layout recalculation.

```tsx
// ✅ Good: GPU-accelerated
className="hover:scale-105 transition-transform"

// ❌ Bad: Triggers layout reflow
className="hover:w-[120%] transition-all"
```

---

## Standard Animations

### Hover Glow (Primary Buttons)
```tsx
className="shadow-[0_0_20px_rgba(0,240,255,0.3)]
           hover:shadow-[0_0_40px_rgba(0,240,255,0.5)]
           transition-all duration-200"
```

---

### Card Hover Lift
```tsx
className="hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
```

---

### Fade In (Page Load)
```tsx
// Using Framer Motion (recommended)
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

---

### Slide In (Notifications)
```tsx
<motion.div
  initial={{ x: 400, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: 400, opacity: 0 }}
  transition={{ type: "spring", damping: 25, stiffness: 300 }}
>
  {/* Notification */}
</motion.div>
```

---

### Pulse (Loading State)
```tsx
className="animate-pulse"

// Or for custom pulse:
@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

className="animate-[pulse-glow_2s_ease-in-out_infinite]"
```

---

### Skeleton Loading
```tsx
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-white/10 rounded w-3/4"></div>
  <div className="h-4 bg-white/10 rounded w-1/2"></div>
  <div className="h-4 bg-white/10 rounded w-5/6"></div>
</div>
```

---

## Timing Guidelines

```css
/* Instant feedback (buttons, toggles) */
duration-100   /* 100ms */

/* Standard transitions (hover, focus) */
duration-200   /* 200ms */

/* Complex animations (modals, panels) */
duration-300   /* 300ms */

/* Dramatic effects (page transitions) */
duration-500   /* 500ms */
```

---

# Accessibility

## Color Contrast Requirements

### WCAG AA Compliance (Minimum)
- **Normal text (16px):** Contrast ratio ≥ 4.5:1
- **Large text (24px+):** Contrast ratio ≥ 3:1
- **Interactive elements:** Contrast ratio ≥ 3:1

**Pre-approved combinations:**
```tsx
// ✅ White on Deep Space: 15.52:1 (Excellent)
className="text-white bg-[#0B0F19]"

// ✅ Starlight Cyan on Black: 9.84:1 (Excellent)
className="text-[#00F0FF] bg-black"

// ✅ White/60 on Deep Space: 9.31:1 (Good for secondary text)
className="text-white/60 bg-[#0B0F19]"
```

---

## Keyboard Navigation

### Focus States (Required)
```tsx
// All interactive elements must have visible focus:
className="focus:outline-none focus:ring-2 focus:ring-[#00F0FF]/50"

// Button focus
className="focus-visible:ring-4 focus-visible:ring-[#00F0FF]/30"
```

---

### Tab Order
```tsx
// Use semantic HTML for natural tab order:
<nav>...</nav>
<main>...</main>
<aside>...</aside>

// For custom tab order (use sparingly):
<button tabIndex={1}>Primary Action</button>
<button tabIndex={2}>Secondary Action</button>
```

---

### Keyboard Shortcuts

**Global shortcuts (always available):**
- `/` or `Cmd/Ctrl + K` - Open Oracle Search
- `Esc` - Close modals/dropdowns
- `?` - Show keyboard shortcuts help

**Context shortcuts (when applicable):**
- `N` - Create new workspace
- `S` - Start discovery scan
- `A` - Archive selected items
- `D` - Delete selected items

```tsx
// Implement with:
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === '/' && !isInputFocused) {
      e.preventDefault();
      openSearch();
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

---

## Screen Reader Support

### ARIA Labels (Required)
```tsx
// Icon-only buttons
<button aria-label="Delete artifact">
  <TrashIcon className="w-5 h-5" />
</button>

// Status indicators
<span aria-label="High risk level" className="bg-[#FF5733]/10 ...">
  ⚠️ High Risk
</span>

// Loading states
<div aria-busy="true" aria-label="Scanning Microsoft 365 tenant...">
  <Spinner />
</div>
```

---

### Semantic HTML
```tsx
// ✅ Use semantic elements
<nav>...</nav>
<article>...</article>
<section>...</section>
<aside>...</aside>

// ❌ Avoid div soup
<div className="nav">...</div>
<div className="article">...</div>
```

---

## Motion Preferences

### Respect `prefers-reduced-motion`
```tsx
// Tailwind utility
className="motion-safe:animate-bounce motion-reduce:animate-none"

// Or in custom CSS:
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

# Implementation Guide

## Tailwind Configuration

Ensure your `tailwind.config.js` includes:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'starlight': '#00F0FF',
        'supernova': '#FF5733',
        'deep-space': '#0B0F19',
        'void-slate': '#1A1F2E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      backdropBlur: {
        'xl': '24px',
      },
    },
  },
};
```

---

## Component Prop Conventions

### Standard Props
All Aethos components should accept these props:

```tsx
interface AethosComponentProps {
  className?: string;           // Allow style overrides
  children?: React.ReactNode;   // Composability
  'aria-label'?: string;        // Accessibility
  testId?: string;              // Testing
}

// Example usage:
<GlassCard 
  className="custom-override" 
  aria-label="Discovery metrics card"
  testId="discovery-metrics-card"
>
  {/* Content */}
</GlassCard>
```

---

## Responsive Design

### Breakpoints (Tailwind default)
```tsx
sm:   // 640px  (tablet portrait)
md:   // 768px  (tablet landscape)
lg:   // 1024px (desktop)
xl:   // 1280px (large desktop)
2xl:  // 1536px (ultra-wide)
```

### Mobile-First Approach
```tsx
// ✅ Default mobile, scale up
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Cards */}
</div>

// ❌ Avoid desktop-first
<div className="grid-cols-3 lg:grid-cols-2 md:grid-cols-1">
  {/* This is harder to reason about */}
</div>
```

---

## Common Patterns

### Loading State
```tsx
{isLoading ? (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 
                    border-4 border-white/10 border-t-[#00F0FF]" />
  </div>
) : (
  <ContentComponent />
)}
```

---

### Empty State
```tsx
<div className="text-center py-16">
  <div className="w-24 h-24 mx-auto mb-6 rounded-full 
                  bg-white/5 flex items-center justify-center">
    <InboxIcon className="w-12 h-12 text-white/30" />
  </div>
  <h3 className="text-2xl font-bold text-white mb-2">No artifacts found</h3>
  <p className="text-white/60 mb-6">
    Start a discovery scan to populate your constellation
  </p>
  <button className="bg-[#00F0FF] text-black font-black uppercase 
                     px-6 py-3 rounded-2xl">
    Start Scan
  </button>
</div>
```

---

### Error State
```tsx
<div className="backdrop-blur-xl bg-[#FF5733]/5 border border-[#FF5733]/30 
                rounded-2xl p-6">
  <div className="flex items-start gap-4">
    <AlertTriangleIcon className="w-6 h-6 text-[#FF5733] flex-shrink-0" />
    <div className="flex-1">
      <h3 className="text-lg font-bold text-white mb-2">
        Discovery Scan Failed
      </h3>
      <p className="text-white/70 mb-4">
        Unable to connect to Microsoft Graph API. Check your permissions.
      </p>
      <button className="text-[#00F0FF] hover:underline">
        View troubleshooting guide →
      </button>
    </div>
  </div>
</div>
```

---

# Design Tokens (Quick Reference)

## Spacing Scale
```tsx
gap-1   // 4px   - Tight spacing (badges, icons)
gap-2   // 8px   - Compact elements
gap-3   // 12px  - Related items
gap-4   // 16px  - Standard spacing (default)
gap-6   // 24px  - Section spacing
gap-8   // 32px  - Major sections
gap-12  // 48px  - Page-level spacing
```

## Border Radius
```tsx
rounded-lg   // 8px  - Small elements (badges, inputs)
rounded-xl   // 12px - Medium elements (buttons)
rounded-2xl  // 16px - Large elements (cards)
rounded-full // 9999px - Pills, avatars
```

## Shadows
```tsx
// Glass card (default)
shadow-none

// Hover state (buttons)
shadow-[0_0_20px_rgba(0,240,255,0.3)]

// Active/Focus state
shadow-[0_0_40px_rgba(0,240,255,0.5)]

// Floating toolbar
shadow-2xl
```

---

# Version-Specific UI Patterns

## V1: Core Discovery & Workspaces

### Discovery Star Map
- **Visual:** Constellation of dots representing artifacts
- **Interaction:** Click to select, drag to zoom
- **Color:** Cyan dots for active, gray for stale, orange for risk

### Workspace Clusters (Nexus)
- **Visual:** Glassmorphic cards with gradient borders
- **Size:** Proportional to artifact count
- **Hover:** Scale up + glow effect

---

## V1.5: AI+ Intelligence Layer

### Semantic Search Results
- **Highlight:** Query keywords in yellow
- **Score:** Relevance percentage (0-100%) with progress bar
- **Snippet:** First 200 chars of matching content

### AI Summary Card
- **Header:** "Oracle Summary" with sparkle icon ✨
- **Content:** 2-3 paragraph summary
- **Key Points:** Bullet list with cyan bullets
- **Action:** "View Full Document" button

---

## V2: Multi-Provider Integration

### Provider Selector
- **Style:** Segmented control with provider icons
- **States:** All | M365 | Slack | Google | Box
- **Active:** Cyan underline + provider brand color

### Cross-Platform Artifact Card
- **Badge:** Small provider icon in top-right
- **Color:** Border uses provider brand color (10% opacity)
- **Hover:** Provider color glow effect

---

## V3: Governance & Compliance

### Retention Policy Builder
- **Step 1:** Rule criteria (inactivity, age, tags)
- **Step 2:** Action (archive, delete, flag)
- **Step 3:** Schedule (daily, weekly, monthly)
- **Visual:** Wizard with progress dots

### Anomaly Alert Card
- **Severity:** Color-coded border (yellow/orange/red)
- **Icon:** Warning triangle with animation
- **Action:** "Investigate" button
- **Dismiss:** X icon in top-right

---

## V4: Federation & Ecosystem

### MSP Tenant Switcher
- **Style:** Dropdown with tenant logos
- **Search:** Filter by tenant name
- **Badge:** Active tenant count (e.g., "12 tenants")

### API Usage Dashboard
- **Metrics:** Calls this month, rate limit, overage
- **Chart:** Line graph with cyan line
- **Alert:** Orange badge if >90% quota used

---

# Competitive Differentiation

## What Makes Aethos Design Unique

### vs. SharePoint/OneDrive
- ❌ **Them:** Flat, utilitarian, Windows 95 vibes
- ✅ **Us:** Cinematic glassmorphism, mission control aesthetics

### vs. Box/Dropbox
- ❌ **Them:** Pastel blues, friendly consumer UI
- ✅ **Us:** Dark mode default, enterprise intelligence layer

### vs. Google Workspace
- ❌ **Them:** Material Design, colorful but generic
- ✅ **Us:** Narrative-driven metrics, operational architect language

### vs. Slack
- ❌ **Them:** Chat-first, purple brand, playful
- ✅ **Us:** Discovery-first, metadata intelligence, professional

---

# Maintenance & Updates

## When to Update This Guide

- ✅ New component patterns emerge (3+ similar implementations)
- ✅ Design principles change (e.g., new color added to palette)
- ✅ Accessibility requirements update (WCAG 2.2+)
- ✅ Version-specific features launch (V5, V6, etc.)

## How to Propose Changes

1. **Document the reason:** What problem does this solve?
2. **Show examples:** Visual mockups or code snippets
3. **Get design review:** 2+ team members approve
4. **Update guide:** Create PR with changes
5. **Announce:** Share in #design-updates Slack channel

---

# Quick Checklist for New Features

Before shipping any new UI component, verify:

- [ ] Uses Aethos glass card styling (backdrop-blur-xl, bg-white/5)
- [ ] Primary CTAs use Starlight Cyan (#00F0FF)
- [ ] Alerts/risks use Supernova Orange (#FF5733)
- [ ] Text hierarchy is clear (white → white/80 → white/60)
- [ ] Focus states are visible (ring-2 ring-[#00F0FF]/50)
- [ ] ARIA labels for icon-only buttons
- [ ] Keyboard navigation works (tab order, shortcuts)
- [ ] Animations respect prefers-reduced-motion
- [ ] Mobile responsive (test at 375px width minimum)
- [ ] Color contrast meets WCAG AA (≥4.5:1 for text)

---

# Resources & Tools

## Design Tools
- **Figma:** [Aethos Component Library](https://figma.com/aethos-components)
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Motion Library:** https://motion.dev (Framer Motion fork)

## Accessibility Testing
- **Color Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Screen Reader:** macOS VoiceOver, NVDA (Windows)
- **Lighthouse:** Built into Chrome DevTools

## Inspiration
- **Linear:** https://linear.app (glassmorphism, dark mode)
- **Vercel:** https://vercel.com (minimalist, high contrast)
- **Raycast:** https://raycast.com (command palette UX)

---

**Document Owner:** Design & Product Team  
**Last Updated:** March 1, 2026  
**Next Review:** June 1, 2026 (quarterly)

**Questions?** Ping #design-system in Slack or email design@aethos.com
