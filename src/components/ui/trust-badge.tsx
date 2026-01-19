import { memo } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'verified' | 'secure' | 'quality' | 'rated' | 'certified' | 'protected';

interface TrustBadgeProps {
  variant: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

const badgeConfig: Record<BadgeVariant, { emoji: string; label: string; color: string; bg: string }> = {
  verified: { emoji: "✅", label: 'Verifiziert', color: 'text-green-600', bg: 'bg-green-500/10' },
  secure: { emoji: "🔒", label: 'SSL Sicher', color: 'text-primary', bg: 'bg-primary/10' },
  quality: { emoji: "🏆", label: 'Top Qualität', color: 'text-secondary', bg: 'bg-secondary/10' },
  rated: { emoji: "⭐", label: '4.8/5 Sterne', color: 'text-swiss-gold', bg: 'bg-swiss-gold/10' },
  certified: { emoji: "🎖️", label: 'Zertifiziert', color: 'text-blue-600', bg: 'bg-blue-500/10' },
  protected: { emoji: "🛡️", label: 'Versichert', color: 'text-purple-600', bg: 'bg-purple-500/10' },
};

const sizes = {
  sm: { text: 'text-xs', padding: 'px-2 py-1', gap: 'gap-1', emoji: 'text-sm' },
  md: { text: 'text-sm', padding: 'px-3 py-1.5', gap: 'gap-1.5', emoji: 'text-base' },
  lg: { text: 'text-base', padding: 'px-4 py-2', gap: 'gap-2', emoji: 'text-lg' },
};

export const TrustBadge = memo(function TrustBadge({
  variant,
  size = 'md',
  className,
  showLabel = true,
}: TrustBadgeProps) {
  const config = badgeConfig[variant];
  const sizeConfig = sizes[size];

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
      <span className={sizeConfig.emoji}>{config.emoji}</span>
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
