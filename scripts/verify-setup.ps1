# ============================================================================
# Aethos Setup Verification Script (ASCII Version)
# ============================================================================

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  AETHOS SETUP VERIFICATION" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

$passCount = 0
$failCount = 0

function Test-Status {
    param([string]$Name, [bool]$Passed, [string]$Msg = "")
    if ($Passed) {
        Write-Host "  [+] PASS: $Name" -ForegroundColor Green
        if ($Msg) { Write-Host "      $Msg" -ForegroundColor Gray }
        $script:passCount++
    } else {
        Write-Host "  [x] FAIL: $Name" -ForegroundColor Red
        if ($Msg) { Write-Host "      $Msg" -ForegroundColor Red }
        $script:failCount++
    }
}

# 1. Project Structure
Write-Host "CHECK 1: Project Files" -ForegroundColor Yellow
Test-Status "package.json" (Test-Path (Join-Path $projectRoot "package.json"))
Test-Status ".env file" (Test-Path (Join-Path $projectRoot ".env"))

# 2. Environment Variables
Write-Host ""
Write-Host "CHECK 2: Configuration" -ForegroundColor Yellow
if (Test-Path (Join-Path $projectRoot ".env")) {
    $envContent = Get-Content (Join-Path $projectRoot ".env") -Raw
    Test-Status "Supabase URL" ($envContent -match "VITE_SUPABASE_URL=http")
    Test-Status "Supabase Key" ($envContent -match "VITE_SUPABASE_ANON_KEY=eyJ")
}

# 3. Supabase Connection
Write-Host ""
Write-Host "CHECK 3: Database Connection" -ForegroundColor Yellow
try {
    # Extract URL and Key from .env
    $envLines = Get-Content (Join-Path $projectRoot ".env")
    $url = ($envLines | Select-String "VITE_SUPABASE_URL=").ToString().Split("=")[1].Trim()
    $key = ($envLines | Select-String "VITE_SUPABASE_ANON_KEY=").ToString().Split("=")[1].Trim()

    $headers = @{ "apikey" = $key; "Authorization" = "Bearer $key" }
    $resp = Invoke-RestMethod -Uri "$url/rest/v1/" -Headers $headers -Method Get -TimeoutSec 5 -ErrorAction Stop
    Test-Status "Supabase Ping" $true "Connected to $url"
} catch {
    Test-Status "Supabase Ping" $false "Could not connect to database"
}

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  VERIFICATION COMPLETE" -ForegroundColor Cyan
Write-Host "  Passed: $passCount | Failed: $failCount" -ForegroundColor Yellow
Write-Host "===========================================================" -ForegroundColor Cyan

if ($failCount -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: You are ready to start development!" -ForegroundColor Green
    Write-Host "Next Step: Type 'pnpm dev' or 'npm run dev' to launch." -ForegroundColor Cyan
}