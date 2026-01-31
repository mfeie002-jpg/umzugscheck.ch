/**
 * Journey Orchestrator
 * 
 * Unified 6-phase journey management for the Relo-OS.
 * Handles phase navigation, state persistence, and progress tracking.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Package, 
  Calculator, 
  CreditCard, 
  Truck, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Check
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import type { 
  ReloOSPhase, 
  ReloOSJourney, 
  RoutePhaseData,
  InventoryPhaseData,
  QuotePhaseData,
  BookingPhaseData,
  MovingPhaseData,
  CompletePhaseData,
  UserArchetype 
} from '@/lib/relo-os/types';

// Phase configuration
const PHASES: { 
  id: ReloOSPhase; 
  label: string; 
  shortLabel: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  { 
    id: 'route', 
    label: 'Route planen', 
    shortLabel: 'Route',
    icon: <MapPin className="h-4 w-4" />,
    description: 'Von wo nach wo ziehen Sie?'
  },
  { 
    id: 'inventory', 
    label: 'Inventar erfassen', 
    shortLabel: 'Inventar',
    icon: <Package className="h-4 w-4" />,
    description: 'Was muss transportiert werden?'
  },
  { 
    id: 'quote', 
    label: 'Preis erhalten', 
    shortLabel: 'Preis',
    icon: <Calculator className="h-4 w-4" />,
    description: 'Ihr garantierter Festpreis'
  },
  { 
    id: 'booking', 
    label: 'Buchen', 
    shortLabel: 'Buchen',
    icon: <CreditCard className="h-4 w-4" />,
    description: 'Firma auswählen und bezahlen'
  },
  { 
    id: 'moving', 
    label: 'Umzugstag', 
    shortLabel: 'Umzug',
    icon: <Truck className="h-4 w-4" />,
    description: 'Live-Tracking Ihres Umzugs'
  },
  { 
    id: 'complete', 
    label: 'Abschluss', 
    shortLabel: 'Fertig',
    icon: <CheckCircle2 className="h-4 w-4" />,
    description: 'Übergabe und Admin erledigt'
  },
];

export interface JourneyOrchestratorProps {
  journeyId?: string;
  initialPhase?: ReloOSPhase;
  archetype?: UserArchetype;
  leadId?: string;
  onPhaseChange?: (phase: ReloOSPhase) => void;
  onComplete?: () => void;
  children?: (props: {
    currentPhase: ReloOSPhase;
    phaseData: ReloOSJourney['phases'];
    goToPhase: (phase: ReloOSPhase) => void;
    goNext: () => void;
    goBack: () => void;
    updatePhaseData: <T extends keyof ReloOSJourney['phases']>(
      phase: T, 
      data: ReloOSJourney['phases'][T]
    ) => void;
    canGoNext: boolean;
    canGoBack: boolean;
    isLastPhase: boolean;
  }) => React.ReactNode;
}

export const JourneyOrchestrator = ({
  journeyId: initialJourneyId,
  initialPhase = 'route',
  archetype,
  leadId,
  onPhaseChange,
  onComplete,
  children,
}: JourneyOrchestratorProps) => {
  const isMobile = useIsMobile();
  const [journeyId, setJourneyId] = useState<string | undefined>(initialJourneyId);
  const [currentPhase, setCurrentPhase] = useState<ReloOSPhase>(initialPhase);
  const [phaseData, setPhaseData] = useState<ReloOSJourney['phases']>({
    route: null,
    inventory: null,
    quote: null,
    booking: null,
    moving: null,
    complete: null,
  });
  const [isLoading, setIsLoading] = useState(!!initialJourneyId);

  // Phase index calculations
  const currentPhaseIndex = useMemo(
    () => PHASES.findIndex(p => p.id === currentPhase),
    [currentPhase]
  );

  const progressPercentage = useMemo(
    () => Math.round(((currentPhaseIndex + 1) / PHASES.length) * 100),
    [currentPhaseIndex]
  );

  const canGoBack = currentPhaseIndex > 0;
  const canGoNext = currentPhaseIndex < PHASES.length - 1;
  const isLastPhase = currentPhaseIndex === PHASES.length - 1;

  // Load existing journey from database
  useEffect(() => {
    if (!initialJourneyId) {
      setIsLoading(false);
      return;
    }

    const loadJourney = async () => {
      const { data, error } = await supabase
        .from('relo_journeys')
        .select('*')
        .eq('id', initialJourneyId)
        .single();

      if (error) {
        console.error('Error loading journey:', error);
        setIsLoading(false);
        return;
      }

      if (data) {
        setCurrentPhase(data.current_phase as ReloOSPhase);
        setPhaseData({
          route: (data.route_data as unknown as RoutePhaseData) || null,
          inventory: (data.inventory_data as unknown as InventoryPhaseData) || null,
          quote: (data.quote_data as unknown as QuotePhaseData) || null,
          booking: (data.booking_data as unknown as BookingPhaseData) || null,
          moving: (data.moving_data as unknown as MovingPhaseData) || null,
          complete: (data.complete_data as unknown as CompletePhaseData) || null,
        });
      }
      setIsLoading(false);
    };

    loadJourney();
  }, [initialJourneyId]);

  // Create or update journey in database
  const persistJourney = useCallback(async (
    phase: ReloOSPhase, 
    data: ReloOSJourney['phases']
  ) => {
    const journeyData = {
      current_phase: phase as string,
      lead_id: leadId || null,
      archetype: archetype || null,
      route_data: data.route ? JSON.parse(JSON.stringify(data.route)) : null,
      inventory_data: data.inventory ? JSON.parse(JSON.stringify(data.inventory)) : null,
      quote_data: data.quote ? JSON.parse(JSON.stringify(data.quote)) : null,
      booking_data: data.booking ? JSON.parse(JSON.stringify(data.booking)) : null,
      moving_data: data.moving ? JSON.parse(JSON.stringify(data.moving)) : null,
      complete_data: data.complete ? JSON.parse(JSON.stringify(data.complete)) : null,
      updated_at: new Date().toISOString(),
    };

    if (journeyId) {
      // Update existing journey
      await supabase
        .from('relo_journeys')
        .update(journeyData)
        .eq('id', journeyId);
    } else {
      // Create new journey
      const { data: newJourney, error } = await supabase
        .from('relo_journeys')
        .insert([journeyData])
        .select('id')
        .single();

      if (!error && newJourney) {
        setJourneyId(newJourney.id);
      }
    }
  }, [journeyId, leadId, archetype]);

  // Navigation handlers
  const goToPhase = useCallback((phase: ReloOSPhase) => {
    setCurrentPhase(phase);
    onPhaseChange?.(phase);
    persistJourney(phase, phaseData);
  }, [onPhaseChange, persistJourney, phaseData]);

  const goNext = useCallback(() => {
    if (!canGoNext) return;
    const nextPhase = PHASES[currentPhaseIndex + 1].id;
    goToPhase(nextPhase);
  }, [canGoNext, currentPhaseIndex, goToPhase]);

  const goBack = useCallback(() => {
    if (!canGoBack) return;
    const prevPhase = PHASES[currentPhaseIndex - 1].id;
    goToPhase(prevPhase);
  }, [canGoBack, currentPhaseIndex, goToPhase]);

  // Update phase data
  const updatePhaseData = useCallback(<T extends keyof ReloOSJourney['phases']>(
    phase: T, 
    data: ReloOSJourney['phases'][T]
  ) => {
    setPhaseData(prev => {
      const newData = { ...prev, [phase]: data };
      persistJourney(currentPhase, newData);
      return newData;
    });
  }, [currentPhase, persistJourney]);

  // Handle journey completion
  const handleComplete = useCallback(async () => {
    if (journeyId) {
      await supabase
        .from('relo_journeys')
        .update({ 
          completed_at: new Date().toISOString(),
          current_phase: 'complete',
        })
        .eq('id', journeyId);
    }
    onComplete?.();
  }, [journeyId, onComplete]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress Header */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-4">
          {/* Desktop Stepper */}
          {!isMobile && (
            <div className="flex items-center justify-between mb-4">
              {PHASES.map((phase, index) => {
                const isCompleted = index < currentPhaseIndex;
                const isCurrent = index === currentPhaseIndex;
                const isUpcoming = index > currentPhaseIndex;

                return (
                  <div key={phase.id} className="flex items-center flex-1">
                    {/* Step Circle */}
                    <button
                      onClick={() => isCompleted && goToPhase(phase.id)}
                      disabled={isUpcoming}
                      className={`
                        relative flex items-center justify-center w-10 h-10 rounded-full
                        transition-all duration-200
                        ${isCompleted 
                          ? 'bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90' 
                          : isCurrent 
                            ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' 
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        phase.icon
                      )}
                    </button>

                    {/* Label */}
                    <div className="ml-3 hidden lg:block">
                      <p className={`text-sm font-medium ${
                        isCurrent ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {phase.label}
                      </p>
                    </div>

                    {/* Connector Line */}
                    {index < PHASES.length - 1 && (
                      <div className={`
                        flex-1 h-0.5 mx-4
                        ${isCompleted ? 'bg-primary' : 'bg-muted'}
                      `} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Mobile Stepper */}
          {isMobile && (
            <div className="space-y-3">
              {/* Phase dots */}
              <div className="flex items-center justify-center gap-2">
                {PHASES.map((phase, index) => (
                  <button
                    key={phase.id}
                    onClick={() => index < currentPhaseIndex && goToPhase(phase.id)}
                    disabled={index > currentPhaseIndex}
                    className={`
                      w-3 h-3 rounded-full transition-all
                      ${index === currentPhaseIndex 
                        ? 'bg-primary w-6' 
                        : index < currentPhaseIndex 
                          ? 'bg-primary/50' 
                          : 'bg-muted'
                      }
                    `}
                  />
                ))}
              </div>

              {/* Current phase info */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  {PHASES[currentPhaseIndex].icon}
                  <span className="font-medium">{PHASES[currentPhaseIndex].label}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {PHASES[currentPhaseIndex].description}
                </p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Fortschritt</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5" />
          </div>
        </CardContent>
      </Card>

      {/* Phase Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {children?.({
            currentPhase,
            phaseData,
            goToPhase,
            goNext,
            goBack,
            updatePhaseData,
            canGoNext,
            canGoBack,
            isLastPhase,
          })}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={!canGoBack}
          className="min-h-[52px]"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">
            Schritt {currentPhaseIndex + 1} von {PHASES.length}
          </Badge>
        </div>

        {isLastPhase ? (
          <Button
            onClick={handleComplete}
            variant="default"
            className="min-h-[52px] bg-primary hover:bg-primary/90"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Abschliessen
          </Button>
        ) : (
          <Button
            onClick={goNext}
            disabled={!canGoNext}
            className="min-h-[52px]"
          >
            Weiter
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export type { ReloOSPhase, ReloOSJourney };
