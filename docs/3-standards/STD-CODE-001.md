# [STANDARD] Aethos Code Quality & Review Standards
## Engineering Excellence for the Intelligence Sidecar

---
status: Active
type: Core Development Standard
phase: All Phases
audience: [Engineering, DevOps, QA]
priority: Critical
last_updated: 2026-02-27
document_id: STD-CODE-001
location: `/docs/3-standards/STD-CODE-001.md`
---

## 💎 The Aethos Code Philosophy

Aethos code must be as clear as the "Glass" design system it powers. We prioritize type safety to prevent "Ghost Town" runtime errors and maintain a strict functional component architecture for rapid AppSource iterations.

**Architecture Context:** Simplified free-tier (Vercel + Supabase). See `/docs/2-ARCHITECTURE/SIMPLIFIED_ARCHITECTURE.md`

---

## 🚨 MANDATORY CRITICAL RULES

1. **STRICT TYPES ONLY:** The `any` type is considered a security vulnerability in Aethos. Use `unknown` or explicit interfaces.

2. **CONVENTIONAL COMMITS:** All commits must follow the pattern `type(scope): description`
   - Examples: `feat(nexus): add semantic link`, `fix(oracle): correct search ranking`

3. **COMPONENT PURITY:** React components must be functional and use the "Aethos Glass" design tokens
   - No inline styles; use Tailwind v4 utility classes
   - All components must follow atomic design hierarchy (see `/docs/MASTER_DESIGN_GUIDE.md`)

4. **SIDECAR ISOLATION:** Logic that interacts with the backend (Vercel Functions/Supabase) must reside in `/src/app/services` or `/src/app/utils`, never directly inside UI components

5. **ZERO LINT ERRORS:** All code must pass ESLint and Prettier configurations before submission

6. **ROW-LEVEL SECURITY:** All database queries must respect tenant_id isolation (see `STD-DATA-001.md`)

---

## 🏗️ Code Organization

### Directory Structure (Updated for Simplified Architecture)

```
/src/app/
  ├── components/        # UI components (PascalCase)
  │   ├── constellation/ # Discovery module components
  │   ├── nexus/         # Workspace module components
  │   ├── oracle/        # Search module components
  │   └── shared/        # Shared/atomic components
  ├── services/          # API and backend logic (camelCase)
  │   ├── supabase/      # Supabase client & queries
  │   ├── microsoft/     # M365 Graph API integration
  │   └── oracle/        # Oracle AI services
  ├── utils/             # Pure functions and helpers (camelCase)
  ├── types/             # Centralized TypeScript definitions
  ├── routes.ts          # React Router configuration
  └── App.tsx            # Main app component

/docs/
  ├── 3-standards/       # All standards documents (this directory)
  ├── 2-ARCHITECTURE/    # Architecture documentation
  ├── MASTER_DESIGN_GUIDE.md
  └── AETHOS_CONSOLIDATED_SPEC_V2.md

/api/                    # Vercel Serverless Functions
  ├── microsoft/         # M365 integration endpoints
  ├── oracle/            # AI processing endpoints
  └── tenant/            # Tenant management endpoints
```

### Naming Conventions

- **Components:** `WorkspaceBuilder.tsx` (PascalCase)
- **Hooks:** `useNexusSync.ts` (camelCase with `use` prefix)
- **Services:** `supabaseClient.ts` (camelCase)
- **Constants:** `const MAX_GHOST_TOWNS = 50;` (UPPER_SNAKE_CASE)
- **Types/Interfaces:** `interface WorkspaceMetadata` (PascalCase)

---

## 🔍 Pull Request & Review Logic

### PR Guidelines

- **Scope:** PRs should target a single feature or bug (max 500 lines)
- **Title:** Follow conventional commit format: `feat(module): description`
- **Description:** Include "Why" and "What" (not just code changes)

### Review Checklist

Before submitting a PR:

- [ ] **Type Safety:** No `any` types, all interfaces defined
- [ ] **Design System:** Components use glass cards, proper colors, atomic design
- [ ] **Accessibility:** Screen reader optimization (STD-A11Y-001) met
- [ ] **Security:** Row-level security respected, no PII logged
- [ ] **Performance:** No N+1 queries, images optimized
- [ ] **Testing:** Critical paths have unit tests
- [ ] **Responsive:** Works on mobile (< 768px)
- [ ] **Documentation:** JSDoc for exported functions
- [ ] **Linting:** Zero ESLint/Prettier errors

---

## 🎯 Functional Requirements for Components

### Every Aethos Component Must:

1. **Use TypeScript strict mode** (no implicit any)
2. **Follow atomic design** (Atom, Molecule, or Organism)
3. **Use design tokens** (colors from `/docs/MASTER_DESIGN_GUIDE.md`)
4. **Be accessible** (ARIA labels, keyboard navigation)
5. **Handle loading/error states** (see `STD-ERROR-001.md`)
6. **Be responsive** (mobile-first with breakpoints)

### Example Component Template

```tsx
import { useState } from 'react';
import { Zap } from 'lucide-react';

interface WorkspaceCardProps {
  workspaceId: string;
  name: string;
  intelligenceScore: number;
  onSync: (id: string) => Promise<void>;
}

/**
 * Workspace card component following Level 2 (Molecule) atomic design
 * @see /docs/MASTER_DESIGN_GUIDE.md Section 2.3
 */
export function WorkspaceCard({ 
  workspaceId, 
  name, 
  intelligenceScore, 
  onSync 
}: WorkspaceCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      await onSync(workspaceId);
    } catch (error) {
      console.error('Sync failed:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      role="article"
      aria-label={`Workspace: ${name}`}
    >
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-sm text-slate-400 mb-4">
        Intelligence Score: {intelligenceScore}/100
      </p>
      <button
        onClick={handleSync}
        disabled={isLoading}
        className="bg-[#00F0FF] text-black px-4 py-2 rounded-xl 
                   hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-300"
        aria-label="Sync workspace"
      >
        <Zap className="w-4 h-4 inline mr-2" />
        {isLoading ? 'Syncing...' : 'Sync'}
      </button>
    </div>
  );
}
```

---

## 🧪 Testing Standards

### Unit Tests Required For:

- **Utility functions** (data transformations, calculations)
- **Critical business logic** (waste calculation, intelligence scoring)
- **Custom hooks** (useNexusSync, useOracle, etc.)

### Integration Tests Required For:

- **API endpoints** (Vercel Functions)
- **Database queries** (Supabase RLS)
- **Authentication flows** (MSAL)

### Testing Libraries:

- **Vitest** for unit tests
- **React Testing Library** for component tests
- **Playwright** for E2E tests (optional for MVP)

---

## 📊 Quality Metrics

### Code Quality Targets:

- **TypeScript Coverage:** 100% (Strict Mode Enabled)
- **Linting:** Zero errors, zero warnings
- **Bundle Size:** < 300KB gzipped for initial load
- **Test Coverage:** > 80% for critical paths
- **Documentation:** JSDoc required for all exported utilities

### Performance Targets:

- **Lighthouse Score:** ≥ 90 (Performance, Accessibility, Best Practices)
- **Time to Interactive:** < 3 seconds on 3G
- **API Response Time:** < 100ms P50, < 300ms P99

---

## 🔄 Code Review Process

### Before Requesting Review:

1. Self-review your own code
2. Run linter and fix all issues: `npm run lint`
3. Run tests: `npm run test`
4. Test manually in browser (desktop + mobile)
5. Update documentation if needed
6. Fill out PR checklist

### During Review:

- **Reviewers:** At least 1 approval required
- **Response Time:** 24 hours for review feedback
- **Constructive Feedback:** Focus on "Why" not just "What"
- **Approval:** No approval until all comments addressed

### After Review:

- **Merge Strategy:** Squash and merge (clean history)
- **Deployment:** Auto-deploy to Vercel preview
- **Monitoring:** Check Vercel logs for errors

---

## 🚨 Common Anti-Patterns to Avoid

### ❌ Bad Practices:

```tsx
// ❌ Using 'any' type
const data: any = await fetchData();

// ❌ Inline styles instead of Tailwind
<div style={{ backgroundColor: '#00F0FF' }}>

// ❌ API logic in components
function MyComponent() {
  const data = await fetch('/api/data').then(r => r.json());
  // ...
}

// ❌ No error handling
async function syncWorkspace(id: string) {
  await api.sync(id); // What if this fails?
}

// ❌ Hardcoded tenant ID (breaks multi-tenancy)
const query = `SELECT * FROM workspaces WHERE id = '${id}'`;
```

### ✅ Good Practices:

```tsx
// ✅ Explicit types
interface FetchResult {
  workspaces: Workspace[];
  totalCount: number;
}
const data: FetchResult = await fetchData();

// ✅ Tailwind classes
<div className="bg-[#00F0FF] text-black px-4 py-2 rounded-xl">

// ✅ API logic in service layer
function MyComponent() {
  const { data, isLoading, error } = useWorkspaces();
  // ...
}

// ✅ Proper error handling
async function syncWorkspace(id: string): Promise<void> {
  try {
    await api.sync(id);
  } catch (error) {
    logger.error('Sync failed', { id, error });
    throw new Error('Failed to sync workspace');
  }
}

// ✅ Row-level security (tenant_id from auth context)
const { data, error } = await supabase
  .from('workspaces')
  .select('*')
  .eq('id', id); // RLS automatically filters by tenant_id
```

---

## 📚 Related Standards

- **Design:** `STD-DESIGN-001.md` → `/docs/MASTER_DESIGN_GUIDE.md`
- **Security:** `STD-SEC-001.md` (Row-level security, authentication)
- **Data:** `STD-DATA-001.md` (Database patterns, multi-tenancy)
- **API:** `STD-API-001.md` (Backend integration patterns)
- **A11y:** `STD-A11Y-001.md` (Accessibility requirements)
- **Performance:** `STD-PERF-001.md` (Optimization targets)

---

## 🔄 Maintenance

**Review Cycle:** Quarterly  
**Owner:** Aethos Tech Lead  
**Authority:** MANDATORY for all contributors  
**Last Updated:** 2026-02-27 (Updated for simplified architecture, moved to /docs/3-standards/)
