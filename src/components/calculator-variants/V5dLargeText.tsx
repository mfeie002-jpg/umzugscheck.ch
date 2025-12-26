/**
 * V5d - Large Text & Touch Targets
 * Focus: Elderly-friendly, large fonts, extra spacing
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Type, Plus, Minus } from 'lucide-react';

const STEPS = ['Art', 'Wo', 'Was', 'Kontakt'];

export const V5dLargeText: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selected, setSelected] = useState<string | null>('privat');
  const [fontSize, setFontSize] = useState(1.25); // 1.25rem = 20px base
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div 
      className="min-h-screen bg-background"
      style={{ fontSize: `${fontSize}rem` }}
    >
      {/* Font size controls */}
      <div className="sticky top-0 z-50 bg-muted border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          <span className="font-medium flex items-center gap-2">
            <Type className="h-5 w-5" />
            V5d Gross
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm mr-2">Schriftgrösse:</span>
            <button
              onClick={() => setFontSize(Math.max(1, fontSize - 0.125))}
              className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:bg-muted focus:ring-4 focus:ring-primary/50"
              aria-label="Schrift verkleinern"
            >
              <Minus className="h-5 w-5" />
            </button>
            <button
              onClick={() => setFontSize(Math.min(2, fontSize + 0.125))}
              className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:bg-muted focus:ring-4 focus:ring-primary/50"
              aria-label="Schrift vergrössern"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 py-6 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-xl">
            Schritt {currentStep} von {STEPS.length}
          </span>
          <span className="font-bold text-xl text-primary">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-4" />
        <div className="flex justify-between mt-4">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`text-lg font-medium ${
                i + 1 === currentStep
                  ? 'text-primary font-bold'
                  : i + 1 < currentStep
                  ? 'text-muted-foreground'
                  : 'text-muted-foreground/50'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="p-6">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-3">
            Welchen Umzug planen Sie?
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Wählen Sie eine Option aus
          </p>

          <div className="space-y-4">
            <LargeOption
              label="Privatumzug"
              description="Wohnung oder Haus"
              selected={selected === 'privat'}
              onClick={() => setSelected('privat')}
            />
            <LargeOption
              label="Firmenumzug"
              description="Büro oder Geschäft"
              selected={selected === 'firma'}
              onClick={() => setSelected('firma')}
            />
            <LargeOption
              label="Seniorenumzug"
              description="Mit besonderer Betreuung"
              selected={selected === 'senior'}
              onClick={() => setSelected('senior')}
            />
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            {currentStep > 1 && (
              <Button
                variant="outline"
                className="h-20 text-xl font-semibold flex-1"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                ← Zurück
              </Button>
            )}
            <Button
              className="h-20 text-xl font-semibold flex-1"
              onClick={() => setCurrentStep(Math.min(currentStep + 1, STEPS.length))}
            >
              {currentStep === STEPS.length ? 'Absenden' : 'Weiter →'}
            </Button>
          </div>
        </Card>

        {/* Help section */}
        <Card className="mt-6 p-6 bg-primary/5 border-primary/20">
          <h2 className="text-2xl font-bold mb-3">Brauchen Sie Hilfe?</h2>
          <p className="text-lg mb-4">
            Rufen Sie uns kostenlos an. Wir helfen Ihnen gerne weiter.
          </p>
          <Button 
            variant="outline" 
            className="h-16 text-xl w-full sm:w-auto px-8"
          >
            📞 0800 123 456
          </Button>
        </Card>
      </main>
    </div>
  );
};

const LargeOption: React.FC<{
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}> = ({ label, description, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full p-6 rounded-xl border-3 text-left transition-all
      focus:outline-none focus:ring-4 focus:ring-primary/50
      ${selected
        ? 'border-primary bg-primary/10 border-4'
        : 'border-border hover:border-primary/50 border-2'
      }`}
  >
    <div className="flex items-center gap-4">
      <div
        className={`w-8 h-8 rounded-full border-3 flex items-center justify-center flex-shrink-0 ${
          selected
            ? 'border-primary bg-primary'
            : 'border-muted-foreground'
        }`}
      >
        {selected && <span className="text-primary-foreground text-xl">✓</span>}
      </div>
      <div>
        <div className="text-2xl font-semibold">{label}</div>
        <div className="text-lg text-muted-foreground">{description}</div>
      </div>
    </div>
  </button>
);

export default V5dLargeText;
