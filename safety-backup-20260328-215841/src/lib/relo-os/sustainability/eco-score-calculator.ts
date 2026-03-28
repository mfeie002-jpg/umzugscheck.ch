/**
 * Eco-Score Calculator
 * Calculates CO2 footprint for Swiss moves
 */

import type { 
  EcoScoreResult, 
  MoveEcoInput, 
  EcoRecommendation 
} from './types';
import { CO2_FACTORS, ECO_SCORE_THRESHOLDS } from './types';

/**
 * Calculate eco score for a move
 */
export function calculateEcoScore(input: MoveEcoInput): EcoScoreResult {
  const transportCO2 = calculateTransportCO2(input);
  const wasteCO2 = calculateWasteCO2(input);
  const packagingCO2 = calculatePackagingCO2(input);
  
  const totalCO2kg = transportCO2 + wasteCO2 + packagingCO2;
  const score = getScoreGrade(totalCO2kg);
  
  // Compare to Swiss average based on room count
  const avgCO2 = getAverageForRoomCount(input.roomCount);
  const vsAverageCH = Math.round(((totalCO2kg - avgCO2) / avgCO2) * 100);
  
  return {
    overallScore: score,
    totalCO2kg: Math.round(totalCO2kg),
    breakdown: {
      transport: Math.round(transportCO2),
      waste: Math.round(wasteCO2),
      packaging: Math.round(packagingCO2),
    },
    recommendations: generateRecommendations(input, { transportCO2, wasteCO2, packagingCO2 }),
    comparison: {
      vsAverageCH,
      treesEquivalent: Math.round(totalCO2kg / 21), // 1 tree absorbs ~21kg CO2/year
      carKmEquivalent: Math.round(totalCO2kg / 0.12), // avg car ~120g/km
    },
  };
}

function calculateTransportCO2(input: MoveEcoInput): number {
  const vehicleType = input.vehicleType || estimateVehicleType(input.roomCount);
  const baseFactor = CO2_FACTORS.transport[vehicleType];
  
  let co2 = input.distanceKm * baseFactor;
  
  // Return trip (empty truck)
  co2 += input.distanceKm * baseFactor * 0.6;
  
  // Shared move discount
  if (input.isSharedMove) {
    co2 *= (1 - CO2_FACTORS.transport.shared_move_discount);
  }
  
  return co2;
}

function calculateWasteCO2(input: MoveEcoInput): number {
  // Estimate waste if not provided
  const wasteKg = input.wasteVolumeLiters 
    ? input.wasteVolumeLiters * 0.15 // ~150g per liter average
    : estimateWasteForRoomCount(input.roomCount);
  
  // Calculate recycling vs landfill ratio
  let recycleRatio = 0.3; // Default 30% recycled
  
  if (input.recyclables) {
    const recycledCategories = Object.values(input.recyclables).filter(Boolean).length;
    recycleRatio = Math.min(0.8, 0.2 + (recycledCategories * 0.12));
  }
  
  const landfillCO2 = wasteKg * (1 - recycleRatio) * CO2_FACTORS.waste.incineration;
  const recyclingCO2 = wasteKg * recycleRatio * CO2_FACTORS.waste.recycling;
  
  return landfillCO2 + recyclingCO2;
}

function calculatePackagingCO2(input: MoveEcoInput): number {
  // Estimate boxes based on room count
  const boxCount = estimateBoxCount(input.roomCount);
  
  return boxCount * CO2_FACTORS.packaging.cardboard_box +
         boxCount * 0.5 * CO2_FACTORS.packaging.bubble_wrap_meter +
         (boxCount / 10) * CO2_FACTORS.packaging.tape_roll;
}

function estimateVehicleType(roomCount: number): 'small_van' | 'medium_truck' | 'large_truck' {
  if (roomCount <= 2) return 'small_van';
  if (roomCount <= 4) return 'medium_truck';
  return 'large_truck';
}

function estimateWasteForRoomCount(roomCount: number): number {
  // Average waste per room in kg
  const wastePerRoom = 25;
  return roomCount * wastePerRoom;
}

function estimateBoxCount(roomCount: number): number {
  // ~8-12 boxes per room on average
  return roomCount * 10;
}

function getAverageForRoomCount(roomCount: number): number {
  if (roomCount <= 3) return CO2_FACTORS.average_swiss_move.co2_3room;
  if (roomCount <= 4) return CO2_FACTORS.average_swiss_move.co2_4room;
  return CO2_FACTORS.average_swiss_move.co2_house;
}

function getScoreGrade(totalCO2: number): 'A' | 'B' | 'C' | 'D' | 'E' {
  if (totalCO2 < ECO_SCORE_THRESHOLDS.A) return 'A';
  if (totalCO2 < ECO_SCORE_THRESHOLDS.B) return 'B';
  if (totalCO2 < ECO_SCORE_THRESHOLDS.C) return 'C';
  if (totalCO2 < ECO_SCORE_THRESHOLDS.D) return 'D';
  return 'E';
}

function generateRecommendations(
  input: MoveEcoInput,
  breakdown: { transportCO2: number; wasteCO2: number; packagingCO2: number }
): EcoRecommendation[] {
  const recommendations: EcoRecommendation[] = [];
  
  // Transport recommendations
  if (!input.isSharedMove && input.distanceKm < 100) {
    recommendations.push({
      id: 'shared-move',
      category: 'transport',
      title: 'Beiladung nutzen',
      description: 'Teilen Sie den Umzugswagen mit anderen für kürzere Strecken.',
      savingsCO2kg: Math.round(breakdown.transportCO2 * 0.35),
      effort: 'mittel',
      icon: 'Users',
    });
  }
  
  if (input.vehicleType === 'large_truck' && input.roomCount <= 4) {
    recommendations.push({
      id: 'smaller-vehicle',
      category: 'transport',
      title: 'Kleineres Fahrzeug wählen',
      description: 'Ein 7.5t LKW statt 18t spart erheblich CO₂.',
      savingsCO2kg: Math.round(breakdown.transportCO2 * 0.3),
      effort: 'niedrig',
      icon: 'Truck',
    });
  }
  
  // Waste recommendations
  const hasAllRecyclables = input.recyclables && 
    Object.values(input.recyclables).every(Boolean);
  
  if (!hasAllRecyclables) {
    recommendations.push({
      id: 'recycle-all',
      category: 'waste',
      title: 'Alles richtig recyceln',
      description: 'Nutzen Sie alle Recycling-Kategorien: Papier, Glas, Metall, Elektro, Textilien.',
      savingsCO2kg: Math.round(breakdown.wasteCO2 * 0.4),
      effort: 'niedrig',
      icon: 'Recycle',
    });
  }
  
  recommendations.push({
    id: 'donate-items',
    category: 'waste',
    title: 'Spenden statt entsorgen',
    description: 'Gut erhaltene Möbel und Kleidung an Brockenhaus oder Caritas spenden.',
    savingsCO2kg: Math.round(breakdown.wasteCO2 * 0.25),
    effort: 'mittel',
    icon: 'Heart',
  });
  
  // Packaging recommendations
  recommendations.push({
    id: 'reusable-crates',
    category: 'packaging',
    title: 'Wiederverwendbare Kisten mieten',
    description: 'Plastik-Umzugskisten statt Kartons – oft günstiger und umweltfreundlicher.',
    savingsCO2kg: Math.round(breakdown.packagingCO2 * 0.7),
    effort: 'niedrig',
    icon: 'Package',
  });
  
  // Timing recommendation
  recommendations.push({
    id: 'off-peak-move',
    category: 'timing',
    title: 'Nebensaison wählen',
    description: 'Umzüge Nov-Feb: weniger Verkehr, kürzere Wege, weniger Emissionen.',
    savingsCO2kg: Math.round(breakdown.transportCO2 * 0.1),
    effort: 'mittel',
    icon: 'Calendar',
  });
  
  // Sort by potential savings
  return recommendations.sort((a, b) => b.savingsCO2kg - a.savingsCO2kg).slice(0, 5);
}

/**
 * Get eco score color for display
 */
export function getEcoScoreColor(score: EcoScoreResult['overallScore']): string {
  switch (score) {
    case 'A': return 'text-green-600 bg-green-500/10 border-green-500/30';
    case 'B': return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30';
    case 'C': return 'text-yellow-600 bg-yellow-500/10 border-yellow-500/30';
    case 'D': return 'text-orange-600 bg-orange-500/10 border-orange-500/30';
    case 'E': return 'text-red-600 bg-red-500/10 border-red-500/30';
  }
}

/**
 * Format CO2 for display
 */
export function formatCO2(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} t CO₂`;
  }
  return `${Math.round(kg)} kg CO₂`;
}
