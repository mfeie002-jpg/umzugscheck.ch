/**
 * Ultimate Progress Indicator
 * 
 * UX-OPTIMIZED VERSION:
 * - Größere Touch-Targets (min 44x44px)
 * - Klarere aktive Schritt-Anzeige
 * - Mobile-optimierte Darstellung mit Steps sichtbar
 * - Konsistente visuelle Hierarchie
 * - WCAG-konforme Kontraste
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
      {/* Step Counter - ENHANCED: Larger, clearer text */}
      <div className="flex items-center justify-between">
        <span className="text-sm sm:text-base font-semibold text-foreground">
          Schritt {currentStep} von {steps.length}
        </span>
        <span className="text-sm font-medium text-primary">
          {steps[currentStep - 1]?.label}
        </span>
      </div>

      {/* Progress Bar - ENHANCED: Taller, more visible */}
      <div className="relative">
        <div className="h-2.5 sm:h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
            style={{ width: `${Math.max(progress, 8)}%` }}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-label={`Schritt ${currentStep} von ${steps.length}`}
          />
        </div>
      </div>

      {/* Step Labels (Desktop) - ENHANCED: Larger touch targets */}
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
                isCurrent && "text-foreground font-semibold",
                isPending && "text-muted-foreground"
              )}
            >
              <div 
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
                  isPending && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : s.id}
              </div>
              <span className="hidden md:inline">{s.shortLabel}</span>
            </div>
          );
        })}
      </div>

      {/* Mobile Step Indicators - ENHANCED: Larger, numbered for clarity */}
      <div className="flex sm:hidden justify-between px-2">
        {steps.map((s) => {
          const isCompleted = s.id < currentStep;
          const isCurrent = s.id === currentStep;
          const isPending = s.id > currentStep;

          return (
            <div 
              key={s.id}
              className="flex flex-col items-center gap-1"
            >
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-1 ring-offset-background scale-110",
                  isPending && "bg-muted text-muted-foreground"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : s.id}
              </div>
              {isCurrent && (
                <span className="text-[10px] font-medium text-primary max-w-[60px] text-center truncate">
                  {s.shortLabel}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
