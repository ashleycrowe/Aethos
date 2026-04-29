# 🚀 Aethos Platform - Complete GitHub Setup Guide

**Version:** 1.0  
**Date:** April 6, 2026  
**Urgency:** 🔴 **CRITICAL - Do This NOW!**  
**Time:** 20-30 minutes  
**Cost:** $0 (GitHub Free)

---

## ⚠️ WHY YOU NEED GITHUB NOW

### **You're at CRITICAL RISK without version control:**

1. **🔴 No Backup:** If your computer crashes, you lose EVERYTHING
2. **🔴 No History:** Can't undo changes or see what you changed
3. **🔴 No Collaboration:** Can't share code with team/developers
4. **🔴 No Deployment:** Can't auto-deploy to Vercel (your current setup requires this!)
5. **🔴 No Recovery:** One bad commit = entire project broken with no rollback

### **What GitHub Gives You:**

✅ **Automatic backups** - Your code is safe in the cloud  
✅ **Version history** - Time machine for your code  
✅ **Collaboration** - Multiple people can work simultaneously  
✅ **Auto-deployment** - Push to GitHub → Auto-deploy to Vercel  
✅ **Disaster recovery** - Roll back to any previous version  
✅ **Code review** - See what changed before deploying  
✅ **Professional workflow** - Industry standard

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Part 1: GitHub Account Setup (5 min)](#part-1-github-account-setup)
3. [Part 2: Install Git (5 min)](#part-2-install-git)
4. [Part 3: Create .gitignore (CRITICAL - 5 min)](#part-3-create-gitignore)
5. [Part 4: Initialize Repository (5 min)](#part-4-initialize-repository)
6. [Part 5: First Commit (5 min)](#part-5-first-commit)
7. [Part 6: Branching Strategy (10 min)](#part-6-branching-strategy)
8. [Part 7: Vercel Integration (5 min)](#part-7-vercel-integration)
9. [Part 8: Daily Workflow](#part-8-daily-workflow)
10. [Part 9: Version Tagging & Releases](#part-9-version-tagging-releases)
11. [Part 10: Disaster Recovery](#part-10-disaster-recovery)

---

## 📦 Prerequisites

- [ ] Your Aethos project folder (you have this!)
- [ ] Terminal/Command Prompt access
- [ ] Email address (for GitHub account)
- [ ] Internet connection

---

# PART 1: GitHub Account Setup (5 minutes)

## Step 1.1: Create GitHub Account

1. **Go to [github.com](https://github.com)**
2. Click **"Sign up"**
3. Fill in:
   - **Email:** Your email address
   - **Password:** Strong password (save this!)
   - **Username:** Choose something professional (e.g., `yourname-dev`, `aethos-team`)
4. **Verify email** - Check your inbox and click verification link
5. **Choose Free plan** - Click "Continue for Free"

## Step 1.2: Configure Your Profile

1. Click your profile icon (top right) → **Settings**
2. **Public profile:**
   - Name: Your name or company name
   - Bio: "Building Aethos - The Anti-Intranet"
   - Location: (optional)
3. **Save changes**

## Step 1.3: Enable Two-Factor Authentication (Recommended)

1. Go to **Settings → Password and authentication**
2. Click **"Enable two-factor authentication"**
3. Choose **"Set up using an app"** (use Google Authenticator or Authy)
4. **Save recovery codes** somewhere safe!

---

# PART 2: Install Git (5 minutes)

## Windows

### Option A: Git for Windows (Recommended)

1. **Download:** [git-scm.com/download/win](https://git-scm.com/download/win)
2. **Run installer** - Use default settings
3. **Important settings:**
   - ✅ Use Visual Studio Code as Git's default editor (if you have VS Code)
   - ✅ Override the default branch name: `main`
   - ✅ Git from the command line and also from 3rd-party software
   - ✅ Use bundled OpenSSH
   - ✅ Use the OpenSSL library
   - ✅ Checkout Windows-style, commit Unix-style line endings
4. **Finish** installation

### Verify Installation

Open **PowerShell** or **Command Prompt**:

```bash
git --version
# Should show: git version 2.x.x
```

## macOS

### Option A: Using Homebrew (Recommended)

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Git
brew install git

# Verify
git --version
```

### Option B: Xcode Command Line Tools

```bash
xcode-select --install
git --version
```

## Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install git
git --version
```

---

## Step 2.1: Configure Git Globally

In your terminal:

```bash
# Set your name (will appear in commits)
git config --global user.name "Your Name"

# Set your email (MUST match GitHub email)
git config --global user.email "your-email@example.com"

# Set default branch name to 'main'
git config --global init.defaultBranch main

# Set default editor (optional - use VS Code)
git config --global core.editor "code --wait"

# Enable colored output
git config --global color.ui auto

# Verify configuration
git config --list
```

**Expected output:**
```
user.name=Your Name
user.email=your-email@example.com
init.defaultbranch=main
color.ui=auto
```

---

# PART 3: Create .gitignore (CRITICAL - 5 minutes)

## ⚠️ CRITICAL: Protect Your Secrets!

The `.gitignore` file tells Git which files to **NEVER** upload to GitHub. This prevents you from accidentally exposing:
- API keys (OpenAI, Microsoft, Slack, Google)
- Database passwords (Supabase)
- Environment variables

## Step 3.1: Create .gitignore File

In your **project root directory** (where `package.json` is), create a file named `.gitignore`:

### **Complete .gitignore for Aethos:**

```gitignore
# ============================================
# AETHOS PLATFORM .gitignore
# ============================================

# ============================================
# CRITICAL: SECRETS & ENVIRONMENT VARIABLES
# ============================================
.env
.env.local
.env.development
.env.production
.env.staging
.env.*.local
*.env

# Supabase local config (contains secrets)
.supabase/

# Vercel (contains secrets)
.vercel

# ============================================
# DEPENDENCIES
# ============================================
node_modules/
/.pnp
.pnp.js

# ============================================
# BUILD OUTPUT
# ============================================
dist/
build/
out/
.next/
.cache/

# ============================================
# LOGS
# ============================================
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# ============================================
# EDITOR & IDE
# ============================================
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea/
*.swp
*.swo
*.swn
*.bak
*~
.DS_Store
Thumbs.db

# ============================================
# TESTING
# ============================================
coverage/
.nyc_output/
*.lcov

# ============================================
# TEMPORARY FILES
# ============================================
*.tmp
*.temp
.temp/
.tmp/

# ============================================
# OPERATING SYSTEM
# ============================================
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
desktop.ini

# ============================================
# PACKAGE MANAGER LOCKS (Optional - see note)
# ============================================
# Uncomment ONE of these based on your package manager:
# pnpm-lock.yaml  # If using pnpm
# yarn.lock       # If using yarn
# package-lock.json  # If using npm

# ============================================
# CERTIFICATES & KEYS
# ============================================
*.pem
*.key
*.cert
*.crt

# ============================================
# AETHOS SPECIFIC
# ============================================
# Local development files
/sandbox/
/playground/

# AI model cache (if you cache OpenAI responses)
.ai-cache/

# Local Supabase instance data
/supabase/.branches/
/supabase/.temp/

# ============================================
# OPTIONAL: LARGE FILES
# ============================================
# Uncomment if you have large assets that shouldn't be in Git
# *.mp4
# *.mov
# *.zip
# *.tar.gz
```

### **CRITICAL FILES TO NEVER COMMIT:**

**Verify your `.env` file is listed in `.gitignore`!**

Check your `.env` file right now:
```bash
cat .env
```

If you see API keys, passwords, or secrets, **DO NOT PROCEED** until `.gitignore` is created!

---

# PART 4: Initialize Repository (5 minutes)

## Step 4.1: Open Terminal in Project Directory

Navigate to your Aethos project root:

```bash
# Example (adjust to your actual path):
cd /path/to/your/aethos-project

# Verify you're in the right place (should show package.json)
ls
```

## Step 4.2: Initialize Git Repository

```bash
# Initialize Git repository
git init

# Expected output:
# Initialized empty Git repository in /path/to/aethos/.git/
```

## Step 4.3: Verify .gitignore is Working

```bash
# Check what files Git sees
git status

# You should NOT see:
# - .env
# - node_modules/
# - .vercel/
# - .supabase/

# If you see .env or other secrets, STOP and fix .gitignore!
```

**Expected output:**
```
On branch main
No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.gitignore
	package.json
	src/
	docs/
	... (lots of files)
```

**🚨 If you see `.env` in the list, STOP:**
1. Make sure `.gitignore` exists and has `.env` in it
2. Run `git status` again
3. `.env` should disappear from the list

---

# PART 5: First Commit (5 minutes)

## Step 5.1: Stage All Files

```bash
# Add all files to staging area
git add .

# Verify what's staged
git status
```

**Expected output:**
```
On branch main
No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
	new file:   .gitignore
	new file:   package.json
	new file:   src/app/App.tsx
	... (hundreds of files)
```

**🚨 DOUBLE-CHECK: If you see `.env` here, STOP!**
```bash
# Remove .env from staging
git rm --cached .env

# Make sure .gitignore has .env in it
echo ".env" >> .gitignore

# Re-stage .gitignore
git add .gitignore
```

## Step 5.2: Create First Commit

```bash
# Commit with a descriptive message
git commit -m "Initial commit: Aethos platform with Document Control"

# You should see output like:
# [main (root-commit) abc1234] Initial commit: Aethos platform with Document Control
#  342 files changed, 25643 insertions(+)
```

🎉 **Congratulations!** You just created your first commit (local snapshot of your code).

## Step 5.3: Create GitHub Repository

1. **Go to [github.com](https://github.com)**
2. Click **"+"** (top right) → **"New repository"**
3. Fill in:
   - **Repository name:** `aethos-platform` (or your preferred name)
   - **Description:** "Aethos - The Anti-Intranet | Enterprise SaaS for M365 Intelligence"
   - **Visibility:** 
     - 🔒 **Private** (Recommended - keeps your code secret)
     - 🌍 **Public** (Only if you want to open-source it)
   - **⚠️ DO NOT check "Initialize with README"** (you already have files)
4. Click **"Create repository"**

## Step 5.4: Connect Local Repository to GitHub

GitHub will show you commands. Copy them or use these:

```bash
# Add GitHub as remote origin (REPLACE with YOUR repository URL!)
git remote add origin https://github.com/YOUR-USERNAME/aethos-platform.git

# Verify remote is added
git remote -v
# Should show:
# origin  https://github.com/YOUR-USERNAME/aethos-platform.git (fetch)
# origin  https://github.com/YOUR-USERNAME/aethos-platform.git (push)

# Push your code to GitHub
git branch -M main
git push -u origin main
```

**You'll be prompted for credentials:**
- **Username:** Your GitHub username
- **Password:** Your GitHub password OR **Personal Access Token** (see below if password doesn't work)

### If Password Doesn't Work (GitHub requires Personal Access Token)

1. **Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Fill in:
   - **Note:** "Aethos Platform Git Access"
   - **Expiration:** 90 days (or No expiration)
   - **Scopes:** ✅ Check `repo` (Full control of private repositories)
4. **Generate token**
5. **COPY THE TOKEN** (you can't see it again!)
6. **Use token as password** when pushing to GitHub

```bash
# If prompted, use:
# Username: your-github-username
# Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (your token)
```

**Expected output:**
```
Enumerating objects: 450, done.
Counting objects: 100% (450/450), done.
Delta compression using up to 8 threads
Compressing objects: 100% (380/380), done.
Writing objects: 100% (450/450), 2.5 MiB | 1.2 MiB/s, done.
Total 450 (delta 45), reused 0 (delta 0)
To https://github.com/YOUR-USERNAME/aethos-platform.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

🎉 **Success!** Your code is now on GitHub. Visit your repository URL to see it.

---

# PART 6: Branching Strategy (10 minutes)

Following Aethos Guidelines (`/guidelines/Guidelines.md`), you should use this branch structure:

## Branch Structure

```
main (production)
  ↑
develop (staging)
  ↑
feature/document-control
feature/oracle-search
feature/supabase-integration
```

### **Branch Purposes:**

| Branch | Environment | Auto-Deploy To | Purpose |
|--------|-------------|----------------|---------|
| `main` | Production | app.aethos.com | Live customer code - STABLE ONLY |
| `develop` | Staging | staging.aethos.com | Integration testing before production |
| `feature/*` | Development | preview-xxx.vercel.app | Individual features being built |

## Step 6.1: Create Development Branch

```bash
# Create and switch to develop branch
git checkout -b develop

# Push develop branch to GitHub
git push -u origin develop
```

## Step 6.2: Set Up Branch Protection (Optional but Recommended)

On GitHub:

1. Go to your repository → **Settings** → **Branches**
2. Click **"Add rule"**
3. **Branch name pattern:** `main`
4. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require status checks to pass before merging (if you have CI/CD)
5. **Create**

This prevents accidental direct commits to `main`.

---

# PART 7: Vercel Integration (5 minutes)

## Step 7.1: Connect Vercel to GitHub

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. **Authorize Vercel to access GitHub** (if not already done)
5. **Select your `aethos-platform` repository**
6. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)
7. **Environment Variables:**
   - Click "Add Environment Variable"
   - Add ALL variables from your `.env` file (copy one by one)
   - **Important:** Add to "Production", "Preview", and "Development"
8. **Deploy**

## Step 7.2: Configure Auto-Deploy Settings

In Vercel Dashboard → Settings → Git:

- ✅ **Production Branch:** `main`
- ✅ **Deploy Previews:** `develop` and all `feature/*` branches
- ✅ **Auto-deploy:** On (enabled by default)

**What happens now:**
- Push to `main` → Auto-deploys to app.aethos.com (production)
- Push to `develop` → Auto-deploys to staging.aethos.com (or preview URL)
- Push to `feature/xyz` → Auto-deploys to preview-xyz.vercel.app

---

# PART 8: Daily Workflow

## Typical Development Workflow

### **Starting a New Feature:**

```bash
# Make sure you're on develop branch
git checkout develop

# Pull latest changes from GitHub
git pull origin develop

# Create new feature branch
git checkout -b feature/new-feature-name

# Example:
git checkout -b feature/approval-workflows
```

### **Working on Your Feature:**

```bash
# Make changes to files...

# Check what you changed
git status

# Stage specific files
git add src/app/components/NewComponent.tsx
git add docs/NEW_FEATURE.md

# Or stage all changes
git add .

# Commit with descriptive message
git commit -m "Add approval workflow UI components"

# Push to GitHub
git push origin feature/approval-workflows
```

### **Commit Message Best Practices:**

**Good commit messages:**
```bash
git commit -m "Add document approval workflow component"
git commit -m "Fix health score calculation in DocumentCard"
git commit -m "Update Supabase schema for Document Control"
git commit -m "Refactor OracleSearch to use new API"
```

**Bad commit messages:**
```bash
git commit -m "updates"
git commit -m "fix"
git commit -m "wip"
git commit -m "stuff"
```

### **Format:**
```bash
# Type: Subject (50 chars or less)
# 
# Optional body explaining what and why
# (72 chars per line)

# Types:
# - Add: New feature
# - Fix: Bug fix
# - Update: Update existing feature
# - Refactor: Code restructuring
# - Docs: Documentation only
# - Style: Formatting, no code change
# - Test: Add or update tests
# - Chore: Maintenance (deps, config)
```

**Examples:**
```bash
git commit -m "Add: Document Control approval workflow UI"
git commit -m "Fix: Supabase RLS policy preventing document creation"
git commit -m "Update: Oracle search to support semantic queries"
git commit -m "Refactor: Extract DocumentCard logic into hooks"
git commit -m "Docs: Add GitHub setup guide"
```

### **Merging Feature to Develop:**

```bash
# Switch to develop branch
git checkout develop

# Pull latest changes
git pull origin develop

# Merge your feature branch
git merge feature/approval-workflows

# Push to GitHub (triggers staging deployment)
git push origin develop
```

### **Releasing to Production:**

```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge develop into main
git merge develop

# Push to GitHub (triggers production deployment!)
git push origin main
```

---

# PART 9: Version Tagging & Releases

## Why Tag Versions?

Tags create permanent snapshots of your code at specific points (like releases).

## Step 9.1: Create a Tag

```bash
# Tag current commit as v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0: Core platform + Document Control"

# Push tag to GitHub
git push origin v1.0.0

# Or push all tags
git push --tags
```

## Step 9.2: Semantic Versioning (Recommended)

Format: `vMAJOR.MINOR.PATCH`

- **MAJOR (v1.0.0 → v2.0.0):** Breaking changes (API changes, removed features)
- **MINOR (v1.0.0 → v1.1.0):** New features (backward compatible)
- **PATCH (v1.0.0 → v1.0.1):** Bug fixes only

**Examples:**
```bash
v1.0.0  # Initial release
v1.0.1  # Bug fix release
v1.1.0  # Added Oracle AI search
v1.2.0  # Added Document Control
v2.0.0  # Complete UI redesign (breaking change)
```

## Step 9.3: Create GitHub Release

1. Go to your repository on GitHub
2. Click **"Releases"** (right sidebar)
3. Click **"Draft a new release"**
4. Fill in:
   - **Tag version:** v1.0.0 (or create new tag)
   - **Release title:** "Aethos v1.0.0 - Core Platform + Document Control"
   - **Description:**
     ```markdown
     ## 🚀 Features
     - ✅ Microsoft 365 discovery and sync
     - ✅ Intelligent workspaces (The Nexus)
     - ✅ Oracle AI-powered metadata search
     - ✅ Document Control System (ISO 9001, SOC 2, FDA)
     - ✅ Multi-tenant support with RLS
     
     ## 🐛 Bug Fixes
     - Fixed health score calculation
     - Resolved RLS policy issues
     
     ## 📋 Database Schema
     - 35 tables (22 core + 13 Document Control)
     - 50+ RLS policies
     - pgvector support for semantic search
     
     ## 🔗 Links
     - [Setup Guide](/docs/SUPABASE_MASTER_SETUP_GUIDE.md)
     - [API Reference](/docs/API_QUICK_REFERENCE.md)
     ```
5. **Publish release**

---

# PART 10: Disaster Recovery

## Scenario 1: Undo Last Commit (Not Pushed)

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes
git reset --hard HEAD~1
```

## Scenario 2: Restore Deleted File

```bash
# Find the commit where file existed
git log -- path/to/file.tsx

# Restore file from specific commit
git checkout abc1234 -- path/to/file.tsx

# Or restore from last commit
git checkout HEAD -- path/to/file.tsx
```

## Scenario 3: Revert to Previous Version

```bash
# See commit history
git log --oneline

# Revert to specific commit (creates new commit)
git revert abc1234

# Or hard reset to commit (DESTRUCTIVE - loses all changes after)
git reset --hard abc1234
```

## Scenario 4: Computer Crashed - Recover Project

```bash
# On new computer:
# Clone repository from GitHub
git clone https://github.com/YOUR-USERNAME/aethos-platform.git

# Navigate to project
cd aethos-platform

# Install dependencies
npm install

# Create .env file (copy from backup or memory)
# Add all environment variables

# Run project
npm run dev
```

🎉 **Your entire project is restored!**

## Scenario 5: Merge Conflict Resolution

```bash
# You'll see:
# CONFLICT (content): Merge conflict in src/app/App.tsx

# Open conflicted file - you'll see:
<<<<<<< HEAD
Your current code
=======
Incoming conflicting code
>>>>>>> feature/new-feature

# Edit file to resolve conflict (keep what you want)
# Remove conflict markers (<<<, ===, >>>)

# Stage resolved file
git add src/app/App.tsx

# Complete merge
git commit -m "Resolve merge conflict in App.tsx"
```

---

# PART 11: Useful Git Commands Cheat Sheet

## Status & Info

```bash
# Check status
git status

# See commit history
git log
git log --oneline
git log --graph --oneline --all

# See what changed
git diff
git diff filename.tsx
git diff main..develop

# See who changed what
git blame filename.tsx
```

## Branches

```bash
# List all branches
git branch -a

# Create new branch
git checkout -b feature/new-feature

# Switch branch
git checkout develop

# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature

# Rename current branch
git branch -m new-branch-name
```

## Stashing (Save Work Without Committing)

```bash
# Save current changes temporarily
git stash

# See stashed changes
git stash list

# Apply most recent stash
git stash apply

# Apply and remove stash
git stash pop

# Discard stash
git stash drop
```

## Undoing Changes

```bash
# Discard changes to file (not staged)
git checkout -- filename.tsx

# Unstage file (keep changes)
git reset HEAD filename.tsx

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert commit (creates new commit)
git revert abc1234
```

## Remote Operations

```bash
# See remote repositories
git remote -v

# Fetch updates (doesn't merge)
git fetch origin

# Pull updates (fetch + merge)
git pull origin main

# Push to remote
git push origin main

# Push all branches
git push --all

# Push all tags
git push --tags
```

---

# PART 12: Best Practices & Tips

## 🟢 DO:

✅ **Commit often** - Small, focused commits  
✅ **Write clear commit messages** - Explain what and why  
✅ **Pull before push** - Avoid conflicts  
✅ **Use branches** - Never work directly on `main`  
✅ **Test before merging** - Make sure it works  
✅ **Use .gitignore** - Never commit secrets  
✅ **Tag releases** - Mark important milestones  
✅ **Push daily** - Back up your work  

## 🔴 DON'T:

❌ **Don't commit `.env` files** - Exposes secrets  
❌ **Don't commit `node_modules/`** - Wastes space  
❌ **Don't commit large binary files** - Use Git LFS instead  
❌ **Don't force push to `main`** - Can break production  
❌ **Don't work on `main` directly** - Use feature branches  
❌ **Don't commit broken code to `main`** - Test first  
❌ **Don't commit WIP ("work in progress")** - Finish the feature  

## 📊 Commit Frequency Guidelines

- **Too few commits:** Lose granular history, hard to debug
- **Too many commits:** Cluttered history, hard to review
- **Sweet spot:** 3-10 commits per day of work

**Good rhythm:**
```bash
git commit -m "Add: DocumentCard component structure"
# ... work for 30-60 minutes ...
git commit -m "Add: DocumentCard health score visualization"
# ... work for 30-60 minutes ...
git commit -m "Add: DocumentCard status badges"
# ... end of day ...
git push origin feature/document-cards
```

---

# PART 13: GitHub Collaboration Workflow

## Pull Requests (PRs)

### Creating a Pull Request

1. **Push your feature branch to GitHub**
   ```bash
   git push origin feature/approval-workflows
   ```

2. **On GitHub:**
   - Click **"Compare & pull request"** (yellow banner)
   - Or go to **Pull requests** → **"New pull request"**

3. **Fill in PR details:**
   - **Title:** "Add approval workflow UI components"
   - **Description:**
     ```markdown
     ## Changes
     - Added ApprovalWorkflowTimeline component
     - Integrated with Supabase approval_instances table
     - Added RLS policies for approval actions
     
     ## Testing
     - Tested creating approval workflows
     - Tested multi-stage approvals
     - Verified RLS isolation
     
     ## Screenshots
     (Optional: Add screenshots)
     
     ## Checklist
     - [x] Code follows Aethos Guidelines
     - [x] No console errors
     - [x] Tested in Chrome and Safari
     - [x] Updated documentation
     ```
   - **Reviewers:** (Add team members if any)
   - **Assignees:** Assign yourself
   - **Labels:** `feature`, `document-control`, etc.

4. **Create pull request**

### Reviewing a Pull Request

1. **Go to Pull requests tab**
2. **Click on PR to review**
3. **Review changes:**
   - Click **"Files changed"**
   - Add comments on specific lines (click line number)
   - Approve or request changes
4. **Merge when ready:**
   - Click **"Merge pull request"**
   - Confirm merge
   - Delete branch (optional but recommended)

---

# PART 14: Emergency Procedures

## 🚨 Scenario: "I Committed .env File!"

```bash
# STEP 1: Remove from Git history (IMMEDIATE)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# STEP 2: Force push to GitHub (overwrites history)
git push origin --force --all

# STEP 3: Rotate ALL secrets immediately!
# - Generate new Supabase keys
# - Generate new OpenAI API key
# - Generate new Microsoft client secret
# - Update .env with new keys
# - Update Vercel environment variables
```

**⚠️ This is why .gitignore is CRITICAL!**

## 🚨 Scenario: "I Deleted Everything!"

```bash
# If committed:
git reset --hard HEAD

# If pushed to GitHub:
git clone https://github.com/YOUR-USERNAME/aethos-platform.git aethos-recovery
cd aethos-recovery
npm install
# Copy .env from backup
```

## 🚨 Scenario: "Production is Broken!"

```bash
# Option 1: Revert last commit
git checkout main
git revert HEAD
git push origin main

# Option 2: Roll back to last known good commit
git checkout main
git reset --hard v1.0.0  # or commit hash
git push origin main --force

# Option 3: Use Vercel rollback
# Go to Vercel dashboard → Deployments → Find working deployment → "Promote to Production"
```

---

# PART 15: Verification Checklist

After completing this guide, verify:

## ✅ Local Setup

- [ ] Git installed (`git --version`)
- [ ] Git configured (`git config --list`)
- [ ] `.gitignore` file created
- [ ] `.env` NOT in Git (`git status` should not show `.env`)
- [ ] Repository initialized (`git log` shows commits)

## ✅ GitHub Setup

- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Local repository connected to GitHub (`git remote -v`)
- [ ] Code pushed to GitHub (visit repository URL)
- [ ] Branches visible on GitHub (`main` and `develop`)

## ✅ Vercel Integration

- [ ] Vercel connected to GitHub repository
- [ ] Environment variables added to Vercel
- [ ] Auto-deploy working (push triggers deployment)
- [ ] Preview URLs generated for branches

## ✅ Workflow

- [ ] Can create feature branch
- [ ] Can commit and push
- [ ] Can merge to develop
- [ ] Can create pull request
- [ ] Can tag releases

---

# PART 16: Next Steps

Now that GitHub is set up:

1. **✅ Immediate (Today):**
   - Create `develop` branch
   - Create feature branch for current work
   - Commit current changes
   - Push to GitHub
   - Verify Vercel auto-deploy works

2. **✅ This Week:**
   - Set up branch protection on `main`
   - Create your first Pull Request
   - Tag your first release (v1.0.0)
   - Add collaborators (if any)

3. **✅ Ongoing:**
   - Commit daily
   - Push daily (backup!)
   - Use feature branches for new work
   - Merge to `develop` when feature is done
   - Merge to `main` when ready for production
   - Tag releases when deploying major updates

---

# PART 17: Resources

## Official Documentation

- **Git:** [git-scm.com/doc](https://git-scm.com/doc)
- **GitHub:** [docs.github.com](https://docs.github.com)
- **Vercel Git Integration:** [vercel.com/docs/git](https://vercel.com/docs/git)

## Learning Resources

- **Interactive Git Tutorial:** [learngitbranching.js.org](https://learngitbranching.js.org)
- **GitHub Skills:** [skills.github.com](https://skills.github.com)
- **Git Cheat Sheet:** [education.github.com/git-cheat-sheet-education.pdf](https://education.github.com/git-cheat-sheet-education.pdf)

## Aethos-Specific Docs

- **Architecture:** `/docs/2-ARCHITECTURE/SIMPLIFIED_ARCHITECTURE.md`
- **Standards:** `/docs/3-standards/README.md`
- **Guidelines:** `/guidelines/Guidelines.md`
- **Deployment:** `/docs/PRODUCTION_DEPLOYMENT_GUIDE.md`

---

# PART 18: Quick Start Commands

## Daily Development

```bash
# Start your day
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature

# Work on feature...
# (make changes, test, repeat)

# Commit your work
git add .
git commit -m "Add: My new feature description"
git push origin feature/my-new-feature

# End of day - make sure everything is pushed
git push origin feature/my-new-feature
```

## Merging to Develop

```bash
git checkout develop
git pull origin develop
git merge feature/my-new-feature
git push origin develop
# ✅ Auto-deploys to staging.aethos.com
```

## Releasing to Production

```bash
git checkout main
git pull origin main
git merge develop
git tag -a v1.1.0 -m "Release v1.1.0: New features"
git push origin main
git push origin v1.1.0
# ✅ Auto-deploys to app.aethos.com
```

---

# 🎉 Congratulations!

You now have:

✅ **Git installed and configured**  
✅ **GitHub account with repository**  
✅ **Code safely backed up in the cloud**  
✅ **Version control and history tracking**  
✅ **Auto-deployment to Vercel**  
✅ **Professional development workflow**  
✅ **Disaster recovery capability**  
✅ **Collaboration infrastructure**  

**Your code is now safe, tracked, and deployable!**

---

**Remember:**
- 🔴 **Never commit `.env` files**
- 🟢 **Commit and push daily**
- 🔵 **Use feature branches**
- 🟡 **Test before merging to `main`**

---

**Status:** ✅ Production Ready  
**Last Updated:** April 6, 2026  
**Version:** 1.0  
**Estimated Setup Time:** 20-30 minutes  

---

**Need Help?**
- 📚 [Git Documentation](https://git-scm.com/doc)
- 💬 [GitHub Community](https://github.community)
- 🔧 [Vercel Support](https://vercel.com/support)
