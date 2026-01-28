import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { generateReports } from '../reporting';
import { Gateway, Persona } from '../shared/types';

const program = new Command();
const ROOT = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'data');
const RUNS_DIR = path.join(ROOT, 'runs');
const REPORTS_DIR = path.join(ROOT, 'reports');

program
  .name('report')
  .description('Aggregate run results')
  .option('--run-prefix <prefix>', 'Only include runs whose folder starts with this prefix')
  .action(() => {
    const gateways: Gateway[] = fs.readJSONSync(path.join(DATA_DIR, 'gateways.json'));
    const personas: Persona[] = fs.readJSONSync(path.join(DATA_DIR, 'personas.json'));

    generateReports({
      runsDir: RUNS_DIR,
      reportsDir: REPORTS_DIR,
      gateways,
      personas,
      runPrefix: program.opts().runPrefix
    });
  });

program.parse(process.argv);
