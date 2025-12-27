/**
 * V5a - High Contrast Accessibility
 * Focus: WCAG AAA compliance, maximum readability
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Eye, Check, Circle } from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';

const STEPS = ['Umzugsart', 'Adressen', 'Services', 'Kontakt'];

export const V5aHighContrast: React.FC = () => {
  const initialStep = useInitialStep(1);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selected, setSelected] = useState<string | null>('privat');
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-black focus:text-white"
      >
        Zum Hauptinhalt springen
      </a>

      {/* High contrast header */}
      <header className="border-b-4 border-black dark:border-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Umzugsrechner</h1>
          <div className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4" />
            <span>V5a Kontrast</span>
          </div>
        </div>
      </header>

      {/* Progress section */}
      <div className="px-6 py-4 border-b-2 border-black/20 dark:border-white/20">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-lg">
            Schritt {currentStep} von {STEPS.length}
          </span>
          <span className="font-bold text-lg">{progress.toFixed(0)}%</span>
        </div>
        <Progress 
          value={progress} 
          className="h-4 bg-gray-300 dark:bg-gray-700"
        />
        <div className="flex justify-between mt-2">
          {STEPS.map((step, i) => (
            <span
              key={i}
              className={`text-sm font-medium ${
                i + 1 === currentStep
                  ? 'underline underline-offset-4 decoration-4'
                  : i + 1 < currentStep
                  ? 'text-black/60 dark:text-white/60'
                  : 'text-black/40 dark:text-white/40'
              }`}
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main id="main-content" className="p-6">
        <Card className="p-6 border-4 border-black dark:border-white rounded-none">
          <h2 className="text-2xl font-bold mb-6 border-b-4 border-black dark:border-white pb-4">
            Welche Art von Umzug planen Sie?
          </h2>

          <div className="space-y-4" role="radiogroup" aria-label="Umzugsart auswählen">
            <HighContrastOption
              id="privat"
              label="Privatumzug"
              description="Wohnung, Haus oder Zimmer"
              selected={selected === 'privat'}
              onSelect={() => setSelected('privat')}
            />
            <HighContrastOption
              id="firma"
              label="Firmenumzug"
              description="Büro, Geschäft oder Lager"
              selected={selected === 'firma'}
              onSelect={() => setSelected('firma')}
            />
            <HighContrastOption
              id="senior"
              label="Seniorenumzug"
              description="Mit besonderer Betreuung"
              selected={selected === 'senior'}
              onSelect={() => setSelected('senior')}
            />
          </div>

          <div className="mt-8 flex gap-4">
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-16 text-xl font-bold border-4 border-black dark:border-white rounded-none hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                ← Zurück
              </Button>
            )}
            <Button
              size="lg"
              className="flex-1 h-16 text-xl font-bold bg-black text-white dark:bg-white dark:text-black rounded-none hover:bg-black/80 dark:hover:bg-white/80"
              onClick={() => setCurrentStep(Math.min(currentStep + 1, STEPS.length))}
            >
              {currentStep === STEPS.length ? 'Absenden' : 'Weiter →'}
            </Button>
          </div>
        </Card>

        {/* Help text */}
        <div className="mt-6 p-4 border-2 border-black/50 dark:border-white/50">
          <p className="text-lg">
            <strong>Hilfe benötigt?</strong> Rufen Sie uns an: 0800 123 456
          </p>
        </div>
      </main>
    </div>
  );
};

const HighContrastOption: React.FC<{
  id: string;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}> = ({ id, label, description, selected, onSelect }) => (
  <button
    role="radio"
    aria-checked={selected}
    onClick={onSelect}
    className={`w-full p-6 text-left border-4 transition-colors focus:outline-none focus:ring-4 focus:ring-black dark:focus:ring-white ${
      selected
        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
        : 'border-black dark:border-white hover:bg-black/10 dark:hover:bg-white/10'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${
        selected
          ? 'border-white dark:border-black bg-white dark:bg-black'
          : 'border-black dark:border-white'
      }`}>
        {selected && <Check className="h-5 w-5 text-black dark:text-white" />}
      </div>
      <div>
        <div className="text-xl font-bold">{label}</div>
        <div className={`text-lg ${selected ? 'text-white/80 dark:text-black/80' : 'text-black/70 dark:text-white/70'}`}>
          {description}
        </div>
      </div>
    </div>
  </button>
);

export default V5aHighContrast;
