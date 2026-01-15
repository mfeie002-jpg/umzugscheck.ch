/**
 * Schema.org Structured Data Components
 * Provides rich snippets for Google search results
 */

import { Helmet } from "react-helmet";

interface LocalBusinessSchemaProps {
  name?: string;
  description?: string;
  url?: string;
  telephone?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  priceRange?: string;
}

export const LocalBusinessSchema = ({
  name = "Umzugscheck.ch",
  description = "Die führende Schweizer Plattform für Umzugsofferten. Vergleichen Sie kostenlos bis zu 5 Umzugsfirmen in Ihrer Region.",
  url = "https://umzugscheck.ch",
  telephone = "+41 44 123 45 67",
  address = {
    streetAddress: "Bahnhofstrasse 1",
    addressLocality: "Zürich",
    postalCode: "8001",
    addressCountry: "CH"
  },
  aggregateRating = {
    ratingValue: 4.8,
    reviewCount: 2847
  },
  priceRange = "CHF CHF CHF"
}: LocalBusinessSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": url,
    "name": name,
    "description": description,
    "url": url,
    "telephone": telephone,
    "address": {
      "@type": "PostalAddress",
      ...address
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue,
      "reviewCount": aggregateRating.reviewCount,
      "bestRating": 5,
      "worstRating": 1
    },
    "priceRange": priceRange,
    "image": "https://umzugscheck.ch/og-image.png",
    "sameAs": [
      "https://www.facebook.com/umzugscheck",
      "https://www.instagram.com/umzugscheck",
      "https://www.linkedin.com/company/umzugscheck"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Switzerland"
    },
    "serviceType": ["Umzugsservice", "Reinigungsservice", "Entsorgungsservice"],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

interface FAQSchemaProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export const FAQSchema = ({ questions }: FAQSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

interface ServiceSchemaProps {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
  priceRange?: string;
  url?: string;
}

export const ServiceSchema = ({
  name,
  description,
  provider = "Umzugscheck.ch",
  areaServed = "Schweiz",
  priceRange = "CHF 500 - CHF 5000",
  url
}: ServiceSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": provider
    },
    "areaServed": {
      "@type": "Country",
      "name": areaServed
    },
    "offers": {
      "@type": "Offer",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "priceCurrency": "CHF"
      }
    },
    "url": url
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
}

export const OrganizationSchema = ({
  name = "Umzugscheck.ch",
  url = "https://umzugscheck.ch",
  logo = "https://umzugscheck.ch/logo.png"
}: OrganizationSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": logo,
    "sameAs": [
      "https://www.facebook.com/umzugscheck",
      "https://www.instagram.com/umzugscheck",
      "https://www.linkedin.com/company/umzugscheck"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+41-44-123-45-67",
      "contactType": "customer service",
      "availableLanguage": ["German", "French", "Italian"]
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Combined schema for pages
interface CombinedSchemaProps {
  pageType: 'home' | 'service' | 'region' | 'company' | 'blog';
  faqItems?: Array<{ question: string; answer: string }>;
  serviceName?: string;
  serviceDescription?: string;
}

export const CombinedSchema = ({ 
  pageType, 
  faqItems,
  serviceName,
  serviceDescription 
}: CombinedSchemaProps) => {
  return (
    <>
      {pageType === 'home' && (
        <>
          <LocalBusinessSchema />
          <OrganizationSchema />
        </>
      )}
      {pageType === 'service' && serviceName && serviceDescription && (
        <ServiceSchema name={serviceName} description={serviceDescription} />
      )}
      {faqItems && faqItems.length > 0 && (
        <FAQSchema questions={faqItems} />
      )}
    </>
  );
};
