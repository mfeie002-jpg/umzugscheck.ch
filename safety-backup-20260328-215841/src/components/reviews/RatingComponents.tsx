/**
 * Rating & Review Components
 * 
 * Features:
 * - Star ratings with half-star support
 * - Review cards
 * - Rating distribution chart
 * - Review submission form
 */

import { memo, useState } from 'react';
import { Star, ThumbsUp, Flag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

/**
 * Star Rating Display/Input
 */
export const StarRating = memo(function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const displayRating = hoverRating ?? rating;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const fillPercentage = Math.min(Math.max(displayRating - index, 0), 1) * 100;
        
        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(index + 1)}
            onMouseEnter={() => interactive && setHoverRating(index + 1)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            className={cn(
              'relative transition-transform',
              interactive && 'hover:scale-110 cursor-pointer'
            )}
            aria-label={`${index + 1} von ${maxRating} Sternen`}
          >
            {/* Background star */}
            <Star className={cn(sizes[size], 'text-muted stroke-muted-foreground/30')} />
            
            {/* Filled star overlay */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star className={cn(sizes[size], 'text-yellow-400 fill-yellow-400')} />
            </div>
          </button>
        );
      })}
      
      {showValue && (
        <span className="ml-1 text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
});

interface ReviewCardProps {
  author: string;
  rating: number;
  date: string;
  content: string;
  helpful?: number;
  verified?: boolean;
  onHelpful?: () => void;
  onReport?: () => void;
}

/**
 * Review Card Component
 */
export const ReviewCard = memo(function ReviewCard({
  author,
  rating,
  date,
  content,
  helpful = 0,
  verified = false,
  onHelpful,
  onReport,
}: ReviewCardProps) {
  return (
    <article className="bg-card border border-border rounded-lg p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{author}</span>
              {verified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Verifiziert
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating rating={rating} size="sm" />
              <span className="text-xs text-muted-foreground">{date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="text-foreground leading-relaxed">{content}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
        <button
          onClick={onHelpful}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
          Hilfreich {helpful > 0 && `(${helpful})`}
        </button>
        <button
          onClick={onReport}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Flag className="w-4 h-4" />
          Melden
        </button>
      </div>
    </article>
  );
});

interface RatingDistributionProps {
  distribution: { stars: number; count: number }[];
  total: number;
}

/**
 * Rating Distribution Chart
 */
export const RatingDistribution = memo(function RatingDistribution({
  distribution,
  total,
}: RatingDistributionProps) {
  return (
    <div className="space-y-2">
      {distribution.map(({ stars, count }) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        
        return (
          <div key={stars} className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-12">
              {stars} ★
            </span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground w-12 text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
});

interface ReviewFormProps {
  onSubmit: (data: { rating: number; content: string }) => void;
  isLoading?: boolean;
}

/**
 * Review Submission Form
 */
export function ReviewForm({ onSubmit, isLoading }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && content.trim()) {
      onSubmit({ rating, content: content.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Ihre Bewertung
        </label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onChange={setRating}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Ihre Erfahrung
        </label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Teilen Sie Ihre Erfahrung mit dieser Umzugsfirma..."
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Mindestens 20 Zeichen ({content.length}/20)
        </p>
      </div>

      <Button
        type="submit"
        disabled={rating === 0 || content.length < 20 || isLoading}
        className="w-full"
      >
        {isLoading ? 'Wird gesendet...' : 'Bewertung abgeben'}
      </Button>
    </form>
  );
}

/**
 * Average Rating Summary
 */
export const RatingSummary = memo(function RatingSummary({
  average,
  total,
  distribution,
}: {
  average: number;
  total: number;
  distribution: { stars: number; count: number }[];
}) {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-card border border-border rounded-xl">
      {/* Average Score */}
      <div className="text-center md:text-left">
        <div className="text-5xl font-bold text-foreground">{average.toFixed(1)}</div>
        <StarRating rating={average} size="md" className="justify-center md:justify-start mt-2" />
        <p className="text-sm text-muted-foreground mt-1">
          {total} Bewertungen
        </p>
      </div>

      {/* Distribution */}
      <div className="flex-1">
        <RatingDistribution distribution={distribution} total={total} />
      </div>
    </div>
  );
});
