/**
 * V4d - Gamified Experience
 * Focus: Progress rewards, achievements, engagement mechanics
 * 
 * UX Improvements Applied:
 * - Specific CTA text instead of generic "Weiter"
 * - Clear visual hierarchy for primary/secondary actions
 * - Minimum 44x44px touch targets
 * - No horizontal scroll on mobile
 * - Safe area padding for fixed elements
 * - Consistent button styles (primary vs ghost)
 * - Progress indicators with clear labels
 * - Accessibility: proper contrast, aria labels
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Star, 
  Zap, 
  Gift, 
  Lock, 
  Sparkles, 
  Medal,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight
} from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, label: 'Umzugsart', reward: 'Starter', icon: Star, points: 100 },
  { id: 2, label: 'Details', reward: 'Explorer', icon: Zap, points: 150 },
  { id: 3, label: 'Kontakt', reward: 'Pro', icon: Trophy, points: 200 },
  { id: 4, label: 'Offerten', reward: 'Champion', icon: Medal, points: 250, bonus: '10% Rabatt' },
];

const MOVE_TYPES = [
  { id: 'private', label: 'Privatumzug', points: 100, description: 'Für Ihren persönlichen Umzug' },
  { id: 'business', label: 'Firmenumzug', points: 150, description: 'Für Büro- und Geschäftsumzüge' },
  { id: 'senior', label: 'Seniorenumzug', points: 120, description: 'Mit besonderer Betreuung', badge: 'Beliebt' },
];

export const V4dGamified: React.FC = () => {
  const initialStep = useInitialStep(1);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [points, setPoints] = useState(50 + (initialStep - 1) * 100);
  const [showReward, setShowReward] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('private');

  const currentStepData = STEPS[currentStep - 1];
  const nextStepData = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep >= STEPS.length) return;
    
    setPoints(points + (currentStepData?.points || 100));
    setShowReward(true);
    setTimeout(() => {
      setShowReward(false);
      setCurrentStep(currentStep + 1);
    }, 1500);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getNextButtonText = () => {
    if (currentStep >= STEPS.length) {
      return 'Offerten erhalten';
    }
    return `Zu ${nextStepData?.label || 'Weiter'}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500/10 to-background flex flex-col">
      {/* Gamified header - fixed safe area */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Back button with proper touch target */}
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                aria-label="Zurück zum vorherigen Schritt"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full">
                <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" aria-hidden="true" />
                <span className="font-bold">{points}</span>
              </div>
              <span className="text-sm opacity-80">Punkte</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs opacity-75">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            <span>Gamified Flow</span>
          </div>
        </div>
      </header>

      {/* Reward popup */}
      {showReward && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 animate-in fade-in"
          role="dialog"
          aria-label="Belohnung erhalten"
        >
          <div className="text-center animate-in zoom-in">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce shadow-lg">
              <Trophy className="h-12 w-12 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold mb-2">+{currentStepData?.points || 100} Punkte!</h2>
            <p className="text-muted-foreground">
              {currentStepData?.reward} Level erreicht
            </p>
          </div>
        </div>
      )}

      {/* Main content - scrollable */}
      <main className="flex-1 p-4 pb-32 overflow-x-hidden">
        <div className="max-w-2xl mx-auto">
          {/* Progress track with rewards */}
          <nav 
            className="flex justify-between items-start mb-8 relative px-2"
            aria-label="Fortschritt"
          >
            {/* Progress line */}
            <div className="absolute top-6 left-6 right-6 h-1 bg-muted rounded-full">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500 rounded-full"
                style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                role="progressbar"
                aria-valuenow={currentStep}
                aria-valuemin={1}
                aria-valuemax={STEPS.length}
              />
            </div>
            
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isLocked = currentStep < step.id;
              
              return (
                <div 
                  key={step.id} 
                  className="relative z-10 flex flex-col items-center flex-1"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm",
                      isCompleted && "bg-gradient-to-br from-green-500 to-emerald-500 text-white",
                      isCurrent && "bg-gradient-to-br from-purple-500 to-indigo-500 text-white ring-4 ring-purple-500/30 scale-110",
                      isLocked && "bg-muted text-muted-foreground"
                    )}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    {isCompleted ? (
                      <Check className="h-6 w-6" aria-hidden="true" />
                    ) : isLocked ? (
                      <Lock className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    )}
                  </div>
                  <span className={cn(
                    "text-xs mt-2 font-medium text-center",
                    isCurrent && "text-purple-600 dark:text-purple-400"
                  )}>
                    {step.label}
                  </span>
                  {step.bonus && (
                    <span className={cn(
                      "text-[10px] mt-0.5 text-center",
                      isCompleted ? "text-green-600" : "text-purple-500"
                    )}>
                      {isCompleted ? '✓ ' : ''}{step.bonus}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Main content card */}
          <Card className="p-6 border-2 border-purple-500/20 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="px-3 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-semibold">
                Schritt {currentStep} von {STEPS.length}
              </div>
              <h1 className="text-xl font-bold">{currentStepData?.label}</h1>
            </div>

            <h2 className="text-lg font-semibold mb-4 text-foreground">
              Welche Art von Umzug planen Sie?
            </h2>

            {/* Options with proper touch targets and visual feedback */}
            <div className="space-y-3 mb-6" role="radiogroup" aria-label="Umzugsart wählen">
              {MOVE_TYPES.map((type) => (
                <GameOption
                  key={type.id}
                  id={type.id}
                  label={type.label}
                  description={type.description}
                  points={type.points}
                  badge={type.badge}
                  selected={selectedType === type.id}
                  onSelect={() => setSelectedType(type.id)}
                />
              ))}
            </div>
          </Card>

          {/* Achievement hint */}
          <Card className="mt-4 p-4 bg-amber-500/10 border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="min-w-[48px] min-h-[48px] flex items-center justify-center">
                <Gift className="h-8 w-8 text-amber-500" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium text-amber-700 dark:text-amber-400">
                  Noch {STEPS.length - currentStep} {STEPS.length - currentStep === 1 ? 'Schritt' : 'Schritte'} bis zum Champion-Status!
                </p>
                <p className="text-sm text-amber-600/80 dark:text-amber-500/80">
                  Schalte 10% Rabatt auf deine erste Offerte frei
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Sticky footer with proper safe area and button hierarchy */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))] z-40">
        <div className="max-w-2xl mx-auto flex gap-3">
          {/* Secondary action - ghost style */}
          {currentStep > 1 && (
            <Button
              variant="ghost"
              size="lg"
              onClick={handleBack}
              className="min-h-[48px] min-w-[100px]"
              aria-label="Zurück zum vorherigen Schritt"
            >
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Zurück
            </Button>
          )}
          
          {/* Primary action - prominent style */}
          <Button
            size="lg"
            className={cn(
              "flex-1 min-h-[48px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg",
              currentStep === 1 && "w-full"
            )}
            onClick={handleNext}
            disabled={!selectedType}
          >
            <span className="flex items-center gap-2">
              {currentStep >= STEPS.length ? (
                <>
                  <Trophy className="h-5 w-5" aria-hidden="true" />
                  Offerten erhalten
                </>
              ) : (
                <>
                  {getNextButtonText()}
                  <span className="text-yellow-300 font-normal ml-1">
                    +{currentStepData?.points || 100} ⭐
                  </span>
                  <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
                </>
              )}
            </span>
          </Button>
        </div>
      </footer>
    </div>
  );
};

interface GameOptionProps {
  id: string;
  label: string;
  description: string;
  points: number;
  selected: boolean;
  badge?: string;
  onSelect: () => void;
}

const GameOption: React.FC<GameOptionProps> = ({ 
  id, 
  label, 
  description, 
  points, 
  selected, 
  badge,
  onSelect 
}) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onSelect}
    className={cn(
      "w-full p-4 rounded-xl border-2 text-left transition-all min-h-[72px]",
      "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
      selected
        ? "border-purple-500 bg-purple-500/10 shadow-md"
        : "border-border hover:border-purple-500/50 hover:bg-muted/50"
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {/* Custom radio indicator */}
        <div 
          className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors",
            selected 
              ? "border-purple-500 bg-purple-500" 
              : "border-muted-foreground"
          )}
        >
          {selected && <Check className="h-3 w-3 text-white" aria-hidden="true" />}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground">{label}</span>
            {badge && (
              <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full font-medium">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <span className="text-sm text-purple-500 dark:text-purple-400 font-medium whitespace-nowrap flex-shrink-0">
        +{points} ⭐
      </span>
    </div>
  </button>
);

export default V4dGamified;
