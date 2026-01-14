/**
 * Canton Config Map - Compatibility Bridge
 * 
 * This file provides compatibility for components that expect the old CantonTemplate format.
 * It adapts data from cantonConfig.ts to the format expected by funnels and other components.
 */

import { 
  getCantonConfig as getConfigNew, 
  zugConfig as zugConfigNew, 
  zuerichConfig as zuerichConfigNew, 
  bernConfig as bernConfigNew,
  allCantons,
  CantonConfig as NewCantonConfig,
  CantonCompany as NewCantonCompany
} from '@/config/cantonConfig';
import { CantonConfig as TemplateConfig, CantonCompany as TemplateCompany } from '@/components/canton/CantonTemplate';
import { Truck, Sparkles, Trash2, Package, Building2, Shield, Clock, TrendingUp, CheckCircle, MapPin } from 'lucide-react';

// Re-export the TemplateConfig type for components expecting old format
export type { CantonConfig } from '@/components/canton/CantonTemplate';

// Convert new company format to old template format
const convertCompany = (c: NewCantonCompany): TemplateCompany => ({
  name: c.name,
  rating: c.rating,
  reviews: c.reviewCount,
  priceLevel: c.priceLevel === 'Mittel–Premium' ? 'premium' : c.priceLevel.toLowerCase(),
  sponsored: c.isPremium || c.isPopular || false,
  available: true,
  badge: c.highlight || null,
});

// Convert new config format to old template format
const convertConfig = (config: NewCantonConfig): TemplateConfig => ({
  name: config.name,
  slug: config.slug,
  tagline: `Umzugsfirmen im ${config.name} vergleichen`,
  icon: Truck,
  iconColor: 'text-primary',
  cities: config.locations,
  companies: config.companies.map(convertCompany),
  priceExamples: config.priceExamples.map(p => ({
    size: p.title,
    range: p.priceRange,
    avg: p.avgSavings,
  })),
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
const configMap: Record<string, TemplateConfig> = {
  zug: zugConfig,
  zuerich: zuerichConfig,
  bern: bernConfig,
};

// Get canton config by slug (returns template format)
export const getCantonConfig = (slug: string): TemplateConfig | undefined => {
  return configMap[slug.toLowerCase()];
};

// Check if a canton slug is valid
export const isValidCanton = (slug: string): boolean => {
  return slug.toLowerCase() in configMap || allCantons.some(c => c.slug === slug.toLowerCase());
};

// Get all canton configs (returns template format)
export const getAllCantonConfigs = (): TemplateConfig[] => {
  return Object.values(configMap);
};

// Re-export allCantons for reference
export { allCantons };
