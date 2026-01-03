/**
 * ScoreBadge - Visual score indicator with badge styling
 * Shows GOLD/EXCELLENT/GOOD/NEEDS_WORK/CRITICAL status
 */

import { motion } from 'framer-motion';
import { Trophy, Star, CheckCircle, AlertTriangle, AlertOctagon, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  showTooltip?: boolean;
  animated?: boolean;
  className?: string;
}

interface BadgeConfig {
  label: string;
  icon: typeof Trophy;
  bgColor: string;
  textColor: string;
  borderColor: string;
  gradient: string;
  description: string;
  criteria: string;
}

function getBadgeConfig(score: number): BadgeConfig {
  if (score >= 95) {
    return {
      label: 'GOLD',
      icon: Trophy,
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-500',
      gradient: 'from-yellow-400 to-amber-500',
      description: 'Archetyp-Level erreicht!',
      criteria: '0 kritische Issues, max. 2 Warnungen',
    };
  }
  if (score >= 85) {
    return {
      label: 'EXCELLENT',
      icon: Star,
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      borderColor: 'border-green-500',
      gradient: 'from-green-400 to-emerald-500',
      description: 'Hervorragender Flow',
      criteria: '0 kritische Issues, max. 5 Warnungen',
    };
  }
  if (score >= 70) {
    return {
      label: 'GOOD',
      icon: CheckCircle,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-500',
      gradient: 'from-blue-400 to-cyan-500',
      description: 'Solider Flow',
      criteria: 'Max. 1 kritisches Issue, max. 8 Warnungen',
    };
  }
  if (score >= 50) {
    return {
      label: 'NEEDS WORK',
      icon: AlertTriangle,
      bgColor: 'bg-amber-500',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-500',
      gradient: 'from-amber-400 to-orange-500',
      description: 'Optimierungsbedarf',
      criteria: 'Bis zu 3 kritische Issues',
    };
  }
  return {
    label: 'CRITICAL',
    icon: AlertOctagon,
    bgColor: 'bg-red-500',
    textColor: 'text-red-600',
    borderColor: 'border-red-500',
    gradient: 'from-red-400 to-rose-500',
    description: 'Dringender Handlungsbedarf',
    criteria: 'Mehr als 3 kritische Issues',
  };
}

const sizeClasses = {
  sm: {
    container: 'h-8 px-2',
    score: 'text-sm',
    label: 'text-xs',
    icon: 'h-3 w-3',
  },
  md: {
    container: 'h-10 px-3',
    score: 'text-base',
    label: 'text-xs',
    icon: 'h-4 w-4',
  },
  lg: {
    container: 'h-12 px-4',
    score: 'text-lg',
    label: 'text-sm',
    icon: 'h-5 w-5',
  },
  xl: {
    container: 'h-16 px-6',
    score: 'text-2xl',
    label: 'text-base',
    icon: 'h-6 w-6',
  },
};

export function ScoreBadge({ 
  score, 
  size = 'md', 
  showLabel = true,
  showTooltip = true,
  animated = true,
  className 
}: ScoreBadgeProps) {
  const config = getBadgeConfig(score);
  const Icon = config.icon;
  const classes = sizeClasses[size];

  const badge = (
    <motion.div
      initial={animated ? { scale: 0.8, opacity: 0 } : false}
      animate={animated ? { scale: 1, opacity: 1 } : false}
      whileHover={animated ? { scale: 1.05 } : undefined}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border-2',
        `bg-gradient-to-r ${config.gradient}`,
        config.borderColor,
        classes.container,
        'text-white font-bold shadow-lg',
        className
      )}
    >
      <Icon className={classes.icon} />
      <span className={classes.score}>{score}</span>
      {showLabel && (
        <span className={cn('font-semibold', classes.label)}>
          {config.label}
        </span>
      )}
    </motion.div>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {config.label} Level
            </p>
            <p className="text-sm">{config.description}</p>
            <p className="text-xs text-muted-foreground">
              Kriterien: {config.criteria}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Compact version for lists/tables
export function ScoreBadgeCompact({ score, className }: { score: number; className?: string }) {
  const config = getBadgeConfig(score);
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        'font-mono font-bold',
        config.textColor,
        config.borderColor.replace('border-', 'border-'),
        className
      )}
    >
      {score}
    </Badge>
  );
}

// Path to 95 indicator
export function PathTo95({ 
  currentScore, 
  criticalCount, 
  warningCount 
}: { 
  currentScore: number; 
  criticalCount: number; 
  warningCount: number; 
}) {
  if (currentScore >= 95) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <Trophy className="h-4 w-4" />
        <span>GOLD Level erreicht! 🎉</span>
      </div>
    );
  }

  const steps: string[] = [];
  if (criticalCount > 0) {
    steps.push(`${criticalCount} kritische Issues beheben (-${criticalCount * 10} Punkte)`);
  }
  if (warningCount > 2) {
    steps.push(`${warningCount - 2} Warnungen beheben (-${(warningCount - 2) * 3} Punkte)`);
  }

  const canReach95 = criticalCount === 0 && warningCount <= 2;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <TrendingUp className={cn('h-4 w-4', canReach95 ? 'text-green-500' : 'text-amber-500')} />
        <span className="font-medium">
          {canReach95 ? 'GOLD erreichbar!' : 'Weg zu GOLD:'}
        </span>
      </div>
      {steps.length > 0 ? (
        <ul className="text-xs text-muted-foreground pl-6 space-y-1">
          {steps.map((step, i) => (
            <li key={i}>→ {step}</li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground pl-6">
          Info-Level Issues sind optional – du bist auf gutem Weg!
        </p>
      )}
    </div>
  );
}

export default ScoreBadge;
