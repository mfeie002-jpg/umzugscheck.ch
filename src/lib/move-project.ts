/**
 * Move Project Orchestrator
 * 
 * Central state machine managing the entire "Invisible Move" journey.
 * From first landing to "Willkommen zuhause" notification.
 * 
 * @see docs/strategy/INVISIBLE_MOVE_IMPLEMENTATION.md
 */

import { supabase } from "@/integrations/supabase/client";

// ============================================================================
// TYPES
// ============================================================================

export type MoveProjectStatus = 
  | 'draft'           // User started but not completed inventory
  | 'inventory_scan'  // Video scanning in progress
  | 'quote_ready'     // AI has calculated guaranteed price
  | 'booking_pending' // User reviewing offers
  | 'booked'          // Escrow funded, provider assigned
  | 'scheduled'       // Moving day confirmed
  | 'in_transit'      // Move in progress
  | 'completed'       // Move done, awaiting confirmation
  | 'closed';         // All parties satisfied, escrow released

export interface AddressDetails {
  street: string;
  streetNumber?: string;
  postalCode: string;
  city: string;
  canton: string;
  floor?: number;
  hasElevator?: boolean;
  parkingDistance?: number; // meters
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface DigitalTwin {
  rooms: RoomInventory[];
  totalVolume: number;
  totalWeight: number;
  totalItems: number;
  estimatedBoxes: number;
  recommendedTruckSize: 'transporter' | 'small' | 'medium' | 'large' | 'xl';
  recommendedCrewSize: number;
  estimatedDuration: number; // hours
  fragilityScore: number; // 0-100
  specialHandling: string[];
  confidence: number; // 0-1
  scannedAt: string;
}

export interface RoomInventory {
  id: string;
  name: string;
  type: string;
  items: InventoryItem[];
  volume: number;
  weight: number;
  scanConfidence: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  volume: number;
  weight: number;
  fragility: 'low' | 'medium' | 'high';
  specialHandling?: string[];
  confidence: number;
}

export interface PriceBreakdown {
  basePrice: number;
  distanceSurcharge: number;
  floorSurcharge: number;
  fragileSurcharge: number;
  seasonalAdjustment: number;
  serviceFees: {
    packing?: number;
    cleaning?: number;
    storage?: number;
    assembly?: number;
  };
  platformFee: number;
  total: number;
  currency: 'CHF';
  validUntil: string;
  guaranteeType: 'fixed' | 'estimate';
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  category: 'before' | 'moving_day' | 'after';
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
}

export interface MoveProject {
  id: string;
  userId?: string;
  status: MoveProjectStatus;
  
  // Phase 1: Route
  origin: AddressDetails;
  destination: AddressDetails;
  moveDate: string;
  flexibility: 'exact' | 'flexible_week' | 'flexible_month';
  
  // Phase 2: Inventory (Digital Twin)
  inventorySessionId?: string;
  digitalTwin?: DigitalTwin;
  totalVolume: number;
  totalWeight: number;
  
  // Phase 3: Quote
  serviceTier: 'essential' | 'comfort' | 'premium';
  guaranteedPrice: number;
  priceBreakdown: PriceBreakdown;
  additionalServices: string[];
  
  // Phase 4: Booking
  escrowId?: string;
  providerId?: string;
  providerName?: string;
  bookingConfirmedAt?: string;
  
  // Phase 5: Execution
  trackingUrl?: string;
  movingDayChecklist: ChecklistItem[];
  inTransitUpdates?: TransitUpdate[];
  
  // Phase 6: Handover
  handoverProtocolId?: string;
  cleaningAccepted: boolean;
  depositReleased: boolean;
  customerRating?: number;
  customerReview?: string;
  
  // Meta
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  source: 'homepage' | 'video_offerte' | 'whatsapp' | 'quick_quote' | 'seo_landing';
}

export interface TransitUpdate {
  timestamp: string;
  type: 'location' | 'photo' | 'status';
  data: {
    lat?: number;
    lng?: number;
    photoUrl?: string;
    message?: string;
  };
}

// ============================================================================
// STATUS MACHINE TRANSITIONS
// ============================================================================

export const STATUS_TRANSITIONS: Record<MoveProjectStatus, MoveProjectStatus[]> = {
  'draft': ['inventory_scan', 'quote_ready'], // Can skip scan for simple moves
  'inventory_scan': ['quote_ready', 'draft'],
  'quote_ready': ['booking_pending', 'draft'],
  'booking_pending': ['booked', 'quote_ready'],
  'booked': ['scheduled'],
  'scheduled': ['in_transit'],
  'in_transit': ['completed'],
  'completed': ['closed'],
  'closed': []
};

export function canTransition(from: MoveProjectStatus, to: MoveProjectStatus): boolean {
  return STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

// ============================================================================
// SERVICE FUNCTIONS
// ============================================================================

/**
 * Create a new move project
 */
export async function createMoveProject(params: {
  source: MoveProject['source'];
  origin?: Partial<AddressDetails>;
  destination?: Partial<AddressDetails>;
  moveDate?: string;
}): Promise<MoveProject | null> {
  const defaultAddress: AddressDetails = {
    street: '',
    postalCode: '',
    city: '',
    canton: ''
  };

  const project: Partial<MoveProject> = {
    status: 'draft',
    source: params.source,
    origin: { ...defaultAddress, ...params.origin },
    destination: { ...defaultAddress, ...params.destination },
    moveDate: params.moveDate || '',
    flexibility: 'exact',
    totalVolume: 0,
    totalWeight: 0,
    serviceTier: 'comfort',
    guaranteedPrice: 0,
    priceBreakdown: {
      basePrice: 0,
      distanceSurcharge: 0,
      floorSurcharge: 0,
      fragileSurcharge: 0,
      seasonalAdjustment: 0,
      serviceFees: {},
      platformFee: 0,
      total: 0,
      currency: 'CHF',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      guaranteeType: 'estimate'
    },
    additionalServices: [],
    movingDayChecklist: generateDefaultChecklist(),
    cleaningAccepted: false,
    depositReleased: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // For now, store in localStorage until we have the DB table
  const id = `mp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const fullProject = { ...project, id } as MoveProject;
  
  try {
    localStorage.setItem(`move_project_${id}`, JSON.stringify(fullProject));
    localStorage.setItem('current_move_project', id);
  } catch (e) {
    console.error('Failed to save move project:', e);
    return null;
  }

  return fullProject;
}

/**
 * Get current move project from localStorage
 */
export function getCurrentMoveProject(): MoveProject | null {
  try {
    const currentId = localStorage.getItem('current_move_project');
    if (!currentId) return null;
    
    const stored = localStorage.getItem(`move_project_${currentId}`);
    if (!stored) return null;
    
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load move project:', e);
    return null;
  }
}

/**
 * Update move project
 */
export function updateMoveProject(
  projectId: string, 
  updates: Partial<MoveProject>
): MoveProject | null {
  try {
    const stored = localStorage.getItem(`move_project_${projectId}`);
    if (!stored) return null;
    
    const project = JSON.parse(stored) as MoveProject;
    const updated = {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(`move_project_${projectId}`, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update move project:', e);
    return null;
  }
}

/**
 * Transition project to new status
 */
export function transitionMoveProject(
  projectId: string,
  newStatus: MoveProjectStatus
): MoveProject | null {
  const project = getCurrentMoveProject();
  if (!project || project.id !== projectId) return null;
  
  if (!canTransition(project.status, newStatus)) {
    console.error(`Invalid transition: ${project.status} -> ${newStatus}`);
    return null;
  }
  
  return updateMoveProject(projectId, { status: newStatus });
}

/**
 * Attach digital twin to project
 */
export function attachDigitalTwin(
  projectId: string,
  digitalTwin: DigitalTwin
): MoveProject | null {
  return updateMoveProject(projectId, {
    digitalTwin,
    totalVolume: digitalTwin.totalVolume,
    totalWeight: digitalTwin.totalWeight,
    status: 'quote_ready'
  });
}

/**
 * Calculate and attach price
 */
export function calculatePrice(project: MoveProject): PriceBreakdown {
  const { origin, destination, digitalTwin, serviceTier } = project;
  
  // Base price per m³
  const tierMultiplier = {
    'essential': 55,
    'comfort': 70,
    'premium': 95
  }[serviceTier];
  
  const volume = digitalTwin?.totalVolume || project.totalVolume || 20;
  const basePrice = volume * tierMultiplier;
  
  // Distance surcharge (mock - would use Google Maps API)
  const distanceSurcharge = 50; // CHF
  
  // Floor surcharge
  const originFloor = origin.floor || 0;
  const destFloor = destination.floor || 0;
  const hasElevator = origin.hasElevator || destination.hasElevator;
  const floorSurcharge = hasElevator ? 0 : (originFloor + destFloor) * 25;
  
  // Fragile surcharge
  const fragilityScore = digitalTwin?.fragilityScore || 30;
  const fragileSurcharge = fragilityScore > 50 ? Math.round(basePrice * 0.1) : 0;
  
  // Seasonal adjustment
  const month = new Date().getMonth();
  const isPeakSeason = month >= 4 && month <= 8;
  const seasonalAdjustment = isPeakSeason ? Math.round(basePrice * 0.15) : 0;
  
  // Platform fee
  const platformFee = 49;
  
  const total = basePrice + distanceSurcharge + floorSurcharge + 
                fragileSurcharge + seasonalAdjustment + platformFee;
  
  return {
    basePrice,
    distanceSurcharge,
    floorSurcharge,
    fragileSurcharge,
    seasonalAdjustment,
    serviceFees: {},
    platformFee,
    total: Math.round(total),
    currency: 'CHF',
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    guaranteeType: digitalTwin ? 'fixed' : 'estimate'
  };
}

// ============================================================================
// CHECKLIST GENERATION
// ============================================================================

function generateDefaultChecklist(): ChecklistItem[] {
  return [
    // Before
    {
      id: 'cl_1',
      title: 'Umzugstermin bestätigen',
      category: 'before',
      completed: false
    },
    {
      id: 'cl_2',
      title: 'Alte Wohnung kündigen',
      description: 'Kündigungsfrist beachten (meist 3 Monate)',
      category: 'before',
      completed: false
    },
    {
      id: 'cl_3',
      title: 'Kartons & Verpackungsmaterial besorgen',
      category: 'before',
      completed: false
    },
    {
      id: 'cl_4',
      title: 'Wertvolle Gegenstände fotografieren',
      description: 'Für Versicherungszwecke',
      category: 'before',
      completed: false
    },
    {
      id: 'cl_5',
      title: 'Post-Umleitung einrichten',
      category: 'before',
      completed: false
    },
    // Moving Day
    {
      id: 'cl_6',
      title: 'Zählerstände ablesen (alt)',
      category: 'moving_day',
      completed: false
    },
    {
      id: 'cl_7',
      title: 'Schlüsselübergabe alte Wohnung',
      category: 'moving_day',
      completed: false
    },
    {
      id: 'cl_8',
      title: 'Zählerstände ablesen (neu)',
      category: 'moving_day',
      completed: false
    },
    {
      id: 'cl_9',
      title: 'Wohnungsübergabe-Protokoll unterschreiben',
      category: 'moving_day',
      completed: false
    },
    // After
    {
      id: 'cl_10',
      title: 'Gemeinde Anmeldung',
      description: 'Innert 14 Tagen nach Umzug',
      category: 'after',
      completed: false
    },
    {
      id: 'cl_11',
      title: 'Fahrzeug ummelden',
      description: 'Bei Kantonswechsel erforderlich',
      category: 'after',
      completed: false
    },
    {
      id: 'cl_12',
      title: 'Adressänderung bei Bank, Versicherung, etc.',
      category: 'after',
      completed: false
    }
  ];
}

// ============================================================================
// ANALYTICS EVENTS
// ============================================================================

export const MOVE_PROJECT_EVENTS = {
  // Phase 1: Route
  'project_created': { phase: 1, label: 'Projekt erstellt' },
  'address_entered': { phase: 1, label: 'Adressen eingegeben' },
  'date_selected': { phase: 1, label: 'Datum gewählt' },
  
  // Phase 2: Inventory
  'inventory_method_selected': { phase: 2, label: 'Inventar-Methode gewählt' },
  'video_scan_started': { phase: 2, label: 'Video-Scan gestartet' },
  'video_scan_completed': { phase: 2, label: 'Video-Scan abgeschlossen' },
  'manual_inventory_completed': { phase: 2, label: 'Inventar manuell erfasst' },
  'digital_twin_created': { phase: 2, label: 'Digital Twin erstellt' },
  
  // Phase 3: Quote
  'quote_generated': { phase: 3, label: 'Offerte berechnet' },
  'quote_viewed': { phase: 3, label: 'Offerte angesehen' },
  'tier_selected': { phase: 3, label: 'Service-Tier gewählt' },
  'additional_service_added': { phase: 3, label: 'Zusatzservice hinzugefügt' },
  
  // Phase 4: Booking
  'checkout_initiated': { phase: 4, label: 'Checkout gestartet' },
  'escrow_funded': { phase: 4, label: 'Treuhand-Zahlung erfolgt' },
  'provider_matched': { phase: 4, label: 'Firma zugewiesen' },
  'booking_confirmed': { phase: 4, label: 'Buchung bestätigt' },
  
  // Phase 5: Execution
  'move_day_started': { phase: 5, label: 'Umzugstag gestartet' },
  'in_transit': { phase: 5, label: 'Unterwegs' },
  'delivery_complete': { phase: 5, label: 'Lieferung abgeschlossen' },
  
  // Phase 6: Handover
  'cleaning_completed': { phase: 6, label: 'Reinigung abgeschlossen' },
  'handover_accepted': { phase: 6, label: 'Abnahme erfolgt' },
  'review_submitted': { phase: 6, label: 'Bewertung abgegeben' },
  'escrow_released': { phase: 6, label: 'Treuhand freigegeben' },
  'project_closed': { phase: 6, label: 'Projekt abgeschlossen' }
} as const;

export function trackMoveEvent(
  projectId: string,
  event: keyof typeof MOVE_PROJECT_EVENTS,
  metadata?: Record<string, unknown>
): void {
  const eventConfig = MOVE_PROJECT_EVENTS[event];
  
  console.log(`[MoveProject] ${eventConfig.label}`, {
    projectId,
    event,
    phase: eventConfig.phase,
    timestamp: new Date().toISOString(),
    ...metadata
  });
  
  // TODO: Send to analytics backend
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getStatusLabel(status: MoveProjectStatus): string {
  const labels: Record<MoveProjectStatus, string> = {
    'draft': 'Entwurf',
    'inventory_scan': 'Inventar-Erfassung',
    'quote_ready': 'Offerte bereit',
    'booking_pending': 'Buchung ausstehend',
    'booked': 'Gebucht',
    'scheduled': 'Terminiert',
    'in_transit': 'Unterwegs',
    'completed': 'Abgeschlossen',
    'closed': 'Beendet'
  };
  return labels[status];
}

export function getPhaseForStatus(status: MoveProjectStatus): number {
  const phases: Record<MoveProjectStatus, number> = {
    'draft': 1,
    'inventory_scan': 2,
    'quote_ready': 3,
    'booking_pending': 4,
    'booked': 4,
    'scheduled': 5,
    'in_transit': 5,
    'completed': 6,
    'closed': 6
  };
  return phases[status];
}

export function getPhaseProgress(status: MoveProjectStatus): number {
  const phase = getPhaseForStatus(status);
  return Math.round((phase / 6) * 100);
}
