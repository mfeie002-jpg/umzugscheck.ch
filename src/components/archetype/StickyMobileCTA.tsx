/**
 * STICKY MOBILE CTA
 * 
 * Fixed bottom bar on mobile with Offerten and Preise buttons
 */

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickyMobileCTAProps {
  placeName: string;
  placeKind: 'canton' | 'city';
}

export const StickyMobileCTA = memo(({ placeName, placeKind }: StickyMobileCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (400px)
      setIsVisible(window.scrollY > 400);
      
      // Hide when near bottom (to avoid covering footer)
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = window.scrollY;
      setIsAtBottom(scrollTop + clientHeight > scrollHeight - 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById('offerten');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPreise = () => {
    const el = document.getElementById('preise');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && !isAtBottom && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 md:hidden",
            "bg-card/95 backdrop-blur-lg border-t border-border shadow-lg",
            "safe-area-pb"
          )}
        >
          <div className="flex items-center gap-3 p-3">
            {/* Savings Text */}
            <div className="flex items-center gap-1.5 text-green-600 shrink-0">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-medium">bis 40% sparen</span>
            </div>

            {/* Buttons */}
            <div className="flex-1 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={scrollToPreise}
                className="flex-1 h-10"
              >
                Preise
              </Button>
              <Button
                size="sm"
                onClick={scrollToForm}
                className="flex-1 h-10"
              >
                Offerten
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

StickyMobileCTA.displayName = 'StickyMobileCTA';
