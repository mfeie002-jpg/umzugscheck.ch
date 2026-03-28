import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Home, 
  Package, 
  Truck, 
  Key,
  PartyPopper
} from 'lucide-react';

const steps = [
  { id: 'quote', title: 'Offerte anfragen', icon: Home, description: 'Kostenvoranschlag erhalten' },
  { id: 'booking', title: 'Termin buchen', icon: Package, description: 'Umzugsdatum festlegen' },
  { id: 'packing', title: 'Einpacken', icon: Package, description: 'Alles verpackt und bereit' },
  { id: 'moving', title: 'Umzugstag', icon: Truck, description: 'Der grosse Tag!' },
  { id: 'done', title: 'Fertig!', icon: Key, description: 'Willkommen zuhause' },
];

interface OnboardingProgressProps {
  currentStep?: number;
  onStepClick?: (step: number) => void;
}

const OnboardingProgress = ({ currentStep = 0, onStepClick }: OnboardingProgressProps) => {
  const [step, setStep] = useState(currentStep);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('onboarding-step');
    if (saved) setStep(parseInt(saved));
  }, []);

  const progress = (step / (steps.length - 1)) * 100;

  const advanceStep = () => {
    const nextStep = Math.min(step + 1, steps.length - 1);
    setStep(nextStep);
    localStorage.setItem('onboarding-step', nextStep.toString());
    
    if (nextStep === steps.length - 1) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          Ihr Umzugsfortschritt
          <span className="text-sm font-normal text-muted-foreground">
            {Math.round(progress)}% abgeschlossen
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="h-2" />

        {/* Steps */}
        <div className="relative">
          {/* Connector Line */}
          <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-border" />
          
          <div className="space-y-4">
            {steps.map((s, index) => {
              const isCompleted = index < step;
              const isCurrent = index === step;
              const Icon = s.icon;

              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center gap-4 p-3 rounded-lg transition-all cursor-pointer ${
                    isCurrent ? 'bg-primary/5 border border-primary/20' : 
                    isCompleted ? 'opacity-60' : 'opacity-40'
                  }`}
                  onClick={() => onStepClick?.(index)}
                >
                  {/* Step Indicator */}
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-primary text-primary-foreground' :
                    isCurrent ? 'bg-primary/20 text-primary border-2 border-primary' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${isCurrent ? 'text-primary' : ''}`}>
                      {s.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </div>

                  {/* Arrow for current */}
                  {isCurrent && (
                    <ArrowRight className="w-4 h-4 text-primary" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        {step < steps.length - 1 && (
          <Button className="w-full" onClick={advanceStep}>
            {steps[step + 1]?.title || 'Weiter'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}

        {/* Celebration */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  <PartyPopper className="w-24 h-24 text-primary mx-auto" />
                </motion.div>
                <h2 className="text-2xl font-bold mt-4">Herzlichen Glückwunsch!</h2>
                <p className="text-muted-foreground">Ihr Umzug ist abgeschlossen!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default OnboardingProgress;
