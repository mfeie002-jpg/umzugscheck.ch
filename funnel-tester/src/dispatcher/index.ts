import { Gateway, Persona, RunConfig, PathPolicy, DispatchMode, RunOptions } from '../shared/types';
import { createRng, pickWeighted } from '../shared/random';
import { nextGatewayFromDeck } from './deckState';

interface DispatchParams {
  run_id: string;
  seed: string;
  gateways: Gateway[];
  personas: Persona[];
  mode: DispatchMode;
  runs_dir: string;
  match_language: boolean;
  options: RunOptions;
}

const defaultOptions: RunOptions = {
  max_steps: 8,
  max_time_ms: 60000,
  dry_run: true,
  headless: true,
  record_trace: true,
  record_har: false
};

export class Dispatcher {
  public createAssignment(params: DispatchParams): RunConfig {
    const {
      run_id,
      seed,
      gateways,
      personas,
      mode,
      runs_dir,
      match_language,
      options
    } = params;

    const enabledGateways = gateways.filter((g) => g.enabled !== false);
    const enabledPersonas = personas.filter((p) => p.enabled !== false);

    const rng = createRng(`${seed}::${run_id}::dispatch`);

    let selectedGateway: Gateway;
    if (mode === 'Deck') {
      selectedGateway = nextGatewayFromDeck(runs_dir, seed, enabledGateways);
    } else if (mode === 'Weighted') {
      selectedGateway = pickWeighted(rng, enabledGateways, (g) => g.priority_weight || 1);
    } else {
      selectedGateway = enabledGateways[Math.floor(rng() * enabledGateways.length)];
    }

    const languagePool = match_language
      ? enabledPersonas.filter((p) => p.language === selectedGateway.language)
      : enabledPersonas;
    const personaPool = languagePool.length > 0 ? languagePool : enabledPersonas;
    const selectedPersona = personaPool[Math.floor(rng() * personaPool.length)];

    const policyRoll = rng();
    let policy: PathPolicy = 'RealisticWeighted';
    if (policyRoll < 0.1) policy = 'StrictMain';
    else if (policyRoll > 0.9) policy = 'ChaosMonkey';

    return {
      run_id,
      seed,
      created_at: new Date().toISOString(),
      gateway: selectedGateway,
      persona: selectedPersona,
      policy,
      mode,
      options: { ...defaultOptions, ...options }
    };
  }
}
