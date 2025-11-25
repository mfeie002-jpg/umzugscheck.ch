import { Loader2, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshIndicatorProps {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  threshold: number;
}

export const PullToRefreshIndicator = ({
  isPulling,
  isRefreshing,
  pullDistance,
  threshold
}: PullToRefreshIndicatorProps) => {
  if (!isPulling && !isRefreshing) return null;

  const progress = Math.min((pullDistance / threshold) * 100, 100);
  const shouldTrigger = pullDistance >= threshold;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300 md:hidden"
      style={{
        height: `${Math.min(pullDistance, 80)}px`,
        opacity: Math.min(pullDistance / 40, 1)
      }}
    >
      <div className="flex flex-col items-center gap-2">
        {isRefreshing ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">Aktualisieren...</span>
          </>
        ) : (
          <>
            <div className="relative">
              <ArrowDown 
                className={cn(
                  "h-6 w-6 transition-all duration-300",
                  shouldTrigger ? "text-primary rotate-180" : "text-muted-foreground"
                )} 
              />
              <svg className="absolute inset-0 -rotate-90" width="24" height="24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary/20"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 10}`}
                  strokeDashoffset={`${2 * Math.PI * 10 * (1 - progress / 100)}`}
                  className="text-primary transition-all duration-300"
                />
              </svg>
            </div>
            <span className="text-xs text-muted-foreground">
              {shouldTrigger ? 'Loslassen zum Aktualisieren' : 'Ziehen zum Aktualisieren'}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
