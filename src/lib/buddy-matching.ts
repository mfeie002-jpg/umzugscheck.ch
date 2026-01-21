/**
 * Buddy Matching System - LKW-Sharing for cost splitting
 * Matches users with similar routes/dates to share moving trucks
 */

export interface BuddyProfile {
  id: string;
  userId: string;
  displayName: string;
  fromCity: string;
  fromPostal: string;
  toCity: string;
  toPostal: string;
  moveDate: Date;
  flexibleDays: number; // ±days flexibility
  estimatedVolume: number; // m³
  maxBuddies: number;
  preferences: BuddyPreferences;
  status: 'searching' | 'matched' | 'confirmed' | 'completed';
  createdAt: Date;
}

export interface BuddyPreferences {
  shareContact: boolean;
  morningPreferred: boolean;
  afternoonPreferred: boolean;
  weekendOk: boolean;
  helpWithLoading: boolean;
  hasVehicle: boolean;
}

export interface BuddyMatch {
  id: string;
  profiles: BuddyProfile[];
  compatibilityScore: number;
  routeOverlap: number; // percentage
  dateMatch: 'exact' | 'flexible' | 'negotiable';
  potentialSavings: number;
  combinedVolume: number;
  status: 'proposed' | 'accepted' | 'confirmed' | 'declined';
  createdAt: Date;
  expiresAt: Date;
}

export interface RouteInfo {
  fromPostal: string;
  toPostal: string;
  distanceKm: number;
  estimatedDurationMin: number;
}

/**
 * Calculate distance between postal codes (simplified Swiss calculation)
 */
export function estimateDistance(fromPostal: string, toPostal: string): number {
  // Swiss postal codes: first digit = region
  const fromRegion = parseInt(fromPostal.charAt(0));
  const toRegion = parseInt(toPostal.charAt(0));
  
  // Base distances between major regions (km)
  const regionDistances: Record<string, number> = {
    '1-1': 20, '1-2': 150, '1-3': 120, '1-4': 80, '1-5': 100, '1-6': 140, '1-7': 200, '1-8': 100, '1-9': 160,
    '2-2': 30, '2-3': 100, '2-4': 120, '2-5': 150, '2-6': 180, '2-7': 220, '2-8': 130, '2-9': 190,
    '3-3': 25, '3-4': 60, '3-5': 90, '3-6': 100, '3-7': 160, '3-8': 80, '3-9': 140,
    '4-4': 20, '4-5': 50, '4-6': 100, '4-7': 160, '4-8': 60, '4-9': 120,
    '5-5': 25, '5-6': 80, '5-7': 140, '5-8': 50, '5-9': 100,
    '6-6': 30, '6-7': 80, '6-8': 100, '6-9': 60,
    '7-7': 40, '7-8': 120, '7-9': 80,
    '8-8': 25, '8-9': 60,
    '9-9': 30,
  };
  
  const key = fromRegion <= toRegion ? `${fromRegion}-${toRegion}` : `${toRegion}-${fromRegion}`;
  const baseDistance = regionDistances[key] || 100;
  
  // Add variation based on full postal codes
  const variation = Math.abs(parseInt(fromPostal) - parseInt(toPostal)) % 20;
  
  return baseDistance + variation;
}

/**
 * Calculate route overlap between two moves
 */
export function calculateRouteOverlap(route1: RouteInfo, route2: RouteInfo): number {
  // Check if routes are in similar direction
  const from1Region = parseInt(route1.fromPostal.charAt(0));
  const to1Region = parseInt(route1.toPostal.charAt(0));
  const from2Region = parseInt(route2.fromPostal.charAt(0));
  const to2Region = parseInt(route2.toPostal.charAt(0));
  
  // Same starting region bonus
  let overlap = from1Region === from2Region ? 30 : 0;
  
  // Same destination region bonus
  overlap += to1Region === to2Region ? 30 : 0;
  
  // Same direction bonus (both going same way)
  const direction1 = to1Region - from1Region;
  const direction2 = to2Region - from2Region;
  if ((direction1 > 0 && direction2 > 0) || (direction1 < 0 && direction2 < 0)) {
    overlap += 20;
  }
  
  // Similar distance bonus
  const dist1 = estimateDistance(route1.fromPostal, route1.toPostal);
  const dist2 = estimateDistance(route2.fromPostal, route2.toPostal);
  const distDiff = Math.abs(dist1 - dist2);
  if (distDiff < 30) overlap += 20;
  else if (distDiff < 60) overlap += 10;
  
  return Math.min(100, overlap);
}

/**
 * Calculate compatibility score between two profiles
 */
export function calculateCompatibility(profile1: BuddyProfile, profile2: BuddyProfile): number {
  let score = 0;
  
  // Route overlap (40% weight)
  const routeOverlap = calculateRouteOverlap(
    { fromPostal: profile1.fromPostal, toPostal: profile1.toPostal, distanceKm: 0, estimatedDurationMin: 0 },
    { fromPostal: profile2.fromPostal, toPostal: profile2.toPostal, distanceKm: 0, estimatedDurationMin: 0 }
  );
  score += routeOverlap * 0.4;
  
  // Date compatibility (30% weight)
  const daysDiff = Math.abs(
    (profile1.moveDate.getTime() - profile2.moveDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const maxFlexibility = Math.max(profile1.flexibleDays, profile2.flexibleDays);
  if (daysDiff === 0) score += 30;
  else if (daysDiff <= maxFlexibility) score += 30 * (1 - daysDiff / (maxFlexibility + 1));
  
  // Volume compatibility (20% weight)
  const combinedVolume = profile1.estimatedVolume + profile2.estimatedVolume;
  if (combinedVolume <= 30) score += 20; // Fits in one truck
  else if (combinedVolume <= 50) score += 15;
  else score += 5;
  
  // Preference alignment (10% weight)
  const prefs1 = profile1.preferences;
  const prefs2 = profile2.preferences;
  let prefScore = 0;
  if (prefs1.morningPreferred === prefs2.morningPreferred) prefScore += 2;
  if (prefs1.afternoonPreferred === prefs2.afternoonPreferred) prefScore += 2;
  if (prefs1.weekendOk === prefs2.weekendOk) prefScore += 2;
  if (prefs1.helpWithLoading && prefs2.helpWithLoading) prefScore += 4;
  score += prefScore;
  
  return Math.round(score);
}

/**
 * Calculate potential savings from buddy matching
 */
export function calculatePotentialSavings(
  profile1: BuddyProfile,
  profile2: BuddyProfile,
  basePricePerM3: number = 45
): number {
  const volume1 = profile1.estimatedVolume;
  const volume2 = profile2.estimatedVolume;
  const combinedVolume = volume1 + volume2;
  
  // Individual costs (each books own truck)
  const individualCost1 = volume1 * basePricePerM3 * 1.3; // Individual has overhead
  const individualCost2 = volume2 * basePricePerM3 * 1.3;
  const totalIndividual = individualCost1 + individualCost2;
  
  // Shared cost (one larger truck, shared)
  const sharedCost = combinedVolume * basePricePerM3 * 1.1; // Slight overhead for coordination
  
  // Savings
  const savings = totalIndividual - sharedCost;
  const perPersonSavings = savings / 2;
  
  return Math.round(perPersonSavings);
}

/**
 * Find potential matches for a profile
 */
export function findPotentialMatches(
  profile: BuddyProfile,
  allProfiles: BuddyProfile[],
  minCompatibility: number = 50
): BuddyMatch[] {
  const matches: BuddyMatch[] = [];
  
  for (const other of allProfiles) {
    if (other.id === profile.id) continue;
    if (other.status !== 'searching') continue;
    
    const compatibilityScore = calculateCompatibility(profile, other);
    if (compatibilityScore < minCompatibility) continue;
    
    const routeOverlap = calculateRouteOverlap(
      { fromPostal: profile.fromPostal, toPostal: profile.toPostal, distanceKm: 0, estimatedDurationMin: 0 },
      { fromPostal: other.fromPostal, toPostal: other.toPostal, distanceKm: 0, estimatedDurationMin: 0 }
    );
    
    const daysDiff = Math.abs(
      (profile.moveDate.getTime() - other.moveDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    let dateMatch: BuddyMatch['dateMatch'];
    if (daysDiff === 0) dateMatch = 'exact';
    else if (daysDiff <= Math.min(profile.flexibleDays, other.flexibleDays)) dateMatch = 'flexible';
    else dateMatch = 'negotiable';
    
    const potentialSavings = calculatePotentialSavings(profile, other);
    
    matches.push({
      id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      profiles: [profile, other],
      compatibilityScore,
      routeOverlap,
      dateMatch,
      potentialSavings,
      combinedVolume: profile.estimatedVolume + other.estimatedVolume,
      status: 'proposed',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
  }
  
  return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

/**
 * Format savings display
 */
export function formatSavings(amount: number): string {
  return `CHF ${amount.toLocaleString('de-CH')}`;
}

/**
 * Get match quality label
 */
export function getMatchQualityLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 80) return { label: 'Perfekte Übereinstimmung', color: 'text-green-600' };
  if (score >= 60) return { label: 'Gute Übereinstimmung', color: 'text-blue-600' };
  if (score >= 40) return { label: 'Mögliche Übereinstimmung', color: 'text-yellow-600' };
  return { label: 'Geringe Übereinstimmung', color: 'text-muted-foreground' };
}
