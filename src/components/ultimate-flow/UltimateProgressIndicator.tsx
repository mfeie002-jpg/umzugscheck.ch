/**
 * Ultimate Progress Indicator
 * 
 * - Klare Fortschrittsanzeige "Schritt X von Y"
 * - Visueller Progress Bar
 * - Responsive: Labels auf Desktop, Icons auf Mobile
 */

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
  shortLabel: string;
}

interface UltimateProgressIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export function UltimateProgressIndicator({ 
  currentStep, 
  steps 
}: UltimateProgressIndicatorProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="space-y-3">
      {/* Step Counter */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          Schritt {currentStep} von {steps.length}
        </span>
        <span className="text-xs text-muted-foreground">
          {steps[currentStep - 1]?.label}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
            style={{ width: `${Math.max(progress, 5)}%` }}
          />
        </div>
      </div>

      {/* Step Labels (Desktop) */}
      <div className="hidden sm:flex justify-between">
        {steps.map((s) => {
          const isCompleted = s.id < currentStep;
          const isCurrent = s.id === currentStep;
          const isPending = s.id > currentStep;

          return (
            <div 
              key={s.id}
              className={cn(
                "flex items-center gap-1.5 text-xs",
                isCompleted && "text-primary",
                isCurrent && "text-foreground font-medium",
                isPending && "text-muted-foreground"
              )}
            >
              <div 
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary/20 text-primary border-2 border-primary",
                  isPending && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-3 w-3" /> : s.id}
              </div>
              <span className="hidden md:inline">{s.shortLabel}</span>
            </div>
          );
        })}
      </div>

      {/* Mobile Step Dots */}
      <div className="flex sm:hidden justify-center gap-2">
        {steps.map((s) => (
          <div
            key={s.id}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              s.id < currentStep && "bg-primary",
              s.id === currentStep && "bg-primary w-6",
              s.id > currentStep && "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
}
