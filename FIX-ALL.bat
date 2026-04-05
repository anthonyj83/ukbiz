@echo off
echo.
echo ========================================
echo   UKbiz - Quick Fixes
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Adding .next to .gitignore...
echo .next >> web\.gitignore
echo web/public/data/ir-meta/ >> .gitignore
echo web/public/data/ir-pages/ >> .gitignore

echo.
echo [2/3] Removing .next from git tracking...
git rm -r --cached web/.next 2>nul

echo.
echo [3/3] Upgrading Next.js to latest patched 14.x...
cd web
call npm install next@14 --save
cd ..

echo.
echo Committing and pushing...
git add -A
git commit -m "Security fixes: upgrade Next.js, remove .next from git"
git push

echo.
echo ========================================
echo   Done! Check Vercel for the build.
echo ========================================
echo.
pause
