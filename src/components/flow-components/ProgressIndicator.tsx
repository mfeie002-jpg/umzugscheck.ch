/**
 * ProgressIndicator Component - UX Compliance Checklist:
 * ✅ Clear step visualization
 * ✅ "Noch X Schritte" messaging (not panic-inducing)
 * ✅ Completed/current/upcoming states
 * ✅ Accessible with proper ARIA
 * ✅ Mobile-friendly sizing
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProgressIndicatorProps {
  /** Current step (1-indexed) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Optional labels for each step */
  labels?: string[];
  /** Variant: dots, numbers, or bar */
  variant?: 'dots' | 'numbers' | 'bar' | 'message';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
}

export const ProgressIndicator = memo(function ProgressIndicator({
  currentStep,
  totalSteps,
  labels,
  variant = 'numbers',
  size = 'md',
  className,
}: ProgressIndicatorProps) {
  const remaining = totalSteps - currentStep;
  
  // Message variant - less intimidating for long flows
  if (variant === 'message') {
    return (
      <div className={cn("text-center", className)}>
        <p className="text-sm text-muted-foreground">
          {remaining === 0 
            ? 'Letzter Schritt' 
            : remaining === 1 
              ? 'Noch 1 Frage'
              : `Noch ${remaining} Fragen`
          }
        </p>
      </div>
    );
  }

  // Bar variant
  if (variant === 'bar') {
    const progress = (currentStep / totalSteps) * 100;
    return (
      <div className={cn("space-y-1", className)}>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Schritt {currentStep}/{totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    );
  }

  const sizeClasses = {
    sm: { step: 'w-6 h-6 text-xs', connector: 'w-6 h-0.5', label: 'text-xs' },
    md: { step: 'w-8 h-8 text-sm', connector: 'w-8 h-0.5', label: 'text-sm' },
    lg: { step: 'w-10 h-10 text-base', connector: 'w-10 h-1', label: 'text-base' },
  };
  const sizes = sizeClasses[size];

  return (
    <div 
      className={cn("flex items-center justify-center", className)}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
    >
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isUpcoming = stepNumber > currentStep;

        return (
          <div key={index} className="flex items-center">
            {/* Step Circle/Dot */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: isCurrent ? 1.1 : 1 }}
              className={cn(
                "rounded-full flex items-center justify-center font-medium transition-colors",
                sizes.step,
                isCompleted && "bg-primary text-primary-foreground",
                isCurrent && "bg-primary/20 text-primary border-2 border-primary",
                isUpcoming && "bg-muted text-muted-foreground",
                variant === 'dots' && "w-3 h-3" // Override for dots
              )}
            >
              {variant === 'numbers' && (
                isCompleted ? <Check className="h-4 w-4" /> : stepNumber
              )}
            </motion.div>

            {/* Label (if provided) */}
            {labels?.[index] && variant === 'numbers' && (
              <span className={cn(
                "ml-2 hidden md:inline",
                sizes.label,
                isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {labels[index]}
              </span>
            )}

            {/* Connector */}
            {index < totalSteps - 1 && (
              <div className={cn(
                "mx-2 rounded-full",
                sizes.connector,
                isCompleted ? "bg-primary" : "bg-muted"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
});

export default ProgressIndicator;
