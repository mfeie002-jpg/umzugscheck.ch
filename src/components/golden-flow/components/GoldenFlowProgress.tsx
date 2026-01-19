/**
 * GoldenFlowProgress - Progress indicator with psychological optimization
 * 
 * Phase 2.3: Progress Psychology
 * - Starts at 20% (Endowed Progress Effect)
 * - Micro-animations on step completion
 * - "Steps remaining" countdown text
 */

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoldenFlowStep } from '../types';

interface GoldenFlowProgressProps {
  currentStep: GoldenFlowStep;
  className?: string;
}

const STEP_LABELS = ['Adressen', 'Details', 'Services', 'Kontakt'];

export function GoldenFlowProgress({ currentStep, className }: GoldenFlowProgressProps) {
  const stepNumber = typeof currentStep === 'number' ? currentStep : 4;
  const totalSteps = 4;
  const stepsRemaining = totalSteps - stepNumber + 1;
  
  // Start at 20% (Endowed Progress Effect)
  const progressPercent = 20 + ((stepNumber - 1) / totalSteps) * 80;
  
  return (
    <div className={cn("mb-6", className)}>
      {/* Progress bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-3">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: '20%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between items-center">
        {STEP_LABELS.map((label, index) => {
          const stepIdx = index + 1;
          const isActive = stepNumber === stepIdx;
          const isCompleted = stepNumber > stepIdx;
          
          return (
            <div key={label} className="flex flex-col items-center">
              <motion.div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  isCompleted && "bg-primary text-primary-foreground",
                  isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isActive && !isCompleted && "bg-muted text-muted-foreground"
                )}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  stepIdx
                )}
              </motion.div>
              <span className={cn(
                "text-xs mt-1 hidden sm:block",
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              )}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Mobile step label + Steps remaining countdown */}
      <div className="flex items-center justify-between mt-2 sm:mt-3">
        <div className="text-center sm:text-left flex-1">
          <span className="text-sm font-medium text-primary sm:hidden">
            {STEP_LABELS[stepNumber - 1]}
          </span>
          <span className="text-xs text-muted-foreground sm:hidden ml-2">
            Schritt {stepNumber} von {totalSteps}
          </span>
        </div>
        
        {/* Steps remaining countdown */}
        <motion.span
          key={stepsRemaining}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs"
        >
          {stepsRemaining === 1 ? (
            <span className="text-secondary font-semibold">✨ Letzter Schritt!</span>
          ) : (
            <span className="text-muted-foreground">
              Noch {stepsRemaining} Schritte
            </span>
          )}
        </motion.span>
      </div>
    </div>
  );
}
