/**
 * Ultimate Sticky Footer - UX-OPTIMIZED
 * 
 * CRITICAL UX FIXES:
 * - IMMER sichtbar am unteren Rand (kein Scrollen nötig)
 * - Safe Area Support für alle iOS-Geräte
 * - Größere Touch-Targets (min 48x48px)
 * - Trust badges direkt beim CTA
 * - Keine Überlappung mit anderen UI-Elementen
 * - Konsistenter Button-Stil
 */

import { ArrowLeft, ArrowRight, Loader2, Send, Shield, Award, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface UltimateStickyFooterProps {
  step: number;
  totalSteps: number;
  canProceed: boolean;
  hint: string | null;
  onBack: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
  isLastStep?: boolean;
}

export function UltimateStickyFooter({
  step,
  totalSteps,
  canProceed,
  hint,
  onBack,
  onNext,
  isSubmitting = false,
  isLastStep = false,
}: UltimateStickyFooterProps) {
  const getCtaLabel = () => {
    if (isSubmitting) return "Wird gesendet...";
    if (isLastStep) return "Offerten erhalten";
    return "Weiter";
  };

  const getCtaIcon = () => {
    if (isSubmitting) return <Loader2 className="h-5 w-5 animate-spin" />;
    if (isLastStep) return <Send className="h-5 w-5" />;
    return <ArrowRight className="h-5 w-5" />;
  };

  return (
    <motion.div 
      className="fixed inset-x-0 bottom-0 z-50 bg-background border-t-2 border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      role="navigation"
      aria-label="Formular-Navigation"
    >
      {/* Gradient fade for smoother visual transition */}
      <div 
        className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" 
        aria-hidden="true" 
      />
      
      {/* CRITICAL: Generous padding, especially for mobile safe areas */}
      <div className="container mx-auto max-w-2xl px-4 pt-3 pb-[max(16px,calc(env(safe-area-inset-bottom)+8px))]">
        {/* Trust badges above CTA - MOBILE OPTIMIZED */}
        <div className="flex items-center justify-center gap-4 sm:gap-3 mb-2.5 text-xs">
          <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium">
            <Award className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">ASTAG</span>
          </span>
          <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
            <CheckCircle className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            100% kostenlos
          </span>
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
            <Star className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-current" />
            4.9/5
          </span>
        </div>
        
        {/* Hint when can't proceed - ENHANCED visibility */}
        {!canProceed && hint && (
          <div className="mb-3 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
              {hint}
            </span>
          </div>
        )}

        {/* CRITICAL: Large, prominent buttons with proper touch targets */}
        <div className="flex gap-3">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
              className="h-14 flex-1 gap-2 rounded-xl font-semibold text-base border-2 min-w-[100px]"
              aria-label="Zurück zum vorherigen Schritt"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Zurück</span>
            </Button>
          )}

          <Button
            type="button"
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            className={cn(
              "h-14 gap-3 font-bold transition-all rounded-xl shadow-lg text-base",
              step > 1 ? "flex-[1.5]" : "w-full",
              isLastStep 
                ? "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700" 
                : "bg-primary hover:bg-primary/90",
              !canProceed && "opacity-60 cursor-not-allowed"
            )}
            aria-label={isLastStep ? "Offerten jetzt anfordern" : "Weiter zum nächsten Schritt"}
          >
            <span className="text-lg">{getCtaLabel()}</span>
            {getCtaIcon()}
          </Button>
        </div>

        {/* Trust Footer - compact but readable */}
        <div className="mt-3 flex justify-center items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-green-600" />
            Schweizer Qualität
          </span>
          <span className="text-muted-foreground/60">•</span>
          <span>Unverbindlich</span>
          <span className="text-muted-foreground/60">•</span>
          <span>~2 Min</span>
        </div>
      </div>
    </motion.div>
  );
}