/**
 * Enhanced LocalBusiness Schema Component
 * 
 * For city/region pages - improves local search visibility
 * Google may show rich results with business info
 */

import { Helmet } from "react-helmet";
import { memo } from "react";

interface LocalBusinessSchemaEnhancedProps {
  name: string;
  description: string;
  cityName: string;
  cantonName?: string;
  image?: string;
  priceRange?: string;
  rating?: {
    value: number;
    count: number;
  };
  serviceArea?: string[];
}

export const LocalBusinessSchemaEnhanced = memo(function LocalBusinessSchemaEnhanced({
  name,
  description,
  cityName,
  cantonName,
  image = "https://umzugscheck.ch/og-image.jpg",
  priceRange = "CHF 400-3000",
  rating,
  serviceArea = []
}: LocalBusinessSchemaEnhancedProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "description": description,
    "image": image,
    "url": `https://umzugscheck.ch/${cityName.toLowerCase().replace(/\s+/g, '-')}`,
    "priceRange": priceRange,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": cantonName || cityName,
      "addressCountry": "CH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 47.3769, // Default to Zurich, should be dynamic
      "longitude": 8.5417
    },
    "areaServed": serviceArea.length > 0 ? serviceArea.map(area => ({
      "@type": "City",
      "name": area
    })) : {
      "@type": "City",
      "name": cityName
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Umzugsdienstleistungen",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Privatumzug"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Firmenumzug"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Endreinigung"
          }
        }
      ]
    },
    ...(rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating.value,
        "reviewCount": rating.count,
        "bestRating": 5,
        "worstRating": 1
      }
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
});

export default LocalBusinessSchemaEnhanced;
