#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Top-10 Marketing Funnels Test Execution Script
    
.DESCRIPTION
    Dieses Skript führt die E2E-Tests für alle 10 Marketing-Funnels aus.
    Es startet den Dev-Server, führt die Tests aus und generiert einen Report.
    
.PARAMETER Funnel
    Spezifischer Funnel zum Testen (F1-F10). Wenn leer, werden alle getestet.
    
.PARAMETER Headed
    Wenn gesetzt, läuft der Test mit sichtbarem Browser (für Debugging).
    
.PARAMETER UpdateSnapshots
    Wenn gesetzt, werden Screenshot-Snapshots aktualisiert.
    
.EXAMPLE
    .\run-funnel-tests.ps1
    # Führt alle 10 Funnels im Headless-Modus aus
    
.EXAMPLE
    .\run-funnel-tests.ps1 -Funnel F1 -Headed
    # Testet nur F1 mit sichtbarem Browser
    
.EXAMPLE
    .\run-funnel-tests.ps1 -UpdateSnapshots
    # Aktualisiert alle Screenshots
#>

param(
    [string]$Funnel = "",
    [switch]$Headed = $false,
    [switch]$UpdateSnapshots = $false,
    [switch]$SkipServerStart = $false
)

# ============================================
# CONFIGURATION
# ============================================

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = $scriptDir

# Farben für Output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# ============================================
# PRE-CHECK: Dependencies
# ============================================

Write-ColorOutput "`n🔍 Checking dependencies..." "Cyan"

# Check: Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-ColorOutput "❌ Node.js nicht gefunden. Bitte installieren: https://nodejs.org" "Red"
    exit 1
}

# Check: npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-ColorOutput "❌ npm nicht gefunden." "Red"
    exit 1
}

# Check: Playwright installiert
if (-not (Test-Path "$projectRoot/node_modules/@playwright")) {
    Write-ColorOutput "⚠️ Playwright nicht installiert. Installiere..." "Yellow"
    npm install --save-dev @playwright/test
    npx playwright install
}

Write-ColorOutput "✅ Dependencies OK" "Green"

# ============================================
# STEP 1: Dev-Server starten (falls nicht läuft)
# ============================================

if (-not $SkipServerStart) {
    Write-ColorOutput "`n🚀 Checking if dev server is running..." "Cyan"
    
    $serverRunning = $false
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080" -Method Head -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $serverRunning = $true
        }
    } catch {
        $serverRunning = $false
    }
    
    if ($serverRunning) {
        Write-ColorOutput "✅ Dev-Server läuft bereits auf http://localhost:8080" "Green"
    } else {
        Write-ColorOutput "⚠️ Dev-Server nicht erreichbar. Starte Server..." "Yellow"
        Write-ColorOutput "   (Falls Server bereits läuft, benutze -SkipServerStart)" "Gray"
        
        # Server im Hintergrund starten
        $serverJob = Start-Job -ScriptBlock {
            Set-Location $using:projectRoot
            npm run dev
        }
        
        Write-ColorOutput "   Warte auf Server-Start (max 30s)..." "Gray"
        
        # Warte bis Server bereit ist (max 30 Sekunden)
        $maxWait = 30
        $waited = 0
        $serverReady = $false
        
        while (-not $serverReady -and $waited -lt $maxWait) {
            Start-Sleep -Seconds 2
            $waited += 2
            
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:8080" -Method Head -TimeoutSec 2 -ErrorAction SilentlyContinue
                if ($response.StatusCode -eq 200) {
                    $serverReady = $true
                }
            } catch {
                Write-Host "." -NoNewline
            }
        }
        
        if ($serverReady) {
            Write-ColorOutput "`n✅ Dev-Server gestartet" "Green"
        } else {
            Write-ColorOutput "`n❌ Dev-Server konnte nicht gestartet werden" "Red"
            Stop-Job -Job $serverJob
            Remove-Job -Job $serverJob
            exit 1
        }
    }
} else {
    Write-ColorOutput "`n⏭️ Server-Check übersprungen (-SkipServerStart)" "Yellow"
}

# ============================================
# STEP 2: Playwright Tests ausführen
# ============================================

Write-ColorOutput "`n🧪 Running Playwright E2E Tests..." "Cyan"

# Build Test Command
$testCommand = "npx playwright test e2e/top-10-funnels.spec.ts"

# Funnel-Filter
if ($Funnel) {
    $testCommand += " -g ""$Funnel"""
    Write-ColorOutput "   Testing only: $Funnel" "Gray"
}

# Headed Mode
if ($Headed) {
    $testCommand += " --headed"
    Write-ColorOutput "   Mode: Headed (Browser sichtbar)" "Gray"
} else {
    Write-ColorOutput "   Mode: Headless" "Gray"
}

# Update Snapshots
if ($UpdateSnapshots) {
    $testCommand += " --update-snapshots"
    Write-ColorOutput "   Updating screenshots..." "Yellow"
}

Write-ColorOutput "`n📝 Command: $testCommand`n" "Gray"

# Execute
try {
    Invoke-Expression $testCommand
    $testExitCode = $LASTEXITCODE
} catch {
    Write-ColorOutput "❌ Test execution failed: $_" "Red"
    $testExitCode = 1
}

# ============================================
# STEP 3: Results Summary
# ============================================

Write-ColorOutput "`n" "White"
Write-ColorOutput "════════════════════════════════════════" "Cyan"
Write-ColorOutput "  TEST EXECUTION SUMMARY" "Cyan"
Write-ColorOutput "════════════════════════════════════════" "Cyan"

if ($testExitCode -eq 0) {
    Write-ColorOutput "✅ All tests PASSED" "Green"
} else {
    Write-ColorOutput "❌ Some tests FAILED (Exit Code: $testExitCode)" "Red"
}

# Check if HTML report exists
$reportPath = "$projectRoot/playwright-report/index.html"
if (Test-Path $reportPath) {
    Write-ColorOutput "`n📊 HTML Report available:" "Cyan"
    Write-ColorOutput "   file:///$($reportPath -replace '\\', '/')" "Gray"
    Write-ColorOutput "`n   Open with: npx playwright show-report" "Yellow"
}

# Check for screenshots
$screenshotsPath = "$projectRoot/test-results"
if (Test-Path $screenshotsPath) {
    $screenshotCount = (Get-ChildItem -Path $screenshotsPath -Filter "*.png" -Recurse).Count
    if ($screenshotCount -gt 0) {
        Write-ColorOutput "`n📸 Screenshots captured: $screenshotCount" "Cyan"
        Write-ColorOutput "   Location: $screenshotsPath" "Gray"
    }
}

Write-ColorOutput "`n════════════════════════════════════════`n" "Cyan"

# ============================================
# STEP 4: Cleanup (optional)
# ============================================

if (-not $SkipServerStart -and $serverJob) {
    Write-ColorOutput "🧹 Stopping dev server..." "Yellow"
    Stop-Job -Job $serverJob -ErrorAction SilentlyContinue
    Remove-Job -Job $serverJob -ErrorAction SilentlyContinue
    Write-ColorOutput "✅ Cleanup complete" "Green"
}

# ============================================
# EXIT
# ============================================

exit $testExitCode
