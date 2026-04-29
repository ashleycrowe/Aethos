---
status: Active
type: Core Strategic Standard
phase: All Phases
audience: [All Teams, Developers, Architects]
working_group: [Technical, Architecture]
priority: Critical
last_updated: 2026-02-27
location: /docs/3-standards/
tags: [testing, qa, vitest, playwright, coverage, quality]
document_id: STD-TEST-001
---

<!--
📌 CORE STRATEGIC DOCUMENT - AI MAINTENANCE INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  DO NOT DELETE - Source of truth for Aethos QA & Testing
🔄 KEEP UPDATED - Update when coverage targets or E2E frameworks change
📋 WHAT TO UPDATE:
   - Coverage thresholds for "Aethos Glass" components
   - Playwright configuration for mobile responsiveness
   - Vercel Serverless Functions integration test patterns
🚫 WHAT NOT TO CHANGE:
   - The Testing Pyramid (Unit > Integration > E2E)
   - Requirement for Accessibility (WCAG 2.1 AA) testing
   - Mandatory CI/CD gates for coverage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-->

# [STANDARD] Testing Infrastructure & Quality Assurance
## STD-TEST-001: Ensuring Cinematic Resilience and Technical Integrity

**Version:** 2.0  
**Date:** February 27, 2026  
**Status:** 🟢 ACTIVE  
**Owner:** QA & Resilience Team  
**Description:** Mandatory testing infrastructure covering unit, integration, and E2E testing for the Aethos intelligence layer on Vercel + Supabase.

---

## 🚨 MANDATORY TESTING PYRAMID

1. ✅ **UNIT TESTS (70-80%)** - Focused on React components, utility functions, and business logic
2. ✅ **INTEGRATION TESTS (15-20%)** - Focused on API routes, M365 Graph API batching, and Supabase database operations
3. ✅ **E2E TESTS (5-10%)** - Focused on critical user journeys in Discovery, Oracle, and Workspace management

---

## 📊 PART 1: CODE COVERAGE REQUIREMENTS

| Phase | Global Coverage | Critical Logic | Aethos Glass Components |
| :--- | :--- | :--- | :--- |
| **MVP (v1)** | 60% | 80% | 50% |
| **Production (v2)** | 80% | 90% | 75% |
| **Scale (v3+)** | 90% | 95% | 85% |

**Current Phase:** MVP (v1)  
**Required Coverage:** 60% global, 80% for critical paths (sync engine, metadata enrichment, authentication)

---

## 🧪 PART 2: TESTING INFRASTRUCTURE

### 2.1 Unit & Component Testing

**Framework:** Vitest + React Testing Library  
**Why Vitest:** Faster than Jest, better Vite integration, ESM-native

**Component Testing Requirements:**
- All "Aethos Glass" components must test state transitions and rendering logic
- Context providers (UserContext, AethosContext, OracleContext) must have integration tests
- All custom hooks must have dedicated test suites

**Example: Testing a Glass Component**
```typescript
import { render, screen } from '@testing-library/react';
import { GlassCard } from './GlassCard';
import { ThemeProvider } from '../context/ThemeContext';

describe('GlassCard', () => {
  it('renders with correct glassmorphism styles', () => {
    render(
      <ThemeProvider>
        <GlassCard>Content</GlassCard>
      </ThemeProvider>
    );
    
    const card = screen.getByText('Content').parentElement;
    expect(card).toHaveStyle({ backdropFilter: 'blur(12px)' });
  });
  
  it('applies custom className prop', () => {
    const { container } = render(
      <GlassCard className="custom-class">Content</GlassCard>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
```

### 2.2 API Route Testing

**Framework:** Vitest + MSW (Mock Service Worker)  
**Requirements:** All Vercel Serverless Functions must have mocked Graph API responses

**Example: Testing an API Route**
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { GET } from '../api/metadata/route';

const server = setupServer(
  http.get('https://graph.microsoft.com/v1.0/sites', () => {
    return HttpResponse.json({
      value: [
        { id: 'site-1', displayName: 'Marketing' },
        { id: 'site-2', displayName: 'Sales' },
      ],
    });
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('GET /api/metadata', () => {
  it('returns enriched metadata for sites', async () => {
    const request = new Request('http://localhost:3000/api/metadata?tenantId=test');
    const response = await GET(request);
    const data = await response.json();
    
    expect(data).toHaveLength(2);
    expect(data[0]).toHaveProperty('intelligenceScore');
  });
});
```

### 2.3 Database Testing

**Framework:** Supabase Test Database + Vitest  
**Pattern:** Use separate test database or transaction rollback pattern

**Example: Testing Supabase Operations**
```typescript
import { createClient } from '@supabase/supabase-js';
import { beforeEach, afterEach } from 'vitest';

const supabase = createClient(
  process.env.SUPABASE_TEST_URL!,
  process.env.SUPABASE_TEST_ANON_KEY!
);

describe('Sync Rules Service', () => {
  let testWorkspaceId: string;
  
  beforeEach(async () => {
    // Create test workspace
    const { data } = await supabase
      .from('workspaces')
      .insert({ name: 'Test Workspace', tenant_id: 'test-tenant' })
      .select()
      .single();
    testWorkspaceId = data.id;
  });
  
  afterEach(async () => {
    // Cleanup
    await supabase
      .from('workspaces')
      .delete()
      .eq('id', testWorkspaceId);
  });
  
  it('creates sync rule with correct defaults', async () => {
    const rule = await syncRulesService.createSyncRule(testWorkspaceId, {
      ruleType: 'tag',
      tagsIncludeAny: ['product-launch'],
    });
    
    expect(rule.enabled).toBe(true);
    expect(rule.autoAdd).toBe(true);
  });
});
```

### 2.4 End-to-End (E2E) Testing

**Framework:** Playwright  
**Coverage:** Critical user flows only (5-10% of total tests)

**Mandatory E2E Flows:**
1. ✅ Authentication flow (Microsoft Entra ID mock)
2. ✅ Workspace creation with auto-sync rules
3. ✅ Oracle search across providers
4. ✅ Tag-based workspace auto-population
5. ✅ Metadata intelligence enrichment

**Example: E2E Test**
```typescript
import { test, expect } from '@playwright/test';

test('user can create workspace with sync rules', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Navigate to Nexus
  await page.click('[data-testid="sidebar-nexus"]');
  
  // Open workspace creation wizard
  await page.click('[data-testid="create-workspace-btn"]');
  
  // Fill in workspace details
  await page.fill('input[name="name"]', 'Q1 Product Launch');
  await page.fill('textarea[name="description"]', 'All files for Q1 launch');
  
  // Select Smart sync method
  await page.click('[data-testid="content-method-smart"]');
  
  // Add sync rule tags
  await page.fill('input[data-testid="tag-input"]', 'product-launch');
  await page.press('input[data-testid="tag-input"]', 'Enter');
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Verify workspace created
  await expect(page.locator('text=Q1 Product Launch')).toBeVisible();
  await expect(page.locator('text=Auto-sync enabled')).toBeVisible();
});
```

### 2.5 Accessibility (A11Y) Testing

**Automated Testing:**
- **Framework:** `jest-axe` or `axe-playwright`
- **Requirement:** Zero critical or serious violations on every PR
- **Coverage:** All interactive components, modals, and navigation

**Example: Automated A11Y Test**
```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { WorkspaceEngine } from './WorkspaceEngine';

expect.extend(toHaveNoViolations);

describe('WorkspaceEngine accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<WorkspaceEngine />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Manual Testing Requirements:**
- [ ] Keyboard navigation works for all modals and overlays
- [ ] Screen reader announces all interactive elements
- [ ] Focus management works correctly in wizards
- [ ] Color contrast meets WCAG AA standards (4.5:1 for normal text)

---

## 🚀 PART 3: QUALITY GATES (CI/CD)

### 3.1 Pre-Merge Requirements

**Every Pull Request MUST pass:**

1. ✅ **LINTING** - Zero ESLint errors, warnings only for non-critical issues
2. ✅ **TYPE CHECKING** - Zero TypeScript errors, no `any` types in production code
3. ✅ **UNIT TESTS** - All tests pass, coverage meets phase threshold (60% for MVP)
4. ✅ **E2E TESTS** - Critical user flows pass (auth, workspace creation, search)
5. ✅ **A11Y TESTS** - Zero critical accessibility violations
6. ✅ **BUILD** - Production build succeeds without warnings

**CI Configuration (.github/workflows/test.yml):**
```yaml
name: Test Suite

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Unit tests
        run: npm run test:unit -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
      
      - name: E2E tests
        run: npm run test:e2e
      
      - name: Build
        run: npm run build
```

### 3.2 Coverage Thresholds

**Vitest Configuration (vitest.config.ts):**
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/',
      ],
      thresholds: {
        global: {
          statements: 60,
          branches: 60,
          functions: 60,
          lines: 60,
        },
        // Critical paths require higher coverage
        'src/services/syncEngine.service.ts': {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },
  },
});
```

---

## 🛠️ PART 4: LOCAL DEVELOPMENT WORKFLOW

### 4.1 Running Tests Locally

```bash
# Run all unit tests
npm run test:unit

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode (debug)
npm run test:e2e:ui

# Run accessibility tests
npm run test:a11y
```

### 4.2 Writing New Tests

**File Naming Convention:**
- Unit tests: `ComponentName.test.tsx` or `serviceName.test.ts`
- Integration tests: `featureName.integration.test.ts`
- E2E tests: `userFlow.e2e.test.ts`

**Test Location:**
- Co-locate component tests with components: `/src/app/components/ComponentName.test.tsx`
- Service tests in `/src/app/services/__tests__/`
- E2E tests in `/e2e/`

---

## ✅ COMPLIANCE CHECKLIST

- [ ] Unit tests cover all critical business logic (sync engine, metadata enrichment)
- [ ] Integration tests verify Microsoft Graph API batching and error handling
- [ ] Playwright E2E tests cover authentication and workspace creation flows
- [ ] Accessibility tests run on all interactive components
- [ ] Coverage meets phase threshold (60% for MVP, 80% for production)
- [ ] CI/CD pipeline includes all quality gates
- [ ] Zero critical or high-severity bugs in active sprint
- [ ] Manual accessibility testing completed for new features

---

## 🔄 MAINTENANCE

**Review Cycle:** Quarterly or when major features are added  
**Owner:** QA & Engineering Team  
**Authority:** MANDATORY. PRs failing tests cannot be merged.

---

## 📚 RELATED STANDARDS

- **STD-CODE-001** - Code Quality & Review Standards
- **STD-A11Y-001** - Accessibility Standards
- **STD-PERF-001** - Performance & Optimization Standards
- **STD-API-001** - API & Integration Standards

---

**Document ID:** STD-TEST-001  
**Status:** 🟢 ACTIVE STANDARD  
**Authority:** MANDATORY for all Aethos Developers  
**Location:** `/docs/3-standards/STD-TEST-001.md`
