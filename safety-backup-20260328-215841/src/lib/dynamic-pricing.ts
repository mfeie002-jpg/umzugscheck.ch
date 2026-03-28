/**
 * Dynamic Pricing System for Lead Distribution
 * Adjusts lead prices based on demand, seasonal factors, and availability
 */

export interface DynamicPricingFactors {
  basePriceChf: number;
  demandMultiplier: number;
  seasonalMultiplier: number;
  availabilityMultiplier: number;
  finalPriceChf: number;
  factors: {
    demand: {
      interestedProviders: number;
      multiplier: number;
      adjustment: string;
    };
    seasonal: {
      month: number;
      season: string;
      multiplier: number;
      adjustment: string;
    };
    availability: {
      averageCapacity: number;
      multiplier: number;
      adjustment: string;
    };
  };
}

/**
 * Calculate demand multiplier based on number of interested providers
 * More competition = higher price
 */
export function calculateDemandMultiplier(interestedProviders: number): number {
  if (interestedProviders === 0) return 0.7; // Low interest, discount
  if (interestedProviders === 1) return 0.85;
  if (interestedProviders === 2) return 1.0; // Base price
  if (interestedProviders <= 4) return 1.15;
  if (interestedProviders <= 6) return 1.3;
  return 1.5; // High competition
}

/**
 * Calculate seasonal multiplier based on moving season patterns
 * Peak season (May-September) = higher prices
 * Off-season (November-February) = lower prices
 */
export function calculateSeasonalMultiplier(date: Date = new Date()): number {
  const month = date.getMonth(); // 0-11

  // Peak moving season in Switzerland: May-September
  if (month >= 4 && month <= 8) {
    return 1.25; // 25% premium
  }

  // Shoulder season: March, April, October
  if (month === 2 || month === 3 || month === 9) {
    return 1.1; // 10% premium
  }

  // Off-season: November-February
  return 0.85; // 15% discount
}

/**
 * Get season name for display
 */
export function getSeasonName(date: Date = new Date()): string {
  const month = date.getMonth();
  if (month >= 4 && month <= 8) return 'Hochsaison';
  if (month === 2 || month === 3 || month === 9) return 'Nebensaison';
  return 'Nebensaison';
}

/**
 * Calculate availability multiplier based on provider capacity
 * Lower average capacity = higher prices (scarcity)
 */
export function calculateAvailabilityMultiplier(
  averageCapacityPercentage: number
): number {
  if (averageCapacityPercentage >= 80) return 0.8; // High availability, discount
  if (averageCapacityPercentage >= 60) return 0.9;
  if (averageCapacityPercentage >= 40) return 1.0; // Normal
  if (averageCapacityPercentage >= 20) return 1.2;
  return 1.4; // Low availability, premium
}

/**
 * Calculate complete dynamic pricing with all factors
 */
export function calculateDynamicPricing(
  basePriceChf: number,
  interestedProviders: number,
  averageCapacityPercentage: number,
  leadDate?: Date
): DynamicPricingFactors {
  const date = leadDate || new Date();
  
  const demandMultiplier = calculateDemandMultiplier(interestedProviders);
  const seasonalMultiplier = calculateSeasonalMultiplier(date);
  const availabilityMultiplier = calculateAvailabilityMultiplier(averageCapacityPercentage);

  const finalPriceChf = Math.round(
    basePriceChf * demandMultiplier * seasonalMultiplier * availabilityMultiplier
  );

  return {
    basePriceChf,
    demandMultiplier,
    seasonalMultiplier,
    availabilityMultiplier,
    finalPriceChf,
    factors: {
      demand: {
        interestedProviders,
        multiplier: demandMultiplier,
        adjustment: `${interestedProviders === 0 ? '-30%' : interestedProviders === 1 ? '-15%' : interestedProviders === 2 ? '0%' : interestedProviders <= 4 ? '+15%' : interestedProviders <= 6 ? '+30%' : '+50%'}`,
      },
      seasonal: {
        month: date.getMonth() + 1,
        season: getSeasonName(date),
        multiplier: seasonalMultiplier,
        adjustment: seasonalMultiplier > 1 ? `+${Math.round((seasonalMultiplier - 1) * 100)}%` : `-${Math.round((1 - seasonalMultiplier) * 100)}%`,
      },
      availability: {
        averageCapacity: averageCapacityPercentage,
        multiplier: availabilityMultiplier,
        adjustment: availabilityMultiplier > 1 ? `+${Math.round((availabilityMultiplier - 1) * 100)}%` : `-${Math.round((1 - availabilityMultiplier) * 100)}%`,
      },
    },
  };
}

/**
 * Format pricing breakdown for display
 */
export function formatPricingBreakdown(pricing: DynamicPricingFactors): string {
  return `
Basispreis: CHF ${pricing.basePriceChf}
├─ Nachfrage (${pricing.factors.demand.interestedProviders} Anbieter): ${pricing.factors.demand.adjustment}
├─ Saison (${pricing.factors.seasonal.season}): ${pricing.factors.seasonal.adjustment}
└─ Verfügbarkeit (${pricing.factors.availability.averageCapacity}%): ${pricing.factors.availability.adjustment}
= Endpreis: CHF ${pricing.finalPriceChf}
  `.trim();
}
