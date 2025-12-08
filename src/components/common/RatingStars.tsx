import { memo } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  animate?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export const RatingStars = memo(function RatingStars({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  animate = true,
  className
}: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  const starVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: { opacity: 1, scale: 1, rotate: 0 }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <motion.div
            key={`full-${i}`}
            variants={animate ? starVariants : undefined}
            initial={animate ? "hidden" : undefined}
            animate={animate ? "visible" : undefined}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
          >
            <Star className={cn(sizeMap[size], "fill-swiss-gold text-swiss-gold")} />
          </motion.div>
        ))}
        
        {hasHalfStar && (
          <motion.div
            variants={animate ? starVariants : undefined}
            initial={animate ? "hidden" : undefined}
            animate={animate ? "visible" : undefined}
            transition={{ delay: fullStars * 0.1, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <Star className={cn(sizeMap[size], "text-muted-foreground/30")} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={cn(sizeMap[size], "fill-swiss-gold text-swiss-gold")} />
            </div>
          </motion.div>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <motion.div
            key={`empty-${i}`}
            variants={animate ? starVariants : undefined}
            initial={animate ? "hidden" : undefined}
            animate={animate ? "visible" : undefined}
            transition={{ delay: (fullStars + (hasHalfStar ? 1 : 0) + i) * 0.1, type: "spring", stiffness: 200 }}
          >
            <Star className={cn(sizeMap[size], "text-muted-foreground/30")} />
          </motion.div>
        ))}
      </div>
      
      {showValue && (
        <motion.span
          initial={animate ? { opacity: 0 } : undefined}
          animate={animate ? { opacity: 1 } : undefined}
          transition={{ delay: maxRating * 0.1 }}
          className="text-sm font-semibold ml-1"
        >
          {rating.toFixed(1)}
        </motion.span>
      )}
    </div>
  );
});
