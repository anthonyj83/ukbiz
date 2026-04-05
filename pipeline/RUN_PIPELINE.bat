@echo off
title UK Business Intelligence Pipeline
echo ============================================
echo   UK Business Intelligence Pipeline
echo ============================================
echo.
echo This will process companies.csv and generate
echo all the data files for your website.
echo.
echo DO NOT close this window while it is running.
echo It will take 5-15 minutes.
echo.

cd /d "%~dp0"

if not exist "companies.csv" (
    echo ERROR: companies.csv not found in this folder.
    echo.
    echo Please download the latest Companies House file,
    echo rename it to companies.csv, and place it here.
    echo.
    pause
    exit
)

echo Starting pipeline...
echo.
python pipeline.py

echo.
echo ============================================
if %errorlevel% == 0 (
    echo   SUCCESS! Data files have been generated.
    echo   You can now run RUN_WEBSITE.bat
) else (
    echo   Something went wrong. Screenshot this
    echo   window and send it to get help.
)
echo ============================================
echo.
pause
