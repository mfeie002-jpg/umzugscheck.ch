// Schema.org JSON-LD Generation System for umzugscheck.ch

interface SchemaPage {
  type: 'home' | 'service' | 'city' | 'city-service' | 'faq' | 'offerten' | 'preise' | 'vergleich';
  city?: string;
  service?: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface CompanyItem {
  name: string;
  rating?: number;
  reviewCount?: number;
}

// Global schemas applied site-wide
export function generateGlobalSchemas() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "umzugscheck.ch",
      "url": "https://www.umzugscheck.ch",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.umzugscheck.ch/suche?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "umzugscheck.ch",
      "url": "https://www.umzugscheck.ch",
      "logo": "https://www.umzugscheck.ch/assets/umzugscheck-logo.png",
      "description": "Schweizer Vergleichsportal für Umzugsfirmen",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "areaServed": "CH",
        "availableLanguage": ["de", "fr", "it"]
      }
    }
  ];
}

// Generate breadcrumb schema based on URL path
export function generateBreadcrumbSchema(url: string, pageTitle: string) {
  const urlParts = url.replace('https://www.umzugscheck.ch', '').split('/').filter(Boolean);
  
  const items = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Startseite",
      "item": "https://www.umzugscheck.ch/"
    }
  ];

  let currentPath = 'https://www.umzugscheck.ch';
  urlParts.forEach((part, index) => {
    currentPath += `/${part}`;
    const isLast = index === urlParts.length - 1;
    
    items.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": isLast ? pageTitle : part.charAt(0).toUpperCase() + part.slice(1),
      "item": isLast ? url : currentPath
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items
  };
}

// Homepage schema
export function generateHomepageSchema() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Umzugsvergleich Schweiz",
      "url": "https://www.umzugscheck.ch/",
      "description": "Vergleiche geprüfte Umzugsfirmen in der Schweiz. Gratis Offerten, 4.8 Sterne, 15'000+ Umzüge.",
      "inLanguage": "de-CH",
      "about": {
        "@type": "Service",
        "name": "Umzugsvergleich",
        "areaServed": "CH"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "So funktioniert der Umzugsvergleich",
      "description": "In drei Schritten zu deinen Umzugsofferten.",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Anfrage ausfüllen",
          "text": "Beschreibe deinen Umzug in 2 Minuten"
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Umzugsfirmen vergleichen",
          "text": "Erhalte kostenlose Offerten von geprüften Anbietern"
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Beste Offerte wählen",
          "text": "Entscheide dich für das beste Angebot"
        }
      ]
    }
  ];
}

// Service page schema
export function generateServiceSchema(service: string, serviceDisplayName: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${serviceDisplayName} in der Schweiz`,
    "serviceType": serviceDisplayName,
    "provider": {
      "@type": "Organization",
      "name": "umzugscheck.ch"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Schweiz"
    },
    "url": url,
    "description": description
  };
}

// City page schema
export function generateCitySchema(city: string, cityDisplayName: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Umzugsfirmen in ${cityDisplayName}`,
    "url": url,
    "description": description,
    "inLanguage": "de-CH"
  };
}

// City × Service schema
export function generateCityServiceSchema(
  city: string,
  cityDisplayName: string,
  service: string,
  serviceDisplayName: string,
  description: string,
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${serviceDisplayName} in ${cityDisplayName}`,
    "serviceType": serviceDisplayName,
    "provider": {
      "@type": "Organization",
      "name": "umzugscheck.ch"
    },
    "areaServed": {
      "@type": "City",
      "name": cityDisplayName
    },
    "url": url,
    "description": description
  };
}

// Company ItemList schema for city pages
export function generateCompanyListSchema(city: string, cityDisplayName: string, companies: CompanyItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Umzugsfirmen in ${cityDisplayName}`,
    "itemListElement": companies.map((company, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": company.name,
        "provider": {
          "@type": "LocalBusiness",
          "name": company.name
        },
        "areaServed": cityDisplayName,
        ...(company.rating && {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": company.rating,
            "reviewCount": company.reviewCount || 0
          }
        })
      }
    }))
  };
}

// FAQ schema
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// HowTo schema for process explanations
export function generateHowToSchema(name: string, description: string, steps: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step
    }))
  };
}

// Main schema generator
export function generatePageSchemas(pageData: SchemaPage, faqs?: FAQItem[], companies?: CompanyItem[]) {
  const schemas = [...generateGlobalSchemas()];

  // Add breadcrumbs for non-homepage
  if (pageData.type !== 'home') {
    const pageTitle = getPageTitle(pageData);
    schemas.push(generateBreadcrumbSchema(pageData.url, pageTitle));
  }

  // Add page-specific schemas
  switch (pageData.type) {
    case 'home':
      schemas.push(...generateHomepageSchema());
      break;

    case 'service':
      if (pageData.service) {
        const serviceName = getServiceDisplayName(pageData.service);
        const description = getServiceDescription(pageData.service);
        schemas.push(generateServiceSchema(pageData.service, serviceName, description, pageData.url));
        
        // Add HowTo for service pages
        schemas.push(generateHowToSchema(
          `So funktioniert ${serviceName}`,
          `In drei Schritten zu deiner ${serviceName}-Offerte`,
          ["Anfrage stellen", "Anbieter vergleichen", "Beste Offerte wählen"]
        ));
      }
      break;

    case 'city':
      if (pageData.city) {
        const cityName = getCityDisplayName(pageData.city);
        const description = `Vergleiche geprüfte Umzugsfirmen in ${cityName}. Kostenlose Offerten und lokale Profis.`;
        schemas.push(generateCitySchema(pageData.city, cityName, description, pageData.url));
        
        // Add company list if available
        if (companies && companies.length > 0) {
          schemas.push(generateCompanyListSchema(pageData.city, cityName, companies));
        }
      }
      break;

    case 'city-service':
      if (pageData.city && pageData.service) {
        const cityName = getCityDisplayName(pageData.city);
        const serviceName = getServiceDisplayName(pageData.service);
        const description = `Top Anbieter für ${serviceName} in ${cityName} vergleichen. Kostenlose Offerten, regionale Profis, schnelle Termine.`;
        schemas.push(generateCityServiceSchema(
          pageData.city,
          cityName,
          pageData.service,
          serviceName,
          description,
          pageData.url
        ));
      }
      break;

    case 'offerten':
      schemas.push(generateHowToSchema(
        "So erhältst du Umzugsofferten",
        "In drei Schritten zu kostenlosen Umzugsangeboten",
        ["Anfrage ausfüllen", "Offerten vergleichen", "Firma auswählen"]
      ));
      break;

    case 'vergleich':
      schemas.push(generateHowToSchema(
        "Umzugsfirmen richtig vergleichen",
        "So findest du die beste Umzugsfirma",
        ["Bewertungen prüfen", "Preise vergleichen", "Verfügbarkeit checken"]
      ));
      break;
  }

  // Add FAQ schema if available
  if (faqs && faqs.length > 0) {
    schemas.push(generateFAQSchema(faqs));
  }

  return schemas;
}

// Helper functions
function getPageTitle(pageData: SchemaPage): string {
  if (pageData.type === 'city' && pageData.city) {
    return `Umzugsfirmen in ${getCityDisplayName(pageData.city)}`;
  }
  if (pageData.type === 'service' && pageData.service) {
    return getServiceDisplayName(pageData.service);
  }
  if (pageData.type === 'city-service' && pageData.city && pageData.service) {
    return `${getServiceDisplayName(pageData.service)} in ${getCityDisplayName(pageData.city)}`;
  }
  return 'umzugscheck.ch';
}

function getCityDisplayName(citySlug: string): string {
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
  return cityNames[citySlug] || citySlug;
}

function getServiceDisplayName(serviceSlug: string): string {
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
  return serviceNames[serviceSlug] || serviceSlug;
}

function getServiceDescription(serviceSlug: string): string {
  const descriptions: Record<string, string> = {
    'umzug': 'Professionelle Umzugsdienstleistungen in der ganzen Schweiz',
    'reinigung': 'Endreinigung mit Abnahmegarantie für stressfreien Auszug',
    'raeumung': 'Wohnungs- und Hausräumungen fachgerecht durchgeführt',
    'firmenumzug': 'Büro- und Firmenumzüge mit professioneller Planung',
    'transport': 'Möbeltransport und Kleintransporte schweizweit',
    'lagerung': 'Sichere Möbellagerung und Selfstorage-Lösungen',
    'entsorgung': 'Umweltgerechte Entsorgung und Sperrgut-Abholung',
    'umzug-mit-reinigung': 'Umzug und Endreinigung aus einer Hand'
  };
  return descriptions[serviceSlug] || '';
}

// Combine all schemas into single JSON-LD script
export function generateSchemaScript(schemas: any[]): string {
  // If multiple schemas, use @graph
  if (schemas.length === 1) {
    return JSON.stringify(schemas[0], null, 2);
  }
  
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": schemas
  }, null, 2);
}
