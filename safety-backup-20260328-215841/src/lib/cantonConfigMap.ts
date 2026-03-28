/**
 * Canton Config Map - Compatibility Bridge
 * 
 * This file provides compatibility for components that expect the old CantonTemplate format.
 * It adapts data from cantonConfig.ts to the format expected by funnels and other components.
 */

import { 
  zugConfig as zugConfigNew, 
  zuerichConfig as zuerichConfigNew, 
  bernConfig as bernConfigNew,
  allCantons,
  CantonConfig as NewCantonConfig,
  CantonCompany as NewCantonCompany,
  PriceExample as NewPriceExample,
} from '@/config/cantonConfig';
import { LucideIcon, Truck } from 'lucide-react';

// Legacy types expected by old components (funnels, widgets)
export interface CantonCompany {
  name: string;
  rating: number;
  reviews: number;
  priceLevel: string;
  sponsored: boolean;
  available: boolean;
  badge: string | null;
}

export interface CantonPriceExample {
  size: string;
  range: string;
  avg: string;
}

export interface CantonService {
  name: string;
  icon: LucideIcon;
  link: string;
}

export interface CantonUSP {
  title: string;
  desc: string;
  icon: LucideIcon;
}

export interface CantonFAQ {
  question: string;
  answer: string;
}

export interface CantonConfig {
  name: string;
  slug: string;
  tagline: string;
  icon: LucideIcon;
  iconColor?: string;
  cities: string[];
  companies: CantonCompany[];
  priceExamples: CantonPriceExample[];
  services: CantonService[];
  usps: CantonUSP[];
  faqs: CantonFAQ[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  localInfo: {
    title: string;
    paragraphs: { title?: string; text: string }[];
  };
  notificationCity: string;
  activeUsersBase: number;
}

// Convert new company format to old template format
const convertCompany = (c: NewCantonCompany): CantonCompany => ({
  name: c.name,
  rating: c.rating,
  reviews: c.reviewCount,
  priceLevel: c.priceLevel === 'Mittel–Premium' ? 'premium' : c.priceLevel.toLowerCase(),
  sponsored: c.isPremium || c.isPopular || false,
  available: true,
  badge: c.highlight || null,
});

// Convert new price example to old format
const convertPriceExample = (p: NewPriceExample): CantonPriceExample => ({
  size: p.title,
  range: p.priceRange,
  avg: p.avgSavings,
});

// Convert new config format to old template format
const convertConfig = (config: NewCantonConfig): CantonConfig => ({
  name: config.name,
  slug: config.slug,
  tagline: `Umzugsfirmen im ${config.name} vergleichen`,
  icon: Truck,
  iconColor: 'text-primary',
  cities: config.locations,
  companies: config.companies.map(convertCompany),
  priceExamples: config.priceExamples.map(convertPriceExample),
  services: config.services.map(s => ({
    name: s.title,
    icon: s.icon,
    link: s.link,
  })),
  usps: config.usps.map(u => ({
    title: u.title,
    desc: u.description,
    icon: u.icon,
  })),
  faqs: config.faqs.map(f => ({
    question: f.question,
    answer: f.answer,
  })),
  seo: {
    title: config.seo.title,
    description: config.seo.description,
    keywords: config.seo.keywords,
  },
  localInfo: {
    title: `Umziehen im ${config.name}`,
    paragraphs: config.seoContent.cityInfo.map(c => ({
      title: c.title,
      text: c.content,
    })),
  },
  notificationCity: config.mainCity,
  activeUsersBase: 15,
});

// Cached converted configs
const zugConfig = convertConfig(zugConfigNew);
const zuerichConfig = convertConfig(zuerichConfigNew);
const bernConfig = convertConfig(bernConfigNew);

// Map of available configs
const configMap: Record<string, CantonConfig> = {
  zug: zugConfig,
  zuerich: zuerichConfig,
  bern: bernConfig,
};

// Get canton config by slug (returns template format)
export const getCantonConfig = (slug: string): CantonConfig | undefined => {
  return configMap[slug.toLowerCase()];
};

// Check if a canton slug is valid
export const isValidCanton = (slug: string): boolean => {
  return slug.toLowerCase() in configMap || allCantons.some(c => c.slug === slug.toLowerCase());
};

// Get all canton configs (returns template format)
export const getAllCantonConfigs = (): CantonConfig[] => {
  return Object.values(configMap);
};

// Re-export allCantons for reference
export { allCantons };
