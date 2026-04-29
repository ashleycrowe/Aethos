# ============================================================================
# Aethos Environment File Creator
# ============================================================================
# Purpose: Interactive script to create .env file with proper formatting
# Platform: Windows PowerShell
# Time: ~2 minutes
# ============================================================================

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  AETHOS ENVIRONMENT FILE CREATOR" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$envPath = Join-Path $projectRoot ".env"
$envExamplePath = Join-Path $projectRoot ".env.example"

# ============================================================================
# CHECK FOR EXISTING .env FILE
# ============================================================================

if (Test-Path $envPath) {
    Write-Host "⚠️  WARNING: .env file already exists!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Current file: $envPath" -ForegroundColor Gray
    Write-Host ""
    $overwrite = Read-Host "Do you want to overwrite it? (yes/no)"

    if ($overwrite -ne "yes") {
        Write-Host "❌ Cancelled. Existing .env file preserved." -ForegroundColor Red
        exit 0
    }

    # Backup existing file
    $backupPath = "$envPath.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item $envPath $backupPath
    Write-Host "✓ Backed up existing file to: $backupPath" -ForegroundColor Green
    Write-Host ""
}

# ============================================================================
# COLLECT REQUIRED VARIABLES (V1 - MINIMUM TO RUN)
# ============================================================================

Write-Host "📝 STEP 1: Core Configuration (Required)" -ForegroundColor Yellow
Write-Host ""

# Supabase
Write-Host "🗄️  Supabase Configuration:" -ForegroundColor Cyan
Write-Host "  Get from: Supabase Dashboard → Settings → API" -ForegroundColor Gray
Write-Host ""

$VITE_SUPABASE_URL = Read-Host "  Supabase URL (https://xxxxx.supabase.co)"
$VITE_SUPABASE_ANON_KEY = Read-Host "  Supabase Anon Key (eyJ...)"

Write-Host ""

# Microsoft Entra ID
Write-Host "🔐 Microsoft Entra ID (Azure AD):" -ForegroundColor Cyan
Write-Host "  Get from: Azure Portal → App Registrations → Your App" -ForegroundColor Gray
Write-Host ""

$VITE_MICROSOFT_CLIENT_ID = Read-Host "  Microsoft Client ID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)"
$VITE_MICROSOFT_TENANT_ID = Read-Host "  Microsoft Tenant ID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)"

Write-Host ""

# ============================================================================
# OPTIONAL FEATURES
# ============================================================================

Write-Host "📝 STEP 2: Optional Features" -ForegroundColor Yellow
Write-Host ""

$enableAI = Read-Host "Enable AI+ Features (OpenAI required)? (yes/no)"

$OPENAI_API_KEY = ""
$ENABLE_AI_FEATURES = "false"

if ($enableAI -eq "yes") {
    Write-Host ""
    Write-Host "🤖 OpenAI Configuration:" -ForegroundColor Cyan
    Write-Host "  Get from: platform.openai.com/api-keys" -ForegroundColor Gray
    Write-Host ""

    $OPENAI_API_KEY = Read-Host "  OpenAI API Key (sk-...)"
    $ENABLE_AI_FEATURES = "true"
}

Write-Host ""

# ============================================================================
# ADVANCED CONFIGURATION
# ============================================================================

Write-Host "📝 STEP 3: Advanced Configuration" -ForegroundColor Yellow
Write-Host ""

$showAdvanced = Read-Host "Configure advanced settings? (yes/no)"

$NODE_ENV = "development"
$DEBUG = "true"
$API_BASE_URL = "http://localhost:3000"

if ($showAdvanced -eq "yes") {
    Write-Host ""
    $NODE_ENV = Read-Host "  Environment (development/staging/production) [development]"
    if ([string]::IsNullOrWhiteSpace($NODE_ENV)) { $NODE_ENV = "development" }

    $DEBUG = Read-Host "  Enable debug logging? (true/false) [true]"
    if ([string]::IsNullOrWhiteSpace($DEBUG)) { $DEBUG = "true" }

    $API_BASE_URL = Read-Host "  API Base URL [http://localhost:3000]"
    if ([string]::IsNullOrWhiteSpace($API_BASE_URL)) { $API_BASE_URL = "http://localhost:3000" }
}

Write-Host ""

# ============================================================================
# GENERATE .env FILE
# ============================================================================

Write-Host "📄 STEP 4: Generating .env file..." -ForegroundColor Yellow

$envContent = @"
# ============================================================================
# AETHOS ENVIRONMENT CONFIGURATION
# ============================================================================
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# ⚠️  NEVER COMMIT THIS FILE TO GIT!
# ============================================================================

# ============================================================================
# CORE SERVICES (V1 - Required)
# ============================================================================

# Supabase Configuration
VITE_SUPABASE_URL=$VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Microsoft Entra ID (Azure AD) Authentication
VITE_MICROSOFT_CLIENT_ID=$VITE_MICROSOFT_CLIENT_ID
VITE_MICROSOFT_TENANT_ID=$VITE_MICROSOFT_TENANT_ID

# Application Base URL
API_BASE_URL=$API_BASE_URL

# ============================================================================
# V1.5 AI+ CONTENT INTELLIGENCE (Optional)
# ============================================================================

# OpenAI Configuration
OPENAI_API_KEY=$OPENAI_API_KEY

# AI+ Feature Flag
ENABLE_AI_FEATURES=$ENABLE_AI_FEATURES

# ============================================================================
# DEVELOPMENT & TESTING
# ============================================================================

# Environment
NODE_ENV=$NODE_ENV

# Enable debug logging
DEBUG=$DEBUG

# ============================================================================
# OPTIONAL: Add these later as needed
# ============================================================================

# Slack Integration (V2)
# SLACK_CLIENT_ID=
# SLACK_CLIENT_SECRET=

# Google Workspace Integration (V2)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=

# Box Integration (V2)
# BOX_CLIENT_ID=
# BOX_CLIENT_SECRET=

# Security
# JWT_SECRET=
# ENCRYPTION_KEY=

# Monitoring
# SENTRY_DSN=

"@

# Write file
$envContent | Out-File -FilePath $envPath -Encoding UTF8 -NoNewline

Write-Host "✓ .env file created!" -ForegroundColor Green
Write-Host ""

# ============================================================================
# VALIDATE CONFIGURATION
# ============================================================================

Write-Host "🔍 STEP 5: Validating Configuration..." -ForegroundColor Yellow
Write-Host ""

$errors = @()

# Check Supabase URL format
if ($VITE_SUPABASE_URL -notmatch "^https://.*\.supabase\.co$") {
    $errors += "⚠️  Supabase URL format looks incorrect"
}

# Check Supabase key format
if ($VITE_SUPABASE_ANON_KEY -notmatch "^eyJ") {
    $errors += "⚠️  Supabase Anon Key should start with 'eyJ'"
}

# Check Microsoft IDs format (UUID)
if ($VITE_MICROSOFT_CLIENT_ID -notmatch "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$") {
    $errors += "⚠️  Microsoft Client ID should be a valid UUID"
}

if ($VITE_MICROSOFT_TENANT_ID -notmatch "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$") {
    $errors += "⚠️  Microsoft Tenant ID should be a valid UUID"
}

# Check OpenAI key if AI enabled
if ($ENABLE_AI_FEATURES -eq "true" -and $OPENAI_API_KEY -notmatch "^sk-") {
    $errors += "⚠️  OpenAI API Key should start with 'sk-'"
}

if ($errors.Count -gt 0) {
    Write-Host "⚠️  VALIDATION WARNINGS:" -ForegroundColor Yellow
    foreach ($error in $errors) {
        Write-Host "   $error" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "   You can continue, but some features may not work correctly." -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "✓ All values look correct!" -ForegroundColor Green
    Write-Host ""
}

# ============================================================================
# SECURITY CHECK
# ============================================================================

Write-Host "🔒 STEP 6: Security Check..." -ForegroundColor Yellow

# Check if .gitignore exists and contains .env
$gitignorePath = Join-Path $projectRoot ".gitignore"

if (Test-Path $gitignorePath) {
    $gitignoreContent = Get-Content $gitignorePath -Raw

    if ($gitignoreContent -match "\.env") {
        Write-Host "✓ .gitignore is configured to exclude .env files" -ForegroundColor Green
    } else {
        Write-Host "❌ WARNING: .env is NOT in .gitignore!" -ForegroundColor Red
        Write-Host "   Your secrets could be committed to Git!" -ForegroundColor Red
        Write-Host ""
        Write-Host "   Fix this NOW by adding '.env' to .gitignore" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ WARNING: No .gitignore file found!" -ForegroundColor Red
    Write-Host "   Create .gitignore before committing to Git!" -ForegroundColor Red
}

Write-Host ""

# ============================================================================
# COMPLETION
# ============================================================================

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ ENVIRONMENT FILE CREATED!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📄 File Location:" -ForegroundColor Cyan
Write-Host "   $envPath" -ForegroundColor Gray
Write-Host ""
Write-Host "📋 What's Configured:" -ForegroundColor Cyan
Write-Host "   ✓ Supabase connection" -ForegroundColor Gray
Write-Host "   ✓ Microsoft Entra ID authentication" -ForegroundColor Gray
if ($ENABLE_AI_FEATURES -eq "true") {
    Write-Host "   ✓ OpenAI AI+ features" -ForegroundColor Gray
}
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Run: .\scripts\verify-setup.ps1" -ForegroundColor Gray
Write-Host "   2. Test your configuration" -ForegroundColor Gray
Write-Host "   3. Start development: npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  IMPORTANT: Never commit .env to Git!" -ForegroundColor Red
Write-Host ""
