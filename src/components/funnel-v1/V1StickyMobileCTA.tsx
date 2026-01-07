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
import { ArrowRight, ArrowLeft, CheckCircle, Shield, Loader2 } from "lucide-react";
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
      className="fixed inset-x-0 bottom-0 z-[9999]"
    >
      {/* Gradient fade for smooth transition */}
      <div 
        className="absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-background to-transparent pointer-events-none" 
        aria-hidden="true" 
      />
      
      <div className="bg-background/98 backdrop-blur-md border-t-2 border-primary/20 shadow-[0_-8px_30px_rgba(0,0,0,0.15)]">
        {/* Issue #3: Safe area padding with minimum 20px for iOS home bar */}
        <div className="px-4 pt-3 pb-[max(env(safe-area-inset-bottom,20px),20px)]">
          {/* Trust signal row - more compact */}
          <div className="flex items-center justify-center gap-4 mb-3 text-[11px] text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-green-600" />
              100% kostenlos
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-primary" />
              Unverbindlich
            </span>
          </div>
          
          {/* Button row - Issue #8: Both buttons styled consistently, Zurück as outline, Weiter as primary */}
          <div className="flex gap-3">
            {/* Back button - only show after step 1, styled as clear secondary action */}
            {currentStep > 1 && onBackClick && (
              <Button
                type="button"
                variant="outline"
                onClick={onBackClick}
                disabled={isLoading}
                className="h-14 px-5 rounded-xl font-semibold text-base border-2 min-w-[90px] touch-manipulation active:scale-[0.97]"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Zurück
              </Button>
            )}
            
            {/* Primary CTA - Issue #8, #15: Clearly dominant with larger size, stronger styling and high contrast */}
            <Button
              type="button"
              onClick={onPrimaryClick}
              disabled={!canProceed || isLoading}
              className="flex-1 h-14 rounded-xl font-bold text-base shadow-lg disabled:opacity-60 touch-manipulation active:scale-[0.97] bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Wird verarbeitet...
                </>
              ) : (
                <>
                  {label}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
          
          {/* Hint for disabled state - Issue #46: Clear inline validation message */}
          {!canProceed && !isLoading && (
            <p className="text-center text-[11px] text-amber-600 dark:text-amber-400 mt-2.5 font-medium">
              Bitte alle Pflichtfelder ausfüllen
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
});
