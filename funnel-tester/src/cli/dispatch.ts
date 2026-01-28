import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { Dispatcher } from '../dispatcher';
import { Gateway, Persona, DispatchMode, RunOptions } from '../shared/types';
import { writeJson } from '../shared/fs';

const program = new Command();
const ROOT = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'data');
const RUNS_DIR = path.join(ROOT, 'runs');

const loadData = () => {
  const gateways: Gateway[] = fs.readJSONSync(path.join(DATA_DIR, 'gateways.json'));
  const personas: Persona[] = fs.readJSONSync(path.join(DATA_DIR, 'personas.json'));
  return { gateways, personas };
};

const toMode = (mode: string): DispatchMode => {
  if (mode === 'deck') return 'Deck';
  if (mode === 'random') return 'Pure';
  return 'Weighted';
};

const buildOptions = (opts: any): RunOptions => ({
  max_steps: parseInt(opts.maxSteps, 10),
  max_time_ms: parseInt(opts.maxTimeMs, 10),
  dry_run: !opts.submit,
  headless: !opts.headed,
  record_trace: !opts.noTrace,
  record_har: !!opts.har
});

program
  .name('dispatch')
  .description('Create run assignments')
  .option('-n, --number <num>', 'Number of runs to generate', '1')
  .option('--seed <seed>', 'Random seed', Date.now().toString())
  .option('--mode <mode>', 'deck | random | weighted', 'weighted')
  .option('--no-match-language', 'Disable language matching between gateway and persona')
  .option('--max-steps <num>', 'Max steps per run', '8')
  .option('--max-time-ms <num>', 'Max time per run (ms)', '60000')
  .option('--submit', 'Allow final submit (disable dry-run)')
  .option('--headed', 'Run browser headed')
  .option('--no-trace', 'Disable Playwright trace capture')
  .option('--har', 'Record HAR file')
  .option('--all-gateways', 'Create exactly one run per enabled gateway')
  .action((options) => {
    const { gateways, personas } = loadData();
    const dispatcher = new Dispatcher();
    const count = options.allGateways
      ? gateways.filter((g) => g.enabled !== false).length
      : parseInt(options.number, 10);

    for (let i = 0; i < count; i += 1) {
      let runId = `run_${options.seed}_${i}`;
      let runDir = path.join(RUNS_DIR, runId);
      let suffix = 1;
      while (fs.existsSync(runDir)) {
        runId = `run_${options.seed}_${i}_dup${suffix}`;
        runDir = path.join(RUNS_DIR, runId);
        suffix += 1;
      }

      const config = dispatcher.createAssignment({
        run_id: runId,
        seed: options.seed,
        gateways,
        personas,
        mode: toMode(options.mode),
        runs_dir: RUNS_DIR,
        match_language: options.matchLanguage,
        options: buildOptions(options)
      });

      fs.ensureDirSync(runDir);
      fs.ensureDirSync(path.join(runDir, 'screenshots'));
      writeJson(path.join(runDir, 'run.config.json'), config);
      writeJson(path.join(runDir, 'assignment.snapshot.json'), {
        run_id: runId,
        seed: options.seed,
        gateway_id: config.gateway.gateway_id,
        persona_id: config.persona.persona_id,
        policy: config.policy,
        mode: config.mode,
        created_at: config.created_at
      });

      console.log(
        chalk.green(
          `[Dispatched] ${runId} -> ${config.gateway.landing_url} (${config.persona.name})`
        )
      );
    }
  });

program.parse(process.argv);
