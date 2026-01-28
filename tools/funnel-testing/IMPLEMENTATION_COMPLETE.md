# Marketing Funnel Testing Tool - Complete Implementation ✅

## 📋 Specification Checklist

### Step 1: Architecture & Folder Structure ✅
- ✅ `src/cli/` - CLI entrypoints (dispatch, run, report)
- ✅ `src/dispatcher/` - Deterministic gateway+persona+policy assignment
- ✅ `src/runner/` - Playwright executor + AI scoring + heuristics
- ✅ `src/reporting/` - CSV + Markdown aggregation
- ✅ `src/shared/` - Schemas (Zod), RNG (seedrandom), filesystem utilities
- ✅ `data/gateways.json` - 20 marketing funnels
- ✅ `data/personas.json` - 20 customer business goals
- ✅ Deterministic seeding: `${run_id}::${seed}::{context}`

### Step 2: Dispatcher ✅
- ✅ Deck mode (no repeats until exhausted, then reshuffle)
- ✅ Random mode (with replacement)
- ✅ Weighted mode (by priority_weight)
- ✅ Language matching (default on, --no-match_language override)
- ✅ Outputs: run.config.json, assignment.snapshot.json

### Step 3: Runner (Playwright Agent) ✅
- ✅ Opens landing_url with mobile/desktop viewport
- ✅ Captures initial screenshot
- ✅ Detects top CTAs (main/secondary/escape)
- ✅ Applies policy logic (StrictMain/RealisticWeighted/ChaosMonkey)
- ✅ Fills forms with fake data (example.com, [TEST] prefix)
- ✅ Captures step-by-step screenshots
- ✅ Detects success/dropout/blocker verdicts
- ✅ Optional: AI scoring with OpenAI GPT-4 Vision (graceful fallback)
- ✅ Safety: dryRun=true by default

### Step 4: Reporter ✅
- ✅ `reports/summary.csv` (per-run scores, verdict, steps, dropoff reason)
- ✅ `reports/leaderboard.md` (top/bottom gateways + common dropoffs)
- ✅ `reports/persona_gateway_heatmap.csv` (pivot matrix)
- ✅ `reports/dropoffs.csv` (reason frequencies)

### Step 5: Sample Data ✅
- ✅ `README.md` (comprehensive with AI scoring, parallel execution, CI/CD)
- ✅ `data/gateways.json` (20 real traffic pages)
- ✅ `data/personas.json` (20 customer business goals)
- ✅ `.env.example` (environment variables)

### Step 6: Next Improvements ✅
- ✅ README includes planned enhancements
- ✅ Parallel execution scripts (Bash + PowerShell)
- ✅ GitHub Actions CI/CD workflow
- ✅ AI-powered journey analysis (implemented)
- ✅ Business model tracking (implemented)

---

## 🎯 Key Features Beyond Specification

### Marketing Funnel Focus
**Unique addition:** Tool tests customer journey success, not just form completion

- **Gateway:** 20 real high-traffic landing pages from Google searches
- **Personas:** 20 customer archetypes with specific business goals (service combinations)
- **Success Metric:** Goal achievement rate (customer found + can book wanted services)
- **Business Model Tracking:** Service discovery and cross-sell detection

### Advanced Capabilities
1. **AI-Powered Scoring** - OpenAI GPT-4 Vision evaluates page quality
2. **Intent Matching** - CTA detection scores +30pts for matching gateway intent
3. **Persona Behavior** - Click bias weights + step-dependent navigation
4. **Mobile/Desktop Adaptation** - Viewport-specific testing
5. **Parallel Execution** - PowerShell + Bash scripts for concurrent runs
6. **CI/CD Ready** - GitHub Actions workflow with nightly scheduling

---

## 🚀 Quick Start

```powershell
cd tools/funnel-testing

# Single marketing funnel test
npm run dispatch -- --mode deck --seed marketing_001
npm run run -- --run_id <id>
npm run report

# Batch: 20 gateways × 20 personas = 400 tests
.\scripts\parallel-run.ps1 -TotalRuns 400 -ConcurrentRuns 4

# View results
cat reports/leaderboard.md
cat reports/persona_gateway_heatmap.csv
```

---

## 📊 Data: 20 Gateways (Marketing Funnels)

| # | Gateway | Type | Traffic | Serves | Language |
|---|---------|------|---------|--------|----------|
| 1 | Homepage | Brand | High | All services | DE |
| 2 | Umzug Zürich | Geography | High | Move | DE |
| 3 | Umzug Bern | Geography | High | Move | DE |
| 4 | Déménagement Genève | Geography | High | Move | FR |
| 5 | Trasloco Lugano | Geography | Medium | Move | IT |
| 6 | Umzug Basel | Geography | Medium | Move | DE |
| 7 | **Umzug + Reinigung** | **Combo** | **High** | **Move + Clean** | DE |
| 8 | Endreinigung | Service | High | Clean | DE |
| 9 | Entsorgung | Service | Medium | Disposal | DE |
| 10 | Lagerung | Service | Medium | Storage | DE |
| 11 | Klaviertransport | Specialty | Low | Piano | DE |
| 12 | Büroumzug | Segment | Medium | Office | DE |
| 13 | Günstiger Umzug | Segment | High | Budget Move | DE |
| 14 | Umzug ins Ausland | Segment | Medium | International | DE |
| 15 | Studentenumzug | Segment | Medium | Student | DE |
| 16 | Seniorenumzug | Segment | Low | Senior | DE |
| 17 | **Preisvergleich** | **Intent** | **High** | **Compare** | DE |
| 18 | **Umzugskosten** | **Intent** | **High** | **Calculate** | DE |
| 19 | **Offerte anfragen** | **Intent** | **High** | **Quote Form** | DE |
| 20 | Umzugsfirma vergleichen | Intent | High | Compare | DE |

**Key:** High-traffic gateways are where customers land from Google and decide if your site can help them.

---

## 👥 Data: 20 Personas (Customer Goals)

| # | Persona | Goal | Services Wanted | Budget | Language |
|---|---------|------|-----------------|--------|----------|
| 1 | Full Service Pro | Complete solution | Umzug + Reinigung + Entsorgung + Lagerung | High | DE |
| 2 | Busy Parent | Move + clean | Umzug + Reinigung | Medium | DE |
| 3 | Budget Student | Cheapest move | Umzug | Low | DE |
| 4 | Cleaning-Only | No move | Reinigung | Medium | DE |
| 5 | Downsizer | Disposal | Entsorgung | Medium | DE |
| 6 | Temp Housing | Storage | Lagerung + Umzug | Medium | DE |
| 7 | Piano Owner | Specialist | Umzug (special) | High | DE |
| 8 | Office Manager | B2B move | Umzug (office) | High | DE |
| 9 | Comparison Queen | Research | Umzug (compare) | Medium | DE |
| 10 | International Expat | Overseas | Umzug (intl) + Lagerung | High | EN |
| 11 | Francophone Family | Move + clean | Umzug + Reinigung | Medium | FR |
| 12 | Italian Speaker | Local | Umzug | Medium | IT |
| 13 | Last Minute Larry | Emergency | Umzug (urgent) | High | DE |
| 14 | Skeptical Senior | Support | Umzug + Reinigung + Entsorgung | Medium | DE |
| 15 | Green Conscious | Eco | Umzug + Entsorgung (recycled) | Medium | DE |
| 16 | Info Seeker | Research | None (exploring) | Unknown | DE |
| 17 | Luxury Client | Premium | Everything (concierge) | High | DE |
| 18 | DIY Helper | Partial | Umzug (no packing) | Low | DE |
| 19 | Young Couple | Affordable | Umzug | Low | DE |
| 20 | Chaos Bot | Random testing | Random | Medium | DE |

**Key:** Each persona has a specific business goal. Success = Customer can book their desired services.

---

## 📈 What You Measure

### Gateway Performance
```
Q: Which landing pages convert?
Report: leaderboard.md + heatmap.csv

Example Output:
Top Gateways:
1. Umzug + Reinigung - 78% goal achievement
2. Offerte anfragen - 72%
3. Homepage - 65%

Bottom:
18. Seniorenumzug - 28%
19. Lagerung - 22%
20. Klaviertransport - 15%
```

### Business Model Coverage
```
Q: Can customers find services they want?
Report: persona_gateway_heatmap.csv

Example (as CSV pivot):
Persona → Gateway     Homepage  Umzug+Reinigung  Endreinigung
Full Service          65%       82%              15%
Cleaning-Only         12%       28%              91%
```

### Lost Revenue Detection
```
Q: Which customer goals are underserved?
Analysis: Cross-reference goal + available services per gateway

Example Gap:
- International Expat lands on "Umzug Bern" (no Englisch)
- Disposal-Only Customer lands on "Umzug Zürich" (no Entsorgung mention)
```

---

## 🛠 Technical Stack

- **Node.js** 20 + TypeScript 5.3
- **Playwright** 1.40 - Browser automation
- **OpenAI** 4.20 - GPT-4 Vision API (optional)
- **Zod** 3.22 - Schema validation
- **seedrandom** 3.0.5 - Deterministic RNG
- **csv-writer** 1.6 - CSV generation
- **@faker-js/faker** 8.3 - Fake data
- **commander** 11.1 - CLI
- **chalk** 4.1 - Terminal colors

---

## 📚 Files Summary

### Source Code
- `src/cli/dispatch.ts` - Gateway + Persona assignment
- `src/cli/run.ts` - Playwright execution
- `src/cli/report.ts` - Report generation
- `src/dispatcher/index.ts` - Deck/Random/Weighted logic
- `src/runner/index.ts` - Main test executor
- `src/runner/aiScorer.ts` - OpenAI integration
- `src/runner/heuristics.ts` - CTA detection + intent matching
- `src/runner/formFiller.ts` - Auto form filling
- `src/runner/scorecard.ts` - Result scoring
- `src/shared/schemas.ts` - Zod validators
- `src/shared/rng.ts` - Seedrandom wrapper
- `src/reporting/index.ts` - CSV + Markdown generation

### Configuration
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `.env.example` - Environment variables template
- `tailwind.config.ts` / `postcss.config.js` - (from parent repo)

### Data
- `data/gateways.json` - 20 marketing funnels
- `data/personas.json` - 20 customer archetypes

### Output
- `runs/<run_id>/run.config.json` - Test configuration
- `runs/<run_id>/result.json` - Test results + scores
- `runs/<run_id>/screenshots/*.png` - Step-by-step visuals
- `reports/summary.csv` - All runs aggregated
- `reports/leaderboard.md` - Top/bottom gateways
- `reports/persona_gateway_heatmap.csv` - Pivot table
- `reports/dropoffs.csv` - Failure reasons

### Scripts
- `scripts/parallel-run.ps1` - Windows parallel execution
- `scripts/parallel-run.sh` - Unix parallel execution
- `.github/workflows/funnel-testing.yml` - CI/CD pipeline

### Documentation
- `README.md` - Full setup + usage guide
- `MARKETING_FUNNEL_REFACTOR.md` - Architectural decision
- `READY_TO_DEPLOY.md` - Quick start guide

---

## ✅ Validation Checklist

- [x] Dispatcher assigns 20 gateways + 20 personas deterministically
- [x] Runner launches Playwright and navigates site
- [x] Screenshots captured for each step
- [x] AI scoring available (graceful fallback if no API key)
- [x] Reports generate CSV + Markdown + heatmap
- [x] Parallel execution supports Windows + Unix
- [x] CI/CD ready with GitHub Actions
- [x] Deterministic seeding works (same seed = same result)
- [x] Language matching functional
- [x] Mobile/desktop viewport adaptation
- [x] Fake data generation safe (example.com, [TEST] prefix)
- [x] Error handling + blocker detection
- [x] Git-friendly (ignores runs/, reports/, node_modules/)

---

## 🎯 Next Commands

### For You:

**Quick Test:**
```powershell
Set-Location c:\Users\thest\Desktop\umzugscheck.ch\umzugscheck.ch\tools\funnel-testing
npm run dispatch -- --mode deck --seed test_001
npm run run -- --run_id <copy-id-from-above>
npm run report
```

**Batch Test (400 runs, all gateways × personas):**
```powershell
.\scripts\parallel-run.ps1 -TotalRuns 400 -ConcurrentRuns 4
```

**View Results:**
```powershell
Get-Content reports/leaderboard.md
Import-Csv reports/persona_gateway_heatmap.csv | Format-Table
```

---

## 📌 Key Differentiators

This isn't just a form-testing tool. It's a **marketing funnel analyzer** that:

1. **Tests from Google entry point** - Realistic customer journey
2. **Tracks business goals** - Did customer find what they wanted?
3. **Measures service discovery** - Can they book their service combo?
4. **Detects revenue gaps** - Which customer segments are underserved?
5. **Supports multi-language** - DE, FR, IT, EN personas
6. **AI-powered analysis** - GPT-4 Vision evaluates page quality
7. **Production-ready** - Parallel execution, CI/CD, comprehensive reporting

---

**Status:** ✅ **Ready to deploy and run comprehensive marketing funnel tests!**
