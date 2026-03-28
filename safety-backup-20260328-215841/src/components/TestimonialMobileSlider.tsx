import { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  date?: string;
}

interface TestimonialMobileSliderProps {
  testimonials: Testimonial[];
}

export default function TestimonialMobileSlider({ testimonials }: TestimonialMobileSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold && currentIndex < testimonials.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    } else if (info.offset.x > threshold && currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="cursor-grab active:cursor-grabbing"
          >
            <Card className="p-6 sm:p-8">
              {/* Quote icon */}
              <Quote className="h-8 w-8 text-alpine/20 mb-4" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < currentTestimonial.rating
                        ? 'text-warm fill-warm'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed">
                "{currentTestimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{currentTestimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{currentTestimonial.location}</p>
                </div>
                {currentTestimonial.date && (
                  <span className="text-xs text-muted-foreground">{currentTestimonial.date}</span>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => currentIndex > 0 && goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-muted disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => currentIndex < testimonials.length - 1 && goTo(currentIndex + 1)}
          disabled={currentIndex === testimonials.length - 1}
          className="p-2 rounded-full bg-muted disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Swipe hint */}
      <p className="text-center text-xs text-muted-foreground mt-3 md:hidden">
        Wischen zum Blättern
      </p>
    </div>
  );
}