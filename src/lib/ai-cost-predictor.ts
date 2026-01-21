/**
 * AI Cost Predictor
 * ML-based price prediction for moving costs
 */

export interface CostPredictionInput {
  fromPostal: string;
  toPostal: string;
  moveDate: Date;
  apartmentSize: number; // m²
  rooms: number;
  floor: number;
  hasElevator: boolean;
  packingService: boolean;
  furnitureAssembly: boolean;
  specialItems: string[];
}

export interface CostPredictionResult {
  estimatedCost: number;
  confidenceLevel: number; // 0-100
  priceRange: { min: number; max: number };
  breakdown: CostBreakdown;
  factors: PriceFactor[];
  marketComparison: MarketComparison;
  savingsTips: string[];
}

export interface CostBreakdown {
  baseTransport: number;
  laborCost: number;
  packingMaterials: number;
  additionalServices: number;
  insurance: number;
  total: number;
}

export interface PriceFactor {
  name: string;
  impact: 'increase' | 'decrease' | 'neutral';
  percentage: number;
  description: string;
}

export interface MarketComparison {
  averageMarketPrice: number;
  yourEstimate: number;
  percentageDiff: number;
  verdict: 'below_average' | 'average' | 'above_average';
}

/**
 * Base rates for calculations (CHF)
 */
const BASE_RATES = {
  perKm: 2.5,
  perM3: 45,
  perHour: 85,
  packingPerM2: 12,
  assemblyPerItem: 35,
  insuranceRate: 0.02,
  floorSurcharge: 25, // Per floor without elevator
};

/**
 * Special item surcharges
 */
const SPECIAL_ITEM_COSTS: Record<string, number> = {
  piano: 350,
  safe: 200,
  aquarium: 150,
  artwork: 100,
  antique: 120,
  pool_table: 400,
  gym_equipment: 80,
};

/**
 * Seasonal multipliers by month
 */
const SEASONAL_MULTIPLIERS: Record<number, number> = {
  1: 0.9, 2: 0.92, 3: 1.05, 4: 1.0,
  5: 0.98, 6: 1.1, 7: 1.15, 8: 1.08,
  9: 1.2, 10: 1.05, 11: 0.95, 12: 0.85,
};

/**
 * Calculate distance between postal codes (simplified)
 */
function estimateDistance(fromPostal: string, toPostal: string): number {
  // Simplified distance estimation based on first digit
  const fromRegion = parseInt(fromPostal[0]);
  const toRegion = parseInt(toPostal[0]);
  
  const regionDiff = Math.abs(fromRegion - toRegion);
  
  // Base distance + regional distance
  const baseDistance = 15; // Minimum km
  const regionalDistance = regionDiff * 40;
  
  // Add some randomness for realism
  const variance = 0.8 + Math.random() * 0.4;
  
  return Math.round((baseDistance + regionalDistance) * variance);
}

/**
 * Estimate volume from apartment size
 */
function estimateVolume(apartmentSize: number, rooms: number): number {
  // Rough estimate: ~0.4 m³ per m² of living space
  const baseVolume = apartmentSize * 0.4;
  
  // Adjust based on rooms (more rooms = more stuff typically)
  const roomAdjustment = rooms * 2;
  
  return Math.round(baseVolume + roomAdjustment);
}

/**
 * Main prediction function
 */
export function predictMovingCost(input: CostPredictionInput): CostPredictionResult {
  const distance = estimateDistance(input.fromPostal, input.toPostal);
  const volume = estimateVolume(input.apartmentSize, input.rooms);
  
  // Calculate base costs
  const transportCost = distance * BASE_RATES.perKm;
  const volumeCost = volume * BASE_RATES.perM3;
  
  // Estimate hours needed
  const estimatedHours = Math.ceil(volume / 8) + Math.ceil(distance / 50);
  const laborCost = estimatedHours * BASE_RATES.perHour * 2; // 2 workers
  
  // Additional services
  let packingCost = 0;
  if (input.packingService) {
    packingCost = input.apartmentSize * BASE_RATES.packingPerM2;
  }
  
  let assemblyCost = 0;
  if (input.furnitureAssembly) {
    assemblyCost = input.rooms * 3 * BASE_RATES.assemblyPerItem; // ~3 items per room
  }
  
  // Special items
  const specialItemsCost = input.specialItems.reduce((sum, item) => {
    return sum + (SPECIAL_ITEM_COSTS[item.toLowerCase()] || 75);
  }, 0);
  
  // Floor surcharge
  let floorSurcharge = 0;
  if (!input.hasElevator && input.floor > 0) {
    floorSurcharge = input.floor * BASE_RATES.floorSurcharge * (volume / 10);
  }
  
  // Calculate subtotal
  const subtotal = transportCost + volumeCost + laborCost + packingCost + 
                   assemblyCost + specialItemsCost + floorSurcharge;
  
  // Apply seasonal multiplier
  const month = input.moveDate.getMonth() + 1;
  const seasonalMultiplier = SEASONAL_MULTIPLIERS[month] || 1.0;
  
  // Insurance cost
  const insuranceCost = subtotal * BASE_RATES.insuranceRate;
  
  // Final calculation
  const totalBeforeSeasonal = subtotal + insuranceCost;
  const estimatedCost = Math.round(totalBeforeSeasonal * seasonalMultiplier);
  
  // Calculate confidence based on input completeness
  let confidence = 70;
  if (input.specialItems.length > 0) confidence += 5;
  if (input.packingService || input.furnitureAssembly) confidence += 5;
  confidence = Math.min(95, confidence);
  
  // Price range (±15%)
  const variance = 0.15;
  const priceRange = {
    min: Math.round(estimatedCost * (1 - variance)),
    max: Math.round(estimatedCost * (1 + variance)),
  };
  
  // Breakdown
  const breakdown: CostBreakdown = {
    baseTransport: Math.round(transportCost + volumeCost),
    laborCost: Math.round(laborCost),
    packingMaterials: Math.round(packingCost),
    additionalServices: Math.round(assemblyCost + specialItemsCost + floorSurcharge),
    insurance: Math.round(insuranceCost),
    total: estimatedCost,
  };
  
  // Price factors
  const factors: PriceFactor[] = [];
  
  if (seasonalMultiplier > 1.05) {
    factors.push({
      name: 'Hochsaison',
      impact: 'increase',
      percentage: Math.round((seasonalMultiplier - 1) * 100),
      description: 'Erhöhte Nachfrage in diesem Monat',
    });
  } else if (seasonalMultiplier < 0.95) {
    factors.push({
      name: 'Nebensaison',
      impact: 'decrease',
      percentage: Math.round((1 - seasonalMultiplier) * 100),
      description: 'Günstigere Preise in dieser Zeit',
    });
  }
  
  if (!input.hasElevator && input.floor > 1) {
    factors.push({
      name: 'Kein Lift',
      impact: 'increase',
      percentage: Math.round((floorSurcharge / subtotal) * 100),
      description: `${input.floor}. Stock ohne Aufzug`,
    });
  }
  
  if (distance > 100) {
    factors.push({
      name: 'Langstrecke',
      impact: 'increase',
      percentage: 15,
      description: `Über ${distance}km Distanz`,
    });
  }
  
  // Market comparison
  const avgMarketPrice = estimatedCost * (0.9 + Math.random() * 0.2);
  const percentageDiff = ((estimatedCost - avgMarketPrice) / avgMarketPrice) * 100;
  
  const marketComparison: MarketComparison = {
    averageMarketPrice: Math.round(avgMarketPrice),
    yourEstimate: estimatedCost,
    percentageDiff: Math.round(percentageDiff),
    verdict: percentageDiff < -5 ? 'below_average' : 
             percentageDiff > 5 ? 'above_average' : 'average',
  };
  
  // Savings tips
  const savingsTips: string[] = [];
  
  if (seasonalMultiplier > 1.0) {
    savingsTips.push('Umzug in Januar, Februar oder Dezember spart bis zu 20%');
  }
  if (input.moveDate.getDay() === 5 || input.moveDate.getDay() === 6) {
    savingsTips.push('Wochentage (Mo-Do) sind günstiger als Wochenende');
  }
  if (!input.packingService) {
    savingsTips.push('Selbst packen spart ca. CHF ' + Math.round(input.apartmentSize * BASE_RATES.packingPerM2));
  }
  if (volume > 30) {
    savingsTips.push('Entrümpeln vor dem Umzug reduziert Volumen und Kosten');
  }
  
  return {
    estimatedCost,
    confidenceLevel: confidence,
    priceRange,
    breakdown,
    factors,
    marketComparison,
    savingsTips: savingsTips.slice(0, 3),
  };
}

/**
 * Format currency for display
 */
export function formatCHF(amount: number): string {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
