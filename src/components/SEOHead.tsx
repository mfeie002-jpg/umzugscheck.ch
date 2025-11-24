import { Helmet } from "react-helmet";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
  structuredData?: object;
}

export const SEOHead = ({
  title = "Umzugscheck.ch - KI-Preisrechner für Ihren Umzug",
  description = "Vergleichen Sie Umzugsofferten mit unserem KI-Preisrechner. Transparent, fair und 100% schweizerisch. Erhalten Sie in Sekunden präzise Offerten von geprüften Umzugsfirmen.",
  keywords = "umzug, umzugsfirma, umzugsofferte, preisrechner, ki, schweiz, zürich, bern, basel",
  ogImage = "/lovable-uploads/1bdb4b13-ea35-4ded-a82e-4aa0714e0608.png",
  ogType = "website",
  canonical,
  noindex = false,
  structuredData,
}: SEOHeadProps) => {
  const siteUrl = "https://umzugscheck.ch";
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullOgImage = ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content="Umzugscheck.ch" />
      <meta property="og:locale" content="de_CH" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Additional Meta */}
      <meta name="author" content="Umzugscheck.ch" />
      <meta name="geo.region" content="CH" />
      <meta name="geo.placename" content="Switzerland" />
      <meta name="language" content="German" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Umzugscheck.ch",
          "url": siteUrl,
          "logo": fullOgImage,
          "description": description,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "CH"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["German", "French", "Italian"]
          }
        })}
      </script>
    </Helmet>
  );
};
