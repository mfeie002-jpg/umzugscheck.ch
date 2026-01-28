# 🚀 Quick Command Reference

## Essential Commands

### Single Test Workflow
```powershell
cd tools/funnel-testing

# 1. Create test assignment (pick gateway + persona)
npm run dispatch -- --mode deck --seed my_test_001

# 2. Copy the run_id from output above, then:
npm run run -- --run_id abc123...

# 3. View results
npm run report
cat reports/leaderboard.md
```

---

## Dispatch Modes

### Deck Mode (Default)
No repeats until all enabled gateways are tested, then reshuffle.
```powershell
npm run dispatch -- --mode deck --seed seed_001
```

### Random Mode
Pure random with replacement (same gateway can repeat).
```powershell
npm run dispatch -- --mode random --seed seed_001
```

### Weighted Mode
Random by `priority_weight` (higher weight = more likely).
```powershell
npm run dispatch -- --mode weighted --seed seed_001
```

---

## Reporting

### Generate All Reports
```powershell
npm run report
```

This creates:
- `reports/summary.csv` - All runs with scores
- `reports/leaderboard.md` - Top/bottom gateways
- `reports/persona_gateway_heatmap.csv` - Pivot table
- `reports/dropoffs.csv` - Failure reasons

### View Results
```powershell
# Leaderboard (markdown)
cat reports/leaderboard.md

# Heatmap (can import into Excel)
Import-Csv reports/persona_gateway_heatmap.csv | Format-Table

# Summary (all runs)
Import-Csv reports/summary.csv | Sort-Object confidence -Descending

# Dropoffs (failure reasons)
Import-Csv reports/dropoffs.csv
```

---

## Batch Testing

### Run 5 Quick Tests
```powershell
1..5 | ForEach-Object {
  npm run dispatch -- --mode random --seed "quick_$_"
}
npm run report
```

### Run 100 Tests (All Gateways × 5 Personas)
```powershell
.\scripts\parallel-run.ps1 -TotalRuns 100 -ConcurrentRuns 4
```

### Run 400 Tests (All Gateways × All Personas)
```powershell
.\scripts\parallel-run.ps1 -TotalRuns 400 -ConcurrentRuns 4
# Takes ~2-3 hours
```

### Unix/Linux Alternative
```bash
chmod +x scripts/parallel-run.sh
./scripts/parallel-run.sh 4 100 my_seed
# 4 concurrent, 100 total tests
```

---

## Advanced Options

### Disable Language Matching
By default, personas are matched to gateway language. Override:
```powershell
npm run dispatch -- --mode deck --no-match_language
```

### Enable AI Scoring
Set OpenAI API key (optional, uses heuristics if missing):
```powershell
# Create .env file
echo "OPENAI_API_KEY=sk-your-key" > .env

# Now AI scoring runs automatically
npm run run -- --run_id <id>
```

### Allow Form Submission (Not Dry Run)
By default, tests stop before final submit. To allow submission:
```powershell
# Edit runs/<run_id>/run.config.json
# Change "dryRun": true to "dryRun": false
npm run run -- --run_id <id>
```

---

## Data Management

### View Current Gateways
```powershell
cat data/gateways.json | ConvertFrom-Json | Select-Object -ExpandProperty name
```

### View Current Personas
```powershell
cat data/personas.json | ConvertFrom-Json | Select-Object -ExpandProperty name
```

### Add New Gateway
```powershell
# Edit data/gateways.json and add entry:
{
  "gateway_id": "my-new-page",
  "name": "My Service",
  "landing_url": "https://umzugscheck.ch/my-page",
  "language": "de",
  "intent": "my_intent",
  "primary_business_models": ["umzug"],
  "priority_weight": 8,
  "enabled": true
}
```

### Add New Persona
```powershell
# Edit data/personas.json and add entry with goal field
{
  "persona_id": "my-persona",
  "name": "My Customer Type",
  "goal": {
    "primary": "book_umzug",
    "services_wanted": ["umzug", "reinigung"],
    "description": "..."
  },
  ...
}
```

### Reset Deck State
```powershell
Remove-Item runs/_state/deck.json -Force
```

---

## Debugging

### Check Last Test Results
```powershell
$lastRun = (Get-ChildItem runs -Directory | Sort-Object CreationTime -Descending | Select-Object -First 1).Name
cat runs/$lastRun/result.json | ConvertFrom-Json
```

### View Screenshots of Last Test
```powershell
$lastRun = (Get-ChildItem runs -Directory | Sort-Object CreationTime -Descending | Select-Object -First 1).Name
Get-ChildItem runs/$lastRun/screenshots
```

### Check Test Configuration
```powershell
$lastRun = (Get-ChildItem runs -Directory | Sort-Object CreationTime -Descending | Select-Object -First 1).Name
cat runs/$lastRun/run.config.json | ConvertFrom-Json | Select-Object gateway, persona, policy
```

### Run Tests Sequentially (Debug Mode)
```powershell
# Instead of parallel-run.ps1, run manually:
npm run dispatch -- --mode deck --seed debug_001
npm run run -- --run_id <id>
# Review before running next
```

---

## CI/CD

### Run GitHub Actions Locally
```powershell
# Install act: https://github.com/nektos/act
act -j funnel-testing
```

### Enable Nightly Automation
1. Push to GitHub: `git push origin main`
2. Workflow runs automatically at 2 AM UTC
3. Results uploaded to artifacts
4. PR comments with summary

### Disable Workflow
```powershell
# Rename workflow file
Rename-Item .github/workflows/funnel-testing.yml funnel-testing.yml.disabled
```

---

## Common Issues & Fixes

### "npx playwright install" Needed
```powershell
npx playwright install chromium
```

### Playwright Browser Missing
```powershell
npx playwright install
```

### No CTAs Found (Page Structure Issue)
- Check if page has `<button>`, `<a>`, or `[role="button"]` elements
- May need to update heuristics.ts for custom selectors

### AI Scoring Not Working
```powershell
# Check if OPENAI_API_KEY is set
$env:OPENAI_API_KEY
# If not set, tool falls back to heuristics (still works)
```

### Reports Not Generating
```powershell
# Ensure at least one test has run:
npm run dispatch && npm run run --run_id <id>

# Then generate reports:
npm run report
```

### Deck State Issues
```powershell
# Reset and try again
Remove-Item runs/_state/deck.json -Force
npm run dispatch -- --mode deck
```

---

## Performance Tips

### Speed Up Tests
```powershell
# Reduce maxSteps in run.config.json (default: 20)
# Reduce maxTimeMs in run.config.json (default: 120000)
# This speeds up tests but may miss late CTAs
```

### Improve Parallel Performance
```powershell
# Increase concurrent runs (if system has capacity)
.\scripts\parallel-run.ps1 -TotalRuns 100 -ConcurrentRuns 8

# Or reduce to avoid rate limiting
.\scripts\parallel-run.ps1 -TotalRuns 100 -ConcurrentRuns 2
```

### Monitor Resource Usage
```powershell
# Check memory during parallel execution
Get-Process | Where-Object Name -match "chrome" | Select-Object Name, WorkingSet
```

---

## Analysis Queries

### Find Underperforming Gateways
```powershell
Import-Csv reports/summary.csv `
  | Group-Object gateway `
  | Select-Object Name, @{Name="AvgConfidence";Expression={[Int]($_.Group.confidence | Measure-Object -Average).Average}} `
  | Sort-Object AvgConfidence
```

### Find Most Common Dropoff Reasons
```powershell
Import-Csv reports/dropoffs.csv | Sort-Object count -Descending | Select-Object -First 5
```

### Compare Gateway-Persona Combos
```powershell
Import-Csv reports/persona_gateway_heatmap.csv | Where-Object {$_."umzug-zuerich" -lt 50}
```

### Export Results to Excel
```powershell
# Copy reports/*.csv into Excel
# Create pivot tables
# Filter by gateway, persona, verdict
```

---

## Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Full setup and usage guide |
| `EXECUTIVE_SUMMARY.md` | This summary (start here) |
| `VALIDATION_REPORT.md` | Complete validation results |
| `IMPLEMENTATION_COMPLETE.md` | Architecture details |
| `MARKETING_FUNNEL_REFACTOR.md` | Design decisions |

---

## First 5 Minutes

1. Open PowerShell
2. `cd tools/funnel-testing`
3. `npm run dispatch -- --mode deck --seed test_001`
4. Copy the run_id
5. `npm run run -- --run_id <paste-id>`
6. Wait 2-3 minutes...
7. `npm run report`
8. `cat reports/leaderboard.md`

**Done!** You've run your first marketing funnel test. 🎉

---

## Need Help?

- 📘 Read `README.md` for detailed documentation
- 📗 Check `VALIDATION_REPORT.md` for examples
- 💬 Review sample outputs in `reports/`
- 🔍 Examine `data/gateways.json` and `data/personas.json` for data structure

**Questions?** Look at the 4 documentation files in tools/funnel-testing/

---

**Happy Testing!** 🚀
