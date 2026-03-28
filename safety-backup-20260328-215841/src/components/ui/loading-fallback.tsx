import { cn } from "@/lib/utils";

interface LoadingFallbackProps {
  className?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingFallback({ 
  className, 
  variant = 'spinner',
  size = 'md',
  text
}: LoadingFallbackProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[200px] gap-4",
      className
    )}>
      {variant === 'spinner' && (
        <div className={cn(
          "animate-spin rounded-full border-2 border-muted border-t-primary",
          sizeClasses[size]
        )} />
      )}
      
      {variant === 'dots' && (
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "rounded-full bg-primary animate-bounce",
                size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4'
              )}
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      )}
      
      {variant === 'pulse' && (
        <div className={cn(
          "rounded-full bg-primary/20 animate-pulse",
          sizeClasses[size]
        )}>
          <div className={cn(
            "rounded-full bg-primary animate-ping",
            sizeClasses[size]
          )} />
        </div>
      )}
      
      {variant === 'skeleton' && (
        <div className="w-full max-w-md space-y-4">
          <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-full" />
          <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
          <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
        </div>
      )}
      
      {text && (
        <p className="text-muted-foreground text-sm animate-pulse">{text}</p>
      )}
    </div>
  );
}

export function PageLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-muted border-t-primary mx-auto" />
        <p className="text-muted-foreground">Wird geladen...</p>
      </div>
    </div>
  );
}

export function InlineLoader({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  );
}
