# PowerShell parallel execution script for Windows

param(
    [int]$ConcurrentRuns = 4,
    [int]$TotalRuns = 20,
    [string]$Seed = (Get-Date).Ticks.ToString()
)

Write-Host "🚀 Parallel Funnel Test Execution" -ForegroundColor Green
Write-Host "   Concurrent: $ConcurrentRuns"
Write-Host "   Total Runs: $TotalRuns"
Write-Host "   Seed: $Seed"
Write-Host ""

# Generate all run configs
Write-Host "📋 Generating $TotalRuns run configurations..." -ForegroundColor Cyan
1..$TotalRuns | ForEach-Object {
    npm run dispatch -- --seed "$Seed`_$_" | Out-Null
}

# Get list of all run IDs
$runIds = Get-ChildItem -Path "runs" -Directory | Where-Object { $_.Name -match "^[0-9a-f\-]+$" } | Select-Object -ExpandProperty Name

# Execute runs in parallel with throttling
Write-Host "🏃 Executing runs ($ConcurrentRuns at a time)..." -ForegroundColor Cyan

$jobs = @()
foreach ($runId in $runIds) {
    while ((Get-Job -State Running).Count -ge $ConcurrentRuns) {
        Start-Sleep -Milliseconds 500
    }
    
    $jobs += Start-Job -ScriptBlock {
        param($id)
        Set-Location $using:PWD
        npm run run -- --run_id $id
    } -ArgumentList $runId
    
    Write-Host "  Started: $runId" -ForegroundColor Gray
}

# Wait for all jobs to complete
Write-Host "⏳ Waiting for all runs to complete..." -ForegroundColor Yellow
$jobs | Wait-Job | Receive-Job
$jobs | Remove-Job

# Generate reports
Write-Host "📊 Generating aggregated reports..." -ForegroundColor Cyan
npm run report

Write-Host "✅ Parallel execution complete!" -ForegroundColor Green
Write-Host "   Results: ./reports/"
