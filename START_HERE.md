# 🚀 START HERE - Aethos Setup

**Complete setup in 15 minutes - No PowerShell errors!**

---

## ⭐ **THE EASIEST WAY - Just Double-Click!**

### **Step 1: Find This File**

```
📁 C:\Users\Ashley\Projects\Aethos\
   └── RUN_SETUP.bat  ⬅️ DOUBLE-CLICK THIS!
```

### **Step 2: Double-Click It**

That's it! The wizard will guide you through everything.

---

## ✅ **What the Wizard Will Do**

```
═══════════════════════════════════════════════════════════
  🚀 AETHOS COMPLETE SETUP WIZARD
═══════════════════════════════════════════════════════════

This wizard will guide you through:
  1. Git and GitHub setup
  2. Supabase database setup
  3. Environment configuration
  4. Verification and testing

⏱️  Estimated time: 10-15 minutes

Ready to begin? (yes/no):
```

---

## 📋 **What You'll Need**

Before running the setup, have these ready:

### **1. Supabase Account (Free)**
- Go to: https://supabase.com
- Sign up (free)
- Create new project
- Get your Project URL and Anon Key

### **2. Microsoft Azure Account**
- For Microsoft Entra ID integration
- Get Client ID and Tenant ID

### **3. OpenAI Account (Optional)**
- Only if you want AI+ features
- Get API key from: https://platform.openai.com

---

## 🎯 **Complete Setup Flow**

### **Using the Batch File (Recommended):**

1. **Double-click:** `RUN_SETUP.bat`
2. **Follow prompts** for:
   - Git configuration
   - Supabase credentials
   - Environment variables
3. **Done!** Everything is configured

### **Manual Alternative (If Batch File Doesn't Work):**

1. **Environment File:**
   - Copy `.env.example` to `.env`
   - Edit in VS Code
   - Fill in your credentials

2. **Supabase Setup:**
   - Go to Supabase Dashboard → SQL Editor
   - Copy/paste: `supabase/migrations/001_initial_schema.sql`
   - Run it
   - Copy/paste: `supabase/migrations/003_v15_to_v4_features.sql`
   - Run it

3. **GitHub:**
   - Download GitHub Desktop: https://desktop.github.com
   - Add local repository
   - Publish to GitHub

---

## 🆘 **If You Get Errors**

### **"Windows protected your PC"**

This is normal for batch files:
1. Click "More info"
2. Click "Run anyway"

### **PowerShell Execution Policy Errors**

The batch file should prevent these, but if you get them:

```powershell
# Run with bypass
PowerShell -ExecutionPolicy Bypass -File .\scripts\setup-all.ps1
```

### **Need Help?**

See these guides:
- `EASIEST_SETUP_METHOD.md` - All about batch files
- `scripts/README.md` - Detailed script documentation
- `FIX_EXECUTION_POLICY.md` - PowerShell security fixes

---

## 📁 **Project Files Overview**

```
C:\Users\Ashley\Projects\Aethos\
│
├── RUN_SETUP.bat ⭐ ← START HERE (double-click this!)
│
├── scripts/
│   ├── setup-all.bat          (Complete wizard)
│   ├── setup-supabase.bat     (Database only)
│   ├── create-env-file.bat    (Environment only)
│   ├── verify-setup.bat       (Check everything)
│   │
│   ├── setup-all.ps1          (PowerShell version)
│   ├── setup-supabase.ps1     (PowerShell version)
│   ├── create-env-file.ps1    (PowerShell version)
│   └── verify-setup.ps1       (PowerShell version)
│
├── .env.example               (Template for your .env)
├── package.json               (Node dependencies)
│
├── docs/
│   ├── SUPABASE_MASTER_SETUP_GUIDE.md
│   ├── GITHUB_COMPLETE_SETUP_GUIDE.md
│   └── DOCUMENT_CONTROL_SUPABASE_SETUP.md
│
└── supabase/migrations/       (Database schemas)
```

---

## ✨ **After Setup**

Once setup is complete:

```powershell
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open in browser
# http://localhost:5173
```

---

## 🎯 **Next Steps After Setup**

1. **Push to GitHub:**
   - Use GitHub Desktop
   - OR run: `git push -u origin main`

2. **Deploy to Vercel (Optional):**
   - Go to: https://vercel.com
   - Import your GitHub repo
   - Auto-deploys on every push!

3. **Open in VS Code:**
   - File → Open Folder
   - Select: `C:\Users\Ashley\Projects\Aethos`

4. **Start Coding:**
   - `pnpm dev` to start dev server
   - Open http://localhost:5173
   - Start building!

---

## 🎉 **You're Ready!**

**Action:** Double-click `RUN_SETUP.bat` now!

**Questions?** Check the documentation in `/docs/`

**Issues?** See troubleshooting guides:
- `EASIEST_SETUP_METHOD.md`
- `FIX_EXECUTION_POLICY.md`
- `scripts/README.md`

---

**Let's build Aethos! 🚀**
