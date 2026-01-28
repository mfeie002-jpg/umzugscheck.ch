/**
 * Dynamic Pricing Engine for Swiss Moving Services
 * 
 * Implements instant guaranteed pricing based on:
 * - Base move cost by volume
 * - Seasonality adjustments (Swiss holidays, peak months)
 * - Floor access complexity (stairs vs lifts)
 * - Distance surcharges
 * - Service tier selection
 * 
 * @see docs/strategy/RELO_OS_BLUEPRINT.md
 */

import { MoveProject, PriceBreakdown, DigitalTwin } from './move-project';

// ============================================================================
// TYPES
// ============================================================================

export type ServiceTier = 'essential' | 'comfort' | 'premium';

export interface PricingInput {
  totalVolume: number;         // m³
  distanceKm: number;          // kilometers
  originFloor: number;
  originHasElevator: boolean;
  destinationFloor: number;
  destinationHasElevator: boolean;
  moveDate: string;            // ISO date string
  serviceTier: ServiceTier;
  additionalServices: string[];
  fragilityScore?: number;     // 0-100
}

export interface ServiceTierDetails {
  id: ServiceTier;
  name: string;
  description: string;
  features: string[];
  multiplier: number;
  popular?: boolean;
}

export interface SeasonalityFactor {
  factor: number;
  reason: string;
  savings?: number;
  alternativeDate?: string;
}

export interface PricingResult {
  tiers: {
    essential: TierPrice;
    comfort: TierPrice;
    premium: TierPrice;
  };
  selectedTier: ServiceTier;
  breakdown: PriceBreakdown;
  seasonality: SeasonalityFactor;
  alternativeDates: AlternativeDate[];
  validUntil: string;
}

export interface TierPrice {
  total: number;
  basePrice: number;
  features: string[];
}

export interface AlternativeDate {
  date: string;
  savings: number;
  reason: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Base price per m³ in CHF
const BASE_PRICE_PER_M3 = 65;

// Distance pricing (per km above 20km threshold)
const DISTANCE_THRESHOLD_KM = 20;
const PRICE_PER_KM = 2.5;

// Floor access surcharges (per floor without elevator)
const FLOOR_SURCHARGE_NO_ELEVATOR = 50; // CHF per floor
const FLOOR_SURCHARGE_WITH_ELEVATOR = 10; // CHF per floor (still some time)

// Fragility surcharges
const FRAGILITY_MULTIPLIER_HIGH = 1.15; // >70 fragility score
const FRAGILITY_MULTIPLIER_MEDIUM = 1.08; // 40-70
const FRAGILITY_MULTIPLIER_LOW = 1.0; // <40

// Service tier multipliers
const TIER_MULTIPLIERS: Record<ServiceTier, number> = {
  essential: 1.0,
  comfort: 1.25,
  premium: 1.55
};

// Additional service prices (flat or per-volume)
const SERVICE_PRICES: Record<string, { type: 'flat' | 'volume'; price: number }> = {
  verpackung: { type: 'volume', price: 15 }, // CHF per m³
  auspacken: { type: 'volume', price: 12 },
  reinigung: { type: 'flat', price: 450 },
  entsorgung: { type: 'flat', price: 200 },
  montage: { type: 'flat', price: 180 },
  lagerung: { type: 'flat', price: 150 }, // per month
  moebellift: { type: 'flat', price: 350 },
  klaviertransport: { type: 'flat', price: 400 },
};

// Swiss public holidays and peak periods
const SWISS_HOLIDAYS_2026 = [
  '2026-01-01', // Neujahr
  '2026-01-02', // Berchtoldstag
  '2026-04-03', // Karfreitag
  '2026-04-06', // Ostermontag
  '2026-05-14', // Auffahrt
  '2026-05-25', // Pfingstmontag
  '2026-08-01', // Bundesfeiertag
  '2026-12-25', // Weihnachten
  '2026-12-26', // Stephanstag
];

const PEAK_PERIODS = [
  { start: '03-25', end: '04-05', factor: 1.25, reason: 'Osterferien' },
  { start: '06-20', end: '07-15', factor: 1.35, reason: 'Sommerumzugsspitze' },
  { start: '09-15', end: '10-10', factor: 1.30, reason: 'Herbstumzugsspitze' },
];

// End-of-month surcharge
const END_OF_MONTH_SURCHARGE = 1.15;
const END_OF_MONTH_DAYS = [28, 29, 30, 31, 1, 2]; // Last days and first days

// Platform fee
const PLATFORM_FEE_PERCENT = 0.05; // 5%

// ============================================================================
// SERVICE TIER DEFINITIONS
// ============================================================================

export const SERVICE_TIERS: ServiceTierDetails[] = [
  {
    id: 'essential',
    name: 'Essential',
    description: 'Sie packen, wir transportieren',
    features: [
      'Transport & Verladen',
      'Professionelles Team',
      'Basisversicherung',
      'Online-Tracking',
    ],
    multiplier: 1.0,
  },
  {
    id: 'comfort',
    name: 'Comfort',
    description: 'Sorglos zügeln ohne Stress',
    features: [
      'Alles aus Essential',
      'Ein- & Auspacken',
      'Möbelmontage/-demontage',
      'Premium-Versicherung',
      'Persönlicher Umzugsberater',
    ],
    multiplier: 1.25,
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'White-Glove Rundum-Service',
    features: [
      'Alles aus Comfort',
      'Endreinigung alte Wohnung',
      '3 Monate Lagerung inklusive',
      'Spezialtransporte (Kunst, Klavier)',
      'Abgabegarantie',
      'Prioritäts-Support',
    ],
    multiplier: 1.55,
  },
];

// ============================================================================
// SEASONALITY CALCULATION
// ============================================================================

/**
 * Calculate seasonality factor for a given date
 */
export function calculateSeasonalityFactor(dateStr: string): SeasonalityFactor {
  const date = new Date(dateStr);
  const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const dayOfMonth = date.getDate();
  const dateISO = dateStr.split('T')[0];
  
  // Check Swiss holidays
  if (SWISS_HOLIDAYS_2026.includes(dateISO)) {
    return {
      factor: 1.40,
      reason: 'Feiertag-Zuschlag',
    };
  }
  
  // Check peak periods
  for (const period of PEAK_PERIODS) {
    if (monthDay >= period.start && monthDay <= period.end) {
      return {
        factor: period.factor,
        reason: period.reason,
      };
    }
  }
  
  // Check end-of-month
  if (END_OF_MONTH_DAYS.includes(dayOfMonth)) {
    return {
      factor: END_OF_MONTH_SURCHARGE,
      reason: 'Monatsende-Zuschlag',
    };
  }
  
  // Check weekday discount (Tue-Thu)
  const dayOfWeek = date.getDay();
  if (dayOfWeek >= 2 && dayOfWeek <= 4) {
    return {
      factor: 0.92,
      reason: 'Wochenmitte-Rabatt',
      savings: 8,
    };
  }
  
  // Default: no adjustment
  return {
    factor: 1.0,
    reason: 'Standardpreis',
  };
}

/**
 * Find alternative dates with better pricing
 */
export function findAlternativeDates(
  originalDate: string,
  basePrice: number
): AlternativeDate[] {
  const alternatives: AlternativeDate[] = [];
  const original = new Date(originalDate);
  const originalFactor = calculateSeasonalityFactor(originalDate).factor;
  
  // Check surrounding 14 days
  for (let offset = -7; offset <= 14; offset++) {
    if (offset === 0) continue;
    
    const checkDate = new Date(original);
    checkDate.setDate(checkDate.getDate() + offset);
    
    // Skip weekends for suggestions
    const dayOfWeek = checkDate.getDay();
    if (dayOfWeek === 0) continue; // Sunday
    
    const checkDateStr = checkDate.toISOString().split('T')[0];
    const factor = calculateSeasonalityFactor(checkDateStr);
    
    if (factor.factor < originalFactor) {
      const savings = Math.round(basePrice * (originalFactor - factor.factor));
      if (savings > 50) { // Only suggest if savings > CHF 50
        alternatives.push({
          date: checkDateStr,
          savings,
          reason: factor.reason,
        });
      }
    }
  }
  
  // Sort by savings and take top 3
  return alternatives
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 3);
}

// ============================================================================
// FLOOR ACCESS CALCULATION
// ============================================================================

/**
 * Calculate floor access surcharge
 */
export function calculateFloorSurcharge(
  floor: number,
  hasElevator: boolean
): number {
  if (floor <= 0) return 0;
  
  if (hasElevator) {
    return floor * FLOOR_SURCHARGE_WITH_ELEVATOR;
  }
  
  // Without elevator: progressive pricing (higher floors cost more)
  let total = 0;
  for (let f = 1; f <= floor; f++) {
    total += FLOOR_SURCHARGE_NO_ELEVATOR * (1 + (f - 1) * 0.1);
  }
  return Math.round(total);
}

// ============================================================================
// MAIN PRICING FUNCTION
// ============================================================================

/**
 * Calculate full pricing for a move
 */
export function calculateMovePricing(input: PricingInput): PricingResult {
  // 1. Base price from volume
  const basePrice = Math.round(input.totalVolume * BASE_PRICE_PER_M3);
  
  // 2. Distance surcharge
  const distanceKm = Math.max(0, input.distanceKm - DISTANCE_THRESHOLD_KM);
  const distanceSurcharge = Math.round(distanceKm * PRICE_PER_KM);
  
  // 3. Floor surcharges
  const originFloorSurcharge = calculateFloorSurcharge(
    input.originFloor,
    input.originHasElevator
  );
  const destFloorSurcharge = calculateFloorSurcharge(
    input.destinationFloor,
    input.destinationHasElevator
  );
  const totalFloorSurcharge = originFloorSurcharge + destFloorSurcharge;
  
  // 4. Fragility surcharge
  let fragilityMultiplier = FRAGILITY_MULTIPLIER_LOW;
  if (input.fragilityScore && input.fragilityScore > 70) {
    fragilityMultiplier = FRAGILITY_MULTIPLIER_HIGH;
  } else if (input.fragilityScore && input.fragilityScore > 40) {
    fragilityMultiplier = FRAGILITY_MULTIPLIER_MEDIUM;
  }
  
  // 5. Seasonality
  const seasonality = calculateSeasonalityFactor(input.moveDate);
  
  // 6. Calculate subtotal before tier
  const subtotal = Math.round(
    (basePrice + distanceSurcharge + totalFloorSurcharge) * 
    fragilityMultiplier * 
    seasonality.factor
  );
  
  // 7. Additional services
  const serviceFees: Record<string, number> = {};
  let serviceTotal = 0;
  for (const service of input.additionalServices) {
    const pricing = SERVICE_PRICES[service];
    if (pricing) {
      const fee = pricing.type === 'volume' 
        ? Math.round(pricing.price * input.totalVolume)
        : pricing.price;
      serviceFees[service] = fee;
      serviceTotal += fee;
    }
  }
  
  // 8. Calculate all three tiers
  const tiers: PricingResult['tiers'] = {
    essential: {
      total: Math.round(subtotal * TIER_MULTIPLIERS.essential + serviceTotal),
      basePrice: subtotal,
      features: SERVICE_TIERS[0].features,
    },
    comfort: {
      total: Math.round(subtotal * TIER_MULTIPLIERS.comfort + serviceTotal),
      basePrice: subtotal,
      features: SERVICE_TIERS[1].features,
    },
    premium: {
      total: Math.round(subtotal * TIER_MULTIPLIERS.premium + serviceTotal),
      basePrice: subtotal,
      features: SERVICE_TIERS[2].features,
    },
  };
  
  // 9. Get selected tier total
  const selectedTotal = tiers[input.serviceTier].total;
  
  // 10. Platform fee
  const platformFee = Math.round(selectedTotal * PLATFORM_FEE_PERCENT);
  
  // 11. Final total
  const finalTotal = selectedTotal + platformFee;
  
  // 12. Alternative dates
  const alternativeDates = findAlternativeDates(input.moveDate, basePrice);
  
  // 13. Build breakdown
  const breakdown: PriceBreakdown = {
    basePrice,
    distanceSurcharge,
    floorSurcharge: totalFloorSurcharge,
    fragileSurcharge: Math.round(basePrice * (fragilityMultiplier - 1)),
    seasonalAdjustment: Math.round(subtotal * (seasonality.factor - 1)),
    serviceFees,
    platformFee,
    total: finalTotal,
    currency: 'CHF',
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    guaranteeType: 'fixed',
  };
  
  return {
    tiers,
    selectedTier: input.serviceTier,
    breakdown,
    seasonality,
    alternativeDates,
    validUntil: breakdown.validUntil,
  };
}

/**
 * Calculate pricing from a MoveProject
 */
export function calculateProjectPricing(project: MoveProject): PricingResult {
  const twin = project.digitalTwin;
  
  // Estimate distance if not provided (placeholder)
  const estimatedDistance = 15; // Default assumption
  
  return calculateMovePricing({
    totalVolume: twin?.totalVolume || project.totalVolume || 25,
    distanceKm: estimatedDistance,
    originFloor: project.origin.floor || 0,
    originHasElevator: project.origin.hasElevator || false,
    destinationFloor: project.destination.floor || 0,
    destinationHasElevator: project.destination.hasElevator || false,
    moveDate: project.moveDate || new Date().toISOString(),
    serviceTier: project.serviceTier || 'comfort',
    additionalServices: project.additionalServices || [],
    fragilityScore: twin?.fragilityScore,
  });
}

// ============================================================================
// DISPLAY HELPERS
// ============================================================================

export function formatPrice(price: number): string {
  return `CHF ${price.toLocaleString('de-CH')}`;
}

export function getSeasonalityBadge(factor: number): {
  label: string;
  color: string;
} {
  if (factor <= 0.95) {
    return { label: 'Günstige Zeit', color: 'bg-emerald-100 text-emerald-700' };
  }
  if (factor >= 1.20) {
    return { label: 'Hochsaison', color: 'bg-amber-100 text-amber-700' };
  }
  if (factor >= 1.10) {
    return { label: 'Erhöhte Nachfrage', color: 'bg-yellow-100 text-yellow-700' };
  }
  return { label: 'Normalpreis', color: 'bg-muted text-muted-foreground' };
}
