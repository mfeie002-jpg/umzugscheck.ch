import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Stat/metric card component
 */
export const StatCard = ({
  value,
  label,
  icon: Icon,
  trend,
  trendValue,
  className,
  size = 'md'
}: StatCardProps) => {
  const sizes = {
    sm: {
      wrapper: 'p-4',
      value: 'text-2xl',
      label: 'text-xs',
      icon: 'w-8 h-8'
    },
    md: {
      wrapper: 'p-5',
      value: 'text-3xl md:text-4xl',
      label: 'text-sm',
      icon: 'w-10 h-10'
    },
    lg: {
      wrapper: 'p-6',
      value: 'text-4xl md:text-5xl',
      label: 'text-base',
      icon: 'w-12 h-12'
    }
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-muted-foreground'
  };

  return (
    <div className={cn(
      "rounded-xl bg-card border border-border shadow-soft",
      sizes[size].wrapper,
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={cn("font-bold text-foreground tabular-nums", sizes[size].value)}>
            {value}
          </p>
          <p className={cn("text-muted-foreground", sizes[size].label)}>
            {label}
          </p>
          {trend && trendValue && (
            <p className={cn("text-xs font-medium", trendColors[trend])}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0",
            sizes[size].icon
          )}>
            <Icon className="w-1/2 h-1/2 text-primary" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
};

interface StatsGridProps {
  stats: Array<{
    value: string | number;
    label: string;
    icon?: LucideIcon;
  }>;
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * Grid of stat cards
 */
export const StatsGrid = ({
  stats,
  columns = 4,
  className
}: StatsGridProps) => {
  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4'
  };

  return (
    <div className={cn("grid gap-4", columnClasses[columns], className)}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} size="sm" />
      ))}
    </div>
  );
};
