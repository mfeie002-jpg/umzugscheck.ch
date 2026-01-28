# Randomized Multi-Agent Funnel Testing Tool (Marketing Funnel Focus)

Deterministic, reproducible marketing-funnel testing for umzugscheck.ch using Playwright. This tool validates that each high-traffic landing page presents the right offer options for real customer goals.

## Install

```bash
npm install
npx playwright install
```

## Commands

### Dispatch (create assignments)
```bash
npm run dispatch -- --seed "release_v2.1" --mode weighted -n 5
```

Options:\n- `--mode deck|random|weighted` (default: weighted)\n- `--all-gateways` to create exactly one run per enabled gateway\n- `--no-match-language` to allow cross-language personas\n- `--submit` to allow final form submission (default is dry-run)\n- `--headed` to see the browser\n- `--max-steps 8`, `--max-time-ms 60000`

### Run (execute a specific assignment)
```bash
npm run run -- --run_id run_release_v2.1_0
```

### Report (aggregate results)
```bash
npm run report
```

Outputs in `reports/`:
- `summary.csv`
- `leaderboard.md`
- `persona_gateway_heatmap.csv`
- `dropoffs.csv`

## Data Inputs

### gateways.json
Required fields per gateway:
- `gateway_id`
- `keyword_cluster`
- `landing_url`
- `intent`
- `language` (`de|en|fr`)
- `expected_outcomes` (array of outcome_id)
- `top_user_intents` (free text list)
- `priority_weight` (optional)
- `enabled` (default true)

### personas.json
Required fields per persona:
- `persona_id`
- `name`
- `traits`
- `budget` (`low|medium|high`)
- `urgency` (`low|medium|high`)
- `trust_level` (`low|medium|high`)
- `device` (`mobile|desktop`)
- `language` (`de|en|fr`)
- `click_bias_weights` (main_cta/secondary/escape)
- `enabled` (default true)

### outcomes.json
Defines the marketing goals the agent should detect on a page.

Fields:
- `outcome_id` (stable key, e.g. `move_only`, `move_cleaning`)
- `name`
- `language` (`de|en|fr`)
- `keywords` (supports `+` for AND, e.g. `umzug+reinigung`)
- `negative_keywords` (optional)

## Included Definition (Ready to Run)
- 20 enabled gateways derived from `public/sitemap.xml`, mapped to the most relevant marketing outcomes.
- 20 personas reflecting core customer segments.
- Outcomes taxonomy aligned to key revenue paths (move, move+cleaning, office, storage, pricing, etc.).

## Seeded Randomness
Determinism is enforced at two layers:
- Dispatcher seed: `${seed}::${run_id}::dispatch`
- Runner seed: `${seed}::${run_id}::run`

Same `seed` + `run_id` = identical persona/gateway/policy assignment and click decisions.

## Run 100 tests
```bash
npm run dispatch -- --seed "nightly" -n 100 --mode weighted
Get-ChildItem runs | ForEach-Object { npm run run -- --run_id $_.Name }
```

## Interpret Reports
- `summary.csv`: full run list with scores, verdicts, dropoff reason, marketing fit
- `leaderboard.md`: top/bottom gateways by conversion confidence
- `persona_gateway_heatmap.csv`: pivot-ready matrix for persona x gateway
- `dropoffs.csv`: most common failures

## Schemas
JSON schemas live in `schemas/`:
- `runConfig.schema.json`
- `runResult.schema.json`

## Next Improvements
1. Smarter offer detection using stable selectors per gateway.
2. Parallel run execution with a worker pool.
3. More nuanced policy weights (explore early, commit later).
4. CI nightly smoke suite and regression diffing.
5. Field-level friction capture and DOM snapshotting.

