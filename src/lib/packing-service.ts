/**
 * Packing Service Module
 * Critical upsell: Most customers don't know packing is separate from moving
 */

export type PackingServiceType = 'full' | 'partial' | 'fragile_only' | 'diy';

export interface PackingServiceOption {
  id: PackingServiceType;
  name: string;
  nameDe: string;
  description: string;
  descriptionDe: string;
  includes: string[];
  includesDe: string[];
  pricePerM3: number; // CHF per cubic meter
  pricePerHour: number; // CHF per hour (alternative)
  estimatedTimeMultiplier: number; // How much longer than DIY
  popularityRank: number;
  recommended?: boolean;
}

export const PACKING_SERVICE_OPTIONS: PackingServiceOption[] = [
  {
    id: 'full',
    name: 'Full Service',
    nameDe: 'Rundum-Sorglos-Paket',
    description: 'We pack everything, you relax',
    descriptionDe: 'Wir packen alles ein und aus – Sie entspannen',
    includes: [
      'Professional packing of all items',
      'All packing materials included',
      'Labeling and inventory list',
      'Unpacking at destination',
      'Removal of packing materials'
    ],
    includesDe: [
      'Professionelles Einpacken aller Gegenstände',
      'Alle Verpackungsmaterialien inklusive',
      'Beschriftung und Inventarliste',
      'Auspacken am Zielort',
      'Entsorgung des Verpackungsmaterials'
    ],
    pricePerM3: 35,
    pricePerHour: 65,
    estimatedTimeMultiplier: 0.3, // Saves 70% of your time
    popularityRank: 1,
    recommended: true
  },
  {
    id: 'partial',
    name: 'Partial Packing',
    nameDe: 'Teil-Verpackung',
    description: 'We pack the tricky stuff, you do the rest',
    descriptionDe: 'Wir packen das Schwierige, Sie den Rest',
    includes: [
      'Packing of kitchen and bathroom',
      'Packing of wardrobes and closets',
      'Packing materials for selected areas',
      'Unpacking of packed areas'
    ],
    includesDe: [
      'Einpacken von Küche und Bad',
      'Einpacken von Schränken und Kleiderschränken',
      'Verpackungsmaterial für gewählte Bereiche',
      'Auspacken der gepackten Bereiche'
    ],
    pricePerM3: 22,
    pricePerHour: 55,
    estimatedTimeMultiplier: 0.5,
    popularityRank: 2
  },
  {
    id: 'fragile_only',
    name: 'Fragile Items Only',
    nameDe: 'Nur Zerbrechliches',
    description: 'Expert handling for delicate items',
    descriptionDe: 'Expertenhände für empfindliche Sachen',
    includes: [
      'Professional packing of fragile items',
      'Special materials for glass and ceramics',
      'Art and mirror protection',
      'Electronics packaging'
    ],
    includesDe: [
      'Professionelles Verpacken zerbrechlicher Gegenstände',
      'Spezialmaterial für Glas und Keramik',
      'Kunst- und Spiegelschutz',
      'Elektronik-Verpackung'
    ],
    pricePerM3: 45,
    pricePerHour: 75,
    estimatedTimeMultiplier: 0.7,
    popularityRank: 3
  },
  {
    id: 'diy',
    name: 'Self-Pack',
    nameDe: 'Selbst Einpacken',
    description: 'You pack, we just move',
    descriptionDe: 'Sie packen, wir transportieren',
    includes: [
      'Moving boxes available for purchase',
      'Packing materials available',
      'Tips and checklist provided',
      'Loading/unloading only'
    ],
    includesDe: [
      'Umzugskartons zum Kauf verfügbar',
      'Verpackungsmaterial erhältlich',
      'Tipps und Checkliste inklusive',
      'Nur Be- und Entladen'
    ],
    pricePerM3: 0,
    pricePerHour: 0,
    estimatedTimeMultiplier: 1,
    popularityRank: 4
  }
];

export interface PackingMaterial {
  id: string;
  name: string;
  nameDe: string;
  description: string;
  pricePerUnit: number;
  unit: string;
  unitDe: string;
  icon: string;
}

export const PACKING_MATERIALS: PackingMaterial[] = [
  {
    id: 'standard_box',
    name: 'Standard Moving Box',
    nameDe: 'Standard Umzugskarton',
    description: '60x40x40cm, double-walled',
    pricePerUnit: 4.50,
    unit: 'piece',
    unitDe: 'Stück',
    icon: '📦'
  },
  {
    id: 'book_box',
    name: 'Book/Heavy Box',
    nameDe: 'Bücher-/Schwerkarton',
    description: '40x30x30cm, reinforced',
    pricePerUnit: 5.00,
    unit: 'piece',
    unitDe: 'Stück',
    icon: '📚'
  },
  {
    id: 'wardrobe_box',
    name: 'Wardrobe Box',
    nameDe: 'Kleiderbox',
    description: 'Hanging clothes, includes bar',
    pricePerUnit: 15.00,
    unit: 'piece',
    unitDe: 'Stück',
    icon: '👔'
  },
  {
    id: 'bubble_wrap',
    name: 'Bubble Wrap',
    nameDe: 'Luftpolsterfolie',
    description: 'For fragile items',
    pricePerUnit: 12.00,
    unit: 'roll (10m)',
    unitDe: 'Rolle (10m)',
    icon: '🔘'
  },
  {
    id: 'packing_paper',
    name: 'Packing Paper',
    nameDe: 'Packpapier',
    description: 'Acid-free, for wrapping',
    pricePerUnit: 8.00,
    unit: 'kg',
    unitDe: 'kg',
    icon: '📄'
  },
  {
    id: 'tape',
    name: 'Packing Tape',
    nameDe: 'Paketklebeband',
    description: 'Strong adhesive, 50m roll',
    pricePerUnit: 3.50,
    unit: 'roll',
    unitDe: 'Rolle',
    icon: '🎀'
  },
  {
    id: 'mattress_cover',
    name: 'Mattress Cover',
    nameDe: 'Matratzenhülle',
    description: 'Waterproof protection',
    pricePerUnit: 18.00,
    unit: 'piece',
    unitDe: 'Stück',
    icon: '🛏️'
  },
  {
    id: 'furniture_blanket',
    name: 'Furniture Blanket',
    nameDe: 'Möbeldecke',
    description: 'Padded protection',
    pricePerUnit: 25.00,
    unit: 'piece',
    unitDe: 'Stück',
    icon: '🧥'
  }
];

export interface PackingEstimate {
  serviceType: PackingServiceType;
  volumeM3: number;
  estimatedHours: number;
  laborCost: number;
  materialsCost: number;
  totalCost: number;
  savings: {
    timeHours: number;
    stressLevel: 'low' | 'medium' | 'high';
  };
  recommendedMaterials: Array<{
    material: PackingMaterial;
    quantity: number;
    subtotal: number;
  }>;
}

export function calculatePackingEstimate(
  volumeM3: number,
  serviceType: PackingServiceType,
  includeUnpacking: boolean = true
): PackingEstimate {
  const service = PACKING_SERVICE_OPTIONS.find(s => s.id === serviceType)!;
  
  // Base hours: 1 hour per 3m³ for full service
  const baseHours = volumeM3 / 3;
  const estimatedHours = serviceType === 'diy' ? 0 : Math.ceil(baseHours * (serviceType === 'full' ? 1.5 : serviceType === 'partial' ? 1 : 0.5));
  
  // Labor cost
  const laborCost = estimatedHours * service.pricePerHour;
  
  // Materials estimate
  const boxesNeeded = Math.ceil(volumeM3 * 10); // ~10 boxes per m³
  const recommendedMaterials: PackingEstimate['recommendedMaterials'] = [];
  
  if (serviceType !== 'diy') {
    // Full/partial include materials
    recommendedMaterials.push({
      material: PACKING_MATERIALS.find(m => m.id === 'standard_box')!,
      quantity: Math.ceil(boxesNeeded * 0.7),
      subtotal: Math.ceil(boxesNeeded * 0.7) * 4.50
    });
    recommendedMaterials.push({
      material: PACKING_MATERIALS.find(m => m.id === 'book_box')!,
      quantity: Math.ceil(boxesNeeded * 0.2),
      subtotal: Math.ceil(boxesNeeded * 0.2) * 5.00
    });
    recommendedMaterials.push({
      material: PACKING_MATERIALS.find(m => m.id === 'bubble_wrap')!,
      quantity: Math.ceil(volumeM3 / 5),
      subtotal: Math.ceil(volumeM3 / 5) * 12.00
    });
  }
  
  const materialsCost = serviceType === 'full' || serviceType === 'partial' 
    ? 0 // Included in service
    : recommendedMaterials.reduce((sum, m) => sum + m.subtotal, 0);
  
  // Time savings calculation (DIY would take X hours)
  const diyHours = volumeM3 * 2; // 2 hours per m³ for DIY
  const timeHoursSaved = serviceType === 'diy' ? 0 : Math.round(diyHours * (1 - service.estimatedTimeMultiplier));
  
  return {
    serviceType,
    volumeM3,
    estimatedHours,
    laborCost,
    materialsCost,
    totalCost: laborCost + materialsCost,
    savings: {
      timeHours: timeHoursSaved,
      stressLevel: serviceType === 'full' ? 'low' : serviceType === 'partial' ? 'medium' : 'high'
    },
    recommendedMaterials
  };
}

// Key differentiator messaging
export const PACKING_VS_MOVING_EXPLAINER = {
  title: 'Umzug ≠ Einpacken',
  titleEn: 'Moving ≠ Packing',
  subtitle: 'Was viele nicht wissen',
  subtitleEn: 'What many don\'t realize',
  points: [
    {
      icon: '🚚',
      title: 'Umzug / Transport',
      titleEn: 'Moving / Transport',
      description: 'Möbel und Kartons von A nach B transportieren',
      descriptionEn: 'Transporting furniture and boxes from A to B',
      included: true
    },
    {
      icon: '📦',
      title: 'Einpacken',
      titleEn: 'Packing',
      description: 'Geschirr, Kleidung, Bücher etc. in Kartons verpacken',
      descriptionEn: 'Packing dishes, clothes, books etc. into boxes',
      included: false,
      note: 'Separater Service'
    },
    {
      icon: '🎁',
      title: 'Auspacken',
      titleEn: 'Unpacking',
      description: 'Kartons am Zielort auspacken und einräumen',
      descriptionEn: 'Unpacking boxes at destination',
      included: false,
      note: 'Separater Service'
    }
  ],
  cta: 'Zeit sparen: Verpackungsservice dazu buchen',
  ctaEn: 'Save time: Add packing service'
};

export function getServiceRecommendation(
  volumeM3: number,
  hasFragileItems: boolean,
  hasLimitedTime: boolean,
  budget: 'low' | 'medium' | 'high'
): PackingServiceType {
  if (budget === 'high' || (hasLimitedTime && hasFragileItems)) {
    return 'full';
  }
  if (hasFragileItems && budget !== 'low') {
    return 'fragile_only';
  }
  if (hasLimitedTime || volumeM3 > 30) {
    return 'partial';
  }
  return 'diy';
}
