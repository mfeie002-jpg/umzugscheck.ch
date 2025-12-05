import { Helmet } from "react-helmet";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface AdvancedSEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FAQItem[];
  rating?: {
    value: number;
    count: number;
  };
  price?: {
    min: number;
    max: number;
    currency: string;
  };
  localBusiness?: {
    name: string;
    image: string;
    telephone: string;
    address: {
      streetAddress: string;
      addressLocality: string;
      postalCode: string;
      addressCountry: string;
    };
    geo?: {
      latitude: number;
      longitude: number;
    };
    openingHours?: string[];
  };
}

export const AdvancedSEOHead = ({
  title,
  description,
  canonicalUrl,
  keywords,
  ogImage = 'https://umzugscheck.ch/og-image.jpg',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author,
  breadcrumbs,
  faqs,
  rating,
  price,
  localBusiness
}: AdvancedSEOHeadProps) => {
  const fullTitle = title.includes('umzugscheck.ch') ? title : `${title} | umzugscheck.ch`;

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'umzugscheck.ch',
    url: 'https://umzugscheck.ch',
    logo: 'https://umzugscheck.ch/logo.png',
    description: 'Die führende Schweizer Plattform für Umzugsvergleiche',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CH'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['German', 'French', 'Italian']
    },
    sameAs: [
      'https://www.facebook.com/umzugscheck',
      'https://www.linkedin.com/company/umzugscheck',
      'https://twitter.com/umzugscheck'
    ]
  };

  // Service Schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Umzugsvergleich Schweiz',
    description: 'Kostenloser Vergleich von Umzugsfirmen in der Schweiz',
    provider: {
      '@type': 'Organization',
      name: 'umzugscheck.ch'
    },
    areaServed: {
      '@type': 'Country',
      name: 'Switzerland'
    },
    serviceType: 'Moving Company Comparison',
    ...(rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.value,
        ratingCount: rating.count,
        bestRating: 5,
        worstRating: 1
      }
    }),
    ...(price && {
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: price.min,
        highPrice: price.max,
        priceCurrency: price.currency
      }
    })
  };

  // Breadcrumb Schema
  const breadcrumbSchema = breadcrumbs ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  } : null;

  // FAQ Schema
  const faqSchema = faqs && faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  } : null;

  // Local Business Schema
  const localBusinessSchema = localBusiness ? {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: localBusiness.name,
    image: localBusiness.image,
    telephone: localBusiness.telephone,
    address: {
      '@type': 'PostalAddress',
      ...localBusiness.address
    },
    ...(localBusiness.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: localBusiness.geo.latitude,
        longitude: localBusiness.geo.longitude
      }
    }),
    ...(localBusiness.openingHours && {
      openingHoursSpecification: localBusiness.openingHours
    })
  } : null;

  // Website Schema with SearchAction
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'umzugscheck.ch',
    url: 'https://umzugscheck.ch',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://umzugscheck.ch/suche?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang="de-CH" />
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="umzugscheck.ch" />
      <meta property="og:locale" content="de_CH" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article Meta (for blog posts) */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="language" content="German" />
      <meta name="geo.region" content="CH" />
      <meta name="geo.placename" content="Switzerland" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="theme-color" content="#0050A8" />

      {/* Preconnect to external resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />

      {/* Schema.org Markup */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
      {localBusinessSchema && (
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      )}
    </Helmet>
  );
};
