@echo off
title UK Business Finder - Local Website
echo ============================================
echo   UK Business Finder - Starting Website
echo ============================================
echo.
echo Once started, open your browser and go to:
echo.
echo      http://localhost:3000
echo.
echo To stop the website, close this window.
echo.

cd /d "%~dp0\..\web"

if not exist "node_modules" (
    echo Installing dependencies for the first time...
    echo This only happens once and takes 1-2 minutes.
    echo.
    call npm install
)

echo Starting website...
echo.
call npm run dev
