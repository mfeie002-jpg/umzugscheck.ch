import { Helmet } from "react-helmet-async";

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
    "name": `Feierabend Umzüge ${cityName}`,
    "description": description,
    "url": url,
    "telephone": "+41 76 568 13 02",
    "email": "info@feierabend-umzuege.ch",
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
      "name": "Feierabend Umzüge",
      "url": "https://feierabend-umzuege.ch"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://feierabend-umzuege.ch" },
      { "@type": "ListItem", "position": 2, "name": "Standorte", "item": "https://feierabend-umzuege.ch/map" },
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
