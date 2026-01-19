/**
 * GoldenFlowLaborIllusion - Simulated "work" loading animation
 * 
 * Phase 2.2: Labor Illusion Loading
 * Shows progressive steps during artificial delay to build anticipation
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, MapPin, Users, Calculator, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LaborIllusionStep {
  id: string;
  icon: React.ElementType;
  text: string;
  duration: number; // ms
}

const LABOR_STEPS: LaborIllusionStep[] = [
  { id: 'region', icon: MapPin, text: 'Prüfe Verfügbarkeit in Ihrer Region...', duration: 800 },
  { id: 'filter', icon: Users, text: 'Filtere geprüfte Umzugsfirmen...', duration: 900 },
  { id: 'calculate', icon: Calculator, text: 'Berechne Bestpreis-Offerten...', duration: 1000 },
  { id: 'done', icon: Sparkles, text: 'Fertig! 3 passende Firmen gefunden', duration: 500 },
];

interface GoldenFlowLaborIllusionProps {
  isActive: boolean;
  onComplete: () => void;
  matchedCompanies?: number;
}

export function GoldenFlowLaborIllusion({ 
  isActive, 
  onComplete,
  matchedCompanies = 3 
}: GoldenFlowLaborIllusionProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  useEffect(() => {
    if (!isActive) {
      setCurrentStepIndex(0);
      setCompletedSteps([]);
      return;
    }
    
    let timeout: NodeJS.Timeout;
    
    const runStep = (index: number) => {
      if (index >= LABOR_STEPS.length) {
        // All steps done
        setTimeout(onComplete, 300);
        return;
      }
      
      setCurrentStepIndex(index);
      
      timeout = setTimeout(() => {
        setCompletedSteps(prev => [...prev, LABOR_STEPS[index].id]);
        runStep(index + 1);
      }, LABOR_STEPS[index].duration);
    };
    
    runStep(0);
    
    return () => clearTimeout(timeout);
  }, [isActive, onComplete]);
  
  if (!isActive) return null;
  
  const progress = ((completedSteps.length / LABOR_STEPS.length) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
    >
      <div className="w-full max-w-md mx-auto px-6">
        {/* Main card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card rounded-2xl border shadow-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
            >
              <Loader2 className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h3 className="text-xl font-bold text-foreground">
              Suche beste Angebote...
            </h3>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden mb-6">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Steps */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {LABOR_STEPS.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id);
                const isCurrent = index === currentStepIndex;
                const isPending = index > currentStepIndex;
                
                // Update text for final step with actual count
                const displayText = step.id === 'done' 
                  ? `Fertig! ${matchedCompanies} passende Firmen gefunden`
                  : step.text;
                
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all",
                      isCompleted && "bg-primary/5",
                      isCurrent && "bg-muted",
                      isPending && "opacity-40"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      isCompleted && "bg-primary text-primary-foreground",
                      isCurrent && "bg-muted-foreground/20",
                      isPending && "bg-muted"
                    )}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : isCurrent ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                          <Loader2 className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <step.icon className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <span className={cn(
                      "text-sm",
                      isCompleted && "text-foreground font-medium",
                      isCurrent && "text-foreground",
                      isPending && "text-muted-foreground"
                    )}>
                      {displayText}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
