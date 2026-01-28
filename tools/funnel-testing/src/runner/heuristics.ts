import { CTA, Policy, Persona, Gateway } from '../shared/schemas';
import { createSeededRandom } from '../shared/rng';

export async function detectCtAs(page: any, gateway?: Gateway): Promise<CTA[]> {
  const ctaElements = await page.evaluate((intent: string | undefined) => {
    const candidates = document.querySelectorAll(
      'button, a[href*="mailto"], a[href*="tel"], [role="button"], input[type="submit"], input[type="button"]'
    );

    return Array.from(candidates).map((el: any, idx: number) => {
      const rect = el.getBoundingClientRect();
      const text = el.textContent?.trim() || el.value || '';
      const fontSize = parseInt(window.getComputedStyle(el).fontSize || '14');
      const href = el.href || '';

      return {
        text,
        href,
        selector: el.getAttribute('class') || el.tagName,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        fontSize,
        isVisible: rect.width > 0 && rect.height > 0,
        index: idx,
      };
    });
  }, gateway?.intent);

  const ctaKeywords = /contact|submit|senden|envoyer|register|anmelden|call|phone|téléphone|anrufen|offert|quote|kostenlos|gratuit|jetzt|maintenant|now/i;
  const escapeKeywords = /close|cancel|back|zurück|fermer|chiudi|abbr|skip|später|plus tard|later/i;
  const intentKeywords = gateway?.intent
    ? new RegExp(gateway.intent.split(' ').join('|'), 'i')
    : null;

  const scored = ctaElements
    .filter((el: any) => el.isVisible)
    .map((el: any) => {
      let score = 0;
      const isCTA = ctaKeywords.test(el.text);
      const isEscape = escapeKeywords.test(el.text);
      const matchesIntent = intentKeywords ? intentKeywords.test(el.text) : false;

      // Size-based scoring
      score += el.fontSize > 16 ? 15 : el.fontSize > 14 ? 10 : 5;
      score += el.width * el.height > 8000 ? 20 : el.width * el.height > 5000 ? 15 : 10;

      // Position-based scoring
      score += el.y < window.innerHeight ? 15 : el.y < window.innerHeight * 2 ? 5 : -10;
      score += el.x < window.innerWidth / 2 ? 5 : 0;

      // Keyword-based scoring
      score += isCTA ? 25 : 0;
      score += matchesIntent ? 30 : 0; // Intent match is highly weighted
      score += isEscape ? -30 : 5;

      // Email/phone links
      score += el.href.includes('mailto') || el.href.includes('tel') ? 20 : 0;

      const type = isEscape ? 'escape' : score > 50 ? 'main' : score > 25 ? 'secondary' : 'unknown';

      return {
        selector: `[data-cta-idx="${el.index}"]`,
        text: el.text,
        type,
        score,
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height,
      };
    });

  return scored.sort((a, b) => b.score - a.score).slice(0, 10);
}

export function selectCTA(
  ctAs: CTA[],
  policy: Policy,
  persona: Persona,
  rng: () => number,
  stepNumber: number
): CTA | null {
  if (ctAs.length === 0) return null;

  const mainCtAs = ctAs.filter((c) => c.type === 'main');
  const secondaryCtAs = ctAs.filter((c) => c.type === 'secondary');
  const escapeCtAs = ctAs.filter((c) => c.type === 'escape');

  if (policy === 'StrictMain') {
    return mainCtAs[0] || secondaryCtAs[0] || ctAs[0];
  }

  if (policy === 'ChaosMonkey') {
    return ctAs[Math.floor(rng() * ctAs.length)];
  }

  // RealisticWeighted with persona click_bias
  const { main_cta, secondary, escape } = persona.click_bias_weights;

  // Step-dependent adjustment: explore early (first 2 steps), commit late (step 3+)
  let adjustedMainWeight = main_cta;
  let adjustedSecondaryWeight = secondary;
  let adjustedEscapeWeight = escape;

  if (stepNumber <= 2) {
    // Early exploration: increase secondary/escape slightly
    adjustedMainWeight *= 0.8;
    adjustedSecondaryWeight *= 1.3;
    adjustedEscapeWeight *= 1.2;
  } else {
    // Late commitment: increase main heavily
    adjustedMainWeight *= 1.4;
    adjustedSecondaryWeight *= 0.7;
    adjustedEscapeWeight *= 0.5;
  }

  // Normalize
  const total = adjustedMainWeight + adjustedSecondaryWeight + adjustedEscapeWeight;
  adjustedMainWeight /= total;
  adjustedSecondaryWeight /= total;
  adjustedEscapeWeight /= total;

  const random = rng();
  let cumulative = 0;

  // Select based on weighted probabilities
  cumulative += adjustedMainWeight;
  if (random < cumulative && mainCtAs.length > 0) {
    return mainCtAs[Math.floor(rng() * mainCtAs.length)];
  }

  cumulative += adjustedSecondaryWeight;
  if (random < cumulative && secondaryCtAs.length > 0) {
    return secondaryCtAs[Math.floor(rng() * secondaryCtAs.length)];
  }

  cumulative += adjustedEscapeWeight;
  if (random < cumulative && escapeCtAs.length > 0) {
    return escapeCtAs[Math.floor(rng() * escapeCtAs.length)];
  }

  // Fallback
  return ctAs[0];
}

export function detectTrustSignals(pageText: string): string[] {
  const signals = [];

  if (/ssl|secure|https|lock|encrypted|sicher/i.test(pageText))
    signals.push('SSL Certificate Mention');
  if (/swiss|switzerland|ch|helvetia|suisse|svizzera/i.test(pageText))
    signals.push('Swiss Origin');
  if (/certified|approved|verified|trusted|seal/i.test(pageText))
    signals.push('Third-party Certification');
  if (/since \d{4}|established/i.test(pageText))
    signals.push('Years in Business');
  if (/\d+ (year|jahr|années?|anni) (experience|erfahrung|expérience|esperienza)/i.test(pageText))
    signals.push('Experience Claim');
  if (/reviews|rating|testimonial|bewertung|avis|testimonianze/i.test(pageText))
    signals.push('Customer Reviews');
  if (/\d+%\s*(satisfaction|success|accuracy)/i.test(pageText)) signals.push('Success Rate');
  if (/money.?back|guarantee|garantie|garanzia/i.test(pageText))
    signals.push('Money-Back Guarantee');

  return signals;
}

export function detectValidationError(pageText: string): boolean {
  const errorPatterns = /error|invalid|required|must|muss|erforderlich|erreur|obligatoire/i;
  return errorPatterns.test(pageText);
}

export function detectFrictionSignals(page: any): string[] {
  const signals = [];
  // Would analyze overflow, layout shifts, missing fields
  return signals;
}

export function isLikelyFinalSubmit(cta: CTA): boolean {
  const finalKeywords = /submit|senden|envoyer|send|inviar|registrar|anmelden|s'inscrire/i;
  return finalKeywords.test(cta.text);
}

export function isSuccessPage(pageTitle: string, pageUrl: string): boolean {
  const successPatterns = /danke|thank|merci|grazie|success|confirmed|confirmation|vielen dank/i;
  return successPatterns.test(pageTitle) || successPatterns.test(pageUrl);
}
