import { memo } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

const sizes = {
  sm: { star: 'w-3.5 h-3.5', text: 'text-xs', gap: 'gap-0.5' },
  md: { star: 'w-4 h-4', text: 'text-sm', gap: 'gap-0.5' },
  lg: { star: 'w-5 h-5', text: 'text-base', gap: 'gap-1' },
};

export const RatingStars = memo(function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = true,
  reviewCount,
  className,
}: RatingStarsProps) {
  const sizeConfig = sizes[size];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={cn('flex items-center', sizeConfig.gap, className)}>
      <div className={cn('flex', sizeConfig.gap)}>
        {Array.from({ length: maxRating }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              sizeConfig.star,
              i < fullStars
                ? 'text-swiss-gold fill-swiss-gold'
                : i === fullStars && hasHalfStar
                ? 'text-swiss-gold fill-swiss-gold/50'
                : 'text-muted-foreground/30'
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className={cn('font-semibold ml-1', sizeConfig.text)}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={cn('text-muted-foreground ml-1', sizeConfig.text)}>
          ({reviewCount.toLocaleString('de-CH')})
        </span>
      )}
    </div>
  );
});
