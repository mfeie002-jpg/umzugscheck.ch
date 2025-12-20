import React from 'react';
import { Helmet } from 'react-helmet';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface LocalBusinessInfo {
  name: string;
  description?: string;
  telephone?: string;
  email?: string;
  address?: {
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
  priceRange?: string;
  image?: string;
}

interface AdvancedSEOProps {
  // Basic Meta
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  noIndex?: boolean;
  
  // OpenGraph
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'profile';
  ogLocale?: string;
  
  // Twitter
  twitterCard?: 'summary' | 'summary_large_image';
  twitterSite?: string;
  twitterCreator?: string;
  
  // Structured Data
  breadcrumbs?: BreadcrumbItem[];
  faq?: FAQItem[];
  localBusiness?: LocalBusinessInfo;
  
  // Article specific
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  
  // Service specific
  service?: {
    name: string;
    description: string;
    provider: string;
    areaServed?: string[];
    priceRange?: string;
  };
}

export const AdvancedSEO: React.FC<AdvancedSEOProps> = ({
  title,
  description,
  keywords = [],
  canonical,
  noIndex = false,
  ogTitle,
  ogDescription,
  ogImage = 'https://umzugscheck.ch/og-image.jpg',
  ogType = 'website',
  ogLocale = 'de_CH',
  twitterCard = 'summary_large_image',
  twitterSite = '@umzugscheck',
  twitterCreator,
  breadcrumbs,
  faq,
  localBusiness,
  article,
  service,
}) => {
  const siteUrl = 'https://umzugscheck.ch';
  const fullTitle = title.includes('Umzugscheck') ? title : `${title} | Umzugscheck.ch`;
  const canonicalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : siteUrl);

  // Generate Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Umzugscheck.ch',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Die führende Schweizer Plattform für Umzugsvergleiche und Offerten',
    sameAs: [
      'https://www.facebook.com/umzugscheck',
      'https://www.instagram.com/umzugscheck',
      'https://www.linkedin.com/company/umzugscheck',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+41-44-000-0000',
      contactType: 'customer service',
      availableLanguage: ['German', 'French', 'Italian'],
      areaServed: 'CH',
    },
  };

  // Generate WebSite Schema with Search Action
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Umzugscheck.ch',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/umzugsfirmen?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Generate Breadcrumb Schema
  const breadcrumbSchema = breadcrumbs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
        })),
      }
    : null;

  // Generate FAQ Schema
  const faqSchema = faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null;

  // Generate LocalBusiness Schema
  const localBusinessSchema = localBusiness
    ? {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: localBusiness.name,
        description: localBusiness.description,
        telephone: localBusiness.telephone,
        email: localBusiness.email,
        image: localBusiness.image,
        priceRange: localBusiness.priceRange,
        address: localBusiness.address
          ? {
              '@type': 'PostalAddress',
              ...localBusiness.address,
            }
          : undefined,
        geo: localBusiness.geo
          ? {
              '@type': 'GeoCoordinates',
              latitude: localBusiness.geo.latitude,
              longitude: localBusiness.geo.longitude,
            }
          : undefined,
        openingHoursSpecification: localBusiness.openingHours,
      }
    : null;

  // Generate Article Schema
  const articleSchema = article
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        author: {
          '@type': 'Person',
          name: article.author || 'Umzugscheck Team',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Umzugscheck.ch',
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/logo.png`,
          },
        },
        datePublished: article.publishedTime,
        dateModified: article.modifiedTime || article.publishedTime,
        mainEntityOfPage: canonicalUrl,
        articleSection: article.section,
        keywords: article.tags?.join(', '),
      }
    : null;

  // Generate Service Schema
  const serviceSchema = service
    ? {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.name,
        description: service.description,
        provider: {
          '@type': 'Organization',
          name: service.provider,
        },
        areaServed: service.areaServed?.map((area) => ({
          '@type': 'Country',
          name: area,
        })),
        priceRange: service.priceRange,
      }
    : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Language */}
      <html lang="de" />
      <meta httpEquiv="content-language" content="de-CH" />
      
      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content="Umzugscheck.ch" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={ogImage} />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}
      
      {/* Additional Meta */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#0050A8" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Geo Tags for Swiss targeting */}
      <meta name="geo.region" content="CH" />
      <meta name="geo.placename" content="Schweiz" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
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
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
      {serviceSchema && (
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default AdvancedSEO;
