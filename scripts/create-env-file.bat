@echo off
REM ============================================================================
REM Aethos Environment File Creator (Bypass Wrapper)
REM ============================================================================

echo.
echo ============================================================
echo   AETHOS ENVIRONMENT FILE CREATOR
echo ============================================================
echo.

PowerShell -ExecutionPolicy Bypass -File "%~dp0create-env-file.ps1"

echo.
pause
