# ============================================================================
# Aethos Documentation Cleanup Script (Safe Version)
# ============================================================================

Write-Host ""
Write-Host "==========================================================="
Write-Host "  AETHOS DOCUMENTATION CLEANUP"
Write-Host "==========================================================="
Write-Host ""
Write-Host "This script will delete obsolete documentation files." -ForegroundColor Yellow
Write-Host ""

$continue = Read-Host "Continue with cleanup? (yes/no)"

if ($continue -ne "yes") {
    Write-Host "Cleanup cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "Starting cleanup..." -ForegroundColor Yellow
Write-Host ""

$deletedCount = 0

# List of all files to be removed
$filesToDelete = @(
    # Phase 1: Summary Files
    "CLEANUP_COMPLETE_SUMMARY.md",
    "CODEX_READY_SUMMARY.md",
    "COMPLETE_SUMMARY.md",
    "DESIGN_GUIDE_UPDATE_SUMMARY.md",
    "MASTER_DESIGN_GUIDE_SUMMARY.md",
    "docs\BACKEND_COMPLETE_SUMMARY.md",
    "docs\DEMO_IMPROVEMENTS_SUMMARY.md",
    "docs\DOCUMENTATION_CLEANUP_SUMMARY.md",
    "docs\TAG_MANAGEMENT_COMPLETE_UI_SUMMARY.md",
    "docs\V1_V4_IMPLEMENTATION_SUMMARY.md",
    "docs\VERSION_FILTERING_SUMMARY.md",
    
    # Phase 2: Temp/Session Files
    "AMPERSAND_FIXES_COMPLETE.md",
    "AUTOMATION_SCRIPTS_READY.md",
    "BATCH_FILES_READY.md",
    "FINAL_REORG_STATUS.md",
    "FIX_DIGITAL_SIGNATURE.md",
    "FIX_EXECUTION_POLICY.md",
    "FRIEND_ONBOARDING_PACKAGE.md",
    "HANDOFF_READINESS_ASSESSMENT.md",
    "NAVIGATION_CONSOLIDATION_COMPLETE.md",
    "POWERSHELL_FIXES_APPLIED.md",
    "PRIORITY_1_ACTIONS_COMPLETE.md",
    "QUICK_CLEANUP_GUIDE.md",
    "REORGANIZATION_PLAN.md",
    "REORGANIZATION_STATUS.md",
    "SYNTAX_FIXED.md",
    "TASKS.md",
    "TEAM_REVIEW_PACKAGE.md",
    "docs\HOW_TO_FIND_DOCUMENTS.md",
    "docs\OUTSTANDING_ITEMS_ASSESSMENT.md",
    "docs\DOCUMENT_CONTROL_FIXED.md",
    "docs\DOCUMENT_CONTROL_IMPLEMENTATION.md",
    "docs\DOCUMENT_CONTROL_ACCESS_GUIDE.md",

    # Phase 3: Obsolete/Superseded
    "docs\AETHOS_V1_SPEC.md",
    "docs\BACKEND_IMPLEMENTATION_PLAN.md",
    "docs\BACKEND_SETUP_GUIDE.md",
    "docs\CONSOLIDATED_STANDARDS.md",
    "docs\QUICK_START_CHECKLIST.md",
    "docs\GITHUB_WORKFLOW_VISUAL_GUIDE.md",
    "docs\GITHUB_COMPLETE_SETUP_GUIDE.md",
    "docs\PRODUCTION_DEPLOYMENT_GUIDE.md",
    "docs\TAG_MANAGEMENT_QUICK_DEMO_GUIDE.md",
    "docs\VERSION_TESTING_GUIDE.md",
    "docs\V1_TESTING_INSTRUCTIONS.md",
    "docs\V1_BUILD_STATUS.md",
    "docs\V1_IMPLEMENTATION_ROADMAP.md",
    "docs\UX_AUDIT_AND_RECOMMENDATIONS.md",
    "docs\ORACLE_SEARCH_PERSONAS.md",

    # Phase 4: Consolidated
    "START_HERE.md",
    "SETUP_QUICKSTART.md",
    "QUICK_START_GUIDE.md",
    "EASIEST_SETUP_METHOD.md",
    "GITHUB_SETUP_QUICKSTART.md",
    "READ_ME_FIRST.md",

    # Phase 6: Cleanup Docs
    "DOCUMENTATION_CLEANUP_ROADMAP.md",
    "CLEANUP_CHECKLIST.md",
    "AGGRESSIVE_CLEANUP_PLAN.md",
    "FINAL_CLEANUP_CHECKLIST.md"
)

foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "[OK] Deleted: $file" -ForegroundColor Green
        $deletedCount++
    }
}

# Special Phase 5: Directory Removal
if (Test-Path "src\standards") {
    Remove-Item -Recurse -Force "src\standards"
    Write-Host "[OK] Deleted: src\standards folder" -ForegroundColor Green
    $deletedCount++
}

Write-Host ""
Write-Host "==========================================================="
Write-Host "  CLEANUP COMPLETE: $deletedCount files removed." -ForegroundColor Green
Write-Host "==========================================================="