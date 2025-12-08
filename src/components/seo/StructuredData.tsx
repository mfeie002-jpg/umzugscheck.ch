import { Helmet } from "react-helmet";

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
}

interface LocalBusinessSchemaProps extends OrganizationSchemaProps {
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  telephone?: string;
  priceRange?: string;
}

interface FAQSchemaProps {
  faqs: Array<{ question: string; answer: string }>;
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>;
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
  priceRange?: string;
}

/**
 * Organization Schema for company information
 */
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
    "description": "Die führende Schweizer Plattform für den Vergleich von Umzugsfirmen.",
    "areaServed": {
      "@type": "Country",
      "name": "Switzerland"
    },
    "sameAs": [
      "https://www.facebook.com/umzugscheck",
      "https://www.instagram.com/umzugscheck"
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

/**
 * LocalBusiness Schema for local SEO
 */
export const LocalBusinessSchema = ({
  name = "Umzugscheck.ch",
  url = "https://umzugscheck.ch",
  address,
  telephone,
  priceRange = "CHF"
}: LocalBusinessSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "url": url,
    ...(address && {
      "address": {
        "@type": "PostalAddress",
        ...address
      }
    }),
    ...(telephone && { "telephone": telephone }),
    "priceRange": priceRange,
    "areaServed": "Switzerland"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

/**
 * FAQ Schema for FAQ pages
 */
export const FAQSchema = ({ faqs }: FAQSchemaProps) => {
  const schema = {
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
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

/**
 * Breadcrumb Schema for navigation
 */
export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const schema = {
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
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

/**
 * Service Schema for service pages
 */
export const ServiceSchema = ({
  name,
  description,
  provider = "Umzugscheck.ch",
  areaServed = "Switzerland",
  priceRange
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
    ...(priceRange && { "priceRange": priceRange })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

/**
 * AggregateRating Schema for company ratings
 */
export const AggregateRatingSchema = ({
  itemName,
  ratingValue,
  reviewCount,
  bestRating = 5,
  worstRating = 1
}: {
  itemName: string;
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    "itemReviewed": {
      "@type": "Organization",
      "name": itemName
    },
    "ratingValue": ratingValue,
    "bestRating": bestRating,
    "worstRating": worstRating,
    "ratingCount": reviewCount
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
