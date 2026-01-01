/**
 * Ultimate Swiss Flow - Best of 31 Variants
 * 
 * SCORE OPTIMIZED VERSION:
 * - Enhanced Trust Badge placement (above fold + near CTA)
 * - Sticky CTA on mobile with progress indicator
 * - ASTAG + Swiss Quality prominent
 * 
 * Kombiniert die besten Elemente:
 * - Klare 5-Step Struktur (v1)
 * - Trust Badge Placement (v2e)
 * - Progress Indicator (v3.e)
 * - Mobile Optimierung (ultimate-all)
 * - Form UX (v2)
 * 
 * Ziel-Score: 98/100
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UltimateProgressIndicator } from "./UltimateProgressIndicator";
import { UltimateTrustBadges, UltimateTrustBanner } from "./UltimateTrustBadges";
import { UltimateStickyFooter } from "./UltimateStickyFooter";
import { StepAddresses } from "./steps/StepAddresses";
import { StepInventory } from "./steps/StepInventory";
import { StepServices } from "./steps/StepServices";
import { StepContact } from "./steps/StepContact";
import { StepSummary } from "./steps/StepSummary";
import { StepSuccess } from "./steps/StepSuccess";

export interface UltimateFlowData {
  // Step 1: Addresses
  fromPostal: string;
  fromCity: string;
  toPostal: string;
  toCity: string;
  
  // Step 2: Inventory
  roomCount: string;
  inventoryMode: 'quick' | 'detailed';
  detailedInventory?: Record<string, number>;
  
  // Step 3: Services
  services: string[];
  
  // Step 4: Contact
  moveDate: string;
  dateFlexibility: 'exact' | 'flexible' | 'very_flexible';
  name: string;
  email: string;
  phone: string;
  
  // Meta
  acceptPrivacy: boolean;
}

const INITIAL_DATA: UltimateFlowData = {
  fromPostal: '',
  fromCity: '',
  toPostal: '',
  toCity: '',
  roomCount: '',
  inventoryMode: 'quick',
  services: [],
  moveDate: '',
  dateFlexibility: 'flexible',
  name: '',
  email: '',
  phone: '',
  acceptPrivacy: false,
};

const STEPS = [
  { id: 1, label: 'Adressen', shortLabel: 'Von/Nach' },
  { id: 2, label: 'Umzugsgut', shortLabel: 'Inventar' },
  { id: 3, label: 'Services', shortLabel: 'Extras' },
  { id: 4, label: 'Kontakt', shortLabel: 'Termin' },
  { id: 5, label: 'Absenden', shortLabel: 'Fertig' },
];

export function UltimateSwissFlow() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<UltimateFlowData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateData = useCallback((updates: Partial<UltimateFlowData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 1:
        return !!(data.fromPostal && data.toPostal);
      case 2:
        return data.roomCount !== '';
      case 3:
        return true; // Services are optional
      case 4:
        return !!(data.name && data.email && data.moveDate);
      case 5:
        return data.acceptPrivacy;
      default:
        return false;
    }
  }, [step, data]);

  const getHint = useCallback(() => {
    switch (step) {
      case 1:
        if (!data.fromPostal) return "Bitte Start-PLZ eingeben";
        if (!data.toPostal) return "Bitte Ziel-PLZ eingeben";
        return null;
      case 2:
        if (!data.roomCount) return "Bitte Wohnungsgrösse wählen";
        return null;
      case 4:
        if (!data.name) return "Bitte Name eingeben";
        if (!data.email) return "Bitte E-Mail eingeben";
        if (!data.moveDate) return "Bitte Umzugsdatum wählen";
        return null;
      case 5:
        if (!data.acceptPrivacy) return "Bitte Datenschutz akzeptieren";
        return null;
      default:
        return null;
    }
  }, [step, data]);

  const handleNext = useCallback(async () => {
    if (!canProceed()) return;

    if (step === 5) {
      setIsSubmitting(true);
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitting(false);
      setIsSubmitted(true);
      return;
    }

    setStep(prev => Math.min(prev + 1, 5));
  }, [step, canProceed]);

  const handleBack = useCallback(() => {
    setStep(prev => Math.max(prev - 1, 1));
  }, []);

  const handleEditSection = useCallback((targetStep: number) => {
    setStep(targetStep);
  }, []);

  if (isSubmitted) {
    return <StepSuccess data={data} />;
  }

  const stepVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Calculate progress percentage for sticky CTA
  const progressPercent = Math.round((step / 5) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Header with Trust Badges - SCORE OPTIMIZATION */}
      <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 max-w-2xl">
          <UltimateTrustBadges />
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 max-w-2xl">
          <UltimateProgressIndicator 
            currentStep={step} 
            steps={STEPS} 
          />
        </div>
      </div>

      {/* Main Content - extra padding for sticky footer */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-2xl pb-40 md:pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {step === 1 && (
              <StepAddresses data={data} updateData={updateData} />
            )}
            {step === 2 && (
              <StepInventory data={data} updateData={updateData} />
            )}
            {step === 3 && (
              <StepServices data={data} updateData={updateData} />
            )}
            {step === 4 && (
              <StepContact data={data} updateData={updateData} />
            )}
            {step === 5 && (
              <StepSummary 
                data={data} 
                updateData={updateData}
                onEditSection={handleEditSection}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Sticky Footer CTA */}
      <UltimateStickyFooter
        step={step}
        totalSteps={5}
        canProceed={canProceed()}
        hint={getHint() ?? null}
        onBack={handleBack}
        onNext={handleNext}
        isSubmitting={isSubmitting}
        isLastStep={step === 5}
      />
    </div>
  );
}
