/**
 * Ultimate Sticky Footer
 * 
 * - Fixiert am unteren Rand (Mobile)
 * - Safe Area Support
 * - Micro-Feedback wenn disabled
 * - Primärer CTA immer erreichbar
 */

import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <div className="fixed inset-x-0 bottom-0 z-50 bg-background/95 backdrop-blur-sm border-t">
      <div className="container mx-auto max-w-2xl px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        {/* Hint when disabled */}
        {!canProceed && hint && (
          <div className="mb-2 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
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
              className="h-12 flex-1 gap-2"
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
              "h-12 gap-2 font-semibold transition-all",
              step > 1 ? "flex-[1.5]" : "w-full",
              isLastStep && "bg-green-600 hover:bg-green-700"
            )}
          >
            {getCtaLabel()}
            {getCtaIcon()}
          </Button>
        </div>

        {/* Trust Footer */}
        <div className="mt-2 flex justify-center gap-4 text-[10px] text-muted-foreground">
          <span>✓ Kostenlos</span>
          <span>✓ Unverbindlich</span>
          <span>✓ Schweizer Firmen</span>
        </div>
      </div>
    </div>
  );
}
