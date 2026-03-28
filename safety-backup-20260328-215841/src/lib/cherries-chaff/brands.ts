/**
 * Multi-Brand Portfolio Strategy
 * Three complementary moving brands covering full market spectrum
 */

export interface BrandConfig {
  id: string;
  name: string;
  domain: string;
  tagline: string;
  strength: string;
  positioning: 'premium' | 'speed' | 'value';
  targetSegments: string[];
  priceRange: {
    min: number;
    max: number;
  };
  avgJobValue: number;
  targetMargin: number; // CM2 target
  optimalLeadScore: {
    min: number;
    max: number;
  };
  services: string[];
  regions: string[];
  differentiators: string[];
  colorAccent: string;
}

export const BRAND_PORTFOLIO: BrandConfig[] = [
  {
    id: 'feierabend',
    name: 'Feierabend Umzug',
    domain: 'feierabend-umzug.ch',
    tagline: 'Ihr persönlicher Umzugs-Concierge',
    strength: 'Premium & Concierge',
    positioning: 'premium',
    targetSegments: ['Familien', 'Senioren', 'Expats', 'C-Level'],
    priceRange: { min: 1800, max: 5000 },
    avgJobValue: 2800,
    targetMargin: 0.35, // 35% CM2
    optimalLeadScore: { min: 70, max: 100 },
    services: [
      'Privatumzug',
      'Seniorenumzug',
      'Firmenumzug',
      'International',
      'Reinigung',
      'Einlagerung',
      'Verpackungsservice',
      'Möbellift',
      'Entsorgung',
    ],
    regions: ['Zürich', 'Zug', 'Luzern', 'Aargau'],
    differentiators: [
      'Live Concierge (5-10 Min Buchung)',
      'Familienbetrieb seit 1980',
      'Schweizer Qualitätsgarantie',
      'Persönlicher Ansprechpartner',
      'Abgabegarantie',
    ],
    colorAccent: '#1E3A5F', // Deep Swiss Blue
  },
  {
    id: 'umzugexpress',
    name: 'Umzug Express',
    domain: 'umzugexpress.ch',
    tagline: 'Schnell. Flexibel. Zuverlässig.',
    strength: 'Speed & Flexibilität',
    positioning: 'speed',
    targetSegments: ['Berufstätige', 'Kurzfristige Umzüge', 'WG-Umzüge', 'Einzelpersonen'],
    priceRange: { min: 1200, max: 2500 },
    avgJobValue: 1600,
    targetMargin: 0.28, // 28% CM2
    optimalLeadScore: { min: 40, max: 75 },
    services: [
      'Privatumzug',
      'Expressumzug',
      'Kleinumzug',
      'Möbeltransport',
      'Wochenendumzug',
      'Reinigung',
    ],
    regions: ['Zürich', 'Winterthur', 'Bern', 'Basel', 'St. Gallen'],
    differentiators: [
      'Same-Day Booking möglich',
      '48h Express-Umzug',
      'Flexible Zeitfenster',
      'Online-Buchung 24/7',
      'Wochenend-Service',
    ],
    colorAccent: '#E63946', // Express Red
  },
  {
    id: 'zuegelhelden',
    name: 'Zügelhelden',
    domain: 'zuegelhelden.ch',
    tagline: 'Dein Umzug. Fair & Transparent.',
    strength: 'Preis-Leistung',
    positioning: 'value',
    targetSegments: ['Studenten', 'Junge Berufstätige', 'Budget-Bewusste', 'Erstumzüge'],
    priceRange: { min: 800, max: 1800 },
    avgJobValue: 1100,
    targetMargin: 0.22, // 22% CM2
    optimalLeadScore: { min: 25, max: 55 },
    services: [
      'Privatumzug',
      'Studentenumzug',
      'Kleinumzug',
      'Beiladung',
      'Selbstpacker-Option',
      'Entsorgung',
    ],
    regions: ['Zürich', 'Bern', 'Basel', 'Luzern', 'Winterthur', 'St. Gallen'],
    differentiators: [
      'Transparente Festpreise',
      'Keine versteckten Kosten',
      'Selbstpacker-Rabatt 20%',
      'Studentenrabatt 15%',
      'Beiladungs-Option (günstigste)',
    ],
    colorAccent: '#2A9D8F', // Hero Teal
  },
];

/**
 * Get optimal brand for a lead based on score and characteristics
 */
export function getOptimalBrandForLead(
  leadScore: number,
  estimatedValue: number,
  isUrgent: boolean = false,
  isBudgetSensitive: boolean = false
): BrandConfig {
  // Urgent leads → Umzug Express
  if (isUrgent && leadScore >= 35) {
    return BRAND_PORTFOLIO.find(b => b.id === 'umzugexpress')!;
  }

  // Budget-sensitive or low-value → Zügelhelden
  if (isBudgetSensitive || estimatedValue < 1200) {
    return BRAND_PORTFOLIO.find(b => b.id === 'zuegelhelden')!;
  }

  // High score, high value → Feierabend
  if (leadScore >= 65 && estimatedValue >= 1800) {
    return BRAND_PORTFOLIO.find(b => b.id === 'feierabend')!;
  }

  // Medium score → Based on value
  if (estimatedValue >= 1500) {
    return BRAND_PORTFOLIO.find(b => b.id === 'umzugexpress')!;
  }

  return BRAND_PORTFOLIO.find(b => b.id === 'zuegelhelden')!;
}

/**
 * Calculate portfolio-level unit economics
 */
export interface PortfolioEconomics {
  totalCapacity: number; // jobs/month across all brands
  blendedAvgJobValue: number;
  blendedMargin: number;
  monthlyRevenueTarget: number;
  monthlyProfitTarget: number;
}

export function calculatePortfolioEconomics(
  brandAllocation: Record<string, number> // jobs per brand per month
): PortfolioEconomics {
  let totalJobs = 0;
  let totalRevenue = 0;
  let totalProfit = 0;

  for (const brand of BRAND_PORTFOLIO) {
    const jobs = brandAllocation[brand.id] || 0;
    totalJobs += jobs;
    totalRevenue += jobs * brand.avgJobValue;
    totalProfit += jobs * brand.avgJobValue * brand.targetMargin;
  }

  return {
    totalCapacity: totalJobs,
    blendedAvgJobValue: totalJobs > 0 ? totalRevenue / totalJobs : 0,
    blendedMargin: totalRevenue > 0 ? totalProfit / totalRevenue : 0,
    monthlyRevenueTarget: totalRevenue,
    monthlyProfitTarget: totalProfit,
  };
}

/**
 * Default allocation for 1 crew operation
 * Based on capacity of ~31 jobs/month at 85% utilization
 */
export const DEFAULT_BRAND_ALLOCATION: Record<string, number> = {
  feierabend: 8,    // 8 premium jobs @ CHF 2'800 = CHF 22'400
  umzugexpress: 10, // 10 speed jobs @ CHF 1'600 = CHF 16'000
  zuegelhelden: 8,  // 8 value jobs @ CHF 1'100 = CHF 8'800
  // Total: 26 jobs = CHF 47'200/month
};
