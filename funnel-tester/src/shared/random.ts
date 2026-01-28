import seedrandom from 'seedrandom';

export const createRng = (seed: string): seedrandom.PRNG => seedrandom(seed);

export const pickWeighted = <T>(
  rng: seedrandom.PRNG,
  items: T[],
  getWeight: (item: T) => number
): T => {
  const total = items.reduce((sum, item) => sum + getWeight(item), 0);
  let roll = rng() * total;
  for (const item of items) {
    roll -= getWeight(item);
    if (roll <= 0) return item;
  }
  return items[0];
};

export const shuffle = <T>(rng: seedrandom.PRNG, items: T[]): T[] => {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
