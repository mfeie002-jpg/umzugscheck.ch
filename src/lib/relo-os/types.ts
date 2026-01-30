/**
 * Relo-OS Core Types
 * 
 * The 6-Phase Journey Model
 */

export type ReloOSPhase = 
  | 'route'     // Phase 1: Intent capture & address entry
  | 'inventory' // Phase 2: AI video scan + digital twin
  | 'quote'     // Phase 3: Instant fixed-price
  | 'booking'   // Phase 4: Quality-weighted bidding + escrow
  | 'moving'    // Phase 5: Live GPS tracking
  | 'complete'; // Phase 6: Handover + Swiss admin

export interface ReloOSJourney {
  id: string;
  currentPhase: ReloOSPhase;
  phases: {
    route: RoutePhaseData | null;
    inventory: InventoryPhaseData | null;
    quote: QuotePhaseData | null;
    booking: BookingPhaseData | null;
    moving: MovingPhaseData | null;
    complete: CompletePhaseData | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface RoutePhaseData {
  fromPostalCode: string;
  fromCity: string;
  toPostalCode: string;
  toCity: string;
  moveDate: string | null;
  flexibleDate: boolean;
  rooms: number;
  hasElevator?: boolean;
  hasSpecialItems?: boolean;
  specialItemTypes?: string[];
}

export interface InventoryPhaseData {
  method: 'video' | 'lidar' | 'manual';
  volumeM3: number;
  itemCount: number;
  specialItems: string[];
  packingComplexity: 'low' | 'medium' | 'high';
  digitalTwinUrl?: string;
}

export interface QuotePhaseData {
  priceMin: number;
  priceMax: number;
  guaranteedPrice: number | null;
  confidence: number; // 0-100
  includedServices: string[];
  validUntil: Date;
}

export interface BookingPhaseData {
  providerId: string;
  providerName: string;
  confirmedPrice: number;
  escrowId: string | null;
  scheduledDate: string;
  scheduledTimeSlot: string;
}

export interface MovingPhaseData {
  status: 'scheduled' | 'team_en_route' | 'loading' | 'in_transit' | 'unloading' | 'completed';
  teamLocation?: { lat: number; lng: number };
  eta?: Date;
  checkpoints: MovingCheckpoint[];
}

export interface MovingCheckpoint {
  type: 'departure' | 'arrival_origin' | 'loading_complete' | 'arrival_destination' | 'unloading_complete';
  timestamp: Date;
  notes?: string;
}

export interface CompletePhaseData {
  handoverComplete: boolean;
  customerSignature?: string;
  providerSignature?: string;
  damageReported: boolean;
  escrowReleased: boolean;
  adminTasks: SwissAdminTask[];
}

export interface SwissAdminTask {
  type: 'eumzug' | 'swiss_post' | 'serafe' | 'custom';
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completedAt?: Date;
  deepLink?: string;
}

// User Archetypes (from Vision documents)
export type UserArchetype = 
  | 'overwhelmed_professional'  // Speed, no supervision needed
  | 'family_manager'            // Safety, hidden costs fear
  | 'silver_downsizer'          // Dignity, expertise, human support
  | 'expat_transfer';           // Bureaucracy, language support

export interface ArchetypeRouting {
  archetype: UserArchetype;
  recommendedFlow: 'self_serve' | 'assisted' | 'concierge';
  priorityFeatures: string[];
}
