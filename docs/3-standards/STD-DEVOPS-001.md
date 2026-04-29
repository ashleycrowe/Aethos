---
status: Active
type: Core Infrastructure Standard
phase: All Phases
audience: [DevOps, Release Managers, Engineering]
working_group: [Technical, Infrastructure]
priority: High
last_updated: 2026-02-27
location: /docs/3-standards/
tags: [devops, ci-cd, vercel, github-actions, deployment]
document_id: STD-DEVOPS-001
---

<!--
📌 CORE STRATEGIC DOCUMENT - AI MAINTENANCE INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  DO NOT DELETE - Source of truth for Aethos deployment
🔄 KEEP UPDATED - Update when deployment platform or strategy changes
📋 WHAT TO UPDATE:
   - Vercel deployment configuration and environment variables
   - GitHub Actions workflow definitions
   - Quality gate thresholds (coverage, bundle size)
   - Environment promotion strategy
🚫 WHAT NOT TO CHANGE:
   - Zero-touch deployment philosophy
   - Secret management requirements
   - Rollback procedures
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-->

# [STANDARD] Aethos Deployment & CI/CD Standards
## Automated Release Governance for Vercel + Supabase Architecture

**Version:** 2.0  
**Date:** February 27, 2026  
**Status:** 🟢 ACTIVE  
**Owner:** DevOps & Engineering Team  
**Description:** Deployment standards, CI/CD pipeline configuration, and release governance for the simplified Vercel + Supabase architecture.  
**Authority:** MANDATORY  
**Document ID:** STD-DEVOPS-001

---

## 🚀 The Aethos Release Philosophy

Aethos deployments must be as invisible and resilient as the intelligence layer they support. We utilize a **"Zero-Touch" production strategy**, where all changes are validated through automated quality gates before reaching production.

**Key Principles:**
- **Continuous Deployment:** Every merge to `main` deploys automatically to production
- **Preview Deployments:** Every PR gets a unique preview URL for testing
- **Instant Rollback:** One-click rollback to any previous deployment
- **Environment Parity:** All environments use identical configurations

---

## 🚨 MANDATORY CRITICAL RULES

1. ✅ **AUTOMATED PATHWAYS ONLY** - Manual production deployments are strictly prohibited. All code enters production via GitHub Actions → Vercel.
2. ✅ **RECOVERY READINESS** - Every deployment must have instant rollback capability via Vercel dashboard.
3. ✅ **SECRET ISOLATION** - Secrets (Supabase keys, Microsoft client secrets) must NEVER reside in code. Use **Vercel Environment Variables**.
4. ✅ **QUALITY GATES** - Deployments automatically halt if:
   - Unit test coverage falls below 60% (MVP) or 80% (Production)
   - High/Critical security vulnerabilities detected
   - Bundle size exceeds 200KB (gzipped) for initial load
   - Lighthouse score drops below 85
5. ✅ **BRANCH PROTECTION** - `main` branch requires:
   - 1+ approving review
   - All CI checks passing
   - Up-to-date with base branch

---

## 🏗️ Environment Strategy

| Environment | Purpose | Trigger | URL Pattern | Data Source |
| :--- | :--- | :--- | :--- | :--- |
| **Development** | Local iteration | Manual | `localhost:3000` | Mock data / Dev tenant |
| **Preview** | PR validation | Push to PR | `aethos-pr-123.vercel.app` | Supabase dev database |
| **Staging** | Pre-production | Push to `develop` | `staging.aethos.com` | Supabase staging database |
| **Production** | Live | Merge to `main` | `app.aethos.com` | Supabase production database |

**Environment Variables Strategy:**
- Development: `.env.local` (gitignored)
- Preview/Staging: Vercel Environment Variables (preview/staging scope)
- Production: Vercel Environment Variables (production scope)

---

## ⚙️ CI/CD Pipeline Architecture

### GitHub Actions Workflow (`.github/workflows/ci.yml`)

```yaml
name: Aethos CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality-gates:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage
      
      - name: Check coverage threshold
        run: |
          if [ $(jq '.total.statements.pct' coverage/coverage-summary.json) -lt 60 ]; then
            echo "Coverage below 60% threshold"
            exit 1
          fi
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
      
      - name: Build
        run: npm run build
      
      - name: Check bundle size
        run: npm run size-check
      
      - name: Security audit
        run: npm audit --production --audit-level=high
      
      - name: Run E2E tests (on main/develop only)
        if: github.event_name == 'push'
        run: npm run test:e2e

  lighthouse:
    runs-on: ubuntu-latest
    needs: quality-gates
    if: github.event_name == 'pull_request'
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Wait for Vercel preview
        uses: patrickedqvist/wait-for-vercel-preview@v1.3.1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          max_timeout: 300
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://${{ steps.preview.outputs.url }}
            https://${{ steps.preview.outputs.url }}/oracle
            https://${{ steps.preview.outputs.url }}/nexus
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### Vercel Configuration (`vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "outputDirectory": "dist",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

---

## 📦 Deployment Stages

### Stage 1: Quality Gates (Automated)

**Duration:** 3-5 minutes  
**Checks:**
1. ✅ Linting (ESLint) - Zero errors required
2. ✅ Type checking (TypeScript) - Zero errors required
3. ✅ Unit tests - All passing + coverage threshold
4. ✅ Security audit - No high/critical vulnerabilities
5. ✅ Build - Successful production build
6. ✅ Bundle size - Within limits (200KB initial)

**Exit Criteria:** All checks pass, otherwise PR is blocked

### Stage 2: Preview Deployment (Automatic on PR)

**Duration:** 30-60 seconds  
**Process:**
1. Vercel automatically deploys PR to unique preview URL
2. Lighthouse CI runs against preview URL
3. Comment posted to PR with:
   - Preview URL
   - Lighthouse scores
   - Bundle size comparison
   - Deployment logs

**Preview URL Format:** `aethos-git-{branch}-{team}.vercel.app`

### Stage 3: Staging Deployment (Automatic on `develop`)

**Duration:** 30-60 seconds  
**Process:**
1. Push to `develop` triggers automatic deploy to `staging.aethos.com`
2. E2E tests run against staging environment
3. Slack notification sent to #deployments channel
4. Manual QA testing recommended

### Stage 4: Production Deployment (Automatic on `main`)

**Duration:** 30-60 seconds  
**Process:**
1. Merge to `main` triggers production deployment
2. Vercel performs zero-downtime deployment
3. Post-deployment smoke tests run
4. Analytics tracking starts (Vercel Analytics)
5. Success notification sent to #deployments

**Post-Deployment Monitoring:**
- Vercel Analytics (Core Web Vitals)
- Supabase Database metrics
- Error tracking (if configured)
- User session monitoring

---

## 🔄 Rollback Procedures

### Instant Rollback (Vercel Dashboard)

**Steps:**
1. Navigate to Vercel project dashboard
2. Go to "Deployments" tab
3. Find previous successful deployment
4. Click "Promote to Production"
5. Deployment is instantly rolled back (< 10 seconds)

**When to Rollback:**
- Critical bugs discovered post-deployment
- Performance degradation (Core Web Vitals drop)
- Database migration issues
- User-facing errors

### Database Rollback (Supabase)

**Migration Rollback:**
```sql
-- Rollback last migration
SELECT * FROM supabase_migrations.schema_migrations
ORDER BY version DESC LIMIT 1;

-- Execute down migration (if available)
-- Manual intervention required
```

**Data Restoration (Emergency):**
- Supabase provides point-in-time recovery (PITR)
- Contact Supabase support for restoration
- Maximum 7-day recovery window

---

## 🔐 Secret Management

### Environment Variables (Vercel)

**Required Secrets:**
```bash
# Authentication
MICROSOFT_CLIENT_ID=xxx
MICROSOFT_CLIENT_SECRET=xxx
MICROSOFT_TENANT_ID=xxx

# Database
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Optional
CODECOV_TOKEN=xxx
SENTRY_DSN=xxx
```

**Variable Scopes:**
- **Production:** Only available to `main` branch deployments
- **Preview:** Available to all preview deployments
- **Development:** Available to local development (via `.env.local`)

**Best Practices:**
- Never commit secrets to Git (`.env.local` is gitignored)
- Rotate secrets quarterly or after team member departure
- Use service role keys only in serverless functions, never in frontend
- Document all environment variables in project README

---

## 🧪 Testing Strategy by Environment

### Local Development
```bash
npm run dev           # Start dev server
npm run test:watch    # Run tests in watch mode
npm run lint          # Check code quality
npm run type-check    # Verify TypeScript
```

### Preview (PR Testing)
- Automated: Lighthouse CI, unit tests, build
- Manual: Feature testing, visual QA
- Duration: Until PR is merged/closed

### Staging (Pre-Production)
- Automated: E2E tests, smoke tests
- Manual: Full regression testing, UAT
- Duration: 1-2 days before production release

### Production (Live)
- Automated: Smoke tests, monitoring
- Manual: Hot-fix if critical issues found
- Duration: Continuous

---

## ✅ COMPLIANCE CHECKLIST (Release Ready)

**Pre-Deployment:**
- [ ] All unit tests pass with ≥60% coverage (MVP) or ≥80% (Production)
- [ ] E2E tests pass for critical user flows
- [ ] No high-severity vulnerabilities in `npm audit`
- [ ] Lighthouse score ≥90 on Performance, A11y, Best Practices
- [ ] Bundle size within limits (200KB initial load)
- [ ] All environment variables configured in Vercel
- [ ] Peer review completed (1+ approval)
- [ ] Supabase migrations tested in staging

**Post-Deployment:**
- [ ] Smoke tests pass in production
- [ ] Core Web Vitals metrics are "Good"
- [ ] No error spikes in Vercel logs
- [ ] Supabase database performance is nominal
- [ ] Rollback plan documented (if major release)

---

## 📊 Deployment Metrics & Monitoring

### Key Performance Indicators (KPIs)

| Metric | Target | Measurement |
| :--- | :--- | :--- |
| **Deployment Frequency** | 10+ per week | GitHub Actions logs |
| **Lead Time** | < 30 minutes | PR creation → production |
| **Mean Time to Recovery (MTTR)** | < 15 minutes | Issue detected → rollback complete |
| **Change Failure Rate** | < 5% | Deployments requiring hotfix |
| **Build Success Rate** | > 95% | CI pipeline success rate |

### Monitoring Tools

**Vercel Analytics:**
- Core Web Vitals (LCP, FID, CLS)
- Page load times
- Error rates
- Traffic patterns

**Supabase Dashboard:**
- Database query performance
- Connection pool usage
- API request latency
- Storage utilization

**GitHub Insights:**
- Deployment frequency
- PR merge time
- CI/CD pipeline duration
- Failed build rate

---

## 🚨 Incident Response

### Severity Levels

**P0 (Critical):**
- Production down or inaccessible
- Data breach or security incident
- Complete feature failure affecting all users

**Response:** Immediate rollback, all-hands investigation

**P1 (High):**
- Major feature broken for subset of users
- Performance degradation (Core Web Vitals "Poor")
- Authentication issues

**Response:** Hotfix within 4 hours or rollback

**P2 (Medium):**
- Minor feature bug
- UI/UX issues
- Non-critical performance issues

**Response:** Fix in next scheduled deployment

**P3 (Low):**
- Cosmetic issues
- Documentation errors
- Minor logging/telemetry issues

**Response:** Backlog for future sprint

---

## 🔄 MAINTENANCE

**Review Cycle:** Quarterly or after major infrastructure changes  
**Owner:** DevOps & Engineering Team  
**Authority:** MANDATORY for all Aethos deployments

---

## 📚 RELATED STANDARDS

- **STD-CODE-001** - Code Quality & Review Standards
- **STD-TEST-001** - Testing Infrastructure & QA
- **STD-PERF-001** - Performance & Optimization Standards
- **STD-SEC-001** - Security & Privacy Standards
- **STD-ERROR-001** - Error Handling & Resilience

---

**Document ID:** STD-DEVOPS-001  
**Status:** 🟢 ACTIVE STANDARD  
**Authority:** MANDATORY for all Aethos infrastructure changes  
**Location:** `/docs/3-standards/STD-DEVOPS-001.md`
