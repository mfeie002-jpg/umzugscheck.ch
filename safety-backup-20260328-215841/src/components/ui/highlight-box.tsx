import { memo, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Info, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

type HighlightVariant = 'info' | 'warning' | 'success' | 'tip';

interface HighlightBoxProps {
  variant?: HighlightVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const variants: Record<HighlightVariant, { icon: typeof Info; border: string; bg: string; iconColor: string }> = {
  info: { icon: Info, border: 'border-l-primary', bg: 'bg-primary/5', iconColor: 'text-primary' },
  warning: { icon: AlertTriangle, border: 'border-l-amber-500', bg: 'bg-amber-500/5', iconColor: 'text-amber-500' },
  success: { icon: CheckCircle, border: 'border-l-green-500', bg: 'bg-green-500/5', iconColor: 'text-green-500' },
  tip: { icon: Lightbulb, border: 'border-l-secondary', bg: 'bg-secondary/5', iconColor: 'text-secondary' },
};

export const HighlightBox = memo(function HighlightBox({
  variant = 'info',
  title,
  children,
  className,
}: HighlightBoxProps) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-lg border-l-4 p-4',
        config.border,
        config.bg,
        className
      )}
    >
      <div className="flex gap-3">
        <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor)} />
        <div>
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div className="text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
});
