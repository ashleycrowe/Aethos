@echo off
REM ============================================================================
REM Aethos Setup Verification (Bypass Wrapper)
REM ============================================================================

echo.
echo ============================================================
echo   AETHOS SETUP VERIFICATION
echo ============================================================
echo.

PowerShell -ExecutionPolicy Bypass -File "%~dp0verify-setup.ps1"

echo.
pause
