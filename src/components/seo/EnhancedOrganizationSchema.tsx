/**
 * Enhanced Organization Schema
 * Comprehensive JSON-LD for Umzugscheck.ch
 */

import { Helmet } from "react-helmet";
import { memo } from "react";

interface OrganizationSchemaProps {
  includeLocalBusiness?: boolean;
}

export const EnhancedOrganizationSchema = memo(function EnhancedOrganizationSchema({
  includeLocalBusiness = true
}: OrganizationSchemaProps) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://umzugscheck.ch/#organization",
    "name": "Umzugscheck.ch",
    "alternateName": "Umzugscheck Schweiz",
    "url": "https://umzugscheck.ch",
    "logo": {
      "@type": "ImageObject",
      "url": "https://umzugscheck.ch/logo.png",
      "width": 200,
      "height": 60
    },
    "description": "Die führende Schweizer Plattform für Umzugsvergleiche. Kostenlos Offerten von geprüften Umzugsfirmen erhalten und bis zu 40% sparen.",
    "foundingDate": "2024",
    "foundingLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "CH"
      }
    },
    "areaServed": {
      "@type": "Country",
      "name": "Schweiz"
    },
    "serviceType": [
      "Umzugsvergleich",
      "Umzugsofferten",
      "Umzugsfirmen Vermittlung",
      "Reinigungsservice Vermittlung",
      "Entsorgungsservice Vermittlung"
    ],
    "sameAs": [
      "https://www.facebook.com/umzugscheck",
      "https://www.instagram.com/umzugscheck",
      "https://www.linkedin.com/company/umzugscheck"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["German", "French", "Italian", "English"],
        "areaServed": "CH"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://umzugscheck.ch/#localbusiness",
    "name": "Umzugscheck.ch",
    "image": "https://umzugscheck.ch/og-image.jpg",
    "url": "https://umzugscheck.ch",
    "priceRange": "CHF",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CH",
      "addressLocality": "Zürich"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 47.3769,
      "longitude": 8.5417
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://umzugscheck.ch/#website",
    "url": "https://umzugscheck.ch",
    "name": "Umzugscheck.ch",
    "description": "Schweizer Umzugsvergleich - Kostenlos Offerten erhalten",
    "publisher": {
      "@id": "https://umzugscheck.ch/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://umzugscheck.ch/vergleich?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Use any[] to allow different schema types
  const schemas: any[] = [organizationSchema, webSiteSchema];
  if (includeLocalBusiness) {
    schemas.push(localBusinessSchema);
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemas)}
      </script>
    </Helmet>
  );
});

export default EnhancedOrganizationSchema;
