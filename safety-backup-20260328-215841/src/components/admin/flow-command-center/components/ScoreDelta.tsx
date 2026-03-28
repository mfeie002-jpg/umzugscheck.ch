/**
 * Score Delta Component
 * Shows score changes between analyses with category breakdowns
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown } from 'lucide-react';

interface CategoryDelta {
  label: string;
  delta: number;
}

interface ScoreDeltaProps {
  /** Overall score delta */
  delta: number;
  /** Show category breakdowns */
  categories?: CategoryDelta[];
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show as inline badges */
  inline?: boolean;
  /** Previous score (for tooltip) */
  previousScore?: number;
  /** Current score (for tooltip) */
  currentScore?: number;
}

export const ScoreDelta: React.FC<ScoreDeltaProps> = ({
  delta,
  categories,
  size = 'md',
  inline = false,
  previousScore,
  currentScore,
}) => {
  const isPositive = delta > 0;
  const isNeutral = delta === 0;
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };
  
  const getDeltaColor = (d: number) => {
    if (d > 0) return 'text-green-600 dark:text-green-400';
    if (d < 0) return 'text-red-600 dark:text-red-400';
    return 'text-muted-foreground';
  };
  
  const getDeltaBg = (d: number) => {
    if (d > 0) return 'bg-green-100 dark:bg-green-950 border-green-200 dark:border-green-800';
    if (d < 0) return 'bg-red-100 dark:bg-red-950 border-red-200 dark:border-red-800';
    return 'bg-muted border-border';
  };
  
  const formatDelta = (d: number) => {
    if (d > 0) return `+${d}`;
    if (d < 0) return `${d}`;
    return '±0';
  };

  if (inline) {
    return (
      <div className="flex items-center gap-1 flex-wrap">
        <Badge 
          variant="outline" 
          className={cn(
            'font-semibold gap-1',
            getDeltaBg(delta),
            getDeltaColor(delta),
            sizeClasses[size]
          )}
        >
          {isPositive && <ArrowUp className={iconSizes[size]} />}
          {!isPositive && !isNeutral && <ArrowDown className={iconSizes[size]} />}
          {isNeutral && <Minus className={iconSizes[size]} />}
          {formatDelta(delta)}
        </Badge>
        
        {categories && categories.length > 0 && categories.map((cat) => (
          <Badge 
            key={cat.label}
            variant="outline" 
            className={cn(
              'gap-0.5 font-normal',
              getDeltaBg(cat.delta),
              getDeltaColor(cat.delta),
              'text-xs px-1.5'
            )}
          >
            <span className="opacity-70">{cat.label}</span>
            {formatDelta(cat.delta)}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-1', sizeClasses[size])}>
      {/* Main delta */}
      <div className={cn('flex items-center gap-2', getDeltaColor(delta))}>
        {isPositive && <TrendingUp className={iconSizes[size]} />}
        {!isPositive && !isNeutral && <TrendingDown className={iconSizes[size]} />}
        {isNeutral && <Minus className={iconSizes[size]} />}
        <span className="font-semibold">{formatDelta(delta)} Punkte</span>
        {previousScore !== undefined && currentScore !== undefined && (
          <span className="text-muted-foreground text-xs">
            ({previousScore} → {currentScore})
          </span>
        )}
      </div>
      
      {/* Category deltas */}
      {categories && categories.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap ml-6">
          {categories.map((cat) => (
            <Badge 
              key={cat.label}
              variant="outline" 
              className={cn(
                'gap-0.5 font-normal',
                getDeltaBg(cat.delta),
                getDeltaColor(cat.delta),
                'text-xs px-1.5'
              )}
            >
              <span className="opacity-70">{cat.label}:</span>
              {formatDelta(cat.delta)}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Compact inline delta display for cards
 */
export const ScoreDeltaCompact: React.FC<{
  delta: number;
  className?: string;
}> = ({ delta, className }) => {
  if (delta === 0) return null;
  
  const isPositive = delta > 0;
  
  return (
    <span 
      className={cn(
        'inline-flex items-center gap-0.5 text-xs font-medium',
        isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
        className
      )}
    >
      {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
      {isPositive ? `+${delta}` : delta}
    </span>
  );
};

export default ScoreDelta;
