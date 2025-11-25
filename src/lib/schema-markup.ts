import { generateSEOTags } from "./seo-optimizer";

interface SchemaOrgBase {
  "@context": "https://schema.org";
  "@type": string;
}

interface Organization extends SchemaOrgBase {
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    "@type": "PostalAddress";
    addressCountry: string;
  };
  contactPoint: {
    "@type": "ContactPoint";
    contactType: string;
    availableLanguage: string[];
  };
  sameAs: string[];
}

interface LocalBusiness extends SchemaOrgBase {
  "@type": "LocalBusiness";
  name: string;
  image: string;
  "@id": string;
  url: string;
  telephone: string;
  priceRange: string;
  address: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  geo: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }[];
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: string;
    reviewCount: string;
  };
}

interface Service extends SchemaOrgBase {
  "@type": "Service";
  serviceType: string;
  provider: {
    "@type": "Organization";
    name: string;
  };
  areaServed: string;
  description: string;
  offers: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
  };
}

interface FAQPage extends SchemaOrgBase {
  "@type": "FAQPage";
  mainEntity: {
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }[];
}

interface BreadcrumbList extends SchemaOrgBase {
  "@type": "BreadcrumbList";
  itemListElement: {
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }[];
}

export const generateOrganizationSchema = (): Organization => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Umzugscheck.ch",
    url: "https://umzugscheck.ch",
    logo: "https://umzugscheck.ch/lovable-uploads/1bdb4b13-ea35-4ded-a82e-4aa0714e0608.png",
    description: "Schweizer Umzugsvergleichsportal - Kostenlos Umzugsofferten vergleichen",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CH"
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["de-CH", "fr-CH", "it-CH"]
    },
    sameAs: []
  };
};

export const generateLocalBusinessSchema = (
  name: string,
  location: string,
  rating?: number,
  reviewCount?: number
): LocalBusiness => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    image: "https://umzugscheck.ch/lovable-uploads/1bdb4b13-ea35-4ded-a82e-4aa0714e0608.png",
    "@id": `https://umzugscheck.ch/firmen/${name.toLowerCase().replace(/\s+/g, '-')}`,
    url: `https://umzugscheck.ch/firmen/${name.toLowerCase().replace(/\s+/g, '-')}`,
    telephone: "+41 XX XXX XX XX",
    priceRange: "CHF 850-1500",
    address: {
      "@type": "PostalAddress",
      addressLocality: location,
      addressRegion: location,
      addressCountry: "CH"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 47.3769,
      longitude: 8.5417
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00"
      }
    ],
    ...(rating && reviewCount ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.toString(),
        reviewCount: reviewCount.toString()
      }
    } : {})
  };
};

export const generateServiceSchema = (
  serviceType: string,
  description: string,
  priceRange: string
): Service => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType,
    provider: {
      "@type": "Organization",
      name: "Umzugscheck.ch"
    },
    areaServed: "Schweiz",
    description,
    offers: {
      "@type": "Offer",
      price: priceRange,
      priceCurrency: "CHF"
    }
  };
};

export const generateFAQSchema = (faqs: { question: string; answer: string }[]): FAQPage => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
};

export const generateBreadcrumbSchema = (
  items: { name: string; url: string }[]
): BreadcrumbList => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

export const injectSchema = (schema: SchemaOrgBase | SchemaOrgBase[]) => {
  if (typeof window === 'undefined') return;
  
  const schemas = Array.isArray(schema) ? schema : [schema];
  
  schemas.forEach((s, index) => {
    const scriptId = `schema-${index}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(s);
  });
};
