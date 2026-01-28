import { Helmet } from 'react-helmet';

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
  ogImage = 'https://umzugscheck.ch/og-image.jpg',
  ogType = 'website',
  noindex = false,
  keywords,
  city,
  structuredData
}: EnhancedSEOProps) => {
  const fullTitle = title.includes('Umzugscheck') ? title : `${title} | Umzugscheck.ch`;
  const baseUrl = 'https://umzugscheck.ch';
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : undefined;
  
  const defaultKeywords = city 
    ? `umzugsfirma ${city.toLowerCase()}, umzug ${city.toLowerCase()}, umzugsunternehmen ${city.toLowerCase()}`
    : 'umzugsfirma schweiz, umzug schweiz, umzugsunternehmen, privatumzug, büroumzug';
  
  const metaKeywords = keywords || defaultKeywords;

  const localBusinessSchema = city ? {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "MovingCompany"],
    "name": `Umzugscheck ${city}`,
    "description": `Umzugsvergleich in ${city} - Ihr Partner für günstige Umzüge.`,
    "url": canonicalUrl,
    "telephone": "+41 44 567 89 00",
    "email": "info@umzugscheck.ch",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressCountry": "CH"
    },
    "areaServed": {
      "@type": "City",
      "name": city
    }
  } : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={metaKeywords} />
      
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      <html lang="de-CH" />
      
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Umzugscheck.ch" />
      <meta property="og:locale" content="de_CH" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {(localBusinessSchema || structuredData) && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData || localBusinessSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default EnhancedSEO;
