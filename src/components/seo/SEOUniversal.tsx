/**
 * Universal SEO Component
 * Consistent meta tags across all pages
 */
import { memo } from "react";
import { Helmet } from "react-helmet";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
  noIndex?: boolean;
  city?: string;
  service?: string;
  schema?: object;
  keywords?: string[];
}

// Base URL for canonical links
const BASE_URL = 'https://umzugscheck.ch';

// Default OG image
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

export const SEOUniversal = memo(function SEOUniversal({
  title,
  description,
  canonical,
  type = 'website',
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  city,
  service = 'Umzug',
  schema,
  keywords = []
}: SEOProps) {
  // Build full title with branding
  const fullTitle = title.includes('Umzugscheck') 
    ? title 
    : `${title} | Umzugscheck.ch`;
  
  // Ensure description is under 160 chars
  const metaDescription = description.length > 157 
    ? `${description.substring(0, 157)}...` 
    : description;
  
  // Build canonical URL
  const canonicalUrl = canonical 
    ? (canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical}`)
    : undefined;
  
  // Build keywords string
  const keywordsString = [
    'Umzug Schweiz',
    'Umzugsfirma vergleichen',
    'Umzugsofferten',
    ...keywords,
    city && `Umzug ${city}`,
    service && `${service} Schweiz`
  ].filter(Boolean).join(', ');
  
  // Local business schema for city pages
  const localBusinessSchema = city ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Umzugscheck.ch - ${city}`,
    "description": metaDescription,
    "url": canonicalUrl,
    "areaServed": {
      "@type": "City",
      "name": city
    },
    "serviceType": service
  } : null;
  
  return (
    <Helmet>
      {/* Core Meta */}
      <html lang="de-CH" />
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywordsString} />
      
      {/* Robots */}
      <meta 
        name="robots" 
        content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} 
      />
      
      {/* Canonical */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="de_CH" />
      <meta property="og:site_name" content="Umzugscheck.ch" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Theme */}
      <meta name="theme-color" content="#0050A8" />
      
      {/* Preconnects */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
      
      {localBusinessSchema && (
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      )}
    </Helmet>
  );
});

// Predefined SEO configs for common page types
export const getSEOConfig = {
  home: () => ({
    title: 'Umzugsfirmen vergleichen Schweiz 2025 – Kostenlos Offerten erhalten',
    description: 'Kostenlose Umzugsofferten von 200+ geprüften Schweizer Umzugsfirmen. Smart-Preisrechner, transparente Preise, echte Bewertungen. Jetzt vergleichen & bis zu 40% sparen!',
    canonical: '/',
    keywords: ['Umzugsvergleich', 'kostenlos', 'Offerten', 'Preisrechner']
  }),
  
  cityPage: (city: string, canton?: string) => ({
    title: `Umzugsfirmen ${city} vergleichen – Beste Anbieter ${new Date().getFullYear()}`,
    description: `Die besten Umzugsfirmen in ${city}${canton ? ` (${canton})` : ''} vergleichen. Geprüfte Anbieter, transparente Preise. Jetzt kostenlos bis zu 5 Offerten erhalten.`,
    canonical: `/umzugsfirmen/${city.toLowerCase().replace(/\s+/g, '-')}`,
    city,
    keywords: [`Umzugsfirma ${city}`, `Umzug ${city}`, canton ? `Umzug ${canton}` : ''].filter(Boolean)
  }),
  
  servicePage: (service: string, description: string) => ({
    title: `${service} Schweiz – Professionell & günstig`,
    description,
    canonical: `/services/${service.toLowerCase().replace(/\s+/g, '-')}`,
    service,
    keywords: [service, `${service} Schweiz`, `${service} günstig`]
  }),
  
  calculatorPage: () => ({
    title: 'Umzugsrechner Schweiz – Kosten sofort berechnen',
    description: 'Berechnen Sie Ihre Umzugskosten in 2 Minuten. Unser Smart-Rechner zeigt Ihnen sofort realistische Preise basierend auf aktuellen Marktdaten.',
    canonical: '/umzugsrechner',
    keywords: ['Umzugsrechner', 'Umzugskosten berechnen', 'Preiskalkulator']
  }),
  
  offerPage: () => ({
    title: 'Kostenlose Umzugsofferten erhalten – In 2 Minuten',
    description: 'Erhalten Sie bis zu 5 kostenlose Offerten von geprüften Schweizer Umzugsfirmen. Unverbindlich, transparent und schnell. Jetzt starten!',
    canonical: '/umzugsofferten',
    keywords: ['Umzugsofferten', 'kostenlos', 'vergleichen', 'unverbindlich']
  })
};

export default SEOUniversal;
