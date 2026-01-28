import { readJSON } from '../shared/fs';
import { RunConfig } from '../shared/schemas';
import { runTest } from '../runner';
import { join } from 'path';

async function main() {
  const args = process.argv.slice(2);
  let runId: string | undefined;
  let submit = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--run_id') runId = args[++i];
    if (args[i] === '--submit') submit = true;
  }

  if (!runId) {
    console.error('❌ Missing --run_id');
    process.exit(1);
  }

  const configPath = `./runs/${runId}/run.config.json`;
  const config = await readJSON<RunConfig>(configPath);

  if (!submit) {
    config.dryRun = true;
  }

  console.log(`🚀 Running test: ${runId}`);
  console.log(`   Gateway: ${config.gateway.name}`);
  console.log(`   Persona: ${config.persona.name}`);
  console.log(`   Policy:  ${config.policy}`);
  console.log(`   Dry Run: ${config.dryRun}`);

  const result = await runTest(config, `./runs/${runId}`, config.captureTrace, config.captureNetworkHar);

  console.log(`\n✅ Test complete:`);
  console.log(`   Verdict: ${result.verdict}`);
  console.log(`   Confidence: ${result.conversionConfidence}%`);
  console.log(`   Steps: ${result.stepsCompleted}`);
  if (result.dropoffReason) {
    console.log(`   Dropoff: ${result.dropoffReason}`);
  }

  console.log(`\n📊 Next: npm run report`);
}

main().catch(console.error);
