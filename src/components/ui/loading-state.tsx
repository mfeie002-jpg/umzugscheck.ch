import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'spinner' | 'dots' | 'skeleton';
}

/**
 * Unified loading state component
 */
export const LoadingState = ({
  className,
  size = 'md',
  text,
  variant = 'spinner'
}: LoadingStateProps) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  if (variant === 'dots') {
    return (
      <div className={cn("flex items-center justify-center gap-1", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full bg-primary animate-bounce",
              size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
            )}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="h-4 bg-muted animate-shimmer rounded" />
        <div className="h-4 bg-muted animate-shimmer rounded w-3/4" />
        <div className="h-4 bg-muted animate-shimmer rounded w-1/2" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizes[size])} />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
};

/**
 * Full page loading state
 */
export const PageLoading = ({ text = "Laden..." }: { text?: string }) => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <LoadingState size="lg" text={text} />
  </div>
);

/**
 * Inline loading state for buttons/inputs
 */
export const InlineLoading = ({ className }: { className?: string }) => (
  <Loader2 className={cn("w-4 h-4 animate-spin", className)} />
);
