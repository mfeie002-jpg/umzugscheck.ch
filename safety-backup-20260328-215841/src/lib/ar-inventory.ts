/**
 * AR Inventory Scanner - Camera-based inventory estimation
 * Placeholder implementation for future AR/CV integration
 */

export interface InventoryItem {
  id: string;
  category: string;
  name: string;
  quantity: number;
  volume: number; // in m³
  weight: number; // in kg
  fragile: boolean;
  specialHandling: boolean;
  confidence: number; // 0-1 detection confidence
}

export interface RoomScan {
  id: string;
  roomType: RoomType;
  roomName: string;
  items: InventoryItem[];
  totalVolume: number;
  scanDate: Date;
  imageUrl?: string;
}

export type RoomType = 
  | 'living_room'
  | 'bedroom'
  | 'kitchen'
  | 'bathroom'
  | 'office'
  | 'storage'
  | 'garage'
  | 'balcony'
  | 'other';

export interface InventorySummary {
  totalRooms: number;
  totalItems: number;
  totalVolume: number;
  totalWeight: number;
  fragileItems: number;
  specialItems: number;
  estimatedBoxes: number;
  estimatedTruckSize: 'small' | 'medium' | 'large' | 'xlarge';
  confidence: number;
}

// Standard furniture items with typical dimensions
export const STANDARD_ITEMS: Record<string, Omit<InventoryItem, 'id' | 'quantity' | 'confidence'>> = {
  sofa_3seat: { category: 'Wohnzimmer', name: '3er-Sofa', volume: 1.5, weight: 80, fragile: false, specialHandling: false },
  sofa_2seat: { category: 'Wohnzimmer', name: '2er-Sofa', volume: 1.0, weight: 50, fragile: false, specialHandling: false },
  armchair: { category: 'Wohnzimmer', name: 'Sessel', volume: 0.5, weight: 25, fragile: false, specialHandling: false },
  coffee_table: { category: 'Wohnzimmer', name: 'Couchtisch', volume: 0.3, weight: 20, fragile: true, specialHandling: false },
  tv_stand: { category: 'Wohnzimmer', name: 'TV-Möbel', volume: 0.4, weight: 30, fragile: false, specialHandling: false },
  bookshelf: { category: 'Wohnzimmer', name: 'Bücherregal', volume: 0.8, weight: 40, fragile: false, specialHandling: false },
  
  double_bed: { category: 'Schlafzimmer', name: 'Doppelbett', volume: 2.0, weight: 100, fragile: false, specialHandling: true },
  single_bed: { category: 'Schlafzimmer', name: 'Einzelbett', volume: 1.2, weight: 60, fragile: false, specialHandling: false },
  wardrobe_large: { category: 'Schlafzimmer', name: 'Grosser Schrank', volume: 2.5, weight: 120, fragile: false, specialHandling: true },
  wardrobe_small: { category: 'Schlafzimmer', name: 'Kleiner Schrank', volume: 1.2, weight: 60, fragile: false, specialHandling: false },
  dresser: { category: 'Schlafzimmer', name: 'Kommode', volume: 0.5, weight: 35, fragile: false, specialHandling: false },
  nightstand: { category: 'Schlafzimmer', name: 'Nachttisch', volume: 0.1, weight: 10, fragile: false, specialHandling: false },
  
  dining_table: { category: 'Esszimmer', name: 'Esstisch', volume: 0.8, weight: 50, fragile: true, specialHandling: false },
  dining_chair: { category: 'Esszimmer', name: 'Essstuhl', volume: 0.15, weight: 8, fragile: false, specialHandling: false },
  
  desk: { category: 'Büro', name: 'Schreibtisch', volume: 0.6, weight: 40, fragile: false, specialHandling: false },
  office_chair: { category: 'Büro', name: 'Bürostuhl', volume: 0.3, weight: 15, fragile: false, specialHandling: false },
  filing_cabinet: { category: 'Büro', name: 'Aktenschrank', volume: 0.4, weight: 50, fragile: false, specialHandling: false },
  
  refrigerator: { category: 'Küche', name: 'Kühlschrank', volume: 0.8, weight: 80, fragile: true, specialHandling: true },
  washing_machine: { category: 'Küche', name: 'Waschmaschine', volume: 0.5, weight: 70, fragile: true, specialHandling: true },
  dishwasher: { category: 'Küche', name: 'Geschirrspüler', volume: 0.4, weight: 50, fragile: true, specialHandling: true },
  
  piano: { category: 'Spezial', name: 'Klavier', volume: 1.5, weight: 300, fragile: true, specialHandling: true },
  safe: { category: 'Spezial', name: 'Tresor', volume: 0.3, weight: 200, fragile: false, specialHandling: true },
  aquarium: { category: 'Spezial', name: 'Aquarium', volume: 0.4, weight: 150, fragile: true, specialHandling: true },
  
  moving_box_small: { category: 'Kartons', name: 'Umzugskarton klein', volume: 0.03, weight: 15, fragile: false, specialHandling: false },
  moving_box_medium: { category: 'Kartons', name: 'Umzugskarton mittel', volume: 0.05, weight: 20, fragile: false, specialHandling: false },
  moving_box_large: { category: 'Kartons', name: 'Umzugskarton gross', volume: 0.08, weight: 25, fragile: false, specialHandling: false },
};

/**
 * Get room type display name
 */
export function getRoomTypeName(type: RoomType): string {
  const names: Record<RoomType, string> = {
    living_room: 'Wohnzimmer',
    bedroom: 'Schlafzimmer',
    kitchen: 'Küche',
    bathroom: 'Badezimmer',
    office: 'Büro/Arbeitszimmer',
    storage: 'Abstellraum/Keller',
    garage: 'Garage',
    balcony: 'Balkon/Terrasse',
    other: 'Andere',
  };
  return names[type];
}

/**
 * Calculate inventory summary
 */
export function calculateSummary(scans: RoomScan[]): InventorySummary {
  const allItems = scans.flatMap(s => s.items);
  
  const totalVolume = allItems.reduce((sum, item) => sum + item.volume * item.quantity, 0);
  const totalWeight = allItems.reduce((sum, item) => sum + item.weight * item.quantity, 0);
  const fragileItems = allItems.filter(i => i.fragile).reduce((sum, i) => sum + i.quantity, 0);
  const specialItems = allItems.filter(i => i.specialHandling).reduce((sum, i) => sum + i.quantity, 0);
  
  // Estimate boxes (1 box = 0.05 m³ average)
  const estimatedBoxes = Math.ceil((totalVolume * 0.3) / 0.05);
  
  // Estimate truck size
  let estimatedTruckSize: InventorySummary['estimatedTruckSize'];
  if (totalVolume <= 15) estimatedTruckSize = 'small';
  else if (totalVolume <= 30) estimatedTruckSize = 'medium';
  else if (totalVolume <= 50) estimatedTruckSize = 'large';
  else estimatedTruckSize = 'xlarge';
  
  // Average confidence
  const confidence = allItems.length > 0
    ? allItems.reduce((sum, i) => sum + i.confidence, 0) / allItems.length
    : 0;
  
  return {
    totalRooms: scans.length,
    totalItems: allItems.reduce((sum, i) => sum + i.quantity, 0),
    totalVolume: Math.round(totalVolume * 10) / 10,
    totalWeight: Math.round(totalWeight),
    fragileItems,
    specialItems,
    estimatedBoxes,
    estimatedTruckSize,
    confidence: Math.round(confidence * 100) / 100,
  };
}

/**
 * Get truck size display info
 */
export function getTruckSizeInfo(size: InventorySummary['estimatedTruckSize']): {
  name: string;
  capacity: string;
  icon: string;
} {
  const info = {
    small: { name: 'Kleinbus (3.5t)', capacity: '10-15 m³', icon: '🚐' },
    medium: { name: 'Transporter (7.5t)', capacity: '20-30 m³', icon: '🚚' },
    large: { name: 'LKW (12t)', capacity: '35-50 m³', icon: '🚛' },
    xlarge: { name: 'Sattelzug (40t)', capacity: '80+ m³', icon: '🚛' },
  };
  return info[size];
}

/**
 * Create a manual room scan (for non-AR fallback)
 */
export function createManualScan(
  roomType: RoomType,
  roomName: string,
  items: Array<{ itemKey: string; quantity: number }>
): RoomScan {
  const inventoryItems: InventoryItem[] = items.map((item, index) => {
    const standardItem = STANDARD_ITEMS[item.itemKey];
    return {
      id: `item_${Date.now()}_${index}`,
      ...standardItem,
      quantity: item.quantity,
      confidence: 1.0, // Manual = full confidence
    };
  });
  
  return {
    id: `scan_${Date.now()}`,
    roomType,
    roomName,
    items: inventoryItems,
    totalVolume: inventoryItems.reduce((sum, i) => sum + i.volume * i.quantity, 0),
    scanDate: new Date(),
  };
}

/**
 * Simulate AR detection (placeholder for future implementation)
 */
export function simulateARDetection(roomType: RoomType): Promise<InventoryItem[]> {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Return typical items for room type
      const roomItems: Record<RoomType, string[]> = {
        living_room: ['sofa_3seat', 'coffee_table', 'tv_stand', 'bookshelf'],
        bedroom: ['double_bed', 'wardrobe_large', 'dresser', 'nightstand', 'nightstand'],
        kitchen: ['refrigerator', 'moving_box_medium', 'moving_box_medium'],
        bathroom: ['moving_box_small'],
        office: ['desk', 'office_chair', 'bookshelf', 'filing_cabinet'],
        storage: ['moving_box_large', 'moving_box_large', 'moving_box_medium'],
        garage: ['moving_box_large'],
        balcony: ['moving_box_small'],
        other: ['moving_box_medium'],
      };
      
      const itemKeys = roomItems[roomType] || [];
      const items: InventoryItem[] = itemKeys.map((key, index) => ({
        id: `ar_${Date.now()}_${index}`,
        ...STANDARD_ITEMS[key],
        quantity: 1,
        confidence: 0.7 + Math.random() * 0.25, // 70-95% confidence
      }));
      
      resolve(items);
    }, 2000);
  });
}
