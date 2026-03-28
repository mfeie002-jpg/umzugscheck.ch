/**
 * Provider Quality Badge System
 * Verified badges and trust indicators for moving companies
 * Fully integrated with Trust Triumvirate Framework (Institutional, Social, Process Trust)
 */

// Re-export Trust Triumvirate types and functions for unified API
export {
  type TrustFactor,
  type TrustPillar,
  type TrustTriumvirate,
  type TrustGap,
  type ProviderTrustData,
  TRUST_WEIGHTS,
  PILLAR_CONFIG,
  calculateTrustTriumvirate,
  getTrustScoreLabel,
  getTrustScoreColor,
  getPillarProgressColor,
} from './trust-triumvirate';

// Import for internal use
import { 
  calculateTrustTriumvirate as calcTrust,
  type ProviderTrustData as TrustData,
  type TrustTriumvirate as TrustResult,
} from './trust-triumvirate';

export type BadgeLevel = 'none' | 'verified' | 'premium' | 'elite';

export interface QualityBadge {
  level: BadgeLevel;
  label: string;
  description: string;
  icon: 'shield' | 'award' | 'crown' | 'star';
  color: string;
  requirements: BadgeRequirement[];
}

export interface BadgeRequirement {
  id: string;
  label: string;
  met: boolean;
  value?: number | string;
  threshold?: number | string;
}

export interface ProviderBadgeData {
  providerId: string;
  currentBadge: QualityBadge;
  nextBadge: QualityBadge | null;
  progressToNext: number; // 0-100
  earnedAt?: Date;
  verificationsComplete: string[];
  pendingVerifications: string[];
  trustTriumvirateScore?: number; // Integration point
}

/**
 * Badge definitions with requirements
 */
export const BADGE_DEFINITIONS: Record<BadgeLevel, Omit<QualityBadge, 'requirements'>> = {
  none: {
    level: 'none',
    label: 'Basis',
    description: 'Registrierter Anbieter',
    icon: 'star',
    color: 'text-muted-foreground',
  },
  verified: {
    level: 'verified',
    label: 'Verifiziert',
    description: 'Geprüfte Identität & Dokumente',
    icon: 'shield',
    color: 'text-blue-600',
  },
  premium: {
    level: 'premium',
    label: 'Premium Partner',
    description: 'Top-Bewertungen & hohe Zuverlässigkeit',
    icon: 'award',
    color: 'text-amber-600',
  },
  elite: {
    level: 'elite',
    label: 'Elite Partner',
    description: 'Beste Qualität in der Schweiz',
    icon: 'crown',
    color: 'text-purple-600',
  },
};

/**
 * Score thresholds for badge levels (integrated with Trust Triumvirate)
 */
export const BADGE_SCORE_THRESHOLDS = {
  none: { min: 0, max: 39 },
  verified: { min: 40, max: 59 },
  premium: { min: 60, max: 79 },
  elite: { min: 80, max: 100 },
} as const;

/**
 * Get badge level from Trust Triumvirate overall score
 */
export function getBadgeLevelFromScore(score: number): BadgeLevel {
  if (score >= 80) return 'elite';
  if (score >= 60) return 'premium';
  if (score >= 40) return 'verified';
  return 'none';
}

/**
 * Calculate provider badge level based on metrics
 */
export function calculateBadgeLevel(provider: {
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  responseTimeHours?: number;
  successRate?: number;
  profileCompleteness?: number;
  yearsInBusiness?: number;
  trustTriumvirateScore?: number; // Optional integration
}): BadgeLevel {
  // If Trust Triumvirate score is provided, use it directly
  if (typeof provider.trustTriumvirateScore === 'number') {
    return getBadgeLevelFromScore(provider.trustTriumvirateScore);
  }

  const {
    rating = 0,
    reviewCount = 0,
    isVerified = false,
    responseTimeHours = 48,
    successRate = 0,
    profileCompleteness = 0,
    yearsInBusiness = 0,
  } = provider;

  // Elite: Exceptional in all categories
  if (
    isVerified &&
    rating >= 4.8 &&
    reviewCount >= 100 &&
    responseTimeHours <= 4 &&
    successRate >= 95 &&
    profileCompleteness >= 95 &&
    yearsInBusiness >= 5
  ) {
    return 'elite';
  }

  // Premium: Very good performance
  if (
    isVerified &&
    rating >= 4.5 &&
    reviewCount >= 30 &&
    responseTimeHours <= 12 &&
    successRate >= 85 &&
    profileCompleteness >= 80
  ) {
    return 'premium';
  }

  // Verified: Basic verification complete
  if (isVerified && rating >= 4.0 && reviewCount >= 5 && profileCompleteness >= 60) {
    return 'verified';
  }

  return 'none';
}

/**
 * Calculate estimated Trust Triumvirate score from basic provider metrics
 * This provides a rough estimate when full Trust Triumvirate data isn't available
 */
export function estimateTrustScore(provider: {
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  responseTimeHours?: number;
  profileCompleteness?: number;
}): number {
  let score = 0;
  
  // Institutional factors (max ~35 points)
  if (provider.isVerified) score += 15; // UID + Insurance approximation
  if ((provider.profileCompleteness || 0) >= 80) score += 10;
  score += Math.min(10, (provider.profileCompleteness || 0) / 10);
  
  // Social factors (max ~30 points)
  const reviews = provider.reviewCount || 0;
  score += Math.min(8, reviews >= 20 ? 8 : reviews / 2.5);
  const rating = provider.rating || 0;
  score += rating >= 4.5 ? 6 : rating >= 4.0 ? 4 : rating >= 3.5 ? 2 : 0;
  score += Math.min(10, reviews >= 50 ? 10 : reviews / 5);
  
  // Process factors (max ~35 points)
  const response = provider.responseTimeHours || 48;
  score += response <= 2 ? 12 : response <= 6 ? 8 : response <= 12 ? 5 : response <= 24 ? 2 : 0;
  if ((provider.profileCompleteness || 0) >= 70) score += 8; // Assumes "how it works" etc.
  score += Math.min(10, (provider.profileCompleteness || 0) / 10);
  
  return Math.min(100, Math.round(score));
}

/**
 * Get full badge data with requirements
 */
export function getProviderBadge(provider: {
  id: string;
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  responseTimeHours?: number;
  successRate?: number;
  profileCompleteness?: number;
  yearsInBusiness?: number;
  trustTriumvirateScore?: number;
}): ProviderBadgeData {
  const level = calculateBadgeLevel(provider);
  const requirements = getRequirementsForLevel(provider, level);
  
  const currentBadge: QualityBadge = {
    ...BADGE_DEFINITIONS[level],
    requirements,
  };

  // Determine next badge
  const badgeLevels: BadgeLevel[] = ['none', 'verified', 'premium', 'elite'];
  const currentIndex = badgeLevels.indexOf(level);
  const nextLevel = currentIndex < badgeLevels.length - 1 ? badgeLevels[currentIndex + 1] : null;
  
  let nextBadge: QualityBadge | null = null;
  let progressToNext = 100;

  if (nextLevel) {
    const nextRequirements = getRequirementsForLevel(provider, nextLevel);
    nextBadge = {
      ...BADGE_DEFINITIONS[nextLevel],
      requirements: nextRequirements,
    };
    
    const metCount = nextRequirements.filter(r => r.met).length;
    progressToNext = Math.round((metCount / nextRequirements.length) * 100);
  }

  // Determine verifications
  const verificationsComplete: string[] = [];
  const pendingVerifications: string[] = [];

  if (provider.isVerified) {
    verificationsComplete.push('identity', 'documents', 'insurance');
  } else {
    pendingVerifications.push('identity', 'documents', 'insurance');
  }

  if ((provider.profileCompleteness || 0) >= 80) {
    verificationsComplete.push('profile');
  } else {
    pendingVerifications.push('profile');
  }

  return {
    providerId: provider.id,
    currentBadge,
    nextBadge,
    progressToNext,
    verificationsComplete,
    pendingVerifications,
    earnedAt: level !== 'none' ? new Date() : undefined,
    trustTriumvirateScore: provider.trustTriumvirateScore || estimateTrustScore(provider),
  };
}

/**
 * Get requirements for a specific badge level
 */
function getRequirementsForLevel(
  provider: {
    rating?: number;
    reviewCount?: number;
    isVerified?: boolean;
    responseTimeHours?: number;
    successRate?: number;
    profileCompleteness?: number;
    yearsInBusiness?: number;
  },
  targetLevel: BadgeLevel
): BadgeRequirement[] {
  const thresholds = {
    verified: { rating: 4.0, reviews: 5, profile: 60 },
    premium: { rating: 4.5, reviews: 30, profile: 80, response: 12, success: 85 },
    elite: { rating: 4.8, reviews: 100, profile: 95, response: 4, success: 95, years: 5 },
  };

  if (targetLevel === 'none') {
    return [];
  }

  const t = thresholds[targetLevel];
  const requirements: BadgeRequirement[] = [
    {
      id: 'verified',
      label: 'Identität verifiziert',
      met: provider.isVerified || false,
    },
    {
      id: 'rating',
      label: `Bewertung ≥ ${t.rating}`,
      met: (provider.rating || 0) >= t.rating,
      value: provider.rating || 0,
      threshold: t.rating,
    },
    {
      id: 'reviews',
      label: `${t.reviews}+ Bewertungen`,
      met: (provider.reviewCount || 0) >= t.reviews,
      value: provider.reviewCount || 0,
      threshold: t.reviews,
    },
    {
      id: 'profile',
      label: `${t.profile}% Profil vollständig`,
      met: (provider.profileCompleteness || 0) >= t.profile,
      value: provider.profileCompleteness || 0,
      threshold: t.profile,
    },
  ];

  if ('response' in t) {
    requirements.push({
      id: 'response',
      label: `Antwortzeit < ${t.response}h`,
      met: (provider.responseTimeHours || 48) <= t.response,
      value: provider.responseTimeHours || 48,
      threshold: t.response,
    });
  }

  if ('success' in t) {
    requirements.push({
      id: 'success',
      label: `${t.success}% Erfolgsrate`,
      met: (provider.successRate || 0) >= t.success,
      value: provider.successRate || 0,
      threshold: t.success,
    });
  }

  if ('years' in t) {
    requirements.push({
      id: 'years',
      label: `${t.years}+ Jahre Erfahrung`,
      met: (provider.yearsInBusiness || 0) >= t.years,
      value: provider.yearsInBusiness || 0,
      threshold: t.years,
    });
  }

  return requirements;
}

/**
 * Get badge color classes for Tailwind
 */
export function getBadgeColorClasses(level: BadgeLevel): {
  bg: string;
  text: string;
  border: string;
} {
  switch (level) {
    case 'elite':
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-300',
      };
    case 'premium':
      return {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        border: 'border-amber-300',
      };
    case 'verified':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-300',
      };
    default:
      return {
        bg: 'bg-muted',
        text: 'text-muted-foreground',
        border: 'border-border',
      };
  }
}

/**
 * Get badge progress towards next level
 */
export function getBadgeProgress(currentScore: number): {
  currentLevel: BadgeLevel;
  nextLevel: BadgeLevel | null;
  progressToNext: number;
  pointsToNext: number;
} {
  const currentLevel = getBadgeLevelFromScore(currentScore);
  const thresholds = BADGE_SCORE_THRESHOLDS;
  
  const levelOrder: BadgeLevel[] = ['none', 'verified', 'premium', 'elite'];
  const currentIndex = levelOrder.indexOf(currentLevel);
  
  if (currentIndex >= levelOrder.length - 1) {
    return {
      currentLevel,
      nextLevel: null,
      progressToNext: 100,
      pointsToNext: 0,
    };
  }
  
  const nextLevel = levelOrder[currentIndex + 1];
  const nextThreshold = thresholds[nextLevel].min;
  const currentThreshold = thresholds[currentLevel].min;
  
  const rangeSize = nextThreshold - currentThreshold;
  const progress = currentScore - currentThreshold;
  const progressPercent = Math.round((progress / rangeSize) * 100);
  
  return {
    currentLevel,
    nextLevel,
    progressToNext: Math.min(100, Math.max(0, progressPercent)),
    pointsToNext: Math.max(0, nextThreshold - currentScore),
  };
}

// ============= Trust Triumvirate Deep Integration =============

/**
 * Extended provider data including Trust Triumvirate factors
 */
export interface ExtendedProviderData {
  // Basic metrics
  id: string;
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  responseTimeHours?: number;
  successRate?: number;
  profileCompleteness?: number;
  yearsInBusiness?: number;
  
  // Trust Triumvirate specific data
  trustData?: TrustData;
}

/**
 * Complete badge data with Trust Triumvirate breakdown
 */
export interface CompleteBadgeData extends ProviderBadgeData {
  trustTriumvirate?: TrustResult;
  institutionalScore: number;
  socialScore: number;
  processScore: number;
}

/**
 * Calculate complete badge with Trust Triumvirate breakdown
 * This is the primary function to use for full trust analysis
 */
export function calculateCompleteBadge(provider: ExtendedProviderData): CompleteBadgeData {
  let trustTriumvirate: TrustResult | undefined;
  let trustScore: number;
  let institutionalScore = 0;
  let socialScore = 0;
  let processScore = 0;

  // If we have full trust data, calculate Trust Triumvirate
  if (provider.trustData) {
    trustTriumvirate = calcTrust(provider.trustData);
    trustScore = trustTriumvirate.overallScore;
    institutionalScore = trustTriumvirate.institutional.score;
    socialScore = trustTriumvirate.social.score;
    processScore = trustTriumvirate.process.score;
  } else {
    // Estimate from basic metrics
    trustScore = estimateTrustScore(provider);
    
    // Estimate pillar scores from basic data
    const estimates = estimatePillarScores(provider);
    institutionalScore = estimates.institutional;
    socialScore = estimates.social;
    processScore = estimates.process;
  }

  // Get base badge data
  const baseBadge = getProviderBadge({
    ...provider,
    trustTriumvirateScore: trustScore,
  });

  return {
    ...baseBadge,
    trustTriumvirate,
    institutionalScore,
    socialScore,
    processScore,
    trustTriumvirateScore: trustScore,
  };
}

/**
 * Estimate pillar scores from basic provider metrics
 */
function estimatePillarScores(provider: ExtendedProviderData): {
  institutional: number;
  social: number;
  process: number;
} {
  // Institutional: based on verification and profile completeness
  let institutional = 0;
  if (provider.isVerified) institutional += 45; // UID + Insurance approximation
  institutional += Math.min(35, (provider.profileCompleteness || 0) * 0.35);
  institutional += provider.yearsInBusiness && provider.yearsInBusiness >= 5 ? 20 : 0;

  // Social: based on reviews and ratings
  let social = 0;
  const reviews = provider.reviewCount || 0;
  social += Math.min(30, reviews >= 20 ? 30 : reviews * 1.5);
  const rating = provider.rating || 0;
  social += rating >= 4.5 ? 25 : rating >= 4.0 ? 15 : rating >= 3.5 ? 8 : 0;
  social += Math.min(30, reviews >= 100 ? 30 : reviews * 0.3);

  // Process: based on response time and profile completeness
  let process = 0;
  const response = provider.responseTimeHours || 48;
  process += response <= 2 ? 25 : response <= 6 ? 18 : response <= 12 ? 12 : response <= 24 ? 5 : 0;
  if ((provider.profileCompleteness || 0) >= 70) process += 25;
  process += (provider.successRate || 0) >= 85 ? 25 : (provider.successRate || 0) >= 70 ? 15 : 0;

  return {
    institutional: Math.min(100, Math.round(institutional)),
    social: Math.min(100, Math.round(social)),
    process: Math.min(100, Math.round(process)),
  };
}

/**
 * Get improvement recommendations based on current scores
 */
export function getImprovementRecommendations(badge: CompleteBadgeData): {
  priority: 'high' | 'medium' | 'low';
  pillar: 'institutional' | 'social' | 'process';
  recommendation: string;
  impact: number;
}[] {
  const recommendations: {
    priority: 'high' | 'medium' | 'low';
    pillar: 'institutional' | 'social' | 'process';
    recommendation: string;
    impact: number;
  }[] = [];

  // Institutional recommendations
  if (badge.institutionalScore < 50) {
    recommendations.push({
      priority: 'high',
      pillar: 'institutional',
      recommendation: 'UID im Zefix verifizieren und Versicherungsnachweis hochladen',
      impact: 15,
    });
  }

  // Social recommendations
  if (badge.socialScore < 50) {
    recommendations.push({
      priority: 'high',
      pillar: 'social',
      recommendation: 'Google Bewertungen aktiv sammeln (Ziel: 20+)',
      impact: 12,
    });
    if (badge.socialScore < 30) {
      recommendations.push({
        priority: 'medium',
        pillar: 'social',
        recommendation: 'Team-Fotos und Fallstudien hinzufügen',
        impact: 8,
      });
    }
  }

  // Process recommendations
  if (badge.processScore < 50) {
    recommendations.push({
      priority: 'high',
      pillar: 'process',
      recommendation: '"So funktioniert\'s" Sektion und transparente Preise hinzufügen',
      impact: 15,
    });
  }
  if ((badge.processScore >= 50 && badge.processScore < 70)) {
    recommendations.push({
      priority: 'medium',
      pillar: 'process',
      recommendation: 'Antwortzeit auf unter 12 Stunden optimieren',
      impact: 6,
    });
  }

  // Sort by impact
  return recommendations.sort((a, b) => b.impact - a.impact);
}

/**
 * Calculate potential score increase from meeting a specific requirement
 */
export function calculatePotentialIncrease(
  currentScore: number,
  pillar: 'institutional' | 'social' | 'process',
  requirement: string
): number {
  const impactMap: Record<string, number> = {
    // Institutional
    uid: 7,
    insurance: 8,
    membership: 7,
    landline: 6,
    domain: 7,
    // Social
    reviews: 8,
    rating: 6,
    team_photos: 5,
    case_studies: 6,
    video_testimonials: 5,
    // Process
    how_it_works: 8,
    abgabegarantie: 8,
    pricing: 7,
    response_time: 6,
    guarantee_badges: 6,
  };

  const weights = { institutional: 0.35, social: 0.30, process: 0.35 };
  const impact = impactMap[requirement] || 5;
  
  return Math.round(impact * weights[pillar]);
}
