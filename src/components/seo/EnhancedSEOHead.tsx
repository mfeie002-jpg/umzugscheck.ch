import { Helmet } from 'react-helmet';
import { useEnhancedSEO } from '@/hooks/useEnhancedSEO';
import type { EnhancedPageMeta } from '@/lib/seo-enhanced';

interface EnhancedSEOHeadProps {
  pageType: 'home' | 'canton' | 'service' | 'company' | 'calculator' | 'blog' | 'about';
  params?: {
    canton?: string;
    service?: string;
    companyName?: string;
    articleTitle?: string;
    articleSlug?: string;
  };
  customMeta?: Partial<EnhancedPageMeta>;
  children?: React.ReactNode;
}

export function EnhancedSEOHead({ pageType, params, customMeta, children }: EnhancedSEOHeadProps) {
  const meta = useEnhancedSEO({ pageType, params, customMeta });

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{meta.title}</title>
      <meta name="title" content={meta.title} />
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords.join(', ')} />
      <meta name="author" content={meta.author || 'Umzugscheck.ch'} />
      <link rel="canonical" href={meta.canonicalUrl} />

      {/* Geographic Meta Tags */}
      <meta name="geo.region" content="CH" />
      <meta name="geo.placename" content="Schweiz" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={meta.ogType} />
      <meta property="og:url" content={meta.canonicalUrl} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="de_CH" />
      <meta property="og:site_name" content="Umzugscheck.ch" />

      {/* Article specific */}
      {meta.publishedTime && (
        <meta property="article:published_time" content={meta.publishedTime} />
      )}
      {meta.modifiedTime && (
        <meta property="article:modified_time" content={meta.modifiedTime} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={meta.canonicalUrl} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.ogImage} />

      {/* Alternate URLs for multilingual support */}
      {meta.alternateUrls?.map(alt => (
        <link key={alt.lang} rel="alternate" hrefLang={alt.lang} href={alt.url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={meta.canonicalUrl} />

      {/* Structured Data */}
      {meta.structuredData.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}

      {children}
    </Helmet>
  );
}

export default EnhancedSEOHead;
