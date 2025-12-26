/**
 * V3c - Bottom Sheet Pattern
 * Focus: Native app-like bottom sheet interactions
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, ChevronUp, Layers } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Umzugsart', icon: '🏠' },
  { id: 2, title: 'Adressen', icon: '📍' },
  { id: 3, title: 'Services', icon: '🔧' },
  { id: 4, title: 'Kontakt', icon: '📞' },
];

export const V3cBottomSheet: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sheetExpanded, setSheetExpanded] = useState(true);
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      {/* Background content preview */}
      <div className="p-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Umzugsrechner</h1>
          <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
            <Layers className="h-3 w-3" />
            <span>V3c Sheet</span>
          </div>
        </div>
        
        {/* Progress overview */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`text-center p-3 rounded-xl transition-all ${
                step.id === currentStep
                  ? 'bg-primary text-primary-foreground scale-105'
                  : step.id < currentStep
                  ? 'bg-primary/20'
                  : 'bg-muted'
              }`}
            >
              <div className="text-2xl mb-1">{step.icon}</div>
              <div className="text-xs font-medium truncate">{step.title}</div>
            </div>
          ))}
        </div>

        <Progress value={progress} className="h-2" />
      </div>

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-2xl transition-all duration-300 ${
          sheetExpanded ? 'h-[70vh]' : 'h-24'
        }`}
      >
        {/* Sheet handle */}
        <div
          className="flex justify-center py-3 cursor-pointer"
          onClick={() => setSheetExpanded(!sheetExpanded)}
        >
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Sheet header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold">
              {STEPS[currentStep - 1].title}
            </h2>
            <p className="text-sm text-muted-foreground">
              Schritt {currentStep} von {STEPS.length}
            </p>
          </div>
          <button
            className="p-2 hover:bg-muted rounded-full"
            onClick={() => setSheetExpanded(!sheetExpanded)}
          >
            <ChevronUp
              className={`h-5 w-5 transition-transform ${
                sheetExpanded ? '' : 'rotate-180'
              }`}
            />
          </button>
        </div>

        {/* Sheet content */}
        {sheetExpanded && (
          <div className="p-6 overflow-y-auto h-[calc(70vh-140px)]">
            <div className="space-y-4">
              {currentStep === 1 && (
                <>
                  <SheetOption emoji="🏠" label="Privatumzug" desc="Wohnung oder Haus" selected />
                  <SheetOption emoji="🏢" label="Firmenumzug" desc="Büro oder Geschäft" />
                  <SheetOption emoji="👴" label="Seniorenumzug" desc="Mit extra Betreuung" />
                </>
              )}
              {currentStep > 1 && (
                <div className="text-center py-8 text-muted-foreground">
                  Inhalt für Schritt {currentStep}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sheet footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border safe-area-inset-bottom">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Zurück
              </Button>
            )}
            <Button
              size="lg"
              className="flex-1"
              onClick={() => setCurrentStep(Math.min(currentStep + 1, STEPS.length))}
            >
              {currentStep === STEPS.length ? 'Absenden' : 'Weiter'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SheetOption: React.FC<{
  emoji: string;
  label: string;
  desc: string;
  selected?: boolean;
}> = ({ emoji, label, desc, selected }) => (
  <button
    className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all active:scale-[0.98] ${
      selected
        ? 'border-primary bg-primary/5'
        : 'border-border hover:border-primary/50'
    }`}
  >
    <span className="text-3xl">{emoji}</span>
    <div>
      <div className="font-medium">{label}</div>
      <div className="text-sm text-muted-foreground">{desc}</div>
    </div>
  </button>
);

export default V3cBottomSheet;
