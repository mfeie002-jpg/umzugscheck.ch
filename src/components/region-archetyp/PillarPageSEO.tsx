import { Helmet } from "react-helmet";

interface PillarPageSEOProps {
  totalCompanies: number;
  totalCantons: number;
  avgRating: number;
}

export const PillarPageSEO = ({ 
  totalCompanies, 
  totalCantons,
  avgRating 
}: PillarPageSEOProps) => {
  const title = "Umzugsfirmen Schweiz - Alle Kantone im Vergleich 2025";
  const description = `Finden Sie die beste Umzugsfirma in der Schweiz. ${totalCompanies}+ geprüfte Anbieter in ${totalCantons} Kantonen. Kostenlos Offerten vergleichen & bis zu 40% sparen.`;
  const canonicalUrl = "https://umzugscheck.ch/umzugsfirmen-schweiz";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "umzugscheck.ch",
    "url": "https://umzugscheck.ch",
    "description": "Schweizer Plattform für Umzugsfirmen-Vergleich",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://umzugscheck.ch/suche?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "umzugscheck.ch",
    "url": "https://umzugscheck.ch",
    "logo": "https://umzugscheck.ch/logo.png",
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["German", "French", "Italian"]
    }
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Umzugsfirmen nach Kanton",
    "description": `Liste aller ${totalCantons} Schweizer Kantone mit geprüften Umzugsfirmen`,
    "numberOfItems": totalCantons,
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Zürich", "url": "https://umzugscheck.ch/umzugsfirmen/zuerich" },
      { "@type": "ListItem", "position": 2, "name": "Bern", "url": "https://umzugscheck.ch/umzugsfirmen/bern" },
      { "@type": "ListItem", "position": 3, "name": "Basel-Stadt", "url": "https://umzugscheck.ch/umzugsfirmen/basel-stadt" },
      { "@type": "ListItem", "position": 4, "name": "Genf", "url": "https://umzugscheck.ch/umzugsfirmen/genf" },
      { "@type": "ListItem", "position": 5, "name": "Waadt", "url": "https://umzugscheck.ch/umzugsfirmen/waadt" }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://umzugscheck.ch"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Umzugsfirmen Schweiz",
        "item": canonicalUrl
      }
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Umzugsfirma Schweiz, Umzugsunternehmen Schweiz, Zügelfirma Schweiz, Umzug Schweiz, Umzugsfirmen Vergleich" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="de_CH" />
      <meta property="og:site_name" content="umzugscheck.ch" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Geo */}
      <meta name="geo.region" content="CH" />
      <meta name="geo.placename" content="Schweiz" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(itemListSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};
