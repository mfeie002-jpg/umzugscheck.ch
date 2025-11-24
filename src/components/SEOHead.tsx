import { Helmet } from "react-helmet";
import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  schema?: any;
  keywords?: string;
  noindex?: boolean;
}

export const SEOHead = ({
  title,
  description,
  canonical,
  ogImage = "/og-image.jpg",
  ogType = "website",
  schema,
  keywords,
  noindex = false
}: SEOHeadProps) => {
  const fullTitle = `${title} | Umzugscheck.ch`;
  const siteUrl = "https://umzugscheck.ch";
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;

  useEffect(() => {
    if (schema && typeof document !== 'undefined') {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
      
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [schema]);

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonical} />
      
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="Umzugscheck.ch" />
      <meta property="og:locale" content="de_CH" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Additional SEO */}
      <meta name="language" content="de-CH" />
      <meta name="geo.region" content="CH" />
      <meta name="geo.placename" content="Switzerland" />
    </Helmet>
  );
};
