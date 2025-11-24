// Schema.org structured data utilities for SEO

export interface OrganizationSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    "@type": string;
    addressLocality: string;
    addressCountry: string;
  };
  contactPoint: {
    "@type": string;
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string[];
  };
  sameAs: string[];
  aggregateRating?: {
    "@type": string;
    ratingValue: string;
    reviewCount: string;
  };
}

export interface ServiceSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  provider: {
    "@type": string;
    name: string;
    url: string;
  };
  areaServed: {
    "@type": string;
    name: string;
  };
  offers: {
    "@type": string;
    priceCurrency: string;
    price: string;
    description: string;
  };
}

export interface LocalBusinessSchema {
  "@context": string;
  "@type": string;
  name: string;
  image: string;
  "@id": string;
  url: string;
  telephone: string;
  priceRange: string;
  address: {
    "@type": string;
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    "@type": string;
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification: {
    "@type": string;
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }[];
  aggregateRating?: {
    "@type": string;
    ratingValue: string;
    reviewCount: string;
  };
}

export interface FAQSchema {
  "@context": string;
  "@type": string;
  mainEntity: {
    "@type": string;
    name: string;
    acceptedAnswer: {
      "@type": string;
      text: string;
    };
  }[];
}

export interface BreadcrumbSchema {
  "@context": string;
  "@type": string;
  itemListElement: {
    "@type": string;
    position: number;
    name: string;
    item: string;
  }[];
}

export const generateOrganizationSchema = (): OrganizationSchema => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Umzugscheck.ch",
  url: "https://umzugscheck.ch",
  logo: "https://umzugscheck.ch/logo.png",
  description: "Schweizer Vergleichsportal für Umzugsfirmen. Kostenlos Offerten vergleichen und bis zu 40% sparen.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Zürich",
    addressCountry: "CH"
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+41-44-123-45-67",
    contactType: "customer service",
    areaServed: "CH",
    availableLanguage: ["German", "French", "Italian"]
  },
  sameAs: [
    "https://facebook.com/umzugscheck",
    "https://linkedin.com/company/umzugscheck"
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "12000"
  }
});

export const generateServiceSchema = (serviceName: string, description: string, price: string): ServiceSchema => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: serviceName,
  description: description,
  provider: {
    "@type": "Organization",
    name: "Umzugscheck.ch",
    url: "https://umzugscheck.ch"
  },
  areaServed: {
    "@type": "Country",
    name: "Switzerland"
  },
  offers: {
    "@type": "Offer",
    priceCurrency: "CHF",
    price: price,
    description: "Kostenlose Offertanfrage"
  }
});

export const generateFAQSchema = (faqs: { question: string; answer: string }[]): FAQSchema => ({
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
});

export const generateBreadcrumbSchema = (items: { name: string; url: string }[]): BreadcrumbSchema => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `https://umzugscheck.ch${item.url}`
  }))
});

export const injectSchema = (schema: any) => {
  if (typeof document !== 'undefined') {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }
};
