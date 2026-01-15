/**
 * Enhanced Service Schema Component
 * 
 * JSON-LD for service pages - improves service-related searches
 */

import { Helmet } from "react-helmet";
import { memo } from "react";

interface ServiceSchemaEnhancedProps {
  serviceName: string;
  description: string;
  provider?: string;
  areaServed?: string[];
  priceRange?: {
    min: number;
    max: number;
    currency?: string;
  };
  image?: string;
  rating?: {
    value: number;
    count: number;
  };
}

export const ServiceSchemaEnhanced = memo(function ServiceSchemaEnhanced({
  serviceName,
  description,
  provider = "Umzugscheck.ch",
  areaServed = ["Schweiz"],
  priceRange,
  image = "https://umzugscheck.ch/og-image.jpg",
  rating
}: ServiceSchemaEnhancedProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": description,
    "image": image,
    "provider": {
      "@type": "Organization",
      "name": provider,
      "url": "https://umzugscheck.ch"
    },
    "areaServed": areaServed.map(area => ({
      "@type": area === "Schweiz" ? "Country" : "AdministrativeArea",
      "name": area
    })),
    "serviceType": "Moving Services",
    ...(priceRange && {
      "offers": {
        "@type": "Offer",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "minPrice": priceRange.min,
          "maxPrice": priceRange.max,
          "priceCurrency": priceRange.currency || "CHF"
        }
      }
    }),
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

export default ServiceSchemaEnhanced;
