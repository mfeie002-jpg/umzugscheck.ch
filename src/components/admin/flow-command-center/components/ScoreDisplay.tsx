/**
 * Score Display Components
 * Reusable components for displaying scores
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
export { ScoreDelta, ScoreDeltaCompact } from './ScoreDelta';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Score Ring - Circular progress indicator
// ─────────────────────────────────────────────────────────────

interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showLabel?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({ 
  score, 
  size = 'md', 
  label,
  showLabel = true 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-20 h-20 text-lg',
    lg: 'w-28 h-28 text-2xl',
  };
  
  const getColor = (s: number) => {
    if (s >= 80) return 'text-green-500 stroke-green-500';
    if (s >= 60) return 'text-yellow-500 stroke-yellow-500';
    return 'text-red-500 stroke-red-500';
  };

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size])}>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/20"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${score * 2.64} 264`}
          className={getColor(score)}
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className={cn('font-bold', getColor(score))}>{score}</span>
        {showLabel && label && (
          <span className="text-[10px] text-muted-foreground">{label}</span>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Score Badge - Compact inline score display
// ─────────────────────────────────────────────────────────────

interface ScoreBadgeProps {
  score: number | null;
  label?: string;
  size?: 'sm' | 'default';
}

export const ScoreBadgeCompact: React.FC<ScoreBadgeProps> = ({ 
  score, 
  label,
  size = 'default' 
}) => {
  if (score === null || score === undefined) {
    return (
      <Badge variant="outline" className={cn('opacity-50', size === 'sm' && 'text-xs px-1.5')}>
        {label || 'N/A'}
      </Badge>
    );
  }
  
  const color = score >= 80 
    ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300' 
    : score >= 60 
      ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300'
      : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300';
  
  return (
    <Badge className={cn('font-semibold', color, size === 'sm' && 'text-xs px-1.5')}>
      {label && <span className="mr-1 opacity-70">{label}</span>}
      {score}
    </Badge>
  );
};

// ─────────────────────────────────────────────────────────────
// Severity Badge
// ─────────────────────────────────────────────────────────────

interface SeverityBadgeProps {
  severity: 'critical' | 'warning' | 'info';
  showIcon?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ 
  severity, 
  showIcon = true 
}) => {
  const config = {
    critical: { 
      bg: 'bg-red-100 dark:bg-red-950', 
      text: 'text-red-700 dark:text-red-300', 
      icon: AlertCircle,
      label: 'Kritisch'
    },
    warning: { 
      bg: 'bg-yellow-100 dark:bg-yellow-950', 
      text: 'text-yellow-700 dark:text-yellow-300', 
      icon: AlertTriangle,
      label: 'Warnung'
    },
    info: { 
      bg: 'bg-blue-100 dark:bg-blue-950', 
      text: 'text-blue-700 dark:text-blue-300', 
      icon: AlertCircle,
      label: 'Info'
    }
  };
  
  const { bg, text, icon: Icon, label } = config[severity];
  
  return (
    <Badge variant="outline" className={cn(bg, text, 'gap-1')}>
      {showIcon && <Icon className="h-3 w-3" />}
      {label}
    </Badge>
  );
};

// ─────────────────────────────────────────────────────────────
// Effort Badge
// ─────────────────────────────────────────────────────────────

interface EffortBadgeProps {
  effort: 'low' | 'medium' | 'high' | string;
}

export const EffortBadge: React.FC<EffortBadgeProps> = ({ effort }) => {
  const config: Record<string, { bg: string; label: string }> = {
    low: { 
      bg: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
      label: 'Gering'
    },
    medium: { 
      bg: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
      label: 'Mittel'
    },
    high: { 
      bg: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
      label: 'Hoch'
    }
  };
  
  const { bg, label } = config[effort] || config.medium;
  
  return (
    <Badge variant="outline" className={bg}>
      {label} Aufwand
    </Badge>
  );
};

// ─────────────────────────────────────────────────────────────
// Rank Badge
// ─────────────────────────────────────────────────────────────

interface RankBadgeProps {
  rank: number;
  size?: 'sm' | 'default' | 'lg';
}

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, size = 'default' }) => {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    default: 'text-sm px-2 py-1',
    lg: 'text-lg px-3 py-1.5',
  };
  
  const rankStyles = {
    1: 'bg-yellow-400 text-yellow-900 border-yellow-500',
    2: 'bg-gray-300 text-gray-800 border-gray-400',
    3: 'bg-amber-600 text-white border-amber-700',
  };
  
  const style = rankStyles[rank as 1 | 2 | 3] || 'bg-muted text-muted-foreground border-border';
  
  return (
    <Badge className={cn('font-bold', style, sizeClasses[size])}>
      #{rank}
    </Badge>
  );
};

// ─────────────────────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = {
    pending: { variant: 'outline' as const, label: 'Ausstehend' },
    processing: { variant: 'secondary' as const, label: 'Läuft...' },
    completed: { variant: 'default' as const, label: 'Abgeschlossen' },
    failed: { variant: 'destructive' as const, label: 'Fehlgeschlagen' },
  };
  
  const { variant, label } = config[status];
  
  return <Badge variant={variant}>{label}</Badge>;
};
