#!/bin/bash
# Aethos Documentation Cleanup - Automated Execution Script
# Run this script to reorganize all documentation

set -e  # Exit on error

echo "🚀 Starting Aethos Documentation Cleanup..."
echo ""

# ============================================================================
# PHASE 1: CREATE FOLDER STRUCTURE
# ============================================================================
echo "📁 Phase 1: Creating folder structure..."

mkdir -p docs/1-START-HERE
mkdir -p docs/2-ARCHITECTURE
mkdir -p docs/3-STANDARDS
mkdir -p docs/4-DEPLOYMENT
mkdir -p docs/5-ONBOARDING
mkdir -p docs/archived

echo "✅ Folders created"
echo ""

# ============================================================================
# PHASE 2: MOVE ACTIVE DOCUMENTS
# ============================================================================
echo "📦 Phase 2: Moving active documents..."

# To 1-START-HERE/
echo "  → Moving to 1-START-HERE/..."
git mv docs/AETHOS_V1_CONSOLIDATED_SPEC.md docs/1-START-HERE/CONSOLIDATED_SPEC.md 2>/dev/null || mv docs/AETHOS_V1_CONSOLIDATED_SPEC.md docs/1-START-HERE/CONSOLIDATED_SPEC.md
git mv docs/IMPLEMENTATION_STATUS.md docs/1-START-HERE/IMPLEMENTATION_STATUS.md 2>/dev/null || mv docs/IMPLEMENTATION_STATUS.md docs/1-START-HERE/IMPLEMENTATION_STATUS.md

# To 2-ARCHITECTURE/
echo "  → Moving to 2-ARCHITECTURE/..."
git mv docs/SIMPLIFIED_ARCHITECTURE.md docs/2-ARCHITECTURE/SIMPLIFIED_ARCHITECTURE.md 2>/dev/null || mv docs/SIMPLIFIED_ARCHITECTURE.md docs/2-ARCHITECTURE/SIMPLIFIED_ARCHITECTURE.md
git mv docs/AZURE_MIGRATION_PLAYBOOK.md docs/2-ARCHITECTURE/AZURE_MIGRATION_PLAYBOOK.md 2>/dev/null || mv docs/AZURE_MIGRATION_PLAYBOOK.md docs/2-ARCHITECTURE/AZURE_MIGRATION_PLAYBOOK.md
git mv docs/ARCHITECTURE_ANALYSIS.md docs/2-ARCHITECTURE/ARCHITECTURE_ANALYSIS.md 2>/dev/null || mv docs/ARCHITECTURE_ANALYSIS.md docs/2-ARCHITECTURE/ARCHITECTURE_ANALYSIS.md

# To 3-STANDARDS/
echo "  → Moving to 3-STANDARDS/..."
git mv docs/CONSOLIDATED_STANDARDS.md docs/3-STANDARDS/CONSOLIDATED_STANDARDS.md 2>/dev/null || mv docs/CONSOLIDATED_STANDARDS.md docs/3-STANDARDS/CONSOLIDATED_STANDARDS.md
git mv src/standards/DECISION-LOG.md docs/3-STANDARDS/DECISION_LOG.md 2>/dev/null || mv src/standards/DECISION-LOG.md docs/3-STANDARDS/DECISION_LOG.md
git mv guidelines/Guidelines.md docs/3-STANDARDS/GUIDELINES.md 2>/dev/null || mv guidelines/Guidelines.md docs/3-STANDARDS/GUIDELINES.md

# To 4-DEPLOYMENT/
echo "  → Moving to 4-DEPLOYMENT/..."
git mv docs/DEPLOYMENT_GUIDE.md docs/4-DEPLOYMENT/DEPLOYMENT_GUIDE.md 2>/dev/null || mv docs/DEPLOYMENT_GUIDE.md docs/4-DEPLOYMENT/DEPLOYMENT_GUIDE.md
git mv docs/DEPENDENCY_AUDIT.md docs/4-DEPLOYMENT/DEPENDENCY_AUDIT.md 2>/dev/null || mv docs/DEPENDENCY_AUDIT.md docs/4-DEPLOYMENT/DEPENDENCY_AUDIT.md
git mv docs/APPSOURCE_SUBMISSION.md docs/4-DEPLOYMENT/APPSOURCE_SUBMISSION.md 2>/dev/null || mv docs/APPSOURCE_SUBMISSION.md docs/4-DEPLOYMENT/APPSOURCE_SUBMISSION.md

# To 5-ONBOARDING/
echo "  → Moving to 5-ONBOARDING/..."
git mv TEAM_REVIEW_PACKAGE.md docs/5-ONBOARDING/TEAM_REVIEW_PACKAGE.md 2>/dev/null || mv TEAM_REVIEW_PACKAGE.md docs/5-ONBOARDING/TEAM_REVIEW_PACKAGE.md
git mv FRIEND_ONBOARDING_PACKAGE.md docs/5-ONBOARDING/FRIEND_ONBOARDING_PACKAGE.md 2>/dev/null || mv FRIEND_ONBOARDING_PACKAGE.md docs/5-ONBOARDING/FRIEND_ONBOARDING_PACKAGE.md
git mv CODEX_READY_SUMMARY.md docs/5-ONBOARDING/CODEX_READY_SUMMARY.md 2>/dev/null || mv CODEX_READY_SUMMARY.md docs/5-ONBOARDING/CODEX_READY_SUMMARY.md

echo "✅ Active documents moved"
echo ""

# ============================================================================
# PHASE 3: ARCHIVE HISTORICAL DOCUMENTS
# ============================================================================
echo "📦 Phase 3: Archiving historical documents..."

git mv docs/ARCHITECTURE.md docs/archived/ARCHITECTURE_OLD.md 2>/dev/null || mv docs/ARCHITECTURE.md docs/archived/ARCHITECTURE_OLD.md
git mv docs/MASTER_REQUIREMENTS.md docs/archived/MASTER_REQUIREMENTS.md 2>/dev/null || mv docs/MASTER_REQUIREMENTS.md docs/archived/MASTER_REQUIREMENTS.md
git mv docs/CLIENT_ONBOARDING.md docs/archived/CLIENT_ONBOARDING.md 2>/dev/null || mv docs/CLIENT_ONBOARDING.md docs/archived/CLIENT_ONBOARDING.md
git mv docs/README_DOCUMENTATION_INDEX.md docs/archived/README_DOCUMENTATION_INDEX_OLD.md 2>/dev/null || mv docs/README_DOCUMENTATION_INDEX.md docs/archived/README_DOCUMENTATION_INDEX_OLD.md
git mv ATTRIBUTIONS.md docs/archived/ATTRIBUTIONS.md 2>/dev/null || mv ATTRIBUTIONS.md docs/archived/ATTRIBUTIONS.md
git mv src/docs/AETHOS_DESIGN_GUIDE.md docs/archived/AETHOS_DESIGN_GUIDE.md 2>/dev/null || mv src/docs/AETHOS_DESIGN_GUIDE.md docs/archived/AETHOS_DESIGN_GUIDE.md 2>/dev/null || true
git mv src/docs/Aethos_Workspace_Engine_Manifest.md docs/archived/Aethos_Workspace_Engine_Manifest.md 2>/dev/null || mv src/docs/Aethos_Workspace_Engine_Manifest.md docs/archived/Aethos_Workspace_Engine_Manifest.md 2>/dev/null || true

echo "✅ Historical documents archived"
echo ""

# ============================================================================
# PHASE 4: DELETE OBSOLETE FILES
# ============================================================================
echo "🗑️  Phase 4: Deleting obsolete files..."

# Delete 23 STD-*.md files
echo "  → Deleting STD-*.md files..."
git rm src/standards/STD-*.md 2>/dev/null || rm src/standards/STD-*.md 2>/dev/null || true

# Delete other obsolete files
echo "  → Deleting obsolete planning docs..."
git rm src/standards/MASTER-PROJECT-PLAN.md 2>/dev/null || rm src/standards/MASTER-PROJECT-PLAN.md 2>/dev/null || true
git rm src/standards/IntelligenceStreamProtocols.md 2>/dev/null || rm src/standards/IntelligenceStreamProtocols.md 2>/dev/null || true
git rm src/standards/SidecarWhitepaper.md 2>/dev/null || rm src/standards/SidecarWhitepaper.md 2>/dev/null || true
git rm TASKS.md 2>/dev/null || rm TASKS.md 2>/dev/null || true
git rm MICROSOFT_DEPLOYMENT.md 2>/dev/null || rm MICROSOFT_DEPLOYMENT.md 2>/dev/null || true

echo "✅ Obsolete files deleted"
echo ""

# ============================================================================
# PHASE 5: CLEAN UP EMPTY FOLDERS
# ============================================================================
echo "🧹 Phase 5: Cleaning up empty folders..."

rmdir guidelines 2>/dev/null || true
rmdir src/standards 2>/dev/null || true
rmdir src/docs 2>/dev/null || true

echo "✅ Empty folders removed"
echo ""

# ============================================================================
# PHASE 6: DELETE TEMPORARY FILES
# ============================================================================
echo "🗑️  Phase 6: Deleting temporary cleanup files..."

rm REORGANIZATION_PLAN.md 2>/dev/null || true
rm CLEANUP_COMPLETE_SUMMARY.md 2>/dev/null || true
rm QUICK_CLEANUP_GUIDE.md 2>/dev/null || true
rm EXECUTE_CLEANUP_NOW.sh 2>/dev/null || true  # Delete this script itself

echo "✅ Temporary files deleted"
echo ""

# ============================================================================
# PHASE 7: VALIDATION
# ============================================================================
echo "✅ Phase 7: Validating cleanup..."

echo ""
echo "📊 Document Count:"
echo "  Active docs: $(find docs/ -maxdepth 2 -name "*.md" -type f | grep -v archived | wc -l)"
echo "  Archived docs: $(find docs/archived/ -name "*.md" -type f 2>/dev/null | wc -l)"
echo ""

echo "📂 Folder Structure:"
ls -1 docs/ | sed 's/^/  /'
echo ""

echo "🎉 Documentation cleanup complete!"
echo ""
echo "📖 Next steps:"
echo "  1. Open docs/README.md for master index"
echo "  2. Review docs/1-START-HERE/README.md for orientation"
echo "  3. Commit changes: git add docs/ && git commit -m 'docs: reorganize structure'"
echo "  4. Announce to team in Slack"
echo ""
echo "✨ All done! Happy building! 🚀"
