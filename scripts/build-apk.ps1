# Zophiel APK Build Script (Capacitor)
# Prerequisites: Java JDK 17+, Android SDK (via Android Studio or cmdline-tools)
# Usage: Run from project root -> pwsh scripts/build-apk.ps1

$ErrorActionPreference = "Stop"

# ── Prerequisites check ──
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Cyan

$java = Get-Command java -ErrorAction SilentlyContinue
if (-not $java) {
    Write-Host "❌ Java not found. Install JDK 17+:" -ForegroundColor Red
    Write-Host "   winget install Microsoft.OpenJDK.17" -ForegroundColor Yellow
    exit 1
}

if (-not $env:ANDROID_HOME -and -not $env:ANDROID_SDK_ROOT) {
    Write-Host "❌ Android SDK not found. Install Android Studio or:" -ForegroundColor Red
    Write-Host "   winget install Google.AndroidStudio" -ForegroundColor Yellow
    exit 1
}

# ── Build ──
Write-Host "🔨 Step 1: Building shared package..." -ForegroundColor Cyan
pnpm --filter @zophiel/shared build
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "🔨 Step 2: Building client..." -ForegroundColor Cyan
pnpm --filter @zophiel/client build
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "📱 Step 3: Capacitor sync..." -ForegroundColor Cyan
Set-Location apps/client
npx cap sync android
if ($LASTEXITCODE -ne 0) { exit 1 }

# ── Generate keystore if not exists ──
if (-not (Test-Path "zophiel-release.keystore")) {
    Write-Host "🔑 Generating release keystore..." -ForegroundColor Yellow
    keytool -genkeypair -v -storetype PKCS12 `
        -keystore zophiel-release.keystore `
        -alias zophiel `
        -keyalg RSA -keysize 2048 -validity 10000 `
        -storepass zophiel2026 -keypass zophiel2026 `
        -dname "CN=Zophiel, OU=Mobile, O=Zophiel, L=Buenos Aires, ST=CABA, C=AR"
}

# ── Build APK ──
Write-Host "🏗️ Step 4: Building release APK..." -ForegroundColor Cyan
Set-Location android

# Configure signing in gradle
$signingConfig = @"
android.buildTypes.release.signingConfig = android.signingConfigs.create('release') {
    storeFile = file('../zophiel-release.keystore')
    storePassword = 'zophiel2026'
    keyAlias = 'zophiel'
    keyPassword = 'zophiel2026'
}
"@

# Add signing config if not already present
$gradleFile = "app/build.gradle"
$gradleContent = Get-Content $gradleFile -Raw
if ($gradleContent -notmatch "signingConfigs") {
    Add-Content $gradleFile "`n$signingConfig"
}

./gradlew assembleRelease
if ($LASTEXITCODE -ne 0) { exit 1 }

# ── Copy APK ──
$apkPath = Get-ChildItem -Path "app/build/outputs/apk/release/*.apk" | Select-Object -First 1
if ($apkPath) {
    Copy-Item $apkPath.FullName "../../zophiel-release.apk" -Force
    Write-Host "✅ APK built: zophiel-release.apk" -ForegroundColor Green
    Write-Host "   Size: $([math]::Round($apkPath.Length / 1MB, 2)) MB" -ForegroundColor Cyan
} else {
    Write-Host "❌ APK not found" -ForegroundColor Red
    exit 1
}

Set-Location ../..
Write-Host "🎉 Done!" -ForegroundColor Green
