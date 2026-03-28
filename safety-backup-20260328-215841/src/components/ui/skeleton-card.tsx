import { memo } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  variant?: 'default' | 'company' | 'testimonial' | 'service';
  className?: string;
}

export const SkeletonCard = memo(function SkeletonCard({
  variant = 'default',
  className,
}: SkeletonCardProps) {
  if (variant === 'company') {
    return (
      <div className={cn('bg-card rounded-xl border border-border p-6 animate-pulse', className)}>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-muted rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-8 bg-muted rounded-full w-20" />
          <div className="h-8 bg-muted rounded-full w-24" />
        </div>
      </div>
    );
  }

  if (variant === 'testimonial') {
    return (
      <div className={cn('bg-card rounded-xl border border-border p-6 animate-pulse', className)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-muted rounded-full" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-3 bg-muted rounded w-16" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-4/5" />
        </div>
      </div>
    );
  }

  if (variant === 'service') {
    return (
      <div className={cn('bg-card rounded-xl border border-border p-6 animate-pulse', className)}>
        <div className="w-12 h-12 bg-muted rounded-xl mb-4" />
        <div className="h-5 bg-muted rounded w-2/3 mb-2" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-card rounded-xl border border-border p-6 animate-pulse', className)}>
      <div className="h-6 bg-muted rounded w-3/4 mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-4/6" />
      </div>
    </div>
  );
});
