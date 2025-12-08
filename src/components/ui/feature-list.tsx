import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface FeatureListProps {
  features: string[];
  variant?: 'check' | 'bullet' | 'numbered';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  columns?: 1 | 2 | 3;
}

/**
 * Styled feature/benefit list component
 */
export const FeatureList = ({
  features,
  variant = 'check',
  size = 'md',
  className,
  columns = 1
}: FeatureListProps) => {
  const sizes = {
    sm: 'text-sm gap-2',
    md: 'text-base gap-3',
    lg: 'text-lg gap-4'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  };

  return (
    <ul className={cn(
      "grid",
      sizes[size],
      columnClasses[columns],
      className
    )}>
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-2.5">
          {variant === 'check' && (
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
              <Check className={cn("text-primary", iconSizes[size])} aria-hidden="true" />
            </div>
          )}
          {variant === 'bullet' && (
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" aria-hidden="true" />
          )}
          {variant === 'numbered' && (
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {index + 1}
            </span>
          )}
          <span className="text-foreground">{feature}</span>
        </li>
      ))}
    </ul>
  );
};

interface ComparisonListProps {
  included: string[];
  excluded?: string[];
  className?: string;
}

/**
 * Comparison list showing what's included vs excluded
 */
export const ComparisonList = ({
  included,
  excluded = [],
  className
}: ComparisonListProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      {included.length > 0 && (
        <ul className="space-y-2">
          {included.map((item, index) => (
            <li key={index} className="flex items-center gap-2.5 text-sm">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-green-600" aria-hidden="true" />
              </div>
              <span className="text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      )}
      
      {excluded.length > 0 && (
        <ul className="space-y-2">
          {excluded.map((item, index) => (
            <li key={index} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                <X className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
              </div>
              <span className="line-through">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
