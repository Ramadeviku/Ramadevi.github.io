Set-Location -Path $PSScriptRoot

Write-Host "Initializing Git and configuring remote..." -ForegroundColor Cyan
git init
git branch -M main

try {
    git remote remove origin 2>$null
} catch {}

git remote add origin https://github.com/Ramadeviku/Ramadevi.github.io.git

Write-Host "Staging files and creating commit..." -ForegroundColor Cyan
git add .
git commit -m "Deploy Super UI-Rich Portfolio for Rama Devi"

Write-Host "Pushing to https://github.com/Ramadeviku/Ramadevi.github.io.git..." -ForegroundColor Green
git push -u origin main
