import { memo } from 'react';
import { cn } from '@/lib/utils';
import { TrendingDown, DollarSign, Crown } from 'lucide-react';

type PriceLevel = 'budget' | 'fair' | 'premium';

interface PriceBadgeProps {
  level: PriceLevel;
  size?: 'sm' | 'md';
  className?: string;
}

const config: Record<PriceLevel, { icon: typeof DollarSign; label: string; color: string; bg: string }> = {
  budget: { icon: TrendingDown, label: 'Günstig', color: 'text-green-700', bg: 'bg-green-500/10' },
  fair: { icon: DollarSign, label: 'Fair', color: 'text-blue-700', bg: 'bg-blue-500/10' },
  premium: { icon: Crown, label: 'Premium', color: 'text-amber-700', bg: 'bg-amber-500/10' },
};

export const PriceBadge = memo(function PriceBadge({
  level,
  size = 'md',
  className,
}: PriceBadgeProps) {
  const { icon: Icon, label, color, bg } = config[level];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        bg,
        color,
        size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-3 py-1 text-sm gap-1.5',
        className
      )}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      <span>{label}</span>
    </span>
  );
});
