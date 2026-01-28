import { Helmet } from "react-helmet";

interface CitySchemaProps {
  cityName: string;
  description: string;
  url: string;
}

const CitySchema = ({ cityName, description, url }: CitySchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": url,
    "name": `Umzugscheck ${cityName}`,
    "description": description,
    "url": url,
    "telephone": "+41 44 567 89 00",
    "email": "info@umzugscheck.ch",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressCountry": "CH"
    },
    "areaServed": {
      "@type": "City",
      "name": cityName
    },
    "priceRange": "CHF 500 - CHF 5000",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "247"
    },
    "parentOrganization": {
      "@type": "MovingCompany",
      "name": "Umzugscheck.ch",
      "url": "https://umzugscheck.ch"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://umzugscheck.ch" },
      { "@type": "ListItem", "position": 2, "name": "Standorte", "item": "https://umzugscheck.ch/map" },
      { "@type": "ListItem", "position": 3, "name": cityName, "item": url }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
    </Helmet>
  );
};

export default CitySchema;
