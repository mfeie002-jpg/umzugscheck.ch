/**
 * Video Testimonials Component
 * Displays customer video testimonials for trust building
 * Supports lazy loading and mobile optimization
 */

import { memo, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Star, Quote, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface VideoTestimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  moveDetails?: {
    from: string;
    to: string;
    rooms: number;
    date: string;
  };
}

// Sample testimonials (in production, fetch from Supabase)
const sampleTestimonials: VideoTestimonial[] = [
  {
    id: '1',
    name: 'Sarah M.',
    location: 'Zürich',
    rating: 5,
    quote: 'Der Umzug war perfekt organisiert. Die Firma war pünktlich, professionell und sehr sorgfältig mit unseren Möbeln. Absolut empfehlenswert!',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop',
    moveDetails: {
      from: 'Zürich',
      to: 'Winterthur',
      rooms: 4,
      date: 'März 2024'
    }
  },
  {
    id: '2',
    name: 'Thomas K.',
    location: 'Basel',
    rating: 5,
    quote: 'Innerhalb von 24 Stunden hatte ich 5 Offerten. Der Preisvergleich hat mir über CHF 800 gespart. Sehr einfacher Prozess!',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    moveDetails: {
      from: 'Basel',
      to: 'Bern',
      rooms: 3,
      date: 'Februar 2024'
    }
  },
  {
    id: '3',
    name: 'Lisa B.',
    location: 'Bern',
    rating: 5,
    quote: 'Als alleinerziehende Mutter war ich skeptisch, aber das Team hat alles übernommen. Stress-frei und preiswert!',
    thumbnailUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop',
    moveDetails: {
      from: 'Bern',
      to: 'Thun',
      rooms: 2,
      date: 'Januar 2024'
    }
  }
];

interface VideoTestimonialsProps {
  testimonials?: VideoTestimonial[];
  variant?: 'carousel' | 'grid' | 'featured';
  className?: string;
  maxVisible?: number;
}

export const VideoTestimonials = memo(function VideoTestimonials({
  testimonials = sampleTestimonials,
  variant = 'carousel',
  className,
  maxVisible = 3
}: VideoTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handlePrev = useCallback(() => {
    setActiveIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }, [testimonials.length]);

  const handleNext = useCallback(() => {
    setActiveIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, [testimonials.length]);

  if (variant === 'featured') {
    return (
      <div className={cn('relative', className)}>
        <FeaturedTestimonial 
          testimonial={testimonials[0]} 
          onExpand={() => setExpandedId(testimonials[0].id)}
        />
        
        <AnimatePresence>
          {expandedId && (
            <TestimonialModal
              testimonial={testimonials.find(t => t.id === expandedId)!}
              onClose={() => setExpandedId(null)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
        {testimonials.slice(0, maxVisible).map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            onClick={() => setExpandedId(testimonial.id)}
          />
        ))}
        
        <AnimatePresence>
          {expandedId && (
            <TestimonialModal
              testimonial={testimonials.find(t => t.id === expandedId)!}
              onClose={() => setExpandedId(null)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Carousel variant
  return (
    <div className={cn('relative', className)}>
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `-${activeIndex * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <TestimonialCard
                testimonial={testimonial}
                onClick={() => setExpandedId(testimonial.id)}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          className="rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all',
                index === activeIndex 
                  ? 'bg-primary w-6' 
                  : 'bg-primary/30 hover:bg-primary/50'
              )}
            />
          ))}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <AnimatePresence>
        {expandedId && (
          <TestimonialModal
            testimonial={testimonials.find(t => t.id === expandedId)!}
            onClose={() => setExpandedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

// Individual testimonial card
const TestimonialCard = memo(function TestimonialCard({
  testimonial,
  onClick
}: {
  testimonial: VideoTestimonial;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-card rounded-xl border shadow-sm overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Thumbnail/Video area */}
      <div className="relative aspect-video bg-muted">
        {testimonial.thumbnailUrl ? (
          <img
            src={testimonial.thumbnailUrl}
            alt={testimonial.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Quote className="w-12 h-12 text-primary/40" />
          </div>
        )}
        
        {testimonial.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="w-8 h-8 text-primary ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex gap-0.5 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'w-4 h-4',
                i < testimonial.rating 
                  ? 'text-swiss-gold fill-swiss-gold' 
                  : 'text-muted'
              )}
            />
          ))}
        </div>

        {/* Quote */}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          "{testimonial.quote}"
        </p>

        {/* Author */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">{testimonial.name}</p>
            <p className="text-xs text-muted-foreground">{testimonial.location}</p>
          </div>
          
          {testimonial.moveDetails && (
            <div className="text-right text-xs text-muted-foreground">
              <p>{testimonial.moveDetails.rooms} Zimmer</p>
              <p>{testimonial.moveDetails.date}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// Featured testimonial (larger, more prominent)
const FeaturedTestimonial = memo(function FeaturedTestimonial({
  testimonial,
  onExpand
}: {
  testimonial: VideoTestimonial;
  onExpand: () => void;
}) {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Image/Video */}
        <div 
          className="relative w-full md:w-1/3 aspect-square rounded-xl overflow-hidden cursor-pointer"
          onClick={onExpand}
        >
          {testimonial.thumbnailUrl ? (
            <img
              src={testimonial.thumbnailUrl}
              alt={testimonial.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <Quote className="w-16 h-16 text-primary/30" />
            </div>
          )}
          
          {testimonial.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                <Play className="w-10 h-10 text-primary ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-6 h-6',
                  i < testimonial.rating 
                    ? 'text-swiss-gold fill-swiss-gold' 
                    : 'text-muted'
                )}
              />
            ))}
          </div>

          <blockquote className="text-xl md:text-2xl font-medium text-foreground mb-6">
            "{testimonial.quote}"
          </blockquote>

          <div className="flex items-center gap-4">
            <div>
              <p className="font-semibold text-lg">{testimonial.name}</p>
              <p className="text-muted-foreground">{testimonial.location}</p>
            </div>
            
            {testimonial.moveDetails && (
              <div className="ml-auto text-right text-sm text-muted-foreground">
                <p>{testimonial.moveDetails.from} → {testimonial.moveDetails.to}</p>
                <p>{testimonial.moveDetails.rooms} Zimmer • {testimonial.moveDetails.date}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// Modal for expanded view with video
const TestimonialModal = memo(function TestimonialModal({
  testimonial,
  onClose
}: {
  testimonial: VideoTestimonial;
  onClose: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video/Image area */}
        <div className="relative aspect-video bg-black">
          {testimonial.videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={testimonial.videoUrl}
                poster={testimonial.thumbnailUrl}
                className="w-full h-full object-cover"
                muted={isMuted}
                onEnded={() => setIsPlaying(false)}
              />
              
              {/* Video controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-foreground" />
                  ) : (
                    <Play className="w-6 h-6 text-foreground ml-1" />
                  )}
                </button>
                
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-foreground" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-foreground" />
                  )}
                </button>
              </div>
            </>
          ) : (
            <img
              src={testimonial.thumbnailUrl}
              alt={testimonial.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-5 h-5',
                  i < testimonial.rating 
                    ? 'text-swiss-gold fill-swiss-gold' 
                    : 'text-muted'
                )}
              />
            ))}
          </div>

          <blockquote className="text-lg text-foreground mb-6">
            "{testimonial.quote}"
          </blockquote>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-sm text-muted-foreground">{testimonial.location}</p>
            </div>
            
            {testimonial.moveDetails && (
              <div className="text-right text-sm">
                <p className="text-foreground">
                  {testimonial.moveDetails.from} → {testimonial.moveDetails.to}
                </p>
                <p className="text-muted-foreground">
                  {testimonial.moveDetails.rooms} Zimmer • {testimonial.moveDetails.date}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default VideoTestimonials;
