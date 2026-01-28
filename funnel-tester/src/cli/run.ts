import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { Runner } from '../runner';
import { RunConfig } from '../shared/types';
import { writeJson } from '../shared/fs';

const program = new Command();
const ROOT = path.join(__dirname, '..', '..');
const RUNS_DIR = path.join(ROOT, 'runs');

program
  .name('run')
  .description('Execute a specific run')
  .requiredOption('--run_id <id>', 'Run ID to execute')
  .action(async (options) => {
    const runId = options.run_id;
    const runDir = path.join(RUNS_DIR, runId);

    if (!fs.existsSync(runDir)) {
      console.error(chalk.red(`Run ID ${runId} not found.`));
      process.exit(1);
    }

    const configPath = path.join(runDir, 'run.config.json');
    const config = fs.readJSONSync(configPath) as RunConfig;

    const runner = new Runner(config, runDir);
    const result = await runner.execute();

    writeJson(path.join(runDir, 'result.json'), result);
    console.log(chalk.green(`Run Complete. Verdict: ${result.verdict}`));
  });

program.parse(process.argv);
