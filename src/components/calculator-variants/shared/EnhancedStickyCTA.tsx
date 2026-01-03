/**
 * EnhancedStickyCTA - Improved Sticky CTA with micro-feedback
 * 
 * Features:
 * - Fixed at bottom with safe area inset
 * - Shows WHY button is disabled (micro-feedback)
 * - Optional summary (e.g., "Zürich → Bern • 3.5 Zi")
 * - Primary + optional secondary button
 * - Loading state
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface EnhancedStickyCTAProps {
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  /** Shown when disabled - explains what's missing */
  primaryHint?: string;
  /** Summary shown above buttons (e.g., route info) */
  summaryLeft?: React.ReactNode;
  secondaryLabel?: string;
  onSecondary?: () => void;
  loading?: boolean;
}

export function EnhancedStickyCTA({
  primaryLabel,
  onPrimary,
  primaryDisabled,
  primaryHint,
  summaryLeft,
  secondaryLabel,
  onSecondary,
  loading,
}: EnhancedStickyCTAProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-md px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        {/* Summary line */}
        {summaryLeft && (
          <div className="mb-2 text-xs text-muted-foreground text-center">
            {summaryLeft}
          </div>
        )}

        {/* Micro-feedback when disabled */}
        {primaryDisabled && primaryHint && (
          <div className="mb-2 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse" />
              {primaryHint}
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          {secondaryLabel && onSecondary && (
            <Button
              type="button"
              variant="outline"
              onClick={onSecondary}
              disabled={loading}
              className="h-12 flex-1 rounded-xl text-sm font-medium min-w-[100px]"
            >
              {secondaryLabel}
            </Button>
          )}

          <Button
            type="button"
            onClick={onPrimary}
            disabled={primaryDisabled || loading}
            className="h-12 flex-[1.3] rounded-xl text-base font-semibold transition-transform active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Wird gesendet...
              </>
            ) : (
              primaryLabel
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
