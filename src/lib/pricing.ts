// Pricing calculation utilities for Swiss moving companies

export interface MovingCalculation {
  volumeM3: number;
  estimatedHours: number;
  priceMin: number;
  priceMax: number;
  breakdown: {
    basePrice: number;
    distanceFee: number;
    floorFee: number;
    elevatorDiscount: number;
    total: number;
  };
}

// Base cubic meters per room type
const VOLUME_BY_ROOMS: Record<string, number> = {
  "1": 20,
  "2": 35,
  "3": 50,
  "4": 65,
  "5": 80,
  "6+": 100,
  "house": 120,
};

// CHF per cubic meter (varies by company, we use average)
const CHF_PER_M3 = {
  min: 35,
  max: 55,
};

// CHF per hour for workers (2-person team)
const CHF_PER_HOUR = {
  min: 140,
  max: 180,
};

// Hours calculation: ~8m³ per hour for packing + transport
const M3_PER_HOUR = 8;

// Distance-based fees
const calculateDistanceFee = (distanceKm: number): number => {
  if (distanceKm <= 10) return 0;
  if (distanceKm <= 50) return 150;
  if (distanceKm <= 100) return 300;
  if (distanceKm <= 200) return 500;
  return 800;
};

// Floor-based fees (per floor without elevator)
const FLOOR_FEE_PER_LEVEL = 100;

export const calculateQuickMovingPrice = (
  rooms: string,
  distanceKm: number,
  floorsFrom: number = 0,
  floorsTo: number = 0,
  hasElevatorFrom: boolean = false,
  hasElevatorTo: boolean = false
): MovingCalculation => {
  // Calculate volume
  const volumeM3 = VOLUME_BY_ROOMS[rooms] || 50;

  // Calculate estimated hours
  const baseHours = volumeM3 / M3_PER_HOUR;
  const travelHours = distanceKm / 50; // Average 50km/h
  const totalHours = Math.ceil(baseHours + travelHours + 1); // +1 for loading/unloading

  // Calculate base price
  const basePrice = volumeM3 * ((CHF_PER_M3.min + CHF_PER_M3.max) / 2);

  // Distance fee
  const distanceFee = calculateDistanceFee(distanceKm);

  // Floor fees
  let floorFee = 0;
  if (!hasElevatorFrom && floorsFrom > 0) {
    floorFee += floorsFrom * FLOOR_FEE_PER_LEVEL;
  }
  if (!hasElevatorTo && floorsTo > 0) {
    floorFee += floorsTo * FLOOR_FEE_PER_LEVEL;
  }

  // Elevator discount (if both have elevator, small discount)
  const elevatorDiscount = hasElevatorFrom && hasElevatorTo ? -100 : 0;

  // Total calculation
  const total = basePrice + distanceFee + floorFee + elevatorDiscount;

  // Add variation for min/max range (±15%)
  const priceMin = Math.round(total * 0.85);
  const priceMax = Math.round(total * 1.15);

  return {
    volumeM3,
    estimatedHours: totalHours,
    priceMin,
    priceMax,
    breakdown: {
      basePrice: Math.round(basePrice),
      distanceFee,
      floorFee,
      elevatorDiscount,
      total: Math.round(total),
    },
  };
};

export const calculateAdvancedMovingPrice = (
  inventory: {
    boxes: number;
    wardrobes: number;
    beds: number;
    sofas: number;
    tables: number;
    chairs: number;
  },
  distanceKm: number,
  extraServices: {
    cleaning: boolean;
    disposal: boolean;
    packing: boolean;
    storage: boolean;
    assembly: boolean;
    specialItems: boolean;
  },
  floorsFrom: number = 0,
  floorsTo: number = 0,
  hasElevatorFrom: boolean = false,
  hasElevatorTo: boolean = false
): MovingCalculation => {
  // Calculate volume from inventory (cubic meters)
  let volumeM3 = 0;
  volumeM3 += inventory.boxes * 0.5;
  volumeM3 += inventory.wardrobes * 2;
  volumeM3 += inventory.beds * 3;
  volumeM3 += inventory.sofas * 4;
  volumeM3 += inventory.tables * 1.5;
  volumeM3 += inventory.chairs * 0.3;

  // Ensure minimum volume
  volumeM3 = Math.max(volumeM3, 10);

  // Calculate base price
  const baseHours = volumeM3 / M3_PER_HOUR;
  const travelHours = distanceKm / 50;
  let totalHours = Math.ceil(baseHours + travelHours + 1);

  const basePrice = totalHours * ((CHF_PER_HOUR.min + CHF_PER_HOUR.max) / 2);

  // Distance fee
  const distanceFee = calculateDistanceFee(distanceKm);

  // Floor fees
  let floorFee = 0;
  if (!hasElevatorFrom && floorsFrom > 0) {
    floorFee += floorsFrom * FLOOR_FEE_PER_LEVEL;
  }
  if (!hasElevatorTo && floorsTo > 0) {
    floorFee += floorsTo * FLOOR_FEE_PER_LEVEL;
  }

  // Elevator discount
  const elevatorDiscount = hasElevatorFrom && hasElevatorTo ? -100 : 0;

  // Extra services fees
  let extraServicesFee = 0;
  if (extraServices.cleaning) extraServicesFee += 300;
  if (extraServices.disposal) extraServicesFee += 200;
  if (extraServices.packing) {
    extraServicesFee += volumeM3 * 15; // CHF 15 per m³
    totalHours += Math.ceil(volumeM3 / 10); // Extra packing time
  }
  if (extraServices.storage) extraServicesFee += 150; // Monthly rate
  if (extraServices.assembly) extraServicesFee += 250;
  if (extraServices.specialItems) extraServicesFee += 400; // Piano, art, etc.

  // Total calculation
  const total = basePrice + distanceFee + floorFee + elevatorDiscount + extraServicesFee;

  // Add variation for min/max range (±15%)
  const priceMin = Math.round(total * 0.85);
  const priceMax = Math.round(total * 1.15);

  return {
    volumeM3: Math.round(volumeM3),
    estimatedHours: totalHours,
    priceMin,
    priceMax,
    breakdown: {
      basePrice: Math.round(basePrice),
      distanceFee,
      floorFee,
      elevatorDiscount,
      total: Math.round(total),
    },
  };
};

// Estimate distance between Swiss postal codes (simplified)
export const estimateDistance = (fromPostal: string, toPostal: string): number => {
  // This is a simplified estimation. In production, use a proper API
  // For now, we'll use the first digit to estimate rough canton distance
  const from = parseInt(fromPostal.substring(0, 1));
  const to = parseInt(toPostal.substring(0, 1));
  
  const diff = Math.abs(from - to);
  
  // Rough estimation
  if (diff === 0) return 20; // Same region
  if (diff === 1) return 50; // Adjacent region
  if (diff === 2) return 100; // 2 regions apart
  return 150; // Far apart
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getMoveSize = (volumeM3: number): string => {
  if (volumeM3 < 25) return "Klein (Studio/1-Zimmer)";
  if (volumeM3 < 45) return "Mittel (2-3 Zimmer)";
  if (volumeM3 < 75) return "Gross (4-5 Zimmer)";
  return "Sehr gross (Haus/6+ Zimmer)";
};

// Calculate moving price from video analysis (volume + difficulty)
export const calculateVideoBasedPrice = (
  volumeM3: number,
  difficultyScore: number,
  distanceKm: number = 50
): MovingCalculation => {
  // Convert volume to approximate room count (avg 15-20m³ per room)
  const estimatedRoomsNum = Math.max(1, Math.min(5, Math.round(volumeM3 / 17)));
  const estimatedRooms = estimatedRoomsNum.toString() as "1" | "2" | "3" | "4" | "5" | "6+" | "house";
  
  // Use difficulty score to infer floor situation
  // Low difficulty (1-2) = ground floor or elevator
  // Medium difficulty (2.5-3.5) = 1-2 floors, possibly no elevator
  // High difficulty (4-5) = 3+ floors, no elevator
  const floorsOrigin = difficultyScore <= 2 ? 0 : difficultyScore <= 3.5 ? 2 : 4;
  const elevatorOrigin = difficultyScore <= 2;
  
  // Assume same conditions for destination (can be adjusted later)
  const floorsDestination = floorsOrigin;
  const elevatorDestination = elevatorOrigin;
  
  // Use existing pricing logic with custom distance
  const baseCalculation = calculateQuickMovingPrice(
    estimatedRooms,
    distanceKm,
    floorsOrigin,
    floorsDestination,
    elevatorOrigin,
    elevatorDestination
  );
  
  // Apply difficulty adjustment (±15%)
  const difficultyMultiplier = 0.85 + (difficultyScore / 5) * 0.3; // Range: 0.85 to 1.15
  
  const adjustedMin = Math.round(baseCalculation.priceMin * difficultyMultiplier);
  const adjustedMax = Math.round(baseCalculation.priceMax * difficultyMultiplier);
  
  return {
    volumeM3,
    priceMin: adjustedMin,
    priceMax: adjustedMax,
    estimatedHours: baseCalculation.estimatedHours,
    breakdown: {
      basePrice: Math.round((baseCalculation.breakdown.basePrice || 0) * difficultyMultiplier),
      distanceFee: baseCalculation.breakdown.distanceFee,
      floorFee: baseCalculation.breakdown.floorFee,
      elevatorDiscount: baseCalculation.breakdown.elevatorDiscount,
      total: Math.round(baseCalculation.breakdown.total * difficultyMultiplier)
    }
  };
};

// Cleaning Calculator Types and Functions
export interface CleaningCalculation {
  basePrice: number;
  servicesPrice: number;
  totalPrice: number;
  estimatedHours: number;
  priceRange: { min: number; max: number };
}

export interface CleaningCalculatorInput {
  cleaningType: 'end-of-lease' | 'regular' | 'deep-clean';
  squareMeters: number;
  rooms: number;
  bathrooms: number;
  hasBalcony: boolean;
  hasWindows: boolean;
  hasOven: boolean;
  hasCarpets: boolean;
  hasStorage: boolean;
}

export const calculateCleaningPrice = (input: CleaningCalculatorInput): CleaningCalculation => {
  // Base rates per square meter
  const baseRates = {
    'end-of-lease': 8, // CHF per m²
    'regular': 5,
    'deep-clean': 7
  };

  const baseRate = baseRates[input.cleaningType];
  const basePrice = input.squareMeters * baseRate;

  // Additional services pricing
  let servicesPrice = 0;
  
  if (input.hasWindows) {
    servicesPrice += input.rooms * 25; // CHF 25 per room for window cleaning
  }
  
  if (input.hasOven) {
    servicesPrice += 80; // CHF 80 for oven cleaning
  }
  
  if (input.hasBalcony) {
    servicesPrice += 50; // CHF 50 per balcony
  }
  
  if (input.hasCarpets) {
    servicesPrice += input.rooms * 40; // CHF 40 per room for carpet cleaning
  }
  
  if (input.hasStorage) {
    servicesPrice += 60; // CHF 60 for storage/basement cleaning
  }

  // Bathroom surcharge
  servicesPrice += (input.bathrooms - 1) * 50; // Extra CHF 50 per additional bathroom

  const totalPrice = basePrice + servicesPrice;
  
  // Estimate hours (roughly 20-30 CHF per hour labor cost)
  const estimatedHours = Math.ceil(totalPrice / 25);

  // Price range (±15%)
  const priceRange = {
    min: Math.round(totalPrice * 0.85),
    max: Math.round(totalPrice * 1.15)
  };

  return {
    basePrice: Math.round(basePrice),
    servicesPrice: Math.round(servicesPrice),
    totalPrice: Math.round(totalPrice),
    estimatedHours,
    priceRange
  };
};

// Storage Calculator
export interface StorageCalculation {
  monthlyPrice: number;
  setupFee: number;
  totalFirstMonth: number;
  priceRange: { min: number; max: number };
}

export interface StorageCalculatorInput {
  volumeM3: number;
  duration: number;
  climateControlled: boolean;
  insurance: boolean;
  accessFrequency: 'rare' | 'monthly' | 'weekly';
}

export const calculateStoragePrice = (input: StorageCalculatorInput): StorageCalculation => {
  // Base rate per m³ per month
  const baseRatePerM3 = input.climateControlled ? 35 : 25;
  const monthlyPrice = input.volumeM3 * baseRatePerM3;
  
  // Access frequency surcharge
  const accessFees = {
    'rare': 0,
    'monthly': 20,
    'weekly': 50
  };
  const accessFee = accessFees[input.accessFrequency];
  
  // Insurance (5% of monthly price)
  const insuranceFee = input.insurance ? monthlyPrice * 0.05 : 0;
  
  const totalMonthly = monthlyPrice + accessFee + insuranceFee;
  
  // Setup fee (one-time)
  const setupFee = 150;
  
  const totalFirstMonth = totalMonthly + setupFee;
  
  const priceRange = {
    min: Math.round(totalMonthly * 0.9),
    max: Math.round(totalMonthly * 1.1)
  };
  
  return {
    monthlyPrice: Math.round(totalMonthly),
    setupFee,
    totalFirstMonth: Math.round(totalFirstMonth),
    priceRange
  };
};

// Disposal Calculator
export interface DisposalCalculation {
  disposalFee: number;
  transportFee: number;
  totalPrice: number;
  priceRange: { min: number; max: number };
}

export interface DisposalCalculatorInput {
  volumeM3: number;
  hasHazardous: boolean;
  hasElectronics: boolean;
  hasFurniture: boolean;
  distance: number;
}

export const calculateDisposalPrice = (input: DisposalCalculatorInput): DisposalCalculation => {
  // Base disposal fee per m³
  const baseDisposalRate = 80;
  let disposalFee = input.volumeM3 * baseDisposalRate;
  
  // Special item surcharges
  if (input.hasHazardous) disposalFee += 200;
  if (input.hasElectronics) disposalFee += 100;
  if (input.hasFurniture) disposalFee += 150;
  
  // Transport fee based on distance
  const transportFee = input.distance <= 20 ? 100 : 100 + (input.distance - 20) * 3;
  
  const totalPrice = disposalFee + transportFee;
  
  const priceRange = {
    min: Math.round(totalPrice * 0.85),
    max: Math.round(totalPrice * 1.15)
  };
  
  return {
    disposalFee: Math.round(disposalFee),
    transportFee: Math.round(transportFee),
    totalPrice: Math.round(totalPrice),
    priceRange
  };
};

// Packing Calculator
export interface PackingCalculation {
  materialCost: number;
  laborCost: number;
  totalPrice: number;
  estimatedHours: number;
  priceRange: { min: number; max: number };
}

export interface PackingCalculatorInput {
  rooms: number;
  hasFragileItems: boolean;
  hasArtwork: boolean;
  packingLevel: 'partial' | 'full';
}

export const calculatePackingPrice = (input: PackingCalculatorInput): PackingCalculation => {
  // Material costs per room
  const materialPerRoom = input.packingLevel === 'full' ? 120 : 60;
  let materialCost = input.rooms * materialPerRoom;
  
  // Special item surcharges
  if (input.hasFragileItems) materialCost += 80;
  if (input.hasArtwork) materialCost += 150;
  
  // Labor costs (2 hours per room for full, 1 hour for partial)
  const hoursPerRoom = input.packingLevel === 'full' ? 2 : 1;
  const estimatedHours = input.rooms * hoursPerRoom;
  const laborCost = estimatedHours * 80; // CHF 80/hour
  
  const totalPrice = materialCost + laborCost;
  
  const priceRange = {
    min: Math.round(totalPrice * 0.85),
    max: Math.round(totalPrice * 1.15)
  };
  
  return {
    materialCost: Math.round(materialCost),
    laborCost: Math.round(laborCost),
    totalPrice: Math.round(totalPrice),
    estimatedHours,
    priceRange
  };
};

// Assembly Calculator
export interface AssemblyCalculation {
  laborCost: number;
  estimatedHours: number;
  totalPrice: number;
  priceRange: { min: number; max: number };
}

export interface AssemblyCalculatorInput {
  furnitureItems: {
    beds: number;
    wardrobes: number;
    shelves: number;
    tables: number;
    chairs: number;
    kitchen: number;
  };
  hasComplexItems: boolean;
}

export const calculateAssemblyPrice = (input: AssemblyCalculatorInput): AssemblyCalculation => {
  // Hours per furniture type
  let totalHours = 0;
  totalHours += input.furnitureItems.beds * 1.5;
  totalHours += input.furnitureItems.wardrobes * 2;
  totalHours += input.furnitureItems.shelves * 1;
  totalHours += input.furnitureItems.tables * 0.5;
  totalHours += input.furnitureItems.chairs * 0.25;
  totalHours += input.furnitureItems.kitchen * 3;
  
  // Complex items surcharge
  if (input.hasComplexItems) totalHours += 2;
  
  const estimatedHours = Math.ceil(totalHours);
  const laborCost = estimatedHours * 90; // CHF 90/hour
  
  const priceRange = {
    min: Math.round(laborCost * 0.85),
    max: Math.round(laborCost * 1.15)
  };
  
  return {
    laborCost,
    estimatedHours,
    totalPrice: laborCost,
    priceRange
  };
};
