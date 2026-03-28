import { cn } from "@/lib/utils";

interface FlowProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  flowName?: string;
  className?: string;
}

export function FlowProgressIndicator({
  currentStep,
  totalSteps,
  flowName,
  className,
}: FlowProgressIndicatorProps) {
  const progress = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <div className={cn("w-full max-w-md", className)}>
      {flowName && (
        <p className="text-sm text-muted-foreground mb-2 text-center">
          {flowName}
        </p>
      )}
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          Schritt {currentStep} von {totalSteps}
        </span>
        <span className="text-sm text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Step dots */}
      <div className="flex justify-between mt-3">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          
          return (
            <div
              key={stepNum}
              className={cn(
                "w-3 h-3 rounded-full transition-colors duration-200",
                isCompleted && "bg-primary",
                isCurrent && "bg-primary ring-2 ring-primary/30",
                !isCompleted && !isCurrent && "bg-muted-foreground/30"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
