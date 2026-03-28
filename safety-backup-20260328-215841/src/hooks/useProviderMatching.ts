/**
 * useProviderMatching - Hook for Quality-Weighted Bidding provider selection
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  ProviderMatch, 
  BookingRequest, 
  BookingConfirmation,
  calculateQWBScore,
  generateTrackingCode,
  calculateEscrowAmounts,
} from '@/lib/provider-booking';
import { toast } from 'sonner';

// ============================================================================
// TYPES
// ============================================================================

interface UseProviderMatchingOptions {
  projectId: string;
  originCanton: string;
  destinationCanton: string;
  volume: number;
  specialItems?: string[];
  preferredDate?: string;
}

interface ProviderMatchingResult {
  providers: ProviderMatch[];
  isLoading: boolean;
  error: Error | null;
  selectedProvider: ProviderMatch | null;
  selectProvider: (provider: ProviderMatch) => void;
  clearSelection: () => void;
  submitBooking: (request: Omit<BookingRequest, 'projectId' | 'providerId'>) => Promise<BookingConfirmation | null>;
  isSubmitting: boolean;
}

// ============================================================================
// MOCK DATA (until DB integration)
// ============================================================================

const MOCK_PROVIDERS: Omit<ProviderMatch, 'qwbScore' | 'qualityScore' | 'priceScore' | 'responseScore' | 'specializationScore'>[] = [
  {
    providerId: 'prov-001',
    providerName: 'Züri Umzüge AG',
    logo: '/placeholder.svg',
    rating: 4.8,
    reviewCount: 127,
    bidAmount: 1850,
    currency: 'CHF',
    estimatedDuration: 6,
    availableSlots: [
      { date: '2026-02-01', timeSlot: 'morning', priceModifier: 1.0 },
      { date: '2026-02-02', timeSlot: 'fullday', priceModifier: 0.95 },
      { date: '2026-02-05', timeSlot: 'afternoon', priceModifier: 0.9 },
    ],
    badges: [
      { type: 'elite', label: 'Elite Partner' },
      { type: 'eco', label: 'Öko-Zertifiziert' },
    ],
    certifications: ['ASTAG', 'ISO 9001'],
    insuranceCoverage: 100000,
    matchReasons: ['Spezialist für Stadtumzüge', 'Exzellente Bewertungen'],
    specializationMatch: 92,
  },
  {
    providerId: 'prov-002',
    providerName: 'Express Move GmbH',
    logo: '/placeholder.svg',
    rating: 4.5,
    reviewCount: 84,
    bidAmount: 1650,
    currency: 'CHF',
    estimatedDuration: 7,
    availableSlots: [
      { date: '2026-02-01', timeSlot: 'afternoon', priceModifier: 1.0 },
      { date: '2026-02-03', timeSlot: 'morning', priceModifier: 1.0 },
    ],
    badges: [
      { type: 'premium', label: 'Premium Partner' },
    ],
    certifications: ['ASTAG'],
    insuranceCoverage: 50000,
    matchReasons: ['Günstige Preise', 'Schnelle Verfügbarkeit'],
    specializationMatch: 78,
  },
  {
    providerId: 'prov-003',
    providerName: 'Schweizer Umzugsprofis',
    logo: '/placeholder.svg',
    rating: 4.9,
    reviewCount: 203,
    bidAmount: 2100,
    currency: 'CHF',
    estimatedDuration: 5,
    availableSlots: [
      { date: '2026-02-04', timeSlot: 'fullday', priceModifier: 1.0 },
      { date: '2026-02-06', timeSlot: 'morning', priceModifier: 0.92 },
    ],
    badges: [
      { type: 'elite', label: 'Elite Partner' },
      { type: 'specialist', label: 'Klaviertransport' },
    ],
    certifications: ['ASTAG', 'VSU', 'ISO 14001'],
    insuranceCoverage: 200000,
    matchReasons: ['Höchste Kundenzufriedenheit', 'Spezialausrüstung'],
    specializationMatch: 95,
  },
];

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useProviderMatching(options: UseProviderMatchingOptions): ProviderMatchingResult {
  const queryClient = useQueryClient();
  const [selectedProvider, setSelectedProvider] = useState<ProviderMatch | null>(null);
  
  // Calculate market average for QWB scoring
  const marketAveragePrice = useMemo(() => {
    const total = MOCK_PROVIDERS.reduce((sum, p) => sum + p.bidAmount, 0);
    return total / MOCK_PROVIDERS.length;
  }, []);
  
  // Fetch and score providers
  const { data: providers = [], isLoading, error } = useQuery({
    queryKey: ['provider-matches', options.projectId, options.originCanton, options.destinationCanton],
    queryFn: async () => {
      // In production, this would fetch from Supabase
      // For now, use mock data with QWB scoring
      
      const scoredProviders: ProviderMatch[] = MOCK_PROVIDERS.map(provider => {
        const { qwbScore, components } = calculateQWBScore(
          {
            rating: provider.rating,
            reviewCount: provider.reviewCount,
            responseTimeHours: 4, // Mock
            successRate: 95, // Mock
            specializationMatch: provider.specializationMatch,
            bidAmount: provider.bidAmount,
          },
          marketAveragePrice
        );
        
        return {
          ...provider,
          qwbScore,
          qualityScore: components.quality,
          priceScore: components.price,
          responseScore: components.response,
          specializationScore: components.specialization,
        };
      });
      
      // Sort by QWB score (highest first)
      return scoredProviders.sort((a, b) => b.qwbScore - a.qwbScore);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (request: BookingRequest): Promise<BookingConfirmation> => {
      // In production, this would create records in Supabase
      const provider = providers.find(p => p.providerId === request.providerId);
      if (!provider) throw new Error('Provider not found');
      
      const escrow = calculateEscrowAmounts(request.agreedPrice);
      const trackingCode = generateTrackingCode();
      
      // Mock confirmation
      const confirmation: BookingConfirmation = {
        bookingId: crypto.randomUUID(),
        projectId: request.projectId,
        providerId: request.providerId,
        providerName: provider.providerName,
        scheduledDate: request.selectedDate,
        timeSlot: request.timeSlot,
        estimatedArrival: request.timeSlot === 'morning' ? '08:00' : 
                         request.timeSlot === 'afternoon' ? '13:00' : '08:00',
        confirmedPrice: request.agreedPrice,
        escrowStatus: 'pending',
        customerContact: {
          phone: '+41 79 XXX XX XX',
          email: 'kunde@example.ch',
        },
        providerContact: {
          phone: '+41 44 XXX XX XX',
          driverName: 'Marco S.',
        },
        trackingCode,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?data=${trackingCode}&size=200x200`,
      };
      
      return confirmation;
    },
    onSuccess: (data) => {
      toast.success('Buchung bestätigt!', {
        description: `Tracking-Code: ${data.trackingCode}`,
      });
      queryClient.invalidateQueries({ queryKey: ['move-project', options.projectId] });
    },
    onError: (error) => {
      toast.error('Buchung fehlgeschlagen', {
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
      });
    },
  });
  
  const selectProvider = useCallback((provider: ProviderMatch) => {
    setSelectedProvider(provider);
  }, []);
  
  const clearSelection = useCallback(() => {
    setSelectedProvider(null);
  }, []);
  
  const submitBooking = useCallback(async (
    partialRequest: Omit<BookingRequest, 'projectId' | 'providerId'>
  ): Promise<BookingConfirmation | null> => {
    if (!selectedProvider) {
      toast.error('Bitte wählen Sie zuerst einen Anbieter');
      return null;
    }
    
    const fullRequest: BookingRequest = {
      ...partialRequest,
      projectId: options.projectId,
      providerId: selectedProvider.providerId,
    };
    
    return bookingMutation.mutateAsync(fullRequest);
  }, [selectedProvider, options.projectId, bookingMutation]);
  
  return {
    providers,
    isLoading,
    error: error as Error | null,
    selectedProvider,
    selectProvider,
    clearSelection,
    submitBooking,
    isSubmitting: bookingMutation.isPending,
  };
}

export default useProviderMatching;
