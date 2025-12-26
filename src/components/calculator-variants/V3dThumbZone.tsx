/**
 * V3d - Thumb Zone Optimized
 * Focus: All interactive elements in thumb-reachable areas
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ThumbsUp } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Art' },
  { id: 2, title: 'Wo' },
  { id: 3, title: 'Was' },
  { id: 4, title: 'Wer' },
];

export const V3dThumbZone: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>('privat');
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal top bar - non-interactive */}
      <div className="px-4 py-2 text-center border-b border-border">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ThumbsUp className="h-3 w-3" />
          <span>V3d Thumb-Zone</span>
        </div>
      </div>

      {/* Content area - scrollable, non-critical */}
      <div className="flex-1 p-4 pb-48">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {currentStep === 1 && 'Welche Art Umzug?'}
            {currentStep === 2 && 'Von wo nach wo?'}
            {currentStep === 3 && 'Was brauchen Sie?'}
            {currentStep === 4 && 'Wie erreichen wir Sie?'}
          </h1>
          <p className="text-muted-foreground">
            Schritt {currentStep} von {STEPS.length}
          </p>
        </div>

        {/* Visual progress */}
        <div className="flex justify-center gap-3 mb-8">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-medium transition-all ${
                step.id === currentStep
                  ? 'bg-primary text-primary-foreground scale-110'
                  : step.id < currentStep
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step.id < currentStep ? <Check className="h-5 w-5" /> : step.id}
            </div>
          ))}
        </div>

        {/* Info content - read-only, can be anywhere */}
        <Card className="p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground text-center">
            ℹ️ Alle Eingaben sind unten im Daumenbereich
          </p>
        </Card>
      </div>

      {/* THUMB ZONE - All interactive elements here (bottom 40% of screen) */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        {/* Progress */}
        <Progress value={progress} className="h-1" />
        
        {/* Main interaction area */}
        <div className="p-4 space-y-3 max-h-[45vh] overflow-y-auto">
          {currentStep === 1 && (
            <div className="grid grid-cols-1 gap-3">
              <ThumbButton
                label="Privatumzug"
                sublabel="Wohnung/Haus"
                selected={selectedType === 'privat'}
                onClick={() => setSelectedType('privat')}
              />
              <ThumbButton
                label="Firmenumzug"
                sublabel="Büro/Geschäft"
                selected={selectedType === 'firma'}
                onClick={() => setSelectedType('firma')}
              />
              <ThumbButton
                label="Seniorenumzug"
                sublabel="Mit Betreuung"
                selected={selectedType === 'senior'}
                onClick={() => setSelectedType('senior')}
              />
            </div>
          )}
          {currentStep > 1 && (
            <div className="text-center py-6 text-muted-foreground">
              Eingabefelder für Schritt {currentStep}
            </div>
          )}
        </div>

        {/* Navigation - always at very bottom */}
        <div className="p-4 pt-2 flex gap-3 border-t border-border safe-area-inset-bottom">
          {currentStep > 1 ? (
            <>
              <Button
                variant="outline"
                size="lg"
                className="h-16 text-lg flex-1"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                ← Zurück
              </Button>
              <Button
                size="lg"
                className="h-16 text-lg flex-[2]"
                onClick={() => setCurrentStep(Math.min(currentStep + 1, STEPS.length))}
              >
                {currentStep === STEPS.length ? 'Absenden ✓' : 'Weiter →'}
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              className="h-16 text-lg w-full"
              onClick={() => setCurrentStep(2)}
              disabled={!selectedType}
            >
              Weiter →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const ThumbButton: React.FC<{
  label: string;
  sublabel: string;
  selected?: boolean;
  onClick: () => void;
}> = ({ label, sublabel, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full p-5 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
      selected
        ? 'border-primary bg-primary/10'
        : 'border-border'
    }`}
  >
    <div className="font-semibold text-lg">{label}</div>
    <div className="text-sm text-muted-foreground">{sublabel}</div>
  </button>
);

export default V3dThumbZone;
