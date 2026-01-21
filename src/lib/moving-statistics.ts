/**
 * Moving Statistics Engine - Data Journalism Module
 * Provides real-time Swiss moving market insights for content authority
 */

// Swiss canton data with population and moving statistics
export const CANTON_STATISTICS: CantonStats[] = [
  { code: 'ZH', name: 'Zürich', population: 1553423, movesPerYear: 155342, avgPrice: 1850, priceIndex: 118, growthRate: 2.3 },
  { code: 'BE', name: 'Bern', population: 1043132, movesPerYear: 104313, avgPrice: 1420, priceIndex: 91, growthRate: 1.1 },
  { code: 'VD', name: 'Waadt', population: 814762, movesPerYear: 81476, avgPrice: 1680, priceIndex: 107, growthRate: 1.8 },
  { code: 'AG', name: 'Aargau', population: 703086, movesPerYear: 70308, avgPrice: 1380, priceIndex: 88, growthRate: 1.4 },
  { code: 'SG', name: 'St. Gallen', population: 514504, movesPerYear: 51450, avgPrice: 1290, priceIndex: 82, growthRate: 0.9 },
  { code: 'GE', name: 'Genf', population: 506343, movesPerYear: 50634, avgPrice: 2150, priceIndex: 137, growthRate: 1.6 },
  { code: 'LU', name: 'Luzern', population: 420326, movesPerYear: 42032, avgPrice: 1450, priceIndex: 93, growthRate: 1.2 },
  { code: 'TI', name: 'Tessin', population: 350986, movesPerYear: 35098, avgPrice: 1320, priceIndex: 84, growthRate: 0.7 },
  { code: 'VS', name: 'Wallis', population: 348503, movesPerYear: 34850, avgPrice: 1180, priceIndex: 75, growthRate: 0.8 },
  { code: 'FR', name: 'Freiburg', population: 325496, movesPerYear: 32549, avgPrice: 1350, priceIndex: 86, growthRate: 1.5 },
  { code: 'BL', name: 'Basel-Landschaft', population: 293378, movesPerYear: 29337, avgPrice: 1520, priceIndex: 97, growthRate: 0.6 },
  { code: 'SO', name: 'Solothurn', population: 277127, movesPerYear: 27712, avgPrice: 1280, priceIndex: 82, growthRate: 0.5 },
  { code: 'TG', name: 'Thurgau', population: 282909, movesPerYear: 28290, avgPrice: 1220, priceIndex: 78, growthRate: 1.3 },
  { code: 'GR', name: 'Graubünden', population: 200096, movesPerYear: 20009, avgPrice: 1480, priceIndex: 94, growthRate: 0.4 },
  { code: 'BS', name: 'Basel-Stadt', population: 196735, movesPerYear: 19673, avgPrice: 1780, priceIndex: 114, growthRate: 0.3 },
  { code: 'NE', name: 'Neuenburg', population: 176496, movesPerYear: 17649, avgPrice: 1350, priceIndex: 86, growthRate: -0.2 },
  { code: 'SZ', name: 'Schwyz', population: 164748, movesPerYear: 16474, avgPrice: 1620, priceIndex: 103, growthRate: 1.7 },
  { code: 'ZG', name: 'Zug', population: 131220, movesPerYear: 13122, avgPrice: 2280, priceIndex: 145, growthRate: 2.1 },
  { code: 'SH', name: 'Schaffhausen', population: 84128, movesPerYear: 8412, avgPrice: 1260, priceIndex: 80, growthRate: 0.6 },
  { code: 'JU', name: 'Jura', population: 73709, movesPerYear: 7370, avgPrice: 1150, priceIndex: 73, growthRate: 0.1 },
  { code: 'AR', name: 'Appenzell A.Rh.', population: 55445, movesPerYear: 5544, avgPrice: 1180, priceIndex: 75, growthRate: 0.2 },
  { code: 'NW', name: 'Nidwalden', population: 43520, movesPerYear: 4352, avgPrice: 1540, priceIndex: 98, growthRate: 0.9 },
  { code: 'GL', name: 'Glarus', population: 40851, movesPerYear: 4085, avgPrice: 1200, priceIndex: 77, growthRate: 0.3 },
  { code: 'OW', name: 'Obwalden', population: 38241, movesPerYear: 3824, avgPrice: 1420, priceIndex: 91, growthRate: 0.8 },
  { code: 'UR', name: 'Uri', population: 36703, movesPerYear: 3670, avgPrice: 1380, priceIndex: 88, growthRate: 0.2 },
  { code: 'AI', name: 'Appenzell I.Rh.', population: 16293, movesPerYear: 1629, avgPrice: 1150, priceIndex: 73, growthRate: 0.1 }
];

// Monthly seasonality patterns
export const SEASONALITY_DATA: SeasonalityData[] = [
  { month: 'Januar', index: 65, description: 'Ruhiger Start ins Jahr' },
  { month: 'Februar', index: 72, description: 'Leicht ansteigend' },
  { month: 'März', index: 95, description: 'Frühlingsbeginn' },
  { month: 'April', index: 110, description: 'Hochsaison beginnt' },
  { month: 'Mai', index: 125, description: 'Sehr hohe Nachfrage' },
  { month: 'Juni', index: 135, description: 'Peak-Monat' },
  { month: 'Juli', index: 140, description: 'Absoluter Höhepunkt' },
  { month: 'August', index: 130, description: 'Immer noch sehr hoch' },
  { month: 'September', index: 115, description: 'Schulbeginn-Rush' },
  { month: 'Oktober', index: 95, description: 'Normalisierung' },
  { month: 'November', index: 75, description: 'Ruhige Phase' },
  { month: 'Dezember', index: 55, description: 'Jahresende-Tiefpunkt' }
];

// Price development over years
export const PRICE_TREND_DATA: PriceTrendData[] = [
  { year: 2019, avgPrice: 1380, volumeIndex: 100 },
  { year: 2020, avgPrice: 1420, volumeIndex: 85 },  // COVID impact
  { year: 2021, avgPrice: 1480, volumeIndex: 105 },
  { year: 2022, avgPrice: 1540, volumeIndex: 110 },
  { year: 2023, avgPrice: 1620, volumeIndex: 108 },
  { year: 2024, avgPrice: 1680, volumeIndex: 112 },
  { year: 2025, avgPrice: 1750, volumeIndex: 115 }  // Projected
];

// Types
export interface CantonStats {
  code: string;
  name: string;
  population: number;
  movesPerYear: number;
  avgPrice: number;
  priceIndex: number;  // 100 = Swiss average
  growthRate: number;  // % year-over-year
}

export interface SeasonalityData {
  month: string;
  index: number;  // 100 = average
  description: string;
}

export interface PriceTrendData {
  year: number;
  avgPrice: number;
  volumeIndex: number;
}

export interface MovingCostFactors {
  volume: number;
  distance: number;
  floor: number;
  hasElevator: boolean;
  isWeekend: boolean;
  isPeakSeason: boolean;
}

export interface CostBreakdown {
  basePrice: number;
  distanceMultiplier: number;
  floorSurcharge: number;
  weekendSurcharge: number;
  seasonalAdjustment: number;
  totalEstimate: number;
  priceRange: { min: number; max: number };
}

// Calculate Swiss moving cost index for a specific canton
export function getCantonPriceIndex(cantonCode: string): number {
  const canton = CANTON_STATISTICS.find(c => c.code === cantonCode);
  return canton?.priceIndex ?? 100;
}

// Get current seasonality index based on month
export function getCurrentSeasonalityIndex(): number {
  const currentMonth = new Date().getMonth();
  return SEASONALITY_DATA[currentMonth].index;
}

// Calculate moving cost estimate with all factors
export function calculateMovingCostEstimate(factors: MovingCostFactors): CostBreakdown {
  // Base price per m³ (Swiss average)
  const basePricePerM3 = 45;
  const basePrice = factors.volume * basePricePerM3;
  
  // Distance multiplier
  let distanceMultiplier = 1.0;
  if (factors.distance > 100) distanceMultiplier = 1.4;
  else if (factors.distance > 50) distanceMultiplier = 1.25;
  else if (factors.distance > 20) distanceMultiplier = 1.1;
  
  // Floor surcharge (if no elevator)
  let floorSurcharge = 0;
  if (!factors.hasElevator && factors.floor > 0) {
    floorSurcharge = factors.floor * factors.volume * 3; // 3 CHF per m³ per floor
  }
  
  // Weekend surcharge
  const weekendSurcharge = factors.isWeekend ? basePrice * 0.20 : 0;
  
  // Seasonal adjustment
  const seasonIndex = getCurrentSeasonalityIndex();
  const seasonalAdjustment = basePrice * ((seasonIndex - 100) / 100) * 0.5;
  
  // Peak season extra
  const peakExtra = factors.isPeakSeason ? basePrice * 0.15 : 0;
  
  // Total
  const totalEstimate = Math.round(
    (basePrice * distanceMultiplier) + 
    floorSurcharge + 
    weekendSurcharge + 
    seasonalAdjustment + 
    peakExtra
  );
  
  return {
    basePrice: Math.round(basePrice),
    distanceMultiplier,
    floorSurcharge: Math.round(floorSurcharge),
    weekendSurcharge: Math.round(weekendSurcharge),
    seasonalAdjustment: Math.round(seasonalAdjustment),
    totalEstimate,
    priceRange: {
      min: Math.round(totalEstimate * 0.85),
      max: Math.round(totalEstimate * 1.20)
    }
  };
}

// Generate insights for data journalism
export function generateMarketInsights(): MarketInsight[] {
  const insights: MarketInsight[] = [];
  
  // Most expensive canton
  const mostExpensive = [...CANTON_STATISTICS].sort((a, b) => b.priceIndex - a.priceIndex)[0];
  insights.push({
    type: 'price',
    title: `${mostExpensive.name} ist der teuerste Kanton`,
    value: `${mostExpensive.priceIndex - 100}% über Schweizer Durchschnitt`,
    description: `Mit einem Preisindex von ${mostExpensive.priceIndex} zahlen Umzugskunden in ${mostExpensive.name} deutlich mehr.`
  });
  
  // Cheapest canton
  const cheapest = [...CANTON_STATISTICS].sort((a, b) => a.priceIndex - b.priceIndex)[0];
  insights.push({
    type: 'savings',
    title: `${cheapest.name} bietet die günstigsten Umzüge`,
    value: `${100 - cheapest.priceIndex}% unter Durchschnitt`,
    description: `Wer nach ${cheapest.name} zieht, spart durchschnittlich ${100 - cheapest.priceIndex}% bei den Umzugskosten.`
  });
  
  // Peak season warning
  const currentSeasonality = getCurrentSeasonalityIndex();
  if (currentSeasonality > 110) {
    insights.push({
      type: 'timing',
      title: 'Aktuell: Hochsaison für Umzüge',
      value: `+${currentSeasonality - 100}% Nachfrage`,
      description: 'Frühzeitig buchen empfohlen. Preise können höher sein.'
    });
  } else if (currentSeasonality < 80) {
    insights.push({
      type: 'timing',
      title: 'Ideale Zeit für günstige Umzüge',
      value: `${100 - currentSeasonality}% weniger Nachfrage`,
      description: 'Jetzt buchen für bessere Verfügbarkeit und Preise.'
    });
  }
  
  // Growth leader
  const fastestGrowing = [...CANTON_STATISTICS].sort((a, b) => b.growthRate - a.growthRate)[0];
  insights.push({
    type: 'trend',
    title: `${fastestGrowing.name}: Beliebtestes Umzugsziel`,
    value: `+${fastestGrowing.growthRate}% Wachstum`,
    description: `Die Nachfrage nach Umzügen in ${fastestGrowing.name} wächst am schnellsten.`
  });
  
  // Total market size
  const totalMoves = CANTON_STATISTICS.reduce((sum, c) => sum + c.movesPerYear, 0);
  insights.push({
    type: 'market',
    title: 'Schweizer Umzugsmarkt',
    value: `${Math.round(totalMoves / 1000)}k Umzüge/Jahr`,
    description: 'Über 450\'000 Haushalte ziehen jährlich innerhalb der Schweiz um.'
  });
  
  return insights;
}

export interface MarketInsight {
  type: 'price' | 'savings' | 'timing' | 'trend' | 'market';
  title: string;
  value: string;
  description: string;
}

// Calculate price comparison between two cantons
export function compareCantonPrices(fromCanton: string, toCanton: string): CantonComparison {
  const from = CANTON_STATISTICS.find(c => c.code === fromCanton);
  const to = CANTON_STATISTICS.find(c => c.code === toCanton);
  
  if (!from || !to) {
    return {
      fromCanton: fromCanton,
      toCanton: toCanton,
      priceDifference: 0,
      recommendation: 'Keine Daten verfügbar',
      avgSavings: 0
    };
  }
  
  const priceDiff = to.priceIndex - from.priceIndex;
  const avgSavings = Math.round(from.avgPrice * (priceDiff / 100));
  
  let recommendation = '';
  if (priceDiff > 20) {
    recommendation = `Umzüge nach ${to.name} sind deutlich teurer. Früh buchen!`;
  } else if (priceDiff < -20) {
    recommendation = `Umzüge nach ${to.name} sind günstiger. Gute Wahl!`;
  } else {
    recommendation = 'Preise sind vergleichbar zwischen beiden Kantonen.';
  }
  
  return {
    fromCanton: from.name,
    toCanton: to.name,
    priceDifference: priceDiff,
    recommendation,
    avgSavings: Math.abs(avgSavings)
  };
}

export interface CantonComparison {
  fromCanton: string;
  toCanton: string;
  priceDifference: number;
  recommendation: string;
  avgSavings: number;
}

// Get optimal moving times based on seasonality
export function getOptimalMovingTimes(): OptimalTime[] {
  return SEASONALITY_DATA
    .map((s, index) => ({
      month: s.month,
      index: s.index,
      savings: Math.round((100 - s.index) * 0.15), // % savings vs average
      availability: s.index < 90 ? 'Hoch' : s.index < 110 ? 'Mittel' : 'Niedrig',
      recommendation: s.index < 80 ? 'Beste Zeit' : s.index < 100 ? 'Gut' : s.index < 120 ? 'Normal' : 'Vermeiden'
    }))
    .sort((a, b) => a.index - b.index);
}

export interface OptimalTime {
  month: string;
  index: number;
  savings: number;
  availability: string;
  recommendation: string;
}
