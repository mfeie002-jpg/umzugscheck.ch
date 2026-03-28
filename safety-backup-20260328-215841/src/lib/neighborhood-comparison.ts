/**
 * Neighborhood Comparison System
 * Compare multiple neighborhoods/cities on key metrics
 */

export interface ComparisonMetric {
  id: string;
  label: string;
  category: 'financial' | 'lifestyle' | 'infrastructure' | 'demographics';
  unit?: string;
  higherIsBetter: boolean;
  weight: number; // For overall score calculation
}

export interface NeighborhoodScore {
  cityName: string;
  canton: string;
  metrics: Record<string, number | string>;
  overallScore: number;
  rank: number;
  highlights: string[];
  concerns: string[];
}

export const COMPARISON_METRICS: ComparisonMetric[] = [
  // Financial
  { id: 'taxRate', label: 'Steuerfuss', category: 'financial', unit: '%', higherIsBetter: false, weight: 0.2 },
  { id: 'rentM2', label: 'Miete/m²', category: 'financial', unit: 'CHF', higherIsBetter: false, weight: 0.15 },
  { id: 'avgIncome', label: 'Durchschnittseinkommen', category: 'financial', unit: 'CHF', higherIsBetter: true, weight: 0.1 },
  
  // Lifestyle
  { id: 'familyScore', label: 'Familien-Freundlichkeit', category: 'lifestyle', higherIsBetter: true, weight: 0.1 },
  { id: 'quietScore', label: 'Ruhe & Natur', category: 'lifestyle', higherIsBetter: true, weight: 0.08 },
  { id: 'expatScore', label: 'Expat-Freundlichkeit', category: 'lifestyle', higherIsBetter: true, weight: 0.07 },
  
  // Infrastructure
  { id: 'publicTransport', label: 'ÖV-Anbindung', category: 'infrastructure', higherIsBetter: true, weight: 0.12 },
  { id: 'schools', label: 'Schulqualität', category: 'infrastructure', higherIsBetter: true, weight: 0.08 },
  { id: 'healthcare', label: 'Gesundheitsversorgung', category: 'infrastructure', higherIsBetter: true, weight: 0.05 },
  
  // Demographics
  { id: 'population', label: 'Einwohner', category: 'demographics', higherIsBetter: false, weight: 0.03 },
  { id: 'avgAge', label: 'Durchschnittsalter', category: 'demographics', unit: 'Jahre', higherIsBetter: false, weight: 0.02 },
];

/**
 * Generate mock comparison data for demo
 */
export function generateComparisonData(cities: string[]): NeighborhoodScore[] {
  return cities.map((city, index) => {
    // Generate varied but consistent data based on city name hash
    const hash = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const metrics: Record<string, number> = {
      taxRate: 80 + (hash % 40), // 80-120%
      rentM2: 20 + (hash % 25), // 20-45 CHF
      avgIncome: 70000 + (hash % 50000), // 70k-120k
      familyScore: 50 + (hash % 50), // 50-100
      quietScore: 40 + (hash % 60), // 40-100
      expatScore: 30 + (hash % 70), // 30-100
      publicTransport: 40 + (hash % 60), // 40-100
      schools: 60 + (hash % 40), // 60-100
      healthcare: 70 + (hash % 30), // 70-100
      population: 5000 + (hash % 95000), // 5k-100k
      avgAge: 35 + (hash % 15), // 35-50
    };

    const overallScore = calculateOverallScore(metrics);
    const { highlights, concerns } = generateInsights(metrics);

    return {
      cityName: city,
      canton: getCantonForCity(city),
      metrics,
      overallScore,
      rank: 0, // Will be set after sorting
      highlights,
      concerns,
    };
  }).sort((a, b) => b.overallScore - a.overallScore)
    .map((score, index) => ({ ...score, rank: index + 1 }));
}

/**
 * Calculate overall score from metrics
 */
function calculateOverallScore(metrics: Record<string, number>): number {
  let score = 0;
  let totalWeight = 0;

  COMPARISON_METRICS.forEach(metric => {
    const value = metrics[metric.id];
    if (value === undefined) return;

    // Normalize value to 0-100 scale
    let normalized: number;
    switch (metric.id) {
      case 'taxRate':
        normalized = Math.max(0, 100 - ((value - 80) * 2.5));
        break;
      case 'rentM2':
        normalized = Math.max(0, 100 - ((value - 20) * 4));
        break;
      case 'avgIncome':
        normalized = Math.min(100, ((value - 70000) / 500));
        break;
      case 'population':
        normalized = value < 20000 ? 80 : value < 50000 ? 60 : 40;
        break;
      case 'avgAge':
        normalized = value < 40 ? 70 : value < 45 ? 50 : 30;
        break;
      default:
        normalized = value;
    }

    if (!metric.higherIsBetter && !['taxRate', 'rentM2', 'population', 'avgAge'].includes(metric.id)) {
      normalized = 100 - normalized;
    }

    score += normalized * metric.weight;
    totalWeight += metric.weight;
  });

  return Math.round(score / totalWeight);
}

/**
 * Generate highlights and concerns from metrics
 */
function generateInsights(metrics: Record<string, number>): { highlights: string[]; concerns: string[] } {
  const highlights: string[] = [];
  const concerns: string[] = [];

  if (metrics.taxRate < 90) highlights.push('Niedriger Steuerfuss');
  if (metrics.taxRate > 110) concerns.push('Hoher Steuerfuss');

  if (metrics.rentM2 < 28) highlights.push('Günstige Mieten');
  if (metrics.rentM2 > 38) concerns.push('Hohe Mietpreise');

  if (metrics.familyScore > 75) highlights.push('Sehr familienfreundlich');
  if (metrics.familyScore < 55) concerns.push('Weniger für Familien geeignet');

  if (metrics.publicTransport > 80) highlights.push('Exzellente ÖV-Anbindung');
  if (metrics.publicTransport < 50) concerns.push('Eingeschränkter ÖV');

  if (metrics.quietScore > 80) highlights.push('Ruhige Wohnlage');
  if (metrics.schools > 85) highlights.push('Top Schulqualität');

  return {
    highlights: highlights.slice(0, 3),
    concerns: concerns.slice(0, 2),
  };
}

/**
 * Get canton for a city (simplified mapping)
 */
function getCantonForCity(city: string): string {
  const mapping: Record<string, string> = {
    'Zürich': 'ZH',
    'Zug': 'ZG',
    'Baar': 'ZG',
    'Cham': 'ZG',
    'Basel': 'BS',
    'Bern': 'BE',
    'Luzern': 'LU',
    'Winterthur': 'ZH',
    'St. Gallen': 'SG',
    'Lausanne': 'VD',
    'Genf': 'GE',
  };
  return mapping[city] || 'CH';
}

/**
 * Get winner for a specific metric
 */
export function getMetricWinner(
  scores: NeighborhoodScore[],
  metricId: string
): NeighborhoodScore | null {
  const metric = COMPARISON_METRICS.find(m => m.id === metricId);
  if (!metric || scores.length === 0) return null;

  return scores.reduce((best, current) => {
    const bestVal = best.metrics[metricId] as number;
    const currentVal = current.metrics[metricId] as number;
    
    if (metric.higherIsBetter) {
      return currentVal > bestVal ? current : best;
    } else {
      return currentVal < bestVal ? current : best;
    }
  });
}

/**
 * Format metric value for display
 */
export function formatMetricValue(metricId: string, value: number | string): string {
  const metric = COMPARISON_METRICS.find(m => m.id === metricId);
  if (!metric) return String(value);

  const numValue = Number(value);
  
  switch (metricId) {
    case 'avgIncome':
      return `${(numValue / 1000).toFixed(0)}k CHF`;
    case 'population':
      return numValue > 1000 ? `${(numValue / 1000).toFixed(1)}k` : String(numValue);
    default:
      return metric.unit ? `${numValue}${metric.unit}` : String(numValue);
  }
}
