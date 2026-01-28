import { Helmet } from 'react-helmet-async';

interface EnhancedSEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'local_business';
  noindex?: boolean;
  keywords?: string;
  city?: string;
  structuredData?: object;
}

const EnhancedSEO = ({
  title,
  description,
  canonical,
  ogImage = 'https://feierabend-umzuege.ch/og-image.jpg',
  ogType = 'website',
  noindex = false,
  keywords,
  city,
  structuredData
}: EnhancedSEOProps) => {
  const fullTitle = title.includes('Feierabend') ? title : `${title} | Feierabend Umzüge`;
  const baseUrl = 'https://feierabend-umzuege.ch';
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : undefined;
  
  const defaultKeywords = city 
    ? `umzugsfirma ${city.toLowerCase()}, umzug ${city.toLowerCase()}, umzugsunternehmen ${city.toLowerCase()}, privatumzug ${city.toLowerCase()}, büroumzug ${city.toLowerCase()}`
    : 'umzugsfirma zürich, umzug schweiz, umzugsunternehmen, privatumzug, büroumzug, seniorenumzug';
  
  const metaKeywords = keywords || defaultKeywords;

  const localBusinessSchema = city ? {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "MovingCompany"],
    "name": `Feierabend Umzüge ${city}`,
    "description": `Premium Umzugsservice in ${city} - Ihr zuverlässiger Partner für Privat- und Büroumzüge.`,
    "url": canonicalUrl,
    "telephone": "+41 76 568 13 02",
    "email": "info@feierabend-umzuege.ch",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressCountry": "CH"
    },
    "areaServed": {
      "@type": "City",
      "name": city
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "247",
      "bestRating": "5",
      "worstRating": "1"
    }
  } : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content="Feierabend Umzüge" />
      
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      <html lang="de-CH" />
      <meta httpEquiv="content-language" content="de-CH" />
      
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#1e3a5f" />
      
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Feierabend Umzüge" />
      <meta property="og:locale" content="de_CH" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {city && (
        <>
          <meta name="geo.region" content="CH" />
          <meta name="geo.placename" content={city} />
        </>
      )}
      
      {(localBusinessSchema || structuredData) && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData || localBusinessSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default EnhancedSEO;
