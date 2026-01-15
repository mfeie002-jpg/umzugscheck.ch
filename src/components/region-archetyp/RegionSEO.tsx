import { Helmet } from "react-helmet";

interface RegionSEOProps {
  canton: string;
  cantonCode: string;
  companiesCount: number;
  avgRating: number;
  reviewCount: number;
}

export const RegionSEO = ({ 
  canton, 
  cantonCode, 
  companiesCount, 
  avgRating, 
  reviewCount 
}: RegionSEOProps) => {
  const title = `Umzugsfirmen ${canton} - ${companiesCount}+ geprüfte Anbieter vergleichen`;
  const description = `Finden Sie die besten Umzugsfirmen in ${canton}. ${companiesCount}+ geprüfte Anbieter, Ø ${avgRating.toFixed(1)} Sterne aus ${reviewCount}+ Bewertungen. Kostenlos Offerten vergleichen & bis zu 40% sparen.`;
  const canonicalUrl = `https://umzugscheck.ch/umzugsfirmen/${cantonCode.toLowerCase()}`;
  
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Umzugsfirmen ${canton}`,
    "description": description,
    "url": canonicalUrl,
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": canton,
      "addressCountry": "CH"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating.toFixed(1),
      "reviewCount": reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    }
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
        "item": "https://umzugscheck.ch/umzugsfirmen-schweiz"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `Umzugsfirmen ${canton}`,
        "item": canonicalUrl
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Was kostet ein Umzug in ${canton}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Die Kosten für einen Umzug in ${canton} variieren je nach Wohnungsgrösse und Distanz. Für eine 3-Zimmer-Wohnung rechnen Sie mit CHF 800-2'500. Vergleichen Sie kostenlos Offerten um bis zu 40% zu sparen.`
        }
      },
      {
        "@type": "Question",
        "name": `Welche Umzugsfirma ist die beste in ${canton}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Auf umzugscheck.ch finden Sie ${companiesCount}+ geprüfte Umzugsfirmen in ${canton} mit einer durchschnittlichen Bewertung von ${avgRating.toFixed(1)} Sternen. Vergleichen Sie Preise und Bewertungen um die beste Firma für Ihren Umzug zu finden.`
        }
      }
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={`Umzugsfirma ${canton}, Umzug ${canton}, Umzugsunternehmen ${canton}, Zügelfirma ${canton}, Umzugskosten ${canton}`} />
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
      <meta name="geo.region" content={`CH-${cantonCode}`} />
      <meta name="geo.placename" content={canton} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};
