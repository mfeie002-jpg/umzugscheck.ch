import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating?: number;
  maxRating?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function RatingStars({
  rating = 0,
  maxRating = 5,
  onChange,
  readonly = false,
  size = 'md',
  className = '',
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const handleClick = (value: number) => {
    if (!readonly && onChange) {
      onChange(value);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const value = index + 1;
        const isFilled = value <= (hoverRating || rating);

        return (
          <motion.button
            key={index}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => !readonly && setHoverRating(value)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            whileHover={readonly ? {} : { scale: 1.2 }}
            whileTap={readonly ? {} : { scale: 0.9 }}
            disabled={readonly}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer'} focus:outline-none`}
          >
            <Star
              className={`${sizes[size]} transition-colors ${
                isFilled 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'fill-transparent text-muted-foreground/30'
              }`}
            />
          </motion.button>
        );
      })}
      {rating > 0 && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
