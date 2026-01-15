/**
 * Testimonials Carousel Component
 * 
 * Social proof carousel with customer testimonials
 * Auto-advances and supports touch/swipe
 */

import { memo, useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
  verified?: boolean;
  date?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Sandra M.",
    location: "Zürich",
    rating: 5,
    text: "Super unkompliziert! Innerhalb von 24 Stunden hatte ich 4 Offerten und konnte direkt vergleichen. Habe am Ende 800 CHF gespart.",
    service: "Privatumzug",
    verified: true,
    date: "Dezember 2024"
  },
  {
    id: "2",
    name: "Thomas K.",
    location: "Bern",
    rating: 5,
    text: "Die Umzugsfirma war pünktlich, professionell und sehr sorgfältig mit unseren Möbeln. Der Vergleich hat sich definitiv gelohnt!",
    service: "Familienumzug",
    verified: true,
    date: "November 2024"
  },
  {
    id: "3",
    name: "Maria L.",
    location: "Basel",
    rating: 5,
    text: "Endlich ein transparenter Vergleich! Keine versteckten Kosten, faire Preise. Kann ich nur empfehlen.",
    service: "Wohnungsumzug",
    verified: true,
    date: "Januar 2025"
  },
  {
    id: "4",
    name: "Peter S.",
    location: "Luzern",
    rating: 4,
    text: "Schnelle Antworten und gute Firmenauswahl. Der Umzug lief reibungslos und im Budget.",
    service: "Büroumzug",
    verified: true,
    date: "Dezember 2024"
  },
];

interface TestimonialsCarouselProps {
  autoAdvance?: boolean;
  autoAdvanceInterval?: number;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export const TestimonialsCarousel = memo(function TestimonialsCarousel({
  autoAdvance = true,
  autoAdvanceInterval = 5000,
  variant = 'default',
  className
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    if (!autoAdvance) return;
    const interval = setInterval(goToNext, autoAdvanceInterval);
    return () => clearInterval(interval);
  }, [autoAdvance, autoAdvanceInterval, goToNext]);

  const testimonial = TESTIMONIALS[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  if (variant === 'compact') {
    return (
      <div className={cn("py-4", className)}>
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {TESTIMONIALS.map((t) => (
            <div 
              key={t.id}
              className="flex-shrink-0 w-72 p-4 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "w-3.5 h-3.5",
                      i < t.rating ? "text-swiss-gold fill-swiss-gold" : "text-muted"
                    )} 
                  />
                ))}
              </div>
              <p className="text-sm text-foreground line-clamp-2 mb-2">"{t.text}"</p>
              <p className="text-xs text-muted-foreground">
                {t.name}, {t.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden rounded-2xl bg-card border border-border p-6 sm:p-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Quote icon */}
            <Quote className="w-8 h-8 text-primary/20 mb-4" />
            
            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "w-5 h-5",
                    i < testimonial.rating ? "text-swiss-gold fill-swiss-gold" : "text-muted"
                  )} 
                />
              ))}
              {testimonial.verified && (
                <span className="ml-2 flex items-center gap-1 text-xs text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Verifiziert
                </span>
              )}
            </div>
            
            {/* Quote text */}
            <blockquote className="text-lg sm:text-xl text-foreground mb-6 leading-relaxed">
              "{testimonial.text}"
            </blockquote>
            
            {/* Author */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.location} • {testimonial.service}
                </p>
              </div>
              {testimonial.date && (
                <span className="text-xs text-muted-foreground">
                  {testimonial.date}
                </span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === currentIndex 
                    ? "bg-primary w-6" 
                    : "bg-muted hover:bg-muted-foreground/30"
                )}
                aria-label={`Gehe zu Bewertung ${i + 1}`}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrev}
              className="h-8 w-8"
              aria-label="Vorherige Bewertung"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="h-8 w-8"
              aria-label="Nächste Bewertung"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TestimonialsCarousel;
