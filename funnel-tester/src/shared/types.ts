export type Language = 'de' | 'en' | 'fr';
export type DeviceType = 'mobile' | 'desktop';
export type PathPolicy = 'StrictMain' | 'RealisticWeighted' | 'ChaosMonkey';
export type DispatchMode = 'Deck' | 'Pure' | 'Weighted';

export interface Gateway {
  gateway_id: string;
  keyword_cluster: string;
  landing_url: string;
  intent: string;
  language: Language;
  expected_outcomes: string[];
  top_user_intents: string[];
  priority_weight?: number;
  enabled?: boolean;
}

export interface Persona {
  persona_id: string;
  name: string;
  traits: string[];
  budget: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  trust_level: 'low' | 'medium' | 'high';
  device: DeviceType;
  language: Language;
  click_bias_weights: {
    main_cta: number;
    secondary: number;
    escape: number;
  };
  enabled?: boolean;
}

export interface RunOptions {
  max_steps: number;
  max_time_ms: number;
  dry_run: boolean;
  headless: boolean;
  record_trace: boolean;
  record_har: boolean;
}

export interface RunConfig {
  run_id: string;
  seed: string;
  created_at: string;
  gateway: Gateway;
  persona: Persona;
  policy: PathPolicy;
  mode: DispatchMode;
  options: RunOptions;
}

export interface OutcomeDefinition {
  outcome_id: string;
  name: string;
  language: Language;
  keywords: string[];
  negative_keywords?: string[];
}

export interface StepLog {
  step_number: number;
  action: string;
  url: string;
  screenshot_path: string;
  timestamp: string;
}

export interface TenSecondTest {
  title: string;
  h1: string;
  trust_signals: string[];
  top_ctas: string[];
}

export interface RunResult {
  run_id: string;
  config: RunConfig;
  success: boolean;
  verdict: 'WINNER' | 'PROMISING' | 'FAIL' | 'BLOCKER';
  scores: {
    intent_match: number;
    trust: number;
    friction: number;
    clarity: number;
    mobile_usability: number;
    conversion_confidence: number;
    marketing_fit: number;
  };
  ten_second_test: TenSecondTest;
  steps: StepLog[];
  friction_points: string[];
  marketing: {
    expected_outcomes: string[];
    detected_offers: string[];
    missing_offers: string[];
    unexpected_offers: string[];
    top_options: string[];
    notes: string[];
  };
  dropoff_reason?: string;
  fix_recommendation?: string;
  duration_ms: number;
}

export interface DeckState {
  seed: string;
  cycle: number;
  order: string[];
  position: number;
}
