# Aethos: Consolidated Development Standards
## Essential Guidelines for Production-Ready Development

Version: 2.0.0 (Simplified from 23 standards → 4 core standards)
Last Updated: 2026-02-26

---

## 📋 Why We Consolidated

**Before**: 23 separate standard documents (STD-A11Y-001, STD-AI-001, etc.)
**After**: 4 essential standards covering all critical areas
**Reason**: Codex and real developers need actionable guidelines, not enterprise bureaucracy

---

## 🎯 STANDARD 1: CODE QUALITY & ARCHITECTURE

### Mandatory Rules
1. **TypeScript Strict Mode**: Zero `any` types. Enable strict null checks.
2. **Component Structure**: Functional components only. Use React hooks.
3. **File Organization**:
   ```
   /src/app/
     App.tsx                 # Main app
     /components/            # All React components
     /context/               # Global state (AethosContext, UserContext)
     /services/              # API calls (graph.service.ts, supabase.service.ts)
     /types/                 # TypeScript interfaces
     /utils/                 # Pure functions
   ```
4. **Naming Conventions**:
   - Components: `PascalCase` (e.g., `WorkspaceEngine.tsx`)
   - Utils/Services: `camelCase` (e.g., `formatBytes.ts`)
   - Types: `PascalCase` with descriptive names (e.g., `AethosContainer`)

### Design System Compliance
> **📘 See `/docs/MASTER_DESIGN_GUIDE.md` for complete design specifications**

- **Colors**: Deep Space (`#0B0F19`), Starlight Cyan (`#00F0FF`), Supernova Orange (`#FF5733`)
- **Typography**: System fonts (no custom font CDNs for performance)
- **Glassmorphism**: Use `backdrop-blur-md` with 70-95% opacity backgrounds
- **Spacing**: Tailwind default scale (4, 8, 12, 16, 24, 32 px)

### Performance Targets
- **Lighthouse Score**: ≥90 (Performance, Accessibility, Best Practices)
- **Bundle Size**: <300KB gzipped for initial load
- **Time to Interactive**: <3 seconds on 3G

---

## 🔐 STANDARD 2: SECURITY & DATA PRIVACY

### Critical Security Rules
1. **Zero-Body Storage**: Never store file contents. Only metadata pointers.
2. **Environment Variables**: All secrets in `.env` (never commit to Git)
   ```bash
   VITE_MSAL_CLIENT_ID=xxx
   VITE_SUPABASE_URL=xxx
   VITE_SUPABASE_ANON_KEY=xxx
   MSAL_CLIENT_SECRET=xxx  # Backend only
   ```
3. **Authentication**: Microsoft Entra ID (MSAL.js) for M365 integration
4. **Session Management**: HTTP-only cookies, 24-hour expiry
5. **SQL Injection Prevention**: Use Supabase parameterized queries
6. **XSS Prevention**: Sanitize all user inputs before rendering

### Data Classification
| Level | Examples | Handling |
|-------|----------|----------|
| **Public** | Tenant name, feature flags | Can be cached |
| **Internal** | Container titles, workspace names | Encrypted in transit (TLS) |
| **Confidential** | User emails, Graph API tokens | Never log, encrypt at rest |

### GDPR Compliance
- **Right to be Forgotten**: `/api/tenant/:id/purge` route deletes all tenant data
- **Data Export**: `/api/tenant/:id/export` returns all data as JSON
- **Audit Logs**: Log all delete/archive actions with timestamp and user ID

---

## 🌐 STANDARD 3: MICROSOFT 365 INTEGRATION

### Graph API Best Practices
1. **Batching**: Always batch requests (max 20 per batch)
   ```typescript
   const batch = {
     requests: sites.map((id, i) => ({
       id: i.toString(),
       method: 'GET',
       url: `/sites/${id}`,
     })),
   };
   await graphClient.api('/$batch').post(batch);
   ```

2. **Throttling Handling**: Implement exponential backoff for 429 errors
   ```typescript
   async function retryWithBackoff(fn, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (error.statusCode === 429 && i < maxRetries - 1) {
           await sleep(Math.pow(2, i) * 1000);
           continue;
         }
         throw error;
       }
     }
   }
   ```

3. **Delta Queries**: Use delta links for incremental sync
   ```typescript
   // First scan
   const response = await graphClient.api('/sites/delta').get();
   saveDeltaLink(response['@odata.deltaLink']);

   // Subsequent scans
   const deltaLink = getDeltaLink();
   const changes = await graphClient.api(deltaLink).get();
   ```

### Required Permissions (Delegated)
- `Sites.Read.All` - Read SharePoint metadata
- `Group.Read.All` - Read Teams and Groups
- `User.ReadBasic.All` - Read user profiles

### Permission Scope Minimalism
❌ Don't request: `Sites.FullControl.All`, `Files.ReadWrite.All`
✅ Do request: Only read permissions for metadata

---

## 🚀 STANDARD 4: DEPLOYMENT & OPERATIONS

### Environment Strategy
| Environment | Branch | Database | Purpose |
|-------------|--------|----------|---------|
| **Development** | `feature/*` | Local SQLite | Feature work |
| **Staging** | `develop` | Supabase Staging | Integration tests |
| **Production** | `main` | Supabase Production | Live customers |

### Deployment Checklist
- [ ] All tests pass (`npm test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] Environment variables set in Vercel
- [ ] Database migrations run (`npm run migrate`)
- [ ] Smoke test after deployment (login + view dashboard)

### CI/CD Pipeline (GitHub Actions)
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Error Handling Strategy
1. **User-Facing Errors**: Use toast notifications (Sonner)
   ```typescript
   toast.error('Failed to load containers', {
     description: 'Check your internet connection and try again.',
   });
   ```

2. **Backend Errors**: Return structured error responses
   ```typescript
   res.status(400).json({
     error: 'INVALID_TENANT_ID',
     message: 'Tenant ID must be a valid UUID',
     timestamp: new Date().toISOString(),
   });
   ```

3. **Logging**: Console for development, structured logs for production
   ```typescript
   console.error('[GRAPH_API_ERROR]', {
     tenantId,
     endpoint: '/sites',
     statusCode: error.statusCode,
     message: error.message,
   });
   ```

### Monitoring (Free Tier)
- **Uptime**: UptimeRobot.com (free 50 monitors)
- **Errors**: Sentry.io (free 5K events/month)
- **Analytics**: Vercel Analytics (free with Vercel hosting)

---

## 📦 DEPENDENCY MANAGEMENT

### Allowed Dependencies
✅ **Core**: react, react-dom, tailwindcss, vite
✅ **UI**: lucide-react, @radix-ui/*, sonner
✅ **State**: Native Context API (no Redux/Zustand)
✅ **API**: @microsoft/microsoft-graph-client, @supabase/supabase-js
✅ **Auth**: @azure/msal-browser, @azure/msal-node

### Prohibited Dependencies
❌ **Heavy UI Frameworks**: Material-UI, Ant Design (bundle bloat)
❌ **State Management**: Redux, MobX (overengineered for this scale)
❌ **Date Libraries**: moment.js (use native Intl.DateTimeFormat)
❌ **HTTP Clients**: axios (use native fetch with error handling)

### Package Audit Schedule
- **Monthly**: `npm audit` to check vulnerabilities
- **Quarterly**: Review `package.json` for unused dependencies
- **Yearly**: Major version upgrades (React, TypeScript, etc.)

---

## 🧪 TESTING STRATEGY

### Unit Tests (Vitest)
```typescript
// src/utils/formatBytes.test.ts
import { formatBytes } from './formatBytes';

describe('formatBytes', () => {
  it('formats bytes correctly', () => {
    expect(formatBytes(1024)).toBe('1.00 KB');
    expect(formatBytes(1048576)).toBe('1.00 MB');
    expect(formatBytes(1073741824)).toBe('1.00 GB');
  });
});
```

### Integration Tests (Playwright - Optional)
```typescript
// tests/dashboard.spec.ts
test('user can view dashboard after login', async ({ page }) => {
  await page.goto('https://app.aethos.com');
  await page.click('text=Sign in with Microsoft');
  // ... OAuth flow simulation
  await expect(page.locator('text=Storage Waste')).toBeVisible();
});
```

### Test Coverage Targets
- **Critical Paths**: 80% coverage (auth, data fetching, remediation)
- **UI Components**: 50% coverage (GlassCard, UniversalCard, etc.)
- **Utils**: 90% coverage (pure functions)

---

## 🎨 DESIGN SYSTEM TOKENS

### Colors (Aethos Glass)
```css
/* /src/styles/theme.css */
:root {
  --deep-space: #0B0F19;
  --starlight-cyan: #00F0FF;
  --supernova-orange: #FF5733;
  --glass-bg: rgba(15, 23, 42, 0.85);
  --glass-border: rgba(148, 163, 184, 0.2);
}
```

### Typography
```css
/* System font stack - no external fonts */
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono: "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
```

### Spacing Scale
```typescript
// Use Tailwind defaults
gap-2   // 8px
gap-4   // 16px
gap-6   // 24px
gap-8   // 32px
p-4     // padding: 16px
```

---

## 🔄 MAINTENANCE & UPDATES

### Review Cycle
- **Daily**: Pull Request reviews
- **Weekly**: Dependency vulnerability checks
- **Monthly**: Performance audit (Lighthouse)
- **Quarterly**: Architecture review
- **Yearly**: Major version upgrades

### Documentation Requirements
- **Every new component**: JSDoc comments with usage example
- **Every API route**: OpenAPI/Swagger spec
- **Every context**: README explaining state shape
- **Every util**: Unit tests with edge cases

---

## ✅ COMPLIANCE CHECKLIST (Pre-Production)

### Code Quality
- [ ] TypeScript strict mode enabled
- [ ] ESLint config follows these standards
- [ ] All components use Tailwind (no inline styles)
- [ ] No console.log in production builds

### Security
- [ ] Environment variables never in Git
- [ ] MSAL authentication implemented
- [ ] Row-Level Security enabled in Supabase
- [ ] HTTPS enforced (automatic with Vercel)

### Performance
- [ ] Lighthouse score ≥90
- [ ] Bundle size <300KB gzipped
- [ ] All images optimized (WebP format)
- [ ] Code splitting for routes

### Accessibility
- [ ] All interactive elements keyboard navigable
- [ ] ARIA labels on icon buttons
- [ ] Color contrast ratio ≥4.5:1
- [ ] Focus indicators visible

---

## 📚 FURTHER READING

- **React Best Practices**: react.dev/learn
- **Tailwind CSS**: tailwindcss.com/docs
- **Microsoft Graph API**: learn.microsoft.com/graph
- **Supabase Docs**: supabase.com/docs
- **Vercel Deployment**: vercel.com/docs

---

## 🎓 PRINCIPLE: BUILD TO SHIP, NOT TO IMPRESS

These standards prioritize:
1. **Shipping fast** over perfect architecture
2. **Free/cheap services** over enterprise overkill
3. **Simple patterns** over clever abstractions
4. **Real users** over hypothetical scale

**Build what users need. Scale when you have revenue.**

---

*This document replaces all 23 previous standards. When in doubt, prioritize user value over technical perfection.*
