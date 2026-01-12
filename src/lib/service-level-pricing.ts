/**
 * Service Level Pricing Utility
 * 
 * Prompt 1: Preisband & Service-Slider
 * - Sofortige Preisschätzung nach PLZ-Eingabe
 * - Service-Level 0-100 Slider
 * - Beliebt Badge bei Level 50
 */

import { estimateDistance, formatCurrency } from './pricing';

export interface ServiceLevelPricing {
  serviceLevel: number; // 0-100
  serviceLevelLabel: string;
  priceMin: number;
  priceMax: number;
  features: string[];
  isPopular: boolean;
}

export interface QuickPriceEstimate {
  priceMin: number;
  priceMax: number;
  estimatedDistance: number;
  volumeM3: number;
  serviceLevelPricing: ServiceLevelPricing;
}

// Volume by rooms (in m³)
const VOLUME_BY_ROOMS: Record<string, number> = {
  "1": 18,
  "1.5": 25,
  "2": 32,
  "2.5": 40,
  "3": 48,
  "3.5": 55,
  "4": 65,
  "4.5": 75,
  "5": 85,
  "5.5+": 100,
};

// Service level configuration
const SERVICE_LEVELS = [
  { 
    min: 0, max: 20, 
    label: 'Selbstumzug', 
    multiplier: 0.5,
    features: ['Transportfahrzeug', 'Basis-Versicherung'],
    isPopular: false
  },
  { 
    min: 21, max: 40, 
    label: 'Basic', 
    multiplier: 0.75,
    features: ['Transportfahrzeug', '2 Helfer', 'Basis-Versicherung'],
    isPopular: false
  },
  { 
    min: 41, max: 60, 
    label: 'Komfort', 
    multiplier: 1.0,
    features: ['Transportfahrzeug', '3 Helfer', 'Ein-/Ausladen', 'Versicherung CHF 50k'],
    isPopular: true
  },
  { 
    min: 61, max: 80, 
    label: 'Premium', 
    multiplier: 1.35,
    features: ['Grosses Fahrzeug', '4 Helfer', 'Ein-/Ausladen', 'Möbelschutz', 'Versicherung CHF 100k'],
    isPopular: false
  },
  { 
    min: 81, max: 100, 
    label: 'White-Glove', 
    multiplier: 1.8,
    features: ['Alles inklusive', '5+ Helfer', 'Verpackungsservice', 'Montage/Demontage', 'Premium-Versicherung'],
    isPopular: false
  },
];

/**
 * Get service level details based on slider value
 */
export function getServiceLevelDetails(serviceLevel: number): ServiceLevelPricing {
  const level = SERVICE_LEVELS.find(l => serviceLevel >= l.min && serviceLevel <= l.max) || SERVICE_LEVELS[2];
  
  return {
    serviceLevel,
    serviceLevelLabel: level.label,
    priceMin: 0,
    priceMax: 0,
    features: level.features,
    isPopular: level.isPopular,
  };
}

/**
 * Calculate quick price estimate based on PLZ, rooms, and service level
 */
export function calculateQuickPriceEstimate(
  fromPostal: string,
  toPostal: string,
  rooms: string,
  serviceLevel: number = 50
): QuickPriceEstimate {
  // Get volume
  const volumeM3 = VOLUME_BY_ROOMS[rooms] || 48;
  
  // Estimate distance
  const estimatedDistance = estimateDistance(fromPostal, toPostal);
  
  // Base price calculation (CHF per m³)
  const basePerM3 = 45;
  const basePrice = volumeM3 * basePerM3;
  
  // Distance fee
  let distanceFee = 0;
  if (estimatedDistance > 10) distanceFee = 100;
  if (estimatedDistance > 30) distanceFee = 200;
  if (estimatedDistance > 50) distanceFee = 350;
  if (estimatedDistance > 100) distanceFee = 550;
  
  // Get service level multiplier
  const level = SERVICE_LEVELS.find(l => serviceLevel >= l.min && serviceLevel <= l.max) || SERVICE_LEVELS[2];
  
  // Calculate final prices
  const totalBase = (basePrice + distanceFee) * level.multiplier;
  const priceMin = Math.round(totalBase * 0.85);
  const priceMax = Math.round(totalBase * 1.15);
  
  return {
    priceMin,
    priceMax,
    estimatedDistance,
    volumeM3,
    serviceLevelPricing: {
      serviceLevel,
      serviceLevelLabel: level.label,
      priceMin,
      priceMax,
      features: level.features,
      isPopular: level.isPopular,
    }
  };
}

/**
 * Format price range as string
 */
export function formatPriceRange(min: number, max: number): string {
  return `${formatCurrency(min)} – ${formatCurrency(max)}`;
}

/**
 * Get service level step markers for slider
 */
export function getServiceLevelMarkers(): { value: number; label: string }[] {
  return [
    { value: 0, label: 'Selbst' },
    { value: 30, label: 'Basic' },
    { value: 50, label: 'Komfort' },
    { value: 70, label: 'Premium' },
    { value: 100, label: 'White-Glove' },
  ];
}
