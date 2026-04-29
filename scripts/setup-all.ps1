# ============================================================================
# Aethos Complete Setup - Master Script
# ============================================================================
# Purpose: Run all setup steps in sequence (interactive)
# Platform: Windows PowerShell
# Time: ~10 minutes total
# ============================================================================

param(
    [Parameter(Mandatory=$false)]
    [switch]$SkipGit,

    [Parameter(Mandatory=$false)]
    [switch]$SkipSupabase,

    [Parameter(Mandatory=$false)]
    [switch]$SkipEnv
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•" -ForegroundColor Cyan
Write-Host "  ðŸš€ AETHOS COMPLETE SETUP WIZARD" -ForegroundColor Cyan
Write-Host "â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•" -ForegroundColor Cyan
Write-Host ""
Write-Host "This wizard will guide you through:" -ForegroundColor Gray
Write-Host "  1. Git and GitHub setup" -ForegroundColor Gray
Write-Host "  2. Supabase database setup" -ForegroundColor Gray
Write-Host "  3. Environment configuration" -ForegroundColor Gray
Write-Host "  4. Verification and testing" -ForegroundColor Gray
Write-Host ""
Write-Host "â±ï¸  Estimated time: 10-15 minutes" -ForegroundColor Yellow
Write-Host ""

$continue = Read-Host "Ready to begin? (yes/no)"

if ($continue -ne "yes") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

# ============================================================================
# STEP 1: GIT AND GITHUB
# ============================================================================

if (-not $SkipGit) {
    Write-Host "â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”" -ForegroundColor Cyan
    Write-Host "  STEP 1/4: Git and GitHub Setup" -ForegroundColor Cyan
    Write-Host "â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”" -ForegroundColor Cyan
    Write-Host ""

    # Check if Git is installed
    $gitInstalled = $null -ne (Get-Command git -ErrorAction SilentlyContinue)

    if (-not $gitInstalled) {
        Write-Host "âŒ Git is not installed!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please install Git first:" -ForegroundColor Yellow
        Write-Host "  1. Download: https://git-scm.com/download/win" -ForegroundColor Gray
        Write-Host "  2. Install with default settings" -ForegroundColor Gray
        Write-Host "  3. Restart PowerShell" -ForegroundColor Gray
        Write-Host "  4. Run this script again" -ForegroundColor Gray
        Write-Host ""
        exit 1
    }

    Write-Host "âœ“ Git is installed: $(git --version)" -ForegroundColor Green
    Write-Host ""

    # Check if already a Git repo
    $gitRepoExists = Test-Path (Join-Path $projectRoot ".git")

    if ($gitRepoExists) {
        Write-Host "âœ“ Git repository already initialized" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "Initializing Git repository..." -ForegroundColor Yellow
        Push-Location $projectRoot
        git init
        git branch -m main
        Pop-Location
        Write-Host "âœ“ Git repository initialized" -ForegroundColor Green
        Write-Host ""
    }

    # Check Git config
    $gitUserName = git config user.name
    $gitUserEmail = git config user.email

    if (-not $gitUserName -or -not $gitUserEmail) {
        Write-Host "ðŸ“ Configure Git identity:" -ForegroundColor Yellow
        Write-Host ""

        if (-not $gitUserName) {
            $gitUserName = Read-Host "  Your name"
            git config --global user.name "$gitUserName"
        }

        if (-not $gitUserEmail) {
            $gitUserEmail = Read-Host "  Your email"
            git config --global user.email "$gitUserEmail"
        }

        Write-Host ""
        Write-Host "âœ“ Git configured" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "âœ“ Git user configured: $gitUserName <$gitUserEmail>" -ForegroundColor Green
        Write-Host ""
    }

    # GitHub instructions
    Write-Host "ðŸ“‹ GitHub Setup Instructions:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After this wizard completes, you'll need to:" -ForegroundColor Gray
    Write-Host "  1. Create GitHub repository: github.com/new" -ForegroundColor Gray
    Write-Host "  2. Name: aethos-platform" -ForegroundColor Gray
    Write-Host "  3. Visibility: Private" -ForegroundColor Gray
    Write-Host "  4. Then run:" -ForegroundColor Gray
    Write-Host "     git remote add origin https://github.com/YOUR-USERNAME/aethos-platform.git" -ForegroundColor Cyan
    Write-Host "     git push -u origin main" -ForegroundColor Cyan
    Write-Host ""

    $pause = Read-Host "Press Enter to continue to Supabase setup"
    Write-Host ""
}

# ============================================================================
# STEP 2: SUPABASE
# ============================================================================

if (-not $SkipSupabase) {
    Write-Host "â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”" -ForegroundColor Cyan
    Write-Host "  STEP 2/4: Supabase Database Setup" -ForegroundColor Cyan
    Write-Host "â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”" -ForegroundColor Cyan
    Write-Host ""

    Write-Host "âš ï¸  IMPORTANT: You need a Supabase project first!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "If you don't have one yet:" -ForegroundColor Gray
    Write-Host "  1. Go to: supabase.com" -ForegroundColor Gray
    Write-Host "  2. Sign up (free)" -ForegroundColor Gray
    Write-Host "  3. Create new project" -ForegroundColor Gray
    Write-Host "  4. Wait 2 minutes for provisioning" -ForegroundColor Gray
    Write-Host ""

    $hasSupabase = Read-Host "Do you have a Supabase project ready? (yes/no)"

    if ($hasSupabase -eq "yes") {
        Write-Host ""
        Write-Host "ðŸš€ Running Supabase setup..." -ForegroundColor Yellow
        Write-Host ""

        $supabaseScript = Join-Path $scriptDir "setup-supabase.ps1"
        & $supabaseScript

        if ($LASTEXITCODE -ne 0) {
            Write-Host ""
            Write-Host "âŒ Supabase setup failed!" -ForegroundColor Red
            Write-Host "   You can complete this manually later." -ForegroundColor Yellow
            Write-Host ""
        }
    } else {
        Write-Host ""
        Write-Host "âŠ˜ Skipping Supabase setup" -ForegroundColor Yellow
        Write-Host "   Run manually later: .\scripts\setup-supabase.ps1" -ForegroundColor Gray
        Write-Host ""
    }

    $pause = Read-Host "Press Enter to continue to environment setup"
    Write-Host ""
}

# ============================================================================
# STEP 3: ENVIRONMENT FILE
# ============================================================================

if (-not $SkipEnv) {
    Write-Host "â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”" -ForegroundColor Cyan
    Write-Host "  STEP 3/4: Environment Configuration" -ForegroundColor Cyan
    Write-Host "â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”" -ForegroundColor Cyan
    Write-Host ""

    $envPath = Join-Path $projectRoot ".env"
    $envExists = Test-Path $envPath

    if ($envExists) {
        Write-Host "âœ“ .env file already exists" -ForegroundColor Green
        Write-Host ""
        $recreate = Read-Host "Do you want to recreate it? (yes/no)"

        if ($recreate -eq "yes") {
            & "$scriptDir\create-env-file.ps1"
        } else {
            Write-Host "âŠ˜ Keeping existing .env file" -ForegroundColor Yellow
        }
    } else {
        Write-Host "ðŸš€ Creating .env file..." -ForegroundColor Yellow
        Write-Host ""
        & "$scriptDir\create-env-file.ps1"
    }

    Write-Host ""
    $pause = Read-Host "Press Enter to continue to verification"
    Write-Host ""
}

# ============================================================================
# STEP 4: VERIFICATION
# ============================================================================

Write-Host "â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”" -ForegroundColor Cyan
Write-Host "  STEP 4/4: Verification" -ForegroundColor Cyan
Write-Host "â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”" -ForegroundColor Cyan
Write-Host ""

Write-Host "ðŸ” Running setup verification..." -ForegroundColor Yellow
Write-Host ""

$verifyScript = Join-Path $scriptDir "verify-setup.ps1"
& $verifyScript

$verificationResult = $LASTEXITCODE

Write-Host ""
Write-Host "â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”" -ForegroundColor Cyan

# ============================================================================
# COMPLETION
# ============================================================================

Write-Host ""
Write-Host "â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•" -ForegroundColor Green
Write-Host "  ðŸŽ‰ SETUP WIZARD COMPLETE!" -ForegroundColor Green
Write-Host "â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•" -ForegroundColor Green
Write-Host ""

if ($verificationResult -eq 0) {
    Write-Host "âœ… All checks passed! You're ready to code." -ForegroundColor Green
} else {
    Write-Host "âš ï¸  Some checks failed. Review the output above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "ðŸ“‹ Final Steps:" -ForegroundColor Cyan
Write-Host ""

# GitHub reminder
$gitRemoteExists = $false
try {
    $remoteUrl = git remote get-url origin 2>$null
    $gitRemoteExists = -not [string]::IsNullOrWhiteSpace($remoteUrl)
} catch {}

if (-not $gitRemoteExists) {
    Write-Host "1ï¸âƒ£  Push to GitHub:" -ForegroundColor Yellow
    Write-Host "   â€¢ Create repo: github.com/new" -ForegroundColor Gray
    Write-Host "   â€¢ Name: aethos-platform (Private)" -ForegroundColor Gray
    Write-Host "   â€¢ Then run:" -ForegroundColor Gray
    Write-Host "     git remote add origin https://github.com/YOUR-USERNAME/aethos-platform.git" -ForegroundColor Cyan
    Write-Host "     git add ." -ForegroundColor Cyan
    Write-Host "     git commit -m 'Initial commit'" -ForegroundColor Cyan
    Write-Host "     git push -u origin main" -ForegroundColor Cyan
    Write-Host ""
}

# Dependencies
$nodeModulesExists = Test-Path (Join-Path $projectRoot "node_modules")
if (-not $nodeModulesExists) {
    Write-Host "2ï¸âƒ£  Install Dependencies:" -ForegroundColor Yellow
    Write-Host "   pnpm install" -ForegroundColor Cyan
    Write-Host ""
}

# Start coding
Write-Host "3ï¸âƒ£  Start Development:" -ForegroundColor Yellow
Write-Host "   pnpm dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "4ï¸âƒ£  Open VS Code:" -ForegroundColor Yellow
Write-Host "   code ." -ForegroundColor Cyan
Write-Host ""

Write-Host "ðŸ“š Documentation:" -ForegroundColor Cyan
Write-Host "   â€¢ README: ./README.md" -ForegroundColor Gray
Write-Host "   â€¢ Guides: ./docs/" -ForegroundColor Gray
Write-Host "   â€¢ Scripts: ./scripts/README.md" -ForegroundColor Gray
Write-Host ""

Write-Host "ðŸŽ¯ Happy coding! Build something amazing." -ForegroundColor Green
Write-Host ""
