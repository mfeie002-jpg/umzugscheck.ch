/**
 * GoldenFlowWizard - Main orchestrator for the Golden Flow
 * 
 * Consolidated from 40+ variants into a single optimized flow.
 */

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { GoldenFlowData, GoldenFlowPriceEstimate, GoldenFlowStep } from './types';
import { GOLDEN_FLOW_STORAGE_KEY, GOLDEN_FLOW_SERVICES, BASE_PRICES } from './constants';
import { GoldenFlowProgress } from './components/GoldenFlowProgress';
import { GoldenFlowStep1 } from './steps/GoldenFlowStep1';
import { GoldenFlowStep2 } from './steps/GoldenFlowStep2';
import { GoldenFlowStep3 } from './steps/GoldenFlowStep3';
import { GoldenFlowStep4 } from './steps/GoldenFlowStep4';
import { GoldenFlowSuccess } from './steps/GoldenFlowSuccess';

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
    const next = (currentStep as number) + 1;
    setCurrentStep(next <= 4 ? (next as GoldenFlowStep) : 4);
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep === 1 || currentStep === 'success') return;
    setCurrentStep(((currentStep as number) - 1) as GoldenFlowStep);
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call with labor illusion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Ihre Anfrage wurde erfolgreich gesendet!');
      setCurrentStep('success');
      localStorage.removeItem(GOLDEN_FLOW_STORAGE_KEY);
    } catch (error) {
      toast.error('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
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
            />
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
