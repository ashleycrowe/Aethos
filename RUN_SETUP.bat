@echo off
REM ============================================================================
REM AETHOS COMPLETE SETUP - DOUBLE-CLICK THIS FILE!
REM ============================================================================
REM This is the easiest way to run the setup wizard.
REM No PowerShell security issues - just double-click!
REM ============================================================================

cd /d "%~dp0"

echo.
echo ============================================================
echo   AETHOS COMPLETE SETUP WIZARD
echo ============================================================
echo.
echo Location: %CD%
echo.
echo Starting setup in 3 seconds...
echo (Press Ctrl+C to cancel)
echo.

timeout /t 3 /nobreak >nul

PowerShell -ExecutionPolicy Bypass -File "%~dp0scripts\setup-all.ps1"

echo.
echo ============================================================
echo   Setup completed!
echo ============================================================
echo.
pause
