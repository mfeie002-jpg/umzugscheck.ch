import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface SectionSkeletonProps {
  height?: string;
  className?: string;
  variant?: "default" | "cards" | "hero" | "testimonials";
}

export const SectionSkeleton = ({ 
  height = "min-h-[300px]", 
  className,
  variant = "default" 
}: SectionSkeletonProps) => {
  if (variant === "cards") {
    return (
      <div className={cn("py-12 md:py-16", height, className)}>
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-48 mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-6">
                <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "testimonials") {
    return (
      <div className={cn("py-12 md:py-16 bg-muted/30", height, className)}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-6 w-56 mx-auto mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-12 w-full mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className={cn("min-h-[85vh] flex items-center", className)}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
            <Skeleton className="h-[400px] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("py-12 flex justify-center items-center", height, className)} aria-hidden="true">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
};
