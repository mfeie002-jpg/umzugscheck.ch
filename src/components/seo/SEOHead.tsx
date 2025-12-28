/**
 * ============================================================================
 * SEO HEAD - ARCHETYP COMPONENT
 * ============================================================================
 * 
 * Vollständige SEO-Optimierung für alle Seiten.
 * Implementiert:
 * - Meta Tags (Title, Description, Robots)
 * - Open Graph (Facebook, LinkedIn)
 * - Twitter Cards
 * - JSON-LD Structured Data
 * - Canonical URLs
 * - Hreflang für CH-DE/CH-FR/CH-IT
 * 
 * @version 2.0.0 - Archetyp Edition
 */

import { memo } from "react";
import { Helmet } from "react-helmet";

// ============================================================================
// TYPES
// ============================================================================
interface SEOHeadProps {
  /** Page title (will be appended with site name) */
  title: string;
  /** Meta description (max 160 chars) */
  description: string;
  /** Canonical URL path (e.g., "/umzugsofferten") */
  path?: string;
  /** Page type for structured data */
  type?: "website" | "article" | "product" | "service" | "faq" | "organization";
  /** Open Graph image URL */
  image?: string;
  /** Robots directive */
  robots?: "index, follow" | "noindex, nofollow" | "noindex, follow";
  /** Additional keywords */
  keywords?: string[];
  /** Publish date for articles */
  publishedAt?: string;
  /** Last modified date */
  modifiedAt?: string;
  /** FAQ items for FAQ schema */
  faqItems?: Array<{ question: string; answer: string }>;
  /** Breadcrumb items */
  breadcrumbs?: Array<{ name: string; url: string }>;
  /** Service area for LocalBusiness schema */
  serviceArea?: string[];
  /** Disable JSON-LD */
  noSchema?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const SITE_NAME = "Umzugscheck.ch";
const SITE_URL = "https://umzugscheck.ch";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
const DEFAULT_DESCRIPTION = "Vergleichen Sie kostenlos Umzugsofferten von geprüften Schweizer Umzugsfirmen. 200+ Partner, 4.8/5 Bewertung, Abnahmegarantie.";

// ============================================================================
// SCHEMA GENERATORS
// ============================================================================
const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": SITE_NAME,
  "url": SITE_URL,
  "logo": `${SITE_URL}/logo.png`,
  "description": "Die führende Schweizer Plattform für Umzugsofferten-Vergleich.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CH"
  },
  "sameAs": [
    "https://www.facebook.com/umzugscheck",
    "https://www.linkedin.com/company/umzugscheck"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "2400",
    "bestRating": "5"
  }
});

const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": SITE_NAME,
  "url": SITE_URL,
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${SITE_URL}/suche?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
});

const generateServiceSchema = (title: string, description: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Umzugsservice-Vermittlung",
  "name": title,
  "description": description,
  "provider": {
    "@type": "Organization",
    "name": SITE_NAME
  },
  "areaServed": {
    "@type": "Country",
    "name": "Schweiz"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Umzugsdienstleistungen",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Privatumzug" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Firmenumzug" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Umzugsreinigung" } }
    ]
  }
});

const generateFAQSchema = (items: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": items.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
});

const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`
  }))
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const SEOHead = memo(({
  title,
  description,
  path = "",
  type = "website",
  image = DEFAULT_IMAGE,
  robots = "index, follow",
  keywords = [],
  publishedAt,
  modifiedAt,
  faqItems,
  breadcrumbs,
  serviceArea,
  noSchema = false
}: SEOHeadProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${path}`;
  const fullDescription = description || DEFAULT_DESCRIPTION;
  
  // Truncate description to 160 chars
  const metaDescription = fullDescription.length > 160 
    ? fullDescription.substring(0, 157) + "..." 
    : fullDescription;

  // Default keywords
  const allKeywords = [
    "Umzug Schweiz",
    "Umzugsfirma",
    "Umzugsofferte",
    "Zügeln",
    ...keywords
  ].join(", ");

  // Generate schemas
  const schemas: object[] = [];
  if (!noSchema) {
    schemas.push(generateOrganizationSchema());
    schemas.push(generateWebsiteSchema());
    
    if (type === "service") {
      schemas.push(generateServiceSchema(title, fullDescription));
    }
    
    if (faqItems && faqItems.length > 0) {
      schemas.push(generateFAQSchema(faqItems));
    }
    
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push(generateBreadcrumbSchema(breadcrumbs));
    }
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={allKeywords} />
      <meta name="robots" content={robots} />
      <meta name="author" content={SITE_NAME} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Language / Region */}
      <html lang="de-CH" />
      <link rel="alternate" hrefLang="de-CH" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      <meta name="geo.region" content="CH" />
      <meta name="geo.placename" content="Schweiz" />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type === "article" ? "article" : "website"} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="de_CH" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />

      {/* Article-specific */}
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}

      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#0050A8" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Performance Hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

      {/* JSON-LD Structured Data */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  );
});

SEOHead.displayName = 'SEOHead';

// ============================================================================
// PAGE-SPECIFIC SEO PRESETS
// ============================================================================
export const HomePageSEO = () => (
  <SEOHead
    title="Umzugsofferten vergleichen"
    description="Vergleichen Sie kostenlos Umzugsofferten von über 200 geprüften Schweizer Umzugsfirmen. 4.8/5 Sterne, Abnahmegarantie, Offerten in 24-48h."
    path="/"
    type="website"
    keywords={["Umzugsvergleich", "günstig zügeln", "Umzugskosten"]}
  />
);

export const OffertenPageSEO = () => (
  <SEOHead
    title="Umzugsofferten anfordern"
    description="Fordern Sie jetzt kostenlos bis zu 5 Umzugsofferten an. Geprüfte Partner, transparente Preise, Fixpreis-Garantie."
    path="/umzugsofferten"
    type="service"
    keywords={["Umzugsofferte", "Offerte anfordern", "Umzug berechnen"]}
  />
);

export const RechnerPageSEO = () => (
  <SEOHead
    title="Umzugskostenrechner"
    description="Berechnen Sie Ihre Umzugskosten in 2 Minuten. Kostenloser Preisrechner für Privatumzüge und Firmenumzüge in der Schweiz."
    path="/preisrechner"
    type="service"
    keywords={["Umzugskostenrechner", "Umzug Preis", "Zügelkosten berechnen"]}
  />
);

export default SEOHead;
