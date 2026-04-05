@echo off
title Deploy to Live Website
echo ============================================
echo   Deploying to Live Website
echo ============================================
echo.
echo This pushes your latest data to GitHub.
echo Vercel will automatically update your live site.
echo.

cd /d "%~dp0"

git add .
git commit -m "Monthly data refresh"
git push

echo.
echo ============================================
if %errorlevel% == 0 (
    echo   SUCCESS! Your live site will update in
    echo   2-3 minutes on Vercel.
) else (
    echo   Something went wrong. Make sure you have
    echo   set up Git and GitHub first.
)
echo ============================================
echo.
pause
