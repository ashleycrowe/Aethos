# ============================================================================
# Aethos Setup Verification Script
# ============================================================================
# Purpose: Verify GitHub, Supabase, and environment configuration
# Platform: Windows PowerShell
# Time: ~1 minute
# ============================================================================

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  AETHOS SETUP VERIFICATION" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

$passCount = 0
$failCount = 0
$warnCount = 0

function Test-Item-Status {
    param(
        [string]$TestName,
        [bool]$Passed,
        [string]$SuccessMessage = "",
        [string]$FailMessage = "",
        [bool]$IsWarning = $false
    )

    if ($Passed) {
        Write-Host "  ✓ $TestName" -ForegroundColor Green
        if ($SuccessMessage) {
            Write-Host "    $SuccessMessage" -ForegroundColor Gray
        }
        $script:passCount++
    } else {
        if ($IsWarning) {
            Write-Host "  ⚠ $TestName" -ForegroundColor Yellow
            if ($FailMessage) {
                Write-Host "    $FailMessage" -ForegroundColor Yellow
            }
            $script:warnCount++
        } else {
            Write-Host "  ✗ $TestName" -ForegroundColor Red
            if ($FailMessage) {
                Write-Host "    $FailMessage" -ForegroundColor Red
            }
            $script:failCount++
        }
    }
}

# ============================================================================
# 1. GIT & GITHUB VERIFICATION
# ============================================================================

Write-Host "🔍 1. Git & GitHub Configuration" -ForegroundColor Yellow
Write-Host ""

# Check Git installation
$gitInstalled = $null -ne (Get-Command git -ErrorAction SilentlyContinue)
Test-Item-Status `
    -TestName "Git installed" `
    -Passed $gitInstalled `
    -SuccessMessage "Version: $(git --version)" `
    -FailMessage "Install from: https://git-scm.com/download/win"

# Check if Git repo initialized
$gitRepoExists = Test-Path (Join-Path $projectRoot ".git")
Test-Item-Status `
    -TestName "Git repository initialized" `
    -Passed $gitRepoExists `
    -FailMessage "Run: git init"

if ($gitRepoExists) {
    # Check Git config
    $gitUserName = git config user.name
    $gitUserEmail = git config user.email

    Test-Item-Status `
        -TestName "Git user.name configured" `
        -Passed (-not [string]::IsNullOrWhiteSpace($gitUserName)) `
        -SuccessMessage "Name: $gitUserName" `
        -FailMessage "Run: git config user.name 'Your Name'"

    Test-Item-Status `
        -TestName "Git user.email configured" `
        -Passed (-not [string]::IsNullOrWhiteSpace($gitUserEmail)) `
        -SuccessMessage "Email: $gitUserEmail" `
        -FailMessage "Run: git config user.email 'you@example.com'"

    # Check for remote
    try {
        $remoteUrl = git remote get-url origin 2>$null
        Test-Item-Status `
            -TestName "GitHub remote configured" `
            -Passed (-not [string]::IsNullOrWhiteSpace($remoteUrl)) `
            -SuccessMessage "Remote: $remoteUrl" `
            -FailMessage "Run: git remote add origin https://github.com/user/repo.git" `
            -IsWarning $true
    } catch {
        Test-Item-Status `
            -TestName "GitHub remote configured" `
            -Passed $false `
            -FailMessage "Run: git remote add origin https://github.com/user/repo.git" `
            -IsWarning $true
    }

    # Check commit count
    try {
        $commitCount = (git rev-list --all --count 2>$null)
        Test-Item-Status `
            -TestName "Has commits" `
            -Passed ($commitCount -gt 0) `
            -SuccessMessage "$commitCount commits" `
            -FailMessage "Run: git add . && git commit -m 'Initial commit'" `
            -IsWarning $true
    } catch {
        Test-Item-Status `
            -TestName "Has commits" `
            -Passed $false `
            -FailMessage "Run: git add . && git commit -m 'Initial commit'" `
            -IsWarning $true
    }
}

Write-Host ""

# ============================================================================
# 2. PROJECT STRUCTURE
# ============================================================================

Write-Host "🔍 2. Project Structure" -ForegroundColor Yellow
Write-Host ""

$requiredFiles = @{
    "package.json" = "NPM package configuration"
    "vite.config.ts" = "Vite build configuration"
    "src/app/App.tsx" = "Main application component"
    ".gitignore" = "Git ignore rules"
}

foreach ($file in $requiredFiles.Keys) {
    $filePath = Join-Path $projectRoot $file
    Test-Item-Status `
        -TestName "$file exists" `
        -Passed (Test-Path $filePath) `
        -SuccessMessage $requiredFiles[$file] `
        -FailMessage "Missing required file"
}

Write-Host ""

# ============================================================================
# 3. ENVIRONMENT VARIABLES
# ============================================================================

Write-Host "🔍 3. Environment Configuration" -ForegroundColor Yellow
Write-Host ""

$envPath = Join-Path $projectRoot ".env"
$envExists = Test-Path $envPath

Test-Item-Status `
    -TestName ".env file exists" `
    -Passed $envExists `
    -FailMessage "Run: .\scripts\create-env-file.ps1"

if ($envExists) {
    $envContent = Get-Content $envPath -Raw

    # Check required variables
    $requiredVars = @(
        "VITE_SUPABASE_URL",
        "VITE_SUPABASE_ANON_KEY",
        "VITE_MICROSOFT_CLIENT_ID",
        "VITE_MICROSOFT_TENANT_ID"
    )

    foreach ($var in $requiredVars) {
        $hasVar = $envContent -match "$var=.+"
        Test-Item-Status `
            -TestName "$var configured" `
            -Passed $hasVar `
            -FailMessage "Missing in .env file"
    }

    # Check if .env is in .gitignore
    $gitignorePath = Join-Path $projectRoot ".gitignore"
    if (Test-Path $gitignorePath) {
        $gitignoreContent = Get-Content $gitignorePath -Raw
        Test-Item-Status `
            -TestName ".env is in .gitignore" `
            -Passed ($gitignoreContent -match "\.env") `
            -FailMessage "⚠️  SECURITY RISK: Add .env to .gitignore!"
    }
}

Write-Host ""

# ============================================================================
# 4. SUPABASE CONNECTION
# ============================================================================

Write-Host "🔍 4. Supabase Connection" -ForegroundColor Yellow
Write-Host ""

if ($envExists) {
    # Parse .env file
    $envVars = @{}
    Get-Content $envPath | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            $envVars[$matches[1].Trim()] = $matches[2].Trim()
        }
    }

    $supabaseUrl = $envVars["VITE_SUPABASE_URL"]
    $supabaseKey = $envVars["VITE_SUPABASE_ANON_KEY"]

    if ($supabaseUrl -and $supabaseKey) {
        # Test connection
        try {
            $headers = @{
                "apikey" = $supabaseKey
                "Authorization" = "Bearer $supabaseKey"
            }

            $response = Invoke-RestMethod `
                -Uri "$supabaseUrl/rest/v1/" `
                -Headers $headers `
                -Method Get `
                -TimeoutSec 5 `
                -ErrorAction Stop

            Test-Item-Status `
                -TestName "Supabase connection" `
                -Passed $true `
                -SuccessMessage "Connected to: $supabaseUrl"

            # Try to query tenants table (check if migrations ran)
            try {
                $tenantsResponse = Invoke-RestMethod `
                    -Uri "$supabaseUrl/rest/v1/tenants?select=id&limit=1" `
                    -Headers $headers `
                    -Method Get `
                    -TimeoutSec 5 `
                    -ErrorAction Stop

                Test-Item-Status `
                    -TestName "Database tables exist" `
                    -Passed $true `
                    -SuccessMessage "Migrations completed successfully"
            } catch {
                Test-Item-Status `
                    -TestName "Database tables exist" `
                    -Passed $false `
                    -FailMessage "Run: .\scripts\setup-supabase.ps1" `
                    -IsWarning $true
            }

        } catch {
            Test-Item-Status `
                -TestName "Supabase connection" `
                -Passed $false `
                -FailMessage "Cannot connect: $($_.Exception.Message)"
        }
    } else {
        Test-Item-Status `
            -TestName "Supabase credentials configured" `
            -Passed $false `
            -FailMessage "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY"
    }
} else {
    Write-Host "  ⊘ Skipped (no .env file)" -ForegroundColor Gray
}

Write-Host ""

# ============================================================================
# 5. DEPENDENCIES
# ============================================================================

Write-Host "🔍 5. Node.js & Dependencies" -ForegroundColor Yellow
Write-Host ""

# Check Node.js
$nodeInstalled = $null -ne (Get-Command node -ErrorAction SilentlyContinue)
Test-Item-Status `
    -TestName "Node.js installed" `
    -Passed $nodeInstalled `
    -SuccessMessage "Version: $(node --version)" `
    -FailMessage "Install from: https://nodejs.org"

# Check npm/pnpm
$pnpmInstalled = $null -ne (Get-Command pnpm -ErrorAction SilentlyContinue)
Test-Item-Status `
    -TestName "pnpm installed" `
    -Passed $pnpmInstalled `
    -SuccessMessage "Version: $(pnpm --version)" `
    -FailMessage "Install: npm install -g pnpm" `
    -IsWarning $true

# Check node_modules
$nodeModulesExists = Test-Path (Join-Path $projectRoot "node_modules")
Test-Item-Status `
    -TestName "Dependencies installed" `
    -Passed $nodeModulesExists `
    -FailMessage "Run: pnpm install" `
    -IsWarning $true

Write-Host ""

# ============================================================================
# 6. MIGRATION FILES
# ============================================================================

Write-Host "🔍 6. Database Migrations" -ForegroundColor Yellow
Write-Host ""

$migrationsDir = Join-Path $projectRoot "supabase\migrations"
$migrationFiles = @(
    "001_initial_schema.sql",
    "003_v15_to_v4_features.sql"
)

foreach ($file in $migrationFiles) {
    $filePath = Join-Path $migrationsDir $file
    Test-Item-Status `
        -TestName "$file exists" `
        -Passed (Test-Path $filePath) `
        -FailMessage "Missing migration file"
}

Write-Host ""

# ============================================================================
# SUMMARY
# ============================================================================

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$totalTests = $passCount + $failCount + $warnCount

Write-Host "📊 Results:" -ForegroundColor Cyan
Write-Host "   ✓ Passed:   $passCount / $totalTests" -ForegroundColor Green
if ($warnCount -gt 0) {
    Write-Host "   ⚠ Warnings: $warnCount / $totalTests" -ForegroundColor Yellow
}
if ($failCount -gt 0) {
    Write-Host "   ✗ Failed:   $failCount / $totalTests" -ForegroundColor Red
}

Write-Host ""

# Overall status
if ($failCount -eq 0) {
    Write-Host "✅ SETUP COMPLETE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 You're ready to start developing!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    if (-not $nodeModulesExists) {
        Write-Host "  1. Install dependencies: pnpm install" -ForegroundColor Gray
    }
    Write-Host "  2. Start dev server: pnpm dev" -ForegroundColor Gray
    Write-Host "  3. Open browser: http://localhost:5173" -ForegroundColor Gray
    Write-Host ""
} elseif ($failCount -le 3) {
    Write-Host "⚠️  SETUP MOSTLY COMPLETE" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Fix the failed items above, then:" -ForegroundColor Yellow
    Write-Host "  • Re-run this script to verify" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "❌ SETUP INCOMPLETE" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix the failed items above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Quick fixes:" -ForegroundColor Yellow
    Write-Host "  • Missing .env? Run: .\scripts\create-env-file.ps1" -ForegroundColor Gray
    Write-Host "  • Supabase not set up? Run: .\scripts\setup-supabase.ps1" -ForegroundColor Gray
    Write-Host "  • No dependencies? Run: pnpm install" -ForegroundColor Gray
    Write-Host ""
}

# Exit code
if ($failCount -gt 0) {
    exit 1
} else {
    exit 0
}
