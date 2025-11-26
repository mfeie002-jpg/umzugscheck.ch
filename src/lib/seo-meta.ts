// SEO Meta Tag Generation System for umzugscheck.ch

interface MetaData {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
}

interface PageData {
  type: 'home' | 'service' | 'city' | 'city-service' | 'main-page';
  service?: string;
  city?: string;
  pageName?: string;
}

// City display names
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

// Service display names
const serviceNames: Record<string, string> = {
  'umzug': 'Umzug',
  'reinigung': 'Endreinigung',
  'raeumung': 'Räumung',
  'firmenumzug': 'Firmenumzug',
  'transport': 'Möbeltransport',
  'lagerung': 'Lagerung',
  'entsorgung': 'Entsorgung',
  'umzug-mit-reinigung': 'Umzug + Reinigung'
};

// Main pages meta data
const mainPagesMeta: Record<string, MetaData> = {
  'home': {
    title: 'Umzugsvergleich Schweiz | Kostenlos Offerten erhalten',
    description: 'Vergleiche geprüfte Umzugsfirmen in der Schweiz. Gratis Offerten, 4.8 Sterne, 15\'000+ Umzüge. In 2 Minuten Angebote sichern.',
    ogImage: '/og-images/home.jpg'
  },
  'offerten': {
    title: 'Umzugsofferten Schweiz | Kostenlose Angebote vergleichen',
    description: 'Erhalte gratis Umzugsangebote von geprüften Firmen. Schnell, unverbindlich und 100% kostenlos.',
    ogImage: '/og-images/calculator.jpg'
  },
  'preise': {
    title: 'Umzugskosten Schweiz | Preise & Richtwerte 2025',
    description: 'Finde echte Umzugspreise für jede Wohnungsgröße. Vergleiche Kosten & erhalte transparente Offerten.',
    ogImage: '/og-images/calculator.jpg'
  },
  'vergleich': {
    title: 'Umzugsfirmen Vergleich | Beste Anbieter 2025',
    description: 'Vergleiche Bewertungen, Preise und Verfügbarkeit. Spare bis zu 40% mit einem professionellen Umzugsvergleich.',
    ogImage: '/og-images/comparison_cards.jpg'
  },
  'faq': {
    title: 'Umzug FAQ | Häufige Fragen & Antworten',
    description: 'Alles zum Thema Umzug, Kosten, Firmen, Reinigung und Planung. Schnell erklärt.',
    ogImage: '/og-images/faq_generic.jpg'
  },
  'ueber-uns': {
    title: 'Über umzugscheck.ch | Schweizer Umzugsvergleich',
    description: 'Wir helfen seit 2018 beim stressfreien Zügeln. Geprüfte Firmen, faire Preise, echte Bewertungen.',
    ogImage: '/og-images/home.jpg'
  }
};

// Service-specific meta data
const serviceMeta: Record<string, MetaData> = {
  'umzug': {
    title: 'Umzug Schweiz | Beste Umzugsfirmen vergleichen',
    description: 'Finde professionelle Umzugsfirmen in der Schweiz. Gratis Angebote, geprüfte Qualität.',
    ogImage: '/og-images/service_umzug.jpg'
  },
  'reinigung': {
    title: 'Endreinigung mit Abnahmegarantie | Preise & Firmen',
    description: 'Reinigung mit Abnahmegarantie. Fixpreise vergleichen & Angebote einholen.',
    ogImage: '/og-images/service_reinigung.jpg'
  },
  'raeumung': {
    title: 'Räumung & Entrümpelung Schweiz | Preise & Angebote',
    description: 'Räumungsfirmen vergleichen. Schnell, sauber und kostenlos Offerten erhalten.',
    ogImage: '/og-images/service_raeumung.jpg'
  },
  'firmenumzug': {
    title: 'Firmenumzug Schweiz | Profis für Büro-Umzüge',
    description: 'Planung, Transport & Montage. Beste Firmenumzugsanbieter vergleichen.',
    ogImage: '/og-images/service_firmenumzug.jpg'
  },
  'transport': {
    title: 'Möbeltransport Schweiz | Kleintransporte & Umzüge',
    description: 'Möbeltransport ab CHF 90. Kostenlose Angebote vergleichen.',
    ogImage: '/og-images/service_transport.jpg'
  },
  'lagerung': {
    title: 'Möbellager & Selfstorage Schweiz | Preise & Anbieter',
    description: 'Sichere Lagerplätze ab CHF 90/Monat. Jetzt Lagerangebote vergleichen.',
    ogImage: '/og-images/service_lagerung.jpg'
  },
  'entsorgung': {
    title: 'Entsorgung & Sperrgut Schweiz | Sofort Offerten',
    description: 'Schnelle Sperrgutentsorgung ab CHF 90. Anbieter vergleichen und sparen.',
    ogImage: '/og-images/service_entsorgung.jpg'
  },
  'umzug-mit-reinigung': {
    title: 'Umzug + Reinigung | Kombi-Angebote mit Garantie',
    description: 'Alles aus einer Hand: Umzug & Endreinigung. Gratis Kombi-Offerten vergleichen.',
    ogImage: '/og-images/service_kombi.jpg'
  }
};

// City-specific meta data
const cityMeta: Record<string, MetaData> = {
  'zuerich': {
    title: 'Umzugsfirmen Zürich | Preise & Offerten 2025',
    description: 'Beste Umzugsfirmen in Zürich vergleichen. Kostenlose Offerten, lokale Profis.',
    ogImage: '/og-images/city_zuerich.jpg'
  },
  'bern': {
    title: 'Umzugsfirmen Bern | Gratis Offerten vergleichen',
    description: 'Top-Bewertete Umzugsfirmen in Bern. Preise vergleichen & sparen.',
    ogImage: '/og-images/city_bern.jpg'
  },
  'basel': {
    title: 'Umzugsfirmen Basel | Preise & Bewertungen',
    description: 'Geprüfte Firmen in Basel vergleichen. Gratis Angebote.',
    ogImage: '/og-images/city_basel.jpg'
  },
  'genf': {
    title: 'Umzugsfirmen Genf | Offerten & Preise 2025',
    description: 'Professionelle Umzugsfirmen in Genf vergleichen. Sofort Offerten sichern.',
    ogImage: '/og-images/city_genf.jpg'
  },
  'lausanne': {
    title: 'Umzugsfirmen Lausanne | Kostenlose Angebote',
    description: 'Umzüge in Lausanne vergleichen & passende Firma finden.',
    ogImage: '/og-images/city_lausanne.jpg'
  },
  'lugano': {
    title: 'Ditte di Trasloco Lugano | Preventivi Gratuiti',
    description: 'Confronta ditte verificate a Lugano. Preventivi rapidi.',
    ogImage: '/og-images/city_lugano.jpg'
  },
  'luzern': {
    title: 'Umzugsfirmen Luzern | Preise & Angebote',
    description: 'Regionale Luzerner Umzugsfirmen vergleichen. Gratis Offerten.',
    ogImage: '/og-images/city_luzern.jpg'
  },
  'winterthur': {
    title: 'Umzugsfirmen Winterthur | Gratis Offerten',
    description: 'Winti-Umzugsfirmen vergleichen & freie Termine sichern.',
    ogImage: '/og-images/city_winterthur.jpg'
  },
  'st-gallen': {
    title: 'Umzugsfirmen St. Gallen | Offerten & Preise',
    description: 'Transparente Angebote für St. Gallen. Schnell Offerten vergleichen.',
    ogImage: '/og-images/city_stgallen.jpg'
  },
  'zug': {
    title: 'Umzugsfirmen Zug | Premium Umzugsofferten',
    description: 'Regionale Premium-Firmen vergleichen. Gratis Angebote.',
    ogImage: '/og-images/city_zug.jpg'
  },
  'biel': {
    title: 'Umzugsfirmen Biel/Bienne | Offerten Vergleich',
    description: 'Zweisprachige Umzugsfirmen vergleichen & sparen.',
    ogImage: '/og-images/city_biel.jpg'
  },
  'aarau': {
    title: 'Umzugsfirmen Aarau | Kostenlose Angebote',
    description: 'Professionelle Umzüge in Aarau vergleichen.',
    ogImage: '/og-images/city_aarau.jpg'
  },
  'schaffhausen': {
    title: 'Umzugsfirmen Schaffhausen | Preise & Firmen',
    description: 'Regionale SH-Umzugsfirmen vergleichen. Gratis Offerten.',
    ogImage: '/og-images/city_schaffhausen.jpg'
  },
  'chur': {
    title: 'Umzugsfirmen Chur | Angebote & Preise',
    description: 'Lokale Umzugsteams vergleichen. Sofort Offerten einholen.',
    ogImage: '/og-images/city_chur.jpg'
  }
};

export function generateMetaData(pageData: PageData): MetaData {
  // Main pages
  if (pageData.type === 'main-page' && pageData.pageName) {
    return mainPagesMeta[pageData.pageName] || mainPagesMeta.home;
  }

  // Homepage
  if (pageData.type === 'home') {
    return mainPagesMeta.home;
  }

  // Service pages
  if (pageData.type === 'service' && pageData.service) {
    return serviceMeta[pageData.service] || serviceMeta.umzug;
  }

  // City pages
  if (pageData.type === 'city' && pageData.city) {
    return cityMeta[pageData.city] || cityMeta.zuerich;
  }

  // City × Service combinations (dynamic template)
  if (pageData.type === 'city-service' && pageData.city && pageData.service) {
    const cityDisplay = cityNames[pageData.city] || pageData.city;
    const serviceDisplay = serviceNames[pageData.service] || pageData.service;
    
    return {
      title: `${serviceDisplay} in ${cityDisplay} | Preise & Offerten 2025`,
      description: `Top Anbieter für ${serviceDisplay} in ${cityDisplay} vergleichen. Kostenlose Offerten, regionale Profis, schnelle Termine.`,
      ogImage: `/og-images/combo_${pageData.city}_${pageData.service}.jpg`
    };
  }

  // Fallback
  return mainPagesMeta.home;
}

export function generateOGTags(metaData: MetaData, currentUrl: string) {
  return {
    'og:title': metaData.title,
    'og:description': metaData.description,
    'og:type': 'website',
    'og:url': currentUrl,
    'og:image': metaData.ogImage || '/og-images/og_default_umzug.jpg',
    'twitter:card': 'summary_large_image',
    'twitter:title': metaData.title,
    'twitter:description': metaData.description,
    'twitter:image': metaData.ogImage || '/og-images/og_default_umzug.jpg'
  };
}

export { cityNames, serviceNames };
