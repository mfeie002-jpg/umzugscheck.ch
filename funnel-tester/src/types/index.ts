export type Language = 'de' | 'en' | 'fr';
export type DeviceType = 'mobile' | 'desktop';
export type PathPolicy = 'StrictMain' | 'RealisticWeighted' | 'ChaosMonkey';

export interface Gateway {
  gateway_id: string;
  url: string;
  intent: string;
  language: Language;
  weight: number;
}

export interface Persona {
  persona_id: string;
  name: string;
  device: DeviceType;
  language: Language;
  traits: string[];
  click_bias: {
    main_cta: number;
    secondary: number;
    escape: number;
  };
}

export interface RunConfig {
  run_id: string;
  seed: string;
  gateway: Gateway;
  persona: Persona;
  policy: PathPolicy;
  mode: 'Deck' | 'Pure' | 'Weighted';
}

export interface StepLog {
  step_number: number;
  action: string;
  url: string;
  screenshot_path: string;
  timestamp: string;
}

export interface RunResult {
  run_id: string;
  config: RunConfig;
  success: boolean;
  verdict: 'WINNER' | 'PROMISING' | 'FAIL' | 'BLOCKER';
  scores: {
    intent_match: number;
    friction: number;
    clarity: number;
    mobile_usability: number;
  };
  steps: StepLog[];
  dropoff_reason?: string;
  duration_ms: number;
}
