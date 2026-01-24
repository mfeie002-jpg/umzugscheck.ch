/**
 * Trust Triumvirate Scoring System
 * Swiss-specific trust framework for moving companies
 * Based on: Institutional, Social, and Process Trust pillars
 */

import { BadgeLevel, BADGE_DEFINITIONS } from './quality-badge';

// ============= Types =============

export interface TrustFactor {
  id: string;
  label: string;
  labelDe: string;
  met: boolean;
  weight: number;
  value?: string | number | boolean;
  threshold?: string | number | boolean;
  category: 'institutional' | 'social' | 'process';
}

export interface TrustPillar {
  id: 'institutional' | 'social' | 'process';
  label: string;
  labelDe: string;
  description: string;
  score: number; // 0-100 (percentage of max)
  maxScore: number;
  earnedPoints: number;
  factors: TrustFactor[];
  color: string;
  icon: string;
}

export interface TrustTriumvirate {
  institutional: TrustPillar;
  social: TrustPillar;
  process: TrustPillar;
  overallScore: number; // 0-100
  badgeLevel: BadgeLevel;
  gaps: TrustGap[];
  quickWins: TrustFactor[];
}

export interface TrustGap {
  pillar: 'institutional' | 'social' | 'process';
  factor: TrustFactor;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
}

// ============= Configuration =============

export const TRUST_WEIGHTS = {
  institutional: 0.35, // 35%
  social: 0.30,        // 30%
  process: 0.35,       // 35%
} as const;

export const PILLAR_CONFIG = {
  institutional: {
    label: 'Institutional Trust',
    labelDe: 'Institutionelles Vertrauen',
    description: 'Rechtliche Legitimität & Permanenz',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: 'building',
    maxPoints: 35,
  },
  social: {
    label: 'Social Trust',
    labelDe: 'Soziales Vertrauen',
    description: 'Kollektive Erfahrungen & Reputation',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: 'users',
    maxPoints: 30,
  },
  process: {
    label: 'Process Trust',
    labelDe: 'Prozess-Vertrauen',
    description: 'Transparenz & Methodenkompetenz',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: 'clipboard-check',
    maxPoints: 35,
  },
} as const;

// ============= Input Types =============

export interface ProviderTrustData {
  // Institutional
  uidVerified?: boolean;
  insuranceCertified?: boolean;
  membershipVerified?: 'ASTAG' | 'VSU' | 'both' | null;
  hasLandline?: boolean;
  hasDedicatedDomain?: boolean;
  
  // Social
  googleReviewCount?: number;
  averageRating?: number;
  hasTeamPhotos?: boolean;
  hasCaseStudies?: boolean;
  hasVideoTestimonials?: boolean;
  mediaFeatures?: string[];
  
  // Process
  hasHowItWorksSection?: boolean;
  guaranteesVisible?: boolean;
  transparentPricing?: boolean;
  responseTimeHours?: number;
  hasGuaranteeBadges?: boolean;
  hasAbgabegarantie?: boolean;
}

// ============= Factor Definitions =============

const INSTITUTIONAL_FACTORS: Omit<TrustFactor, 'met' | 'value'>[] = [
  { id: 'uid', label: 'UID Verified', labelDe: 'UID im Zefix verifiziert', weight: 7, threshold: true, category: 'institutional' },
  { id: 'insurance', label: 'Insurance Certified', labelDe: 'Versicherungsnachweis', weight: 8, threshold: true, category: 'institutional' },
  { id: 'membership', label: 'Association Membership', labelDe: 'ASTAG/VSU Mitgliedschaft', weight: 7, threshold: true, category: 'institutional' },
  { id: 'landline', label: 'Landline Phone', labelDe: 'Festnetznummer (044/031...)', weight: 6, threshold: true, category: 'institutional' },
  { id: 'domain', label: 'Dedicated Domain', labelDe: 'Eigene Domain/Website', weight: 7, threshold: true, category: 'institutional' },
];

const SOCIAL_FACTORS: Omit<TrustFactor, 'met' | 'value'>[] = [
  { id: 'reviews_count', label: '20+ Reviews', labelDe: '20+ Google Bewertungen', weight: 8, threshold: 20, category: 'social' },
  { id: 'rating', label: 'Rating ≥ 4.5', labelDe: 'Rating ≥ 4.5 Sterne', weight: 6, threshold: 4.5, category: 'social' },
  { id: 'team_photos', label: 'Team Photos', labelDe: 'Team-Portraits vorhanden', weight: 5, threshold: true, category: 'social' },
  { id: 'case_studies', label: 'Case Studies', labelDe: 'Fallstudien/Referenzfotos', weight: 6, threshold: true, category: 'social' },
  { id: 'video_testimonials', label: 'Video Testimonials', labelDe: 'Video-Testimonials', weight: 5, threshold: true, category: 'social' },
];

const PROCESS_FACTORS: Omit<TrustFactor, 'met' | 'value'>[] = [
  { id: 'how_it_works', label: 'How It Works Section', labelDe: '"So funktioniert\'s" Sektion', weight: 8, threshold: true, category: 'process' },
  { id: 'abgabegarantie', label: 'Handover Guarantee', labelDe: 'Abgabegarantie kommuniziert', weight: 8, threshold: true, category: 'process' },
  { id: 'pricing', label: 'Transparent Pricing', labelDe: 'Transparente Preisstruktur', weight: 7, threshold: true, category: 'process' },
  { id: 'response_time', label: 'Response < 12h', labelDe: 'Antwortzeit < 12h', weight: 6, threshold: 12, category: 'process' },
  { id: 'guarantee_badges', label: 'Guarantee Badges', labelDe: 'Garantie-Badges sichtbar', weight: 6, threshold: true, category: 'process' },
];

// ============= Core Calculation Functions =============

export function calculateTrustTriumvirate(provider: ProviderTrustData): TrustTriumvirate {
  const institutional = calculatePillar('institutional', provider);
  const social = calculatePillar('social', provider);
  const process = calculatePillar('process', provider);

  // Weighted overall score
  const overallScore = Math.round(
    (institutional.score * TRUST_WEIGHTS.institutional) +
    (social.score * TRUST_WEIGHTS.social) +
    (process.score * TRUST_WEIGHTS.process)
  );

  // Determine badge level from overall score
  const badgeLevel = getBadgeLevelFromScore(overallScore);

  // Find gaps (unmet factors)
  const gaps = findGaps([institutional, social, process]);

  // Find quick wins (high impact, low effort)
  const quickWins = findQuickWins(gaps);

  return {
    institutional,
    social,
    process,
    overallScore,
    badgeLevel,
    gaps,
    quickWins,
  };
}

function calculatePillar(
  pillarId: 'institutional' | 'social' | 'process',
  provider: ProviderTrustData
): TrustPillar {
  const config = PILLAR_CONFIG[pillarId];
  let factorDefinitions: Omit<TrustFactor, 'met' | 'value'>[];

  switch (pillarId) {
    case 'institutional':
      factorDefinitions = INSTITUTIONAL_FACTORS;
      break;
    case 'social':
      factorDefinitions = SOCIAL_FACTORS;
      break;
    case 'process':
      factorDefinitions = PROCESS_FACTORS;
      break;
  }

  const factors: TrustFactor[] = factorDefinitions.map(def => {
    const { met, value } = evaluateFactor(def, provider);
    return { ...def, met, value };
  });

  const earnedPoints = factors.reduce((sum, f) => sum + (f.met ? f.weight : 0), 0);
  const score = Math.round((earnedPoints / config.maxPoints) * 100);

  return {
    id: pillarId,
    label: config.label,
    labelDe: config.labelDe,
    description: config.description,
    score,
    maxScore: config.maxPoints,
    earnedPoints,
    factors,
    color: config.color,
    icon: config.icon,
  };
}

function evaluateFactor(
  factor: Omit<TrustFactor, 'met' | 'value'>,
  provider: ProviderTrustData
): { met: boolean; value?: string | number | boolean } {
  switch (factor.id) {
    // Institutional
    case 'uid':
      return { met: !!provider.uidVerified, value: provider.uidVerified };
    case 'insurance':
      return { met: !!provider.insuranceCertified, value: provider.insuranceCertified };
    case 'membership':
      return { met: !!provider.membershipVerified, value: provider.membershipVerified || undefined };
    case 'landline':
      return { met: !!provider.hasLandline, value: provider.hasLandline };
    case 'domain':
      return { met: !!provider.hasDedicatedDomain, value: provider.hasDedicatedDomain };
    
    // Social
    case 'reviews_count':
      const reviewCount = provider.googleReviewCount || 0;
      return { met: reviewCount >= 20, value: reviewCount };
    case 'rating':
      const rating = provider.averageRating || 0;
      return { met: rating >= 4.5, value: rating };
    case 'team_photos':
      return { met: !!provider.hasTeamPhotos, value: provider.hasTeamPhotos };
    case 'case_studies':
      return { met: !!provider.hasCaseStudies, value: provider.hasCaseStudies };
    case 'video_testimonials':
      return { met: !!provider.hasVideoTestimonials, value: provider.hasVideoTestimonials };
    
    // Process
    case 'how_it_works':
      return { met: !!provider.hasHowItWorksSection, value: provider.hasHowItWorksSection };
    case 'abgabegarantie':
      return { met: !!provider.hasAbgabegarantie, value: provider.hasAbgabegarantie };
    case 'pricing':
      return { met: !!provider.transparentPricing, value: provider.transparentPricing };
    case 'response_time':
      const responseTime = provider.responseTimeHours || 48;
      return { met: responseTime <= 12, value: responseTime };
    case 'guarantee_badges':
      return { met: !!provider.hasGuaranteeBadges, value: provider.hasGuaranteeBadges };
    
    default:
      return { met: false };
  }
}

function getBadgeLevelFromScore(score: number): BadgeLevel {
  if (score >= 80) return 'elite';
  if (score >= 60) return 'premium';
  if (score >= 40) return 'verified';
  return 'none';
}

function findGaps(pillars: TrustPillar[]): TrustGap[] {
  const gaps: TrustGap[] = [];

  for (const pillar of pillars) {
    for (const factor of pillar.factors) {
      if (!factor.met) {
        gaps.push({
          pillar: pillar.id,
          factor,
          impact: getImpact(factor.weight),
          effort: getEffort(factor.id),
        });
      }
    }
  }

  // Sort by impact (high first), then by effort (low first)
  return gaps.sort((a, b) => {
    const impactOrder = { high: 0, medium: 1, low: 2 };
    const effortOrder = { low: 0, medium: 1, high: 2 };
    
    if (impactOrder[a.impact] !== impactOrder[b.impact]) {
      return impactOrder[a.impact] - impactOrder[b.impact];
    }
    return effortOrder[a.effort] - effortOrder[b.effort];
  });
}

function getImpact(weight: number): 'high' | 'medium' | 'low' {
  if (weight >= 7) return 'high';
  if (weight >= 5) return 'medium';
  return 'low';
}

function getEffort(factorId: string): 'low' | 'medium' | 'high' {
  // Low effort: can be done in a day
  const lowEffort = ['landline', 'guarantee_badges', 'how_it_works', 'pricing'];
  // High effort: requires external parties or significant time
  const highEffort = ['reviews_count', 'rating', 'video_testimonials', 'case_studies', 'membership'];
  
  if (lowEffort.includes(factorId)) return 'low';
  if (highEffort.includes(factorId)) return 'high';
  return 'medium';
}

function findQuickWins(gaps: TrustGap[]): TrustFactor[] {
  return gaps
    .filter(g => g.impact !== 'low' && g.effort === 'low')
    .slice(0, 3)
    .map(g => g.factor);
}

// ============= Utility Functions =============

export function getTrustScoreLabel(score: number): string {
  if (score >= 80) return 'Exzellent';
  if (score >= 60) return 'Gut';
  if (score >= 40) return 'Ausbaufähig';
  return 'Kritisch';
}

export function getTrustScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-red-600';
}

export function getPillarProgressColor(score: number): string {
  if (score >= 70) return 'bg-green-500';
  if (score >= 50) return 'bg-blue-500';
  if (score >= 30) return 'bg-amber-500';
  return 'bg-red-500';
}
