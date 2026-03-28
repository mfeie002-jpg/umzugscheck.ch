/**
 * Booking Orchestrator Component
 * 
 * Phase 4: Complete booking flow that combines:
 * - Provider Matching (QWB Algorithm)
 * - Provider Selection
 * - Smart Escrow Booking with Stripe
 */

import { useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Shield,
  Check,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Loader2,
  AlertCircle,
  RefreshCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { ProviderMatchCard } from './ProviderMatchCard';
import { SmartEscrowBooking, EscrowBookingData } from './SmartEscrowBooking';
import { 
  matchProviders, 
  ProviderMatch, 
  Provider,
  createMatchingCriteria,
} from '@/lib/provider-matching';
import { MoveProject } from '@/lib/move-project';
import { createCheckoutSession } from '@/lib/stripe-service';
import { supabase } from '@/integrations/supabase/client';

interface BookingOrchestratorProps {
  project: MoveProject;
  guaranteedPrice: number;
  availableProviders?: Provider[];
  onBookingComplete?: (escrowData: EscrowBookingData) => void;
  className?: string;
}

type BookingStep = 'matching' | 'selection' | 'payment' | 'confirmed';

export const BookingOrchestrator = memo(function BookingOrchestrator({
  project,
  guaranteedPrice,
  availableProviders = [],
  onBookingComplete,
  className,
}: BookingOrchestratorProps) {
  const [step, setStep] = useState<BookingStep>('matching');
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [escrowData, setEscrowData] = useState<EscrowBookingData | null>(null);
  
  // Match providers using QWB algorithm
  const matches = useMemo<ProviderMatch[]>(() => {
    if (availableProviders.length === 0) {
      // Demo providers for testing
      return getDemoMatches(project);
    }
    const criteria = createMatchingCriteria(project);
    return matchProviders(availableProviders, criteria);
  }, [availableProviders, project]);
  
  const selectedMatch = useMemo(() => 
    matches.find(m => m.provider.id === selectedProviderId),
    [matches, selectedProviderId]
  );
  
  // Handle provider selection
  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProviderId(providerId);
    setError(null);
  }, []);
  
  // Proceed to payment
  const handleProceedToPayment = useCallback(() => {
    if (!selectedProviderId) {
      setError('Bitte wählen Sie einen Anbieter aus.');
      return;
    }
    setStep('payment');
  }, [selectedProviderId]);
  
  // Create escrow booking with Stripe
  const handleConfirmBooking = useCallback(async (): Promise<EscrowBookingData> => {
    if (!selectedMatch) {
      throw new Error('Kein Anbieter ausgewählt');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const platformFee = Math.round(guaranteedPrice * 0.05);
      const providerPayout = guaranteedPrice - platformFee;
      
      // Create escrow transaction in database
      const { data: escrow, error: escrowError } = await supabase
        .from('escrow_transactions')
        .insert({
          provider_id: selectedMatch.provider.id,
          lead_id: project.id,
          customer_name: `${project.origin.city} → ${project.destination.city}`,
          customer_email: 'customer@example.com', // Would come from auth
          total_amount: guaranteedPrice,
          platform_fee: platformFee,
          provider_payout: providerPayout,
          service_type: project.serviceTier,
          service_date: project.moveDate,
          service_description: `Umzug ${project.origin.city} → ${project.destination.city}`,
          status: 'pending',
        })
        .select()
        .single();
      
      if (escrowError) {
        console.error('Escrow creation error:', escrowError);
        // Continue with simulated escrow for demo
      }
      
      const escrowId = escrow?.id || `ESC-${Date.now()}`;
      
      // Create Stripe checkout session
      const { url, error: stripeError } = await createCheckoutSession({
        providerId: selectedMatch.provider.id,
        leadId: project.id,
        amount: guaranteedPrice,
        description: `Umzug: ${project.origin.city} → ${project.destination.city}`,
        paymentType: 'lead_purchase',
        successUrl: `${window.location.origin}/umzug/buchung-bestaetigt?escrow=${escrowId}`,
        cancelUrl: `${window.location.origin}/umzug/buchung-abgebrochen`,
      });
      
      if (stripeError) {
        console.warn('Stripe not configured, using demo mode:', stripeError);
      }
      
      // If Stripe URL available, redirect
      if (url) {
        window.location.href = url;
        // This return won't actually execute due to redirect
      }
      
      // Demo mode - simulate payment
      const bookingData: EscrowBookingData = {
        escrowId,
        totalAmount: guaranteedPrice,
        platformFee,
        providerPayout,
        status: 'funded',
        fundedAt: new Date().toISOString(),
      };
      
      setEscrowData(bookingData);
      return bookingData;
      
    } catch (err: any) {
      setError(err.message || 'Buchung fehlgeschlagen');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedMatch, guaranteedPrice, project]);
  
  // Handle payment completion
  const handlePaymentComplete = useCallback((data: EscrowBookingData) => {
    setEscrowData(data);
    setStep('confirmed');
    onBookingComplete?.(data);
  }, [onBookingComplete]);
  
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-emerald-500/5">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Buchung & Escrow
          </div>
          <Badge variant="outline">
            Phase 4: Booking
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {(['matching', 'selection', 'payment', 'confirmed'] as const).map((s, idx) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : idx <= (['matching', 'selection', 'payment', 'confirmed'] as const).indexOf(step)
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {s === 'confirmed' ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              {idx < 3 && (
                <div
                  className={cn(
                    'w-8 sm:w-12 h-0.5 mx-1',
                    idx < (['matching', 'selection', 'payment', 'confirmed'] as const).indexOf(step)
                      ? 'bg-primary'
                      : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <AnimatePresence mode="wait">
          {/* Step 1: Matching Results */}
          {step === 'matching' && (
            <motion.div
              key="matching"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">Passende Anbieter</h3>
                <p className="text-muted-foreground text-sm">
                  {matches.length} Anbieter gefunden via Quality-Weighted Bidding
                </p>
              </div>
              
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {matches.map((match, index) => (
                    <ProviderMatchCard
                      key={match.provider.id}
                      match={match}
                      rank={index + 1}
                      onSelect={handleSelectProvider}
                      isSelected={selectedProviderId === match.provider.id}
                    />
                  ))}
                </div>
              </ScrollArea>
              
              <Button 
                onClick={() => setStep('selection')} 
                className="w-full"
                disabled={!selectedProviderId}
              >
                Weiter zur Bestätigung
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}
          
          {/* Step 2: Selection Confirmation */}
          {step === 'selection' && selectedMatch && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">Ihre Auswahl</h3>
                <p className="text-muted-foreground text-sm">
                  Bestätigen Sie den Anbieter für Ihren Umzug
                </p>
              </div>
              
              <ProviderMatchCard
                match={selectedMatch}
                rank={matches.indexOf(selectedMatch) + 1}
                isSelected
              />
              
              {/* Price Summary */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Garantierter Festpreis</span>
                  <span className="font-bold">
                    CHF {guaranteedPrice.toLocaleString('de-CH')}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Inkl. Plattformgebühr (5%)</span>
                  <span>CHF {Math.round(guaranteedPrice * 0.05).toLocaleString('de-CH')}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('matching')}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
                <Button 
                  onClick={handleProceedToPayment} 
                  className="flex-1"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Zur sicheren Zahlung
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Step 3: Payment / Escrow */}
          {step === 'payment' && selectedMatch && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SmartEscrowBooking
                providerId={selectedMatch.provider.id}
                providerName={selectedMatch.provider.name}
                totalPrice={guaranteedPrice}
                moveDate={project.moveDate}
                serviceTier={project.serviceTier || 'comfort'}
                onConfirmBooking={handleConfirmBooking}
                onPaymentComplete={handlePaymentComplete}
              />
              
              <Button 
                variant="ghost" 
                onClick={() => setStep('selection')}
                className="w-full mt-4"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Zurück zur Auswahl
              </Button>
            </motion.div>
          )}
          
          {/* Step 4: Confirmed */}
          {step === 'confirmed' && escrowData && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="mx-auto w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4"
              >
                <Check className="h-10 w-10 text-emerald-600" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                Buchung erfolgreich!
              </h3>
              <p className="text-muted-foreground mb-6">
                CHF {escrowData.totalAmount.toLocaleString('de-CH')} sind sicher in der Treuhand.
              </p>
              
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <Shield className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">Escrow ID</p>
                  <p className="font-mono text-sm truncate">{escrowData.escrowId.slice(0, 12)}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <Users className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">Anbieter</p>
                  <p className="font-bold text-sm">{selectedMatch?.provider.name}</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Sie erhalten eine Bestätigung per E-Mail. Weiter zu Phase 5: Live-Tracking
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
});

// Demo matches for testing without real providers
function getDemoMatches(project: MoveProject): ProviderMatch[] {
  const demoProviders: Provider[] = [
    {
      id: 'demo-1',
      name: 'Müller Umzüge AG',
      slug: 'mueller-umzuege',
      rating: 4.9,
      reviewCount: 234,
      verified: true,
      priceLevel: 'fair',
      responseTimeHours: 2,
      serviceAreas: ['ZH', 'AG', 'TG'],
      serviceTypes: ['privatumzug', 'verpackung', 'montage'],
      certifications: ['ASTAG', 'ISO9001'],
      truckSizes: ['medium', 'large'],
      specializations: ['privatumzug'],
      capacityAvailable: 85,
    },
    {
      id: 'demo-2',
      name: 'Express Zügelservice',
      slug: 'express-zuegel',
      rating: 4.7,
      reviewCount: 156,
      verified: true,
      priceLevel: 'budget',
      responseTimeHours: 1,
      serviceAreas: ['ZH', 'SG', 'TG'],
      serviceTypes: ['privatumzug'],
      certifications: ['ASTAG'],
      truckSizes: ['transporter', 'small', 'medium'],
      specializations: ['express'],
      capacityAvailable: 70,
    },
    {
      id: 'demo-3',
      name: 'Schweizer Premium Move',
      slug: 'premium-move',
      rating: 4.95,
      reviewCount: 89,
      verified: true,
      priceLevel: 'premium',
      responseTimeHours: 4,
      serviceAreas: ['CH'],
      serviceTypes: ['privatumzug', 'firmenumzug', 'verpackung', 'montage', 'kunst_antik'],
      certifications: ['ASTAG', 'ISO9001', 'TÜV'],
      truckSizes: ['medium', 'large', 'xl'],
      specializations: ['kunst_antik', 'premium'],
      capacityAvailable: 60,
    },
  ];
  
  const criteria = createMatchingCriteria(project);
  return matchProviders(demoProviders, criteria);
}

export default BookingOrchestrator;
