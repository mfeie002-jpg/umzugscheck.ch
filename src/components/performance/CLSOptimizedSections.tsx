/**
 * CLS-Optimized Section Wrappers
 * Fixed minimum heights to prevent Cumulative Layout Shift
 */
import { memo, ReactNode, Suspense } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CLSSectionProps {
  children: ReactNode;
  minHeight: string;
  className?: string;
  id?: string;
}

// Base CLS-safe section wrapper
export const CLSSection = memo(function CLSSection({
  children,
  minHeight,
  className,
  id
}: CLSSectionProps) {
  return (
    <section
      id={id}
      className={cn("w-full", className)}
      style={{ minHeight, contentVisibility: 'auto', containIntrinsicSize: minHeight }}
    >
      {children}
    </section>
  );
});

// Hero skeleton with exact layout match
export const HeroSkeleton = memo(function HeroSkeleton() {
  return (
    <section 
      className="min-h-[70vh] sm:min-h-[75vh] lg:min-h-[85vh] flex items-center bg-gradient-to-br from-background via-muted/20 to-background"
      style={{ minHeight: 'max(70vh, 500px)' }}
    >
      <div className="container py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1fr,480px] gap-6 sm:gap-8 lg:gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <Skeleton className="h-8 w-32 mx-auto lg:mx-0" />
            <div className="space-y-2">
              <Skeleton className="h-12 sm:h-16 w-full max-w-md mx-auto lg:mx-0" />
              <Skeleton className="h-12 sm:h-16 w-4/5 max-w-sm mx-auto lg:mx-0" />
            </div>
            <Skeleton className="h-6 w-3/4 max-w-lg mx-auto lg:mx-0" />
            <div className="flex gap-2 justify-center lg:justify-start">
              <Skeleton className="h-10 w-32 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>
            <Skeleton className="h-14 w-full max-w-xs mx-auto lg:mx-0 rounded-xl" />
          </div>
          <div className="hidden lg:block">
            <Skeleton className="h-[500px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
});

// Company cards skeleton
export const CompanyCardsSkeleton = memo(function CompanyCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card border rounded-xl p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <Skeleton className="w-14 h-14 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
});

// Trust section skeleton
export const TrustSkeleton = memo(function TrustSkeleton() {
  return (
    <div className="py-8 bg-muted/30">
      <div className="container">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Calculator skeleton
export const CalculatorSkeleton = memo(function CalculatorSkeleton() {
  return (
    <div className="bg-card border rounded-2xl p-6 shadow-lg" style={{ minHeight: '500px' }}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    </div>
  );
});

// Section loading wrapper with proper height reservation
interface SuspenseSectionProps {
  children: ReactNode;
  fallback: ReactNode;
  minHeight: string;
  className?: string;
}

export const SuspenseSection = memo(function SuspenseSection({
  children,
  fallback,
  minHeight,
  className
}: SuspenseSectionProps) {
  return (
    <div 
      className={className}
      style={{ minHeight, contentVisibility: 'auto', containIntrinsicSize: `0 ${minHeight}` }}
    >
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  );
});
