/**
 * Calculator UX Improvements
 * Better visual feedback, progress, and micro-interactions
 */
import { memo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { trackFormStepComplete } from "@/lib/conversion-events";

interface CalculatorStepProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onNext: () => void;
  onBack: () => void;
  canProgress: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  children: React.ReactNode;
}

export const CalculatorStep = memo(function CalculatorStep({
  currentStep,
  totalSteps,
  stepLabels,
  onNext,
  onBack,
  canProgress,
  isLastStep = false,
  isSubmitting = false,
  children
}: CalculatorStepProps) {
  const progress = ((currentStep) / totalSteps) * 100;
  
  const handleNext = useCallback(() => {
    if (canProgress) {
      trackFormStepComplete('calculator', currentStep, stepLabels[currentStep - 1] || `Step ${currentStep}`, window.location.pathname);
      onNext();
    }
  }, [canProgress, currentStep, stepLabels, onNext]);
  
  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Schritt {currentStep} von {totalSteps}
          </span>
          <span className="font-medium text-primary">
            {stepLabels[currentStep - 1]}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative">
          <Progress value={progress} className="h-2" />
          
          {/* Step indicators */}
          <div className="absolute inset-0 flex justify-between items-center px-1">
            {stepLabels.map((_, index) => {
              const stepNum = index + 1;
              const isComplete = currentStep > stepNum;
              const isCurrent = currentStep === stepNum;
              
              return (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.2 : 1,
                    backgroundColor: isComplete || isCurrent ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
                  }}
                  className={cn(
                    "w-3 h-3 rounded-full border-2 border-background shadow-sm",
                    "flex items-center justify-center"
                  )}
                >
                  {isComplete && (
                    <CheckCircle className="w-2 h-2 text-primary-foreground" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        {currentStep > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-12 px-4 touch-manipulation"
            disabled={isSubmitting}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Zurück
          </Button>
        )}
        
        <Button
          type="button"
          onClick={handleNext}
          disabled={!canProgress || isSubmitting}
          className={cn(
            "flex-1 h-12 font-semibold touch-manipulation transition-all",
            isLastStep && "bg-secondary hover:bg-secondary/90"
          )}
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"
              />
              Wird verarbeitet...
            </>
          ) : isLastStep ? (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Offerten erhalten
            </>
          ) : (
            <>
              Weiter
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
});

// Price estimate display with animation
interface PriceEstimateDisplayProps {
  minPrice: number;
  maxPrice: number;
  isCalculating?: boolean;
  className?: string;
}

export const PriceEstimateDisplay = memo(function PriceEstimateDisplay({
  minPrice,
  maxPrice,
  isCalculating = false,
  className
}: PriceEstimateDisplayProps) {
  const [displayMin, setDisplayMin] = useState(minPrice);
  const [displayMax, setDisplayMax] = useState(maxPrice);
  
  // Animate price changes
  useEffect(() => {
    const duration = 500;
    const startMin = displayMin;
    const startMax = displayMax;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      
      setDisplayMin(Math.round(startMin + (minPrice - startMin) * eased));
      setDisplayMax(Math.round(startMax + (maxPrice - startMax) * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [minPrice, maxPrice]);
  
  return (
    <motion.div
      layout
      className={cn(
        "bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 sm:p-5 text-center border border-primary/20",
        isCalculating && "animate-pulse",
        className
      )}
    >
      <p className="text-xs sm:text-sm text-muted-foreground mb-1">
        Geschätzte Kosten
      </p>
      <p className="text-2xl sm:text-3xl font-bold text-foreground">
        CHF {displayMin.toLocaleString('de-CH')} – {displayMax.toLocaleString('de-CH')}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Basierend auf Ihren Angaben
      </p>
    </motion.div>
  );
});

// Service selection with visual feedback
interface ServiceSelectionProps {
  services: Array<{
    id: string;
    label: string;
    description: string;
    price: string;
    icon: React.ReactNode;
    popular?: boolean;
    recommended?: boolean;
  }>;
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export const ServiceSelection = memo(function ServiceSelection({
  services,
  selected,
  onChange,
  className
}: ServiceSelectionProps) {
  const toggleService = useCallback((id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter(s => s !== id)
      : [...selected, id];
    onChange(newSelected);
  }, [selected, onChange]);
  
  return (
    <div className={cn("space-y-2", className)}>
      {services.map((service) => {
        const isSelected = selected.includes(service.id);
        
        return (
          <motion.button
            key={service.id}
            type="button"
            onClick={() => toggleService(service.id)}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left touch-manipulation",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30 hover:bg-muted/50"
            )}
          >
            {/* Checkbox */}
            <div className={cn(
              "w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors",
              isSelected ? "bg-primary" : "bg-muted border border-border"
            )}>
              {isSelected && <CheckCircle className="w-3.5 h-3.5 text-primary-foreground" />}
            </div>
            
            {/* Icon */}
            <div className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
              isSelected ? "bg-primary/20" : "bg-muted"
            )}>
              {service.icon}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{service.label}</span>
                {service.recommended && (
                  <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-medium">
                    Empfohlen
                  </span>
                )}
                {service.popular && !service.recommended && (
                  <span className="text-[10px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded-full font-medium">
                    Beliebt
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{service.description}</p>
            </div>
            
            {/* Price */}
            <span className="text-xs font-medium text-primary flex-shrink-0">
              {service.price}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
});

export default CalculatorStep;
