/**
 * Enhanced Progress Indicator for Multi-Step Forms
 * 
 * Features:
 * - Clear step visualization with numbers and labels
 * - Animated transitions between steps
 * - Micro-feedback on completion
 * - Mobile-optimized compact view
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
  className?: string;
  variant?: "default" | "compact" | "numbered";
}

export const StepProgress = memo(function StepProgress({
  currentStep,
  totalSteps,
  steps,
  className,
  variant = "default"
}: StepProgressProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  if (variant === "compact") {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-foreground">
            Schritt {currentStep} von {totalSteps}
          </span>
          <span className="text-xs text-muted-foreground">
            {steps[currentStep - 1]}
          </span>
        </div>
        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>
    );
  }

  if (variant === "numbered") {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isUpcoming = stepNumber > currentStep;

            return (
              <div key={step} className="flex flex-col items-center flex-1">
                {/* Step circle */}
                <motion.div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    isUpcoming && "bg-muted text-muted-foreground"
                  )}
                  animate={{
                    scale: isCurrent ? 1.1 : 1
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    stepNumber
                  )}
                </motion.div>

                {/* Step label */}
                <span className={cn(
                  "text-[10px] sm:text-xs mt-1.5 text-center max-w-[80px] leading-tight",
                  isCurrent && "font-semibold text-foreground",
                  !isCurrent && "text-muted-foreground"
                )}>
                  {step}
                </span>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-4 left-1/2 w-full h-0.5 bg-muted -z-10">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: stepNumber < currentStep ? "100%" : "0%" 
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("w-full", className)}>
      {/* Progress text */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-foreground">
          Schritt {currentStep} von {totalSteps}
        </span>
        <span className="text-sm text-primary font-medium">
          {steps[currentStep - 1]}
        </span>
      </div>

      {/* Progress bar with step markers */}
      <div className="relative">
        {/* Background track */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-primary to-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Step dots */}
        <div className="absolute inset-x-0 top-0 flex justify-between" style={{ marginTop: "-3px" }}>
          {steps.map((_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber <= currentStep;
            
            return (
              <motion.div
                key={index}
                className={cn(
                  "w-3.5 h-3.5 rounded-full border-2",
                  isCompleted 
                    ? "bg-primary border-primary" 
                    : "bg-background border-muted"
                )}
                animate={{
                  scale: stepNumber === currentStep ? 1.2 : 1
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            );
          })}
        </div>
      </div>

      {/* Step labels below */}
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <span 
            key={step}
            className={cn(
              "text-[9px] sm:text-xs text-center max-w-[60px] sm:max-w-none leading-tight",
              index + 1 === currentStep && "font-semibold text-primary",
              index + 1 !== currentStep && "text-muted-foreground"
            )}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
});

export default StepProgress;
