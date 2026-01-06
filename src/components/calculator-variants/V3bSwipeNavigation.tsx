/**
 * V3b - Swipe Navigation (Quick Win Enhanced)
 * Focus: Gesture-based navigation + Button alternatives + Clear instructions
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Hand, ArrowLeft, ArrowRight, Smartphone } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import { useInitialStep } from '@/hooks/use-initial-step';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { id: 1, title: 'Umzugsart wählen' },
  { id: 2, title: 'Adressen & Grösse' },
  { id: 3, title: 'Zusatzleistungen' },
  { id: 4, title: 'Ihre Kontaktdaten' },
];

export const V3bSwipeNavigation: React.FC = () => {
  const initialStep = useInitialStep(1);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [showHint, setShowHint] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const progress = (currentStep / STEPS.length) * 100;

  // Auto-hide hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const goNext = () => {
    if (currentStep < STEPS.length) {
      setSwipeDirection('left');
      setCurrentStep(currentStep + 1);
      setShowHint(false);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setSwipeDirection('right');
      setCurrentStep(currentStep - 1);
      setShowHint(false);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: goNext,
    onSwipedRight: goBack,
    trackMouse: false,
    trackTouch: true,
  });

  return (
    <div className="min-h-screen bg-background" {...handlers}>
      {/* Header with Progress */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Schritt {currentStep} von {STEPS.length}
          </span>
          <div className="flex items-center gap-1 text-xs text-primary">
            <Smartphone className="h-3 w-3" />
            <span>V3b Swipe + Buttons</span>
          </div>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Quick Win: Animated Instruction Hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary/10 border border-primary/20 rounded-lg mx-4 mt-4 p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <motion.div animate={{ x: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <Hand className="h-5 w-5 text-primary" />
                </motion.div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Navigation</p>
                <p className="text-xs text-muted-foreground">Wischen <b>oder</b> Buttons nutzen</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowHint(false)}>
                OK
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step content with animation */}
      <div className="p-4">
        <Card className="p-6 min-h-[50vh]">
          {/* Navigation Header with Buttons */}
          <div className="flex items-center justify-between mb-6">
            {/* Quick Win: Visible Back Button */}
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 transition-opacity ${
                currentStep === 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
              }`}
              onClick={goBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Zurück</span>
            </Button>
            
            <h2 className="text-xl font-semibold text-center flex-1 mx-4">
              {STEPS[currentStep - 1].title}
            </h2>
            
            {/* Quick Win: Visible Next Button */}
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 transition-opacity ${
                currentStep === STEPS.length ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
              }`}
              onClick={goNext}
              disabled={currentStep === STEPS.length}
            >
              <span className="hidden sm:inline">Weiter</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Step indicators (clickable) */}
          <div className="flex justify-center gap-2 mb-8">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => {
                  setCurrentStep(step.id);
                  setShowHint(false);
                }}
                className={`h-3 rounded-full transition-all cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  step.id === currentStep
                    ? 'w-8 bg-primary'
                    : step.id < currentStep
                    ? 'w-3 bg-primary/50'
                    : 'w-3 bg-muted'
                }`}
                aria-label={`Gehe zu Schritt ${step.id}`}
              />
            ))}
          </div>

          {/* Content with Swipe Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: swipeDirection === 'left' ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: swipeDirection === 'left' ? -50 : 50 }}
              transition={{ duration: 0.2 }}
              className="text-center py-12 text-muted-foreground"
            >
              <p className="text-lg font-medium mb-2">Schritt {currentStep} Inhalt</p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <ChevronLeft className="h-4 w-4" /> Wischen
                </span>
                <span className="text-muted-foreground/50">oder</span>
                <span className="flex items-center gap-1">
                  Buttons <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>

      {/* Fixed Bottom Action - Dual Button Design */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button 
              variant="outline" 
              className="flex-1 h-14" 
              size="lg"
              onClick={goBack}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Zurück
            </Button>
          )}
          <Button 
            className={`h-14 ${currentStep > 1 ? 'flex-1' : 'w-full'}`} 
            size="lg"
            onClick={currentStep === STEPS.length ? undefined : goNext}
          >
            {currentStep === STEPS.length ? 'Offerten anfordern' : 'Weiter'}
            {currentStep < STEPS.length && <ArrowRight className="h-5 w-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default V3bSwipeNavigation;
