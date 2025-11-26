import { Helmet } from "react-helmet";
import { generateMetaData, generateOGTags } from "@/lib/seo-meta";
import { generatePageSchemas, generateSchemaScript } from "@/lib/schema-markup";
import { getKeywordsForPage } from "@/lib/seo-keywords";

interface SEOHeadProps {
  pageType: 'home' | 'service' | 'city' | 'city-service' | 'main-page';
  city?: string;
  service?: string;
  pageName?: string;
  url: string;
  faqs?: Array<{ question: string; answer: string }>;
  companies?: Array<{ name: string; rating?: number; reviewCount?: number }>;
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
export const SEOHead = ({ pageType, city, service, pageName, url, faqs, companies }: SEOHeadProps) => {
  // Generate meta data
  const metaData = generateMetaData({ 
    type: pageType, 
    city, 
    service, 
    pageName 
  });

  // Generate OG tags
  const ogTags = generateOGTags(metaData, url);

  // Generate keywords
  const keywords = getKeywordsForPage(
    pageType === 'main-page' ? pageName || 'home' : pageType,
    city,
    service
  );

  // Generate structured data - map pageType for schema generation
  const schemaPageType = pageType === 'main-page' 
    ? (pageName as 'offerten' | 'preise' | 'vergleich' | 'faq' || 'home')
    : pageType as 'home' | 'service' | 'city' | 'city-service';
    
  const schemas = generatePageSchemas(
    { type: schemaPageType, city, service, url },
    faqs,
    companies
  );
  const schemaScript = generateSchemaScript(schemas);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metaData.title}</title>
      <meta name="description" content={metaData.description} />
      <link rel="canonical" href={url} />
      <meta name="keywords" content={keywords.join(', ')} />

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
