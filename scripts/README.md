# 🛠️ Aethos Setup Scripts (Windows)

**Automated setup scripts for Windows developers**

---

## 🚀 Quick Start (The Easiest Way)

### **⭐ Just Double-Click This File:**

```
RUN_SETUP.bat
```

**No PowerShell errors! No security issues! Just works!**

---

## 🔧 Alternative Methods

### **From Command Line:**

```cmd
RUN_SETUP.bat
```

OR with PowerShell bypass:

```powershell
PowerShell -ExecutionPolicy Bypass -File .\scripts\setup-all.ps1
```

This runs everything in sequence:
1. Git and GitHub configuration
2. Supabase database setup
3. Environment file creation
4. Verification and testing

**Time:** ~10-15 minutes  
**Difficulty:** ⭐ Very Easy (just double-click!)

---

## 📁 Batch File Wrappers (No PowerShell Issues)

Every script has a `.bat` wrapper that bypasses all PowerShell security:

| Batch File | PowerShell Script | Use When |
|------------|-------------------|----------|
| `RUN_SETUP.bat` (root folder) | `setup-all.ps1` | ⭐ First time setup |
| `setup-all.bat` | `setup-all.ps1` | Complete wizard |
| `setup-supabase.bat` | `setup-supabase.ps1` | Database setup only |
| `create-env-file.bat` | `create-env-file.ps1` | Environment config only |
| `verify-setup.bat` | `verify-setup.ps1` | Verification only |

**Just double-click any `.bat` file - no execution policy errors!**

---

## 📜 Individual Scripts

If you prefer to run steps manually or need to fix specific issues:

### 1. **setup-supabase.ps1** - Database Setup

Creates all database tables in Supabase automatically.

```powershell
# Interactive mode (prompts for credentials)
.\scripts\setup-supabase.ps1

# Non-interactive mode
.\scripts\setup-supabase.ps1 `
  -SupabaseUrl "https://xxxxx.supabase.co" `
  -ServiceRoleKey "eyJ..."

# Dry run (preview only, no changes)
.\scripts\setup-supabase.ps1 -DryRun

# Skip Document Control tables
.\scripts\setup-supabase.ps1 -SkipDocumentControl
```

**What it does:**
- ✅ Tests connection to Supabase
- ✅ Runs migration files (001, 003)
- ✅ Creates 20+ database tables
- ✅ Sets up Row-Level Security (RLS)
- ✅ Verifies tables created successfully

**Prerequisites:**
- Supabase project created
- Service Role Key from Supabase dashboard

---

### 2. **create-env-file.ps1** - Environment Configuration

Creates `.env` file with proper formatting and validation.

```powershell
# Interactive mode (recommended)
.\scripts\create-env-file.ps1
```

**What it does:**
- ✅ Prompts for required credentials
- ✅ Validates format (URLs, UUIDs, API keys)
- ✅ Creates `.env` file
- ✅ Checks `.gitignore` for security
- ✅ Backs up existing `.env` if present

**You'll need:**
- Supabase URL & Anon Key
- Microsoft Client ID & Tenant ID
- OpenAI API Key (optional, for AI+ features)

---

### 3. **verify-setup.ps1** - Health Check

Verifies your entire setup is correct.

```powershell
# Run verification
.\scripts\verify-setup.ps1
```

**What it checks:**
- ✅ Git installed & configured
- ✅ GitHub remote connected
- ✅ Project files exist
- ✅ `.env` file configured
- ✅ Supabase connection working
- ✅ Database tables created
- ✅ Node.js & dependencies installed

**Exit codes:**
- `0` = All checks passed
- `1` = Some checks failed

---

### 4. **setup-all.ps1** - Complete Setup Wizard

Runs all scripts in sequence with guided prompts.

```powershell
# Full setup
.\scripts\setup-all.ps1

# Skip specific steps
.\scripts\setup-all.ps1 -SkipGit
.\scripts\setup-all.ps1 -SkipSupabase
.\scripts\setup-all.ps1 -SkipEnv
```

**Perfect for:**
- First-time setup
- New developers joining the project
- Resetting development environment

---

## 🔧 Troubleshooting

### "Execution policy error"

```powershell
# Allow running scripts (run as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Git not found"

Install Git for Windows:
1. Download: https://git-scm.com/download/win
2. Install with default settings
3. Restart PowerShell

### "Cannot connect to Supabase"

Check:
- ✅ Supabase URL is correct (ends with `.supabase.co`)
- ✅ Service Role Key is correct (starts with `eyJ`)
- ✅ Supabase project is running (not paused)
- ✅ Firewall/VPN not blocking connection

### "Migration failed"

**Fallback: Manual SQL execution**

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and run
4. Repeat for `003_v15_to_v4_features.sql`

### ".env file not working"

Run verification to check:
```powershell
.\scripts\verify-setup.ps1
```

Common issues:
- ❌ Extra spaces around `=` (should be `KEY=value` not `KEY = value`)
- ❌ Missing quotes for URLs with special characters
- ❌ Wrong variable names (must start with `VITE_` for frontend)

---

## 🔐 Security Best Practices

### ⚠️ NEVER commit these files:

```
.env
.env.local
.env.production
```

### ✅ Always commit these files:

```
.env.example       # Template without real secrets
.gitignore         # Protects against accidental commits
```

### 🔒 Protect your secrets:

1. **Service Role Key** = Full database access (keep secret!)
2. **Anon Key** = Safe to use in frontend
3. **OpenAI API Key** = Costs money if exposed
4. **Microsoft secrets** = Access to M365 tenant

---

## 📋 Common Workflows

### First-Time Setup

```powershell
# 1. Clone or create project
git clone https://github.com/your-org/aethos-platform.git
cd aethos-platform

# 2. Run setup wizard
.\scripts\setup-all.ps1

# 3. Install dependencies
pnpm install

# 4. Start development
pnpm dev
```

### Reset Environment

```powershell
# Recreate .env file
.\scripts\create-env-file.ps1

# Verify everything works
.\scripts\verify-setup.ps1
```

### Add New Database Tables

```powershell
# 1. Add SQL to migration file
# 2. Run Supabase setup
.\scripts\setup-supabase.ps1

# 3. Verify tables created
.\scripts\verify-setup.ps1
```

### Onboard New Developer

```powershell
# Send them this:
git clone <repo-url>
cd aethos-platform
.\scripts\setup-all.ps1
pnpm install
pnpm dev
```

---

## 🆘 Getting Help

### Script Help

```powershell
# Get help for any script
Get-Help .\scripts\setup-supabase.ps1 -Detailed
```

### Documentation

- **Supabase Setup:** `/docs/SUPABASE_MASTER_SETUP_GUIDE.md`
- **GitHub Setup:** `/docs/GITHUB_COMPLETE_SETUP_GUIDE.md`
- **Environment Vars:** `/.env.example`

### Support

- **File Issues:** GitHub Issues tab
- **Questions:** Team Slack #aethos-dev

---

## 📊 Script Comparison

| Script | Time | Difficulty | Prerequisites |
|--------|------|------------|---------------|
| `setup-all.ps1` | 10-15 min | ⭐ Easy | None |
| `create-env-file.ps1` | 2 min | ⭐ Easy | Supabase/Azure keys |
| `setup-supabase.ps1` | 3 min | ⭐⭐ Medium | Supabase project |
| `verify-setup.ps1` | 1 min | ⭐ Easy | None |

---

## 🎯 What's Next?

After running setup scripts:

1. ✅ **Open VS Code:** `code .`
2. ✅ **Install extensions:** GitHub Copilot, Prettier
3. ✅ **Start dev server:** `pnpm dev`
4. ✅ **Open browser:** `http://localhost:5173`
5. ✅ **Start coding!** 🚀

---

**Last Updated:** 2026-04-29  
**Maintainer:** Aethos DevOps Team
