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

export const generateBlogPostSEO = (title: string, excerpt: string, slug: string) => {
  return generateSEOTags({
    title: `${title} | Umzugscheck.ch Ratgeber`,
    description: excerpt,
    canonicalUrl: `https://umzugscheck.ch/blog/${slug}`,
    type: 'article'
  });
};
