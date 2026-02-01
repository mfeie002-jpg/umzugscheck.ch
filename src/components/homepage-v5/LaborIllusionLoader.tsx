/**
 * Labor Illusion Loader V5 - Shows verification steps
 * Addresses: "'Labor Illusion' während der Suche"
 */
import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Building2, Shield, FileCheck, MapPin, Users } from 'lucide-react';

interface LaborStep {
  id: string;
  label: string;
  icon: React.ElementType;
  duration: number;
}

const LABOR_STEPS: LaborStep[] = [
  { id: 'registry', label: 'Prüfe Handelsregister...', icon: Building2, duration: 800 },
  { id: 'insurance', label: 'Verifiziere Versicherungsstatus...', icon: Shield, duration: 600 },
  { id: 'astag', label: 'Checke ASTAG-Datenbank...', icon: FileCheck, duration: 700 },
  { id: 'availability', label: 'Analysiere Verfügbarkeit...', icon: MapPin, duration: 500 },
  { id: 'matching', label: 'Finde beste Matches...', icon: Users, duration: 400 },
];

interface LaborIllusionLoaderProps {
  isActive: boolean;
  onComplete?: () => void;
  location?: string;
}

export const LaborIllusionLoader = memo(function LaborIllusionLoader({
  isActive,
  onComplete,
  location = 'Ihrer Region',
}: LaborIllusionLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  useEffect(() => {
    if (!isActive) {
      setCurrentStep(0);
      setCompletedSteps([]);
      return;
    }

    let stepIndex = 0;
    const runSteps = () => {
      if (stepIndex >= LABOR_STEPS.length) {
        onComplete?.();
        return;
      }

      setCurrentStep(stepIndex);
      
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, LABOR_STEPS[stepIndex].id]);
        stepIndex++;
        runSteps();
      }, LABOR_STEPS[stepIndex].duration);
    };

    runSteps();
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl shadow-2xl border p-8 max-w-md w-full mx-4"
      >
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Wir prüfen für Sie...</h3>
          <p className="text-muted-foreground text-sm">
            Qualitätskontrolle in {location}
          </p>
        </div>

        <div className="space-y-3">
          {LABOR_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === index && !isCompleted;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0.5, x: -10 }}
                animate={{ 
                  opacity: isCompleted || isCurrent ? 1 : 0.5,
                  x: 0,
                }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isCompleted 
                    ? 'bg-green-50 dark:bg-green-950' 
                    : isCurrent 
                      ? 'bg-primary/5' 
                      : 'bg-muted/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'bg-muted'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  isCompleted ? 'text-green-700 dark:text-green-300' : ''
                }`}>
                  {step.label.replace('...', location ? ` in ${location}...` : '...')}
                </span>
                {isCompleted && (
                  <span className="ml-auto text-xs text-green-600 font-medium">✓</span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: '0%' }}
              animate={{ width: `${(completedSteps.length / LABOR_STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
});
