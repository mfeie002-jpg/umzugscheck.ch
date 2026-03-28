/**
 * V5b - Screen Reader Optimized
 * Focus: ARIA labels, live regions, semantic structure
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Volume2 } from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';

const STEPS = [
  { id: 1, title: 'Umzugsart', description: 'Wählen Sie die Art Ihres Umzugs' },
  { id: 2, title: 'Adressen', description: 'Geben Sie Start und Ziel ein' },
  { id: 3, title: 'Services', description: 'Wählen Sie Zusatzleistungen' },
  { id: 4, title: 'Kontakt', description: 'Ihre Kontaktinformationen' },
];

export const V5bScreenReader: React.FC = () => {
  const initialStep = useInitialStep(1);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selected, setSelected] = useState<string | null>('privat');
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const progress = (currentStep / STEPS.length) * 100;
  
  // Step-specific content data
  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return {
          options: [
            { id: 'privat', label: 'Privatumzug', description: 'Für Wohnungen und Häuser' },
            { id: 'firma', label: 'Firmenumzug', description: 'Für Büros und Geschäfte' },
            { id: 'senior', label: 'Seniorenumzug', description: 'Mit besonderer Betreuung' },
          ]
        };
      case 2:
        return {
          options: [
            { id: 'studio', label: 'Studio / 1 Zimmer', description: 'Kleine Wohnung' },
            { id: '2-3', label: '2-3 Zimmer', description: 'Mittlere Wohnung' },
            { id: '4+', label: '4+ Zimmer', description: 'Grosse Wohnung' },
          ]
        };
      case 3:
        return {
          options: [
            { id: 'lokal', label: 'Lokaler Umzug', description: 'Innerhalb der Stadt' },
            { id: 'regional', label: 'Regionaler Umzug', description: 'Bis 50km Entfernung' },
            { id: 'national', label: 'Nationaler Umzug', description: 'Schweizweit' },
          ]
        };
      case 4:
        return {
          options: [
            { id: 'standard', label: 'Standard-Service', description: 'Transport und Laden' },
            { id: 'comfort', label: 'Komfort-Service', description: 'Inkl. Ein-/Auspacken' },
            { id: 'premium', label: 'Premium-Service', description: 'Rundum-Sorglos' },
          ]
        };
      default:
        return { options: [] };
    }
  };
  // Announce step changes
  const announce = (message: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = message;
    }
  };

  const handleStepChange = (newStep: number) => {
    setCurrentStep(newStep);
    announce(`Schritt ${newStep} von ${STEPS.length}: ${STEPS[newStep - 1].title}. ${STEPS[newStep - 1].description}`);
    // Focus main content
    setTimeout(() => mainRef.current?.focus(), 100);
  };

  const handleSelect = (value: string, label: string) => {
    setSelected(value);
    announce(`${label} ausgewählt`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Live region for announcements */}
      <div
        ref={liveRegionRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Skip links */}
      <nav aria-label="Schnellnavigation" className="sr-only focus-within:not-sr-only">
        <ul className="fixed top-0 left-0 z-50 bg-background p-4 space-y-2">
          <li>
            <a
              href="#main-content"
              className="block p-2 bg-primary text-primary-foreground"
            >
              Zum Hauptinhalt
            </a>
          </li>
          <li>
            <a
              href="#step-navigation"
              className="block p-2 bg-primary text-primary-foreground"
            >
              Zur Schrittnavigation
            </a>
          </li>
        </ul>
      </nav>

      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Umzugsrechner</h1>
          <div className="flex items-center gap-2 text-sm text-primary">
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            <span>V5b Screenreader</span>
          </div>
        </div>
      </header>

      {/* Step navigation */}
      <nav
        id="step-navigation"
        aria-label="Fortschritt"
        className="px-6 py-4 border-b border-border"
      >
        <div className="mb-2">
          <p id="progress-label" className="font-medium">
            Schritt {currentStep} von {STEPS.length}: {STEPS[currentStep - 1].title}
          </p>
        </div>
        <Progress
          value={progress}
          className="h-2"
          aria-labelledby="progress-label"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
        />
        <ol className="flex justify-between mt-4" role="list">
          {STEPS.map((step) => (
            <li key={step.id} className="flex items-center gap-2">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : step.id < currentStep
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
                aria-hidden="true"
              >
                {step.id < currentStep ? '✓' : step.id}
              </span>
              <span className="sr-only">
                {step.id < currentStep ? `${step.title} - abgeschlossen` : step.title}
                {step.id === currentStep ? ' - aktueller Schritt' : ''}
              </span>
              <span className="hidden sm:block text-sm" aria-hidden="true">
                {step.title}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      {/* Main content */}
      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="p-6 outline-none"
        aria-labelledby="step-heading"
      >
        <Card className="p-6">
          <h2 id="step-heading" className="text-2xl font-semibold mb-2">
            {STEPS[currentStep - 1].title}
          </h2>
          <p className="text-muted-foreground mb-6" id="step-description">
            {STEPS[currentStep - 1].description}
          </p>

          <fieldset aria-describedby="step-description">
            <legend className="sr-only">Wählen Sie eine Option</legend>
            <div className="space-y-3" role="radiogroup">
              {getStepContent().options.map((option) => (
                <ScreenReaderOption
                  key={option.id}
                  id={option.id}
                  label={option.label}
                  description={option.description}
                  selected={selected === option.id}
                  onSelect={() => handleSelect(option.id, option.label)}
                />
              ))}
            </div>
          </fieldset>

          <div className="mt-8 flex gap-4">
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-12"
                onClick={() => handleStepChange(currentStep - 1)}
              >
                <span aria-hidden="true">← </span>
                Zurück zu Schritt {currentStep - 1}
              </Button>
            )}
            <Button
              size="lg"
              className="flex-1 h-12"
              onClick={() => handleStepChange(Math.min(currentStep + 1, STEPS.length))}
            >
              {currentStep === STEPS.length ? (
                'Formular absenden'
              ) : (
                <>
                  Weiter zu Schritt {currentStep + 1}
                  <span aria-hidden="true"> →</span>
                </>
              )}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

const ScreenReaderOption: React.FC<{
  id: string;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}> = ({ id, label, description, selected, onSelect }) => (
  <div>
    <button
      role="radio"
      aria-checked={selected}
      aria-describedby={`${id}-desc`}
      onClick={onSelect}
      className={`w-full p-4 rounded-lg border-2 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selected ? 'border-primary bg-primary' : 'border-muted-foreground'
          }`}
          aria-hidden="true"
        >
          {selected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
        </div>
        <div>
          <div className="font-medium">{label}</div>
          <div id={`${id}-desc`} className="text-sm text-muted-foreground">
            {description}
          </div>
        </div>
      </div>
    </button>
  </div>
);

export default V5bScreenReader;
