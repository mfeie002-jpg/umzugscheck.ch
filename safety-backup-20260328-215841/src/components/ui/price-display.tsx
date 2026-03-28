/**
 * Price Display Components
 * 
 * Consistent price formatting for Swiss market:
 * - CHF formatting
 * - Range displays
 * - Savings indicators
 * - Price comparison
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

/**
 * Format price in Swiss Francs
 */
export function formatCHF(amount: number, options?: { showDecimals?: boolean }): string {
  const { showDecimals = false } = options || {};
  
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
}

/**
 * Basic price display
 */
export const PriceDisplay = memo(function PriceDisplay({
  amount,
  size = 'md',
  className,
}: {
  amount: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  return (
    <span className={cn("font-bold tabular-nums", sizes[size], className)}>
      {formatCHF(amount)}
    </span>
  );
});

/**
 * Price range display
 */
export const PriceRangeDisplay = memo(function PriceRangeDisplay({
  min,
  max,
  size = 'md',
  showLabel = true,
  className,
}: {
  min: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {showLabel && (
        <span className="text-xs text-muted-foreground mb-1">Geschätzter Preis</span>
      )}
      <span className={cn("font-bold tabular-nums", sizes[size])}>
        {formatCHF(min)} – {formatCHF(max)}
      </span>
    </div>
  );
});

/**
 * Savings indicator
 */
export const SavingsIndicator = memo(function SavingsIndicator({
  originalPrice,
  discountedPrice,
  showPercentage = true,
  className,
}: {
  originalPrice: number;
  discountedPrice: number;
  showPercentage?: boolean;
  className?: string;
}) {
  const savings = originalPrice - discountedPrice;
  const percentage = Math.round((savings / originalPrice) * 100);

  return (
    <motion.div 
      className={cn("flex items-center gap-3", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="text-muted-foreground line-through text-sm">
        {formatCHF(originalPrice)}
      </span>
      <span className="font-bold text-lg text-primary">
        {formatCHF(discountedPrice)}
      </span>
      {showPercentage && (
        <span className="px-2 py-0.5 bg-green-500/10 text-green-700 text-sm font-medium rounded-full">
          -{percentage}%
        </span>
      )}
    </motion.div>
  );
});

/**
 * Price comparison card
 */
export const PriceComparisonCard = memo(function PriceComparisonCard({
  label,
  price,
  trend,
  trendLabel,
  isHighlighted,
  className,
}: {
  label: string;
  price: number;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  isHighlighted?: boolean;
  className?: string;
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-muted-foreground';

  return (
    <motion.div 
      className={cn(
        "p-4 rounded-xl border",
        isHighlighted 
          ? "bg-primary/5 border-primary" 
          : "bg-card border-border",
        className
      )}
      whileHover={{ scale: 1.02 }}
    >
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold">{formatCHF(price)}</p>
      {trend && (
        <div className={cn("flex items-center gap-1 mt-2 text-sm", trendColor)}>
          <TrendIcon className="w-4 h-4" />
          <span>{trendLabel}</span>
        </div>
      )}
    </motion.div>
  );
});

/**
 * Price level indicator
 */
export const PriceLevelIndicator = memo(function PriceLevelIndicator({
  level,
  showLabel = true,
  className,
}: {
  level: 'günstig' | 'fair' | 'premium';
  showLabel?: boolean;
  className?: string;
}) {
  const config = {
    günstig: { 
      color: 'bg-green-500', 
      label: 'Günstig',
      bars: 1,
    },
    fair: { 
      color: 'bg-yellow-500', 
      label: 'Fair',
      bars: 2,
    },
    premium: { 
      color: 'bg-orange-500', 
      label: 'Premium',
      bars: 3,
    },
  };

  const { color, label, bars } = config[level];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-0.5">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={cn(
              "w-1.5 h-4 rounded-sm",
              i <= bars ? color : 'bg-muted'
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
});

/**
 * Price estimate with confidence
 */
export const PriceEstimate = memo(function PriceEstimate({
  min,
  max,
  confidence,
  className,
}: {
  min: number;
  max: number;
  confidence?: 'low' | 'medium' | 'high';
  className?: string;
}) {
  const confidenceConfig = {
    low: { label: 'Grobe Schätzung', color: 'text-yellow-600' },
    medium: { label: 'Gute Schätzung', color: 'text-blue-600' },
    high: { label: 'Genaue Schätzung', color: 'text-green-600' },
  };

  const average = Math.round((min + max) / 2);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-center">
        <p className="text-xs text-muted-foreground">Geschätzter Preis</p>
        <p className="text-3xl font-bold text-primary">~{formatCHF(average)}</p>
        <p className="text-sm text-muted-foreground">
          ({formatCHF(min)} – {formatCHF(max)})
        </p>
      </div>
      {confidence && (
        <p className={cn("text-xs text-center", confidenceConfig[confidence].color)}>
          {confidenceConfig[confidence].label}
        </p>
      )}
    </div>
  );
});
