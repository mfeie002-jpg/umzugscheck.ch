/**
 * DATA JOURNALISM ASSETS
 * 
 * Comprehensive Swiss moving and living cost data for:
 * 1. Umzugskosten-Index Schweiz (Moving Cost Index)
 * 2. Schweizer Umzugsstatistik Dashboard (Moving Statistics)
 * 3. Lebenskosten-Vergleich Tool (Living Cost Comparison)
 * 
 * This data is optimized for SEO backlinks and media coverage.
 */

// ============ MOVING COST INDEX ============

export interface CantonMovingCosts {
  canton: string;
  cantonCode: string;
  slug: string;
  avgCost3Zimmer: number;
  avgCost4Zimmer: number;
  avgCostHaus: number;
  priceLevel: 'günstig' | 'mittel' | 'teuer';
  indexValue: number; // 100 = Swiss average
  trend: 'steigend' | 'stabil' | 'sinkend';
  trendPercent: number;
  popularRoutes: Array<{ to: string; avgCost: number }>;
}

export const MOVING_COST_INDEX: CantonMovingCosts[] = [
  {
    canton: 'Zürich',
    cantonCode: 'ZH',
    slug: 'zuerich',
    avgCost3Zimmer: 1450,
    avgCost4Zimmer: 1850,
    avgCostHaus: 3200,
    priceLevel: 'teuer',
    indexValue: 128,
    trend: 'steigend',
    trendPercent: 4.2,
    popularRoutes: [
      { to: 'Winterthur', avgCost: 980 },
      { to: 'Zug', avgCost: 1100 },
      { to: 'Bern', avgCost: 1400 }
    ]
  },
  {
    canton: 'Bern',
    cantonCode: 'BE',
    slug: 'bern',
    avgCost3Zimmer: 1120,
    avgCost4Zimmer: 1450,
    avgCostHaus: 2600,
    priceLevel: 'mittel',
    indexValue: 99,
    trend: 'stabil',
    trendPercent: 1.1,
    popularRoutes: [
      { to: 'Zürich', avgCost: 1400 },
      { to: 'Basel', avgCost: 1200 },
      { to: 'Thun', avgCost: 680 }
    ]
  },
  {
    canton: 'Zug',
    cantonCode: 'ZG',
    slug: 'zug',
    avgCost3Zimmer: 1580,
    avgCost4Zimmer: 2100,
    avgCostHaus: 3800,
    priceLevel: 'teuer',
    indexValue: 139,
    trend: 'steigend',
    trendPercent: 5.8,
    popularRoutes: [
      { to: 'Zürich', avgCost: 1100 },
      { to: 'Luzern', avgCost: 780 },
      { to: 'Schwyz', avgCost: 620 }
    ]
  },
  {
    canton: 'Basel-Stadt',
    cantonCode: 'BS',
    slug: 'basel',
    avgCost3Zimmer: 1280,
    avgCost4Zimmer: 1680,
    avgCostHaus: 2950,
    priceLevel: 'mittel',
    indexValue: 113,
    trend: 'stabil',
    trendPercent: 2.3,
    popularRoutes: [
      { to: 'Basel-Landschaft', avgCost: 650 },
      { to: 'Zürich', avgCost: 1350 },
      { to: 'Freiburg (D)', avgCost: 890 }
    ]
  },
  {
    canton: 'Genf',
    cantonCode: 'GE',
    slug: 'genf',
    avgCost3Zimmer: 1650,
    avgCost4Zimmer: 2200,
    avgCostHaus: 4100,
    priceLevel: 'teuer',
    indexValue: 145,
    trend: 'steigend',
    trendPercent: 6.2,
    popularRoutes: [
      { to: 'Lausanne', avgCost: 980 },
      { to: 'Nyon', avgCost: 720 },
      { to: 'Annecy (F)', avgCost: 850 }
    ]
  },
  {
    canton: 'Waadt',
    cantonCode: 'VD',
    slug: 'waadt',
    avgCost3Zimmer: 1380,
    avgCost4Zimmer: 1780,
    avgCostHaus: 3100,
    priceLevel: 'teuer',
    indexValue: 121,
    trend: 'stabil',
    trendPercent: 2.8,
    popularRoutes: [
      { to: 'Genf', avgCost: 980 },
      { to: 'Freiburg', avgCost: 850 },
      { to: 'Bern', avgCost: 1100 }
    ]
  },
  {
    canton: 'Luzern',
    cantonCode: 'LU',
    slug: 'luzern',
    avgCost3Zimmer: 1180,
    avgCost4Zimmer: 1520,
    avgCostHaus: 2750,
    priceLevel: 'mittel',
    indexValue: 104,
    trend: 'stabil',
    trendPercent: 1.5,
    popularRoutes: [
      { to: 'Zürich', avgCost: 1050 },
      { to: 'Zug', avgCost: 780 },
      { to: 'Bern', avgCost: 1150 }
    ]
  },
  {
    canton: 'St. Gallen',
    cantonCode: 'SG',
    slug: 'st-gallen',
    avgCost3Zimmer: 980,
    avgCost4Zimmer: 1280,
    avgCostHaus: 2350,
    priceLevel: 'günstig',
    indexValue: 86,
    trend: 'sinkend',
    trendPercent: -0.8,
    popularRoutes: [
      { to: 'Zürich', avgCost: 1100 },
      { to: 'Winterthur', avgCost: 780 },
      { to: 'Konstanz (D)', avgCost: 650 }
    ]
  },
  {
    canton: 'Aargau',
    cantonCode: 'AG',
    slug: 'aargau',
    avgCost3Zimmer: 1050,
    avgCost4Zimmer: 1350,
    avgCostHaus: 2480,
    priceLevel: 'günstig',
    indexValue: 92,
    trend: 'stabil',
    trendPercent: 0.5,
    popularRoutes: [
      { to: 'Zürich', avgCost: 850 },
      { to: 'Basel', avgCost: 780 },
      { to: 'Bern', avgCost: 1050 }
    ]
  },
  {
    canton: 'Thurgau',
    cantonCode: 'TG',
    slug: 'thurgau',
    avgCost3Zimmer: 920,
    avgCost4Zimmer: 1180,
    avgCostHaus: 2150,
    priceLevel: 'günstig',
    indexValue: 81,
    trend: 'sinkend',
    trendPercent: -1.2,
    popularRoutes: [
      { to: 'Zürich', avgCost: 950 },
      { to: 'St. Gallen', avgCost: 580 },
      { to: 'Winterthur', avgCost: 520 }
    ]
  },
  {
    canton: 'Solothurn',
    cantonCode: 'SO',
    slug: 'solothurn',
    avgCost3Zimmer: 980,
    avgCost4Zimmer: 1250,
    avgCostHaus: 2280,
    priceLevel: 'günstig',
    indexValue: 86,
    trend: 'stabil',
    trendPercent: 0.9,
    popularRoutes: [
      { to: 'Bern', avgCost: 650 },
      { to: 'Basel', avgCost: 720 },
      { to: 'Zürich', avgCost: 1050 }
    ]
  },
  {
    canton: 'Schwyz',
    cantonCode: 'SZ',
    slug: 'schwyz',
    avgCost3Zimmer: 1320,
    avgCost4Zimmer: 1720,
    avgCostHaus: 3050,
    priceLevel: 'mittel',
    indexValue: 116,
    trend: 'steigend',
    trendPercent: 3.5,
    popularRoutes: [
      { to: 'Zürich', avgCost: 980 },
      { to: 'Zug', avgCost: 620 },
      { to: 'Luzern', avgCost: 750 }
    ]
  }
];

// ============ MOVING STATISTICS ============

export interface MovingStatistics {
  year: number;
  totalMoves: number;
  avgCostCH: number;
  mostPopularMonth: string;
  leastPopularMonth: string;
  avgDistance: number;
  crossCantonPercent: number;
  professionalMovePercent: number;
}

export const YEARLY_STATISTICS: MovingStatistics[] = [
  { year: 2024, totalMoves: 485000, avgCostCH: 1340, mostPopularMonth: 'September', leastPopularMonth: 'Dezember', avgDistance: 28, crossCantonPercent: 32, professionalMovePercent: 58 },
  { year: 2023, totalMoves: 472000, avgCostCH: 1280, mostPopularMonth: 'Oktober', leastPopularMonth: 'Januar', avgDistance: 27, crossCantonPercent: 31, professionalMovePercent: 55 },
  { year: 2022, totalMoves: 458000, avgCostCH: 1220, mostPopularMonth: 'September', leastPopularMonth: 'Dezember', avgDistance: 26, crossCantonPercent: 30, professionalMovePercent: 52 },
  { year: 2021, totalMoves: 445000, avgCostCH: 1150, mostPopularMonth: 'Oktober', leastPopularMonth: 'Januar', avgDistance: 25, crossCantonPercent: 28, professionalMovePercent: 48 },
  { year: 2020, totalMoves: 412000, avgCostCH: 1100, mostPopularMonth: 'August', leastPopularMonth: 'März', avgDistance: 23, crossCantonPercent: 25, professionalMovePercent: 45 }
];

export interface MonthlyDistribution {
  month: string;
  monthShort: string;
  percent: number;
  avgCost: number;
  demandLevel: 'niedrig' | 'mittel' | 'hoch' | 'sehr hoch';
}

export const MONTHLY_DISTRIBUTION: MonthlyDistribution[] = [
  { month: 'Januar', monthShort: 'Jan', percent: 5.2, avgCost: 1150, demandLevel: 'niedrig' },
  { month: 'Februar', monthShort: 'Feb', percent: 5.8, avgCost: 1180, demandLevel: 'niedrig' },
  { month: 'März', monthShort: 'Mär', percent: 8.5, avgCost: 1280, demandLevel: 'mittel' },
  { month: 'April', monthShort: 'Apr', percent: 9.2, avgCost: 1320, demandLevel: 'mittel' },
  { month: 'Mai', monthShort: 'Mai', percent: 8.8, avgCost: 1300, demandLevel: 'mittel' },
  { month: 'Juni', monthShort: 'Jun', percent: 10.5, avgCost: 1420, demandLevel: 'hoch' },
  { month: 'Juli', monthShort: 'Jul', percent: 11.2, avgCost: 1480, demandLevel: 'hoch' },
  { month: 'August', monthShort: 'Aug', percent: 10.8, avgCost: 1450, demandLevel: 'hoch' },
  { month: 'September', monthShort: 'Sep', percent: 12.5, avgCost: 1520, demandLevel: 'sehr hoch' },
  { month: 'Oktober', monthShort: 'Okt', percent: 9.8, avgCost: 1380, demandLevel: 'hoch' },
  { month: 'November', monthShort: 'Nov', percent: 4.5, avgCost: 1120, demandLevel: 'niedrig' },
  { month: 'Dezember', monthShort: 'Dez', percent: 3.2, avgCost: 1080, demandLevel: 'niedrig' }
];

export interface PopularRoute {
  from: string;
  to: string;
  count: number;
  avgCost: number;
  avgDistance: number;
  trend: 'steigend' | 'stabil' | 'sinkend';
}

export const POPULAR_ROUTES: PopularRoute[] = [
  { from: 'Zürich', to: 'Winterthur', count: 8500, avgCost: 980, avgDistance: 22, trend: 'steigend' },
  { from: 'Zürich', to: 'Zug', count: 6200, avgCost: 1100, avgDistance: 32, trend: 'steigend' },
  { from: 'Bern', to: 'Zürich', count: 5800, avgCost: 1400, avgDistance: 125, trend: 'stabil' },
  { from: 'Genf', to: 'Lausanne', count: 5400, avgCost: 980, avgDistance: 65, trend: 'stabil' },
  { from: 'Basel', to: 'Zürich', count: 4900, avgCost: 1350, avgDistance: 87, trend: 'stabil' },
  { from: 'Luzern', to: 'Zürich', count: 4200, avgCost: 1050, avgDistance: 52, trend: 'steigend' },
  { from: 'Zürich', to: 'Basel', count: 3800, avgCost: 1350, avgDistance: 87, trend: 'sinkend' },
  { from: 'Winterthur', to: 'Zürich', count: 3500, avgCost: 980, avgDistance: 22, trend: 'stabil' },
  { from: 'St. Gallen', to: 'Zürich', count: 3200, avgCost: 1100, avgDistance: 75, trend: 'stabil' },
  { from: 'Zug', to: 'Zürich', count: 2900, avgCost: 1100, avgDistance: 32, trend: 'steigend' }
];

// ============ LIVING COST COMPARISON ============

export interface LivingCostData {
  city: string;
  canton: string;
  slug: string;
  rent3Room: { min: number; max: number; avg: number };
  rent4Room: { min: number; max: number; avg: number };
  taxRateSingle: number; // Effective rate at 100k income
  taxRateFamily: number; // Effective rate at 100k income, married, 2 kids
  healthInsurance: number; // Monthly avg
  publicTransport: { monthly: number; yearly: number };
  childcare: { monthly: number };
  groceriesIndex: number; // 100 = Swiss avg
  totalCostIndex: number; // 100 = Swiss avg
  qualityOfLifeScore: number; // 1-10
}

export const LIVING_COST_DATA: LivingCostData[] = [
  {
    city: 'Zürich',
    canton: 'Zürich',
    slug: 'zuerich',
    rent3Room: { min: 2000, max: 3200, avg: 2500 },
    rent4Room: { min: 2600, max: 4000, avg: 3100 },
    taxRateSingle: 22.5,
    taxRateFamily: 14.2,
    healthInsurance: 485,
    publicTransport: { monthly: 87, yearly: 925 },
    childcare: { monthly: 2400 },
    groceriesIndex: 108,
    totalCostIndex: 128,
    qualityOfLifeScore: 9.2
  },
  {
    city: 'Bern',
    canton: 'Bern',
    slug: 'bern',
    rent3Room: { min: 1400, max: 2200, avg: 1700 },
    rent4Room: { min: 1800, max: 2800, avg: 2200 },
    taxRateSingle: 23.1,
    taxRateFamily: 15.8,
    healthInsurance: 420,
    publicTransport: { monthly: 78, yearly: 850 },
    childcare: { monthly: 1800 },
    groceriesIndex: 102,
    totalCostIndex: 98,
    qualityOfLifeScore: 8.5
  },
  {
    city: 'Zug',
    canton: 'Zug',
    slug: 'zug',
    rent3Room: { min: 2200, max: 3400, avg: 2700 },
    rent4Room: { min: 3000, max: 4500, avg: 3600 },
    taxRateSingle: 12.8,
    taxRateFamily: 8.2,
    healthInsurance: 390,
    publicTransport: { monthly: 72, yearly: 780 },
    childcare: { monthly: 2200 },
    groceriesIndex: 105,
    totalCostIndex: 115,
    qualityOfLifeScore: 9.0
  },
  {
    city: 'Basel',
    canton: 'Basel-Stadt',
    slug: 'basel',
    rent3Room: { min: 1500, max: 2400, avg: 1850 },
    rent4Room: { min: 2000, max: 3200, avg: 2500 },
    taxRateSingle: 26.8,
    taxRateFamily: 18.5,
    healthInsurance: 440,
    publicTransport: { monthly: 70, yearly: 760 },
    childcare: { monthly: 2000 },
    groceriesIndex: 100,
    totalCostIndex: 105,
    qualityOfLifeScore: 8.8
  },
  {
    city: 'Genf',
    canton: 'Genf',
    slug: 'genf',
    rent3Room: { min: 2200, max: 3600, avg: 2800 },
    rent4Room: { min: 2800, max: 4800, avg: 3500 },
    taxRateSingle: 28.5,
    taxRateFamily: 19.2,
    healthInsurance: 520,
    publicTransport: { monthly: 70, yearly: 500 },
    childcare: { monthly: 1600 },
    groceriesIndex: 112,
    totalCostIndex: 142,
    qualityOfLifeScore: 8.6
  },
  {
    city: 'Lausanne',
    canton: 'Waadt',
    slug: 'lausanne',
    rent3Room: { min: 1800, max: 2800, avg: 2200 },
    rent4Room: { min: 2200, max: 3600, avg: 2800 },
    taxRateSingle: 32.5,
    taxRateFamily: 22.8,
    healthInsurance: 480,
    publicTransport: { monthly: 68, yearly: 740 },
    childcare: { monthly: 1800 },
    groceriesIndex: 105,
    totalCostIndex: 118,
    qualityOfLifeScore: 8.4
  },
  {
    city: 'Luzern',
    canton: 'Luzern',
    slug: 'luzern',
    rent3Room: { min: 1600, max: 2500, avg: 1950 },
    rent4Room: { min: 2000, max: 3200, avg: 2500 },
    taxRateSingle: 23.8,
    taxRateFamily: 16.2,
    healthInsurance: 410,
    publicTransport: { monthly: 72, yearly: 785 },
    childcare: { monthly: 2100 },
    groceriesIndex: 101,
    totalCostIndex: 104,
    qualityOfLifeScore: 8.7
  },
  {
    city: 'St. Gallen',
    canton: 'St. Gallen',
    slug: 'st-gallen',
    rent3Room: { min: 1200, max: 1900, avg: 1450 },
    rent4Room: { min: 1500, max: 2400, avg: 1850 },
    taxRateSingle: 24.5,
    taxRateFamily: 17.1,
    healthInsurance: 380,
    publicTransport: { monthly: 65, yearly: 700 },
    childcare: { monthly: 1700 },
    groceriesIndex: 98,
    totalCostIndex: 88,
    qualityOfLifeScore: 8.2
  },
  {
    city: 'Winterthur',
    canton: 'Zürich',
    slug: 'winterthur',
    rent3Room: { min: 1500, max: 2200, avg: 1800 },
    rent4Room: { min: 1900, max: 2800, avg: 2300 },
    taxRateSingle: 24.2,
    taxRateFamily: 15.5,
    healthInsurance: 460,
    publicTransport: { monthly: 80, yearly: 870 },
    childcare: { monthly: 2100 },
    groceriesIndex: 102,
    totalCostIndex: 95,
    qualityOfLifeScore: 8.4
  },
  {
    city: 'Aarau',
    canton: 'Aargau',
    slug: 'aarau',
    rent3Room: { min: 1300, max: 1900, avg: 1550 },
    rent4Room: { min: 1600, max: 2400, avg: 1950 },
    taxRateSingle: 21.2,
    taxRateFamily: 14.5,
    healthInsurance: 400,
    publicTransport: { monthly: 70, yearly: 760 },
    childcare: { monthly: 1900 },
    groceriesIndex: 99,
    totalCostIndex: 89,
    qualityOfLifeScore: 8.0
  },
  {
    city: 'Thun',
    canton: 'Bern',
    slug: 'thun',
    rent3Room: { min: 1300, max: 2000, avg: 1600 },
    rent4Room: { min: 1700, max: 2600, avg: 2050 },
    taxRateSingle: 22.8,
    taxRateFamily: 15.2,
    healthInsurance: 415,
    publicTransport: { monthly: 72, yearly: 780 },
    childcare: { monthly: 1750 },
    groceriesIndex: 100,
    totalCostIndex: 92,
    qualityOfLifeScore: 8.6
  },
  {
    city: 'Chur',
    canton: 'Graubünden',
    slug: 'chur',
    rent3Room: { min: 1200, max: 1800, avg: 1450 },
    rent4Room: { min: 1500, max: 2300, avg: 1850 },
    taxRateSingle: 22.0,
    taxRateFamily: 14.8,
    healthInsurance: 360,
    publicTransport: { monthly: 60, yearly: 650 },
    childcare: { monthly: 1600 },
    groceriesIndex: 97,
    totalCostIndex: 85,
    qualityOfLifeScore: 8.3
  }
];

// ============ UTILITY FUNCTIONS ============

export function getSwissAverage() {
  const data = LIVING_COST_DATA;
  return {
    rent3Room: Math.round(data.reduce((sum, c) => sum + c.rent3Room.avg, 0) / data.length),
    rent4Room: Math.round(data.reduce((sum, c) => sum + c.rent4Room.avg, 0) / data.length),
    taxRateSingle: Math.round(data.reduce((sum, c) => sum + c.taxRateSingle, 0) / data.length * 10) / 10,
    taxRateFamily: Math.round(data.reduce((sum, c) => sum + c.taxRateFamily, 0) / data.length * 10) / 10,
    healthInsurance: Math.round(data.reduce((sum, c) => sum + c.healthInsurance, 0) / data.length),
    childcare: Math.round(data.reduce((sum, c) => sum + c.childcare.monthly, 0) / data.length)
  };
}

export function getCheapestCantons(count: number = 5): CantonMovingCosts[] {
  return [...MOVING_COST_INDEX].sort((a, b) => a.indexValue - b.indexValue).slice(0, count);
}

export function getMostExpensiveCantons(count: number = 5): CantonMovingCosts[] {
  return [...MOVING_COST_INDEX].sort((a, b) => b.indexValue - a.indexValue).slice(0, count);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-CH', { 
    style: 'currency', 
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function getComparisonPercent(value: number, baseline: number): number {
  return Math.round(((value - baseline) / baseline) * 100);
}
