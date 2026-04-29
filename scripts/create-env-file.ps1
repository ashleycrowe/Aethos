# ============================================================================
# Aethos Environment File Creator
# ============================================================================

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  AETHOS ENVIRONMENT FILE CREATOR" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$envPath = Join-Path $projectRoot ".env"

if (Test-Path $envPath) {
    Write-Host "[!] WARNING: .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (yes/no)"
    if ($overwrite -ne "yes") {
        Write-Host "[-] Cancelled. Existing .env file preserved." -ForegroundColor Red
        exit 0
    }
}

Write-Host "STEP 1: Core Configuration" -ForegroundColor Yellow
Write-Host ""
$VITE_SUPABASE_URL = Read-Host "  Supabase URL (https://xxxxx.supabase.co)"
$VITE_SUPABASE_ANON_KEY = Read-Host "  Supabase Anon Key (starts with eyJ)"
$VITE_MICROSOFT_CLIENT_ID = Read-Host "  Microsoft Client ID"
$VITE_MICROSOFT_TENANT_ID = Read-Host "  Microsoft Tenant ID"

Write-Host ""
Write-Host "STEP 2: Optional Features" -ForegroundColor Yellow
$enableAI = Read-Host "Enable AI+ Features? (yes/no)"
$OPENAI_API_KEY = ""
$ENABLE_AI_FEATURES = "false"

if ($enableAI -eq "yes") {
    $OPENAI_API_KEY = Read-Host "  OpenAI API Key (sk-...)"
    $ENABLE_AI_FEATURES = "true"
}

$envContent = @"
# AETHOS ENVIRONMENT CONFIGURATION
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# Core Services
VITE_SUPABASE_URL=$VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
VITE_MICROSOFT_CLIENT_ID=$VITE_MICROSOFT_CLIENT_ID
VITE_MICROSOFT_TENANT_ID=$VITE_MICROSOFT_TENANT_ID
API_BASE_URL=http://localhost:3000

# AI Features
OPENAI_API_KEY=$OPENAI_API_KEY
ENABLE_AI_FEATURES=$ENABLE_AI_FEATURES

# Development
NODE_ENV=development
DEBUG=true
"@

$envContent | Out-File -FilePath $envPath -Encoding UTF8
Write-Host ""
Write-Host "[+] SUCCESS: .env file created at $envPath" -ForegroundColor Green
Write-Host "===========================================================" -ForegroundColor Green