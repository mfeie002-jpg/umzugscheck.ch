// SEO Keyword Mapping and Cluster System for umzugscheck.ch

export interface KeywordMapping {
  primary: string;
  secondary: string[];
  cluster: 'switzerland' | 'service' | 'city' | 'city-service';
}

// Main page keywords
export const mainPageKeywords: Record<string, KeywordMapping> = {
  'home': {
    primary: 'umzugsvergleich schweiz',
    secondary: [
      'umzugsfirmen vergleichen',
      'umzugsofferten schweiz',
      'umzugskosten schweiz'
    ],
    cluster: 'switzerland'
  },
  'offerten': {
    primary: 'umzugsofferten',
    secondary: [
      'kostenlose umzugsofferten',
      'umzug offerten vergleichen',
      'gratis umzugsangebote'
    ],
    cluster: 'switzerland'
  },
  'preise': {
    primary: 'umzugskosten schweiz',
    secondary: [
      'umzug preise',
      'was kostet ein umzug',
      'umzug kosten rechner'
    ],
    cluster: 'switzerland'
  },
  'vergleich': {
    primary: 'umzugsfirmen vergleich',
    secondary: [
      'umzugsfirmen bewertungen',
      'beste umzugsfirma',
      'umzugsunternehmen vergleichen'
    ],
    cluster: 'switzerland'
  },
  'faq': {
    primary: 'umzug faq schweiz',
    secondary: [
      'umzug fragen',
      'umzugstipps schweiz',
      'umzug hilfe'
    ],
    cluster: 'switzerland'
  },
  'ueber-uns': {
    primary: 'umzugscheck.ch',
    secondary: [
      'über umzugscheck',
      'umzugsportal schweiz',
      'umzugsvergleich plattform'
    ],
    cluster: 'switzerland'
  }
};

// Service-specific keywords
export const serviceKeywords: Record<string, KeywordMapping> = {
  'umzug': {
    primary: 'umzug schweiz',
    secondary: [
      'umzugsfirma schweiz',
      'umzugsservice schweiz',
      'umzugsunternehmen schweiz'
    ],
    cluster: 'service'
  },
  'reinigung': {
    primary: 'endreinigung wohnung schweiz',
    secondary: [
      'wohnungsreinigung mit abnahmegarantie',
      'umzugsreinigung schweiz',
      'endreinigung kosten'
    ],
    cluster: 'service'
  },
  'raeumung': {
    primary: 'wohnungsräumung schweiz',
    secondary: [
      'entrümpelung schweiz',
      'hausräumung kosten',
      'räumungsfirma schweiz'
    ],
    cluster: 'service'
  },
  'firmenumzug': {
    primary: 'firmenumzug schweiz',
    secondary: [
      'büroumzug schweiz',
      'geschäftsumzug',
      'firmenumzug kosten'
    ],
    cluster: 'service'
  },
  'transport': {
    primary: 'möbeltransport schweiz',
    secondary: [
      'kleintransport schweiz',
      'möbeltaxi schweiz',
      'transport service'
    ],
    cluster: 'service'
  },
  'lagerung': {
    primary: 'möbellagerung schweiz',
    secondary: [
      'selfstorage schweiz',
      'lagerraum mieten',
      'einlagerung möbel'
    ],
    cluster: 'service'
  },
  'entsorgung': {
    primary: 'entsorgung schweiz',
    secondary: [
      'sperrgut entsorgung',
      'möbelentsorgung schweiz',
      'entsorgungsservice'
    ],
    cluster: 'service'
  },
  'umzug-mit-reinigung': {
    primary: 'umzug mit reinigung schweiz',
    secondary: [
      'umzug und endreinigung paket',
      'kombi umzug reinigung',
      'umzugspaket mit reinigung'
    ],
    cluster: 'service'
  }
};

// City keywords template
export function getCityKeywords(citySlug: string, cityName: string): KeywordMapping {
  return {
    primary: `umzugsfirmen ${cityName.toLowerCase()}`,
    secondary: [
      `umzug ${cityName.toLowerCase()}`,
      `umzugsofferten ${cityName.toLowerCase()}`,
      `umzugsunternehmen ${cityName.toLowerCase()}`,
      `zügelfirma ${cityName.toLowerCase()}`
    ],
    cluster: 'city'
  };
}

// City × Service keywords template
export function getCityServiceKeywords(
  citySlug: string,
  cityName: string,
  serviceSlug: string,
  serviceName: string
): KeywordMapping {
  return {
    primary: `${serviceName.toLowerCase()} in ${cityName.toLowerCase()}`,
    secondary: [
      `${serviceName.toLowerCase()} ${cityName.toLowerCase()} preis`,
      `${serviceName.toLowerCase()} ${cityName.toLowerCase()} anbieter`,
      `${serviceName.toLowerCase()} ${cityName.toLowerCase()} offerte`,
      `${serviceName.toLowerCase()} ${cityName.toLowerCase()} firma`
    ],
    cluster: 'city-service'
  };
}

// Helper function to get keywords as array for meta tags
export function getKeywordsForPage(pageType: string, city?: string, service?: string): string[] {
  const mapping = getPageKeywords(pageType, city, service);
  if (!mapping) return [];
  return [mapping.primary, ...mapping.secondary];
}

// Get keywords for any page
export function getPageKeywords(pageType: string, city?: string, service?: string): KeywordMapping | null {
  // Main pages
  if (mainPageKeywords[pageType]) {
    return mainPageKeywords[pageType];
  }

  // Service pages
  if (service && serviceKeywords[service]) {
    return serviceKeywords[service];
  }

  // City pages
  if (city && !service) {
    const cityNames: Record<string, string> = {
      'zuerich': 'Zürich',
      'bern': 'Bern',
      'basel': 'Basel',
      'genf': 'Genf',
      'lausanne': 'Lausanne',
      'lugano': 'Lugano',
      'luzern': 'Luzern',
      'winterthur': 'Winterthur',
      'st-gallen': 'St. Gallen',
      'zug': 'Zug',
      'biel': 'Biel',
      'aarau': 'Aarau',
      'schaffhausen': 'Schaffhausen',
      'chur': 'Chur'
    };
    const cityName = cityNames[city];
    if (cityName) {
      return getCityKeywords(city, cityName);
    }
  }

  // City × Service pages
  if (city && service) {
    const cityNames: Record<string, string> = {
      'zuerich': 'Zürich',
      'bern': 'Bern',
      'basel': 'Basel',
      'genf': 'Genf',
      'lausanne': 'Lausanne',
      'lugano': 'Lugano',
      'luzern': 'Luzern',
      'winterthur': 'Winterthur',
      'st-gallen': 'St. Gallen',
      'zug': 'Zug',
      'biel': 'Biel',
      'aarau': 'Aarau',
      'schaffhausen': 'Schaffhausen',
      'chur': 'Chur'
    };
    const serviceNames: Record<string, string> = {
      'umzug': 'Umzug',
      'reinigung': 'Endreinigung',
      'raeumung': 'Räumung',
      'firmenumzug': 'Firmenumzug',
      'transport': 'Transport',
      'lagerung': 'Lagerung',
      'entsorgung': 'Entsorgung',
      'umzug-mit-reinigung': 'Umzug + Reinigung'
    };
    
    const cityName = cityNames[city];
    const serviceName = serviceNames[service];
    
    if (cityName && serviceName) {
      return getCityServiceKeywords(city, cityName, service, serviceName);
    }
  }

  return null;
}

// SEO content optimization helper
export function optimizeContentForKeywords(
  content: string,
  keywords: KeywordMapping,
  maxDensity: number = 0.02 // 2% keyword density max
): boolean {
  const wordCount = content.split(/\s+/).length;
  const primaryCount = (content.match(new RegExp(keywords.primary, 'gi')) || []).length;
  const density = primaryCount / wordCount;
  
  return density > 0 && density <= maxDensity;
}
