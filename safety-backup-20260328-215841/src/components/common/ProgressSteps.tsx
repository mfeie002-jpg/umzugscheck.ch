import { memo } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  description?: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const ProgressSteps = memo(function ProgressSteps({ 
  steps, 
  currentStep,
  className 
}: ProgressStepsProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        
        return (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                  isCompleted && "bg-secondary text-secondary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
              </div>
              <span className={cn(
                "text-xs mt-2 font-medium text-center max-w-[80px]",
                (isCurrent || isCompleted) ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2",
                isCompleted ? "bg-secondary" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
});
