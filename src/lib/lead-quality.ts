// Advanced Lead Quality Scoring System
// Evaluates leads based on conversion probability, value, and provider fit

interface LeadData {
  id: string;
  calculator_type: string;
  calculator_output: any;
  from_postal: string;
  to_postal: string;
  move_date?: string | null;
  comments?: string | null;
  created_at: string;
  lead_source?: string | null;
}

interface ProviderCriteria {
  cantons_served: string[];
  preferred_regions?: string[] | null;
  min_job_value?: number | null;
  price_level?: string | null;
  services_offered: string[];
}

interface ConversionHistory {
  total_leads: number;
  converted_leads: number;
  avg_conversion_time_days: number;
  by_calculator_type: Record<string, { total: number; converted: number }>;
  by_canton: Record<string, { total: number; converted: number }>;
  by_value_range: Record<string, { total: number; converted: number }>;
}

export interface LeadQualityScore {
  totalScore: number; // 0-100
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  qualityLevel: 'excellent' | 'high' | 'good' | 'average' | 'low';
  conversionProbability: number; // 0-100%
  estimatedValue: number;
  breakdown: {
    valueScore: number; // 0-30 points
    urgencyScore: number; // 0-20 points
    completenessScore: number; // 0-20 points
    historicalScore: number; // 0-15 points
    providerFitScore: number; // 0-15 points
  };
  factors: {
    isHighValue: boolean;
    isUrgent: boolean;
    hasCompleteInfo: boolean;
    goodHistoricalPerformance: boolean;
    strongProviderFit: boolean;
  };
  insights: string[];
  recommendedAction: 'high_priority' | 'standard' | 'low_priority' | 'skip';
}

// Helper to get canton from postal code
const getCantonFromPostal = (postalCode: string): string => {
  const code = postalCode.substring(0, 1);
  const codeMap: Record<string, string> = {
    '1': 'VD', '2': 'NE', '3': 'BE', '4': 'BS',
    '5': 'AG', '6': 'LU', '7': 'GR', '8': 'ZH', '9': 'SG'
  };
  return codeMap[code] || 'Other';
};

// Helper to extract volume from calculator output
const extractVolume = (calculatorOutput: any): number => {
  if (calculatorOutput?.volume) return calculatorOutput.volume;
  if (calculatorOutput?.estimatedVolumeM3) return calculatorOutput.estimatedVolumeM3;
  if (calculatorOutput?.rooms) return calculatorOutput.rooms * 15; // Rough estimate
  return 30; // Default
};

// Helper to calculate estimated job value
const calculateEstimatedValue = (lead: LeadData): number => {
  if (lead.calculator_output?.priceAvg) {
    return lead.calculator_output.priceAvg;
  }
  if (lead.calculator_output?.priceMin && lead.calculator_output?.priceMax) {
    return (lead.calculator_output.priceMin + lead.calculator_output.priceMax) / 2;
  }
  
  // Fallback: estimate based on volume
  const volume = extractVolume(lead.calculator_output);
  const baseRate = 80; // CHF per m³
  return volume * baseRate;
};

export const calculateLeadQuality = (
  lead: LeadData,
  providerCriteria?: ProviderCriteria,
  conversionHistory?: ConversionHistory
): LeadQualityScore => {
  let totalScore = 0;
  const breakdown = {
    valueScore: 0,
    urgencyScore: 0,
    completenessScore: 0,
    historicalScore: 0,
    providerFitScore: 0
  };
  const factors = {
    isHighValue: false,
    isUrgent: false,
    hasCompleteInfo: false,
    goodHistoricalPerformance: false,
    strongProviderFit: false
  };
  const insights: string[] = [];

  // 1. VALUE SCORE (0-30 points)
  const estimatedValue = calculateEstimatedValue(lead);
  const volume = extractVolume(lead.calculator_output);

  if (estimatedValue >= 5000) {
    breakdown.valueScore = 30;
    factors.isHighValue = true;
    insights.push('Sehr hoher Auftragswert - Premium-Lead');
  } else if (estimatedValue >= 3000) {
    breakdown.valueScore = 25;
    factors.isHighValue = true;
    insights.push('Hoher Auftragswert - Attraktiver Lead');
  } else if (estimatedValue >= 2000) {
    breakdown.valueScore = 20;
    insights.push('Guter Auftragswert - Standardlead');
  } else if (estimatedValue >= 1000) {
    breakdown.valueScore = 15;
  } else {
    breakdown.valueScore = 10;
    insights.push('Niedriger Auftragswert - Prüfen Sie Profitabilität');
  }

  // Complexity bonus/penalty
  const complexity = lead.calculator_output?.difficultyScore || 1;
  if (complexity >= 4) {
    breakdown.valueScore += 5; // High complexity = higher value
    insights.push('Komplexer Umzug - Höhere Marge möglich');
  }

  totalScore += Math.min(breakdown.valueScore, 30);

  // 2. URGENCY SCORE (0-20 points)
  const leadAge = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24));
  
  if (lead.move_date) {
    const daysUntilMove = Math.floor((new Date(lead.move_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilMove <= 7) {
      breakdown.urgencyScore = 20;
      factors.isUrgent = true;
      insights.push('Sehr dringend - Umzug in weniger als 1 Woche');
    } else if (daysUntilMove <= 14) {
      breakdown.urgencyScore = 18;
      factors.isUrgent = true;
      insights.push('Dringend - Umzug in 1-2 Wochen');
    } else if (daysUntilMove <= 30) {
      breakdown.urgencyScore = 15;
      insights.push('Mittlere Dringlichkeit - Umzug in 2-4 Wochen');
    } else if (daysUntilMove <= 60) {
      breakdown.urgencyScore = 12;
    } else {
      breakdown.urgencyScore = 8;
      insights.push('Langfristige Planung - Kunde informiert sich früh');
    }
  } else {
    // No move date specified
    breakdown.urgencyScore = 10;
  }

  // Penalty for old leads
  if (leadAge > 7) {
    breakdown.urgencyScore = Math.max(0, breakdown.urgencyScore - 5);
    insights.push('Lead ist bereits älter - Kunde könnte bereits kontaktiert sein');
  }

  totalScore += breakdown.urgencyScore;

  // 3. COMPLETENESS SCORE (0-20 points)
  let completenessPoints = 10; // Base points

  if (lead.move_date) completenessPoints += 3;
  if (lead.comments && lead.comments.length > 20) completenessPoints += 3;
  if (lead.calculator_output?.rooms || lead.calculator_output?.volume) completenessPoints += 2;
  if (lead.calculator_output?.distance) completenessPoints += 2;

  // Check for special requirements
  const hasSpecialServices = lead.calculator_type !== 'Umzugsrechner';
  if (hasSpecialServices) {
    completenessPoints += 2;
    insights.push('Zusatzleistungen gewünscht - Upselling-Potenzial');
  }

  breakdown.completenessScore = Math.min(completenessPoints, 20);
  if (breakdown.completenessScore >= 15) {
    factors.hasCompleteInfo = true;
  }

  totalScore += breakdown.completenessScore;

  // 4. HISTORICAL PERFORMANCE SCORE (0-15 points)
  if (conversionHistory) {
    let historicalPoints = 0;

    // Overall conversion rate
    const overallConversionRate = conversionHistory.total_leads > 0
      ? conversionHistory.converted_leads / conversionHistory.total_leads
      : 0.2; // Default assumption

    if (overallConversionRate >= 0.4) {
      historicalPoints += 5;
      factors.goodHistoricalPerformance = true;
    } else if (overallConversionRate >= 0.25) {
      historicalPoints += 3;
    } else {
      historicalPoints += 1;
    }

    // Calculator type performance
    const calculatorTypeHistory = conversionHistory.by_calculator_type[lead.calculator_type];
    if (calculatorTypeHistory && calculatorTypeHistory.total > 5) {
      const typeConversionRate = calculatorTypeHistory.converted / calculatorTypeHistory.total;
      if (typeConversionRate >= 0.4) {
        historicalPoints += 5;
        insights.push(`${lead.calculator_type}: Gute Conversion-Historie`);
      } else if (typeConversionRate >= 0.25) {
        historicalPoints += 3;
      } else {
        insights.push(`${lead.calculator_type}: Niedrige Conversion - vorsichtig bewerten`);
      }
    }

    // Canton performance
    const fromCanton = getCantonFromPostal(lead.from_postal);
    const cantonHistory = conversionHistory.by_canton[fromCanton];
    if (cantonHistory && cantonHistory.total > 3) {
      const cantonConversionRate = cantonHistory.converted / cantonHistory.total;
      if (cantonConversionRate >= 0.4) {
        historicalPoints += 5;
        insights.push(`${fromCanton}: Erfolgreiche Region für Sie`);
      } else if (cantonConversionRate < 0.2) {
        insights.push(`${fromCanton}: Schwierige Region - niedrige Conversion`);
      }
    }

    breakdown.historicalScore = Math.min(historicalPoints, 15);
  } else {
    // No history available - neutral score
    breakdown.historicalScore = 8;
  }

  totalScore += breakdown.historicalScore;

  // 5. PROVIDER FIT SCORE (0-15 points)
  if (providerCriteria) {
    let fitPoints = 0;

    // Canton coverage
    const fromCanton = getCantonFromPostal(lead.from_postal);
    const toCanton = getCantonFromPostal(lead.to_postal);
    
    if (providerCriteria.cantons_served.includes(fromCanton) && 
        providerCriteria.cantons_served.includes(toCanton)) {
      fitPoints += 5;
      factors.strongProviderFit = true;
    } else if (providerCriteria.cantons_served.includes(fromCanton) || 
               providerCriteria.cantons_served.includes(toCanton)) {
      fitPoints += 2;
    }

    // Preferred regions bonus
    if (providerCriteria.preferred_regions && providerCriteria.preferred_regions.length > 0) {
      if (providerCriteria.preferred_regions.includes(fromCanton) && 
          providerCriteria.preferred_regions.includes(toCanton)) {
        fitPoints += 5;
        insights.push('Perfekte Region - Ihre bevorzugte Zone!');
      }
    }

    // Minimum job value check
    if (providerCriteria.min_job_value) {
      if (estimatedValue >= providerCriteria.min_job_value * 1.2) {
        fitPoints += 3;
      } else if (estimatedValue >= providerCriteria.min_job_value) {
        fitPoints += 1;
      } else {
        insights.push('Unter Ihrem Mindestauftragswert - Prüfen Sie ob lohnenswert');
      }
    }

    // Service coverage
    const requiredServices = getRequiredServicesFromCalculatorType(lead.calculator_type);
    const serviceMatch = requiredServices.every(s => providerCriteria.services_offered.includes(s));
    
    if (serviceMatch) {
      fitPoints += 2;
    } else {
      fitPoints -= 2;
      insights.push('Einige benötigte Services fehlen in Ihrem Angebot');
    }

    breakdown.providerFitScore = Math.max(0, Math.min(fitPoints, 15));
  } else {
    // No provider criteria - neutral score
    breakdown.providerFitScore = 8;
  }

  totalScore += breakdown.providerFitScore;

  // Calculate grade and quality level
  let grade: LeadQualityScore['grade'];
  let qualityLevel: LeadQualityScore['qualityLevel'];
  let recommendedAction: LeadQualityScore['recommendedAction'];

  if (totalScore >= 85) {
    grade = 'A+';
    qualityLevel = 'excellent';
    recommendedAction = 'high_priority';
  } else if (totalScore >= 75) {
    grade = 'A';
    qualityLevel = 'excellent';
    recommendedAction = 'high_priority';
  } else if (totalScore >= 65) {
    grade = 'B+';
    qualityLevel = 'high';
    recommendedAction = 'high_priority';
  } else if (totalScore >= 55) {
    grade = 'B';
    qualityLevel = 'good';
    recommendedAction = 'standard';
  } else if (totalScore >= 45) {
    grade = 'C';
    qualityLevel = 'average';
    recommendedAction = 'standard';
  } else {
    grade = 'D';
    qualityLevel = 'low';
    recommendedAction = 'low_priority';
  }

  // Estimate conversion probability
  const conversionProbability = Math.min(95, Math.max(10, totalScore * 0.9 + 10));

  return {
    totalScore,
    grade,
    qualityLevel,
    conversionProbability,
    estimatedValue,
    breakdown,
    factors,
    insights: insights.slice(0, 4), // Top 4 insights
    recommendedAction
  };
};

const getRequiredServicesFromCalculatorType = (calculatorType: string): string[] => {
  const serviceMap: Record<string, string[]> = {
    'Umzugsrechner': ['Umzug'],
    'Reinigungsrechner': ['Umzug', 'Reinigung'],
    'Entsorgungsrechner': ['Umzug', 'Entsorgung'],
    'Lagerrechner': ['Umzug', 'Lagerung'],
    'Packservice-Rechner': ['Umzug', 'Packservice'],
    'Möbelmontage-Rechner': ['Umzug', 'Möbelmontage'],
    'Gesamtpreis-Konfigurator': ['Umzug']
  };
  return serviceMap[calculatorType] || ['Umzug'];
};

// Helper to get color/styling based on quality
export const getQualityColor = (grade: string) => {
  switch (grade) {
    case 'A+':
    case 'A':
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
    case 'B+':
    case 'B':
      return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
    case 'C':
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
    case 'D':
      return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800';
    default:
      return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800';
  }
};

export const getQualityBadgeVariant = (grade: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (grade === 'A+' || grade === 'A') return 'default';
  if (grade === 'B+' || grade === 'B') return 'secondary';
  return 'outline';
};
