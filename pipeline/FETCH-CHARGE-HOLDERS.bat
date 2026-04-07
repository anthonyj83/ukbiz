@echo off
echo ============================================================
echo   Charge Holder Enrichment Pipeline
echo   This will run in the background fetching charge holder
echo   names from the Companies House API.
echo.
echo   You can close this window at any time - progress is saved.
echo   Just run this again to resume.
echo ============================================================
echo.
cd /d "%~dp0"
python fetch_charge_holders.py
echo.
pause
