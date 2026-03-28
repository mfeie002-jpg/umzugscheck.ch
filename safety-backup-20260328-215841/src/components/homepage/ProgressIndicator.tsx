import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export const ProgressIndicator = ({ currentStep, totalSteps, labels }: ProgressIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        
        return (
          <div key={index} className="flex items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: isCurrent ? 1.1 : 1 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                isCompleted
                  ? "bg-primary text-primary-foreground"
                  : isCurrent
                  ? "bg-primary/20 text-primary border-2 border-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
            </motion.div>
            {labels && labels[index] && (
              <span className={`ml-2 text-sm hidden md:inline ${isCurrent ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {labels[index]}
              </span>
            )}
            {index < totalSteps - 1 && (
              <div className={`w-8 h-0.5 mx-2 ${isCompleted ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};
