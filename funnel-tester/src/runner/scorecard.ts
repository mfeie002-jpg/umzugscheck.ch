import { RunConfig } from '../shared/types';

export const scoreRun = (
  config: RunConfig,
  frictionPoints: string[],
  reachedSuccess: boolean,
  steps: number,
  trustSignals: number,
  marketingFit: number
): {
  intent_match: number;
  trust: number;
  friction: number;
  clarity: number;
  mobile_usability: number;
  conversion_confidence: number;
  marketing_fit: number;
} => {
  const intent_match = reachedSuccess ? 5 : 3;
  const trust = Math.min(5, Math.max(1, trustSignals));
  const friction = Math.max(1, Math.min(5, 6 - Math.min(5, frictionPoints.length + Math.floor(steps / 3))));
  const clarity = config.gateway.intent ? 4 : 3;
  const mobile_usability = config.persona.device === 'mobile' ? 4 : 5;
  const conversion_confidence = reachedSuccess ? 5 : Math.max(1, 4 - Math.floor(steps / 2));

  return {
    intent_match,
    trust,
    friction,
    clarity,
    mobile_usability,
    conversion_confidence,
    marketing_fit: marketingFit
  };
};
