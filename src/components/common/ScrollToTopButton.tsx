import { memo, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScrollToTopButtonProps {
  threshold?: number;
  className?: string;
}

export const ScrollToTopButton = memo(({
  threshold = 400,
  className
}: ScrollToTopButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setIsVisible(window.scrollY > threshold);
  }, [threshold]);

  useEffect(() => {
    let ticking = false;
    
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className={cn("fixed bottom-20 right-4 z-40", className)}
        >
          <Button
            size="icon"
            variant="outline"
            onClick={scrollToTop}
            className="h-10 w-10 rounded-full shadow-medium bg-card hover:bg-primary hover:text-primary-foreground transition-all"
            aria-label="Nach oben scrollen"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

ScrollToTopButton.displayName = 'ScrollToTopButton';
