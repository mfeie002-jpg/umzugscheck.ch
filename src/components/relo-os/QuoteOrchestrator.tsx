/**
 * Quote Orchestrator Component
 * 
 * Phase 3: Complete quote flow that combines:
 * - Dynamic Pricing Engine
 * - Service Tier Selection
 * - Guaranteed Price Generation
 * - Abgabegarantie (Swiss consumer protection)
 */

import { useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Shield,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Sparkles,
  FileCheck,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ServiceTierSelector } from './ServiceTierSelector';
import { DynamicPriceDisplay } from './DynamicPriceDisplay';
import { GuaranteedPriceCard } from './GuaranteedPriceCard';
import { 
  calculateMovePricing, 
  PricingResult,
  ServiceTier,
  formatPrice,
} from '@/lib/move-pricing-engine';
import { 
  generateGuaranteedQuote, 
  PriceGuaranteeResult,
  acceptGuaranteedQuote,
} from '@/lib/guaranteed-price-engine';
import { MoveProject, DigitalTwin } from '@/lib/move-project';

interface QuoteOrchestratorProps {
  project: MoveProject;
  digitalTwin?: DigitalTwin;
  onQuoteAccepted?: (result: PriceGuaranteeResult) => void;
  className?: string;
}

type QuoteStep = 'tier' | 'review' | 'guarantee' | 'accepted';

export const QuoteOrchestrator = memo(function QuoteOrchestrator({
  project,
  digitalTwin,
  onQuoteAccepted,
  className,
}: QuoteOrchestratorProps) {
  const [step, setStep] = useState<QuoteStep>('tier');
  const [selectedTier, setSelectedTier] = useState<ServiceTier>(project.serviceTier || 'comfort');
  const [moveDate, setMoveDate] = useState(project.moveDate || new Date().toISOString());
  const [isAccepting, setIsAccepting] = useState(false);
  
  // Calculate pricing based on current inputs
  const pricing = useMemo<PricingResult>(() => {
    const twin = digitalTwin || project.digitalTwin;
    const volume = twin?.totalVolume || project.totalVolume || 25;
    
    // Estimate distance from postal codes
    let distance = 20;
    if (project.origin.postalCode && project.destination.postalCode) {
      const fromFirst = parseInt(project.origin.postalCode[0]);
      const toFirst = parseInt(project.destination.postalCode[0]);
      distance = Math.abs(fromFirst - toFirst) * 25 + 15;
    }
    
    return calculateMovePricing({
      totalVolume: volume,
      distanceKm: distance,
      originFloor: project.origin.floor || 0,
      originHasElevator: project.origin.hasElevator || false,
      destinationFloor: project.destination.floor || 0,
      destinationHasElevator: project.destination.hasElevator || false,
      moveDate,
      serviceTier: selectedTier,
      additionalServices: project.additionalServices || [],
      fragilityScore: twin?.fragilityScore,
    });
  }, [project, digitalTwin, selectedTier, moveDate]);
  
  // Generate guaranteed quote
  const guaranteeResult = useMemo<PriceGuaranteeResult>(() => {
    const projectWithUpdates: MoveProject = {
      ...project,
      serviceTier: selectedTier,
      moveDate,
      digitalTwin: digitalTwin || project.digitalTwin,
    };
    return generateGuaranteedQuote(projectWithUpdates);
  }, [project, digitalTwin, selectedTier, moveDate]);
  
  // Handle tier change
  const handleTierChange = useCallback((tier: ServiceTier) => {
    setSelectedTier(tier);
  }, []);
  
  // Handle date change from suggestions
  const handleDateChange = useCallback((newDate: string) => {
    setMoveDate(newDate);
  }, []);
  
  // Handle quote acceptance
  const handleAccept = useCallback(async () => {
    setIsAccepting(true);
    
    try {
      const result = await acceptGuaranteedQuote(
        guaranteeResult.quote.id,
        project.id
      );
      
      if (result.success) {
        setStep('accepted');
        onQuoteAccepted?.(guaranteeResult);
      }
    } catch (error) {
      console.error('Failed to accept quote:', error);
    } finally {
      setIsAccepting(false);
    }
  }, [guaranteeResult, project.id, onQuoteAccepted]);
  
  const confidence = guaranteeResult.quote.confidenceLevel;
  const isFixed = guaranteeResult.quote.guaranteeType === 'binding_fixed';
  
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-amber-500/5">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Preisberechnung
          </div>
          <Badge variant="outline">
            Phase 3: Quote
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {(['tier', 'review', 'guarantee', 'accepted'] as const).map((s, idx) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : idx <= (['tier', 'review', 'guarantee', 'accepted'] as const).indexOf(step)
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {s === 'accepted' ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              {idx < 3 && (
                <div
                  className={cn(
                    'w-8 sm:w-12 h-0.5 mx-1',
                    idx < (['tier', 'review', 'guarantee', 'accepted'] as const).indexOf(step)
                      ? 'bg-primary'
                      : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          {/* Step 1: Service Tier Selection */}
          {step === 'tier' && (
            <motion.div
              key="tier"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Wählen Sie Ihren Service</h3>
                <p className="text-muted-foreground text-sm">
                  Drei Optionen für jeden Bedarf
                </p>
              </div>
              
              <ServiceTierSelector
                tiers={pricing.tiers}
                selectedTier={selectedTier}
                onSelect={handleTierChange}
              />
              
              <Button onClick={() => setStep('review')} className="w-full">
                Weiter zur Preisübersicht
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}
          
          {/* Step 2: Price Review */}
          {step === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <DynamicPriceDisplay
                pricing={pricing}
                onDateChange={handleDateChange}
              />
              
              {/* Confidence Notice */}
              {confidence < 0.75 && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                  <Sparkles className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-700 dark:text-amber-400">
                      Video-Scan empfohlen
                    </p>
                    <p className="text-amber-600 dark:text-amber-500 mt-1">
                      Für einen garantierten Festpreis empfehlen wir einen Video-Scan.
                      Aktuelle Genauigkeit: {Math.round(confidence * 100)}%
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('tier')}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
                <Button onClick={() => setStep('guarantee')} className="flex-1">
                  {isFixed ? 'Festpreis anzeigen' : 'Schätzung anzeigen'}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Step 3: Guaranteed Price */}
          {step === 'guarantee' && (
            <motion.div
              key="guarantee"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <GuaranteedPriceCard
                result={guaranteeResult}
                onAccept={handleAccept}
                onChangeTier={handleTierChange}
                isAccepting={isAccepting}
              />
              
              <Button variant="outline" onClick={() => setStep('review')}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Zurück zur Übersicht
              </Button>
            </motion.div>
          )}
          
          {/* Step 4: Accepted */}
          {step === 'accepted' && (
            <motion.div
              key="accepted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4"
              >
                <Check className="h-8 w-8 text-emerald-600" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                Angebot angenommen!
              </h3>
              <p className="text-muted-foreground mb-6">
                Ihr Festpreis von {formatPrice(guaranteeResult.quote.finalPrice)} ist gesichert.
              </p>
              
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <Shield className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">Versicherung</p>
                  <p className="font-bold text-sm">CHF {guaranteeResult.quote.insuranceCoverage.toLocaleString('de-CH')}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <Lock className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">Garantie</p>
                  <p className="font-bold text-sm">Fixpreis</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <FileCheck className="h-4 w-4" />
                <span>Weiter zu Phase 4: Anbieter-Matching</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
});

export default QuoteOrchestrator;
