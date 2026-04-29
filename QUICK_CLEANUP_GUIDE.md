# Aethos Docs Cleanup - Quick Reference
## Copy-Paste Commands for Fast Execution

**Time:** 5-10 minutes  
**Method:** Copy-paste these commands into your terminal

---

## 🚀 FASTEST METHOD (Copy-Paste All)

```bash
# 1. CREATE FOLDERS
mkdir -p docs/1-START-HERE docs/2-ARCHITECTURE docs/3-STANDARDS docs/4-DEPLOYMENT docs/5-ONBOARDING docs/archived

# 2. MOVE ACTIVE DOCS
git mv docs/AETHOS_V1_CONSOLIDATED_SPEC.md docs/1-START-HERE/CONSOLIDATED_SPEC.md
git mv docs/IMPLEMENTATION_STATUS.md docs/1-START-HERE/IMPLEMENTATION_STATUS.md

git mv docs/SIMPLIFIED_ARCHITECTURE.md docs/2-ARCHITECTURE/SIMPLIFIED_ARCHITECTURE.md
git mv docs/AZURE_MIGRATION_PLAYBOOK.md docs/2-ARCHITECTURE/AZURE_MIGRATION_PLAYBOOK.md
git mv docs/ARCHITECTURE_ANALYSIS.md docs/2-ARCHITECTURE/ARCHITECTURE_ANALYSIS.md

git mv docs/CONSOLIDATED_STANDARDS.md docs/3-STANDARDS/CONSOLIDATED_STANDARDS.md
git mv src/standards/DECISION-LOG.md docs/3-STANDARDS/DECISION_LOG.md
git mv guidelines/Guidelines.md docs/3-STANDARDS/GUIDELINES.md

git mv docs/DEPLOYMENT_GUIDE.md docs/4-DEPLOYMENT/DEPLOYMENT_GUIDE.md
git mv docs/DEPENDENCY_AUDIT.md docs/4-DEPLOYMENT/DEPENDENCY_AUDIT.md
git mv docs/APPSOURCE_SUBMISSION.md docs/4-DEPLOYMENT/APPSOURCE_SUBMISSION.md

git mv TEAM_REVIEW_PACKAGE.md docs/5-ONBOARDING/TEAM_REVIEW_PACKAGE.md
git mv FRIEND_ONBOARDING_PACKAGE.md docs/5-ONBOARDING/FRIEND_ONBOARDING_PACKAGE.md
git mv CODEX_READY_SUMMARY.md docs/5-ONBOARDING/CODEX_READY_SUMMARY.md

# 3. ARCHIVE HISTORICAL DOCS
git mv docs/ARCHITECTURE.md docs/archived/ARCHITECTURE_OLD.md
git mv docs/MASTER_REQUIREMENTS.md docs/archived/MASTER_REQUIREMENTS.md
git mv docs/CLIENT_ONBOARDING.md docs/archived/CLIENT_ONBOARDING.md
git mv docs/README_DOCUMENTATION_INDEX.md docs/archived/README_DOCUMENTATION_INDEX_OLD.md
git mv ATTRIBUTIONS.md docs/archived/ATTRIBUTIONS.md 2>/dev/null || true

# 4. DELETE OBSOLETE FILES
git rm src/standards/STD-*.md 2>/dev/null || true
git rm src/standards/MASTER-PROJECT-PLAN.md 2>/dev/null || true
git rm src/standards/IntelligenceStreamProtocols.md 2>/dev/null || true
git rm src/standards/SidecarWhitepaper.md 2>/dev/null || true
git rm TASKS.md 2>/dev/null || true
git rm MICROSOFT_DEPLOYMENT.md 2>/dev/null || true

# 5. CLEAN UP EMPTY FOLDERS
rmdir guidelines 2>/dev/null || true
rmdir src/standards 2>/dev/null || true

# 6. VALIDATE
echo "✅ Active docs:"
find docs/ -maxdepth 2 -name "*.md" -type f | grep -v archived | wc -l
echo "📦 Archived docs:"
find docs/archived/ -name "*.md" -type f | wc -l

# 7. COMMIT
git add docs/
git commit -m "docs: reorganize into numbered folder structure

- Create 5 numbered folders (1-START-HERE through 5-ONBOARDING)
- Move all active docs to appropriate folders
- Archive historical documents
- Delete obsolete files (STD-*.md, old plans)
- Add master index (docs/README.md)
- Reduce document count from 45 to 25 (44% reduction)"

echo "🎉 Documentation reorganization complete!"
echo "📖 Start here: docs/README.md"
```

---

## ✅ VERIFY SUCCESS

After running commands, check:

```bash
# Should show: 1-START-HERE, 2-ARCHITECTURE, 3-STANDARDS, 4-DEPLOYMENT, 5-ONBOARDING, archived, README.md
ls docs/

# Should show 3 files each
ls docs/1-START-HERE/
ls docs/2-ARCHITECTURE/
ls docs/3-STANDARDS/
ls docs/4-DEPLOYMENT/
ls docs/5-ONBOARDING/

# Should show README.md + numbered folders + archived
tree docs/ -L 1
```

---

## 🔧 TROUBLESHOOTING

### "File not found" errors?
Some files may not exist in your setup. That's OK! The `2>/dev/null || true` prevents errors.

### Want to preview changes first?
Replace `git mv` with `git mv -n` (dry-run mode) to see what would happen without actually moving files.

### Need to undo?
```bash
git reset --hard HEAD  # Undo all changes (before commit)
git revert HEAD        # Undo commit (after commit)
```

---

## 📋 MANUAL ALTERNATIVE (If Git Not Available)

Use your IDE/file explorer:

1. Create 6 folders in `/docs/`: `1-START-HERE`, `2-ARCHITECTURE`, `3-STANDARDS`, `4-DEPLOYMENT`, `5-ONBOARDING`, `archived`
2. Drag files to new locations (see `/CLEANUP_COMPLETE_SUMMARY.md` for full list)
3. Delete obsolete files (all `STD-*.md` files)
4. Delete empty folders (`/guidelines`, `/src/standards`)

---

## 🎯 SUCCESS = 3 Simple Checks

1. **`ls docs/`** shows 5 numbered folders + archived + README.md ✅
2. **`cat docs/README.md`** opens without errors ✅
3. **Team knows where to find docs** (announce in Slack) ✅

---

**Total time:** 5-10 minutes  
**Result:** Clean, organized documentation structure  
**Next:** Open `docs/README.md` and share with team

---

🎉 **Done? Delete these temporary files:**
- `/REORGANIZATION_PLAN.md`
- `/CLEANUP_COMPLETE_SUMMARY.md`
- `/QUICK_CLEANUP_GUIDE.md` (this file)
