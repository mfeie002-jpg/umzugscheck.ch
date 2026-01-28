# Umzugscheck Advanced Funnel Testing Tool

A production-grade, AI-powered, deterministic funnel testing tool for conversion rate optimization using Playwright, OpenAI GPT-4 Vision, and advanced persona modeling.

## 🎯 What This Does

- **Intelligent Dispatcher**: Deterministically assigns gateway + persona + policy (deck/random/weighted modes)
- **AI-Powered Runner**: Launches Playwright browser with OpenAI GPT-4 Vision for intelligent page scoring
- **Advanced Persona System**: 20 detailed personas with click_bias_weights, device types, and behavioral traits
- **Intent-Aware Navigation**: CTA detection uses gateway intent for smarter element selection
- **Production Reporting**: CSV + Markdown reports with leaderboards, heatmaps, and AI insights

## 🚀 Quick Start

```bash
# Install dependencies
cd tools/funnel-testing
npm install
npx playwright install chromium

# Optional: Set OpenAI API key for AI-powered scoring
# Copy .env.example to .env and add your key
cp .env.example .env
# Then edit .env and set: OPENAI_API_KEY=sk-...

# Dispatch a test run
npm run dispatch

# Run the test (copy the run_id from above)
npm run run -- --run_id <run_id>

# Generate reports
npm run report
```

## 📁 Structure

```
├── src/
│   ├── cli/              # Entry points: dispatch, run, report
│   ├── dispatcher/       # Deterministic assignment logic
│   ├── runner/           # Playwright executor + AI scoring
│   │   ├── aiScorer.ts   # OpenAI GPT-4 Vision integration
│   │   ├── heuristics.ts # Intent-aware CTA detection
│   │   └── index.ts      # Main test execution
│   ├── reporting/        # CSV + Markdown generation
│   └── shared/           # Schemas, RNG, filesystem utilities
├── data/
│   ├── gateways.json     # 20 Swiss moving industry URLs
│   └── personas.json     # 20 detailed user profiles
├── runs/
│   ├── _state/           # Persisted deck state
│   └── {run_id}/         # Per-run results + screenshots
├── reports/              # Generated CSV + Markdown
├── scripts/
│   ├── parallel-run.sh   # Unix/Linux parallel execution
│   └── parallel-run.ps1  # Windows PowerShell parallel execution
└── .github/
    └── workflows/
        └── funnel-testing.yml  # CI/CD automation
```

## 🎲 Dispatch Modes

### Deck Mode (default)
No repeats until all enabled gateways tested, then reshuffle.

```bash
npm run dispatch -- --mode deck
```

### Random Mode
Pure random selection with replacement.

```bash
npm run dispatch -- --mode random
```

### Weighted Mode
Respects `priority_weight` in `gateways.json`.

```bash
npm run dispatch -- --mode weighted
```

## 🔧 CLI Options

### dispatch
```bash
npm run dispatch -- --mode deck --seed 12345 --no-match_language
```

- `--mode`: deck|random|weighted (default: deck)
- `--seed`: Explicit seed for RNG (default: random)
- `--no-match_language`: Disable language matching for persona selection

### run
```bash
npm run run -- --run_id <id> --submit
```

- `--run_id`: Required. Use the ID from dispatch output
- `--submit`: Perform actual form submissions (default: dry run)

### report
```bash
npm run report
```

Generates:
- `reports/summary.csv` — All runs with scores and verdicts
- `reports/leaderboard.md` — Top/bottom gateways by conversion confidence
- `reports/persona_gateway_heatmap.csv` — Pivot matrix for cross-analysis
- `reports/dropoffs.csv` — Dropoff reason frequencies

## 🧬 Advanced Features

### AI-Powered Scoring (OpenAI GPT-4 Vision)

Set `OPENAI_API_KEY` environment variable to enable intelligent page evaluation:

```bash
export OPENAI_API_KEY=sk-...  # Linux/Mac
# OR
$env:OPENAI_API_KEY="sk-..."  # Windows PowerShell

npm run run -- --run_id <id>
```

The AI evaluates each page screenshot:
- **Intent Match** (1-100%): Does page content match user's search intent?
- **Trust Signals** (1-100%): Certifications, reviews, security indicators
- **Friction** (1-100%): Number of steps/obstacles before conversion
- **Clarity** (1-100%): Value proposition and CTA clarity
- **Mobile Usability** (1-100%): Layout, readability, touch targets
- **Conversion Confidence** (1-100%): Overall likelihood of conversion

**Without API key**: Falls back to heuristic scoring (keywords, element detection, trust signal scanning).

**AI Prompt Context Sent:**
- Screenshot (base64 PNG)
- Gateway intent ("Privatumzug Zürich", "Déménagement pas cher", etc.)
- Persona traits (anxious, skeptical, time_pressed)
- Budget level (low/medium/high)
- Urgency (low/medium/high)
- Device type (mobile/desktop)

### Persona Click Bias System

Each persona has unique `click_bias_weights` that determine CTA selection probability:

```json
{
  "persona_id": "wealthy_expat",
  "click_bias_weights": {
    "main_cta": 0.85,    // 85% chance to click main CTA
    "secondary": 0.12,   // 12% chance for secondary
    "escape": 0.03       // 3% chance to abandon
  }
}
```

**Step-Dependent Weight Adjustments:**
- **Early steps (1-2)**: Explores more (secondary/escape increased by ~20%)
- **Late steps (3+)**: Commits harder (main CTA weight increased ~40%)

**Example Personas:**
- **Wealthy Expat**: High main_cta (0.85), low escape (0.03), desktop, high budget
- **Anxious Student**: Lower main_cta (0.45), higher escape (0.18), mobile, low budget
- **Chaos Bot**: Equal weights (0.33/0.33/0.34), stress-tests edge cases
- **Comparison Queen**: High secondary (0.45), clicks alternatives/info links

### Intent-Aware CTA Detection

The runner uses gateway `intent` field to boost relevance scoring:

```json
{
  "gateway_id": "privatumzug_zurich",
  "name": "Privatumzug Zürich",
  "intent": "Privatumzug Zürich",
  // CTAs containing "Privatumzug" or "Zürich" get +30 score boost
}
```

**CTA Scoring Algorithm:**
1. Font size: 16px+ = +15 points
2. Area: 8000px² = +20 points
3. Viewport position: Above fold = +15 points
4. Keyword match: contact/submit/envoyer = +25 points
5. **Intent match**: Gateway keyword = +30 points
6. Email/phone links: +20 points

### Persona Behavioral Traits

Personas with specific traits exhibit realistic behaviors:

- **`anxious`**: 1-3 second hesitation delays before clicking
- **`skeptical`**: Higher escape probability, looks for trust signals
- **`time_pressed`**: Faster decisions, less exploration
- **`comparison_shopper`**: More secondary CTA clicks
- **`detail_oriented`**: Reads more, slower navigation
- **`impulsive`**: Fast clicks, less hesitation

## 🔄 Parallel Execution

### Linux/Mac
```bash
chmod +x scripts/parallel-run.sh
./scripts/parallel-run.sh 4 20 myseed123
# 4 concurrent runs, 20 total, seed "myseed123"
```

### Windows PowerShell
```powershell
.\scripts\parallel-run.ps1 -ConcurrentRuns 4 -TotalRuns 20 -Seed myseed123
```

**Output**: Each run creates separate directories, final report aggregates all results.

## 🔬 CI/CD Integration

GitHub Actions workflow included at `.github/workflows/funnel-testing.yml`:

- **Nightly runs** at 2 AM UTC
- **Manual triggers** with custom parameters (seed, total runs, concurrent)
- **Parallel execution** (default: 4 concurrent)
- **Blocker detection** (fails if >5 blockers detected)
- **Artifact upload** (reports + screenshots, 30-day retention)
- **PR comments** with test results summary

**Setup:**
1. Add `OPENAI_API_KEY` to GitHub Secrets (Settings → Secrets → Actions)
2. Commit `.github/workflows/funnel-testing.yml`
3. Workflow runs automatically on schedule or manual trigger

**Manual Trigger:**
- Go to Actions → Funnel Testing → Run workflow
- Set seed, concurrent runs, total runs
- Click "Run workflow"

## 🧬 How It Works

### Deterministic Seeding

All randomness is seeded based on:

```
Dispatcher seed:  ${run_id}::${seed}::dispatch
Runner seed:      ${run_id}::${seed}::run
Step N seed:      ${run_id}::${seed}::run::step${N}
```

**Same run_id + same seed ⇒ identical assignments and click decisions.**

This enables:
- Reproducible tests for debugging
- Regression detection (run same seed weekly)
- Fair A/B comparisons (same persona/gateway distribution)

### CTA Detection Algorithm

1. **Query**: `button, a, [role="button"], input[type="submit"]`
2. **Filter**: Visible elements only, above 10px × 10px
3. **Score** each element:
   - Font size (16px+ = +15 points)
   - Area (8000px+ = +20 points)
   - Viewport position (above fold = +15 points)
   - Keyword match (`contact|submit|envoyer|contatto` = +25 points)
   - **Intent match** (gateway intent keyword = +30 points)
   - Email/phone links (+20 points)
4. **Classify** as main/secondary/escape based on score threshold
5. **Select** using:
   - Persona `click_bias_weights`
   - Step-dependent adjustment (explore early, commit late)
   - Normalized probability distribution
   - Seeded random selection

### Persona Selection

- **Language matching enabled** (default): Prefers personas with same language as gateway
- **Weighted by urgency**: High urgency personas slightly favored
- **Device distribution**: 60% mobile, 40% desktop (adjustable)
- **Trait diversity**: Mix of anxious, skeptical, impulsive, detail_oriented

## 📊 Reporting

### Summary CSV
| Run ID | Gateway | Persona | Policy | Confidence | Verdict | Steps | Dropoff Reason | Time | AI Scores | AI Reasoning |
|--------|---------|---------|--------|------------|---------|-------|----------------|------|-----------|--------------|

### Leaderboard (Markdown)
- **Top 10 gateways** by average conversion confidence
- **Bottom 5 gateways** with common issues
- **Common dropoff reasons** with frequency counts
- **AI insights** (if available)

### Heatmap (Pivot CSV)
- Rows: Personas (20 detailed profiles)
- Columns: Gateways (20 Swiss moving URLs)
- Values: Average conversion confidence %

**Excel-ready**: Import CSVs into Excel/Google Sheets for pivot tables, charts, and conditional formatting.

## 🎯 Verdicts

- **success**: Completed form + reached confirmation page (or dry-run safe point)
- **dropout**: Abandoned funnel (hit max steps/time, left domain, escape clicked)
- **blocker**: Hard error (captcha, server error, no clickable CTAs, click failure)
- **unknown**: Still in progress or unclear outcome

## 🛡️ Trust Signal Detection

Scans page text for Swiss moving industry trust indicators:

**Security:**
- SSL/HTTPS mentions
- Data protection (Datenschutz, protection des données)
- Secure payment badges

**Swiss Origin:**
- Swiss domain (.ch)
- Language: Suisse, Svizzera, Schweiz
- Regional references

**Certifications:**
- Quality seals, verified badges
- Industry memberships
- Awards, certifications

**Social Proof:**
- Years in business
- Customer count/testimonials
- Star ratings, review scores
- Success rate claims

**Guarantees:**
- Money-back, satisfaction guarantees
- Free cancellation

**Trust Score Calculation**: (detected signals / total possible) × 100%

## 📝 Form Filling

Auto-fills common fields with fake but realistic data:

```typescript
{
  email: `${persona.email_prefix}+test${seed}@example.com`,
  firstName: `[TEST] ${persona.first_name}`,
  lastName: `[TEST] ${persona.last_name}`,
  phone: persona.phone || faker.phone.number(),
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  zip: faker.location.zipCode(),
  company: faker.company.name()  // if detected
}
```

**Safe by design**:
- All emails use `example.com` domain
- All names prefixed with `[TEST]`
- Phone numbers from personas.json (non-functional)

## 🧪 Test Limits

Default configuration (adjustable per run in `run.config.json`):
- **maxSteps**: 20 clicks
- **maxTimeMs**: 120000 (2 minutes)
- **dryRun**: true (stops before final submit, recommended)

**Safety**: With `dryRun: true`, no actual form submissions are made. The tool stops at the last step before submission.

## 📸 Screenshots

Each run captures:
- `00-landing.png` — Initial page load (used for AI scoring)
- `01-after-click.png` — After first CTA click
- `02-after-click.png` — After second click
- ...
- `{N}-after-click.png` — After each subsequent click

Stored in: `runs/{run_id}/screenshots/`

**AI Scoring**: Only the landing page screenshot (`00-landing.png`) is sent to OpenAI for evaluation to minimize API costs.

## 🚧 Known Limitations

1. **Selector Fragility**: Text-based selectors can break if copy changes frequently
2. **CAPTCHA Detection**: Automatically marked as `blocker`, no bypass attempted
3. **Dynamic Content**: May miss CTAs loaded via lazy JS (waits 2s for stability)
4. **Rate Limiting**: Parallel runs from same IP may trigger rate limits (add delays)
5. **Multi-Step Forms**: Single-page forms work best; multi-page requires navigation detection
6. **Language Detection**: Relies on gateway `language` field, doesn't auto-detect page language

## 🔄 Next Improvements

### Planned Enhancements

1. **LLM-Enhanced Form Filling**
   - Use GPT-4 Vision to detect field labels and fill appropriately
   - Handle complex multi-step forms intelligently
   - Adaptive filling based on field validation errors

2. **Advanced Friction Detection**
   - Field-level validation message capture
   - Horizontal scroll detection (mobile UX issue)
   - Click-through rate per step
   - Time spent on each field

3. **Learned Selector Patterns**
   - Store successful selectors per gateway
   - Build "known good paths" database
   - Auto-recovery from broken selectors

4. **A/B Test Detection**
   - Identify page variants (DOM diffing)
   - Compare conversion rates across variants
   - Statistical significance testing

5. **Regression Testing**
   - Yesterday vs today comparison
   - Alert on confidence drops >10%
   - Trend charts (7-day, 30-day)

6. **Custom Policy Builder**
   - Define policies in JSON
   - Per-gateway policy override
   - Time-of-day policies (weekday vs weekend behavior)

7. **Network Performance Analysis**
   - HAR file capture and analysis
   - Resource loading waterfall
   - Core Web Vitals tracking (LCP, FID, CLS)
   - API call monitoring

8. **Multi-Language Support**
   - Auto-detect page language
   - Persona language preference matching
   - Multilingual keyword dictionaries

## 📦 Dependencies

**Core:**
- **playwright** (^1.40.0): Browser automation
- **typescript** (^5.3.0): Type safety
- **tsx** (^4.7.0): TypeScript execution

**AI & CLI:**
- **openai** (^4.20.0): GPT-4 Vision API for intelligent scoring
- **commander** (^11.1.0): CLI framework
- **chalk** (^4.1.2): Terminal colors

**Data & Randomness:**
- **zod** (^3.22.4): Schema validation
- **seedrandom** (^3.0.5): Deterministic RNG
- **@faker-js/faker** (^8.3.0): Fake data generation
- **csv-writer** (^1.6.0): CSV generation

## 🧑‍💻 Development

```bash
# Type check
npm run build

# Run single test workflow
npm run dispatch
npm run run -- --run_id <id>
npm run report

# Run 100 tests (stress test)
./scripts/parallel-run.sh 10 100 stress_test_seed

# Clean all runs and reports
rm -rf runs/* reports/*

# Lint (if configured)
npm run lint
```

## 🎓 Usage Tips

1. **Start Small**: Run 5-10 tests first to validate setup before scaling
2. **Use AI Scoring**: Much more accurate than heuristics, worth the API cost
3. **Monitor Blockers**: Investigate any gateway with >20% blocker rate immediately
4. **Trend Analysis**: Run same seed weekly to detect regressions (compare conversion confidence)
5. **Persona Focus**: Disable personas not relevant to your audience (edit `personas.json` → `enabled: false`)
6. **Gateway Priority**: Set higher `priority_weight` for important funnels in weighted mode
7. **Dry Run First**: Always test with `dryRun: true` before enabling submissions
8. **Device Mix**: Adjust mobile/desktop ratio based on your real traffic distribution
9. **Seed Strategy**: Use date-based seeds (`YYYYMMDD`) for daily regression testing
10. **Parallel Tuning**: Start with 2-4 concurrent runs, increase if system handles it

## 📈 Example Workflow

### Daily Regression Testing
```bash
# Run same seed daily, compare results
./scripts/parallel-run.sh 4 20 $(date +%Y%m%d)
npm run report
# Compare today's leaderboard with yesterday's
```

### New Gateway Validation
```bash
# Add new gateway to data/gateways.json
# Run 10 tests with diverse personas
npm run dispatch -- --mode deck
# Check blocker rate, dropoff reasons
```

### Persona Profiling
```bash
# Test single gateway with all 20 personas
# Edit dispatcher to force specific gateway
# Analyze which personas convert best
```

### A/B Test Simulation
```bash
# Run 50 tests on variant A
./scripts/parallel-run.sh 5 50 variant_a_seed
# Run 50 tests on variant B
./scripts/parallel-run.sh 5 50 variant_b_seed
# Compare heatmaps and confidence scores
```

## 🔒 Security & Privacy

- **No real data**: All emails use `example.com`, names prefixed `[TEST]`
- **Dry run default**: No actual form submissions unless explicitly enabled
- **API keys**: Store in `.env` (gitignored), never commit
- **Screenshot privacy**: May contain page content, store securely
- **Rate limiting**: Respect target website's terms of service
- **IP rotation**: Consider proxy rotation for large-scale testing

## 📄 License

MIT

---

**Built with ❤️ for umzugscheck.ch — Production-grade funnel testing at scale**
