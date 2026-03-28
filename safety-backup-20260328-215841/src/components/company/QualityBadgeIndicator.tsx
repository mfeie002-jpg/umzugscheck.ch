/**
 * QualityBadgeIndicator - Reusable quality badge for company cards
 * Shows verified/premium/elite status with tooltips
 */

import { memo } from 'react';
import { Shield, Award, Crown, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  BadgeLevel, 
  BADGE_DEFINITIONS, 
  getBadgeColorClasses,
  calculateBadgeLevel 
} from '@/lib/quality-badge';

interface QualityBadgeIndicatorProps {
  provider: {
    rating?: number;
    reviewCount?: number;
    isVerified?: boolean;
    responseTimeHours?: number;
    successRate?: number;
    profileCompleteness?: number;
    yearsInBusiness?: number;
  };
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

const BADGE_ICONS = {
  shield: Shield,
  award: Award,
  crown: Crown,
  star: Star,
};

export const QualityBadgeIndicator = memo(function QualityBadgeIndicator({
  provider,
  size = 'sm',
  showTooltip = true,
  className = '',
}: QualityBadgeIndicatorProps) {
  const level = calculateBadgeLevel(provider);
  
  if (level === 'none') return null;
  
  const badgeDef = BADGE_DEFINITIONS[level];
  const colors = getBadgeColorClasses(level);
  const Icon = BADGE_ICONS[badgeDef.icon];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const badge = (
    <Badge 
      variant="outline"
      className={`${colors.bg} ${colors.text} ${colors.border} ${sizeClasses[size]} font-medium ${className}`}
    >
      <Icon className={iconSizes[size]} />
      {badgeDef.label}
    </Badge>
  );

  if (!showTooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">{badgeDef.label}</p>
            <p className="text-xs text-muted-foreground">{badgeDef.description}</p>
            {level === 'elite' && (
              <p className="text-xs text-purple-600 font-medium">
                ⭐ Top 5% aller Anbieter
              </p>
            )}
            {level === 'premium' && (
              <p className="text-xs text-amber-600 font-medium">
                ⭐ Top 15% aller Anbieter
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

export default QualityBadgeIndicator;
