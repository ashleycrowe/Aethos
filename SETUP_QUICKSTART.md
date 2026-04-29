# 🚀 Aethos Setup - Windows Quick Start

**Get from prototype to production in 15 minutes!**

---

## 🎯 What You're Setting Up

Your Aethos platform with:
- ✅ **GitHub** - Version control & collaboration
- ✅ **Supabase** - PostgreSQL database (35 tables)
- ✅ **VS Code** - Development environment
- ✅ **GitHub Copilot** - AI coding assistant ("Codex")

**Current Status:** ✅ Local git repo initialized with 340 files committed

---

## ⚡ The Simplest Path (Recommended)

### **Option 1: GitHub Desktop (No Command Line!)**

Perfect for non-technical users. Everything is visual.

#### **Step 1: Install GitHub Desktop** (3 min)

1. Download: https://desktop.github.com
2. Install (use defaults)
3. Sign in with GitHub account (create at github.com if needed)

#### **Step 2: Publish Your Code** (2 min)

1. Open GitHub Desktop
2. File → "Add Local Repository"
3. Choose: `/workspaces/default/code`
4. Click **"Publish repository"** (top right)
5. Name: `aethos-platform`
6. ✅ Check "Keep this code private"
7. Click **Publish**

**✅ Done!** Your code is now on GitHub.

#### **Step 3: Open in VS Code** (1 min)

1. In GitHub Desktop, click **"Open in Visual Studio Code"**
2. If VS Code not installed:
   - Download: https://code.visualstudio.com
   - Install (use defaults)
   - Restart GitHub Desktop
   - Click "Open in Visual Studio Code" again

#### **Step 4: Install GitHub Copilot** (2 min)

In VS Code:
1. Click Extensions (left sidebar, 4 squares icon)
2. Search "GitHub Copilot"
3. Click Install
4. Sign in when prompted
5. Start free trial ($10/month after)

**✅ GitHub + VS Code + Copilot complete!**

---

### **Option 2: Automated PowerShell Scripts** (For Developers)

We created automation scripts to handle Supabase and environment setup.

#### **Open PowerShell in Project Folder**

```powershell
cd C:\path\to\your\aethos-project
```

#### **Allow Script Execution** (One-time setup)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### **Run the Master Setup Wizard**

```powershell
.\scripts\setup-all.ps1
```

This interactive wizard will:
- ✅ Configure Git & GitHub
- ✅ Set up Supabase database (35 tables)
- ✅ Create `.env` file with your credentials
- ✅ Verify everything works

**Time:** 10-15 minutes (includes prompts for credentials)

---

## 🗄️ Supabase Setup Details

You have **two database layers**:

### **1. Base Platform (20 tables)**
- Tenants, users, files, workspaces
- Discovery scans, remediation actions
- Notifications, sites

**Migration File:** `supabase/migrations/001_initial_schema.sql`

### **2. V1.5-V4 Features (14 tables)**
- AI embeddings, summaries, PII detection
- Multi-provider connections (Slack, Google, Box)
- Compliance policies, audit logs
- Federation, API keys, webhooks

**Migration File:** `supabase/migrations/003_v15_to_v4_features.sql`

### **3. Document Control Add-on (8 tables)** - Optional
- Document libraries, controlled documents
- Approval workflows, acknowledgements
- Compliance tracking

**Setup Guide:** `docs/DOCUMENT_CONTROL_SUPABASE_SETUP.md`

---

## 🔧 Manual Supabase Setup (If Scripts Fail)

### **Create Supabase Project**

1. Go to https://supabase.com
2. Sign up (free)
3. Create new project:
   - Name: `aethos-platform`
   - Database Password: (save this!)
   - Region: Choose closest
   - Plan: Free
4. Wait 2 minutes for provisioning

### **Run Migrations**

1. Supabase Dashboard → **SQL Editor**
2. Click **"+ New query"**
3. **Copy-paste** contents of:
   - `supabase/migrations/001_initial_schema.sql`
   - Click **Run**
4. Repeat for:
   - `supabase/migrations/003_v15_to_v4_features.sql`
   - Click **Run**

### **Get API Keys**

1. Supabase Dashboard → Settings → **API**
2. Copy:
   - **Project URL** (https://xxxxx.supabase.co)
   - **anon public** key (starts with `eyJ`)

---

## 📝 Create .env File

### **Automated (Recommended)**

```powershell
.\scripts\create-env-file.ps1
```

Prompts you for all required values.

### **Manual**

Copy `.env.example` to `.env` and fill in:

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Microsoft Entra ID (Azure Portal → App Registrations)
VITE_MICROSOFT_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_MICROSOFT_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# OpenAI (Optional - for AI+ features)
OPENAI_API_KEY=sk-...
ENABLE_AI_FEATURES=true
```

---

## ✅ Verify Everything Works

```powershell
.\scripts\verify-setup.ps1
```

This checks:
- ✅ Git installed & configured
- ✅ GitHub remote connected
- ✅ `.env` file configured
- ✅ Supabase connection working
- ✅ Database tables created
- ✅ Dependencies installed

---

## 🚀 Start Development

### **Install Dependencies**

```powershell
pnpm install
```

If you don't have `pnpm`:
```powershell
npm install -g pnpm
```

### **Start Dev Server**

```powershell
pnpm dev
```

Open browser: http://localhost:5173

---

## 📚 Next Steps

### **Daily Workflow**

```powershell
# Pull latest changes
git pull origin main

# Make your changes...

# Commit and push
git add .
git commit -m "Describe what you changed"
git push origin main
```

### **Deploy to Vercel (Free Auto-Deploy)**

1. Go to https://vercel.com
2. Sign in with GitHub
3. Import `aethos-platform` repo
4. Vercel auto-detects Vite + React
5. Add environment variables (from `.env`)
6. Deploy!

**Result:** Every push to GitHub = Auto-deploy to production 🎉

### **Open in VS Code Daily**

**Option A:** From GitHub Desktop
- Click "Open in Visual Studio Code"

**Option B:** From command line
```powershell
code .
```

**Option C:** VS Code directly
- File → Open Folder → Select project

---

## 🆘 Troubleshooting

### **"Script execution policy error"**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **"Cannot connect to Supabase"**

Check:
- ✅ Supabase URL correct (ends with `.supabase.co`)
- ✅ Anon Key correct (starts with `eyJ`)
- ✅ Project not paused in Supabase dashboard

### **"Git not found"**

Install Git: https://git-scm.com/download/win

### **"pnpm not found"**

```powershell
npm install -g pnpm
```

### **Need manual Supabase setup?**

See: `docs/SUPABASE_MASTER_SETUP_GUIDE.md`

---

## 📊 Tools Comparison

### **Builder.io vs. Your Current Setup**

| Feature | Builder.io | Your Setup (Figma Make + GitHub + Supabase) |
|---------|------------|---------------------------------------------|
| **Cost** | $99-299/mo | **$0-5/mo** (free tiers) |
| **Code Control** | ❌ Proprietary | ✅ Full control (Git) |
| **Custom Backend** | ❌ Limited | ✅ Unlimited (Vercel + Supabase) |
| **React Components** | ❌ Must rebuild | ✅ Already built (340 files) |
| **Lock-in Risk** | ❌ High | ✅ None (open source stack) |

**Verdict:** You already have a *better* setup than Builder.io! 🎉

---

## 🎯 Your Tech Stack (All Free Tier)

| Tool | Purpose | Cost |
|------|---------|------|
| **Figma Make** | Prototype → React code | Free |
| **GitHub** | Version control | Free |
| **VS Code** | Code editor | Free |
| **GitHub Copilot** | AI coding assistant | $10/mo |
| **Supabase** | Database (500MB) | Free |
| **Vercel** | Hosting (100GB bandwidth) | Free |

**Total:** $10/mo for Copilot (optional, free trial available)

---

## 📖 Documentation

- **Automation Scripts:** `scripts/README.md`
- **Supabase Setup:** `docs/SUPABASE_MASTER_SETUP_GUIDE.md`
- **GitHub Setup:** `docs/GITHUB_COMPLETE_SETUP_GUIDE.md`
- **Document Control:** `docs/DOCUMENT_CONTROL_SUPABASE_SETUP.md`

---

## ✨ Summary - You're Ready!

**What you have:**
- ✅ 340 files committed to local Git
- ✅ Complete React + Vite + Tailwind app
- ✅ Document Control System (8 modules)
- ✅ V1-V4 backend implementation
- ✅ Automated setup scripts

**What you need:**
1. ✅ Push to GitHub (GitHub Desktop or scripts)
2. ✅ Set up Supabase (automated script or manual)
3. ✅ Create .env file (automated script)
4. ✅ Open in VS Code
5. ✅ Start coding!

**Recommended path:**
```
GitHub Desktop → Publish → VS Code → Copilot → Scripts → Code! 🚀
```

---

**Questions?** See `scripts/README.md` for detailed troubleshooting.

**Ready?** Run: `.\scripts\setup-all.ps1`

**Let's build Aethos!** 🎉
