# ⚡ Quick Start Checklist
**Get Aethos V1 Running in 30 Minutes**

---

## ✅ Prerequisites

- [ ] Azure account (M365 admin access)
- [ ] Supabase account (free tier)
- [ ] Vercel account (free tier)
- [ ] OpenAI account (optional for V1, required for V1.5+)

---

## 📝 Step 1: Azure App Registration (5 minutes)

- [ ] Go to https://portal.azure.com
- [ ] Navigate to **Azure Active Directory** → **App Registrations** → **New Registration**
- [ ] Name: `Aethos V1`
- [ ] Redirect URI: `http://localhost:5173` (type: SPA)
- [ ] Click **Register**
- [ ] Copy **Application (client) ID** → Save as `VITE_MICROSOFT_CLIENT_ID`
- [ ] Copy **Directory (tenant) ID** → Save as `VITE_MICROSOFT_TENANT_ID`
- [ ] Go to **API Permissions** → **Add permission** → **Microsoft Graph** → **Delegated**
- [ ] Add: `User.Read`, `Files.Read.All`, `Sites.Read.All`, `Group.Read.All`
- [ ] Click **Grant admin consent**
- [ ] ✅ Verify green checkmarks

---

## 📊 Step 2: Supabase Setup (5 minutes)

- [ ] Go to https://supabase.com
- [ ] Create new project: `aethos-v1`
- [ ] Wait for initialization (~2 min)
- [ ] Go to **Project Settings** → **API**
- [ ] Copy **Project URL** → Save as `VITE_SUPABASE_URL`
- [ ] Copy **anon public** key → Save as `VITE_SUPABASE_ANON_KEY`
- [ ] Copy **service_role** key → Save as `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Go to **SQL Editor** → **New Query**
- [ ] Copy entire contents of `/supabase/migrations/001_initial_schema.sql`
- [ ] Paste and click **Run**
- [ ] ✅ Verify "Query completed successfully"
- [ ] Go to **Table Editor** → ✅ Verify 9 tables created

---

## 🔑 Step 3: Environment Variables (2 minutes)

- [ ] Copy `.env.example` to `.env`
- [ ] Fill in these values:

```bash
VITE_MICROSOFT_CLIENT_ID=<from-step-1>
VITE_MICROSOFT_TENANT_ID=<from-step-1>
VITE_SUPABASE_URL=<from-step-2>
VITE_SUPABASE_ANON_KEY=<from-step-2>
SUPABASE_SERVICE_ROLE_KEY=<from-step-2>
OPENAI_API_KEY=sk-... (optional)
```

- [ ] Save `.env` file

---

## 🧪 Step 4: Test Locally (10 minutes)

- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Open http://localhost:5173
- [ ] Click **"Login with Microsoft"**
- [ ] ✅ Login successful (see user name in UI)
- [ ] Navigate to **Intelligence** tab
- [ ] Click **"Run Discovery Scan"**
- [ ] ✅ Watch progress bar fill (~30 seconds)
- [ ] ✅ See real files discovered
- [ ] Navigate to **Search** tab
- [ ] Search for a file name
- [ ] ✅ See real results from your M365 tenant
- [ ] Navigate to **Remediation** tab
- [ ] Select a test file
- [ ] Click **Archive** → Confirm
- [ ] ✅ Success notification appears
- [ ] Check **History** tab
- [ ] ✅ Action logged

---

## 🚀 Step 5: Deploy to Production (5 minutes)

- [ ] Push code to GitHub
- [ ] Go to https://vercel.com
- [ ] Click **Import Project**
- [ ] Select your GitHub repo
- [ ] ✅ Vercel auto-detects Vite config
- [ ] Go to **Settings** → **Environment Variables**
- [ ] Add all 6 variables from Step 3
- [ ] Click **Deploy**
- [ ] ✅ Wait for deployment (~2 min)
- [ ] Go back to Azure Portal → Your App → **Authentication**
- [ ] Add production redirect URI: `https://your-app.vercel.app`
- [ ] Save
- [ ] Visit production URL
- [ ] ✅ Test login, scan, search

---

## ✅ Verification Checklist

### Authentication
- [ ] Login with Microsoft works
- [ ] User profile displays
- [ ] Logout works
- [ ] Session persists on refresh

### Discovery
- [ ] Manual scan button works
- [ ] Progress bar updates
- [ ] Files saved to database (check Supabase)
- [ ] External shares detected
- [ ] Stale files marked

### Search
- [ ] Text search returns results
- [ ] Filters work
- [ ] File details display
- [ ] Links open M365

### Remediation
- [ ] Archive works
- [ ] Delete works
- [ ] Revoke links works
- [ ] History logs actions

### Workspaces
- [ ] Create workspace works
- [ ] Tag-based sync works
- [ ] File list displays

---

## 🎉 Success!

If all checkboxes are ✅, you have:
- Working M365 integration
- Real metadata discovery
- Functional search
- Real remediation actions
- Production deployment

**You're ready to onboard beta customers!**

---

## 🐛 Troubleshooting

### Login fails
- Check Azure redirect URI matches exactly
- Verify permissions granted (green checkmarks)
- Allow popups in browser

### Discovery finds 0 files
- Verify user has access to SharePoint
- Check Azure permissions granted
- Test Graph API at https://developer.microsoft.com/graph/graph-explorer

### Database errors
- Verify SQL migration ran successfully
- Check environment variables are correct
- Verify Supabase service role key

### Deployment fails
- Check all environment variables in Vercel
- Verify build command is correct
- Check Vercel logs for errors

---

## 📚 Need More Help?

- **Full Setup Guide:** `/docs/BACKEND_SETUP_GUIDE.md`
- **Architecture Details:** `/docs/BACKEND_IMPLEMENTATION_PLAN.md`
- **Summary:** `/docs/BACKEND_COMPLETE_SUMMARY.md`

---

## ⏱️ Time Tracking

- [ ] Azure setup: _____ minutes (target: 5)
- [ ] Supabase setup: _____ minutes (target: 5)
- [ ] Environment variables: _____ minutes (target: 2)
- [ ] Local testing: _____ minutes (target: 10)
- [ ] Production deploy: _____ minutes (target: 5)

**Total:** _____ minutes (target: 30)

---

**Status:** Ready to Start  
**Goal:** Production deployment in 30 minutes  
**Outcome:** Working V1 with real M365 integration

Let's go! 🚀
