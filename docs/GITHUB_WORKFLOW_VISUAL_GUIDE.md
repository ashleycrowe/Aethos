# 🎨 GitHub Workflow - Visual Guide

**Visual reference for daily Git workflows**

---

## 🌳 Branch Structure

```
                    main (PRODUCTION)
                      ↑
                      │ merge (releases only)
                      │
                    develop (STAGING)
                      ↑
         ┌────────────┼────────────┐
         │            │            │
    feature/A    feature/B    feature/C
  (your work)   (teammate)   (future)
```

---

## 📊 Development Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ 1. START NEW FEATURE                                    │
└─────────────────────────────────────────────────────────┘
                          ↓
        git checkout develop
        git pull origin develop
        git checkout -b feature/my-feature
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 2. WORK ON FEATURE                                      │
└─────────────────────────────────────────────────────────┘
                          ↓
        Make changes to code
        Test locally
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 3. COMMIT CHANGES                                       │
└─────────────────────────────────────────────────────────┘
                          ↓
        git add .
        git commit -m "Add: Feature description"
        git push origin feature/my-feature
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 4. DEPLOY TO PREVIEW (Automatic)                        │
└─────────────────────────────────────────────────────────┘
                          ↓
        Vercel deploys to:
        preview-my-feature-abc123.vercel.app
        Test on preview URL
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 5. MERGE TO DEVELOP                                     │
└─────────────────────────────────────────────────────────┘
                          ↓
        git checkout develop
        git merge feature/my-feature
        git push origin develop
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 6. DEPLOY TO STAGING (Automatic)                        │
└─────────────────────────────────────────────────────────┘
                          ↓
        Vercel deploys to:
        staging.aethos.com
        Test on staging
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 7. RELEASE TO PRODUCTION                                │
└─────────────────────────────────────────────────────────┘
                          ↓
        git checkout main
        git merge develop
        git tag -a v1.1.0 -m "Release v1.1.0"
        git push origin main
        git push --tags
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 8. DEPLOY TO PRODUCTION (Automatic)                     │
└─────────────────────────────────────────────────────────┘
                          ↓
        Vercel deploys to:
        app.aethos.com
        ✅ LIVE FOR CUSTOMERS!
```

---

## 🔄 Git Lifecycle Visualization

```
┌──────────────┐
│ Working Dir  │  ← Your files (not tracked)
│  (Modified)  │
└──────┬───────┘
       │ git add .
       ↓
┌──────────────┐
│ Staging Area │  ← Files ready to commit
│  (Staged)    │
└──────┬───────┘
       │ git commit -m "message"
       ↓
┌──────────────┐
│ Local Repo   │  ← Committed snapshots
│ (.git folder)│
└──────┬───────┘
       │ git push origin main
       ↓
┌──────────────┐
│ GitHub Repo  │  ← Cloud backup
│ (github.com) │
└──────────────┘
```

---

## 📅 Daily Workflow Checklist

### **Morning (Start Work):**
```
☐ git checkout develop
☐ git pull origin develop
☐ git checkout -b feature/todays-work
```

### **During Work (Every 30-60 min):**
```
☐ Make changes
☐ Test locally
☐ git add .
☐ git commit -m "Add: What I did"
☐ Continue working...
```

### **Evening (End of Day):**
```
☐ git add .
☐ git commit -m "WIP: End of day progress"
☐ git push origin feature/todays-work
☐ Verify pushed on GitHub
```

### **When Feature Complete:**
```
☐ git checkout develop
☐ git pull origin develop
☐ git merge feature/todays-work
☐ git push origin develop
☐ Test on staging URL
☐ Delete feature branch (optional)
```

---

## 🎯 Commit Message Patterns

```
┌─────────────────────────────────────────────┐
│ GOOD COMMIT MESSAGES                        │
├─────────────────────────────────────────────┤
│ ✅ Add: Document approval workflow UI       │
│ ✅ Fix: Health score calculation bug        │
│ ✅ Update: Supabase RLS policies            │
│ ✅ Refactor: Extract reusable components    │
│ ✅ Docs: Add GitHub setup guide             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ BAD COMMIT MESSAGES                         │
├─────────────────────────────────────────────┤
│ ❌ updates                                   │
│ ❌ fix                                       │
│ ❌ wip                                       │
│ ❌ stuff                                     │
│ ❌ asdf                                      │
└─────────────────────────────────────────────┘
```

---

## 🏷️ Version Tagging Timeline

```
v1.0.0 ────────> v1.0.1 ────────> v1.1.0 ────────> v2.0.0
  │                │                │                │
  │                │                │                │
Initial         Bug fix        New feature      Breaking change
Release         Patch          Minor update     Major update
```

**Semantic Versioning:**
- `v1.0.0` → `v1.0.1` = Bug fix (PATCH)
- `v1.0.0` → `v1.1.0` = New feature (MINOR)
- `v1.0.0` → `v2.0.0` = Breaking change (MAJOR)

---

## 🚨 Emergency Procedures

### **Undo Last Commit (Not Pushed):**
```
git reset --soft HEAD~1  ← Keeps changes
git reset --hard HEAD~1  ← Discards changes
```

### **Undo Pushed Commit:**
```
git revert HEAD
git push origin main
```

### **Restore Deleted File:**
```
git checkout HEAD -- path/to/file.tsx
```

### **Roll Back Production:**
```
git checkout main
git reset --hard v1.0.0  ← Last known good version
git push origin main --force
```

---

## 📊 File Status Legend

```
┌──────────────────────────────────────────────┐
│ git status OUTPUT                            │
├──────────────────────────────────────────────┤
│ ?? file.tsx    ← Untracked (new file)        │
│ M  file.tsx    ← Modified (staged)           │
│  M file.tsx    ← Modified (not staged)       │
│ D  file.tsx    ← Deleted (staged)            │
│ A  file.tsx    ← Added (staged)              │
│ R  file.tsx    ← Renamed (staged)            │
└──────────────────────────────────────────────┘
```

---

## 🔍 Git Commands Quick Reference

### **Status & Info:**
```bash
git status           # What changed?
git log --oneline    # Commit history
git diff             # Show changes
git branch -a        # List all branches
```

### **Branching:**
```bash
git checkout -b feature/name   # Create & switch
git checkout main              # Switch branch
git branch -d feature/name     # Delete branch
```

### **Committing:**
```bash
git add .                      # Stage all
git add file.tsx               # Stage specific
git commit -m "message"        # Commit
git push origin main           # Push to GitHub
```

### **Syncing:**
```bash
git pull origin main           # Get latest
git fetch origin               # Check for updates
git merge develop              # Merge branch
```

### **Undoing:**
```bash
git checkout -- file.tsx       # Discard changes
git reset HEAD file.tsx        # Unstage file
git revert abc123              # Undo commit
```

---

## 🎨 Visual Branch Merge Example

**Before Merge:**
```
main:     A ─── B ─── C
                       ↑
                      HEAD
develop:           D ─── E ─── F
                                ↑
                               HEAD
```

**After `git merge develop` (on main):**
```
main:     A ─── B ─── C ─────────── G (merge commit)
                       \           /
develop:                D ─── E ─── F
                                     ↑
                                    HEAD
```

---

## 📈 Growth Timeline

```
Week 1: Initial commit
   │
   ├── Set up GitHub
   ├── Push first version
   └── ✅ Code is backed up!
   │
Week 2: Feature development
   │
   ├── Create feature branches
   ├── Daily commits
   └── ✅ Building features!
   │
Week 3: Deployment
   │
   ├── Connect to Vercel
   ├── Auto-deploy setup
   └── ✅ Live in production!
   │
Month 2: Collaboration
   │
   ├── Add team members
   ├── Pull requests
   └── ✅ Team workflow!
   │
Month 3+: Maintenance
   │
   ├── Version tagging
   ├── Release management
   └── ✅ Professional workflow!
```

---

## 🎯 Success Metrics

After 1 week, you should have:
- ✅ 5-10 commits
- ✅ 2-3 feature branches
- ✅ 1 successful merge to develop
- ✅ Code pushed to GitHub daily

After 1 month, you should have:
- ✅ 50+ commits
- ✅ 10+ feature branches
- ✅ 5+ merges to develop
- ✅ 1+ production releases (tagged)

---

## 💡 Pro Tips

### **Commit Often:**
```
🔴 Bad:  1 commit per week (lost work)
🟡 OK:   1 commit per day
🟢 Good: 3-5 commits per day
```

### **Push Daily:**
```
Every night before closing laptop:
git push origin feature/my-work
✅ Your work is backed up!
```

### **Test Before Merging:**
```
feature → develop → test → main
  ↓         ↓        ↓      ↓
 Write    Preview  Staging Production
```

---

## 📚 Reference Links

- **Full Guide:** `/docs/GITHUB_COMPLETE_SETUP_GUIDE.md`
- **Quick Start:** `/GITHUB_SETUP_QUICKSTART.md`
- **Git Docs:** [git-scm.com/doc](https://git-scm.com/doc)
- **GitHub Docs:** [docs.github.com](https://docs.github.com)

---

**Remember:**
- 🔴 Never commit `.env` files
- 🟢 Commit and push daily
- 🔵 Use feature branches
- 🟡 Test before merging to main

---

**Status:** ✅ Visual Reference Complete  
**Last Updated:** April 6, 2026
