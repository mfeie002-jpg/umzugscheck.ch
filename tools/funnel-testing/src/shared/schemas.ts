import { z } from 'zod';

export const PolicySchema = z.enum(['StrictMain', 'RealisticWeighted', 'ChaosMonkey']);
export type Policy = z.infer<typeof PolicySchema>;

export const DispatchModeSchema = z.enum(['deck', 'random', 'weighted']);
export type DispatchMode = z.infer<typeof DispatchModeSchema>;

export const GatewaySchema = z.object({
  gateway_id: z.string(),
  name: z.string(),
  landing_url: z.string().url(),
  language: z.enum(['de', 'fr', 'it', 'en']),
  priority_weight: z.number().default(1),
  intent: z.string().optional(),
  keyword_cluster: z.string().optional(),
  enabled: z.boolean().default(true),
});
export type Gateway = z.infer<typeof GatewaySchema>;

export const PersonaSchema = z.object({
  persona_id: z.string(),
  name: z.string(),
  language: z.enum(['de', 'fr', 'it', 'en']),
  first_name: z.string(),
  last_name: z.string(),
  email_prefix: z.string(),
  phone: z.string(),
  device: z.enum(['mobile', 'desktop']).default('desktop'),
  traits: z.array(z.string()).default([]),
  budget: z.enum(['low', 'medium', 'high']).default('medium'),
  urgency: z.enum(['low', 'medium', 'high']).default('medium'),
  trust_level: z.enum(['low', 'medium', 'high']).default('medium'),
  click_bias_weights: z.object({
    main_cta: z.number().min(0).max(1),
    secondary: z.number().min(0).max(1),
    escape: z.number().min(0).max(1),
  }).default({ main_cta: 0.7, secondary: 0.2, escape: 0.1 }),
  enabled: z.boolean().default(true),
});
export type Persona = z.infer<typeof PersonaSchema>;

export const RunConfigSchema = z.object({
  run_id: z.string(),
  seed: z.number(),
  gateway: GatewaySchema,
  persona: PersonaSchema,
  policy: PolicySchema,
  timestamp: z.string().datetime(),
  maxSteps: z.number().default(20),
  maxTimeMs: z.number().default(120000),
  dryRun: z.boolean().default(true),
  captureTrace: z.boolean().default(false),
  captureNetworkHar: z.boolean().default(false),
});
export type RunConfig = z.infer<typeof RunConfigSchema>;

export const CTASchema = z.object({
  selector: z.string(),
  text: z.string(),
  type: z.enum(['main', 'secondary', 'escape', 'unknown']),
  score: z.number(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});
export type CTA = z.infer<typeof CTASchema>;

export const StepSchema = z.object({
  stepNumber: z.number(),
  action: z.enum(['load', 'fill', 'click', 'scroll', 'wait', 'error']),
  selector: z.string().optional(),
  text: z.string().optional(),
  screenshot: z.string().optional(),
  timestamp: z.number(),
  success: z.boolean(),
});
export type Step = z.infer<typeof StepSchema>;

export const RunResultSchema = z.object({
  run_id: z.string(),
  config: RunConfigSchema,
  steps: z.array(StepSchema),
  detectedCtAs: z.array(CTASchema),
  trustSignals: z.array(z.string()),
  conversionConfidence: z.number().min(0).max(100),
  verdict: z.enum(['success', 'dropout', 'blocker', 'unknown']),
  dropoffReason: z.string().optional(),
  errorMessage: z.string().optional(),
  totalTimeMs: z.number(),
  stepsCompleted: z.number(),
});
export type RunResult = z.infer<typeof RunResultSchema>;

export const DeckStateSchema = z.object({
  remaining: z.array(z.string()),
  seed: z.number(),
  lastUpdated: z.string().datetime(),
});
export type DeckState = z.infer<typeof DeckStateSchema>;
