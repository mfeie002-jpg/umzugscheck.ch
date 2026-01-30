/**
 * Sustainability Module Types
 * CO2 footprint calculation and eco-scoring for moves
 */

export interface EcoScoreResult {
  overallScore: 'A' | 'B' | 'C' | 'D' | 'E'; // A = best, E = worst
  totalCO2kg: number;
  breakdown: {
    transport: number;
    waste: number;
    packaging: number;
  };
  recommendations: EcoRecommendation[];
  comparison: {
    vsAverageCH: number; // percentage vs Swiss average
    treesEquivalent: number; // trees needed to offset
    carKmEquivalent: number; // equivalent car driving
  };
}

export interface EcoRecommendation {
  id: string;
  category: 'transport' | 'waste' | 'packaging' | 'timing';
  title: string;
  description: string;
  savingsCO2kg: number;
  effort: 'niedrig' | 'mittel' | 'hoch';
  icon: string;
}

export interface MoveEcoInput {
  distanceKm: number;
  roomCount: number;
  wasteVolumeLiters?: number;
  usePublicTransit?: boolean;
  vehicleType?: 'small_van' | 'medium_truck' | 'large_truck';
  isSharedMove?: boolean;
  recyclables?: {
    paper: boolean;
    glass: boolean;
    metal: boolean;
    electronics: boolean;
    textiles: boolean;
  };
}

// CO2 emission factors (kg CO2 per unit)
export const CO2_FACTORS = {
  // Transport (kg CO2 per km)
  transport: {
    small_van: 0.21, // 3.5t van
    medium_truck: 0.35, // 7.5t truck
    large_truck: 0.52, // 18t truck
    train_freight: 0.03,
    shared_move_discount: 0.4, // 40% reduction for shared moves
  },
  
  // Waste disposal (kg CO2 per kg waste)
  waste: {
    landfill: 0.58,
    incineration: 0.35,
    recycling: 0.08,
    composting: 0.02,
  },
  
  // Packaging materials (kg CO2 per unit)
  packaging: {
    cardboard_box: 0.8, // per box
    bubble_wrap_meter: 0.4,
    tape_roll: 0.2,
    reusable_crate: 0.1, // amortized
  },
  
  // Average Swiss move reference
  average_swiss_move: {
    co2_3room: 180, // kg CO2
    co2_4room: 250,
    co2_house: 420,
  }
};

// Score thresholds (kg CO2)
export const ECO_SCORE_THRESHOLDS = {
  A: 100, // < 100 kg
  B: 180, // 100-180 kg
  C: 280, // 180-280 kg
  D: 400, // 280-400 kg
  // E: > 400 kg
};
