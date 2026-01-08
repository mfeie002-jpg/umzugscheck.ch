/**
 * V5c - Keyboard Navigation Focus
 * Focus: Full keyboard operability, visible focus states, arrow key navigation
 */

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Keyboard } from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';

const STEP_OPTIONS: Record<number, { id: string; label: string; shortcut: string }[]> = {
  1: [
    { id: 'privat', label: 'Privatumzug', shortcut: '1' },
    { id: 'firma', label: 'Firmenumzug', shortcut: '2' },
    { id: 'senior', label: 'Seniorenumzug', shortcut: '3' },
  ],
  2: [
    { id: 'studio', label: 'Studio / 1 Zimmer', shortcut: '1' },
    { id: '2-3', label: '2-3 Zimmer Wohnung', shortcut: '2' },
    { id: '4-5', label: '4-5 Zimmer Wohnung', shortcut: '3' },
    { id: 'haus', label: 'Haus', shortcut: '4' },
  ],
  3: [
    { id: 'lokal', label: 'Lokal (gleiche Stadt)', shortcut: '1' },
    { id: 'regional', label: 'Regional (< 50km)', shortcut: '2' },
    { id: 'national', label: 'National (> 50km)', shortcut: '3' },
    { id: 'international', label: 'International', shortcut: '4' },
  ],
  4: [
    { id: 'standard', label: 'Standard (2-4 Wochen)', shortcut: '1' },
    { id: 'flexibel', label: 'Flexibel (< 2 Wochen)', shortcut: '2' },
    { id: 'express', label: 'Express (< 1 Woche)', shortcut: '3' },
  ],
};

const STEP_TITLES: Record<number, { title: string; description: string }> = {
  1: { title: 'Umzugsart wählen', description: 'Was für ein Umzug planen Sie?' },
  2: { title: 'Wohnungsgrösse', description: 'Wie gross ist Ihre aktuelle Wohnung?' },
  3: { title: 'Entfernung', description: 'Wie weit ist der Umzugsweg?' },
  4: { title: 'Zeitrahmen', description: 'Wann soll der Umzug stattfinden?' },
};

export const V5cKeyboardNav: React.FC = () => {
  const initialStep = useInitialStep(1);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const progress = (currentStep / 4) * 100;
  
  // Get current step options and title
  const currentOptions = STEP_OPTIONS[currentStep] || STEP_OPTIONS[1];
  const currentTitle = STEP_TITLES[currentStep] || STEP_TITLES[1];

  // Reset selected index when step changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [currentStep]);

  // Focus management
  useEffect(() => {
    optionRefs.current[selectedIndex]?.focus();
  }, [selectedIndex]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKey = (e: globalThis.KeyboardEvent) => {
      // Show shortcuts hint on ? key
      if (e.key === '?') {
        setShowShortcuts(true);
        setTimeout(() => setShowShortcuts(false), 3000);
      }
      // Number shortcuts
      if (['1', '2', '3', '4'].includes(e.key)) {
        const index = parseInt(e.key) - 1;
        if (index < currentOptions.length) {
          setSelectedIndex(index);
        }
      }
      // Enter to proceed
      if (e.key === 'Enter' && e.ctrlKey) {
        setCurrentStep(Math.min(currentStep + 1, 4));
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [currentStep]);

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        setSelectedIndex((index + 1) % currentOptions.length);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        setSelectedIndex((index - 1 + currentOptions.length) % currentOptions.length);
        break;
      case 'Home':
        e.preventDefault();
        setSelectedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setSelectedIndex(currentOptions.length - 1);
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        // Selection confirmed
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Keyboard shortcuts overlay */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-6 animate-in fade-in">
          <Card className="p-6 max-w-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Tastenkürzel
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Option 1/2/3 wählen</span>
                <kbd className="px-2 py-1 bg-muted rounded">1</kbd>
                <kbd className="px-2 py-1 bg-muted rounded">2</kbd>
                <kbd className="px-2 py-1 bg-muted rounded">3</kbd>
              </div>
              <div className="flex justify-between">
                <span>Navigation</span>
                <kbd className="px-2 py-1 bg-muted rounded">↑↓</kbd>
              </div>
              <div className="flex justify-between">
                <span>Weiter</span>
                <kbd className="px-2 py-1 bg-muted rounded">Ctrl+Enter</kbd>
              </div>
              <div className="flex justify-between">
                <span>Hilfe anzeigen</span>
                <kbd className="px-2 py-1 bg-muted rounded">?</kbd>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Umzugsrechner</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShortcuts(true)}
              className="flex items-center gap-2 text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
            >
              <Keyboard className="h-4 w-4" />
              <span>V5c Tastatur</span>
              <kbd className="text-xs px-1 py-0.5 bg-muted rounded">?</kbd>
            </button>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="px-6 py-4 border-b border-border">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          Schritt {currentStep} von 4
        </p>
      </div>

      {/* Main content */}
      <main className="p-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-2">{currentTitle.title}</h2>
          <p className="text-muted-foreground mb-6">
            {currentTitle.description}
          </p>

          <div
            role="listbox"
            aria-label={currentTitle.title}
            aria-activedescendant={currentOptions[selectedIndex]?.id}
            className="space-y-2"
          >
            {currentOptions.map((option, index) => (
              <button
                key={option.id}
                ref={(el) => (optionRefs.current[index] = el)}
                id={option.id}
                role="option"
                aria-selected={selectedIndex === index}
                tabIndex={selectedIndex === index ? 0 : -1}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onClick={() => setSelectedIndex(index)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all
                  focus:outline-none focus:ring-4 focus:ring-primary/50
                  ${selectedIndex === index
                    ? 'border-primary bg-primary/5 ring-2 ring-primary'
                    : 'border-border hover:border-primary/50'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <kbd className="w-8 h-8 bg-muted rounded flex items-center justify-center text-sm font-mono">
                      {option.shortcut}
                    </kbd>
                    <span className="font-medium">{option.label}</span>
                  </div>
                  {selectedIndex === index && (
                    <span className="text-primary text-sm">✓ Ausgewählt</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-12 focus:ring-4 focus:ring-primary/50"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                ← Zurück
              </Button>
            )}
            <Button
              size="lg"
              className="flex-1 h-12 focus:ring-4 focus:ring-primary/50"
              onClick={() => setCurrentStep(Math.min(currentStep + 1, 4))}
            >
              Weiter →
              <span className="ml-2 text-xs opacity-70">Ctrl+Enter</span>
            </Button>
          </div>
        </Card>

        {/* Keyboard hint */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Drücken Sie <kbd className="px-1 py-0.5 bg-muted rounded">?</kbd> für alle Tastenkürzel
        </p>
      </main>
    </div>
  );
};

export default V5cKeyboardNav;
