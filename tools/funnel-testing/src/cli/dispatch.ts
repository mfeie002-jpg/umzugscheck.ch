import { readJSON, writeJSON, ensureDir } from '../shared/fs';
import { dispatchAssignment } from '../dispatcher';
import { Gateway, Persona, DispatchMode } from '../shared/schemas';
import { randomUUID } from 'crypto';
import { join } from 'path';

async function main() {
  const args = process.argv.slice(2);
  let mode: DispatchMode = 'deck';
  let seed: string | number = Math.floor(Math.random() * 1000000).toString();
  let matchLanguage = true;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--mode' && i + 1 < args.length) {
      mode = (args[++i] as DispatchMode) || 'deck';
    }
    if (args[i] === '--seed' && i + 1 < args.length) {
      const seedArg = args[++i];
      seed = isNaN(Number(seedArg)) ? seedArg : Number(seedArg);
    }
    if (args[i] === '--no-match_language') {
      matchLanguage = false;
    }
  }

  const gateways = await readJSON<Gateway[]>('./data/gateways.json');
  const personas = await readJSON<Persona[]>('./data/personas.json');

  const runId = randomUUID();
  const deckPath = './runs/_state/deck.json';

  console.log(`📋 Dispatching run: ${runId}`);
  console.log(`   Mode: ${mode}`);
  console.log(`   Seed: ${seed}`);

  const assignment = await dispatchAssignment(
    mode,
    gateways,
    personas,
    runId,
    seed,
    deckPath,
    matchLanguage
  );

  const runDir = `./runs/${runId}`;
  await ensureDir(runDir);

  const runConfig = {
    run_id: runId,
    seed,
    gateway: assignment.gateway,
    persona: assignment.persona,
    policy: assignment.policy,
    timestamp: new Date().toISOString(),
    maxSteps: 20,
    maxTimeMs: 120000,
    dryRun: true,
    captureTrace: false,
    captureNetworkHar: false,
  };

  await writeJSON(join(runDir, 'run.config.json'), runConfig);
  await writeJSON(join(runDir, 'assignment.snapshot.json'), assignment);

  console.log(`\n✅ Assignment complete:`);
  console.log(`   Gateway: ${assignment.gateway.name} (${assignment.gateway.gateway_id})`);
  console.log(`   Persona: ${assignment.persona.name} (${assignment.persona.persona_id})`);
  console.log(`   Policy:  ${assignment.policy}`);
  console.log(`\n📍 Next: npm run run -- --run_id ${runId}`);
}

main().catch(console.error);
