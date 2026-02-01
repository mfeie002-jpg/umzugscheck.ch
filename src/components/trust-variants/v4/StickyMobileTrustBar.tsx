/**
 * StickyMobileTrustBar - Erscheint bei scrollY > 500
 * V4 Best-Of: Persistent Trust Signal auf Mobile
 */

import { memo, useState, useEffect } from "react";
import { Shield, Star, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { TRUST } from "@/content/trust";

interface StickyMobileTrustBarProps {
  ctaText?: string;
  ctaUrl?: string;
  showAfterScroll?: number;
}

export const StickyMobileTrustBar = memo(({ 
  ctaText = "Offerten erhalten",
  ctaUrl = "/umzugsofferten",
  showAfterScroll = 500
}: StickyMobileTrustBarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll]);

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
        >
          <div className="bg-background/95 backdrop-blur-lg border-t border-border shadow-2xl">
            {/* Trust Mini-Bar */}
            <div className="flex items-center justify-center gap-4 py-1.5 px-4 border-b border-border/50 bg-muted/50">
              <div className="flex items-center gap-1 text-xs">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span className="text-muted-foreground">Geprüft</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="font-medium">{TRUST.ratingValue}</span>
                <span className="text-muted-foreground">/ 5</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {TRUST.movesCount} Umzüge
              </span>
            </div>

            {/* CTA Row */}
            <div className="p-3">
              <Link to={ctaUrl} className="block">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary text-primary-foreground py-3.5 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  {ctaText}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

StickyMobileTrustBar.displayName = "StickyMobileTrustBar";
