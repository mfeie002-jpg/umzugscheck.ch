/**
 * V1 Sticky Mobile CTA - Score Optimization
 * 
 * Always visible sticky CTA on mobile devices:
 * - Constant visibility for primary action
 * - Trust signals integrated
 * - Safe area support for iOS
 */

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface V1StickyMobileCTAProps {
  /** Current step number */
  currentStep: number;
  /** Total steps */
  totalSteps: number;
  /** Can proceed to next step */
  canProceed: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Click handler for primary action */
  onPrimaryClick: () => void;
  /** Click handler for back action */
  onBackClick?: () => void;
  /** Custom primary label */
  primaryLabel?: string;
}

export const V1StickyMobileCTA = memo(function V1StickyMobileCTA({
  currentStep,
  totalSteps,
  canProceed,
  isLoading = false,
  onPrimaryClick,
  onBackClick,
  primaryLabel
}: V1StickyMobileCTAProps) {
  const isLastStep = currentStep === totalSteps;
  const label = primaryLabel || (isLastStep ? "Offerten erhalten" : "Weiter");
  
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="md:hidden fixed inset-x-0 bottom-0 z-50"
    >
      {/* Gradient fade for smooth transition */}
      <div 
        className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" 
        aria-hidden="true" 
      />
      
      <div className="bg-background/95 backdrop-blur-md border-t border-border shadow-2xl">
        <div className="px-4 pt-3 pb-[max(env(safe-area-inset-bottom),12px)]">
          {/* Trust signal row */}
          <div className="flex items-center justify-center gap-3 mb-2.5 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-green-600" />
              100% kostenlos
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-primary" />
              Unverbindlich
            </span>
          </div>
          
          {/* Button row */}
          <div className="flex gap-3">
            {/* Back button - only show after step 1 */}
            {currentStep > 1 && onBackClick && (
              <Button
                type="button"
                variant="outline"
                onClick={onBackClick}
                disabled={isLoading}
                className="h-12 px-4 rounded-xl font-medium"
              >
                Zurück
              </Button>
            )}
            
            {/* Primary CTA */}
            <Button
              type="button"
              onClick={onPrimaryClick}
              disabled={!canProceed || isLoading}
              className="flex-1 h-12 rounded-xl font-bold text-base shadow-lg disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird verarbeitet...
                </>
              ) : (
                <>
                  {label}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
          
          {/* Hint for disabled state */}
          {!canProceed && !isLoading && (
            <p className="text-center text-[10px] text-muted-foreground mt-2">
              Bitte füllen Sie alle Pflichtfelder aus
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
});
