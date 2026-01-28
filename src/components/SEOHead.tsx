import { Helmet } from "react-helmet";
import { generateMetaData, generateOGTags } from "@/lib/seo-meta";
import { generatePageSchemas, generateSchemaScript } from "@/lib/schema-markup";
import { getKeywordsForPage } from "@/lib/seo-keywords";

export interface SEOHeadProps {
  // New unified API
  pageType?: 'home' | 'service' | 'city' | 'city-service' | 'main-page';
  city?: string;
  service?: string;
  pageName?: string;
  url?: string;
  faqs?: Array<{ question: string; answer: string }>;
  companies?: Array<{ name: string; rating?: number; reviewCount?: number }>;
  // Legacy API support
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  structuredData?: any;
}

/**
 * Unified SEO Head Component
 * Automatically generates:
 * - Meta title & description
 * - OpenGraph tags
 * - Twitter Card tags
 * - Schema.org JSON-LD
 * - Keywords
 * - Canonical URL
 */
export const SEOHead = ({ 
  pageType = 'home', 
  city, 
  service, 
  pageName, 
  url, 
  faqs, 
  companies,
  // Legacy props
  title: legacyTitle,
  description: legacyDescription,
  canonical: legacyCanonical,
  keywords: legacyKeywords,
  structuredData: legacyStructuredData
}: SEOHeadProps) => {
  // Use legacy props if provided (backwards compatibility)
  const effectiveUrl = url || legacyCanonical || 'https://umzugscheck.ch';
  
  // Generate meta data (or use legacy)
  const metaData = legacyTitle 
    ? { title: legacyTitle, description: legacyDescription || '' }
    : generateMetaData({ 
        type: pageType, 
        city, 
        service, 
        pageName 
      });

  // Generate OG tags
  const ogTags = generateOGTags(metaData, effectiveUrl);

  // Generate keywords
  const keywordsArray = legacyKeywords 
    ? legacyKeywords.split(',').map(k => k.trim())
    : getKeywordsForPage(
        pageType === 'main-page' ? pageName || 'home' : pageType,
        city,
        service
      );

  // Generate structured data - map pageType for schema generation
  const schemaPageType = pageType === 'main-page' 
    ? (pageName as 'offerten' | 'preise' | 'vergleich' | 'faq' || 'home')
    : pageType as 'home' | 'service' | 'city' | 'city-service';
    
  const schemas = legacyStructuredData 
    ? (Array.isArray(legacyStructuredData) ? legacyStructuredData : [legacyStructuredData])
    : generatePageSchemas(
        { type: schemaPageType, city, service, url: effectiveUrl },
        faqs,
        companies
      );
  const schemaScript = generateSchemaScript(schemas);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metaData.title}</title>
      <meta name="description" content={metaData.description} />
      <link rel="canonical" href={effectiveUrl} />
      <meta name="keywords" content={keywordsArray.join(', ')} />

      {/* OpenGraph Tags */}
      <meta property="og:title" content={ogTags['og:title']} />
      <meta property="og:description" content={ogTags['og:description']} />
      <meta property="og:type" content={ogTags['og:type']} />
      <meta property="og:url" content={ogTags['og:url']} />
      <meta property="og:image" content={ogTags['og:image']} />
      <meta property="og:site_name" content="umzugscheck.ch" />
      <meta property="og:locale" content="de_CH" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={ogTags['twitter:card']} />
      <meta name="twitter:title" content={ogTags['twitter:title']} />
      <meta name="twitter:description" content={ogTags['twitter:description']} />
      <meta name="twitter:image" content={ogTags['twitter:image']} />
      <meta name="twitter:site" content="@umzugscheck" />

      {/* Additional SEO Meta */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content="de-CH" />
      <meta name="geo.region" content="CH" />
      <meta name="geo.placename" content="Switzerland" />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {schemaScript}
      </script>
    </Helmet>
  );
};

export default SEOHead;
