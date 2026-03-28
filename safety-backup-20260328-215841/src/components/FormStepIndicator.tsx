import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface FormStepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function FormStepIndicator({ steps, currentStep, onStepClick }: FormStepIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-lg mx-auto mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && index <= currentStep;

        return (
          <div key={index} className="flex items-center flex-1">
            {/* Step Circle */}
            <motion.button
              onClick={() => isClickable && onStepClick?.(index)}
              disabled={!isClickable}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                isCompleted
                  ? 'bg-alpine border-alpine text-alpine-foreground'
                  : isCurrent
                  ? 'border-alpine text-alpine bg-alpine/10'
                  : 'border-muted-foreground/30 text-muted-foreground'
              } ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
              whileHover={isClickable ? { scale: 1.1 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Check className="h-5 w-5" />
                </motion.div>
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}

              {/* Step Label */}
              <span 
                className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap ${
                  isCurrent || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step}
              </span>
            </motion.button>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-muted-foreground/30 relative">
                <motion.div
                  className="absolute inset-0 bg-alpine origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
