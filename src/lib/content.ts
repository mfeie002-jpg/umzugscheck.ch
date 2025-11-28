// Content Management Utilities
import type {
  HomepageContent,
  Service,
  RegionCity,
  FAQItem,
  CostExample,
  WhyUsCard,
  SEOContent,
} from "@/content/types";

import homepageData from "@/content/homepage.json";
import servicesData from "@/content/services.json";
import regionsData from "@/content/regions.json";
import faqData from "@/content/faq.json";
import costExamplesData from "@/content/costExamples.json";
import whyUsData from "@/content/whyUs.json";
import seoData from "@/content/seo.json";

// Homepage Content
export const getHomepageContent = (): HomepageContent => {
  return homepageData as HomepageContent;
};

// Services
export const getServices = (): Service[] => {
  return (servicesData as Service[]).sort((a, b) => a.order - b.order);
};

export const getServicesByCategory = (category: string): Service[] => {
  return getServices().filter((s) => s.category === category);
};

export const getServiceById = (id: string): Service | undefined => {
  return getServices().find((s) => s.id === id);
};

// Regions & Cities
export const getRegions = (): RegionCity[] => {
  return (regionsData as RegionCity[]).sort((a, b) => a.order - b.order);
};

export const getMainCities = (): RegionCity[] => {
  return getRegions().filter((r) => r.isMainCity);
};

export const getRegionBySlug = (slug: string): RegionCity | undefined => {
  return getRegions().find((r) => r.slug === slug);
};

// FAQ
export const getFAQs = (): FAQItem[] => {
  return (faqData as FAQItem[]).sort((a, b) => a.order - b.order);
};

export const getFAQsByCategory = (category: string): FAQItem[] => {
  return getFAQs().filter((f) => f.category === category);
};

// Cost Examples
export const getCostExamples = (): CostExample[] => {
  return (costExamplesData as CostExample[]).sort((a, b) => a.order - b.order);
};

// Why Us Cards
export const getWhyUsCards = (): WhyUsCard[] => {
  return (whyUsData as WhyUsCard[]).sort((a, b) => a.order - b.order);
};

// SEO
export const getSEOContent = (): SEOContent => {
  return seoData as SEOContent;
};

export const getPageSEO = (pageKey: string) => {
  const seo = getSEOContent();
  const pageSEO = seo.pages[pageKey];
  
  if (!pageSEO) {
    return {
      title: seo.global.siteName,
      description: seo.global.defaultDescription,
      canonicalPath: "/",
    };
  }

  return {
    ...pageSEO,
    title: pageSEO.title + seo.global.defaultTitleSuffix,
  };
};
