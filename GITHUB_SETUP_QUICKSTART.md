# 🚀 GitHub Setup - Quick Start (5 Minutes)

**⚠️ CRITICAL: Do this NOW before making any more changes!**

---

## Why You Need This NOW

🔴 **Without GitHub, you risk losing everything if:**
- Your computer crashes
- You make a mistake and can't undo it
- You need to collaborate with others
- You want to deploy to Vercel (requires GitHub!)

---

## ⚡ Super Quick Setup (5 Steps)

### **1. Create GitHub Account (2 min)**
- Go to [github.com](https://github.com) → Sign up
- Use your email, choose username, create password
- Verify email

### **2. Install Git (1 min)**

**Windows:**
```bash
# Download and install: https://git-scm.com/download/win
# Use default settings
```

**Mac:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt install git
```

### **3. Configure Git (30 sec)**
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
git config --global init.defaultBranch main
```

### **4. Check .gitignore Exists (30 sec)**
```bash
# In your project folder, verify .gitignore exists:
ls -la | grep .gitignore

# Should show: .gitignore

# If not, it was just created - you're good!
```

### **5. Initialize and Push (1 min)**
```bash
# In your Aethos project folder:
cd /path/to/your/aethos-project

# Initialize Git
git init

# ⚠️ CRITICAL CHECK: Make sure .env is NOT shown
git status
# If you see .env, STOP and add it to .gitignore!

# Stage all files
git add .

# Create first commit
git commit -m "Initial commit: Aethos platform"

# Create GitHub repository:
# - Go to github.com → New repository
# - Name: aethos-platform
# - Visibility: Private
# - DO NOT initialize with README
# - Create repository

# Connect to GitHub (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/aethos-platform.git
git branch -M main
git push -u origin main
```

**You'll be asked for credentials:**
- Username: your-github-username
- Password: Use Personal Access Token (see below)

### **Get Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → Check "repo" → Generate
3. Copy token (starts with `ghp_`)
4. Use as password when pushing

---

## ✅ Done! Your code is now backed up.

**Next:** Read the full guide at `/docs/GITHUB_COMPLETE_SETUP_GUIDE.md`

---

## 📋 Daily Commands (Copy This!)

```bash
# Start working
git pull origin main

# Make changes, then save:
git add .
git commit -m "Describe what you changed"
git push origin main

# Do this AT LEAST once per day!
```

---

## 🚨 Emergency: "I Committed .env!"

```bash
# Remove from Git immediately
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push origin --force --all

# Then IMMEDIATELY rotate all secrets:
# - New Supabase keys
# - New OpenAI key
# - New Microsoft secrets
```

---

## 🔗 Next Steps

1. ✅ **Immediate:** Push your code (done above)
2. ✅ **Today:** Connect to Vercel for auto-deploy
3. ✅ **This Week:** Set up branching strategy
4. ✅ **Ongoing:** Commit daily!

**Full guide:** `/docs/GITHUB_COMPLETE_SETUP_GUIDE.md`

---

**Status:** ✅ Quick Start Complete  
**Time:** 5 minutes  
**Your code is now safe in the cloud!** 🎉
