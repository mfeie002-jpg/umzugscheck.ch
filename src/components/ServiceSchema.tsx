import { Helmet } from "react-helmet-async";

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  priceRange?: string;
  areaServed?: string[];
}

const ServiceSchema = ({
  name,
  description,
  url,
  image,
  priceRange = "CHF 500 - CHF 5000",
  areaServed = ["Schweiz", "Zürich", "Basel", "Bern", "Genf"]
}: ServiceSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Moving Service",
    "name": name,
    "description": description,
    "url": url,
    ...(image && { "image": image }),
    "provider": {
      "@type": "MovingCompany",
      "name": "Feierabend Umzüge",
      "url": "https://feierabend-umzuege.ch",
      "telephone": "+41 76 568 13 02",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Musterstrasse 123",
        "addressLocality": "Zürich",
        "postalCode": "8000",
        "addressCountry": "CH"
      }
    },
    "areaServed": areaServed.map(area => ({
      "@type": area === "Schweiz" ? "Country" : "City",
      "name": area
    })),
    "offers": {
      "@type": "Offer",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "priceCurrency": "CHF"
      },
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "247",
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
        "item": "https://feierabend-umzuege.ch"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Leistungen",
        "item": "https://feierabend-umzuege.ch/plan"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": name,
        "item": url
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default ServiceSchema;
