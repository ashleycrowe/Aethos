# Aethos v1 - Quick Start Guide for Developers
## Get Building in 15 Minutes

**Target Audience:** Your friend (the developer taking over this project)  
**Time to Read:** 5 minutes  
**Time to First Code:** 15 minutes

---

## 🎯 What Am I Building?

**Aethos** = "The Anti-Intranet" - An intelligence layer for Microsoft 365 tenants

**3 Core Modules:**
1. **The Constellation** - Discovery & governance (scan M365/Slack/Google, find waste)
2. **The Nexus** - Workspaces (curated collections, like playlists for enterprise data)
3. **The Oracle** - AI search & insights (metadata intelligence + optional content reading)

**v1 Timeline:** 12 weeks  
**v1 Scope:** All 3 modules (MVP feature set)  
**Launch Target:** 10-20 pilot customers

---

## 📚 Read These First (4 hours)

**Priority 1 (MUST READ):**
1. `/docs/AETHOS_V1_CONSOLIDATED_SPEC.md` - Main product spec (Sections 1-7) - **2 hours**
2. `/docs/V1_IMPLEMENTATION_ROADMAP.md` - Week 1-2 tasks - **1 hour**

**Priority 2 (SHOULD READ):**
3. `/docs/AETHOS_CONTENT_ORACLE_V1_SPEC.md` - Oracle details - **1 hour**
4. `/guidelines/Guidelines.md` - Design system - **30 min**

**Priority 3 (SKIM):**
5. `/docs/2-ARCHITECTURE/SIMPLIFIED_ARCHITECTURE.md` - Tech stack
6. `/src/standards/DECISION-LOG.md` - Why decisions were made

---

## 🛠️ Tech Stack (Already Chosen)

```
Frontend:  React 18 + TypeScript + Vite
Styling:   Tailwind CSS v4
UI:        Radix UI + Lucide React icons
Backend:   Node.js + Express (Vercel Serverless Functions)
Database:  PostgreSQL (Supabase with RLS)
Auth:      Microsoft Entra ID (MSAL.js)
Deploy:    Vercel (frontend + backend)
Cost:      $0-5/month (free tiers)
```

**Why this stack?** Free for MVP, scales to 1,000 customers, enterprise-grade.

---

## ⚡ Quick Setup (15 Minutes)

### Step 1: Create Accounts (5 min)

```bash
# Supabase (database)
1. Go to https://supabase.com
2. Sign up (free tier)
3. Create new project: "aethos-v1"
4. Save connection string

# Vercel (deployment)
1. Go to https://vercel.com
2. Sign up (free tier)
3. Connect GitHub repo
4. Done! (will deploy automatically)

# Azure AD (authentication)
1. Go to https://portal.azure.com
2. App Registrations → New registration
3. Name: "Aethos v1"
4. Redirect URI: https://yourapp.vercel.app/auth/callback
5. Save Client ID + Client Secret
```

### Step 2: Run Prototype Locally (5 min)

```bash
# Clone repo
git clone https://github.com/yourorg/aethos
cd aethos

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env (add your keys)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_KEY=xxx
VITE_MSAL_CLIENT_ID=xxx
VITE_MSAL_CLIENT_SECRET=xxx

# Start dev server
npm run dev
```

Open `http://localhost:5173` - You should see the Aethos UI!

### Step 3: Deploy Database (5 min)

```sql
-- Open Supabase SQL Editor
-- Copy-paste from /docs/AETHOS_V1_CONSOLIDATED_SPEC.md (Section 5.2)

-- Run Migration 001: Core tables
CREATE TABLE tenants (...);
CREATE TABLE identities (...);
CREATE TABLE sources (...);
CREATE TABLE containers (...);
CREATE TABLE assets (...);
-- ... etc (25+ tables)

-- Run Migration 002: RLS policies
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON tenants...
-- ... etc

-- Verify: Tables should appear in Supabase dashboard
```

**Done!** You have a working environment.

---

## 🗺️ Week 1-2 Tasks (Your First Sprint)

### Week 1: Database + Auth (20 hours)

**Goals:**
- [ ] All 25+ tables created in Supabase
- [ ] RLS policies working (test with 2 tenants - no cross-tenant queries)
- [ ] MSAL authentication working (can log in with Microsoft account)
- [ ] Prototype deployed to Vercel (shows UI)

**Deliverables:**
- Supabase project with all tables
- Vercel frontend deployed (URL: `yourapp.vercel.app`)
- Can log in with Microsoft account
- Dashboard loads (empty, no data yet)

### Week 2: First API (20 hours)

**Goals:**
- [ ] Vercel backend deployed (serverless functions)
- [ ] First API route: `GET /api/tenant/info` (returns current tenant)
- [ ] Frontend calls API (React Query or fetch)
- [ ] Error handling (toast notifications on failure)

**Deliverables:**
- Backend function returns tenant info
- Frontend displays tenant name in header
- No console errors

---

## 🧭 What To Build Each Week

**Week 3-4:** Discovery Module (M365 connector, scan 1,000 files)  
**Week 5-6:** Cleanup Module (waste detection, archive files)  
**Week 7-8:** Workspaces Module (pin items, invite members)  
**Week 9-10:** Oracle + Metadata Intelligence (search, enrichment)  
**Week 11-12:** Polish + Testing (Lighthouse ≥90, load test)

**See `/docs/V1_IMPLEMENTATION_ROADMAP.md` for detailed tasks.**

---

## 💡 Pro Tips

### Code Organization

```
aethos/
├── src/
│   ├── app/                  # Frontend (React)
│   │   ├── components/      # 60+ components (copy-paste ready)
│   │   ├── context/         # React Context (state management)
│   │   ├── services/        # API client layer
│   │   └── App.tsx          # Entry point
│   └── backend/             # Backend (Node.js) - YOU WILL CREATE THIS
│       ├── api/             # API routes (Express)
│       ├── connectors/      # M365, Slack, Google integrations
│       ├── services/        # Business logic
│       └── lib/             # Supabase client, utilities
├── migrations/              # SQL migration files
└── docs/                    # All documentation
```

### Development Workflow

1. **Start with database** (create tables first)
2. **Build API routes** (test with Postman/Thunder Client)
3. **Connect frontend** (use React Query for caching)
4. **Add error handling** (last, but important)

### Common Pitfalls

- ❌ Don't fetch all data at once (use pagination: 50 items per page)
- ❌ Don't store secrets in code (use `.env` file, never commit)
- ❌ Don't skip RLS policies (major security risk!)
- ❌ Don't deploy without testing (use Vercel preview deployments)

### Quick Wins

- ✅ Use Supabase real-time subscriptions (live updates for free)
- ✅ Use Vercel preview deployments (test before production)
- ✅ Use GitHub Copilot (speeds up boilerplate)
- ✅ Copy-paste from existing components (60+ already built)

---

## 🆘 When You Get Stuck

### Documentation

**Product Questions:**
- Check `/docs/AETHOS_V1_CONSOLIDATED_SPEC.md`
- Check `/docs/AETHOS_CONTENT_ORACLE_V1_SPEC.md`

**Implementation Questions:**
- Check `/docs/V1_IMPLEMENTATION_ROADMAP.md` (has code examples)
- Check `/docs/2-ARCHITECTURE/SIMPLIFIED_ARCHITECTURE.md`

**Design Questions:**
- Check `/guidelines/Guidelines.md`
- Look at existing components (`/src/app/components/`)

### Community Support

**Supabase:** Discord - https://discord.supabase.com  
**Vercel:** Discord - https://discord.gg/vercel  
**Microsoft Graph API:** Q&A - https://aka.ms/graph/qna  
**React/TypeScript:** Stack Overflow

### Ask Me (Product Owner)

- Product scope questions (weekly check-in)
- UI/UX approval (screenshot → feedback)
- Scope changes (need approval before implementing)

---

## ✅ Success Checklist

### After Week 1-2, You Should Have:

- [ ] Supabase project with 25+ tables
- [ ] RLS policies working (tested)
- [ ] MSAL login working (can log in with Microsoft)
- [ ] Prototype deployed to Vercel (public URL)
- [ ] First API route working (`GET /api/tenant/info`)
- [ ] No console errors
- [ ] Local development environment set up
- [ ] Confidence you can build the rest! 🚀

### Red Flags (Call for Help If):

- ❌ Can't get MSAL authentication working after 4 hours
- ❌ Supabase RLS policies not isolating tenants
- ❌ Vercel deployment failing repeatedly
- ❌ Microsoft Graph API rate limiting immediately

**Don't spin for more than 4 hours on a blocker - ask for help!**

---

## 🎯 Your First Task (Right Now)

1. **Read CONSOLIDATED_SPEC** (Sections 1-5) - **1 hour**
2. **Skim V1_IMPLEMENTATION_ROADMAP** (Week 1-2) - **30 min**
3. **Create Supabase account + project** - **15 min**
4. **Run `npm install` and `npm run dev`** - **15 min**

**Total:** 2 hours to go from "I just got this project" to "I have a working dev environment"

---

## 🚀 Let's Build!

You have everything you need:
- ✅ Complete product specification
- ✅ 12-week build plan
- ✅ 60+ UI components (copy-paste ready)
- ✅ Database schemas (deploy-ready)
- ✅ Tech stack chosen (proven, free)

**Next step:** Read CONSOLIDATED_SPEC (Sections 1-5), then come back to this guide.

**You got this! 💪**

---

## 📞 Questions?

1. Check `/docs/AETHOS_V1_CONSOLIDATED_SPEC.md` first
2. Check `/docs/V1_IMPLEMENTATION_ROADMAP.md` for code examples
3. Check `/COMPLETE_SUMMARY.md` for high-level overview
4. Ask me (product owner) during weekly check-in

**Let's ship Aethos v1 in 12 weeks! 🎉**
