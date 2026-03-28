/**
 * Consistent Loading States
 * Used across the application for uniform UX
 */
import { memo } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner = memo(function LoadingSpinner({
  size = 'md',
  className,
  text
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
});

// Full page loading
export const PageLoading = memo(function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground">Laden...</p>
      </motion.div>
    </div>
  );
});

// Section loading with pulse
export const SectionLoading = memo(function SectionLoading({
  height = '200px',
  className
}: { height?: string; className?: string }) {
  return (
    <div 
      className={cn(
        "w-full flex items-center justify-center bg-muted/10 rounded-lg",
        className
      )}
      style={{ minHeight: height }}
    >
      <LoadingSpinner text="Laden..." />
    </div>
  );
});

// Button loading state
export const ButtonLoading = memo(function ButtonLoading({
  text = 'Wird verarbeitet...'
}: { text?: string }) {
  return (
    <span className="flex items-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      {text}
    </span>
  );
});

// Inline loading dots
export const LoadingDots = memo(function LoadingDots() {
  return (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 bg-current rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </span>
  );
});

// Skeleton shimmer effect
export const SkeletonShimmer = memo(function SkeletonShimmer({
  className
}: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-muted rounded", className)}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
});

// Data loading with retry
interface DataLoadingProps {
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export const DataLoading = memo(function DataLoading({
  isLoading,
  error,
  onRetry,
  children,
  loadingComponent
}: DataLoadingProps) {
  if (isLoading) {
    return loadingComponent || <SectionLoading />;
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-destructive mb-2">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-primary hover:underline"
          >
            Erneut versuchen
          </button>
        )}
      </div>
    );
  }
  
  return <>{children}</>;
});

// Suspense fallback wrapper
export const SuspenseFallback = memo(function SuspenseFallback({
  minHeight = '200px'
}: { minHeight?: string }) {
  return (
    <div 
      className="w-full flex items-center justify-center"
      style={{ minHeight }}
    >
      <LoadingSpinner size="lg" text="Wird geladen..." />
    </div>
  );
});

export default LoadingSpinner;
