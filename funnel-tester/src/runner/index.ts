import { chromium, Page } from 'playwright';
import fs from 'fs-extra';
import path from 'path';
import seedrandom from 'seedrandom';
import { RunConfig, RunResult, StepLog, OutcomeDefinition } from '../shared/types';
import { tenSecondTest, getCtaCandidates, detectSuccess, detectFriction } from './heuristics';
import { fillVisibleInputs } from './formFiller';
import { scoreRun } from './scorecard';
import { detectOffers, evaluateMarketingFit, extractTopOptions } from './marketing';

export class Runner {
  private rng: seedrandom.PRNG;

  constructor(private config: RunConfig, private baseDir: string) {
    this.rng = seedrandom(`${config.seed}::${config.run_id}::run`);
  }

  private async captureStep(page: Page, stepNum: number, action: string): Promise<StepLog> {
    const safeAction = action.replace(/[^a-zA-Z0-9_-]/g, '_');
    const screenshotName = `${String(stepNum).padStart(2, '0')}-${safeAction}.png`;
    const screenshotPath = path.join(this.baseDir, 'screenshots', screenshotName);

    await page.screenshot({ path: screenshotPath, fullPage: false });

    return {
      step_number: stepNum,
      action,
      url: page.url(),
      screenshot_path: screenshotPath,
      timestamp: new Date().toISOString()
    };
  }

  private pickCtaIndex(count: number, policy: RunConfig['policy']): number {
    if (count === 0) return 0;
    if (policy === 'StrictMain') return 0;
    if (policy === 'ChaosMonkey') return Math.floor(this.rng() * count);

    const { main_cta, secondary } = this.config.persona.click_bias_weights;
    const roll = this.rng();
    if (roll < main_cta) return 0;
    if (roll < main_cta + secondary) return Math.min(1, count - 1);
    return Math.min(2, count - 1);
  }

  public async execute(): Promise<RunResult> {
    const { gateway, persona, policy, options } = this.config;
    const isMobile = persona.device === 'mobile';

    await fs.ensureDir(path.join(this.baseDir, 'screenshots'));
    await fs.ensureDir(path.join(this.baseDir, 'videos'));

    const browser = await chromium.launch({ headless: options.headless });
    const harPath = options.record_har ? path.join(this.baseDir, 'network.har') : undefined;
    const context = await browser.newContext({
      viewport: isMobile ? { width: 375, height: 667 } : { width: 1280, height: 800 },
      locale: persona.language,
      userAgent: isMobile
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        : undefined,
      recordVideo: { dir: path.join(this.baseDir, 'videos') },
      recordHar: harPath ? { path: harPath } : undefined
    });

    if (options.record_trace) {
      await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    }

    const page = await context.newPage();
    const steps: StepLog[] = [];
    const frictionPoints: string[] = [];
    const startTime = Date.now();
    let verdict: RunResult['verdict'] = 'PROMISING';
    let dropoffReason = '';

    let tenSecond: RunResult['ten_second_test'] = { title: '', h1: '', trust_signals: [], top_ctas: [] };
    let marketingScore = 3;
    let marketing = {
      expected_outcomes: gateway.expected_outcomes,
      detected_offers: [] as string[],
      missing_offers: [] as string[],
      unexpected_offers: [] as string[],
      top_options: [] as string[],
      notes: [] as string[]
    };

    try {
      await page.goto(gateway.landing_url, { timeout: 20000, waitUntil: 'domcontentloaded' });
      steps.push(await this.captureStep(page, 0, 'landing'));
      tenSecond = await tenSecondTest(page);

      const rootDir = path.join(this.baseDir, '..', '..');
      const outcomesPath = path.join(rootDir, 'data', 'outcomes.json');
      let outcomes: OutcomeDefinition[] = [];
      if (fs.existsSync(outcomesPath)) {
        outcomes = fs.readJSONSync(outcomesPath) as OutcomeDefinition[];
      }
      const languageOutcomes = outcomes.filter((o) => o.language === gateway.language);
      const bodyText = await page.locator('body').innerText();
      const detected = detectOffers(`${bodyText} ${tenSecond.top_ctas.join(' ')}`, languageOutcomes);
      const marketingEval = evaluateMarketingFit(gateway.expected_outcomes, detected);
      const topOptions = await extractTopOptions(page);
      marketingScore = marketingEval.score;
      marketing = {
        expected_outcomes: gateway.expected_outcomes,
        detected_offers: detected,
        missing_offers: marketingEval.missing,
        unexpected_offers: marketingEval.unexpected,
        top_options: topOptions,
        notes: marketingEval.notes
      };

      const host = new URL(gateway.landing_url).host;

      for (let step = 1; step <= options.max_steps; step += 1) {
        const currentUrl = page.url();
        if (!currentUrl.includes(host)) {
          verdict = 'FAIL';
          dropoffReason = 'Escaped to different domain';
          break;
        }

        await fillVisibleInputs(page);

        const ctas = await getCtaCandidates(page);
        if (ctas.length === 0) {
          verdict = 'FAIL';
          dropoffReason = 'No actionable CTAs found';
          break;
        }

        const targetIndex = this.pickCtaIndex(ctas.length, policy);
        const target = ctas[targetIndex] || ctas[0];
        const actionLabel = `click:${target.text.slice(0, 24)}`;

        if (options.dry_run && /submit|send|request|anfrage|offerte|book|quote/i.test(target.text)) {
          verdict = 'PROMISING';
          dropoffReason = 'Dry run stopped before final submit';
          steps.push(await this.captureStep(page, step, 'dry_run_stop'));
          break;
        }

        await target.locator.click({ timeout: 8000 });
        await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
        steps.push(await this.captureStep(page, step, actionLabel));

        const friction = await detectFriction(page);
        frictionPoints.push(...friction);

        if (await detectSuccess(page)) {
          verdict = 'WINNER';
          break;
        }

        if (Date.now() - startTime > options.max_time_ms) {
          verdict = 'FAIL';
          dropoffReason = 'Max time exceeded';
          break;
        }
      }
    } catch (error: any) {
      verdict = 'BLOCKER';
      dropoffReason = error?.message || 'Unknown error';
      await page.screenshot({ path: path.join(this.baseDir, 'error.png') });
    } finally {
      if (options.record_trace) {
        await context.tracing.stop({ path: path.join(this.baseDir, 'trace.zip') });
      }
      await context.close();
      await browser.close();
    }

    const scores = scoreRun(
      this.config,
      frictionPoints,
      verdict === 'WINNER',
      steps.length,
      tenSecond.trust_signals.length,
      marketingScore
    );
    const fixRecommendation = verdict === 'FAIL'
      ? 'Review CTA visibility and simplify form steps.'
      : verdict === 'BLOCKER'
        ? 'Investigate blocking errors, CAPTCHAs, or server issues.'
        : undefined;

    return {
      run_id: this.config.run_id,
      config: this.config,
      success: verdict === 'WINNER',
      verdict,
      scores,
      ten_second_test: tenSecond,
      steps,
      friction_points: Array.from(new Set(frictionPoints)),
      marketing,
      dropoff_reason: dropoffReason,
      fix_recommendation: fixRecommendation,
      duration_ms: Date.now() - startTime
    };
  }
}

