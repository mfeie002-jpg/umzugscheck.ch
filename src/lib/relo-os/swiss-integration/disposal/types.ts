/**
 * Disposal Planning Types
 * 
 * Swiss waste disposal and recycling management
 */

export type DisposalType = 'collection' | 'drop_off' | 'special';

export interface DisposalCategory {
  id: string;
  name_de: string;
  name_fr?: string;
  name_it?: string;
  icon: string;
  disposal_type: DisposalType;
  description_de?: string;
  tips_de?: string;
}

export interface RecyclingCenter {
  id: string;
  city_slug: string;
  postal_code?: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  opening_hours?: Record<string, string>;
  accepted_categories: string[];
  website_url?: string;
  phone?: string;
  is_active: boolean;
}

export interface DisposalSchedule {
  category_id: string;
  next_collection?: Date;
  frequency?: 'weekly' | 'biweekly' | 'monthly';
  calendar_url?: string;
}

export interface DisposalPlanRequest {
  postalCode: string;
  moveDate: string; // ISO date
  items?: string[]; // Item descriptions to classify
}

export interface DisposalPlanResult {
  categories: DisposalCategory[];
  nearbyRecyclingCenters: RecyclingCenter[];
  schedules: DisposalSchedule[];
  recommendations: DisposalRecommendation[];
}

export interface DisposalRecommendation {
  category_id: string;
  recommendation: string;
  urgency: 'low' | 'medium' | 'high';
  deadline?: Date;
}

// Common moving items and their disposal categories
export const MOVING_ITEMS_MAPPING: Record<string, string> = {
  // Furniture
  'sofa': 'sperrgut',
  'couch': 'sperrgut',
  'mattress': 'sperrgut',
  'matratze': 'sperrgut',
  'schrank': 'sperrgut',
  'tisch': 'sperrgut',
  'stuhl': 'sperrgut',
  'bett': 'sperrgut',
  'regal': 'sperrgut',
  
  // Electronics
  'fernseher': 'elektro',
  'tv': 'elektro',
  'computer': 'elektro',
  'laptop': 'elektro',
  'drucker': 'elektro',
  'kühlschrank': 'elektro',
  'waschmaschine': 'elektro',
  'mikrowelle': 'elektro',
  'toaster': 'elektro',
  'kabel': 'elektro',
  
  // Textiles
  'kleider': 'textilien',
  'schuhe': 'textilien',
  'vorhänge': 'textilien',
  'teppich': 'textilien',
  'decke': 'textilien',
  'kissen': 'textilien',
  
  // Paper/Cardboard
  'karton': 'papier',
  'bücher': 'papier',
  'zeitungen': 'papier',
  'magazine': 'papier',
  'umzugskartons': 'papier',
  
  // Chemicals
  'farbe': 'chemie',
  'lack': 'chemie',
  'spray': 'chemie',
  'reinigungsmittel': 'chemie',
  'medikamente': 'chemie',
  
  // Other
  'batterien': 'batterien',
  'akku': 'batterien',
  'pflanzen': 'gruengut',
  'blumen': 'gruengut',
  'öl': 'oel',
  'flaschen': 'glas',
  'gläser': 'glas',
  'dosen': 'metall',
  'pet': 'pet',
};
