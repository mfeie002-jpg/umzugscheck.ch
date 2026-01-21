/**
 * Circular Economy Module
 * Revenue stream: Take old items, sell/recycle, earn commission
 * Part of 553 CHF revenue stack (50 CHF)
 */

export type ItemCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'broken';
export type DisposalMethod = 'sell' | 'donate' | 'recycle' | 'dispose';

export interface CircularItem {
  id: string;
  name: string;
  category: ItemCategory;
  condition: ItemCondition;
  estimatedValue: number;
  recommendedMethod: DisposalMethod;
  imageUrl?: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  weight?: number;
  pickupRequired: boolean;
}

export type ItemCategory = 
  | 'furniture'
  | 'electronics'
  | 'appliances'
  | 'clothing'
  | 'books'
  | 'sports'
  | 'garden'
  | 'kids'
  | 'art'
  | 'other';

export const ITEM_CATEGORY_CONFIG: Record<ItemCategory, {
  label: string;
  labelDe: string;
  icon: string;
  avgResaleRate: number; // % of original value
  platforms: string[];
}> = {
  furniture: {
    label: 'Furniture',
    labelDe: 'Möbel',
    icon: '🛋️',
    avgResaleRate: 0.25,
    platforms: ['Ricardo', 'Tutti', 'Facebook Marketplace']
  },
  electronics: {
    label: 'Electronics',
    labelDe: 'Elektronik',
    icon: '📺',
    avgResaleRate: 0.35,
    platforms: ['Ricardo', 'Revendo', 'Tutti']
  },
  appliances: {
    label: 'Appliances',
    labelDe: 'Haushaltsgeräte',
    icon: '🔌',
    avgResaleRate: 0.20,
    platforms: ['Ricardo', 'Tutti', 'Local dealers']
  },
  clothing: {
    label: 'Clothing',
    labelDe: 'Kleidung',
    icon: '👕',
    avgResaleRate: 0.15,
    platforms: ['Vinted', 'Ricardo', 'Brocki']
  },
  books: {
    label: 'Books',
    labelDe: 'Bücher',
    icon: '📚',
    avgResaleRate: 0.10,
    platforms: ['Ricardo', 'Booklooker', 'Brocki']
  },
  sports: {
    label: 'Sports Equipment',
    labelDe: 'Sportartikel',
    icon: '⚽',
    avgResaleRate: 0.30,
    platforms: ['Ricardo', 'Tutti', 'Velonline']
  },
  garden: {
    label: 'Garden',
    labelDe: 'Garten',
    icon: '🌿',
    avgResaleRate: 0.20,
    platforms: ['Tutti', 'Ricardo', 'Local']
  },
  kids: {
    label: 'Kids Items',
    labelDe: 'Kinderartikel',
    icon: '🧸',
    avgResaleRate: 0.25,
    platforms: ['Tutti', 'Ricardo', 'Brocki']
  },
  art: {
    label: 'Art & Decor',
    labelDe: 'Kunst & Deko',
    icon: '🖼️',
    avgResaleRate: 0.40,
    platforms: ['Ricardo', 'Catawiki', 'Local galleries']
  },
  other: {
    label: 'Other',
    labelDe: 'Sonstiges',
    icon: '📦',
    avgResaleRate: 0.15,
    platforms: ['Ricardo', 'Tutti']
  }
};

export const CONDITION_CONFIG: Record<ItemCondition, {
  label: string;
  labelDe: string;
  multiplier: number;
  description: string;
}> = {
  excellent: {
    label: 'Excellent',
    labelDe: 'Ausgezeichnet',
    multiplier: 1.0,
    description: 'Like new, minimal signs of use'
  },
  good: {
    label: 'Good',
    labelDe: 'Gut',
    multiplier: 0.7,
    description: 'Normal wear, fully functional'
  },
  fair: {
    label: 'Fair',
    labelDe: 'Akzeptabel',
    multiplier: 0.4,
    description: 'Visible wear, still functional'
  },
  poor: {
    label: 'Poor',
    labelDe: 'Schlecht',
    multiplier: 0.15,
    description: 'Heavy wear, may need repair'
  },
  broken: {
    label: 'Broken',
    labelDe: 'Defekt',
    multiplier: 0,
    description: 'Not functional, for parts/recycling'
  }
};

export const DISPOSAL_METHOD_CONFIG: Record<DisposalMethod, {
  label: string;
  labelDe: string;
  icon: string;
  description: string;
  platformFee: number; // Our commission %
  customerBenefit: string;
}> = {
  sell: {
    label: 'Sell',
    labelDe: 'Verkaufen',
    icon: '💰',
    description: 'List on marketplaces, we handle everything',
    platformFee: 0.20, // 20% commission
    customerBenefit: 'Earn money from your old items'
  },
  donate: {
    label: 'Donate',
    labelDe: 'Spenden',
    icon: '❤️',
    description: 'Give to charity or social organizations',
    platformFee: 0,
    customerBenefit: 'Help others, get tax receipt'
  },
  recycle: {
    label: 'Recycle',
    labelDe: 'Recyceln',
    icon: '♻️',
    description: 'Eco-friendly disposal and material recovery',
    platformFee: 0,
    customerBenefit: 'Environmentally responsible disposal'
  },
  dispose: {
    label: 'Dispose',
    labelDe: 'Entsorgen',
    icon: '🗑️',
    description: 'Professional removal and disposal',
    platformFee: 0,
    customerBenefit: 'Quick removal, no hassle'
  }
};

export interface CircularEconomyEstimate {
  items: CircularItem[];
  totalEstimatedValue: number;
  totalPickupFee: number;
  platformCommission: number;
  customerPayout: number;
  co2Saved: number; // kg
  breakdown: {
    sell: { count: number; value: number };
    donate: { count: number; value: number };
    recycle: { count: number; value: number };
    dispose: { count: number; fee: number };
  };
}

// Pickup fees based on volume
export const PICKUP_FEES = {
  small: { maxM3: 1, fee: 50 },    // Single items
  medium: { maxM3: 3, fee: 120 },  // Multiple items
  large: { maxM3: 6, fee: 200 },   // Room clearance
  xl: { maxM3: 15, fee: 350 }      // Full apartment
};

// Partner organizations
export const CHARITY_PARTNERS = [
  { id: 'brocki', name: 'Brockenhaus', type: 'charity', accepts: ['furniture', 'clothing', 'books', 'kids'] },
  { id: 'caritas', name: 'Caritas', type: 'charity', accepts: ['clothing', 'furniture', 'appliances'] },
  { id: 'swr', name: 'Schweizer Rotes Kreuz', type: 'charity', accepts: ['clothing', 'kids'] },
  { id: 'emmaus', name: 'Emmaus', type: 'charity', accepts: ['furniture', 'electronics', 'appliances'] }
];

export const RECYCLING_PARTNERS = [
  { id: 'swico', name: 'SWICO Recycling', type: 'recycling', accepts: ['electronics'] },
  { id: 'sens', name: 'SENS eRecycling', type: 'recycling', accepts: ['appliances', 'electronics'] },
  { id: 'ferro', name: 'Ferro Recycling', type: 'recycling', accepts: ['appliances'] }
];

// Helper functions
export function generateItemId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function estimateValue(
  category: ItemCategory,
  condition: ItemCondition,
  originalPrice: number
): number {
  const categoryConfig = ITEM_CATEGORY_CONFIG[category];
  const conditionConfig = CONDITION_CONFIG[condition];
  
  return Math.round(originalPrice * categoryConfig.avgResaleRate * conditionConfig.multiplier);
}

export function recommendDisposalMethod(
  condition: ItemCondition,
  estimatedValue: number
): DisposalMethod {
  if (condition === 'broken') return 'recycle';
  if (estimatedValue >= 50) return 'sell';
  if (estimatedValue >= 10) return 'donate';
  if (condition === 'poor') return 'recycle';
  return 'donate';
}

export function calculatePickupFee(totalVolumeM3: number): number {
  if (totalVolumeM3 <= PICKUP_FEES.small.maxM3) return PICKUP_FEES.small.fee;
  if (totalVolumeM3 <= PICKUP_FEES.medium.maxM3) return PICKUP_FEES.medium.fee;
  if (totalVolumeM3 <= PICKUP_FEES.large.maxM3) return PICKUP_FEES.large.fee;
  return PICKUP_FEES.xl.fee;
}

export function estimateCO2Saved(items: CircularItem[]): number {
  // Rough estimate: 5kg CO2 saved per kg of reused/recycled material
  const avgWeightPerItem = 15; // kg
  const reusedItems = items.filter(i => i.recommendedMethod !== 'dispose');
  return reusedItems.length * avgWeightPerItem * 5;
}

export function calculateCircularEstimate(items: CircularItem[]): CircularEconomyEstimate {
  const breakdown = {
    sell: { count: 0, value: 0 },
    donate: { count: 0, value: 0 },
    recycle: { count: 0, value: 0 },
    dispose: { count: 0, fee: 0 }
  };

  items.forEach(item => {
    const method = item.recommendedMethod;
    if (method === 'sell') {
      breakdown.sell.count++;
      breakdown.sell.value += item.estimatedValue;
    } else if (method === 'donate') {
      breakdown.donate.count++;
      breakdown.donate.value += item.estimatedValue;
    } else if (method === 'recycle') {
      breakdown.recycle.count++;
    } else {
      breakdown.dispose.count++;
      breakdown.dispose.fee += 25; // Base disposal fee per item
    }
  });

  const totalEstimatedValue = breakdown.sell.value;
  const platformCommission = Math.round(totalEstimatedValue * 0.20);
  const customerPayout = totalEstimatedValue - platformCommission;
  
  const totalVolumeM3 = items.filter(i => i.pickupRequired).length * 0.3;
  const totalPickupFee = calculatePickupFee(totalVolumeM3);

  return {
    items,
    totalEstimatedValue,
    totalPickupFee,
    platformCommission,
    customerPayout: Math.max(0, customerPayout - totalPickupFee),
    co2Saved: estimateCO2Saved(items),
    breakdown
  };
}

// Create sample item
export function createCircularItem(
  name: string,
  category: ItemCategory,
  condition: ItemCondition,
  originalPrice: number
): CircularItem {
  const estimatedValue = estimateValue(category, condition, originalPrice);
  const recommendedMethod = recommendDisposalMethod(condition, estimatedValue);
  
  return {
    id: generateItemId(),
    name,
    category,
    condition,
    estimatedValue,
    recommendedMethod,
    pickupRequired: true
  };
}
