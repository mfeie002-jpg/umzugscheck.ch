/**
 * V3a - Mobile-First Base
 * Focus: Touch-optimized, large targets, bottom-sheet patterns
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Smartphone, Check } from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';

const STEPS = [
  { id: 1, title: 'Umzugsart', shortTitle: 'Art' },
  { id: 2, title: 'Details', shortTitle: 'Details' },
  { id: 3, title: 'Services', shortTitle: 'Services' },
  { id: 4, title: 'Kontakt', shortTitle: 'Kontakt' },
];

export const V3aMobileFirst: React.FC = () => {
  const initialStep = useInitialStep(1);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Mobile-optimized sticky header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Schritt {currentStep} von {STEPS.length}
          </span>
          <div className="flex items-center gap-1 text-xs text-primary">
            <Smartphone className="h-3 w-3" />
            <span>V3a Mobile-First</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        
        {/* Step pills - scrollable on mobile */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-4 px-4">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                step.id === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : step.id < currentStep
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step.id < currentStep ? (
                <Check className="h-3 w-3" />
              ) : (
                step.shortTitle
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content area - optimized for thumb reach */}
      <div className="p-4">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {STEPS[currentStep - 1].title}
          </h2>
          
          {/* Large touch targets */}
          <div className="space-y-3">
            {currentStep === 1 && (
              <>
                <TouchOption label="Privatumzug" selected />
                <TouchOption label="Firmenumzug" />
                <TouchOption label="Seniorenumzug" />
              </>
            )}
            {currentStep === 2 && (
              <div className="text-center py-8 text-muted-foreground">
                Adress- und Grössenangaben
              </div>
            )}
            {currentStep === 3 && (
              <div className="text-center py-8 text-muted-foreground">
                Zusatzleistungen auswählen
              </div>
            )}
            {currentStep === 4 && (
              <div className="text-center py-8 text-muted-foreground">
                Kontaktdaten eingeben
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Fixed bottom navigation - thumb-friendly */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 safe-area-inset-bottom">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-14"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Zurück
            </Button>
          )}
          <Button
            size="lg"
            className="flex-1 h-14"
            onClick={() => setCurrentStep(Math.min(currentStep + 1, STEPS.length))}
          >
            {currentStep === STEPS.length ? 'Absenden' : 'Weiter'}
            {currentStep < STEPS.length && <ArrowRight className="h-5 w-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

const TouchOption: React.FC<{ label: string; selected?: boolean }> = ({ label, selected }) => (
  <button
    className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all active:scale-[0.98] ${
      selected
        ? 'border-primary bg-primary/5 text-primary'
        : 'border-border hover:border-primary/50'
    }`}
  >
    {label}
  </button>
);

export default V3aMobileFirst;
