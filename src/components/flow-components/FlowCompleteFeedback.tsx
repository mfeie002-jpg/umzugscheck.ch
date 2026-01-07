/**
 * FlowCompleteFeedback - Universal Feedback Component after Flow Completion
 * 
 * Features:
 * - 5-Star Rating
 * - Quick Feedback Tags (UX, Speed, Clarity, Trust)
 * - Optional Comment
 * - LocalStorage persistence for FlowTester analytics
 * - Animated & Mobile-friendly
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  Send,
  CheckCircle2,
  Sparkles,
  ThumbsUp,
  Zap,
  Eye,
  Shield,
  MessageSquare,
  ArrowRight,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STORAGE_KEY = 'umzugscheck-flow-ratings';

export interface FlowRating {
  flowId: string;
  stars: number;
  tags: string[];
  comment?: string;
  timestamp: string;
  userAgent?: string;
}

interface FlowCompleteFeedbackProps {
  flowId: string;
  flowLabel?: string;
  onComplete?: () => void;
  onSkip?: () => void;
  showHomeButton?: boolean;
  className?: string;
}

const FEEDBACK_TAGS = [
  { id: 'fast', label: 'Schnell ⚡', icon: Zap },
  { id: 'easy', label: 'Einfach 👍', icon: ThumbsUp },
  { id: 'clear', label: 'Klar 👁️', icon: Eye },
  { id: 'trustworthy', label: 'Vertrauenswürdig 🛡️', icon: Shield },
];

// Load ratings from localStorage
export function loadFlowRatings(): FlowRating[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Save rating to localStorage
function saveRating(rating: FlowRating): void {
  const ratings = loadFlowRatings();
  // Update existing or add new
  const existingIndex = ratings.findIndex(
    r => r.flowId === rating.flowId && 
    new Date(r.timestamp).toDateString() === new Date(rating.timestamp).toDateString()
  );
  if (existingIndex >= 0) {
    ratings[existingIndex] = rating;
  } else {
    ratings.push(rating);
  }
  // Keep last 100 ratings
  const trimmed = ratings.slice(-100);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

// Get average rating for a flow
export function getFlowAverageRating(flowId: string): { avg: number; count: number } | null {
  const ratings = loadFlowRatings().filter(r => r.flowId === flowId);
  if (ratings.length === 0) return null;
  const avg = ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length;
  return { avg: Math.round(avg * 10) / 10, count: ratings.length };
}

export const FlowCompleteFeedback: React.FC<FlowCompleteFeedbackProps> = ({
  flowId,
  flowLabel,
  onComplete,
  onSkip,
  showHomeButton = true,
  className,
}) => {
  const [stars, setStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = () => {
    if (stars === 0) {
      toast.error('Bitte geben Sie eine Sternebewertung ab');
      return;
    }

    const rating: FlowRating = {
      flowId,
      stars,
      tags: selectedTags,
      comment: comment.trim() || undefined,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    saveRating(rating);
    setIsSubmitted(true);
    toast.success('Danke für Ihr Feedback!');
    
    // Trigger event for FlowTester to pick up
    window.dispatchEvent(new CustomEvent('flow-rating-submitted', { detail: rating }));
    
    setTimeout(() => {
      onComplete?.();
    }, 1500);
  };

  const handleSkip = () => {
    onSkip?.();
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn('text-center py-6', className)}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center"
        >
          <CheckCircle2 className="h-8 w-8 text-success" />
        </motion.div>
        <h3 className="text-lg font-semibold mb-2">Danke für Ihr Feedback!</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Ihre Bewertung hilft uns, den Service zu verbessern.
        </p>
        {showHomeButton && (
          <Button onClick={() => window.location.href = '/'} variant="outline">
            <Home className="h-4 w-4 mr-2" />
            Zur Startseite
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('', className)}
    >
      <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-background overflow-hidden">
        <CardContent className="pt-6 pb-4">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Wie war Ihre Erfahrung?</h3>
            {flowLabel && (
              <p className="text-xs text-muted-foreground mt-1">
                Flow: {flowLabel}
              </p>
            )}
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-5">
            {[1, 2, 3, 4, 5].map(n => (
              <motion.button
                key={n}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStars(n)}
                onMouseEnter={() => setHoveredStar(n)}
                onMouseLeave={() => setHoveredStar(0)}
                className="p-1 focus:outline-none focus:ring-2 focus:ring-primary rounded-full transition-colors"
                aria-label={`${n} Sterne`}
              >
                <Star
                  className={cn(
                    'h-10 w-10 transition-all',
                    (hoveredStar >= n || stars >= n)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-muted-foreground/30'
                  )}
                />
              </motion.button>
            ))}
          </div>

          {/* Star Label */}
          <AnimatePresence mode="wait">
            {stars > 0 && (
              <motion.p
                key={stars}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-center text-sm font-medium mb-4"
              >
                {stars === 1 && '😔 Schlecht'}
                {stars === 2 && '😕 Nicht gut'}
                {stars === 3 && '😐 Okay'}
                {stars === 4 && '🙂 Gut'}
                {stars === 5 && '🤩 Ausgezeichnet!'}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Quick Tags */}
          <AnimatePresence>
            {stars > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <p className="text-xs text-muted-foreground text-center mb-2">
                  Was hat Ihnen gefallen? (optional)
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {FEEDBACK_TAGS.map(tag => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                      className={cn(
                        'cursor-pointer transition-all py-1.5 px-3',
                        selectedTags.includes(tag.id) && 'bg-primary'
                      )}
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.label}
                    </Badge>
                  ))}
                </div>

                {/* Comment Toggle */}
                <div className="text-center mt-3">
                  {!showCommentInput ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCommentInput(true)}
                      className="text-xs"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Kommentar hinzufügen
                    </Button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2"
                    >
                      <Textarea
                        placeholder="Was können wir verbessern?"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        rows={2}
                        className="text-sm"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              onClick={handleSubmit}
              disabled={stars === 0}
              className="flex-1 gap-2"
            >
              <Send className="h-4 w-4" />
              Bewertung absenden
            </Button>
            {showHomeButton && (
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex-1 gap-2"
              >
                Überspringen
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Flow ID for debugging */}
      <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
        Flow: {flowId}
      </p>
    </motion.div>
  );
};

export default FlowCompleteFeedback;
