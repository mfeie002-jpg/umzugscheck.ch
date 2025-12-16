import { memo } from "react";
import { motion } from "framer-motion";
import { Check, MapPin, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: Step[] = [
  { id: 1, label: "Start & Ziel", shortLabel: "Ort", icon: MapPin },
  { id: 2, label: "Details", shortLabel: "Details", icon: Home },
  { id: 3, label: "Kontakt", shortLabel: "Kontakt", icon: User },
];

interface EnhancedProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  className?: string;
  showLabels?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

/**
 * Enhanced progress indicator with step labels and animations
 * Shows users exactly where they are in the form process
 */
export const EnhancedProgressIndicator = memo(function EnhancedProgressIndicator({
  currentStep,
  totalSteps = 3,
  className = '',
  showLabels = true,
  variant = 'default',
}: EnhancedProgressIndicatorProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  if (variant === 'compact') {
    return (
      <div className={cn("space-y-2", className)}>
        {/* Simple progress bar */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">Schritt {currentStep} von {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% abgeschlossen</span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={cn("space-y-3", className)}>
        {/* Step indicator with icons */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: isCurrent ? 1.1 : 1 }}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                      isCompleted && "bg-primary border-primary text-primary-foreground",
                      isCurrent && "border-primary bg-primary/10 text-primary",
                      !isCompleted && !isCurrent && "border-border bg-card text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  {showLabels && (
                    <span
                      className={cn(
                        "text-xs mt-1.5 font-medium transition-colors",
                        isCurrent && "text-primary",
                        isCompleted && "text-primary",
                        !isCompleted && !isCurrent && "text-muted-foreground"
                      )}
                    >
                      {step.shortLabel}
                    </span>
                  )}
                </div>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 bg-border overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Current step description */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {steps[currentStep - 1]?.label}
          </p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("space-y-2", className)}>
      {/* Progress info */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground">
          Schritt {currentStep} von {totalSteps}
        </span>
        <span className="text-xs text-muted-foreground">
          {steps[currentStep - 1]?.label}
        </span>
      </div>
      
      {/* Progress bar segments */}
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-300",
              index < currentStep ? 'bg-primary' : 'bg-border'
            )}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          />
        ))}
      </div>
      
      {/* Step labels */}
      {showLabels && (
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
          {steps.map((step) => (
            <span
              key={step.id}
              className={cn(
                "transition-colors",
                currentStep >= step.id && 'text-primary font-medium'
              )}
            >
              {step.shortLabel}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

/**
 * Motivational message based on progress
 */
interface ProgressMessageProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressMessage = memo(function ProgressMessage({
  currentStep,
  totalSteps,
}: ProgressMessageProps) {
  const messages = [
    { step: 1, message: "Los geht's! Wo soll Ihr Umzug starten?" },
    { step: 2, message: "Super! Jetzt noch ein paar Details..." },
    { step: 3, message: "Fast geschafft! Nur noch Ihre Kontaktdaten." },
  ];

  const currentMessage = messages.find(m => m.step === currentStep)?.message || '';

  return (
    <motion.p
      key={currentStep}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="text-sm text-muted-foreground text-center"
    >
      {currentMessage}
    </motion.p>
  );
});
