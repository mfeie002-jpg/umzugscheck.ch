/**
 * Smart Date Optimizer
 * Finds optimal moving dates based on pricing, availability, and demand
 */

export interface DateRecommendation {
  date: Date;
  dayOfWeek: string;
  priceIndex: number; // 0-100, lower is cheaper
  demandLevel: 'low' | 'medium' | 'high' | 'peak';
  savingsPercent: number;
  availableProviders: number;
  recommendation: 'best' | 'good' | 'neutral' | 'expensive';
  reason: string;
}

export interface MonthlyPricePattern {
  month: number;
  monthName: string;
  avgPriceIndex: number;
  demandLevel: 'low' | 'medium' | 'high' | 'peak';
}

/**
 * Swiss moving demand patterns by month
 * Based on typical Swiss relocation patterns (end of quarter, school year, etc.)
 */
export const MONTHLY_DEMAND_PATTERNS: MonthlyPricePattern[] = [
  { month: 1, monthName: 'Januar', avgPriceIndex: 45, demandLevel: 'low' },
  { month: 2, monthName: 'Februar', avgPriceIndex: 50, demandLevel: 'low' },
  { month: 3, monthName: 'März', avgPriceIndex: 70, demandLevel: 'high' },
  { month: 4, monthName: 'April', avgPriceIndex: 65, demandLevel: 'medium' },
  { month: 5, monthName: 'Mai', avgPriceIndex: 60, demandLevel: 'medium' },
  { month: 6, monthName: 'Juni', avgPriceIndex: 80, demandLevel: 'high' },
  { month: 7, monthName: 'Juli', avgPriceIndex: 85, demandLevel: 'peak' },
  { month: 8, monthName: 'August', avgPriceIndex: 75, demandLevel: 'high' },
  { month: 9, monthName: 'September', avgPriceIndex: 90, demandLevel: 'peak' },
  { month: 10, monthName: 'Oktober', avgPriceIndex: 70, demandLevel: 'high' },
  { month: 11, monthName: 'November', avgPriceIndex: 55, demandLevel: 'medium' },
  { month: 12, monthName: 'Dezember', avgPriceIndex: 40, demandLevel: 'low' },
];

/**
 * Day of week price multipliers
 * Monday = cheapest, Friday/Saturday = expensive
 */
const DAY_MULTIPLIERS: Record<number, number> = {
  0: 0.95,  // Sunday (limited availability)
  1: 0.85,  // Monday - cheapest
  2: 0.88,  // Tuesday
  3: 0.90,  // Wednesday
  4: 0.95,  // Thursday
  5: 1.10,  // Friday - expensive
  6: 1.15,  // Saturday - most expensive
};

/**
 * Day of month factors
 * End of month = peak demand (rental contracts)
 */
function getDayOfMonthMultiplier(day: number): number {
  if (day >= 28 || day <= 3) return 1.25; // End/start of month - peak
  if (day >= 25 || day <= 5) return 1.15; // Near end/start
  if (day >= 14 && day <= 16) return 1.10; // Mid-month spike
  return 1.0; // Regular days
}

/**
 * Calculate price index for a specific date
 */
export function calculateDatePriceIndex(date: Date): number {
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();
  const dayOfMonth = date.getDate();

  const monthPattern = MONTHLY_DEMAND_PATTERNS.find(p => p.month === month);
  const baseIndex = monthPattern?.avgPriceIndex || 60;

  const dayMultiplier = DAY_MULTIPLIERS[dayOfWeek] || 1.0;
  const monthDayMultiplier = getDayOfMonthMultiplier(dayOfMonth);

  const finalIndex = Math.round(baseIndex * dayMultiplier * monthDayMultiplier);
  return Math.min(100, Math.max(0, finalIndex));
}

/**
 * Get demand level for a price index
 */
export function getDemandLevel(priceIndex: number): 'low' | 'medium' | 'high' | 'peak' {
  if (priceIndex <= 50) return 'low';
  if (priceIndex <= 70) return 'medium';
  if (priceIndex <= 85) return 'high';
  return 'peak';
}

/**
 * Get recommendation type based on price index
 */
export function getRecommendationType(priceIndex: number): 'best' | 'good' | 'neutral' | 'expensive' {
  if (priceIndex <= 45) return 'best';
  if (priceIndex <= 60) return 'good';
  if (priceIndex <= 75) return 'neutral';
  return 'expensive';
}

/**
 * Generate reason text for a date recommendation
 */
function generateReason(date: Date, priceIndex: number): string {
  const dayOfWeek = date.getDay();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;

  const reasons: string[] = [];

  // Day of week reasons
  if (dayOfWeek === 1) reasons.push('Montag = günstigster Wochentag');
  if (dayOfWeek === 2 || dayOfWeek === 3) reasons.push('Wochenmitte = reduzierte Preise');
  if (dayOfWeek === 5) reasons.push('Freitag = erhöhte Nachfrage');
  if (dayOfWeek === 6) reasons.push('Samstag = Spitzenpreise');

  // Day of month reasons
  if (dayOfMonth >= 28 || dayOfMonth <= 3) {
    reasons.push('Monatsende = hohe Nachfrage');
  } else if (dayOfMonth >= 10 && dayOfMonth <= 20) {
    reasons.push('Monatsmitte = entspannte Lage');
  }

  // Month reasons
  if ([1, 2, 12].includes(month)) {
    reasons.push('Nebensaison = beste Preise');
  } else if ([7, 9].includes(month)) {
    reasons.push('Hauptsaison = erhöhte Preise');
  }

  return reasons.slice(0, 2).join(' • ') || 'Normaler Umzugstag';
}

/**
 * Analyze a date and return full recommendation
 */
export function analyzeMoveDate(date: Date): DateRecommendation {
  const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const priceIndex = calculateDatePriceIndex(date);
  const demandLevel = getDemandLevel(priceIndex);
  const recommendation = getRecommendationType(priceIndex);

  // Calculate savings compared to peak (100)
  const savingsPercent = Math.round((100 - priceIndex) * 0.4); // Max ~40% savings

  // Estimate available providers (inverse of demand)
  const baseProviders = 15;
  const availableProviders = Math.round(baseProviders * (1 - priceIndex / 200));

  return {
    date,
    dayOfWeek: dayNames[date.getDay()],
    priceIndex,
    demandLevel,
    savingsPercent: Math.max(0, savingsPercent),
    availableProviders: Math.max(3, availableProviders),
    recommendation,
    reason: generateReason(date, priceIndex),
  };
}

/**
 * Find best dates within a range
 */
export function findBestDates(
  startDate: Date,
  endDate: Date,
  limit: number = 5
): DateRecommendation[] {
  const recommendations: DateRecommendation[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    // Skip Sundays (usually not available)
    if (current.getDay() !== 0) {
      recommendations.push(analyzeMoveDate(new Date(current)));
    }
    current.setDate(current.getDate() + 1);
  }

  // Sort by price index (lowest first)
  recommendations.sort((a, b) => a.priceIndex - b.priceIndex);

  return recommendations.slice(0, limit);
}

/**
 * Get alternative dates around a selected date
 */
export function getAlternativeDates(
  selectedDate: Date,
  daysRange: number = 7
): DateRecommendation[] {
  const start = new Date(selectedDate);
  start.setDate(start.getDate() - daysRange);
  
  const end = new Date(selectedDate);
  end.setDate(end.getDate() + daysRange);

  const alternatives = findBestDates(start, end, 10);
  
  // Filter out the selected date and return top alternatives
  return alternatives
    .filter(rec => rec.date.toDateString() !== selectedDate.toDateString())
    .slice(0, 5);
}

/**
 * Get color classes for demand level
 */
export function getDemandColorClasses(level: 'low' | 'medium' | 'high' | 'peak'): string {
  switch (level) {
    case 'low':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'high':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'peak':
      return 'bg-red-100 text-red-700 border-red-200';
  }
}

/**
 * Get recommendation color classes
 */
export function getRecommendationColorClasses(rec: 'best' | 'good' | 'neutral' | 'expensive'): string {
  switch (rec) {
    case 'best':
      return 'bg-green-500 text-white';
    case 'good':
      return 'bg-green-100 text-green-700';
    case 'neutral':
      return 'bg-muted text-muted-foreground';
    case 'expensive':
      return 'bg-red-100 text-red-700';
  }
}
