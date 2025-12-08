// Enhanced SEO utilities for comprehensive site optimization

export interface EnhancedPageMeta {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  ogType: 'website' | 'article' | 'product' | 'local_business';
  structuredData: Record<string, unknown>[];
  breadcrumbs: { name: string; url: string }[];
  alternateUrls?: { lang: string; url: string }[];
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

const BASE_URL = 'https://umzugscheck.ch';
const DEFAULT_OG_IMAGE = `${BASE_URL}/lovable-uploads/d4aa8c36-01f9-47b7-8e18-bd2a8e22467a.png`;

// Comprehensive canton data for SEO
export const cantonSeoData: Record<string, {
  name: string;
  slug: string;
  population: number;
  mainCity: string;
  keywords: string[];
}> = {
  zuerich: {
    name: 'Zürich',
    slug: 'zuerich',
    population: 1539275,
    mainCity: 'Zürich',
    keywords: ['Umzug Zürich', 'Umzugsfirma Zürich', 'günstig Umziehen Zürich', 'Zügeln Zürich']
  },
  bern: {
    name: 'Bern',
    slug: 'bern',
    population: 1034977,
    mainCity: 'Bern',
    keywords: ['Umzug Bern', 'Umzugsfirma Bern', 'Umzugsunternehmen Bern', 'Zügeln Bern']
  },
  basel: {
    name: 'Basel',
    slug: 'basel',
    population: 501617,
    mainCity: 'Basel',
    keywords: ['Umzug Basel', 'Umzugsfirma Basel', 'Umzugsservice Basel', 'Zügelfirma Basel']
  },
  luzern: {
    name: 'Luzern',
    slug: 'luzern',
    population: 416347,
    mainCity: 'Luzern',
    keywords: ['Umzug Luzern', 'Umzugsfirma Luzern', 'Umzugsunternehmen Luzern']
  },
  aargau: {
    name: 'Aargau',
    slug: 'aargau',
    population: 694072,
    mainCity: 'Aarau',
    keywords: ['Umzug Aargau', 'Umzugsfirma Aargau', 'Umzug Aarau']
  },
  stgallen: {
    name: 'St. Gallen',
    slug: 'stgallen',
    population: 514504,
    mainCity: 'St. Gallen',
    keywords: ['Umzug St. Gallen', 'Umzugsfirma St. Gallen', 'Umzugsservice St. Gallen']
  },
  zug: {
    name: 'Zug',
    slug: 'zug',
    population: 128794,
    mainCity: 'Zug',
    keywords: ['Umzug Zug', 'Umzugsfirma Zug', 'Umzugsunternehmen Zug']
  },
  thurgau: {
    name: 'Thurgau',
    slug: 'thurgau',
    population: 282909,
    mainCity: 'Frauenfeld',
    keywords: ['Umzug Thurgau', 'Umzugsfirma Thurgau', 'Umzug Frauenfeld']
  },
  solothurn: {
    name: 'Solothurn',
    slug: 'solothurn',
    population: 275969,
    mainCity: 'Solothurn',
    keywords: ['Umzug Solothurn', 'Umzugsfirma Solothurn']
  },
  graubuenden: {
    name: 'Graubünden',
    slug: 'graubuenden',
    population: 200096,
    mainCity: 'Chur',
    keywords: ['Umzug Graubünden', 'Umzugsfirma Chur', 'Umzug Chur']
  },
  wallis: {
    name: 'Wallis',
    slug: 'wallis',
    population: 345525,
    mainCity: 'Sion',
    keywords: ['Umzug Wallis', 'Umzugsfirma Wallis', 'Umzug Sion']
  },
  tessin: {
    name: 'Tessin',
    slug: 'tessin',
    population: 351491,
    mainCity: 'Bellinzona',
    keywords: ['Umzug Tessin', 'Umzugsfirma Tessin', 'Trasloco Ticino']
  },
  fribourg: {
    name: 'Fribourg',
    slug: 'fribourg',
    population: 325496,
    mainCity: 'Fribourg',
    keywords: ['Umzug Fribourg', 'Umzugsfirma Fribourg', 'Déménagement Fribourg']
  },
  schwyz: {
    name: 'Schwyz',
    slug: 'schwyz',
    population: 162157,
    mainCity: 'Schwyz',
    keywords: ['Umzug Schwyz', 'Umzugsfirma Schwyz']
  },
  geneve: {
    name: 'Genève',
    slug: 'geneve',
    population: 504128,
    mainCity: 'Genève',
    keywords: ['Déménagement Genève', 'Umzug Genf', 'Entreprise déménagement Genève']
  },
  uri: {
    name: 'Uri',
    slug: 'uri',
    population: 36703,
    mainCity: 'Altdorf',
    keywords: ['Umzug Uri', 'Umzugsfirma Uri', 'Umzug Altdorf']
  },
  obwalden: {
    name: 'Obwalden',
    slug: 'obwalden',
    population: 38108,
    mainCity: 'Sarnen',
    keywords: ['Umzug Obwalden', 'Umzugsfirma Obwalden']
  },
  nidwalden: {
    name: 'Nidwalden',
    slug: 'nidwalden',
    population: 43223,
    mainCity: 'Stans',
    keywords: ['Umzug Nidwalden', 'Umzugsfirma Nidwalden']
  },
  glarus: {
    name: 'Glarus',
    slug: 'glarus',
    population: 40851,
    mainCity: 'Glarus',
    keywords: ['Umzug Glarus', 'Umzugsfirma Glarus']
  },
  schaffhausen: {
    name: 'Schaffhausen',
    slug: 'schaffhausen',
    population: 83107,
    mainCity: 'Schaffhausen',
    keywords: ['Umzug Schaffhausen', 'Umzugsfirma Schaffhausen']
  },
  appenzell: {
    name: 'Appenzell',
    slug: 'appenzell',
    population: 71150,
    mainCity: 'Appenzell',
    keywords: ['Umzug Appenzell', 'Umzugsfirma Appenzell']
  },
  neuchatel: {
    name: 'Neuchâtel',
    slug: 'neuchatel',
    population: 176496,
    mainCity: 'Neuchâtel',
    keywords: ['Déménagement Neuchâtel', 'Umzug Neuenburg']
  },
  jura: {
    name: 'Jura',
    slug: 'jura',
    population: 73584,
    mainCity: 'Delémont',
    keywords: ['Déménagement Jura', 'Umzug Jura', 'Umzugsfirma Delémont']
  }
};

// Service SEO data
export const serviceSeoData: Record<string, {
  name: string;
  slug: string;
  description: string;
  keywords: string[];
}> = {
  umzug: {
    name: 'Privatumzug',
    slug: 'privatumzug',
    description: 'Professionelle Privatumzüge in der Schweiz. Komplett-Service mit Verpackung, Transport und Montage.',
    keywords: ['Privatumzug', 'Wohnungsumzug', 'Hausumzug', 'Umzugsservice']
  },
  firmenumzug: {
    name: 'Firmenumzug',
    slug: 'firmenumzug',
    description: 'Büroumzüge und Firmenumzüge professionell geplant. Minimale Ausfallzeiten, maximale Effizienz.',
    keywords: ['Firmenumzug', 'Büroumzug', 'Geschäftsumzug', 'Unternehmensumzug']
  },
  reinigung: {
    name: 'Endreinigung',
    slug: 'reinigung',
    description: 'Professionelle Umzugsreinigung mit Abnahmegarantie. Für eine sorgenfreie Wohnungsübergabe.',
    keywords: ['Umzugsreinigung', 'Endreinigung', 'Wohnungsreinigung', 'Übergabereinigung']
  },
  entsorgung: {
    name: 'Entsorgung & Räumung',
    slug: 'entsorgung',
    description: 'Komplette Haushaltsauflösungen und Entrümpelungen. Professionell und umweltgerecht.',
    keywords: ['Entrümpelung', 'Haushaltsauflösung', 'Räumung', 'Entsorgung']
  },
  lagerung: {
    name: 'Einlagerung',
    slug: 'einlagerung',
    description: 'Sichere Möbellagerung in klimatisierten Räumen. Flexibel und günstig.',
    keywords: ['Einlagerung', 'Möbellagerung', 'Lagerraum', 'Selfstorage']
  },
  moebellift: {
    name: 'Möbellift',
    slug: 'moebellift',
    description: 'Aussenlift-Service für schwere Möbel. Sicher und effizient über das Fenster.',
    keywords: ['Möbellift', 'Aussenlift', 'Möbelaufzug', 'Fassadenlift']
  },
  international: {
    name: 'Internationale Umzüge',
    slug: 'international',
    description: 'Weltweite Umzüge mit Zollabwicklung. Von der Schweiz in die ganze Welt.',
    keywords: ['internationaler Umzug', 'Auslandsumzug', 'Überseeumzug', 'Zollabwicklung']
  }
};

// Generate enhanced page meta for any page type
export function generateEnhancedMeta(
  pageType: 'home' | 'canton' | 'service' | 'company' | 'calculator' | 'blog' | 'about',
  params?: {
    canton?: string;
    service?: string;
    companyName?: string;
    articleTitle?: string;
    articleSlug?: string;
  }
): EnhancedPageMeta {
  const currentYear = new Date().getFullYear();
  
  switch (pageType) {
    case 'home':
      return {
        title: `Umzugscheck.ch – Umzugsfirmen vergleichen Schweiz | Bis zu 40% sparen ${currentYear}`,
        description: 'Kostenlose Umzugsofferten von 200+ geprüften Schweizer Umzugsfirmen. KI-Preisrechner, transparente Preise, echte Bewertungen. Jetzt vergleichen & sparen!',
        keywords: ['Umzug Schweiz', 'Umzugsfirma vergleichen', 'Umzugsofferte', 'Umzugskosten Rechner', 'günstige Umzugsfirma'],
        canonicalUrl: BASE_URL,
        ogImage: DEFAULT_OG_IMAGE,
        ogType: 'website',
        breadcrumbs: [{ name: 'Startseite', url: BASE_URL }],
        structuredData: [
          generateOrganizationSchema(),
          generateWebsiteSchema(),
          generateAggregateRatingSchema()
        ]
      };

    case 'canton':
      const cantonData = params?.canton ? cantonSeoData[params.canton] : null;
      if (!cantonData) {
        return generateEnhancedMeta('home');
      }
      return {
        title: `Umzugsfirmen ${cantonData.name} – Beste Angebote vergleichen ${currentYear}`,
        description: `Die besten Umzugsfirmen in ${cantonData.name} vergleichen. Geprüfte Partner, transparente Preise, echte Bewertungen. Jetzt kostenlos Offerten erhalten!`,
        keywords: cantonData.keywords,
        canonicalUrl: `${BASE_URL}/${cantonData.slug}`,
        ogImage: DEFAULT_OG_IMAGE,
        ogType: 'local_business',
        breadcrumbs: [
          { name: 'Startseite', url: BASE_URL },
          { name: 'Regionen', url: `${BASE_URL}/regionen` },
          { name: cantonData.name, url: `${BASE_URL}/${cantonData.slug}` }
        ],
        structuredData: [
          generateLocalBusinessSchema(cantonData.name, cantonData.mainCity),
          generateBreadcrumbSchema([
            { name: 'Startseite', url: BASE_URL },
            { name: 'Regionen', url: `${BASE_URL}/regionen` },
            { name: cantonData.name, url: `${BASE_URL}/${cantonData.slug}` }
          ])
        ]
      };

    case 'service':
      const serviceData = params?.service ? serviceSeoData[params.service] : null;
      if (!serviceData) {
        return generateEnhancedMeta('home');
      }
      return {
        title: `${serviceData.name} Schweiz – Preise & Anbieter vergleichen ${currentYear}`,
        description: serviceData.description,
        keywords: serviceData.keywords,
        canonicalUrl: `${BASE_URL}/dienstleistungen/${serviceData.slug}`,
        ogImage: DEFAULT_OG_IMAGE,
        ogType: 'product',
        breadcrumbs: [
          { name: 'Startseite', url: BASE_URL },
          { name: 'Dienstleistungen', url: `${BASE_URL}/dienstleistungen` },
          { name: serviceData.name, url: `${BASE_URL}/dienstleistungen/${serviceData.slug}` }
        ],
        structuredData: [
          generateServiceSchema(serviceData.name, serviceData.description),
          generateBreadcrumbSchema([
            { name: 'Startseite', url: BASE_URL },
            { name: 'Dienstleistungen', url: `${BASE_URL}/dienstleistungen` },
            { name: serviceData.name, url: `${BASE_URL}/dienstleistungen/${serviceData.slug}` }
          ])
        ]
      };

    case 'calculator':
      return {
        title: `Umzugskostenrechner Schweiz – Sofort Preise berechnen ${currentYear}`,
        description: 'Berechnen Sie Ihre Umzugskosten in 60 Sekunden. KI-gestützter Rechner basierend auf 25\'000+ analysierten Umzügen. Kostenlos und unverbindlich.',
        keywords: ['Umzugskostenrechner', 'Umzugskosten berechnen', 'Umzugspreise', 'Umzugsrechner Schweiz'],
        canonicalUrl: `${BASE_URL}/rechner`,
        ogImage: DEFAULT_OG_IMAGE,
        ogType: 'website',
        breadcrumbs: [
          { name: 'Startseite', url: BASE_URL },
          { name: 'Preisrechner', url: `${BASE_URL}/rechner` }
        ],
        structuredData: [
          generateSoftwareApplicationSchema(),
          generateBreadcrumbSchema([
            { name: 'Startseite', url: BASE_URL },
            { name: 'Preisrechner', url: `${BASE_URL}/rechner` }
          ])
        ]
      };

    case 'blog':
      return {
        title: params?.articleTitle 
          ? `${params.articleTitle} | Umzugscheck.ch Ratgeber`
          : `Umzugs-Ratgeber Schweiz – Tipps, Kosten & Checklisten ${currentYear}`,
        description: 'Praktische Tipps für Ihren Umzug in der Schweiz. Kostenübersichten, Checklisten, Spartipps und mehr von Experten.',
        keywords: ['Umzugstipps', 'Umzugscheckliste', 'Umzugskosten', 'Umzugsratgeber'],
        canonicalUrl: params?.articleSlug ? `${BASE_URL}/ratgeber/${params.articleSlug}` : `${BASE_URL}/ratgeber`,
        ogImage: DEFAULT_OG_IMAGE,
        ogType: params?.articleSlug ? 'article' : 'website',
        breadcrumbs: params?.articleSlug ? [
          { name: 'Startseite', url: BASE_URL },
          { name: 'Ratgeber', url: `${BASE_URL}/ratgeber` },
          { name: params.articleTitle || 'Artikel', url: `${BASE_URL}/ratgeber/${params.articleSlug}` }
        ] : [
          { name: 'Startseite', url: BASE_URL },
          { name: 'Ratgeber', url: `${BASE_URL}/ratgeber` }
        ],
        structuredData: [],
        publishedTime: new Date().toISOString(),
        author: 'Umzugscheck.ch Redaktion'
      };

    case 'about':
      return {
        title: 'Über uns – Umzugscheck.ch | Die Schweizer Umzugsplattform',
        description: 'Erfahren Sie mehr über Umzugscheck.ch – Ihr unabhängiges Vergleichsportal für Umzugsfirmen in der Schweiz. Unsere Mission: Transparenz im Umzugsmarkt.',
        keywords: ['über Umzugscheck', 'Umzugsvergleich Schweiz', 'Umzugsportal'],
        canonicalUrl: `${BASE_URL}/ueber-uns`,
        ogImage: DEFAULT_OG_IMAGE,
        ogType: 'website',
        breadcrumbs: [
          { name: 'Startseite', url: BASE_URL },
          { name: 'Über uns', url: `${BASE_URL}/ueber-uns` }
        ],
        structuredData: [generateOrganizationSchema()]
      };

    default:
      return generateEnhancedMeta('home');
  }
}

// Schema generators
function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Umzugscheck.ch',
    url: BASE_URL,
    logo: DEFAULT_OG_IMAGE,
    description: 'Die führende Schweizer Plattform für Umzugsvergleiche',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CH',
      addressLocality: 'Schweiz'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['German', 'French', 'Italian']
    },
    sameAs: []
  };
}

function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Umzugscheck.ch',
    url: BASE_URL,
    description: 'Die führende Schweizer Plattform für Umzugsvergleiche',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/firmen?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

function generateAggregateRatingSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'Organization',
      name: 'Umzugscheck.ch'
    },
    ratingValue: '4.8',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '15000'
  };
}

function generateLocalBusinessSchema(region: string, city: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Umzugsfirmen ${region}`,
    description: `Geprüfte Umzugsfirmen in ${region} vergleichen`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: region,
      addressCountry: 'CH'
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: region
    }
  };
}

function generateServiceSchema(serviceName: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: description,
    provider: {
      '@type': 'Organization',
      name: 'Umzugscheck.ch'
    },
    areaServed: {
      '@type': 'Country',
      name: 'Switzerland'
    }
  };
}

function generateSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Umzugskostenrechner',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CHF'
    }
  };
}

function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

// Generate FAQ schema
export function generateFAQSchema(questions: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  };
}

// Generate HowTo schema
export function generateHowToSchema(steps: { name: string; text: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Umzugsfirmen vergleichen und buchen',
    description: 'So finden Sie die beste Umzugsfirma für Ihren Umzug',
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text
    }))
  };
}
