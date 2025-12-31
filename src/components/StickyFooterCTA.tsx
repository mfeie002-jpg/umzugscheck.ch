/**
 * StickyFooterCTA - Mobile-optimized sticky CTA footer
 * 
 * UX Guidelines applied:
 * - Min touch target: 48px height (exceeds 44px minimum)
 * - Clear visual hierarchy
 * - Safe area padding for iOS
 * - Backdrop blur for modern feel
 * - Clear CTA text (never use "Pflichtfelder ausfüllen" as primary label)
 */
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type StickyFooterCTAProps = {
  /** Primary button label - should be action-oriented (e.g., "Weiter", "Offerten erhalten") */
  primaryLabel: string;
  onPrimary: () => void;
  disabled?: boolean;
  /** Loading state - shows spinner */
  loading?: boolean;
  /** Help text shown above button */
  hint?: string;
  /** Secondary/back button */
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** Additional class names */
  className?: string;
};

export function StickyFooterCTA({
  primaryLabel,
  onPrimary,
  disabled,
  loading,
  hint,
  secondaryLabel,
  onSecondary,
  className,
}: StickyFooterCTAProps) {
  return (
    <div className={cn(
      "fixed inset-x-0 bottom-0 z-50 border-t border-border",
      "bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80",
      className
    )}>
      <div className="mx-auto flex max-w-md flex-col gap-2 px-4 pt-3 pb-[max(env(safe-area-inset-bottom),12px)]">
        {hint && (
          <p className="text-xs text-muted-foreground text-center">{hint}</p>
        )}
        
        <div className={cn(
          "flex gap-3",
          secondaryLabel && onSecondary ? "flex-row" : "flex-col"
        )}>
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
            disabled={disabled || loading}
            size="lg"
            className={cn(
              // 48px height for excellent touch target
              "h-12 w-full rounded-xl text-base font-semibold",
              // Disabled state should still be readable
              "disabled:opacity-70"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Wird verarbeitet...
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

export default StickyFooterCTA;
