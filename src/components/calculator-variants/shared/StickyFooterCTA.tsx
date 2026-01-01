/**
 * StickyFooterCTA - Consistent bottom navigation for all flows
 * 
 * Features:
 * - Fixed at bottom with safe area inset
 * - Primary CTA button (min 44x44 touch target, actually h-14 = 56px)
 * - Optional secondary button (Zurück)
 * - Optional hint text
 * - Consistent styling: primary button uses default variant (red CTA)
 */

import React from 'react';
import { Button } from '@/components/ui/button';

interface StickyFooterCTAProps {
  primaryLabel: string;
  onPrimary: () => void;
  disabled?: boolean;
  hint?: string;
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** Show loading spinner on primary button */
  loading?: boolean;
}

export function StickyFooterCTA({
  primaryLabel,
  onPrimary,
  disabled,
  hint,
  secondaryLabel,
  onSecondary,
  loading,
}: StickyFooterCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur border-t safe-area-inset-bottom">
      <div className="max-w-md mx-auto p-4 space-y-2">
        {hint && (
          <p className="text-center text-sm text-muted-foreground">{hint}</p>
        )}
        <Button
          onClick={onPrimary}
          disabled={disabled || loading}
          className="w-full h-14 text-lg font-semibold"
          size="lg"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
              Wird gesendet...
            </span>
          ) : (
            primaryLabel
          )}
        </Button>
        {secondaryLabel && onSecondary && (
          <Button
            variant="ghost"
            onClick={onSecondary}
            className="w-full h-12 min-h-[48px] text-base"
            disabled={loading}
          >
            {secondaryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
