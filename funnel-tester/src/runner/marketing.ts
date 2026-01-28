import { OutcomeDefinition } from '../shared/types';

const normalize = (text: string): string => text.toLowerCase();

export const detectOffers = (
  text: string,
  outcomes: OutcomeDefinition[]
): string[] => {
  const normalized = normalize(text);
  const matches: string[] = [];

  for (const outcome of outcomes) {
    const hasKeyword = outcome.keywords.some((kw) => {
      const token = kw.toLowerCase();
      if (token.includes('+')) {
        return token
          .split('+')
          .map((part) => part.trim())
          .every((part) => part && normalized.includes(part));
      }
      return normalized.includes(token);
    });
    if (!hasKeyword) continue;
    if (outcome.negative_keywords && outcome.negative_keywords.some((kw) => normalized.includes(kw.toLowerCase()))) {
      continue;
    }
    matches.push(outcome.outcome_id);
  }

  return Array.from(new Set(matches));
};

export const evaluateMarketingFit = (
  expected: string[],
  detected: string[]
): { missing: string[]; unexpected: string[]; score: number; notes: string[] } => {
  const expectedSet = new Set(expected);
  const detectedSet = new Set(detected);

  const missing = expected.filter((id) => !detectedSet.has(id));
  const unexpected = detected.filter((id) => !expectedSet.has(id));

  let score = 3;
  if (missing.length === 0 && unexpected.length === 0) score = 5;
  else if (missing.length === 0) score = 4;
  else if (missing.length >= expected.length) score = 1;
  else score = 2;

  const notes: string[] = [];
  if (missing.length > 0) notes.push('Expected offers not clearly visible on landing page.');
  if (unexpected.length > 0) notes.push('Landing page shows offers not aligned to expected outcome.');

  return { missing, unexpected, score, notes };
};

export const extractTopOptions = async (page: import('playwright').Page): Promise<string[]> => {
  const selectors = [
    'nav a',
    'main a',
    'section a',
    'button',
    '[role="button"]',
    '.card a',
    '.tile a'
  ];
  const candidates = await page.$$eval(selectors.join(','), (nodes) => {
    const seen = new Set<string>();
    const results: string[] = [];
    for (const node of nodes) {
      const text = (node.textContent || '').trim().replace(/\s+/g, ' ');
      if (!text || text.length < 3) continue;
      if (seen.has(text)) continue;
      seen.add(text);
      results.push(text);
      if (results.length >= 20) break;
    }
    return results;
  });

  return candidates.slice(0, 10);
};
