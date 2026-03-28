// Lead Matching Score System
// Calculates compatibility between providers and leads

interface Provider {
  id: string;
  cantons_served: string[];
  preferred_regions?: string[] | null;
  min_job_value?: number | null;
  max_leads_per_month?: number | null;
  price_level?: string | null; // Changed to string for compatibility
  services_offered: string[];
}

interface Lead {
  id: string;
  from_postal: string;
  to_postal: string;
  calculator_type: string;
  calculator_output: any;
  created_at: string;
}

export interface LeadMatchScore {
  totalScore: number; // 0-100
  matchPercentage: number; // 0-100
  matchLevel: 'poor' | 'fair' | 'good' | 'excellent';
  breakdown: {
    locationMatch: number; // 0-30 points
    preferenceMatch: number; // 0-20 points
    capacityMatch: number; // 0-20 points
    valueMatch: number; // 0-15 points
    serviceMat: number; // 0-15 points
  };
  details: {
    servesBothCantons: boolean;
    inPreferredRegion: boolean;
    hasCapacity: boolean;
    meetsMinValue: boolean;
    offersRequiredServices: boolean;
  };
  recommendations: string[];
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

// Map calculator type to required services
const getRequiredServices = (calculatorType: string): string[] => {
  const serviceMap: Record<string, string[]> = {
    'Umzugsrechner': ['Umzug'],
    'Reinigungsrechner': ['Umzug', 'Reinigung'],
    'Entsorgungsrechner': ['Umzug', 'Entsorgung'],
    'Lagerrechner': ['Umzug', 'Lagerung'],
    'Packservice-Rechner': ['Umzug', 'Packservice'],
    'Möbelmontage-Rechner': ['Umzug', 'Möbelmontage'],
    'Gesamtpreis-Konfigurator': ['Umzug', 'Reinigung', 'Entsorgung', 'Lagerung', 'Packservice', 'Möbelmontage']
  };
  return serviceMap[calculatorType] || ['Umzug'];
};

export const calculateLeadMatchScore = (
  provider: Provider,
  lead: Lead,
  currentMonthLeadCount: number = 0
): LeadMatchScore => {
  let totalScore = 0;
  const breakdown = {
    locationMatch: 0,
    preferenceMatch: 0,
    capacityMatch: 0,
    valueMatch: 0,
    serviceMat: 0
  };
  const details = {
    servesBothCantons: false,
    inPreferredRegion: false,
    hasCapacity: false,
    meetsMinValue: false,
    offersRequiredServices: false
  };
  const recommendations: string[] = [];

  // 1. Location Match (0-30 points)
  const fromCanton = getCantonFromPostal(lead.from_postal);
  const toCanton = getCantonFromPostal(lead.to_postal);
  
  const servesFrom = provider.cantons_served.includes(fromCanton);
  const servesTo = provider.cantons_served.includes(toCanton);
  
  if (servesFrom && servesTo) {
    breakdown.locationMatch = 30;
    details.servesBothCantons = true;
  } else if (servesFrom || servesTo) {
    breakdown.locationMatch = 15;
    recommendations.push("Erweitern Sie Ihr Servicegebiet für bessere Matches");
  } else {
    breakdown.locationMatch = 0;
    recommendations.push("Lead liegt außerhalb Ihres Servicegebiets");
  }
  totalScore += breakdown.locationMatch;

  // 2. Preference Match (0-20 points)
  if (provider.preferred_regions && provider.preferred_regions.length > 0) {
    const inPreferredFrom = provider.preferred_regions.includes(fromCanton);
    const inPreferredTo = provider.preferred_regions.includes(toCanton);
    
    if (inPreferredFrom && inPreferredTo) {
      breakdown.preferenceMatch = 20;
      details.inPreferredRegion = true;
      recommendations.push("Lead in Ihrer bevorzugten Region - hohe Priorität!");
    } else if (inPreferredFrom || inPreferredTo) {
      breakdown.preferenceMatch = 10;
      details.inPreferredRegion = true;
    } else {
      breakdown.preferenceMatch = 5;
      recommendations.push("Nicht in bevorzugter Region, aber dennoch machbar");
    }
  } else {
    // No preferences set - neutral score
    breakdown.preferenceMatch = 10;
  }
  totalScore += breakdown.preferenceMatch;

  // 3. Capacity Match (0-20 points)
  if (provider.max_leads_per_month) {
    const capacityUsed = currentMonthLeadCount / provider.max_leads_per_month;
    
    if (capacityUsed < 0.5) {
      breakdown.capacityMatch = 20; // Under 50% capacity
      details.hasCapacity = true;
      recommendations.push("Sie haben noch viel Kapazität verfügbar");
    } else if (capacityUsed < 0.75) {
      breakdown.capacityMatch = 15; // 50-75% capacity
      details.hasCapacity = true;
    } else if (capacityUsed < 0.9) {
      breakdown.capacityMatch = 10; // 75-90% capacity
      details.hasCapacity = true;
      recommendations.push("Kapazität wird knapp - priorisieren Sie hochwertige Leads");
    } else if (capacityUsed < 1.0) {
      breakdown.capacityMatch = 5; // 90-100% capacity
      details.hasCapacity = true;
      recommendations.push("Warnung: Kapazität fast ausgeschöpft");
    } else {
      breakdown.capacityMatch = 0; // Over capacity
      details.hasCapacity = false;
      recommendations.push("Kapazitätslimit erreicht - upgraden Sie Ihr Abo");
    }
  } else {
    // Unlimited capacity
    breakdown.capacityMatch = 20;
    details.hasCapacity = true;
  }
  totalScore += breakdown.capacityMatch;

  // 4. Value Match (0-15 points)
  const estimatedJobValue = lead.calculator_output?.priceAvg || 
                            (lead.calculator_output?.volume || 30) * 80;
  
  if (provider.min_job_value) {
    if (estimatedJobValue >= provider.min_job_value * 1.5) {
      breakdown.valueMatch = 15; // Well above minimum
      details.meetsMinValue = true;
      recommendations.push("Auftragswert deutlich über Ihrem Minimum - sehr attraktiv!");
    } else if (estimatedJobValue >= provider.min_job_value * 1.2) {
      breakdown.valueMatch = 12; // Above minimum
      details.meetsMinValue = true;
    } else if (estimatedJobValue >= provider.min_job_value) {
      breakdown.valueMatch = 8; // Meets minimum
      details.meetsMinValue = true;
    } else if (estimatedJobValue >= provider.min_job_value * 0.8) {
      breakdown.valueMatch = 4; // Slightly below
      details.meetsMinValue = false;
      recommendations.push("Auftragswert unter Ihrem Minimum - trotzdem interessant?");
    } else {
      breakdown.valueMatch = 0; // Well below
      details.meetsMinValue = false;
      recommendations.push("Auftragswert zu niedrig für Ihre Kriterien");
    }
  } else {
    // No minimum set - neutral score
    breakdown.valueMatch = 10;
    details.meetsMinValue = true;
  }
  totalScore += breakdown.valueMatch;

  // 5. Service Match (0-15 points)
  const requiredServices = getRequiredServices(lead.calculator_type);
  const matchedServices = requiredServices.filter(service => 
    provider.services_offered.includes(service)
  );
  
  const serviceMatchRatio = matchedServices.length / requiredServices.length;
  
  if (serviceMatchRatio === 1) {
    breakdown.serviceMat = 15; // All services offered
    details.offersRequiredServices = true;
    recommendations.push("Sie bieten alle benötigten Services - perfekt!");
  } else if (serviceMatchRatio >= 0.8) {
    breakdown.serviceMat = 12; // Most services
    details.offersRequiredServices = true;
  } else if (serviceMatchRatio >= 0.5) {
    breakdown.serviceMat = 7; // Some services
    details.offersRequiredServices = false;
    recommendations.push("Sie decken nur einige benötigte Services ab");
  } else {
    breakdown.serviceMat = 0; // Few services
    details.offersRequiredServices = false;
    recommendations.push("Erweitern Sie Ihr Service-Angebot für bessere Matches");
  }
  totalScore += breakdown.serviceMat;

  // Calculate match level
  let matchLevel: 'poor' | 'fair' | 'good' | 'excellent' = 'poor';
  if (totalScore >= 80) matchLevel = 'excellent';
  else if (totalScore >= 60) matchLevel = 'good';
  else if (totalScore >= 40) matchLevel = 'fair';

  return {
    totalScore,
    matchPercentage: totalScore,
    matchLevel,
    breakdown,
    details,
    recommendations: recommendations.slice(0, 3) // Top 3 recommendations
  };
};

// Get color/variant based on match level
export const getMatchLevelColor = (matchLevel: string) => {
  switch (matchLevel) {
    case 'excellent': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
    case 'good': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    case 'fair': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
    default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
  }
};

export const getMatchLevelLabel = (matchLevel: string) => {
  switch (matchLevel) {
    case 'excellent': return 'Ausgezeichnet';
    case 'good': return 'Gut';
    case 'fair': return 'Durchschnittlich';
    default: return 'Niedrig';
  }
};
