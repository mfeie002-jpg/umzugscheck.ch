/**
 * GoldenFlowWizard - Main orchestrator for the Golden Flow
 * 
 * Consolidated from 40+ variants into a single optimized flow.
 * Phase 2.2: Includes Labor Illusion loading animation
 * Phase 2.3: Connected to Edge Functions for real lead creation
 */

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { GoldenFlowData, GoldenFlowPriceEstimate, GoldenFlowStep } from './types';
import { GOLDEN_FLOW_STORAGE_KEY, GOLDEN_FLOW_SERVICES, BASE_PRICES } from './constants';
import { GoldenFlowProgress } from './components/GoldenFlowProgress';
import { GoldenFlowLaborIllusion } from './components/GoldenFlowLaborIllusion';
import { GoldenFlowStep1 } from './steps/GoldenFlowStep1';
import { GoldenFlowStep2 } from './steps/GoldenFlowStep2';
import { GoldenFlowStep3 } from './steps/GoldenFlowStep3';
import { GoldenFlowStep4 } from './steps/GoldenFlowStep4';
import { GoldenFlowSuccess } from './steps/GoldenFlowSuccess';
import { 
  trackFlowStart, 
  trackStepComplete, 
  trackFlowSubmit, 
  trackFlowSuccess, 
  trackFlowError,
  GOLDEN_FLOW_ID,
  GOLDEN_FLOW_STEPS
} from '@/lib/flow-analytics';

const getInitialFormData = (): GoldenFlowData => {
  try {
    const saved = localStorage.getItem(GOLDEN_FLOW_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...getDefaultFormData(), ...parsed, agbAccepted: false };
    }
  } catch (e) {
    console.error('Error loading saved form data:', e);
  }
  return getDefaultFormData();
};

const getDefaultFormData = (): GoldenFlowData => ({
  fromPLZ: '',
  fromCity: '',
  toPLZ: '',
  toCity: '',
  rooms: 3,
  floor: 2,
  hasElevator: true,
  moveDate: '',
  flexibleDate: true,
  selectedServices: ['umzug'],
  name: '',
  email: '',
  phone: '',
  comments: '',
  agbAccepted: false,
});

const calculatePriceEstimate = (data: GoldenFlowData): GoldenFlowPriceEstimate | null => {
  if (!data.fromPLZ || !data.toPLZ) return null;
  
  const roomKey = data.rooms <= 1.5 ? '1-1.5' : 
                  data.rooms <= 2.5 ? '2-2.5' : 
                  data.rooms <= 3.5 ? '3-3.5' : 
                  data.rooms <= 4.5 ? '4-4.5' : '5+';
  
  const base = BASE_PRICES[roomKey] || BASE_PRICES['3-3.5'];
  
  const servicesExtra = (data.selectedServices || []).reduce((sum, sId) => {
    const service = GOLDEN_FLOW_SERVICES.find(s => s.id === sId);
    return sum + (service?.priceAdd || 0);
  }, 0);
  
  const min = base.min + servicesExtra;
  const max = base.max + servicesExtra;
  const savings = Math.round((max - min) * 0.3);
  
  return { min, max, savings };
};

export function GoldenFlowWizard() {
  const [currentStep, setCurrentStep] = useState<GoldenFlowStep>(1);
  const [formData, setFormData] = useState<GoldenFlowData>(getInitialFormData);
  const [priceEstimate, setPriceEstimate] = useState<GoldenFlowPriceEstimate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLaborIllusion, setShowLaborIllusion] = useState(false);
  
  // Session tracking state
  const [estimateSessionId, setEstimateSessionId] = useState<string | null>(null);
  const [matchedCompanyIds, setMatchedCompanyIds] = useState<string[]>([]);
  const [leadId, setLeadId] = useState<string | null>(null);

  // Track flow start on mount
  useEffect(() => {
    trackFlowStart(GOLDEN_FLOW_ID, { 
      fromCity: formData.fromCity,
      toCity: formData.toCity 
    });
  }, []);

  // Calculate price when data changes
  useEffect(() => {
    const estimate = calculatePriceEstimate(formData);
    setPriceEstimate(estimate);
  }, [formData]);

  // Save to localStorage
  useEffect(() => {
    try {
      const { agbAccepted, ...dataToSave } = formData;
      localStorage.setItem(GOLDEN_FLOW_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Error saving form data:', e);
    }
  }, [formData]);

  const updateFormData = useCallback((updates: Partial<GoldenFlowData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep === 'success') return;
    const current = currentStep as number;
    
    // Track step completion
    trackStepComplete(GOLDEN_FLOW_ID, current, GOLDEN_FLOW_STEPS[current as keyof typeof GOLDEN_FLOW_STEPS], {
      fromCity: formData.fromCity,
      toCity: formData.toCity,
      rooms: formData.rooms,
    });
    
    const next = current + 1;
    setCurrentStep(next <= 4 ? (next as GoldenFlowStep) : 4);
  }, [currentStep, formData]);

  const prevStep = useCallback(() => {
    if (currentStep === 1 || currentStep === 'success') return;
    setCurrentStep(((currentStep as number) - 1) as GoldenFlowStep);
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    
    // Track submit attempt
    trackFlowSubmit(GOLDEN_FLOW_ID, {
      fromCity: formData.fromCity,
      toCity: formData.toCity,
      rooms: formData.rooms,
      services: formData.selectedServices,
    });
    
    try {
      // 1. Create estimate session BEFORE Labor Illusion starts
      const { data: sessionResponse, error: sessionError } = await supabase.functions.invoke('create-estimate-session', {
        body: {
          moveDetails: {
            fromPostal: formData.fromPLZ,
            fromCity: formData.fromCity,
            toPostal: formData.toPLZ,
            toCity: formData.toCity,
            rooms: String(formData.rooms),
            movingType: 'private',
            floorsFrom: String(formData.floor),
            floorsTo: '0',
            hasElevatorFrom: formData.hasElevator,
            hasElevatorTo: true,
            moveDate: formData.moveDate || undefined,
            calculatorType: 'golden-flow-v10',
            flexibleDate: formData.flexibleDate,
            selectedServices: formData.selectedServices,
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
        throw new Error(sessionResponse?.error?.message || 'Failed to create estimate session');
      }

      // Store session data
      setEstimateSessionId(sessionResponse.data.id);
      setMatchedCompanyIds(sessionResponse.data.matching_company_ids || []);
      
      console.log('[GoldenFlow] Estimate session created:', sessionResponse.data.id, 
        'Matched companies:', sessionResponse.data.matching_company_ids?.length || 0);

      // 2. Start Labor Illusion animation
      setShowLaborIllusion(true);
      
    } catch (error) {
      console.error('[GoldenFlow] Error creating estimate session:', error);
      trackFlowError(GOLDEN_FLOW_ID, 'SESSION_ERROR', { error: String(error) });
      toast.error('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      setIsSubmitting(false);
    }
  }, [formData, priceEstimate]);

  const handleLaborIllusionComplete = useCallback(async () => {
    if (!estimateSessionId) {
      console.error('[GoldenFlow] No estimate session ID available');
      toast.error('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      setIsSubmitting(false);
      setShowLaborIllusion(false);
      return;
    }

    try {
      // 3. Create lead AFTER Labor Illusion completes
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
        throw new Error(leadResponse?.error?.message || 'Failed to create lead');
      }

      // Store lead ID
      setLeadId(leadResponse.data.id);
      
      console.log('[GoldenFlow] Lead created:', leadResponse.data.id);

      // Track success
      trackFlowSuccess(GOLDEN_FLOW_ID, leadResponse.data.id, {
        fromCity: formData.fromCity,
        toCity: formData.toCity,
        matchedCompanies: matchedCompanyIds.length,
      });

      toast.success('Ihre Anfrage wurde erfolgreich gesendet!');
      setCurrentStep('success');
      localStorage.removeItem(GOLDEN_FLOW_STORAGE_KEY);
      
    } catch (error) {
      console.error('[GoldenFlow] Error creating lead:', error);
      trackFlowError(GOLDEN_FLOW_ID, 'LEAD_ERROR', { error: String(error) });
      toast.error('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
      setShowLaborIllusion(false);
    }
  }, [estimateSessionId, matchedCompanyIds, formData]);

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
      
      <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-card/95 backdrop-blur">
        <CardContent className="p-6 sm:p-8">
          {currentStep !== 'success' && (
            <GoldenFlowProgress currentStep={currentStep} />
          )}
          
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <GoldenFlowStep1
                key="step1"
                formData={formData}
                priceEstimate={priceEstimate}
                onUpdate={updateFormData}
                onNext={nextStep}
              />
            )}
            {currentStep === 2 && (
              <GoldenFlowStep2
                key="step2"
                formData={formData}
                priceEstimate={priceEstimate}
                onUpdate={updateFormData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {currentStep === 3 && (
              <GoldenFlowStep3
                key="step3"
                formData={formData}
                priceEstimate={priceEstimate}
                onUpdate={updateFormData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {currentStep === 4 && (
              <GoldenFlowStep4
                key="step4"
                formData={formData}
                priceEstimate={priceEstimate}
                isSubmitting={isSubmitting}
                onUpdate={updateFormData}
                onSubmit={handleSubmit}
                onBack={prevStep}
              />
            )}
            {currentStep === 'success' && (
              <GoldenFlowSuccess
                key="success"
                formData={formData}
                priceEstimate={priceEstimate}
                leadId={leadId}
                matchedCompanies={matchedCompanyIds.length}
              />
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </>
  );
}
