interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  type?: 'website' | 'article' | 'product';
}

export const generateSEOTags = (data: SEOData) => {
  return {
    title: data.title,
    meta: [
      { name: 'description', content: data.description },
      { name: 'keywords', content: data.keywords?.join(', ') || '' },
      { property: 'og:title', content: data.title },
      { property: 'og:description', content: data.description },
      { property: 'og:type', content: data.type || 'website' },
      { property: 'og:image', content: data.ogImage || '/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: data.title },
      { name: 'twitter:description', content: data.description },
    ],
    link: data.canonicalUrl ? [{ rel: 'canonical', href: data.canonicalUrl }] : []
  };
};

export const generateCantonSEO = (cantonName: string, companyCount: number) => {
  return generateSEOTags({
    title: `Umzugsfirmen in ${cantonName} vergleichen (${companyCount} Anbieter) | Umzugscheck.ch`,
    description: `${companyCount} geprüfte Umzugsfirmen in ${cantonName} kostenlos vergleichen. Transparente Preise, echte Bewertungen und unverbindliche Offerten in 2 Minuten.`,
    keywords: [`Umzugsfirmen ${cantonName}`, `Umzug ${cantonName}`, 'Umzugskosten', 'Umzugsofferten'],
    type: 'website'
  });
};

export const generateCitySEO = (cityName: string, cantonName: string) => {
  return generateSEOTags({
    title: `Umzug ${cityName} - Günstige Umzugsfirmen vergleichen | Umzugscheck.ch`,
    description: `Umzug in ${cityName}, ${cantonName}: Finden Sie die beste Umzugsfirma. Kostenloser Vergleich, faire Preise und echte Kundenbewertungen.`,
    keywords: [`Umzug ${cityName}`, `Umzugsfirma ${cityName}`, `Umzugskosten ${cityName}`],
    type: 'website'
  });
};

export const generateServiceSEO = (serviceName: string, cityName?: string) => {
  const location = cityName ? ` in ${cityName}` : ' in der Schweiz';
  return generateSEOTags({
    title: `${serviceName}${location} - Professionelle Anbieter vergleichen | Umzugscheck.ch`,
    description: `Professionelle ${serviceName}${location}: Kostenlose Offerten von geprüften Anbietern. Faire Preise, schnelle Termine, 100% unverbindlich.`,
    keywords: [serviceName, `${serviceName}${location}`, `${serviceName} Kosten`, `${serviceName} Offerten`],
    type: 'website'
  });
};

export const generateBlogPostSEO = (title: string, excerpt: string, slug: string) => {
  return generateSEOTags({
    title: `${title} | Umzugscheck.ch Ratgeber`,
    description: excerpt,
    canonicalUrl: `https://umzugscheck.ch/blog/${slug}`,
    type: 'article'
  });
};

export const generateStructuredData = {
  organization: () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Umzugscheck.ch',
    url: 'https://umzugscheck.ch',
    logo: 'https://umzugscheck.ch/logo.png',
    description: 'Die führende Schweizer Vergleichsplattform für Umzugsdienstleistungen',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CH'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['de', 'fr', 'it']
    }
  }),

  service: (serviceName: string, description: string) => ({
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
  }),

  localBusiness: (company: any) => ({
    '@context': 'https://schema.org',
    '@type': 'MovingCompany',
    name: company.name,
    description: company.description,
    image: company.logo,
    telephone: company.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: company.city,
      addressCountry: 'CH'
    },
    aggregateRating: company.rating ? {
      '@type': 'AggregateRating',
      ratingValue: company.rating,
      reviewCount: company.review_count
    } : undefined,
    priceRange: company.price_level
  }),

  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }),

  faq: (questions: Array<{ question: string; answer: string }>) => ({
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
  })
};
