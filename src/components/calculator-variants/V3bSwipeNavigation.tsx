/**
 * V3b - Swipe Navigation
 * Focus: Gesture-based navigation, swipe between steps
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Hand } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import { useInitialStep } from '@/hooks/use-initial-step';

const STEPS = [
  { id: 1, title: 'Umzugsart wählen' },
  { id: 2, title: 'Adressen & Grösse' },
  { id: 3, title: 'Zusatzleistungen' },
  { id: 4, title: 'Ihre Kontaktdaten' },
];

export const V3bSwipeNavigation: React.FC = () => {
  const initialStep = useInitialStep(1);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [swipeHint, setSwipeHint] = useState(initialStep === 1); // Only show hint on step 1
  const progress = (currentStep / STEPS.length) * 100;

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
        setSwipeHint(false);
      }
    },
    onSwipedRight: () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
        setSwipeHint(false);
      }
    },
    trackMouse: false,
    trackTouch: true,
  });

  return (
    <div className="min-h-screen bg-background" {...handlers}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {currentStep}/{STEPS.length}
          </span>
          <div className="flex items-center gap-1 text-xs text-primary">
            <Hand className="h-3 w-3" />
            <span>V3b Swipe</span>
          </div>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Swipe hint overlay */}
      {swipeHint && currentStep === 1 && (
        <div className="absolute inset-0 z-40 bg-background/80 flex items-center justify-center">
          <div className="text-center p-6 animate-pulse">
            <div className="flex items-center justify-center gap-4 mb-4">
              <ChevronLeft className="h-8 w-8 text-muted-foreground" />
              <Hand className="h-12 w-12 text-primary" />
              <ChevronRight className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">Wischen Sie zum Navigieren</p>
            <p className="text-sm text-muted-foreground mt-1">
              Links für zurück, rechts für weiter
            </p>
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => setSwipeHint(false)}
            >
              Verstanden
            </Button>
          </div>
        </div>
      )}

      {/* Step content with swipe area */}
      <div className="p-4">
        <Card className="p-6 min-h-[60vh]">
          <div className="flex items-center justify-between mb-6">
            <button
              className={`p-2 rounded-full transition-opacity ${
                currentStep === 1 ? 'opacity-30' : 'opacity-100'
              }`}
              onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <h2 className="text-xl font-semibold text-center">
              {STEPS[currentStep - 1].title}
            </h2>
            
            <button
              className={`p-2 rounded-full transition-opacity ${
                currentStep === STEPS.length ? 'opacity-30' : 'opacity-100'
              }`}
              onClick={() => currentStep < STEPS.length && setCurrentStep(currentStep + 1)}
              disabled={currentStep === STEPS.length}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`h-2 rounded-full transition-all ${
                  step.id === currentStep
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Content placeholder */}
          <div className="text-center py-12 text-muted-foreground">
            <p>Schritt {currentStep} Inhalt</p>
            <p className="text-sm mt-2">← Wischen zum Navigieren →</p>
          </div>
        </Card>
      </div>

      {/* Bottom action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <Button className="w-full h-14" size="lg">
          {currentStep === STEPS.length ? 'Offerten anfordern' : 'Weiter wischen →'}
        </Button>
      </div>
    </div>
  );
};

export default V3bSwipeNavigation;
