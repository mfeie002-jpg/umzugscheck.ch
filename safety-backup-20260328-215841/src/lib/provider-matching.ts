/**
 * Smart Provider Matching Algorithm
 * 
 * Matches move projects to optimal providers using:
 * - Geographic coverage
 * - Capacity/availability
 * - Quality-Weighted Bidding (QWB)
 * - Specialization fit
 * 
 * @see docs/strategy/RELO_OS_BLUEPRINT.md
 */

import { MoveProject, DigitalTwin } from './move-project';

export interface Provider {
  id: string;
  name: string;
  slug: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  priceLevel: 'budget' | 'fair' | 'premium';
  responseTimeHours: number;
  serviceAreas: string[]; // Canton codes
  serviceTypes: string[];
  certifications: string[];
  truckSizes: ('transporter' | 'small' | 'medium' | 'large' | 'xl')[];
  specializations: string[];
  capacityAvailable: number; // 0-100
}

export interface ProviderMatch {
  provider: Provider;
  matchScore: number; // 0-100
  qualityScore: number;
  priceScore: number;
  responseScore: number;
  specializationScore: number;
  availabilityScore: number;
  estimatedPrice: { min: number; max: number };
  isRecommended: boolean;
  matchReasons: string[];
}

export interface MatchingCriteria {
  originCanton: string;
  destinationCanton: string;
  moveDate: string;
  totalVolume: number;
  requiredTruckSize: string;
  hasFragile: boolean;
  requiresAssembly: boolean;
  requiresPacking: boolean;
  budgetPreference: 'lowest' | 'balanced' | 'quality';
}

// ============================================================================
// QUALITY-WEIGHTED BIDDING (QWB)
// ============================================================================

const QWB_WEIGHTS = {
  quality: 0.40,    // 40% - Rating, reviews, certifications
  price: 0.30,      // 30% - Price competitiveness
  response: 0.20,   // 20% - Response time
  fit: 0.10         // 10% - Specialization fit
};

/**
 * Calculate quality score (0-100)
 */
function calculateQualityScore(provider: Provider): number {
  let score = 0;
  
  // Rating (max 40 points)
  score += (provider.rating / 5) * 40;
  
  // Review count (max 20 points)
  const reviewScore = Math.min(provider.reviewCount / 100, 1) * 20;
  score += reviewScore;
  
  // Verification (20 points)
  if (provider.verified) score += 20;
  
  // Certifications (max 20 points)
  const certScore = Math.min(provider.certifications.length / 3, 1) * 20;
  score += certScore;
  
  return Math.round(score);
}

/**
 * Calculate price score (0-100)
 * Higher score = more affordable
 */
function calculatePriceScore(
  provider: Provider, 
  budgetPreference: MatchingCriteria['budgetPreference']
): number {
  const priceMap = { budget: 100, fair: 70, premium: 40 };
  const baseScore = priceMap[provider.priceLevel] || 50;
  
  // Adjust based on user preference
  if (budgetPreference === 'lowest' && provider.priceLevel === 'budget') {
    return 100;
  }
  if (budgetPreference === 'quality' && provider.priceLevel === 'premium') {
    return 90;
  }
  
  return baseScore;
}

/**
 * Calculate response score (0-100)
 * Lower response time = higher score
 */
function calculateResponseScore(provider: Provider): number {
  const hours = provider.responseTimeHours;
  
  if (hours <= 1) return 100;
  if (hours <= 4) return 85;
  if (hours <= 12) return 70;
  if (hours <= 24) return 50;
  return 30;
}

/**
 * Calculate specialization fit score (0-100)
 */
function calculateSpecializationScore(
  provider: Provider,
  criteria: MatchingCriteria
): number {
  let score = 50; // Base score
  
  // Truck size match
  const requiredSize = criteria.requiredTruckSize as Provider['truckSizes'][0];
  if (provider.truckSizes.includes(requiredSize)) {
    score += 20;
  }
  
  // Fragile handling
  if (criteria.hasFragile && provider.specializations.includes('kunst_antik')) {
    score += 15;
  }
  
  // Packing service
  if (criteria.requiresPacking && provider.serviceTypes.includes('verpackung')) {
    score += 10;
  }
  
  // Assembly service
  if (criteria.requiresAssembly && provider.serviceTypes.includes('montage')) {
    score += 5;
  }
  
  return Math.min(100, score);
}

/**
 * Calculate availability score (0-100)
 */
function calculateAvailabilityScore(provider: Provider): number {
  return provider.capacityAvailable;
}

// ============================================================================
// MAIN MATCHING FUNCTION
// ============================================================================

/**
 * Match providers to a move project
 */
export function matchProviders(
  providers: Provider[],
  criteria: MatchingCriteria
): ProviderMatch[] {
  // Step 1: Filter by geographic coverage
  const geoCovered = providers.filter(p => 
    p.serviceAreas.includes(criteria.originCanton) || 
    p.serviceAreas.includes(criteria.destinationCanton) ||
    p.serviceAreas.includes('CH') // Nationwide
  );
  
  // Step 2: Filter by basic capability
  const capable = geoCovered.filter(p => {
    const requiredSize = criteria.requiredTruckSize as Provider['truckSizes'][0];
    return p.truckSizes.includes(requiredSize) || 
           p.truckSizes.includes('xl'); // XL can handle anything
  });
  
  // Step 3: Score each provider
  const matches: ProviderMatch[] = capable.map(provider => {
    const qualityScore = calculateQualityScore(provider);
    const priceScore = calculatePriceScore(provider, criteria.budgetPreference);
    const responseScore = calculateResponseScore(provider);
    const specializationScore = calculateSpecializationScore(provider, criteria);
    const availabilityScore = calculateAvailabilityScore(provider);
    
    // Weighted match score
    const matchScore = Math.round(
      qualityScore * QWB_WEIGHTS.quality +
      priceScore * QWB_WEIGHTS.price +
      responseScore * QWB_WEIGHTS.response +
      specializationScore * QWB_WEIGHTS.fit
    );
    
    // Generate match reasons
    const matchReasons: string[] = [];
    if (provider.rating >= 4.8) matchReasons.push('Top-bewertet');
    if (provider.verified) matchReasons.push('Verifiziert');
    if (provider.responseTimeHours <= 4) matchReasons.push('Schnelle Antwort');
    if (provider.priceLevel === 'budget') matchReasons.push('Preiswert');
    if (provider.certifications.includes('ASTAG')) matchReasons.push('ASTAG-Mitglied');
    
    // Estimate price
    const volumeBase = criteria.totalVolume * (
      provider.priceLevel === 'budget' ? 55 :
      provider.priceLevel === 'fair' ? 70 : 90
    );
    
    return {
      provider,
      matchScore,
      qualityScore,
      priceScore,
      responseScore,
      specializationScore,
      availabilityScore,
      estimatedPrice: {
        min: Math.round(volumeBase * 0.85),
        max: Math.round(volumeBase * 1.15)
      },
      isRecommended: matchScore >= 75,
      matchReasons
    };
  });
  
  // Step 4: Sort by match score (descending)
  matches.sort((a, b) => b.matchScore - a.matchScore);
  
  return matches;
}

/**
 * Get top recommended providers
 */
export function getRecommendedProviders(
  matches: ProviderMatch[],
  limit: number = 5
): ProviderMatch[] {
  return matches
    .filter(m => m.isRecommended)
    .slice(0, limit);
}

/**
 * Create matching criteria from a MoveProject
 */
export function createMatchingCriteria(project: MoveProject): MatchingCriteria {
  const digitalTwin = project.digitalTwin;
  
  return {
    originCanton: project.origin.canton || 'ZH',
    destinationCanton: project.destination.canton || 'ZH',
    moveDate: project.moveDate,
    totalVolume: digitalTwin?.totalVolume || project.totalVolume || 20,
    requiredTruckSize: digitalTwin?.recommendedTruckSize || 'medium',
    hasFragile: (digitalTwin?.fragilityScore || 0) > 50,
    requiresAssembly: project.additionalServices?.includes('montage') || false,
    requiresPacking: project.additionalServices?.includes('verpackung') || false,
    budgetPreference: project.serviceTier === 'essential' ? 'lowest' : 
                      project.serviceTier === 'premium' ? 'quality' : 'balanced'
  };
}

// ============================================================================
// DISPLAY HELPERS
// ============================================================================

export function getMatchScoreLabel(score: number): string {
  if (score >= 90) return 'Perfekter Match';
  if (score >= 80) return 'Sehr gut passend';
  if (score >= 70) return 'Gut passend';
  if (score >= 60) return 'Passend';
  return 'Möglich';
}

export function getMatchScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600 bg-emerald-100';
  if (score >= 60) return 'text-amber-600 bg-amber-100';
  return 'text-muted-foreground bg-muted';
}
