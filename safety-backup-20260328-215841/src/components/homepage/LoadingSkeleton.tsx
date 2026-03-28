import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div className={cn("animate-pulse bg-muted rounded-lg", className)} />
);

export const CardSkeleton = () => (
  <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
    <Skeleton className="w-14 h-14 rounded-xl mb-4" />
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

export const TestimonialSkeleton = () => (
  <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
    <Skeleton className="w-8 h-8 mb-4" />
    <div className="flex gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="w-4 h-4 rounded" />
      ))}
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4 mb-4" />
    <div className="flex justify-between pt-4 border-t border-border">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export const HeroSkeleton = () => (
  <div className="min-h-[90vh] flex items-center">
    <div className="container py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64 rounded-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-6 w-full max-w-lg" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32 rounded-xl" />
            <Skeleton className="h-12 w-32 rounded-xl" />
            <Skeleton className="h-12 w-32 rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-[500px] rounded-2xl" />
      </div>
    </div>
  </div>
);
