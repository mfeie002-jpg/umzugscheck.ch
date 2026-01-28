import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type?: 'LocalBusiness' | 'MovingCompany' | 'FAQPage' | 'BreadcrumbList' | 'Service';
  data?: Record<string, unknown>;
}

const baseBusinessData = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "MovingCompany"],
  "name": "Feierabend Umzüge",
  "description": "Schweizer Familienunternehmen für Premium-Umzugsdienstleistungen mit über 20 Jahren Erfahrung.",
  "url": "https://feierabend-umzuege.ch",
  "logo": "https://feierabend-umzuege.ch/logo.png",
  "image": "https://feierabend-umzuege.ch/hero-moving.jpg",
  "telephone": "+41 44 123 45 67",
  "email": "info@feierabend-umzuege.ch",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Musterstrasse 123",
    "addressLocality": "Zürich",
    "postalCode": "8000",
    "addressCountry": "CH"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 47.3769,
    "longitude": 8.5417
  },
  "areaServed": [
    { "@type": "Country", "name": "Schweiz" },
    { "@type": "City", "name": "Zürich" },
    { "@type": "City", "name": "Basel" },
    { "@type": "City", "name": "Bern" },
    { "@type": "City", "name": "Genf" },
    { "@type": "City", "name": "Lausanne" },
    { "@type": "City", "name": "Luzern" },
    { "@type": "City", "name": "St. Gallen" },
    { "@type": "City", "name": "Winterthur" }
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "07:00",
      "closes": "19:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "08:00",
      "closes": "16:00"
    }
  ],
  "priceRange": "CHF 500 - CHF 5000",
  "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer", "TWINT"],
  "currenciesAccepted": "CHF",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "247",
    "bestRating": "5",
    "worstRating": "1"
  },
  "sameAs": [
    "https://www.facebook.com/feierabendumzuege",
    "https://www.instagram.com/feierabendumzuege",
    "https://www.linkedin.com/company/feierabendumzuege"
  ]
};

export const StructuredData = ({ type = 'LocalBusiness', data }: StructuredDataProps) => {
  let structuredData = baseBusinessData;

  if (data) {
    structuredData = { ...baseBusinessData, ...data };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

interface FAQStructuredDataProps {
  faqs: Array<{ question: string; answer: string }>;
}

export const FAQStructuredData = ({ faqs }: FAQStructuredDataProps) => {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqData)}
      </script>
    </Helmet>
  );
};

interface BreadcrumbStructuredDataProps {
  items: Array<{ name: string; url: string }>;
}

export const BreadcrumbStructuredData = ({ items }: BreadcrumbStructuredDataProps) => {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbData)}
      </script>
    </Helmet>
  );
};

interface ServiceStructuredDataProps {
  name: string;
  description: string;
  price?: string;
  image?: string;
}

export const ServiceStructuredData = ({ name, description, price, image }: ServiceStructuredDataProps) => {
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Moving Service",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Feierabend Umzüge"
    },
    "name": name,
    "description": description,
    ...(price && { "offers": { "@type": "Offer", "price": price, "priceCurrency": "CHF" } }),
    ...(image && { "image": image }),
    "areaServed": {
      "@type": "Country",
      "name": "Schweiz"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(serviceData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
