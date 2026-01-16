/**
 * Dynamic OG Image Component
 * 
 * Generates appropriate Open Graph meta tags based on page type.
 * Improves social sharing and click-through rates.
 */

import { Helmet } from "react-helmet";
import { memo } from "react";

export type PageType = 
  | "homepage"
  | "service"
  | "city"
  | "canton"
  | "company"
  | "calculator"
  | "blog"
  | "ratgeber"
  | "comparison";

interface DynamicOGImageProps {
  pageType: PageType;
  title: string;
  description: string;
  
  // Optional overrides
  customImage?: string;
  customUrl?: string;
  
  // Page-specific data
  cityName?: string;
  cantonCode?: string;
  serviceName?: string;
  companyName?: string;
  companyRating?: number;
  price?: { min: number; max: number };
  reviewCount?: number;
  publishedDate?: string;
  modifiedDate?: string;
}

// Base URL for OG images
const OG_IMAGE_BASE = "https://umzugscheck.ch";

// Generate OG image URL based on page type
const getOGImageUrl = (props: DynamicOGImageProps): string => {
  const { pageType, customImage, cityName, cantonCode, serviceName, companyName, price } = props;
  
  // Use custom image if provided
  if (customImage) return customImage;

  // Dynamic image paths based on page type
  switch (pageType) {
    case "homepage":
      return `${OG_IMAGE_BASE}/og-images/homepage.jpg`;
    
    case "city":
      // Could be dynamic: /og-images/cities/zurich.jpg
      return `${OG_IMAGE_BASE}/og-images/city-${cityName?.toLowerCase() || "default"}.jpg`;
    
    case "canton":
      return `${OG_IMAGE_BASE}/og-images/canton-${cantonCode?.toLowerCase() || "default"}.jpg`;
    
    case "service":
      // /og-images/services/reinigung.jpg
      const serviceSlug = serviceName?.toLowerCase()
        .replace(/ü/g, "ue")
        .replace(/ö/g, "oe")
        .replace(/ä/g, "ae")
        .replace(/\s+/g, "-") || "default";
      return `${OG_IMAGE_BASE}/og-images/service-${serviceSlug}.jpg`;
    
    case "company":
      // Company-specific images or fallback
      return `${OG_IMAGE_BASE}/og-images/company-profile.jpg`;
    
    case "calculator":
      return `${OG_IMAGE_BASE}/og-images/calculator.jpg`;
    
    case "blog":
    case "ratgeber":
      return `${OG_IMAGE_BASE}/og-images/ratgeber.jpg`;
    
    case "comparison":
      return `${OG_IMAGE_BASE}/og-images/comparison.jpg`;
    
    default:
      return `${OG_IMAGE_BASE}/og-image.jpg`;
  }
};

// Generate optimized title
const getOptimizedTitle = (props: DynamicOGImageProps): string => {
  const { pageType, title, cityName, cantonCode, serviceName, companyName, price } = props;

  switch (pageType) {
    case "homepage":
      return "Umzugscheck.ch – Die Nr. 1 für Umzugsvergleiche in der Schweiz";
    
    case "city":
      return `Umzugsfirmen ${cityName} vergleichen | Bis 40% sparen`;
    
    case "canton":
      return `Umzugsfirmen Kanton ${cantonCode} – Kostenlose Offerten`;
    
    case "service":
      return `${serviceName} Schweiz – Preise vergleichen & sparen`;
    
    case "company":
      return `${companyName} – Bewertungen & Preise | Umzugscheck.ch`;
    
    case "calculator":
      return `Umzugskosten Rechner – Preis in 2 Minuten berechnen`;
    
    default:
      return title;
  }
};

// Generate optimized description
const getOptimizedDescription = (props: DynamicOGImageProps): string => {
  const { pageType, description, cityName, serviceName, companyRating, reviewCount, price } = props;

  switch (pageType) {
    case "homepage":
      return "Kostenlose Umzugsofferten von 200+ geprüften Schweizer Umzugsfirmen. Bis zu 40% sparen mit dem Umzugsvergleich.";
    
    case "city":
      return `Die besten Umzugsfirmen in ${cityName} vergleichen. ✓ Kostenlos ✓ Unverbindlich ✓ Bis 40% sparen.`;
    
    case "service":
      if (price) {
        return `${serviceName} ab CHF ${price.min}. Preise vergleichen und sparen. ✓ 200+ geprüfte Firmen ✓ Kostenlos`;
      }
      return `${serviceName} in der Schweiz. Preise vergleichen & bis zu 40% sparen.`;
    
    case "company":
      if (companyRating && reviewCount) {
        return `★ ${companyRating}/5 (${reviewCount} Bewertungen). Jetzt Offerte anfragen.`;
      }
      return description;
    
    default:
      return description;
  }
};

export const DynamicOGImage = memo(function DynamicOGImage(props: DynamicOGImageProps) {
  const {
    pageType,
    customUrl,
    publishedDate,
    modifiedDate,
    companyRating,
    reviewCount,
    price
  } = props;

  const ogImage = getOGImageUrl(props);
  const ogTitle = getOptimizedTitle(props);
  const ogDescription = getOptimizedDescription(props);
  const currentUrl = customUrl || (typeof window !== "undefined" ? window.location.href : "");

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{ogTitle}</title>
      <meta name="title" content={ogTitle} />
      <meta name="description" content={ogDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={pageType === "blog" ? "article" : "website"} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="de_CH" />
      <meta property="og:site_name" content="Umzugscheck.ch" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article-specific (for blog posts) */}
      {pageType === "blog" && publishedDate && (
        <>
          <meta property="article:published_time" content={publishedDate} />
          {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
          <meta property="article:author" content="Umzugscheck.ch" />
        </>
      )}

      {/* Price meta (for product pages) */}
      {price && (
        <>
          <meta property="product:price:amount" content={price.min.toString()} />
          <meta property="product:price:currency" content="CHF" />
        </>
      )}

      {/* Rating meta */}
      {companyRating && reviewCount && (
        <>
          <meta property="rating:value" content={companyRating.toString()} />
          <meta property="rating:count" content={reviewCount.toString()} />
        </>
      )}
    </Helmet>
  );
});

export default DynamicOGImage;
