import { memo } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  /** Rating value (e.g., 4.5) */
  rating: number;
  /** Maximum rating (default: 5) */
  maxRating?: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show numeric rating value */
  showValue?: boolean;
  /** Show review count */
  reviewCount?: number;
  /** Enable star animation on mount */
  animate?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const sizeConfig = {
  sm: { star: "w-3.5 h-3.5", text: "text-xs", gap: "gap-0.5" },
  md: { star: "w-4 h-4", text: "text-sm", gap: "gap-0.5" },
  lg: { star: "w-5 h-5", text: "text-base", gap: "gap-1" },
};

/**
 * Canonical star rating display component.
 * Consolidates: RatingStars, StarRating
 * 
 * @example
 * <RatingStars rating={4.5} />
 * <RatingStars rating={4.8} showValue reviewCount={123} />
 */
export const RatingStars = memo(function RatingStars({
  rating,
  maxRating = 5,
  size = "md",
  showValue = true,
  reviewCount,
  animate = false,
  className,
}: RatingStarsProps) {
  const config = sizeConfig[size];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  const starVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: { opacity: 1, scale: 1, rotate: 0 },
  };

  const Wrapper = animate ? motion.div : "div";
  const wrapperProps = animate
    ? {
        variants: starVariants,
        initial: "hidden",
        animate: "visible",
      }
    : {};

  return (
    <div 
      className={cn("flex items-center", config.gap, className)}
      aria-label={`${rating} von ${maxRating} Sternen`}
    >
      <div className={cn("flex", config.gap)}>
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Wrapper
            key={`full-${i}`}
            {...(animate ? { ...wrapperProps, transition: { delay: i * 0.1, type: "spring", stiffness: 200 } } : {})}
          >
            <Star 
              className={cn(config.star, "fill-swiss-gold text-swiss-gold")} 
              aria-hidden="true"
            />
          </Wrapper>
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <Wrapper
            {...(animate ? { ...wrapperProps, transition: { delay: fullStars * 0.1, type: "spring", stiffness: 200 } } : {})}
            className="relative"
          >
            <Star className={cn(config.star, "text-muted-foreground/30")} aria-hidden="true" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={cn(config.star, "fill-swiss-gold text-swiss-gold")} aria-hidden="true" />
            </div>
          </Wrapper>
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Wrapper
            key={`empty-${i}`}
            {...(animate ? { ...wrapperProps, transition: { delay: (fullStars + (hasHalfStar ? 1 : 0) + i) * 0.1, type: "spring", stiffness: 200 } } : {})}
          >
            <Star className={cn(config.star, "text-muted-foreground/30")} aria-hidden="true" />
          </Wrapper>
        ))}
      </div>

      {showValue && (
        <span className={cn("font-semibold ml-1", config.text)}>
          {rating.toFixed(1)}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className={cn("text-muted-foreground ml-1", config.text)}>
          ({reviewCount.toLocaleString("de-CH")})
        </span>
      )}
    </div>
  );
});

// Re-export for backwards compatibility
export { RatingStars as StarRating };
