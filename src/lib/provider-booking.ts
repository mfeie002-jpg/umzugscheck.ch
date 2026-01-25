/**
 * Provider Booking & Matching System
 * Phase 4: Quality-Weighted Bidding + Booking Flow
 */

import { MoveProject, DigitalTwin } from './move-project';

// ============================================================================
// TYPES
// ============================================================================

export interface ProviderMatch {
  providerId: string;
  providerName: string;
  logo?: string;
  rating: number;
  reviewCount: number;
  
  // QWB Score Components
  qualityScore: number;      // 40% weight
  priceScore: number;        // 30% weight
  responseScore: number;     // 20% weight
  specializationScore: number; // 10% weight
  qwbScore: number;          // Final weighted score
  
  // Bid Details
  bidAmount: number;
  currency: 'CHF';
  estimatedDuration: number; // hours
  availableSlots: AvailableSlot[];
  
  // Trust Signals
  badges: ProviderBadge[];
  certifications: string[];
  insuranceCoverage: number; // CHF
  
  // Match Quality
  matchReasons: string[];
  specializationMatch: number; // 0-100
}

export interface AvailableSlot {
  date: string; // ISO date
  timeSlot: 'morning' | 'afternoon' | 'fullday';
  priceModifier: number; // 1.0 = normal, 0.9 = 10% off
}

export interface ProviderBadge {
  type: 'verified' | 'premium' | 'elite' | 'eco' | 'specialist';
  label: string;
}

export interface BookingRequest {
  projectId: string;
  providerId: string;
  selectedDate: string;
  timeSlot: 'morning' | 'afternoon' | 'fullday';
  agreedPrice: number;
  customerNotes?: string;
}

export interface BookingConfirmation {
  bookingId: string;
  projectId: string;
  providerId: string;
  providerName: string;
  
  scheduledDate: string;
  timeSlot: 'morning' | 'afternoon' | 'fullday';
  estimatedArrival: string;
  
  confirmedPrice: number;
  escrowStatus: 'pending' | 'funded' | 'released';
  
  customerContact: {
    phone: string;
    email: string;
  };
  
  providerContact: {
    phone: string;
    driverName?: string;
  };
  
  trackingCode: string;
  qrCodeUrl: string;
}

// ============================================================================
// QUALITY-WEIGHTED BIDDING (QWB)
// ============================================================================

export interface QWBWeights {
  quality: number;      // Default 0.40
  price: number;        // Default 0.30
  response: number;     // Default 0.20
  specialization: number; // Default 0.10
}

const DEFAULT_QWB_WEIGHTS: QWBWeights = {
  quality: 0.40,
  price: 0.30,
  response: 0.20,
  specialization: 0.10,
};

export function calculateQWBScore(
  provider: {
    rating: number;
    reviewCount: number;
    responseTimeHours: number;
    successRate: number;
    specializationMatch: number;
    bidAmount: number;
  },
  marketAveragePrice: number,
  weights: QWBWeights = DEFAULT_QWB_WEIGHTS
): { qwbScore: number; components: { quality: number; price: number; response: number; specialization: number } } {
  // Quality Score (0-100)
  // Based on rating (60%) and review count (40%)
  const ratingScore = (provider.rating / 5) * 100;
  const reviewScore = Math.min(provider.reviewCount / 100, 1) * 100;
  const qualityScore = ratingScore * 0.6 + reviewScore * 0.4;
  
  // Price Score (0-100)
  // Lower than market average = higher score
  const priceRatio = provider.bidAmount / marketAveragePrice;
  const priceScore = Math.max(0, Math.min(100, (2 - priceRatio) * 50));
  
  // Response Score (0-100)
  // Faster response = higher score
  const responseScore = provider.responseTimeHours <= 1 ? 100 :
                        provider.responseTimeHours <= 4 ? 85 :
                        provider.responseTimeHours <= 12 ? 70 :
                        provider.responseTimeHours <= 24 ? 50 : 30;
  
  // Specialization Score (0-100)
  const specializationScore = provider.specializationMatch;
  
  // Weighted final score
  const qwbScore = 
    qualityScore * weights.quality +
    priceScore * weights.price +
    responseScore * weights.response +
    specializationScore * weights.specialization;
  
  return {
    qwbScore: Math.round(qwbScore),
    components: {
      quality: Math.round(qualityScore),
      price: Math.round(priceScore),
      response: Math.round(responseScore),
      specialization: Math.round(specializationScore),
    },
  };
}

// ============================================================================
// PROVIDER MATCHING
// ============================================================================

export interface MatchingCriteria {
  origin: { canton: string; city: string };
  destination: { canton: string; city: string };
  volume: number; // m³
  specialItems: string[];
  preferredDate: string;
  flexibleDates: boolean;
  maxBudget?: number;
}

export function matchProviders(
  criteria: MatchingCriteria,
  providers: any[] // Would be fetched from DB
): ProviderMatch[] {
  // This would be implemented with actual DB queries
  // For now, return mock data structure
  return [];
}

export function rankProvidersByQWB(matches: ProviderMatch[]): ProviderMatch[] {
  return [...matches].sort((a, b) => b.qwbScore - a.qwbScore);
}

// ============================================================================
// BOOKING FLOW
// ============================================================================

export interface BookingState {
  step: 'select_provider' | 'select_date' | 'confirm_details' | 'payment' | 'confirmed';
  selectedProvider?: ProviderMatch;
  selectedSlot?: AvailableSlot;
  customerDetails?: {
    name: string;
    phone: string;
    email: string;
  };
  paymentMethod?: 'escrow' | 'direct';
  confirmation?: BookingConfirmation;
}

export function createBookingRequest(
  project: MoveProject,
  provider: ProviderMatch,
  slot: AvailableSlot,
  customerNotes?: string
): BookingRequest {
  const adjustedPrice = provider.bidAmount * slot.priceModifier;
  
  return {
    projectId: project.id,
    providerId: provider.providerId,
    selectedDate: slot.date,
    timeSlot: slot.timeSlot,
    agreedPrice: Math.round(adjustedPrice),
    customerNotes,
  };
}

export function generateTrackingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'UC-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ============================================================================
// ESCROW INTEGRATION
// ============================================================================

export interface EscrowPayment {
  id: string;
  bookingId: string;
  amount: number;
  currency: 'CHF';
  status: 'pending' | 'funded' | 'released' | 'disputed' | 'refunded';
  fundedAt?: string;
  releasedAt?: string;
  platformFee: number; // 3-5%
  providerPayout: number;
}

export function calculateEscrowAmounts(
  totalAmount: number,
  platformFeePercent: number = 4
): { platformFee: number; providerPayout: number } {
  const platformFee = Math.round(totalAmount * (platformFeePercent / 100));
  const providerPayout = totalAmount - platformFee;
  
  return { platformFee, providerPayout };
}

// ============================================================================
// HANDOVER PROTOCOL
// ============================================================================

export interface HandoverChecklist {
  id: string;
  bookingId: string;
  completedAt?: string;
  items: HandoverItem[];
  customerSignature?: string;
  providerSignature?: string;
  photos: HandoverPhoto[];
  notes: string;
}

export interface HandoverItem {
  id: string;
  label: string;
  checked: boolean;
  category: 'condition' | 'inventory' | 'keys' | 'utilities' | 'cleaning';
}

export interface HandoverPhoto {
  id: string;
  url: string;
  room: string;
  timestamp: string;
  type: 'before' | 'after' | 'damage';
}

export const DEFAULT_HANDOVER_ITEMS: Omit<HandoverItem, 'id' | 'checked'>[] = [
  { label: 'Alle Räume leer und besenrein', category: 'condition' },
  { label: 'Küche gereinigt (inkl. Backofen)', category: 'cleaning' },
  { label: 'Badezimmer gereinigt', category: 'cleaning' },
  { label: 'Fenster geputzt', category: 'cleaning' },
  { label: 'Alle Schlüssel übergeben', category: 'keys' },
  { label: 'Briefkastenschlüssel übergeben', category: 'keys' },
  { label: 'Garagenschlüssel/Fernbedienung übergeben', category: 'keys' },
  { label: 'Strom abgemeldet / Zählerstand notiert', category: 'utilities' },
  { label: 'Wasser abgestellt', category: 'utilities' },
  { label: 'Heizung auf Minimum', category: 'utilities' },
  { label: 'Inventarliste vollständig', category: 'inventory' },
  { label: 'Keine Beschädigungen an Wänden', category: 'condition' },
  { label: 'Keine Beschädigungen an Böden', category: 'condition' },
];

export function createHandoverChecklist(bookingId: string): HandoverChecklist {
  return {
    id: crypto.randomUUID(),
    bookingId,
    items: DEFAULT_HANDOVER_ITEMS.map((item, idx) => ({
      ...item,
      id: `item-${idx}`,
      checked: false,
    })),
    photos: [],
    notes: '',
  };
}

export function calculateHandoverCompletion(checklist: HandoverChecklist): number {
  const total = checklist.items.length;
  const checked = checklist.items.filter(i => i.checked).length;
  return Math.round((checked / total) * 100);
}
