import { createHash } from 'crypto';
import seedrandom from 'seedrandom';

export function createSeededRandom(seed_material: string) {
  const hash = createHash('sha256').update(seed_material).digest('hex');
  const numericSeed = parseInt(hash.slice(0, 8), 16);
  return seedrandom(String(numericSeed));
}

export function weightedRandom<T extends { priority_weight?: number }>(
  items: T[],
  rng: () => number
): T {
  const weighted = items.map((item) => ({
    item,
    weight: item.priority_weight || 1,
  }));

  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
  let random = rng() * totalWeight;

  for (const { item, weight } of weighted) {
    random -= weight;
    if (random <= 0) return item;
  }

  return weighted[weighted.length - 1].item;
}

export function shuffleArray<T>(arr: T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
