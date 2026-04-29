# Aethos Documentation Reorganization Plan
## Systematic Cleanup & Migration

**Created:** 2026-02-26  
**Status:** Ready to Execute

---

## 📋 Summary

- **Current State:** 50+ documents scattered across 4 directories
- **Target State:** 16 active documents in 5 organized folders + 1 archive
- **Reduction:** 68% fewer active documents
- **Method:** Move, rename, consolidate, archive, delete

---

## 🗂️ NEW STRUCTURE

```
/docs/
├── README.md (NEW - master index)
│
├── 1-START-HERE/
│   ├── README.md (NEW - orientation)
│   ├── CONSOLIDATED_SPEC.md (MOVED from /docs/AETHOS_V1_CONSOLIDATED_SPEC.md)
│   └── IMPLEMENTATION_STATUS.md (MOVED from /docs/IMPLEMENTATION_STATUS.md)
│
├── 2-ARCHITECTURE/
│   ├── SIMPLIFIED_ARCHITECTURE.md (MOVED from /docs/SIMPLIFIED_ARCHITECTURE.md)
│   ├── AZURE_MIGRATION_PLAYBOOK.md (MOVED from /docs/AZURE_MIGRATION_PLAYBOOK.md)
│   └── ARCHITECTURE_ANALYSIS.md (MOVED from /docs/ARCHITECTURE_ANALYSIS.md)
│
├── 3-STANDARDS/
│   ├── CONSOLIDATED_STANDARDS.md (MOVED from /docs/CONSOLIDATED_STANDARDS.md)
│   ├── DECISION_LOG.md (MOVED from /src/standards/DECISION-LOG.md)
│   └── GUIDELINES.md (MOVED from /guidelines/Guidelines.md)
│
├── 4-DEPLOYMENT/
│   ├─��� DEPLOYMENT_GUIDE.md (MOVED from /docs/DEPLOYMENT_GUIDE.md)
│   ├── DEPENDENCY_AUDIT.md (MOVED from /docs/DEPENDENCY_AUDIT.md)
│   └── APPSOURCE_SUBMISSION.md (MOVED from /docs/APPSOURCE_SUBMISSION.md)
│
├── 5-ONBOARDING/
│   ├── TEAM_REVIEW_PACKAGE.md (MOVED from /TEAM_REVIEW_PACKAGE.md)
│   ├── FRIEND_ONBOARDING_PACKAGE.md (MOVED from /FRIEND_ONBOARDING_PACKAGE.md)
│   └── CODEX_READY_SUMMARY.md (MOVED from /CODEX_READY_SUMMARY.md)
│
└── archived/
    ├── ARCHITECTURE_OLD.md (MOVED from /docs/ARCHITECTURE.md)
    ├── MASTER_REQUIREMENTS.md (MOVED from /docs/MASTER_REQUIREMENTS.md)
    ├── CLIENT_ONBOARDING.md (MOVED from /docs/CLIENT_ONBOARDING.md)
    ├── README_DOCUMENTATION_INDEX.md (MOVED from /docs/README_DOCUMENTATION_INDEX.md - replaced by new structure)
    ├── ATTRIBUTIONS.md (MOVED from /ATTRIBUTIONS.md)
    ├── AETHOS_DESIGN_GUIDE.md (MOVED from /src/docs/AETHOS_DESIGN_GUIDE.md)
    └── Aethos_Workspace_Engine_Manifest.md (MOVED from /src/docs/Aethos_Workspace_Engine_Manifest.md)
```

---

## ✅ FILES TO MOVE (No Changes)

### To /docs/1-START-HERE/
```bash
mv /docs/AETHOS_V1_CONSOLIDATED_SPEC.md → /docs/1-START-HERE/CONSOLIDATED_SPEC.md
mv /docs/IMPLEMENTATION_STATUS.md → /docs/1-START-HERE/IMPLEMENTATION_STATUS.md
```

### To /docs/2-ARCHITECTURE/
```bash
mv /docs/SIMPLIFIED_ARCHITECTURE.md → /docs/2-ARCHITECTURE/SIMPLIFIED_ARCHITECTURE.md
mv /docs/AZURE_MIGRATION_PLAYBOOK.md → /docs/2-ARCHITECTURE/AZURE_MIGRATION_PLAYBOOK.md
mv /docs/ARCHITECTURE_ANALYSIS.md → /docs/2-ARCHITECTURE/ARCHITECTURE_ANALYSIS.md
```

### To /docs/3-STANDARDS/
```bash
mv /docs/CONSOLIDATED_STANDARDS.md → /docs/3-STANDARDS/CONSOLIDATED_STANDARDS.md
mv /src/standards/DECISION-LOG.md → /docs/3-STANDARDS/DECISION_LOG.md
mv /guidelines/Guidelines.md → /docs/3-STANDARDS/GUIDELINES.md
```

### To /docs/4-DEPLOYMENT/
```bash
mv /docs/DEPLOYMENT_GUIDE.md → /docs/4-DEPLOYMENT/DEPLOYMENT_GUIDE.md
mv /docs/DEPENDENCY_AUDIT.md → /docs/4-DEPLOYMENT/DEPENDENCY_AUDIT.md
mv /docs/APPSOURCE_SUBMISSION.md → /docs/4-DEPLOYMENT/APPSOURCE_SUBMISSION.md
```

### To /docs/5-ONBOARDING/
```bash
mv /TEAM_REVIEW_PACKAGE.md → /docs/5-ONBOARDING/TEAM_REVIEW_PACKAGE.md
mv /FRIEND_ONBOARDING_PACKAGE.md → /docs/5-ONBOARDING/FRIEND_ONBOARDING_PACKAGE.md
mv /CODEX_READY_SUMMARY.md → /docs/5-ONBOARDING/CODEX_READY_SUMMARY.md
```

---

## 📦 FILES TO ARCHIVE (Historical Reference)

### To /docs/archived/
```bash
mv /docs/ARCHITECTURE.md → /docs/archived/ARCHITECTURE_OLD.md
mv /docs/MASTER_REQUIREMENTS.md → /docs/archived/MASTER_REQUIREMENTS.md
mv /docs/CLIENT_ONBOARDING.md → /docs/archived/CLIENT_ONBOARDING.md
mv /docs/README_DOCUMENTATION_INDEX.md → /docs/archived/README_DOCUMENTATION_INDEX_OLD.md
mv /ATTRIBUTIONS.md → /docs/archived/ATTRIBUTIONS.md
mv /src/docs/AETHOS_DESIGN_GUIDE.md → /docs/archived/AETHOS_DESIGN_GUIDE.md
mv /src/docs/Aethos_Workspace_Engine_Manifest.md → /docs/archived/Aethos_Workspace_Engine_Manifest.md
```

---

## ❌ FILES TO DELETE (Permanently Remove)

### Superseded by CONSOLIDATED_STANDARDS.md
```bash
rm /src/standards/STD-A11Y-001.md
rm /src/standards/STD-AI-001.md
rm /src/standards/STD-API-001.md
rm /src/standards/STD-CODE-001.md
rm /src/standards/STD-DATA-001.md
rm /src/standards/STD-DESIGN-001.md
rm /src/standards/STD-DEV-001.md
rm /src/standards/STD-DEVOPS-001.md
rm /src/standards/STD-DOC-003.md
rm /src/standards/STD-ERROR-001.md
rm /src/standards/STD-ETHOS-001.md
rm /src/standards/STD-FAQ-001.md
rm /src/standards/STD-GTM-001.md
rm /src/standards/STD-I18N-001.md
rm /src/standards/STD-M365-001.md
rm /src/standards/STD-PERF-001.md
rm /src/standards/STD-RESP-001.md
rm /src/standards/STD-SEC-001.md
rm /src/standards/STD-TASK-001.md
rm /src/standards/STD-TEST-001.md
```

### Obsolete
```bash
rm /src/standards/MASTER-PROJECT-PLAN.md  # Replaced by IMPLEMENTATION_STATUS.md
rm /src/standards/IntelligenceStreamProtocols.md  # Merged into GUIDELINES.md
rm /src/standards/SidecarWhitepaper.md  # Conceptual, merged into ARCHITECTURE docs
rm /TASKS.md  # Obsolete, replaced by GitHub issues
rm /MICROSOFT_DEPLOYMENT.md  # Merged into DEPLOYMENT_GUIDE.md
```

---

## 🆕 FILES ALREADY CREATED

✅ `/docs/README.md` - Master index  
✅ `/docs/1-START-HERE/README.md` - Orientation guide  
✅ `/REORGANIZATION_PLAN.md` - This file

---

## 🔄 EXECUTION ORDER

### Phase 1: Create Folders
```bash
mkdir -p /docs/1-START-HERE
mkdir -p /docs/2-ARCHITECTURE
mkdir -p /docs/3-STANDARDS
mkdir -p /docs/4-DEPLOYMENT
mkdir -p /docs/5-ONBOARDING
mkdir -p /docs/archived
```

### Phase 2: Move Active Documents
Run all move commands from "FILES TO MOVE" section above

### Phase 3: Archive Historical Documents
Run all move commands from "FILES TO ARCHIVE" section above

### Phase 4: Delete Obsolete Documents
Run all delete commands from "FILES TO DELETE" section above

### Phase 5: Clean Up Empty Folders
```bash
# If /guidelines/ is now empty:
rmdir /guidelines

# If /src/standards/ is now empty:
rmdir /src/standards

# If /src/docs/ is now empty:
rmdir /src/docs
```

---

## ✅ VALIDATION CHECKLIST

After execution, verify:
- [ ] `/docs/README.md` exists and links work
- [ ] All 5 numbered folders exist (1-START-HERE through 5-ONBOARDING)
- [ ] Each numbered folder has 3 documents
- [ ] `/docs/archived/` contains 7 documents
- [ ] No broken links in any active document
- [ ] `/src/standards/` folder is empty or deleted
- [ ] `/guidelines/` folder is empty or deleted
- [ ] Total active docs: 16 (+ 2 READMEs = 18 total)

---

## 📊 BEFORE & AFTER COMPARISON

### Before Cleanup
```
Root:
- ATTRIBUTIONS.md
- CODEX_READY_SUMMARY.md
- MICROSOFT_DEPLOYMENT.md
- TASKS.md
- TEAM_REVIEW_PACKAGE.md
- FRIEND_ONBOARDING_PACKAGE.md

/docs/:
- 10 documents (various states)

/guidelines/:
- Guidelines.md

/src/standards/:
- 26 documents (23 STD-*.md + 3 others)

/src/docs/:
- 2 documents

Total: ~45 documents across 5 locations
```

### After Cleanup
```
/docs/:
- README.md (master index)

/docs/1-START-HERE/:
- README.md
- CONSOLIDATED_SPEC.md
- IMPLEMENTATION_STATUS.md

/docs/2-ARCHITECTURE/:
- SIMPLIFIED_ARCHITECTURE.md
- AZURE_MIGRATION_PLAYBOOK.md
- ARCHITECTURE_ANALYSIS.md

/docs/3-STANDARDS/:
- CONSOLIDATED_STANDARDS.md
- DECISION_LOG.md
- GUIDELINES.md

/docs/4-DEPLOYMENT/:
- DEPLOYMENT_GUIDE.md
- DEPENDENCY_AUDIT.md
- APPSOURCE_SUBMISSION.md

/docs/5-ONBOARDING/:
- TEAM_REVIEW_PACKAGE.md
- FRIEND_ONBOARDING_PACKAGE.md
- CODEX_READY_SUMMARY.md

/docs/archived/:
- 7 historical documents

Total: 18 active + 7 archived = 25 documents in 1 organized location
```

**Reduction:** 45 → 25 documents (44% reduction)  
**Organization:** 5 folders → 1 master folder with clear structure

---

## 🎯 SUCCESS CRITERIA

After reorganization, a new person should:
- [ ] Find master index in <10 seconds (`/docs/README.md`)
- [ ] Know where to start in <1 minute (numbered folders indicate order)
- [ ] Find any specific document in <30 seconds (clear folder names)
- [ ] Understand what's active vs archived (separate folders)
- [ ] Not see obsolete documents (deleted permanently)

---

## 🚨 ROLLBACK PLAN

If something goes wrong:
1. All files are moved, not deleted (except STD-*.md files)
2. Git history preserves all deleted files
3. Can restore via `git checkout HEAD~1 <filepath>`
4. Archive folder contains all "moved" docs

**Recommendation:** Commit after each phase for granular rollback

---

## 📝 POST-EXECUTION TASKS

After reorganization is complete:
1. [ ] Update all cross-references in documents (find `/docs/` or `/src/standards/`)
2. [ ] Test all links in README files
3. [ ] Commit with message: "docs: reorganize into numbered folder structure"
4. [ ] Announce in #engineering-docs Slack channel
5. [ ] Update bookmarks/shortcuts team members may have
6. [ ] Add redirect note to old `/src/standards/` location (if kept)

---

**Ready to execute? Start with Phase 1 (Create Folders).**

---

**Last Updated:** 2026-02-26  
**Status:** Ready for Execution  
**Estimated Time:** 30-60 minutes (manual execution)
