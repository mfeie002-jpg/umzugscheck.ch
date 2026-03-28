import { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CarouselItem {
  id: string | number;
  content: React.ReactNode;
}

interface MiniCarouselProps {
  items: CarouselItem[];
  className?: string;
  autoPlay?: boolean;
  interval?: number;
}

export const MiniCarousel = memo(({ 
  items, 
  className = "",
  autoPlay = false,
  interval = 4000
}: MiniCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Auto-play effect
  useState(() => {
    if (!autoPlay) return;
    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  });

  if (items.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden rounded-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {items[currentIndex].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {items.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm shadow-soft"
            aria-label="Vorherige"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm shadow-soft"
            aria-label="Nächste"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="flex justify-center gap-1.5 mt-3">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentIndex 
                    ? "bg-primary w-4" 
                    : "bg-border hover:bg-muted-foreground/50"
                )}
                aria-label={`Zu Slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
});

MiniCarousel.displayName = 'MiniCarousel';
