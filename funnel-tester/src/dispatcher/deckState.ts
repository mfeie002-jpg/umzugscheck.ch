import path from 'path';
import fs from 'fs-extra';
import { DeckState, Gateway } from '../shared/types';
import { createRng, shuffle } from '../shared/random';

const defaultState = (seed: string, gateways: Gateway[]): DeckState => {
  const rng = createRng(`${seed}::deck::0`);
  const order = shuffle(rng, gateways.map((g) => g.gateway_id));
  return { seed, cycle: 0, order, position: 0 };
};

export const loadDeckState = (
  runsDir: string,
  seed: string,
  gateways: Gateway[]
): DeckState => {
  const statePath = path.join(runsDir, '_state', 'deck.json');
  if (!fs.existsSync(statePath)) return defaultState(seed, gateways);
  const state = fs.readJSONSync(statePath) as DeckState;
  if (state.seed !== seed) return defaultState(seed, gateways);
  return state;
};

export const saveDeckState = (runsDir: string, state: DeckState): void => {
  const statePath = path.join(runsDir, '_state', 'deck.json');
  fs.ensureDirSync(path.dirname(statePath));
  fs.writeJSONSync(statePath, state, { spaces: 2 });
};

export const nextGatewayFromDeck = (
  runsDir: string,
  seed: string,
  gateways: Gateway[]
): Gateway => {
  let state = loadDeckState(runsDir, seed, gateways);

  if (state.position >= state.order.length) {
    state.cycle += 1;
    const rng = createRng(`${seed}::deck::${state.cycle}`);
    state.order = shuffle(rng, gateways.map((g) => g.gateway_id));
    state.position = 0;
  }

  const gatewayId = state.order[state.position];
  state.position += 1;
  saveDeckState(runsDir, state);

  const gateway = gateways.find((g) => g.gateway_id === gatewayId);
  return gateway || gateways[0];
};
