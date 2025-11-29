import { Helmet } from "react-helmet";

interface OptimizedSEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  schemaMarkup?: object;
}

export const OptimizedSEO = ({
  title,
  description,
  canonicalUrl,
  keywords,
  ogImage = "https://umzugscheck.ch/og-image.jpg",
  ogType = "website",
  schemaMarkup
}: OptimizedSEOProps) => {
  const fullTitle = title.includes("umzugscheck.ch") ? title : `${title} | umzugscheck.ch`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="umzugscheck.ch" />
      <meta property="og:locale" content="de_CH" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="German" />
      <meta name="geo.region" content="CH" />
      <meta name="geo.placename" content="Switzerland" />
      
      {/* Schema.org Markup */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
    </Helmet>
  );
};
