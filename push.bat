@echo off
echo ========================================================
echo Pushing Portfolio to https://github.com/Ramadeviku/Ramadevi.github.io.git
echo ========================================================
cd /d "%~dp0"

echo [1/5] Initializing Git repository...
git init

echo [2/5] Setting default branch to main...
git branch -M main

echo [3/5] Configuring remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/Ramadeviku/Ramadevi.github.io.git

echo [4/5] Staging and committing files...
git add .
git commit -m "Deploy Super UI-Rich Portfolio for Rama Devi"

echo [5/5] Pushing to GitHub (main branch)...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo SUCCESS! Portfolio pushed to GitHub Pages repository.
    echo Your site will be live shortly at:
    echo https://ramadeviku.github.io/
    echo ========================================================
) else (
    echo.
    echo [NOTE] If the remote has existing commits or requires force push, try:
    echo git push -u origin main --force
)
echo.
pause
