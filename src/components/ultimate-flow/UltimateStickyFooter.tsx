/**
 * Ultimate Sticky Footer - SCORE OPTIMIZED
 * 
 * - Fixiert am unteren Rand (Mobile)
 * - Safe Area Support
 * - Trust badges near CTA
 * - Enhanced visibility + animations
 * - Primärer CTA immer erreichbar
 */

import { ArrowLeft, ArrowRight, Loader2, Send, Shield, Award, Star } from "lucide-react";
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
    if (isSubmitting) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (isLastStep) return <Send className="h-4 w-4" />;
    return <ArrowRight className="h-4 w-4" />;
  };

  return (
    <motion.div 
      className="fixed inset-x-0 bottom-0 z-50 bg-background/95 backdrop-blur-md border-t shadow-2xl"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Gradient fade for smoother transition */}
      <div 
        className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" 
        aria-hidden="true" 
      />
      
      <div className="container mx-auto max-w-2xl px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        {/* SCORE OPTIMIZATION: Trust badges directly above CTA */}
        <div className="flex items-center justify-center gap-3 mb-2.5 text-[10px]">
          <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <Award className="w-3 h-3" />
            ASTAG
          </span>
          <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <Shield className="w-3 h-3" />
            Kostenlos
          </span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <Star className="w-3 h-3 fill-current" />
            4.9/5
          </span>
        </div>
        
        {/* Hint when disabled */}
        {!canProceed && hint && (
          <div className="mb-2 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {hint}
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
              className="h-12 flex-1 gap-2 rounded-xl font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Zurück</span>
            </Button>
          )}

          <Button
            type="button"
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            className={cn(
              "h-12 gap-2 font-semibold transition-all rounded-xl shadow-lg",
              step > 1 ? "flex-[1.5]" : "w-full",
              isLastStep && "bg-green-600 hover:bg-green-700",
              !canProceed && "opacity-70"
            )}
          >
            {getCtaLabel()}
            {getCtaIcon()}
          </Button>
        </div>

        {/* Trust Footer - Schweizer Qualität */}
        <div className="mt-2 flex justify-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="w-2.5 h-2.5 text-green-600" />
            Schweizer Qualität
          </span>
          <span>✓ Unverbindlich</span>
          <span>✓ ~2 Min</span>
        </div>
      </div>
    </motion.div>
  );
}