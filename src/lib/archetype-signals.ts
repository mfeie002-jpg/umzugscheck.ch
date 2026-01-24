export type ArchetypeType =
  | "security_seeker"
  | "efficiency_expert"
  | "value_hunter"
  | "overwhelmed_mover";

export interface BehaviorSignal {
  scrollSpeed: number;
  clickPattern: number;
  fieldFocusOrder: string[];
  dwellTime: number;
}

const scoreFunctions: Record<ArchetypeType, (signal: BehaviorSignal) => number> = {
  security_seeker: (signal) =>
    Math.min(1, (signal.fieldFocusOrder.length >= 3 ? 0.5 : 0) + (signal.dwellTime >= 35000 ? 0.5 : 0)),
  efficiency_expert: (signal) =>
    Math.min(
      1,
      (signal.scrollSpeed >= 1 ? 0.45 : 0) +
        (signal.clickPattern >= 3 ? 0.35 : 0) +
        (signal.fieldFocusOrder.length <= 2 ? 0.2 : 0)
    ),
  value_hunter: (signal) =>
    Math.min(
      1,
      (signal.clickPattern >= 2 ? 0.4 : 0) +
        (signal.fieldFocusOrder.some((field) => field.includes("price") || field.includes("budget")) ? 0.4 : 0.1) +
        (signal.dwellTime >= 20000 ? 0.2 : 0)
    ),
  overwhelmed_mover: (signal) =>
    Math.min(
      1,
      (signal.dwellTime >= 40000 ? 0.5 : 0) +
        (signal.fieldFocusOrder.length >= 5 ? 0.3 : 0) +
        (signal.scrollSpeed <= 0.3 ? 0.2 : 0)
    ),
};

const computeScores = (signal: BehaviorSignal): Record<ArchetypeType, number> => {
  const result: Record<ArchetypeType, number> = {
    security_seeker: 0,
    efficiency_expert: 0,
    value_hunter: 0,
    overwhelmed_mover: 0,
  };

  for (const archetype of Object.keys(scoreFunctions) as ArchetypeType[]) {
    result[archetype] = scoreFunctions[archetype](signal);
  }

  return result;
};

export const calculateArchetypeScore = (signal: BehaviorSignal): ArchetypeType => {
  const scores = computeScores(signal);
  let top: ArchetypeType = "efficiency_expert";
  let maxScore = -Infinity;
  for (const archetype of Object.keys(scores) as ArchetypeType[]) {
    if (scores[archetype] >= maxScore) {
      maxScore = scores[archetype];
      top = archetype;
    }
  }
  return top;
};

export const calculateArchetypeConfidence = (signal: BehaviorSignal, archetype: ArchetypeType): number => {
  const scores = computeScores(signal);
  const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
  if (total === 0) {
    return 0;
  }
  return Math.min(1, scores[archetype] / total);
};
