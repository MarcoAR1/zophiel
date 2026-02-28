# Zophiel APK Build Script (Capacitor)
# Usage: Run from project root -> pwsh scripts/build-apk.ps1

$ErrorActionPreference = "Stop"

Write-Host "🔨 Step 1: Building shared package..." -ForegroundColor Cyan
pnpm --filter @zophiel/shared build
if ($LASTEXITCODE -ne 0) { throw "Shared build failed" }

Write-Host "🔨 Step 2: Building client..." -ForegroundColor Cyan
pnpm --filter @zophiel/client build
if ($LASTEXITCODE -ne 0) { throw "Client build failed" }

Write-Host "📱 Step 3: Syncing Capacitor..." -ForegroundColor Cyan
Set-Location apps/client
npx cap sync android
if ($LASTEXITCODE -ne 0) { throw "Cap sync failed" }

Write-Host "🏗️ Step 4: Building APK..." -ForegroundColor Cyan
Set-Location android
if (Test-Path "./gradlew.bat") {
    ./gradlew.bat assembleRelease
} else {
    ./gradlew assembleRelease
}
if ($LASTEXITCODE -ne 0) { throw "Gradle build failed" }

$apkPath = Get-ChildItem -Path "app/build/outputs/apk/release/*.apk" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($apkPath) {
    Write-Host "`n✅ APK built successfully!" -ForegroundColor Green
    Write-Host "📦 Path: $($apkPath.FullName)" -ForegroundColor Yellow
    
    # Copy to project root for convenience
    $destPath = Join-Path (Resolve-Path "../../..") "zophiel-release.apk"
    Copy-Item $apkPath.FullName $destPath -Force
    Write-Host "📋 Copied to: $destPath" -ForegroundColor Yellow
} else {
    Write-Host "⚠️ APK build completed but file not found in expected location" -ForegroundColor Yellow
}

Set-Location ../../..
