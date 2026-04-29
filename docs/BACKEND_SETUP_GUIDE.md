# Backend Setup Guide
**Aethos V1 - Production Backend Implementation**  
**Estimated Time:** 30 minutes

---

## 🎯 What You're Building

A production-ready backend that:
- ✅ Connects to Microsoft 365 via Graph API
- ✅ Scans SharePoint, OneDrive, Teams for metadata
- ✅ Stores metadata in Supabase PostgreSQL
- ✅ Enables real search, remediation, and workspaces
- ✅ Auto-syncs workspaces based on AI tags
- ✅ Runs daily automated scans via cron

---

## ⚙️ Prerequisites

You need accounts for:
1. **Azure** (Microsoft 365 admin access)
2. **Supabase** (free tier works)
3. **OpenAI** (optional for V1, required for V1.5+)
4. **Vercel** (for deployment, free tier works)

---

## 📝 Step 1: Azure App Registration (5 minutes)

### 1.1 Create Azure App

1. Go to https://portal.azure.com
2. Navigate to **Azure Active Directory** → **App Registrations**
3. Click **New Registration**

**Fill in:**
- **Name:** `Aethos V1`
- **Supported account types:** "Accounts in this organizational directory only"
- **Redirect URI:**
  - Type: `Single-page application (SPA)`
  - Development URI: `http://localhost:5173`
  - Production URI: `https://yourapp.vercel.app` (add after deployment)

4. Click **Register**

### 1.2 Copy Credentials

From the app **Overview** page, copy:
- **Application (client) ID** → Save as `VITE_MICROSOFT_CLIENT_ID`
- **Directory (tenant) ID** → Save as `VITE_MICROSOFT_TENANT_ID`

### 1.3 Grant API Permissions

1. Go to **API Permissions**
2. Click **Add a permission** → **Microsoft Graph** → **Delegated permissions**
3. Add these permissions:
   - `User.Read` (View user's basic profile)
   - `Files.Read.All` (Read all files user has access to)
   - `Sites.Read.All` (Read all SharePoint sites)
   - `Group.Read.All` (Read Teams/Groups)

4. Click **Grant admin consent** (requires admin)
   - ⚠️ If you're not an admin, ask your M365 admin to grant consent

### 1.4 Verification

Your app should now show:
- ✅ 4 permissions granted
- ✅ Admin consent granted (green checkmarks)

---

## 📊 Step 2: Supabase Setup (5 minutes)

### 2.1 Create Supabase Project

1. Go to https://supabase.com
2. Create a new project:
   - **Name:** `aethos-v1`
   - **Database Password:** (save this securely)
   - **Region:** Choose closest to your users
   - **Plan:** Free tier works for V1

3. Wait for project to initialize (~2 minutes)

### 2.2 Copy Credentials

From **Project Settings** → **API**:
- **Project URL** → Save as `VITE_SUPABASE_URL`
- **anon public** key → Save as `VITE_SUPABASE_ANON_KEY`
- **service_role** key → Save as `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)

### 2.3 Run Database Migration

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy the entire contents of `/supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click **Run** (bottom right)

**Expected:** Success message with "Query completed in X ms"

### 2.4 Verify Database

Go to **Table Editor**. You should see these tables:
- ✅ tenants
- ✅ users
- ✅ files
- ✅ sites
- ✅ workspaces
- ✅ workspace_items
- ✅ remediation_actions
- ✅ discovery_scans
- ✅ notifications

---

## 🔑 Step 3: Environment Variables (5 minutes)

### 3.1 Create Local .env File

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3.2 Fill in Your Values

Edit `.env` with your actual credentials:

```bash
# Microsoft Azure
VITE_MICROSOFT_CLIENT_ID=<from-step-1.2>
VITE_MICROSOFT_TENANT_ID=<from-step-1.2>

# Supabase
VITE_SUPABASE_URL=<from-step-2.2>
VITE_SUPABASE_ANON_KEY=<from-step-2.2>
SUPABASE_SERVICE_ROLE_KEY=<from-step-2.2>

# OpenAI (optional for V1)
OPENAI_API_KEY=sk-your-key-here
```

### 3.3 Add to Vercel (for production)

1. Go to https://vercel.com
2. Import your GitHub repository
3. Go to **Settings** → **Environment Variables**
4. Add all 6 variables from above
5. Set **Environments** to: Production, Preview, Development

---

## 🧪 Step 4: Test Locally (10 minutes)

### 4.1 Install Dependencies

```bash
npm install
```

### 4.2 Start Dev Server

```bash
npm run dev
```

Open http://localhost:5173

### 4.3 Test Authentication

1. You should see a login screen
2. Click **"Login with Microsoft"**
3. Microsoft login popup opens
4. Sign in with your M365 account
5. Grant permissions when prompted
6. Popup closes, you're logged in!

**Expected Result:**
- ✅ No errors in console
- ✅ User's name appears in UI
- ✅ Database shows new tenant and user records

### 4.4 Test Discovery Scan

1. Navigate to **Intelligence** tab
2. Click **"Run Discovery Scan"**
3. Watch the progress bar (this takes ~30 seconds)
4. See real files discovered from your M365 tenant!

**Expected Result:**
- ✅ Progress bar fills
- ✅ Live counters increase
- ✅ Completion shows actual file count
- ✅ Database `files` table populated

### 4.5 Test Search

1. Navigate to **Search** tab (The Oracle)
2. Type a filename you know exists
3. Press Enter

**Expected Result:**
- ✅ Real files from your tenant appear
- ✅ Filters work (provider, risk, date)
- ✅ Clicking file opens URL in M365

### 4.6 Test Remediation

1. Navigate to **Remediation** tab
2. Select a test file (don't pick important data!)
3. Click **"Archive"**
4. Confirm action
5. Wait for success notification

**Expected Result:**
- ✅ File marked as archived in M365
- ✅ Success toast appears
- ✅ Action logged in database
- ✅ History tab shows completed action

### 4.7 Test Workspaces

1. Navigate to **Workspaces** tab
2. Click **"Create Workspace"**
3. Name: "Test Workspace"
4. Tags: ["budget", "finance"] (use tags that exist in your data)
5. Enable auto-sync
6. Click Create

**Expected Result:**
- ✅ Workspace created
- ✅ Files with matching tags auto-synced
- ✅ Workspace shows file count

---

## 🚀 Step 5: Deploy to Production (5 minutes)

### 5.1 Push to GitHub

```bash
git add .
git commit -m "feat: add production backend"
git push origin main
```

### 5.2 Deploy to Vercel

1. Go to https://vercel.com
2. Click **"Import Project"**
3. Select your GitHub repository
4. Vercel auto-detects Vite configuration
5. Click **"Deploy"**

**Deployment takes ~2 minutes**

### 5.3 Update Azure Redirect URI

1. Go back to Azure Portal → Your App Registration
2. **Authentication** → **Single-page application**
3. Add production redirect URI: `https://your-app.vercel.app`
4. Save

### 5.4 Test Production

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Test login, scan, search, remediation
3. Everything should work identically to local!

---

## ✅ Verification Checklist

### Authentication
- [ ] Login with Microsoft works
- [ ] User profile displays correctly
- [ ] Logout works
- [ ] Session persists on page refresh

### Discovery
- [ ] Manual scan button works
- [ ] Progress bar updates in real-time
- [ ] Files appear in database
- [ ] Sites appear in database
- [ ] External shares detected
- [ ] Stale files marked correctly

### Search
- [ ] Text search returns results
- [ ] Filters work (provider, risk, date)
- [ ] Pagination works
- [ ] File details display
- [ ] External link opens M365

### Remediation
- [ ] Archive action works
- [ ] Delete action works (soft delete)
- [ ] Revoke links action works
- [ ] Bulk actions work
- [ ] History tab shows completed actions
- [ ] Notifications appear

### Workspaces
- [ ] Create workspace works
- [ ] Tag-based auto-sync works
- [ ] Manual file pinning works
- [ ] Workspace file list displays

### Cron Jobs
- [ ] Daily scan scheduled (check Vercel logs after 24 hours)

---

## 🐛 Troubleshooting

### Issue: "Missing environment variables"

**Solution:**
- Check `.env` file exists
- Verify all variables are set
- Restart dev server after changing `.env`

### Issue: "Login popup blocked"

**Solution:**
- Allow popups for localhost/your domain
- Try again
- Alternative: Use redirect flow instead of popup

### Issue: "Permission denied on database"

**Solution:**
- Check RLS policies in Supabase
- Verify `setTenantContext()` is called after login
- Check service role key is correct

### Issue: "Discovery scan finds 0 files"

**Solution:**
- Verify Azure permissions granted
- Check user has access to SharePoint sites
- Test Microsoft Graph API directly: https://developer.microsoft.com/graph/graph-explorer
- Check console for API errors

### Issue: "Remediation actions fail"

**Solution:**
- Verify user has edit permissions in M365
- Check if files are locked/checked out
- Review error messages in API response
- Test with a file you own

### Issue: "AI enrichment doesn't work"

**Solution:**
- Check `OPENAI_API_KEY` is set
- Verify OpenAI account has credits
- This is optional for V1, required for V1.5+

---

## 📊 Database Monitoring

### View Scan History

```sql
SELECT * FROM discovery_scans 
ORDER BY started_at DESC 
LIMIT 10;
```

### View File Count by Provider

```sql
SELECT provider, provider_type, COUNT(*) as file_count
FROM files
GROUP BY provider, provider_type;
```

### View Files with External Shares

```sql
SELECT name, external_user_count, url
FROM files
WHERE has_external_share = true
ORDER BY external_user_count DESC;
```

### View Stale Files

```sql
SELECT name, size_bytes, modified_at, owner_name
FROM files
WHERE is_stale = true
ORDER BY size_bytes DESC;
```

---

## 🎉 Success!

You now have:
- ✅ Working Microsoft 365 integration
- ✅ Real metadata discovery and indexing
- ✅ Full-text search across all files
- ✅ Real remediation actions (archive, delete, revoke)
- ✅ Tag-based workspace auto-sync
- ✅ Daily automated scans
- ✅ Multi-tenant architecture with RLS
- ✅ Production deployment on Vercel

**You're ready to onboard beta customers!** 🚀

---

## 📚 Next Steps

### V1 → V1.5 (AI+ Upgrade)

1. Add `OPENAI_API_KEY` to environment variables
2. Run AI enrichment on existing files:
   ```bash
   POST /api/intelligence/enrich
   { "tenantId": "...", "batchSize": 100 }
   ```
3. Enable AI+ in subscription tier:
   ```sql
   UPDATE tenants SET subscription_tier = 'v1.5' WHERE id = '...';
   ```

### V1.5 → V2 (Multi-Provider)

1. Add Slack, Google Workspace integrations
2. Update discovery scanner to include new providers
3. Test cross-provider search

### Production Monitoring

1. Set up Vercel Analytics
2. Monitor Supabase query performance
3. Set up alerts for failed scans
4. Monitor API rate limits (Microsoft Graph, OpenAI)

---

## 🆘 Need Help?

**Issues with setup?**
- Check troubleshooting section above
- Review console logs for errors
- Test each component individually

**Questions about architecture?**
- See `/docs/BACKEND_IMPLEMENTATION_PLAN.md`
- Review database schema: `/supabase/migrations/001_initial_schema.sql`
- Check API documentation: `/docs/API_DOCUMENTATION.md` (to be created)

---

**Author:** Aethos Development Team  
**Last Updated:** 2026-03-01  
**Version:** 1.0.0
