import { Button } from '@/components/ui/button';

type StickyFooterCTAProps = {
  primaryLabel: string;
  onPrimary: () => void;
  disabled?: boolean;
  hint?: string;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export function StickyFooterCTA({
  primaryLabel,
  onPrimary,
  disabled,
  hint,
  secondaryLabel,
  onSecondary,
}: StickyFooterCTAProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-md flex-col gap-2 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        <Button
          type="button"
          onClick={onPrimary}
          disabled={disabled}
          size="lg"
          className="h-12 w-full rounded-xl text-base font-semibold"
        >
          {primaryLabel}
        </Button>
        {secondaryLabel && onSecondary ? (
          <Button
            type="button"
            variant="outline"
            onClick={onSecondary}
            className="h-11 w-full rounded-xl text-sm font-medium"
          >
            {secondaryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default StickyFooterCTA;
