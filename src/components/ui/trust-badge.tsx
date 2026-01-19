import { memo } from 'react';
import { CheckCircle, Lock, Award, Star, Medal, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'verified' | 'secure' | 'quality' | 'rated' | 'certified' | 'protected';

interface TrustBadgeProps {
  variant: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

const badgeConfig: Record<BadgeVariant, { icon: React.ComponentType<{ className?: string }>; label: string; color: string; bg: string }> = {
  verified: { icon: CheckCircle, label: 'Verifiziert', color: 'text-green-600', bg: 'bg-green-500/10' },
  secure: { icon: Lock, label: 'SSL Sicher', color: 'text-primary', bg: 'bg-primary/10' },
  quality: { icon: Award, label: 'Top Qualität', color: 'text-secondary', bg: 'bg-secondary/10' },
  rated: { icon: Star, label: '4.8/5 Sterne', color: 'text-swiss-gold', bg: 'bg-swiss-gold/10' },
  certified: { icon: Medal, label: 'Zertifiziert', color: 'text-blue-600', bg: 'bg-blue-500/10' },
  protected: { icon: Shield, label: 'Versichert', color: 'text-purple-600', bg: 'bg-purple-500/10' },
};

const sizes = {
  sm: { text: 'text-xs', padding: 'px-2 py-1', gap: 'gap-1', iconSize: 'w-3 h-3' },
  md: { text: 'text-sm', padding: 'px-3 py-1.5', gap: 'gap-1.5', iconSize: 'w-4 h-4' },
  lg: { text: 'text-base', padding: 'px-4 py-2', gap: 'gap-2', iconSize: 'w-5 h-5' },
};

export const TrustBadge = memo(function TrustBadge({
  variant,
  size = 'md',
  className,
  showLabel = true,
}: TrustBadgeProps) {
  const config = badgeConfig[variant];
  const sizeConfig = sizes[size];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        config.bg,
        config.color,
        sizeConfig.padding,
        sizeConfig.gap,
        sizeConfig.text,
        className
      )}
    >
      <Icon className={sizeConfig.iconSize} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
});

// Compact trust badge row
export const TrustBadgeRow = memo(function TrustBadgeRow({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <TrustBadge variant="verified" size="sm" />
      <TrustBadge variant="secure" size="sm" />
      <TrustBadge variant="protected" size="sm" />
    </div>
  );
});
