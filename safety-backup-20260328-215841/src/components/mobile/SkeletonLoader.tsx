interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'text' | 'avatar' | 'button';
  count?: number;
  className?: string;
}

const ShimmerDiv = ({ className }: { className: string }) => (
  <div className={`animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] rounded ${className}`} />
);

export const SkeletonLoader = ({
  variant = 'card',
  count = 1,
  className = '',
}: SkeletonLoaderProps) => {
  const variants = {
    card: (
      <div className="p-4 border border-border rounded-xl space-y-3">
        <ShimmerDiv className="h-32 rounded-lg" />
        <ShimmerDiv className="h-4 w-3/4" />
        <ShimmerDiv className="h-4 w-1/2" />
        <div className="flex gap-2">
          <ShimmerDiv className="h-8 w-20" />
          <ShimmerDiv className="h-8 w-20" />
        </div>
      </div>
    ),
    list: (
      <div className="flex items-center gap-3 p-3">
        <ShimmerDiv className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <ShimmerDiv className="h-4 w-3/4" />
          <ShimmerDiv className="h-3 w-1/2" />
        </div>
      </div>
    ),
    text: (
      <div className="space-y-2">
        <ShimmerDiv className="h-4 w-full" />
        <ShimmerDiv className="h-4 w-5/6" />
        <ShimmerDiv className="h-4 w-4/6" />
      </div>
    ),
    avatar: (
      <ShimmerDiv className="w-10 h-10 rounded-full" />
    ),
    button: (
      <ShimmerDiv className="h-10 w-24" />
    ),
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{variants[variant]}</div>
      ))}
    </div>
  );
};
