/**
 * V5e - Reduced Motion & Simplified
 * Focus: No animations, simple transitions, cognitive accessibility
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Pause, Check } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Schritt 1: Umzugsart' },
  { id: 2, title: 'Schritt 2: Adressen' },
  { id: 3, title: 'Schritt 3: Services' },
  { id: 4, title: 'Schritt 4: Kontakt' },
];

export const V5eReducedMotion: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selected, setSelected] = useState<string>('privat');
  const progress = (currentStep / STEPS.length) * 100;

  return (
    // prefers-reduced-motion is respected via Tailwind's motion-reduce
    <div className="min-h-screen bg-background motion-reduce:transition-none">
      {/* Simple header */}
      <header className="border-b border-border px-6 py-4 bg-muted">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Umzugsrechner</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Pause className="h-4 w-4" />
            <span>V5e Ruhig</span>
          </div>
        </div>
      </header>

      {/* Clear, simple progress */}
      <div className="px-6 py-4 bg-muted/50 border-b border-border">
        <p className="font-medium mb-2">
          Fortschritt: {currentStep} von {STEPS.length} Schritten abgeschlossen
        </p>
        <Progress value={progress} className="h-3 motion-reduce:transition-none" />
        
        {/* Text-based step list */}
        <ul className="mt-4 space-y-1">
          {STEPS.map((step) => (
            <li
              key={step.id}
              className={`flex items-center gap-2 ${
                step.id === currentStep
                  ? 'font-bold text-primary'
                  : step.id < currentStep
                  ? 'text-muted-foreground'
                  : 'text-muted-foreground/50'
              }`}
            >
              {step.id < currentStep && (
                <Check className="h-4 w-4 text-green-600" />
              )}
              {step.id === currentStep && (
                <span className="w-4 h-4 flex items-center justify-center">→</span>
              )}
              {step.id > currentStep && (
                <span className="w-4 h-4 flex items-center justify-center">○</span>
              )}
              {step.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Main content - no animations */}
      <main className="p-6">
        <Card className="p-6 motion-reduce:transition-none">
          <h2 className="text-2xl font-bold mb-2">
            {STEPS[currentStep - 1].title}
          </h2>
          <p className="text-muted-foreground mb-6">
            Bitte wählen Sie eine der folgenden Optionen:
          </p>

          {/* Simple, clear options without animations */}
          <div className="space-y-3">
            <SimpleOption
              label="Privatumzug"
              description="Für Wohnungen und Häuser"
              selected={selected === 'privat'}
              onClick={() => setSelected('privat')}
            />
            <SimpleOption
              label="Firmenumzug"
              description="Für Büros und Geschäfte"
              selected={selected === 'firma'}
              onClick={() => setSelected('firma')}
            />
            <SimpleOption
              label="Seniorenumzug"
              description="Mit besonderer Betreuung und Unterstützung"
              selected={selected === 'senior'}
              onClick={() => setSelected('senior')}
            />
          </div>

          {/* Clear, simple navigation */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex gap-4">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 h-14 motion-reduce:transition-none"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  ← Zurück zum vorherigen Schritt
                </Button>
              )}
              <Button
                size="lg"
                className="flex-1 h-14 motion-reduce:transition-none"
                onClick={() => setCurrentStep(Math.min(currentStep + 1, STEPS.length))}
              >
                {currentStep === STEPS.length
                  ? 'Formular absenden'
                  : 'Weiter zum nächsten Schritt →'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Status summary */}
        <Card className="mt-4 p-4 bg-muted/30">
          <h3 className="font-medium mb-2">Ihre bisherigen Angaben:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Umzugsart: {selected === 'privat' ? 'Privatumzug' : selected === 'firma' ? 'Firmenumzug' : 'Seniorenumzug'}</li>
            {currentStep > 1 && <li>• Adressen: (wird in Schritt 2 erfasst)</li>}
            {currentStep > 2 && <li>• Services: (wird in Schritt 3 erfasst)</li>}
          </ul>
        </Card>
      </main>
    </div>
  );
};

const SimpleOption: React.FC<{
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}> = ({ label, description, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full p-4 rounded-lg border-2 text-left motion-reduce:transition-none
      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
      ${selected
        ? 'border-primary bg-primary/5'
        : 'border-border hover:border-primary/50'
      }`}
  >
    <div className="flex items-start gap-3">
      <div
        className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0
          ${selected ? 'border-primary bg-primary' : 'border-muted-foreground'}`}
      >
        {selected && <Check className="h-3 w-3 text-primary-foreground" />}
      </div>
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  </button>
);

export default V5eReducedMotion;
