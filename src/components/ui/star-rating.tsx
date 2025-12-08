import { cn } from "@/lib/utils";
import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

/**
 * Star rating display component
 */
export const StarRating = ({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  className
}: StarRatingProps) => {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center" aria-label={`${rating} von ${maxRating} Sternen`}>
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(sizes[size], "fill-swiss-gold text-swiss-gold")}
            aria-hidden="true"
          />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={cn(sizes[size], "text-muted-foreground/30")} aria-hidden="true" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={cn(sizes[size], "fill-swiss-gold text-swiss-gold")} aria-hidden="true" />
            </div>
          </div>
        )}
        
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(sizes[size], "text-muted-foreground/30")}
            aria-hidden="true"
          />
        ))}
      </div>
      
      {showValue && (
        <span className="text-sm font-medium text-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
