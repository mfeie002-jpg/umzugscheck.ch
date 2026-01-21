/**
 * Smart Router Constants
 * Based on Gemini UX Audit: Swiss-focused trust signals
 */

// Swiss-specific trust badges (replaces "100% Kostenlos")
export const SWISS_TRUST_BADGES = [
  {
    id: 'swiss-server',
    icon: '🇨🇭',
    label: 'Schweizer Server',
    description: 'Ihre Daten bleiben in der Schweiz',
  },
  {
    id: 'escrow',
    icon: '🔒',
    label: 'Treuhand-Schutz',
    description: 'Sichere Zahlung über Treuhandkonto',
  },
  {
    id: 'unverbindlich',
    icon: '✓',
    label: 'Unverbindlich',
    description: 'Keine versteckten Kosten',
  },
  {
    id: 'keine-anrufe',
    icon: '📵',
    label: 'Keine Werbeanrufe',
    description: 'Kein Verkauf Ihrer Daten',
  },
] as const;

// Festpreis headline variations for A/B testing
export const HEADLINE_VARIANTS = {
  festpreis: {
    main: 'Ihr Umzug zum Festpreis',
    sub: 'Garantiert durch KI-Analyse',
  },
  sicherheit: {
    main: 'Umziehen ohne Überraschungen',
    sub: 'Festpreis-Garantie durch Video-Analyse',
  },
  speed: {
    main: '5 Offerten in 2 Minuten',
    sub: 'Keine Hausbesuche nötig',
  },
} as const;

// Video method benefits (for routing screen)
export const VIDEO_BENEFITS = [
  '100% Festpreisgarantie',
  'Keine Nachforderungen am Umzugstag',
  'Präzise Volumenberechnung durch KI',
  'Kein Hausbesuch nötig',
] as const;

// Form method benefits
export const FORM_BENEFITS = [
  'Schnell und einfach',
  'In 60 Sekunden abgeschlossen',
  'Sofort Offerten erhalten',
] as const;

// Price ranges by room count (same as GoldenFlow)
export const BASE_PRICES: Record<string, { min: number; max: number }> = {
  '1-1.5': { min: 600, max: 1200 },
  '2-2.5': { min: 1000, max: 1800 },
  '3-3.5': { min: 1400, max: 2400 },
  '4-4.5': { min: 1800, max: 3200 },
  '5+': { min: 2400, max: 4500 },
};
