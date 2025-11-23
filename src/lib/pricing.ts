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
