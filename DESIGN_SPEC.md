# 🎨 Aethos Design Specification
**AI-Readable Design System for Codex/Copilot**

**Last Updated:** April 29, 2026  
**Design Language:** Cinematic Glassmorphism  
**Framework:** Tailwind CSS v4 + Motion (Framer Motion)  
**Status:** Active - Use this as source of truth for all UI implementation

---

## 📐 Design Tokens

### Color Palette

```css
/* Primary Colors */
--color-primary: #00F0FF;          /* Aethos Cyan - Primary brand color */
--color-primary-light: #66F5FF;    /* Light cyan for hover states */
--color-primary-dark: #00B8CC;     /* Dark cyan for active states */

/* Accent Colors */
--color-accent: #FF5733;           /* Coral - Call to action, alerts */
--color-accent-light: #FF8A66;     /* Light coral */
--color-accent-dark: #CC4529;      /* Dark coral */

/* Neutral Colors (Dark Theme) */
--color-background: #0A0E1A;       /* Deep navy background */
--color-surface: #141824;          /* Card/surface background */
--color-surface-elevated: #1E2330; /* Elevated surface (modals, dropdowns) */
--color-border: rgba(255, 255, 255, 0.1);  /* Subtle borders */
--color-border-hover: rgba(255, 255, 255, 0.2);

/* Text Colors */
--color-text-primary: #FFFFFF;     /* Primary text */
--color-text-secondary: #A0A8B8;   /* Secondary text */
--color-text-tertiary: #6B7280;    /* Disabled/placeholder text */

/* Glassmorphism */
--glass-background: rgba(20, 24, 36, 0.7);     /* Glass surface background */
--glass-background-light: rgba(30, 35, 48, 0.8); /* Lighter glass variant */
--glass-border: rgba(255, 255, 255, 0.1);      /* Glass border */
--glass-blur: 20px;                             /* Backdrop blur amount */

/* Semantic Colors */
--color-success: #10B981;          /* Success states */
--color-warning: #F59E0B;          /* Warning states */
--color-error: #EF4444;            /* Error states */
--color-info: #3B82F6;             /* Info states */

/* Risk Score Colors */
--risk-low: #10B981;      /* Green - Low risk (0-30) */
--risk-medium: #F59E0B;   /* Orange - Medium risk (31-60) */
--risk-high: #EF4444;     /* Red - High risk (61-100) */

/* Provider Colors */
--provider-microsoft: #00A4EF;     /* Microsoft blue */
--provider-slack: #4A154B;         /* Slack purple */
--provider-google: #4285F4;        /* Google blue */
--provider-box: #0061D5;           /* Box blue */
```

### Typography

```css
/* Font Families */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', Menlo, Monaco, monospace;

/* Font Sizes (Tailwind v4 - use class names) */
.text-xs    { font-size: 0.75rem; }   /* 12px */
.text-sm    { font-size: 0.875rem; }  /* 14px */
.text-base  { font-size: 1rem; }      /* 16px */
.text-lg    { font-size: 1.125rem; }  /* 18px */
.text-xl    { font-size: 1.25rem; }   /* 20px */
.text-2xl   { font-size: 1.5rem; }    /* 24px */
.text-3xl   { font-size: 1.875rem; }  /* 30px */
.text-4xl   { font-size: 2.25rem; }   /* 36px */
.text-5xl   { font-size: 3rem; }      /* 48px */

/* Font Weights */
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

/* Line Heights */
.leading-tight { line-height: 1.25; }
.leading-normal { line-height: 1.5; }
.leading-relaxed { line-height: 1.75; }
```

### Spacing Scale

```css
/* Tailwind Spacing (use these class names) */
.p-0  { padding: 0; }
.p-1  { padding: 0.25rem; }  /* 4px */
.p-2  { padding: 0.5rem; }   /* 8px */
.p-3  { padding: 0.75rem; }  /* 12px */
.p-4  { padding: 1rem; }     /* 16px */
.p-6  { padding: 1.5rem; }   /* 24px */
.p-8  { padding: 2rem; }     /* 32px */
.p-12 { padding: 3rem; }     /* 48px */
.p-16 { padding: 4rem; }     /* 64px */

/* Gap Spacing (for flex/grid) */
.gap-2  { gap: 0.5rem; }   /* 8px */
.gap-4  { gap: 1rem; }     /* 16px */
.gap-6  { gap: 1.5rem; }   /* 24px */
.gap-8  { gap: 2rem; }     /* 32px */
```

### Border Radius

```css
.rounded-sm  { border-radius: 0.125rem; }  /* 2px */
.rounded     { border-radius: 0.25rem; }   /* 4px */
.rounded-md  { border-radius: 0.375rem; }  /* 6px */
.rounded-lg  { border-radius: 0.5rem; }    /* 8px */
.rounded-xl  { border-radius: 0.75rem; }   /* 12px */
.rounded-2xl { border-radius: 1rem; }      /* 16px */
.rounded-3xl { border-radius: 1.5rem; }    /* 24px */
.rounded-full { border-radius: 9999px; }   /* Circular */

/* Default for cards/surfaces: rounded-xl (12px) */
```

### Shadows

```css
/* Glassmorphism Shadows */
.shadow-glass {
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
}

.shadow-glass-lg {
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.4),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
}

/* Standard Shadows */
.shadow-sm  { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
.shadow     { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
.shadow-md  { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.shadow-lg  { box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); }
.shadow-xl  { box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15); }
```

---

## 🎯 Component Specifications

### Button

**Visual Style:**
- Primary: Cyan background with white text
- Secondary: Transparent with cyan border
- Ghost: No background, cyan text only
- Danger: Red background with white text

**States:**
- Default: Solid color
- Hover: Lighter shade (10% lighter)
- Active: Darker shade (10% darker)
- Disabled: 50% opacity, cursor not-allowed

**Size Variants:**
```tsx
// Small Button
<button className="px-3 py-1.5 text-sm rounded-md">

// Medium Button (default)
<button className="px-4 py-2 text-base rounded-lg">

// Large Button
<button className="px-6 py-3 text-lg rounded-xl">
```

**Component Structure:**
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

// Example Usage
<Button variant="primary" size="md" icon={<SearchIcon />}>
  Search Files
</Button>
```

**Tailwind Classes:**
```tsx
// Primary Button
className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-lg 
           transition-colors duration-200 disabled:opacity-50"

// Secondary Button
className="border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 
           px-4 py-2 rounded-lg transition-colors duration-200"

// Ghost Button
className="text-cyan-500 hover:bg-cyan-500/10 px-4 py-2 rounded-lg 
           transition-colors duration-200"
```

---

### Card (Glassmorphic)

**Visual Style:**
- Background: Semi-transparent dark surface
- Border: Subtle white border (10% opacity)
- Backdrop blur: 20px
- Shadow: Soft outer shadow + inner highlight

**Component Structure:**
```tsx
interface CardProps {
  variant?: 'glass' | 'solid' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  elevation?: 'low' | 'medium' | 'high';
  children: React.ReactNode;
}
```

**Tailwind Classes:**
```tsx
// Glass Card (default)
className="
  bg-[rgba(20,24,36,0.7)] 
  border border-white/10 
  rounded-xl 
  p-6 
  backdrop-blur-[20px] 
  shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]
"

// Solid Card
className="bg-[#141824] border border-white/10 rounded-xl p-6 shadow-lg"

// Outlined Card
className="border-2 border-cyan-500/20 rounded-xl p-6 bg-transparent"
```

**Example:**
```tsx
<div className="bg-[rgba(20,24,36,0.7)] border border-white/10 rounded-xl p-6 
                backdrop-blur-[20px] shadow-glass">
  <h3 className="text-lg font-semibold text-white mb-2">Card Title</h3>
  <p className="text-sm text-gray-400">Card content goes here...</p>
</div>
```

---

### Input Field

**Visual Style:**
- Background: Dark surface with subtle border
- Border: White 10% opacity (20% on focus)
- Text: White primary
- Placeholder: Gray tertiary
- Focus: Cyan border glow

**Component Structure:**
```tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}
```

**Tailwind Classes:**
```tsx
// Text Input
className="
  w-full 
  bg-[#141824] 
  border border-white/10 
  rounded-lg 
  px-4 py-2.5 
  text-white 
  placeholder:text-gray-500
  focus:border-cyan-500 
  focus:ring-2 
  focus:ring-cyan-500/20
  focus:outline-none
  transition-all duration-200
  disabled:opacity-50 
  disabled:cursor-not-allowed
"

// With Icon (left)
<div className="relative">
  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
  <input className="pl-10 ..." />
</div>

// Error State
className="border-red-500 focus:border-red-500 focus:ring-red-500/20"
```

---

### Badge

**Visual Style:**
- Small pill-shaped indicator
- Solid background with contrasting text
- Used for status, counts, tags

**Variants:**
```tsx
// Status Badge
<span className="px-2 py-1 text-xs font-medium rounded-full 
                 bg-green-500/20 text-green-400 border border-green-500/30">
  Active
</span>

// Count Badge
<span className="px-2 py-0.5 text-xs font-semibold rounded-full 
                 bg-cyan-500 text-white">
  12
</span>

// Risk Badge (Dynamic Color)
{riskScore < 30 ? (
  <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
    Low Risk
  </span>
) : riskScore < 60 ? (
  <span className="px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-400">
    Medium Risk
  </span>
) : (
  <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
    High Risk
  </span>
)}
```

---

### Modal

**Visual Style:**
- Glassmorphic overlay (dark with blur)
- Centered card with elevated shadow
- Backdrop click to close
- Smooth fade-in animation

**Component Structure:**
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

**Tailwind Classes:**
```tsx
// Overlay
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 
                flex items-center justify-center p-4"
     onClick={onClose}>

  {/* Modal Container */}
  <div className="bg-[rgba(20,24,36,0.95)] border border-white/20 
                  rounded-2xl p-6 max-w-lg w-full shadow-glass-lg"
       onClick={(e) => e.stopPropagation()}>
    
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <button onClick={onClose} className="text-gray-400 hover:text-white">
        <XIcon />
      </button>
    </div>

    {/* Content */}
    <div className="text-gray-300">
      {children}
    </div>

    {/* Footer (optional) */}
    <div className="flex gap-3 mt-6 justify-end">
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button variant="primary">Confirm</Button>
    </div>
  </div>
</div>
```

---

### Table

**Visual Style:**
- Glassmorphic header row
- Alternating row backgrounds (subtle)
- Hover state on rows
- Sticky header on scroll

**Tailwind Classes:**
```tsx
<div className="overflow-x-auto rounded-xl border border-white/10">
  <table className="w-full">
    {/* Header */}
    <thead className="bg-[rgba(20,24,36,0.9)] backdrop-blur-md sticky top-0">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-semibold 
                       text-gray-400 uppercase tracking-wider">
          Name
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold 
                       text-gray-400 uppercase tracking-wider">
          Status
        </th>
      </tr>
    </thead>

    {/* Body */}
    <tbody className="divide-y divide-white/5">
      <tr className="hover:bg-white/5 transition-colors cursor-pointer">
        <td className="px-4 py-3 text-sm text-white">Document.pdf</td>
        <td className="px-4 py-3 text-sm">
          <Badge variant="success">Active</Badge>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

### Tabs

**Visual Style:**
- Underline style (not pills)
- Active tab: Cyan underline + white text
- Inactive tab: Gray text + transparent underline
- Hover: Lighter gray

**Tailwind Classes:**
```tsx
<div className="border-b border-white/10">
  <nav className="flex gap-8">
    {/* Active Tab */}
    <button className="pb-3 px-1 border-b-2 border-cyan-500 
                       text-sm font-medium text-white">
      Overview
    </button>

    {/* Inactive Tab */}
    <button className="pb-3 px-1 border-b-2 border-transparent 
                       text-sm font-medium text-gray-400 
                       hover:text-gray-300 hover:border-gray-400 
                       transition-colors">
      Details
    </button>
  </nav>
</div>
```

---

### Dropdown Menu

**Visual Style:**
- Glassmorphic popup
- Smooth slide-in animation
- Hover state on items
- Dividers between sections

**Tailwind Classes:**
```tsx
// Trigger Button
<button className="px-3 py-2 rounded-lg hover:bg-white/5 
                   flex items-center gap-2 text-sm text-gray-300">
  Options <ChevronDownIcon />
</button>

// Dropdown Panel (appears on click)
<div className="absolute right-0 mt-2 w-48 
                bg-[rgba(20,24,36,0.95)] backdrop-blur-md
                border border-white/10 rounded-lg shadow-glass-lg 
                py-1 z-50">
  
  {/* Menu Item */}
  <button className="w-full px-4 py-2 text-left text-sm text-gray-300 
                     hover:bg-white/10 hover:text-white transition-colors
                     flex items-center gap-2">
    <EditIcon className="w-4 h-4" />
    Edit
  </button>

  {/* Divider */}
  <div className="my-1 border-t border-white/10" />

  {/* Danger Item */}
  <button className="w-full px-4 py-2 text-left text-sm text-red-400 
                     hover:bg-red-500/10 hover:text-red-300 transition-colors
                     flex items-center gap-2">
    <TrashIcon className="w-4 h-4" />
    Delete
  </button>
</div>
```

---

## 🎬 Animation Specifications

### Motion Library
Use `motion/react` (Framer Motion) for animations.

### Standard Transitions

```tsx
// Fade In
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>

// Slide Up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
>

// Scale In
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>

// Stagger Children (for lists)
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
  initial="hidden"
  animate="show"
>
  {items.map(item => (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
    >
```

### Hover Effects

```tsx
// Button Hover
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
>

// Card Hover
<motion.div
  whileHover={{ 
    y: -4,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)"
  }}
  transition={{ duration: 0.3 }}
>
```

### Page Transitions

```tsx
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 20 }}
  transition={{ duration: 0.3 }}
>
```

---

## 📱 Layout Patterns

### Sidebar Layout (Primary)

```tsx
<div className="flex h-screen bg-[#0A0E1A]">
  {/* Sidebar */}
  <aside className="w-64 bg-[#141824] border-r border-white/10 
                    flex flex-col">
    {/* Logo */}
    <div className="p-6">
      <Logo />
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-3">
      {/* Nav items */}
    </nav>
  </aside>

  {/* Main Content */}
  <main className="flex-1 flex flex-col overflow-hidden">
    {/* Header */}
    <header className="h-16 bg-[#141824] border-b border-white/10 
                       px-6 flex items-center justify-between">
      {/* Header content */}
    </header>

    {/* Content Area */}
    <div className="flex-1 overflow-auto p-6">
      {/* Page content */}
    </div>
  </main>
</div>
```

### Dashboard Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Metric Cards */}
  <Card>
    <h3 className="text-sm font-medium text-gray-400 mb-1">Total Files</h3>
    <p className="text-3xl font-bold text-white">12,453</p>
    <p className="text-sm text-green-400 mt-2">↑ 12% from last month</p>
  </Card>
</div>
```

### Search Results Layout

```tsx
<div className="space-y-4">
  {/* Search Bar */}
  <div className="sticky top-0 bg-[#0A0E1A] pb-4 z-10">
    <SearchInput />
  </div>

  {/* Results */}
  <div className="space-y-2">
    {results.map(result => (
      <ResultCard key={result.id} {...result} />
    ))}
  </div>
</div>
```

---

## 🎨 Glassmorphism Effects

### Primary Glass Surface

```tsx
className="
  bg-[rgba(20,24,36,0.7)]
  backdrop-blur-[20px]
  border border-white/10
  shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]
"
```

### Elevated Glass Surface (Modals, Dropdowns)

```tsx
className="
  bg-[rgba(20,24,36,0.95)]
  backdrop-blur-[24px]
  border border-white/20
  shadow-[0_16px_48px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)]
"
```

### Glass Button

```tsx
className="
  bg-white/10
  hover:bg-white/15
  backdrop-blur-md
  border border-white/20
  text-white
  px-4 py-2
  rounded-lg
  transition-all duration-200
"
```

---

## 🎯 Icon System

**Library:** Lucide React (`lucide-react`)

**Usage:**
```tsx
import { Search, Bell, Settings, X, ChevronDown } from 'lucide-react';

<Search className="w-5 h-5 text-gray-400" />
```

**Size Guidelines:**
- Small: `w-4 h-4` (16px) - In buttons, badges
- Medium: `w-5 h-5` (20px) - Default for most UI
- Large: `w-6 h-6` (24px) - Headers, emphasis
- Extra Large: `w-8 h-8` (32px) - Empty states, illustrations

**Color Guidelines:**
- Default: `text-gray-400` (secondary)
- Active: `text-cyan-500` (primary action)
- Hover: `text-white` (interactive)
- Danger: `text-red-400` (destructive)

---

## 📏 Responsive Breakpoints

```css
/* Tailwind v4 Breakpoints */
sm: 640px   /* Mobile landscape, small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops, small desktops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */

/* Usage */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

**Mobile-First Approach:**
- Design for mobile first
- Add `md:`, `lg:` prefixes for larger screens
- Sidebar collapses on mobile
- Tables become cards on mobile

**Responsive Rules:**
- Mobile-first Tailwind only: default classes apply to mobile (< 768px); use `md:`, `lg:`, and `xl:` only for scaling up.
- Use Tailwind `@container` queries for modular cards, list items, and embedded widgets so components resize correctly inside Teams/iframe containers.
- Maintain minimum 44x44px touch targets for all buttons, links, dropdowns, and interactive icons on mobile.
- Reduce backdrop-blur intensity by ~50% on mobile breakpoint styles to preserve scroll performance and battery life.
- Favor stacked vertical layouts, compact spacing, and simplified mobile chrome before expanding to desktop.

---

## ✅ Accessibility Requirements

### Color Contrast
- Text on dark background: Minimum 4.5:1 ratio
- White text on `#0A0E1A`: ✅ Passes
- Cyan `#00F0FF` on dark: ✅ Passes for large text

### Focus States
```tsx
// Always include focus-visible styles
className="focus-visible:ring-2 focus-visible:ring-cyan-500 
           focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E1A]
           focus-visible:outline-none"
```

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order should be logical
- Escape key closes modals/dropdowns

### Screen Readers
```tsx
// Use aria labels
<button aria-label="Close modal">
  <X className="w-5 h-5" />
</button>

// Use semantic HTML
<nav aria-label="Main navigation">
<main aria-label="Main content">
<aside aria-label="Sidebar">
```

---

## 🎨 Example: Complete Component

### File Card Component

```tsx
import { motion } from 'motion/react';
import { FileIcon, MoreVertical, ExternalLink } from 'lucide-react';

interface FileCardProps {
  name: string;
  provider: 'microsoft' | 'slack' | 'google';
  riskScore: number;
  size: string;
  lastModified: string;
  url: string;
}

export function FileCard({ 
  name, 
  provider, 
  riskScore, 
  size, 
  lastModified, 
  url 
}: FileCardProps) {
  const riskColor = 
    riskScore < 30 ? 'text-green-400 bg-green-500/20' :
    riskScore < 60 ? 'text-orange-400 bg-orange-500/20' :
    'text-red-400 bg-red-500/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="
        bg-[rgba(20,24,36,0.7)]
        backdrop-blur-[20px]
        border border-white/10
        rounded-xl
        p-4
        shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]
        hover:border-white/20
        transition-all duration-300
        cursor-pointer
        group
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 
                          flex items-center justify-center">
            <FileIcon className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white 
                           group-hover:text-cyan-400 transition-colors">
              {name}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {provider} · {size}
            </p>
          </div>
        </div>

        <button className="text-gray-400 hover:text-white p-1 rounded 
                           hover:bg-white/10 transition-colors"
                aria-label="More options">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Risk Badge */}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${riskColor}`}>
            Risk: {riskScore}
          </span>

          {/* Provider Badge */}
          <span className="px-2 py-1 text-xs text-gray-400 
                           bg-white/5 rounded-full">
            {provider}
          </span>
        </div>

        {/* Open Link */}
        <a href={url} 
           target="_blank" 
           rel="noopener noreferrer"
           className="text-cyan-400 hover:text-cyan-300 transition-colors"
           aria-label="Open file">
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-500">
        Modified {lastModified}
      </div>
    </motion.div>
  );
}
```

---

## 🎯 AI Codex Instructions

### When Creating New Components:

1. **Always use Tailwind CSS v4** - No custom CSS unless absolutely necessary
2. **Follow glassmorphism pattern** - Use the specified backdrop-blur and rgba backgrounds
3. **Import icons from lucide-react** - `import { IconName } from 'lucide-react';`
4. **Use Motion for animations** - `import { motion } from 'motion/react';`
5. **Maintain dark theme** - All backgrounds should be dark (`#0A0E1A`, `#141824`)
6. **Use cyan as primary color** - `#00F0FF` for brand, accents, CTAs
7. **Include hover states** - All interactive elements should have hover feedback
8. **Add transitions** - Use `transition-colors duration-200` for smooth interactions
9. **Make it responsive** - Use `md:` and `lg:` breakpoints for larger screens
10. **Add accessibility** - Include `aria-label`, focus states, keyboard navigation

### Example Component Request:
"Create a notification dropdown component using glassmorphism style with motion animations"

### Codex Will Generate:
- Glassmorphic dropdown panel
- Motion fade-in animation
- Lucide icons
- Proper Tailwind classes
- Hover/focus states
- Accessibility attributes

---

**This design spec is the single source of truth. Reference it when implementing any UI component.**
