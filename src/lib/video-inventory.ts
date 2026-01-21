/**
 * AI Video Inventory - Computer Vision Engine
 * Analyzes room videos to detect and catalog furniture/items automatically
 */

export interface DetectedItem {
  id: string;
  name: string;
  category: ItemCategory;
  confidence: number; // 0-1
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  estimatedVolume: number; // cubic meters
  estimatedWeight: number; // kg
  fragility: 'low' | 'medium' | 'high';
  specialHandling?: string[];
  timestamp?: number; // video timestamp in seconds
}

export type ItemCategory = 
  | 'furniture_large'      // Sofas, beds, wardrobes
  | 'furniture_medium'     // Tables, chairs, dressers
  | 'furniture_small'      // Nightstands, shelves
  | 'electronics'          // TVs, computers, appliances
  | 'kitchen'              // Appliances, cookware
  | 'bathroom'             // Fixtures, accessories
  | 'bedroom'              // Mattresses, linens
  | 'office'               // Desks, office equipment
  | 'outdoor'              // Patio furniture, garden tools
  | 'boxes'                // Moving boxes, containers
  | 'art_decor'            // Paintings, sculptures
  | 'plants'               // Indoor plants
  | 'fragile'              // Glass, mirrors, ceramics
  | 'misc';                // Other items

export const ITEM_CATEGORY_CONFIG: Record<ItemCategory, {
  label: string;
  labelDe: string;
  icon: string;
  avgVolume: number;
  avgWeight: number;
  defaultFragility: 'low' | 'medium' | 'high';
}> = {
  furniture_large: {
    label: 'Large Furniture',
    labelDe: 'Grosse Möbel',
    icon: '🛋️',
    avgVolume: 2.5,
    avgWeight: 80,
    defaultFragility: 'medium'
  },
  furniture_medium: {
    label: 'Medium Furniture',
    labelDe: 'Mittlere Möbel',
    icon: '🪑',
    avgVolume: 0.8,
    avgWeight: 25,
    defaultFragility: 'medium'
  },
  furniture_small: {
    label: 'Small Furniture',
    labelDe: 'Kleine Möbel',
    icon: '🗄️',
    avgVolume: 0.3,
    avgWeight: 10,
    defaultFragility: 'low'
  },
  electronics: {
    label: 'Electronics',
    labelDe: 'Elektronik',
    icon: '📺',
    avgVolume: 0.2,
    avgWeight: 15,
    defaultFragility: 'high'
  },
  kitchen: {
    label: 'Kitchen Items',
    labelDe: 'Küchengeräte',
    icon: '🍳',
    avgVolume: 0.15,
    avgWeight: 8,
    defaultFragility: 'medium'
  },
  bathroom: {
    label: 'Bathroom Items',
    labelDe: 'Bad-Artikel',
    icon: '🚿',
    avgVolume: 0.1,
    avgWeight: 5,
    defaultFragility: 'medium'
  },
  bedroom: {
    label: 'Bedroom Items',
    labelDe: 'Schlafzimmer',
    icon: '🛏️',
    avgVolume: 1.2,
    avgWeight: 20,
    defaultFragility: 'low'
  },
  office: {
    label: 'Office Equipment',
    labelDe: 'Büroausstattung',
    icon: '💼',
    avgVolume: 0.4,
    avgWeight: 15,
    defaultFragility: 'medium'
  },
  outdoor: {
    label: 'Outdoor Items',
    labelDe: 'Outdoor-Artikel',
    icon: '🌿',
    avgVolume: 0.6,
    avgWeight: 20,
    defaultFragility: 'low'
  },
  boxes: {
    label: 'Boxes & Containers',
    labelDe: 'Kartons & Container',
    icon: '📦',
    avgVolume: 0.06,
    avgWeight: 15,
    defaultFragility: 'medium'
  },
  art_decor: {
    label: 'Art & Decor',
    labelDe: 'Kunst & Deko',
    icon: '🖼️',
    avgVolume: 0.1,
    avgWeight: 5,
    defaultFragility: 'high'
  },
  plants: {
    label: 'Plants',
    labelDe: 'Pflanzen',
    icon: '🪴',
    avgVolume: 0.15,
    avgWeight: 8,
    defaultFragility: 'high'
  },
  fragile: {
    label: 'Fragile Items',
    labelDe: 'Zerbrechliche Artikel',
    icon: '⚠️',
    avgVolume: 0.1,
    avgWeight: 3,
    defaultFragility: 'high'
  },
  misc: {
    label: 'Miscellaneous',
    labelDe: 'Sonstiges',
    icon: '📋',
    avgVolume: 0.2,
    avgWeight: 10,
    defaultFragility: 'low'
  }
};

export interface RoomScan {
  id: string;
  roomName: string;
  roomType: RoomType;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration: number; // seconds
  detectedItems: DetectedItem[];
  totalVolume: number;
  totalWeight: number;
  scanStatus: 'pending' | 'processing' | 'completed' | 'failed';
  confidence: number; // overall scan confidence 0-1
  createdAt: Date;
  completedAt?: Date;
}

export type RoomType = 
  | 'living_room'
  | 'bedroom'
  | 'kitchen'
  | 'bathroom'
  | 'office'
  | 'dining_room'
  | 'basement'
  | 'attic'
  | 'garage'
  | 'balcony'
  | 'storage'
  | 'other';

export const ROOM_TYPE_CONFIG: Record<RoomType, {
  label: string;
  labelDe: string;
  icon: string;
  typicalItems: ItemCategory[];
  avgItemCount: number;
}> = {
  living_room: {
    label: 'Living Room',
    labelDe: 'Wohnzimmer',
    icon: '🛋️',
    typicalItems: ['furniture_large', 'furniture_medium', 'electronics', 'art_decor'],
    avgItemCount: 15
  },
  bedroom: {
    label: 'Bedroom',
    labelDe: 'Schlafzimmer',
    icon: '🛏️',
    typicalItems: ['furniture_large', 'bedroom', 'furniture_small'],
    avgItemCount: 12
  },
  kitchen: {
    label: 'Kitchen',
    labelDe: 'Küche',
    icon: '🍳',
    typicalItems: ['kitchen', 'electronics', 'furniture_medium'],
    avgItemCount: 25
  },
  bathroom: {
    label: 'Bathroom',
    labelDe: 'Badezimmer',
    icon: '🚿',
    typicalItems: ['bathroom', 'furniture_small'],
    avgItemCount: 8
  },
  office: {
    label: 'Office',
    labelDe: 'Büro',
    icon: '💼',
    typicalItems: ['office', 'electronics', 'furniture_medium'],
    avgItemCount: 10
  },
  dining_room: {
    label: 'Dining Room',
    labelDe: 'Esszimmer',
    icon: '🍽️',
    typicalItems: ['furniture_large', 'furniture_medium', 'art_decor'],
    avgItemCount: 8
  },
  basement: {
    label: 'Basement',
    labelDe: 'Keller',
    icon: '🏚️',
    typicalItems: ['boxes', 'outdoor', 'misc'],
    avgItemCount: 20
  },
  attic: {
    label: 'Attic',
    labelDe: 'Dachboden',
    icon: '🏠',
    typicalItems: ['boxes', 'misc', 'furniture_small'],
    avgItemCount: 15
  },
  garage: {
    label: 'Garage',
    labelDe: 'Garage',
    icon: '🚗',
    typicalItems: ['outdoor', 'boxes', 'misc'],
    avgItemCount: 18
  },
  balcony: {
    label: 'Balcony',
    labelDe: 'Balkon',
    icon: '🌅',
    typicalItems: ['outdoor', 'plants'],
    avgItemCount: 6
  },
  storage: {
    label: 'Storage',
    labelDe: 'Abstellraum',
    icon: '📦',
    typicalItems: ['boxes', 'misc'],
    avgItemCount: 12
  },
  other: {
    label: 'Other',
    labelDe: 'Sonstiges',
    icon: '📋',
    typicalItems: ['misc'],
    avgItemCount: 5
  }
};

export interface VideoInventorySession {
  id: string;
  userId?: string;
  roomScans: RoomScan[];
  totalVolume: number;
  totalWeight: number;
  totalItems: number;
  estimatedBoxCount: number;
  estimatedTruckSize: 'transporter' | 'small' | 'medium' | 'large' | 'xl';
  estimatedCrewSize: number;
  estimatedDuration: number; // hours
  priceEstimate: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'in_progress' | 'completed' | 'expired';
  createdAt: Date;
  completedAt?: Date;
  expiresAt: Date;
}

// Helper functions
export function generateItemId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateRoomId(): string {
  return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function calculateTotalVolume(items: DetectedItem[]): number {
  return items.reduce((sum, item) => sum + item.estimatedVolume, 0);
}

export function calculateTotalWeight(items: DetectedItem[]): number {
  return items.reduce((sum, item) => sum + item.estimatedWeight, 0);
}

export function estimateBoxCount(volume: number): number {
  // Average moving box: 0.06 m³
  // Only ~60% of items go in boxes
  return Math.ceil((volume * 0.6) / 0.06);
}

export function estimateTruckSize(volume: number): VideoInventorySession['estimatedTruckSize'] {
  if (volume <= 10) return 'transporter'; // Up to 10m³
  if (volume <= 20) return 'small';       // Up to 20m³
  if (volume <= 35) return 'medium';      // Up to 35m³
  if (volume <= 50) return 'large';       // Up to 50m³
  return 'xl';                            // Over 50m³
}

export function estimateCrewSize(volume: number, floors: number = 1): number {
  const baseCrewByVolume = volume <= 20 ? 2 : volume <= 40 ? 3 : 4;
  const floorModifier = floors > 3 ? 1 : 0;
  return baseCrewByVolume + floorModifier;
}

export function estimateDuration(volume: number, floors: number = 1, hasElevator: boolean = true): number {
  // Base: 1 hour per 5m³
  const baseHours = volume / 5;
  
  // Floor modifier
  const floorMultiplier = hasElevator ? 1 : 1 + (floors * 0.1);
  
  // Minimum 2 hours, maximum 12 hours
  return Math.max(2, Math.min(12, Math.ceil(baseHours * floorMultiplier)));
}

export function estimatePrice(
  volume: number, 
  distance: number = 20,
  floors: number = 1,
  hasElevator: boolean = true
): { min: number; max: number; currency: string } {
  // Swiss pricing model
  const basePerM3 = 45; // CHF per m³
  const distanceCost = distance * 2.5; // CHF per km
  const floorCost = hasElevator ? 0 : floors * 50;
  
  const basePrice = (volume * basePerM3) + distanceCost + floorCost;
  
  return {
    min: Math.round(basePrice * 0.85),
    max: Math.round(basePrice * 1.25),
    currency: 'CHF'
  };
}

// Mock AI detection for demo purposes
// In production, this would call a computer vision API
export function mockDetectItems(roomType: RoomType): DetectedItem[] {
  const config = ROOM_TYPE_CONFIG[roomType];
  const itemCount = Math.floor(config.avgItemCount * (0.7 + Math.random() * 0.6));
  
  const items: DetectedItem[] = [];
  
  for (let i = 0; i < itemCount; i++) {
    const categoryIndex = Math.floor(Math.random() * config.typicalItems.length);
    const category = config.typicalItems[categoryIndex];
    const categoryConfig = ITEM_CATEGORY_CONFIG[category];
    
    items.push({
      id: generateItemId(),
      name: `${categoryConfig.labelDe} ${i + 1}`,
      category,
      confidence: 0.7 + Math.random() * 0.3,
      estimatedVolume: categoryConfig.avgVolume * (0.5 + Math.random()),
      estimatedWeight: categoryConfig.avgWeight * (0.5 + Math.random()),
      fragility: categoryConfig.defaultFragility,
      timestamp: Math.random() * 60
    });
  }
  
  return items;
}

export function createEmptySession(): VideoInventorySession {
  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  return {
    id: generateSessionId(),
    roomScans: [],
    totalVolume: 0,
    totalWeight: 0,
    totalItems: 0,
    estimatedBoxCount: 0,
    estimatedTruckSize: 'transporter',
    estimatedCrewSize: 2,
    estimatedDuration: 2,
    priceEstimate: { min: 0, max: 0, currency: 'CHF' },
    status: 'in_progress',
    createdAt: now,
    expiresAt: expires
  };
}

export function updateSessionTotals(session: VideoInventorySession): VideoInventorySession {
  const allItems = session.roomScans.flatMap(scan => scan.detectedItems);
  
  const totalVolume = calculateTotalVolume(allItems);
  const totalWeight = calculateTotalWeight(allItems);
  
  return {
    ...session,
    totalVolume,
    totalWeight,
    totalItems: allItems.length,
    estimatedBoxCount: estimateBoxCount(totalVolume),
    estimatedTruckSize: estimateTruckSize(totalVolume),
    estimatedCrewSize: estimateCrewSize(totalVolume),
    estimatedDuration: estimateDuration(totalVolume),
    priceEstimate: estimatePrice(totalVolume)
  };
}

// Confidence thresholds
export const CONFIDENCE_THRESHOLDS = {
  high: 0.85,
  medium: 0.7,
  low: 0.5
};

export function getConfidenceLevel(confidence: number): 'high' | 'medium' | 'low' | 'uncertain' {
  if (confidence >= CONFIDENCE_THRESHOLDS.high) return 'high';
  if (confidence >= CONFIDENCE_THRESHOLDS.medium) return 'medium';
  if (confidence >= CONFIDENCE_THRESHOLDS.low) return 'low';
  return 'uncertain';
}

export function getConfidenceColor(level: 'high' | 'medium' | 'low' | 'uncertain'): string {
  switch (level) {
    case 'high': return 'text-green-600 bg-green-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-orange-600 bg-orange-100';
    case 'uncertain': return 'text-red-600 bg-red-100';
  }
}
