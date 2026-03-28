/**
 * STICKY MOBILE CTA BAR
 * 
 * Gold Standard mobile CTA:
 * - Left: Savings message
 * - Right: Primary CTA button
 * - Appears after scrolling
 * - Hidden on desktop
 */

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickyMobileCTABarProps {
  ctaText?: string;
  savingsText?: string;
  onCtaClick?: () => void;
  showAfterScroll?: number;
  className?: string;
}

export const StickyMobileCTABar = memo(({
  ctaText = "Gratis Offerten",
  savingsText = "bis zu 40% sparen",
  onCtaClick,
  showAfterScroll = 400,
  className,
}: StickyMobileCTABarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll]);

  const handleClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      // Scroll to hero form
      const heroSection = document.getElementById('offerten');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToPreise = () => {
    const element = document.getElementById('preise');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 md:hidden",
            "bg-card/95 backdrop-blur-md border-t border-border",
            "px-4 py-3 pb-safe",
            className
          )}
        >
          <div className="flex items-center justify-between gap-3">
            {/* Savings message */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30">
                <Percent className="w-4 h-4 text-green-600" />
              </div>
              <span className="font-medium text-foreground">{savingsText}</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={scrollToPreise}
                className="h-10 px-3"
              >
                Preise
              </Button>
              <Button
                size="sm"
                onClick={handleClick}
                className="h-10 px-4 bg-primary hover:bg-primary/90"
              >
                {ctaText}
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

StickyMobileCTABar.displayName = 'StickyMobileCTABar';
