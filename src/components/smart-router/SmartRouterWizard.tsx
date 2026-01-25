/**
 * SmartRouterWizard - Main orchestrator
 * Implements "Smart Router" pattern from Gemini UX Audit
 * 
 * Flow: PLZ → Qualification → Routing (Video/Form) → Contact → Success
 * 
 * Now integrated with MoveProject for end-to-end journey orchestration.
 * @see docs/strategy/INVISIBLE_MOVE_IMPLEMENTATION.md
 */

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SmartRouterData, SmartRouterStep, SmartRouterPriceEstimate, SMART_ROUTER_CONFIG } from './types';
import { BASE_PRICES } from './constants';
import { SmartRouterHero } from './components/SmartRouterHero';
import { PLZStep } from './steps/PLZStep';
import { QualificationStep } from './steps/QualificationStep';
import { RoutingStep } from './steps/RoutingStep';
import { ContactStep } from './steps/ContactStep';
import { SuccessStep } from './steps/SuccessStep';
import { GoldenFlowLaborIllusion } from '@/components/golden-flow/components/GoldenFlowLaborIllusion';
import { useMoveProject } from '@/hooks/useMoveProject';
import { trackMoveEvent } from '@/lib/move-project';

const getInitialFormData = (): SmartRouterData => {
  try {
    const saved = localStorage.getItem(SMART_ROUTER_CONFIG.STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...getDefaultFormData(), ...parsed, agbAccepted: false };
    }
  } catch {
    // Ignore localStorage errors
  }
  return getDefaultFormData();
};

const getDefaultFormData = (): SmartRouterData => ({
  fromPLZ: '',
  fromCity: '',
  toPLZ: '',
  toCity: '',
  rooms: 3.5,
  moveDate: '',
  flexibleDate: true,
  selectedMethod: null,
  name: '',
  email: '',
  phone: '',
  comments: '',
  agbAccepted: false,
  selectedServices: ['umzug'],
});

const calculatePriceEstimate = (data: SmartRouterData): SmartRouterPriceEstimate | null => {
  if (!data.fromPLZ || !data.toPLZ) return null;
  
  const roomKey = data.rooms <= 1.5 ? '1-1.5' : 
                  data.rooms <= 2.5 ? '2-2.5' : 
                  data.rooms <= 3.5 ? '3-3.5' : 
                  data.rooms <= 4.5 ? '4-4.5' : '5+';
  
  const base = BASE_PRICES[roomKey] || BASE_PRICES['3-3.5'];
  const isHighValue = data.rooms > SMART_ROUTER_CONFIG.VIDEO_THRESHOLD_ROOMS;
  
  return { 
    min: base.min, 
    max: base.max, 
    savings: Math.round((base.max - base.min) * 0.3),
    isHighValue,
  };
};

export function SmartRouterWizard() {
  const [currentStep, setCurrentStep] = useState<SmartRouterStep>('plz');
  const [formData, setFormData] = useState<SmartRouterData>(getInitialFormData);
  const [priceEstimate, setPriceEstimate] = useState<SmartRouterPriceEstimate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLaborIllusion, setShowLaborIllusion] = useState(false);
  
  const [estimateSessionId, setEstimateSessionId] = useState<string | null>(null);
  const [matchedCompanyIds, setMatchedCompanyIds] = useState<string[]>([]);
  
  // Move Project integration for journey orchestration
  const { 
    project, 
    createProject, 
    setOrigin, 
    setDestination, 
    setMoveDate,
    trackEvent,
    phaseProgress 
  } = useMoveProject();

  // Calculate price when qualification data changes
  useEffect(() => {
    const estimate = calculatePriceEstimate(formData);
    setPriceEstimate(estimate);
  }, [formData.fromPLZ, formData.toPLZ, formData.rooms]);

  // Save to localStorage
  useEffect(() => {
    try {
      const { agbAccepted, ...dataToSave } = formData;
      localStorage.setItem(SMART_ROUTER_CONFIG.STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // Ignore localStorage errors
    }
  }, [formData]);

  const updateFormData = useCallback((updates: Partial<SmartRouterData>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      
      // Sync with MoveProject orchestrator
      if (updates.fromPLZ && project) {
        setOrigin({ postalCode: updates.fromPLZ, city: updates.fromCity || '' });
      }
      if (updates.toPLZ && project) {
        setDestination({ postalCode: updates.toPLZ, city: updates.toCity || '' });
      }
      if (updates.moveDate && project) {
        setMoveDate(updates.moveDate);
      }
      
      return newData;
    });
  }, [project, setOrigin, setDestination, setMoveDate]);

  // Initialize MoveProject on first interaction
  const initializeProject = useCallback(async () => {
    if (!project) {
      const newProject = await createProject('homepage');
      if (newProject) {
        console.log('[SmartRouter] MoveProject initialized:', newProject.id);
      }
    }
  }, [project, createProject]);

  // Navigation handlers
  const goToQualification = useCallback(() => {
    initializeProject();
    trackEvent('address_entered');
    setCurrentStep('qualification');
  }, [initializeProject, trackEvent]);
  const goToRouting = useCallback(() => setCurrentStep('routing'), []);
  const goToContact = useCallback(() => setCurrentStep('contact'), []);
  const goBack = useCallback(() => {
    switch (currentStep) {
      case 'qualification': setCurrentStep('plz'); break;
      case 'routing': setCurrentStep('qualification'); break;
      case 'contact': setCurrentStep('routing'); break;
      default: break;
    }
  }, [currentStep]);

  // Video path selected
  const handleSelectVideo = useCallback(() => {
    updateFormData({ selectedMethod: 'video' });
    // For now, skip to contact. In future, this could go to video capture
    setCurrentStep('contact');
  }, [updateFormData]);

  // Form path selected
  const handleSelectForm = useCallback(() => {
    updateFormData({ selectedMethod: 'form' });
    setCurrentStep('contact');
  }, [updateFormData]);

  // Submit handler
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    
    try {
      // Create estimate session
      const { data: sessionResponse, error: sessionError } = await supabase.functions.invoke('create-estimate-session', {
        body: {
          moveDetails: {
            fromPostal: formData.fromPLZ,
            fromCity: formData.fromCity,
            toPostal: formData.toPLZ,
            toCity: formData.toCity,
            rooms: String(formData.rooms),
            movingType: 'private',
            floorsFrom: '0',
            floorsTo: '0',
            hasElevatorFrom: true,
            hasElevatorTo: true,
            moveDate: formData.moveDate || undefined,
            calculatorType: 'smart-router-v10',
            flexibleDate: formData.flexibleDate,
            selectedServices: formData.selectedServices,
            selectedMethod: formData.selectedMethod,
          },
          estimate: {
            priceMin: priceEstimate?.min || 0,
            priceMax: priceEstimate?.max || 0,
            volumeM3: formData.rooms * 10,
            estimatedHours: formData.rooms * 2,
            distance: 50,
          }
        }
      });

      if (sessionError || !sessionResponse?.success) {
        throw new Error(sessionResponse?.error?.message || 'Session error');
      }

      setEstimateSessionId(sessionResponse.data.id);
      setMatchedCompanyIds(sessionResponse.data.matching_company_ids || []);
      
      // Start labor illusion
      setShowLaborIllusion(true);
      
    } catch (error) {
      console.error('[SmartRouter] Error:', error);
      toast.error('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      setIsSubmitting(false);
    }
  }, [formData, priceEstimate]);

  // After labor illusion completes
  const handleLaborIllusionComplete = useCallback(async () => {
    if (!estimateSessionId) {
      toast.error('Fehler bei der Verarbeitung.');
      setIsSubmitting(false);
      setShowLaborIllusion(false);
      return;
    }

    try {
      const { data: leadResponse, error: leadError } = await supabase.functions.invoke('create-funnel-lead', {
        body: {
          estimateSessionId,
          selectedCompanyIds: matchedCompanyIds.length > 0 ? matchedCompanyIds : undefined,
          contact: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          message: formData.comments || undefined,
        }
      });

      if (leadError || !leadResponse?.success) {
        throw new Error(leadResponse?.error?.message || 'Lead creation failed');
      }

      toast.success('Ihre Anfrage wurde erfolgreich gesendet!');
      setCurrentStep('success');
      localStorage.removeItem(SMART_ROUTER_CONFIG.STORAGE_KEY);
      
    } catch (error) {
      console.error('[SmartRouter] Lead error:', error);
      toast.error('Ein Fehler ist aufgetreten.');
    } finally {
      setIsSubmitting(false);
      setShowLaborIllusion(false);
    }
  }, [estimateSessionId, matchedCompanyIds, formData]);

  const showHero = currentStep === 'plz';
  const showProgress = !['plz', 'success'].includes(currentStep);

  return (
    <>
      {/* Labor Illusion overlay */}
      <AnimatePresence>
        {showLaborIllusion && (
          <GoldenFlowLaborIllusion
            isActive={showLaborIllusion}
            onComplete={handleLaborIllusionComplete}
            matchedCompanies={matchedCompanyIds.length || 3}
          />
        )}
      </AnimatePresence>

      <div className="w-full max-w-2xl mx-auto">
        {/* Hero with Festpreis headline - only on PLZ step */}
        {showHero && (
          <SmartRouterHero variant="festpreis" className="mb-8" />
        )}

        {/* Progress indicator */}
        {showProgress && (
          <div className="flex justify-center gap-2 mb-6">
            {['qualification', 'routing', 'contact'].map((step, i) => (
              <div
                key={step}
                className={`h-1.5 w-12 rounded-full transition-colors ${
                  ['qualification', 'routing', 'contact'].indexOf(currentStep) >= i
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}

        {/* Main content card */}
        <Card className="border-0 shadow-xl bg-card/95 backdrop-blur">
          <CardContent className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {currentStep === 'plz' && (
                <PLZStep
                  key="plz"
                  formData={formData}
                  onUpdate={updateFormData}
                  onNext={goToQualification}
                />
              )}
              {currentStep === 'qualification' && (
                <QualificationStep
                  key="qualification"
                  formData={formData}
                  onUpdate={updateFormData}
                  onNext={goToRouting}
                  onBack={goBack}
                />
              )}
              {currentStep === 'routing' && (
                <RoutingStep
                  key="routing"
                  formData={formData}
                  onUpdate={updateFormData}
                  onSelectVideo={handleSelectVideo}
                  onSelectForm={handleSelectForm}
                  onBack={goBack}
                />
              )}
              {currentStep === 'contact' && (
                <ContactStep
                  key="contact"
                  formData={formData}
                  priceEstimate={priceEstimate}
                  isSubmitting={isSubmitting}
                  onUpdate={updateFormData}
                  onSubmit={handleSubmit}
                  onBack={goBack}
                />
              )}
              {currentStep === 'success' && (
                <SuccessStep
                  key="success"
                  formData={formData}
                  priceEstimate={priceEstimate}
                  matchedCompanies={matchedCompanyIds.length}
                />
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
