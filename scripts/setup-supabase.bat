@echo off
REM ============================================================================
REM Aethos Supabase Setup (Bypass Wrapper)
REM ============================================================================

echo.
echo ============================================================
echo   AETHOS SUPABASE DATABASE SETUP
echo ============================================================
echo.

PowerShell -ExecutionPolicy Bypass -File "%~dp0setup-supabase.ps1"

echo.
pause
