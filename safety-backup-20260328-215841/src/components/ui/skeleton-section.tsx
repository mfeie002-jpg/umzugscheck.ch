/**
 * Skeleton Section Components for CLS Prevention
 * Fixed heights prevent layout shift during lazy loading
 */
import { memo } from "react";
import { cn } from "@/lib/utils";

interface SectionSkeletonProps {
  /** Fixed height for skeleton - CRITICAL for CLS prevention */
  height?: string;
  /** Additional classes */
  className?: string;
  /** Variant style */
  variant?: "default" | "cards" | "testimonials" | "form";
}

export const SectionSkeleton = memo(function SectionSkeleton({ 
  height = "400px",
  className,
  variant = "default"
}: SectionSkeletonProps) {
  return (
    <div 
      className={cn(
        "w-full flex items-center justify-center",
        variant === "default" && "bg-muted/10",
        variant === "cards" && "bg-muted/5",
        variant === "testimonials" && "bg-gradient-to-b from-muted/5 to-muted/10",
        variant === "form" && "bg-card border rounded-xl",
        className
      )}
      style={{ minHeight: height }}
      role="status"
      aria-label="Inhalt wird geladen..."
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Laden...</span>
      </div>
    </div>
  );
});

// Hero-specific skeleton with proper structure
export const HeroSkeleton = memo(function HeroSkeleton() {
  return (
    <section 
      className="min-h-[70vh] sm:min-h-[75vh] lg:min-h-[85vh] flex items-center bg-muted/5"
      role="status"
      aria-label="Hero wird geladen..."
    >
      <div className="container py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1fr,480px] gap-6 sm:gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="h-8 w-32 bg-muted rounded-full animate-pulse" />
            <div className="h-16 w-full max-w-md bg-muted rounded animate-pulse" />
            <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-10 w-32 bg-muted rounded-full animate-pulse" />
              <div className="h-10 w-32 bg-muted rounded-full animate-pulse" />
            </div>
          </div>
          <div className="hidden lg:block h-[500px] bg-muted rounded-2xl animate-pulse" />
        </div>
      </div>
    </section>
  );
});

// Card grid skeleton
export const CardGridSkeleton = memo(function CardGridSkeleton({ 
  count = 3,
  height = "200px" 
}: { count?: number; height?: string }) {
  return (
    <div className="container py-16">
      <div className="h-10 w-64 mx-auto bg-muted rounded animate-pulse mb-8" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div 
            key={i}
            className="bg-muted rounded-xl animate-pulse"
            style={{ height }}
          />
        ))}
      </div>
    </div>
  );
});

// Testimonials skeleton
export const TestimonialsSkeleton = memo(function TestimonialsSkeleton() {
  return (
    <section className="py-16 bg-muted/5" style={{ minHeight: "350px" }}>
      <div className="container">
        <div className="h-8 w-48 mx-auto bg-muted rounded animate-pulse mb-8" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="flex-shrink-0 w-[300px] h-[150px] bg-muted rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export default SectionSkeleton;
