// Internal Linking Engine for umzugscheck.ch
// Automatically generates SEO-optimized internal links based on page type and context

export interface InternalLink {
  url: string;
  text: string;
  type: 'city' | 'service' | 'main' | 'city-service';
}

export interface LinkCluster {
  title: string;
  links: InternalLink[];
}

const cities = [
  { slug: 'zuerich', name: 'Zürich' },
  { slug: 'bern', name: 'Bern' },
  { slug: 'basel', name: 'Basel' },
  { slug: 'genf', name: 'Genf' },
  { slug: 'lausanne', name: 'Lausanne' },
  { slug: 'lugano', name: 'Lugano' },
  { slug: 'luzern', name: 'Luzern' },
  { slug: 'winterthur', name: 'Winterthur' },
  { slug: 'st-gallen', name: 'St. Gallen' },
  { slug: 'zug', name: 'Zug' },
  { slug: 'biel', name: 'Biel' },
  { slug: 'aarau', name: 'Aarau' },
  { slug: 'schaffhausen', name: 'Schaffhausen' },
  { slug: 'chur', name: 'Chur' }
];

const services = [
  { slug: 'umzug', name: 'Umzug', keywordVariant: 'Umzugsfirmen' },
  { slug: 'reinigung', name: 'Reinigung', keywordVariant: 'Endreinigung' },
  { slug: 'raeumung', name: 'Räumung', keywordVariant: 'Wohnungsräumung' },
  { slug: 'firmenumzug', name: 'Firmenumzug', keywordVariant: 'Büroumzug' },
  { slug: 'transport', name: 'Transport', keywordVariant: 'Möbeltransport' },
  { slug: 'lagerung', name: 'Lagerung', keywordVariant: 'Möbellagerung' },
  { slug: 'entsorgung', name: 'Entsorgung', keywordVariant: 'Sperrgutentsorgung' },
  { slug: 'umzug-mit-reinigung', name: 'Umzug + Reinigung', keywordVariant: 'Umzug mit Reinigung' }
];

// Neighboring city clusters for geographic relevance
const cityNeighbors: Record<string, string[]> = {
  'zuerich': ['winterthur', 'zug', 'luzern'],
  'winterthur': ['zuerich', 'st-gallen', 'schaffhausen'],
  'bern': ['luzern', 'biel', 'aarau'],
  'basel': ['bern', 'aarau', 'luzern'],
  'genf': ['lausanne', 'bern', 'luzern'],
  'lausanne': ['genf', 'bern', 'luzern'],
  'luzern': ['zuerich', 'bern', 'zug'],
  'st-gallen': ['winterthur', 'zuerich', 'chur'],
  'zug': ['zuerich', 'luzern', 'aarau'],
  'biel': ['bern', 'basel', 'aarau'],
  'aarau': ['bern', 'basel', 'zug'],
  'lugano': ['luzern', 'zuerich', 'bern'],
  'schaffhausen': ['winterthur', 'zuerich', 'st-gallen'],
  'chur': ['st-gallen', 'luzern', 'zuerich']
};

// Related services for service cluster navigation
const serviceRelations: Record<string, string[]> = {
  'umzug': ['reinigung', 'entsorgung', 'lagerung'],
  'reinigung': ['umzug', 'umzug-mit-reinigung', 'raeumung'],
  'raeumung': ['entsorgung', 'reinigung', 'umzug'],
  'firmenumzug': ['umzug', 'lagerung', 'transport'],
  'transport': ['umzug', 'lagerung', 'firmenumzug'],
  'lagerung': ['umzug', 'firmenumzug', 'transport'],
  'entsorgung': ['raeumung', 'umzug', 'reinigung'],
  'umzug-mit-reinigung': ['umzug', 'reinigung', 'entsorgung']
};

/**
 * Generate internal links for homepage
 */
export function getHomepageLinks(): LinkCluster[] {
  return [
    {
      title: 'Beliebte Städte',
      links: cities.slice(0, 6).map(city => ({
        url: `/${city.slug}/umzugsfirmen/`,
        text: `Umzugsfirmen in ${city.name} vergleichen`,
        type: 'city' as const
      }))
    },
    {
      title: 'Top Services',
      links: services.slice(0, 4).map(service => ({
        url: `/${service.slug}/`,
        text: `${service.keywordVariant} in der Schweiz`,
        type: 'service' as const
      }))
    },
    {
      title: 'Weitere Informationen',
      links: [
        { url: '/umzugsofferten/', text: 'Kostenlose Umzugsofferten erhalten', type: 'main' as const },
        { url: '/preise/', text: 'Umzugskosten in der Schweiz ansehen', type: 'main' as const },
        { url: '/firmen/', text: 'Umzugsfirmen vergleichen', type: 'main' as const },
        { url: '/faq/', text: 'Häufige Fragen zum Umzug', type: 'main' as const }
      ]
    }
  ];
}

/**
 * Generate internal links for city pages
 */
export function getCityPageLinks(citySlug: string): LinkCluster[] {
  const currentCity = cities.find(c => c.slug === citySlug);
  if (!currentCity) return [];

  const neighbors = cityNeighbors[citySlug] || [];
  const neighborCities = neighbors.map(slug => cities.find(c => c.slug === slug)).filter(Boolean) as typeof cities;

  return [
    {
      title: 'Weitere Städte',
      links: neighborCities.map(city => ({
        url: `/${city.slug}/umzugsfirmen/`,
        text: `Umzug nach ${city.name}`,
        type: 'city' as const
      }))
    },
    {
      title: `Services in ${currentCity.name}`,
      links: services.slice(0, 6).map(service => ({
        url: `/${citySlug}/${service.slug}/`,
        text: `${service.name} in ${currentCity.name}`,
        type: 'city-service' as const
      }))
    },
    {
      title: 'Nützliche Links',
      links: [
        { url: '/umzugsofferten/', text: `Umzugsofferten für ${currentCity.name} erhalten`, type: 'main' as const },
        { url: '/preise/', text: `Umzugspreise in ${currentCity.name}`, type: 'main' as const },
        { url: '/firmen/', text: 'Schweizweiter Firmenvergleich', type: 'main' as const }
      ]
    }
  ];
}

/**
 * Generate internal links for service pages
 */
export function getServicePageLinks(serviceSlug: string): LinkCluster[] {
  const currentService = services.find(s => s.slug === serviceSlug);
  if (!currentService) return [];

  const relatedServiceSlugs = serviceRelations[serviceSlug] || [];
  const relatedServices = relatedServiceSlugs.map(slug => services.find(s => s.slug === slug)).filter(Boolean) as typeof services;

  return [
    {
      title: 'Weitere Services',
      links: relatedServices.map(service => ({
        url: `/${service.slug}/`,
        text: `${service.keywordVariant} Schweiz`,
        type: 'service' as const
      }))
    },
    {
      title: `${currentService.name} in beliebten Städten`,
      links: cities.slice(0, 8).map(city => ({
        url: `/${city.slug}/${serviceSlug}/`,
        text: `${currentService.name} in ${city.name} buchen`,
        type: 'city-service' as const
      }))
    },
    {
      title: 'Weitere Informationen',
      links: [
        { url: '/umzugsofferten/', text: `Offerten für ${currentService.name} vergleichen`, type: 'main' as const },
        { url: '/preise/', text: `Preise für ${currentService.name}`, type: 'main' as const },
        { url: '/', text: 'Zur Startseite', type: 'main' as const }
      ]
    }
  ];
}

/**
 * Generate internal links for city × service pages
 */
export function getCityServicePageLinks(citySlug: string, serviceSlug: string): LinkCluster[] {
  const currentCity = cities.find(c => c.slug === citySlug);
  const currentService = services.find(s => s.slug === serviceSlug);
  
  if (!currentCity || !currentService) return [];

  const neighbors = cityNeighbors[citySlug] || [];
  const neighborCities = neighbors.slice(0, 3).map(slug => cities.find(c => c.slug === slug)).filter(Boolean) as typeof cities;

  const relatedServiceSlugs = serviceRelations[serviceSlug] || [];
  const relatedServices = relatedServiceSlugs.slice(0, 2).map(slug => services.find(s => s.slug === slug)).filter(Boolean) as typeof services;

  return [
    {
      title: `${currentService.name} in anderen Städten`,
      links: neighborCities.map(city => ({
        url: `/${city.slug}/${serviceSlug}/`,
        text: `${currentService.name} in ${city.name}`,
        type: 'city-service' as const
      }))
    },
    {
      title: `Weitere Services in ${currentCity.name}`,
      links: relatedServices.map(service => ({
        url: `/${citySlug}/${service.slug}/`,
        text: `${service.name} in ${currentCity.name}`,
        type: 'city-service' as const
      }))
    },
    {
      title: 'Hauptseiten',
      links: [
        { url: `/${citySlug}/umzugsfirmen/`, text: `Alle Firmen in ${currentCity.name}`, type: 'city' as const },
        { url: `/${serviceSlug}/`, text: `${currentService.keywordVariant} Schweizweit`, type: 'service' as const },
        { url: '/umzugsofferten/', text: 'Offerten erhalten', type: 'main' as const },
        { url: '/preise/', text: 'Preise ansehen', type: 'main' as const }
      ]
    }
  ];
}

/**
 * Generate internal links for main pages (offerten, preise, vergleich, faq)
 */
export function getMainPageLinks(pageType: 'offerten' | 'preise' | 'vergleich' | 'faq'): LinkCluster[] {
  const baseLinks: LinkCluster = {
    title: 'Beliebte Städte',
    links: cities.slice(0, 6).map(city => ({
      url: `/${city.slug}/umzugsfirmen/`,
      text: `Umzugsfirmen in ${city.name}`,
      type: 'city' as const
    }))
  };

  const servicesLinks: LinkCluster = {
    title: 'Services',
    links: services.slice(0, 4).map(service => ({
      url: `/${service.slug}/`,
      text: `${service.keywordVariant}`,
      type: 'service' as const
    }))
  };

  const mainLinks: LinkCluster = {
    title: 'Weitere Seiten',
    links: [
      pageType !== 'offerten' && { url: '/umzugsofferten/', text: 'Kostenlose Offerten', type: 'main' as const },
      pageType !== 'preise' && { url: '/preise/', text: 'Umzugskosten Schweiz', type: 'main' as const },
      pageType !== 'vergleich' && { url: '/firmen/', text: 'Firmenvergleich', type: 'main' as const },
      pageType !== 'faq' && { url: '/faq/', text: 'Häufige Fragen', type: 'main' as const },
      { url: '/', text: 'Zur Startseite', type: 'main' as const }
    ].filter(Boolean) as InternalLink[]
  };

  return [baseLinks, servicesLinks, mainLinks];
}

/**
 * Get a deduplicated list of all internal links for a page
 */
export function getAllPageLinks(clusters: LinkCluster[]): InternalLink[] {
  const seen = new Set<string>();
  const links: InternalLink[] = [];

  for (const cluster of clusters) {
    for (const link of cluster.links) {
      if (!seen.has(link.url)) {
        seen.add(link.url);
        links.push(link);
      }
    }
  }

  return links;
}
