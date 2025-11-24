/**
 * Smart Lead Recommendation Engine
 * Analyzes provider history and suggests best leads
 */

export interface LeadRecommendation {
  leadId: string;
  score: number;
  reasons: string[];
  estimatedConversionProbability: number;
  recommendedPrice: number;
}

export interface ProviderProfile {
  providerId: string;
  historicalConversions: {
    totalLeads: number;
    convertedLeads: number;
    conversionRate: number;
  };
  preferredRegions: string[];
  preferredVolumeRange: { min: number; max: number };
  averageJobValue: number;
  currentCapacity: number;
  maxLeadsPerMonth: number;
}

/**
 * Calculate match score between provider and lead
 */
export function calculateLeadMatchScore(
  lead: any,
  providerProfile: ProviderProfile
): LeadRecommendation {
  let score = 0;
  const reasons: string[] = [];

  // 1. Location match (0-30 points)
  const leadCantons = [lead.from_postal?.substring(0, 1), lead.to_postal?.substring(0, 1)];
  const matchingCantons = leadCantons.filter(c => 
    providerProfile.preferredRegions.some(region => region.startsWith(c || ''))
  ).length;
  
  const locationScore = (matchingCantons / 2) * 30;
  score += locationScore;
  
  if (locationScore >= 20) {
    reasons.push('Bevorzugte Region');
  }

  // 2. Volume match (0-25 points)
  const leadVolume = lead.calculator_output?.volumeM3 || lead.calculator_output?.volume || 30;
  const { min, max } = providerProfile.preferredVolumeRange;
  
  let volumeScore = 0;
  if (leadVolume >= min && leadVolume <= max) {
    volumeScore = 25; // Perfect match
    reasons.push('Ideale Umzugsgröße');
  } else if (leadVolume < min) {
    volumeScore = Math.max(0, 15 - (min - leadVolume) * 0.5);
  } else {
    volumeScore = Math.max(0, 15 - (leadVolume - max) * 0.3);
  }
  score += volumeScore;

  // 3. Capacity availability (0-20 points)
  const capacityUsed = (providerProfile.currentCapacity / providerProfile.maxLeadsPerMonth) * 100;
  const capacityScore = capacityUsed < 50 ? 20 : capacityUsed < 80 ? 15 : 10;
  score += capacityScore;
  
  if (capacityUsed < 50) {
    reasons.push('Hohe Verfügbarkeit');
  }

  // 4. Value match (0-15 points)
  const estimatedValue = (lead.calculator_output?.priceMin + lead.calculator_output?.priceMax) / 2 || 2000;
  const valueDifference = Math.abs(estimatedValue - providerProfile.averageJobValue);
  const valueScore = Math.max(0, 15 - (valueDifference / providerProfile.averageJobValue) * 10);
  score += valueScore;

  if (valueScore >= 12) {
    reasons.push('Passender Auftragswert');
  }

  // 5. Urgency bonus (0-10 points)
  const moveDate = lead.move_date ? new Date(lead.move_date) : null;
  if (moveDate) {
    const daysUntilMove = Math.floor((moveDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilMove < 14) {
      score += 10;
      reasons.push('Dringender Umzugstermin');
    } else if (daysUntilMove < 30) {
      score += 5;
    }
  }

  // Calculate estimated conversion probability based on score and history
  const baseConversion = providerProfile.historicalConversions.conversionRate || 0.3;
  const scoreMultiplier = score / 100;
  const estimatedConversionProbability = Math.min(0.95, baseConversion * (1 + scoreMultiplier));

  // Calculate recommended price based on match quality
  const basePrice = 30;
  const demandMultiplier = score > 80 ? 1.2 : score > 60 ? 1.0 : 0.85;
  const recommendedPrice = Math.round(basePrice * demandMultiplier);

  return {
    leadId: lead.id,
    score: Math.round(score),
    reasons,
    estimatedConversionProbability: Math.round(estimatedConversionProbability * 100) / 100,
    recommendedPrice,
  };
}

/**
 * Rank multiple leads for a provider
 */
export function rankLeadsForProvider(
  leads: any[],
  providerProfile: ProviderProfile
): LeadRecommendation[] {
  return leads
    .map(lead => calculateLeadMatchScore(lead, providerProfile))
    .sort((a, b) => b.score - a.score);
}

/**
 * Get top N recommendations
 */
export function getTopRecommendations(
  leads: any[],
  providerProfile: ProviderProfile,
  limit: number = 10
): LeadRecommendation[] {
  return rankLeadsForProvider(leads, providerProfile).slice(0, limit);
}
