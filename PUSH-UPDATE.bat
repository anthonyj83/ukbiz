@echo off
echo.
echo ========================================
echo   UKbiz - Push Updates to Vercel
echo ========================================
echo.

cd /d "%~dp0"

echo Adding split folders to .gitignore...
echo web/public/data/ir-meta/ >> .gitignore
echo web/public/data/ir-pages/ >> .gitignore

echo.
echo Removing any cached split files from git...
git rm -r --cached web/public/data/ir-meta 2>nul
git rm -r --cached web/public/data/ir-pages 2>nul

echo.
echo Adding all changes...
git add -A

echo.
echo Committing...
git commit -m "Split data and add pagination"

echo.
echo Pushing to GitHub...
git push

echo.
echo ========================================
echo   Done! Check Vercel for the build.
echo ========================================
echo.
pause
