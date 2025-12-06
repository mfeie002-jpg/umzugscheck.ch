import { memo } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5"
};

const textSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base"
};

export const StarRating = memo(({ 
  rating, 
  maxRating = 5,
  size = 'md',
  showValue = true,
  className = ""
}: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex" aria-label={`${rating} von ${maxRating} Sternen`}>
        {[...Array(maxRating)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              i < fullStars 
                ? "fill-swiss-gold text-swiss-gold" 
                : i === fullStars && hasHalfStar
                  ? "fill-swiss-gold/50 text-swiss-gold"
                  : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className={cn("font-semibold text-foreground", textSizes[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
});

StarRating.displayName = 'StarRating';
