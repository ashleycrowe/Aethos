@echo off
REM ============================================================================
REM Aethos Setup - Complete Setup Wizard (Bypass Wrapper)
REM ============================================================================
REM This batch file runs the PowerShell script with execution policy bypass
REM No admin rights required - just double-click this file!
REM ============================================================================

echo.
echo ============================================================
echo   AETHOS COMPLETE SETUP WIZARD
echo ============================================================
echo.
echo Starting PowerShell script with bypass...
echo.

PowerShell -ExecutionPolicy Bypass -File "%~dp0setup-all.ps1"

echo.
echo ============================================================
echo   Setup wizard completed
echo ============================================================
echo.
pause
