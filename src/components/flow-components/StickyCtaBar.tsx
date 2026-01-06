/**
 * StickyCtaBar Component - UX Compliance Checklist:
 * ✅ Mobile-first with safe area support
 * ✅ 48x48dp minimum touch targets (large CTA button)
 * ✅ Microcopy "Kostenlos & unverbindlich"
 * ✅ Optional progress indicator
 * ✅ Semantic design tokens
 * ✅ Loading state with spinner
 */

import React, { memo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrustBarMini } from './TrustBar';

export interface StickyCtaBarProps {
  /** Primary CTA text */
  ctaText: string;
  /** Handler for primary CTA click */
  onCtaClick: () => void;
  /** Is CTA disabled? */
  disabled?: boolean;
  /** Is loading/submitting? */
  isLoading?: boolean;
  /** Microcopy below CTA */
  microcopy?: string;
  /** Show back button? */
  showBack?: boolean;
  /** Back button handler */
  onBack?: () => void;
  /** Current step (optional) */
  currentStep?: number;
  /** Total steps (optional) */
  totalSteps?: number;
  /** Show trust bar mini */
  showTrust?: boolean;
  /** Custom className */
  className?: string;
  /** Icon to show on CTA */
  ctaIcon?: ReactNode;
  /** Secondary variant (less prominent) */
  variant?: 'primary' | 'secondary';
}

export const StickyCtaBar = memo(function StickyCtaBar({
  ctaText,
  onCtaClick,
  disabled = false,
  isLoading = false,
  microcopy = 'Kostenlos & unverbindlich',
  showBack = false,
  onBack,
  currentStep,
  totalSteps,
  showTrust = true,
  className,
  ctaIcon,
  variant = 'primary',
}: StickyCtaBarProps) {
  const hasProgress = currentStep !== undefined && totalSteps !== undefined;
  const progressValue = hasProgress ? (currentStep / totalSteps) * 100 : 0;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background/95 backdrop-blur-lg border-t border-border",
        "pb-safe",
        className
      )}
    >
      {/* Gradient fade overlay */}
      <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
      
      <div className="container max-w-2xl mx-auto px-4 py-3 sm:py-4">
        {/* Progress bar (optional) */}
        {hasProgress && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Schritt {currentStep} von {totalSteps}</span>
              <span>{Math.round(progressValue)}% erledigt</span>
            </div>
            <Progress value={progressValue} className="h-1.5" />
          </div>
        )}

        {/* CTA Row */}
        <div className="flex items-center gap-3">
          {showBack && onBack && (
            <Button
              variant="outline"
              size="lg"
              onClick={onBack}
              className="h-12 sm:h-14 px-4 shrink-0"
              disabled={isLoading}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Zurück</span>
            </Button>
          )}

          <Button
            size="lg"
            onClick={onCtaClick}
            disabled={disabled || isLoading}
            className={cn(
              "flex-1 h-12 sm:h-14 text-base sm:text-lg font-semibold gap-2",
              "min-h-[48px]", // WCAG touch target
              variant === 'primary' && "bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta",
              variant === 'secondary' && "bg-primary hover:bg-primary/90"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Wird gesendet...
              </>
            ) : (
              <>
                {ctaText}
                {ctaIcon || <ChevronRight className="h-5 w-5" />}
              </>
            )}
          </Button>
        </div>

        {/* Microcopy + Trust */}
        <div className="mt-2 space-y-1.5">
          {microcopy && (
            <p className="text-center text-xs sm:text-sm text-muted-foreground">
              {microcopy}
            </p>
          )}
          {showTrust && <TrustBarMini className="mt-2" />}
        </div>
      </div>
    </motion.div>
  );
});

export default StickyCtaBar;
