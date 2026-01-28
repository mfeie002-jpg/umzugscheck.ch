import { Gateway, Persona, DispatchMode, Policy, RunConfig } from '../shared/schemas';
import { createSeededRandom, weightedRandom, shuffleArray } from '../shared/rng';
import { readJSON, writeJSON, fileExists, ensureDir } from '../shared/fs';
import { dirname, join } from 'path';

export class DeckState {
  remaining: string[] = [];
  seed: number = 0;
  lastUpdated: string = new Date().toISOString();
}

export async function loadOrInitDeck(
  deckPath: string,
  enabledGateways: string[],
  seed: number
): Promise<DeckState> {
  if (await fileExists(deckPath)) {
    const state = await readJSON<DeckState>(deckPath);
    return state;
  }

  const rng = createSeededRandom(`deck::init::${seed}`);
  const shuffled = shuffleArray(enabledGateways, rng);

  const state = new DeckState();
  state.remaining = shuffled;
  state.seed = seed;
  state.lastUpdated = new Date().toISOString();

  await ensureDir(dirname(deckPath));
  await writeJSON(deckPath, state);
  return state;
}

export async function saveDeck(deckPath: string, state: DeckState) {
  await ensureDir(dirname(deckPath));
  await writeJSON(deckPath, state);
}

export async function dispatchAssignment(
  mode: DispatchMode,
  gateways: Gateway[],
  personas: Persona[],
  runId: string,
  seed: number,
  deckPath: string,
  matchLanguage = true
): Promise<{ gateway: Gateway; persona: Persona; policy: Policy }> {
  const dispatchRng = createSeededRandom(`${runId}::${seed}::dispatch`);
  const enabledGateways = gateways.filter((g) => g.enabled).map((g) => g.gateway_id);
  const enabledPersonas = personas.filter((p) => p.enabled);

  let selectedGatewayId: string;

  if (mode === 'deck') {
    const deckState = await loadOrInitDeck(deckPath, enabledGateways, seed);
    if (deckState.remaining.length === 0) {
      deckState.remaining = shuffleArray(enabledGateways, dispatchRng);
    }
    selectedGatewayId = deckState.remaining.pop()!;
    deckState.lastUpdated = new Date().toISOString();
    await saveDeck(deckPath, deckState);
  } else if (mode === 'weighted') {
    const validGateways = gateways.filter((g) => g.enabled);
    const selectedGateway = weightedRandom(validGateways, dispatchRng);
    selectedGatewayId = selectedGateway.gateway_id;
  } else {
    // random
    const randomIdx = Math.floor(dispatchRng() * enabledGateways.length);
    selectedGatewayId = enabledGateways[randomIdx];
  }

  const gateway = gateways.find((g) => g.gateway_id === selectedGatewayId);
  
  if (!gateway) {
    throw new Error(`Gateway not found: ${selectedGatewayId}`);
  }

  let selectedPersona: Persona;
  if (matchLanguage && gateway.language) {
    const sameLanguagePersonas = enabledPersonas.filter((p) => p.language === gateway.language);
    selectedPersona =
      sameLanguagePersonas.length > 0
        ? sameLanguagePersonas[Math.floor(dispatchRng() * sameLanguagePersonas.length)]
        : enabledPersonas[Math.floor(dispatchRng() * enabledPersonas.length)];
  } else {
    selectedPersona = enabledPersonas[Math.floor(dispatchRng() * enabledPersonas.length)];
  }

  const policies: Policy[] = ['StrictMain', 'RealisticWeighted', 'ChaosMonkey'];
  const selectedPolicy = policies[Math.floor(dispatchRng() * policies.length)];

  return {
    gateway,
    persona: selectedPersona,
    policy: selectedPolicy,
  };
}
