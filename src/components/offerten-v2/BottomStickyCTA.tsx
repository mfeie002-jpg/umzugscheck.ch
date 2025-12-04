/**
 * BottomStickyCTA - Mobile sticky CTA bar
 * Shows on small screens, doesn't obscure form fields
 * 
 * OPTIMIZED:
 * - Better glass morphism effect
 * - Improved animation
 * - Enhanced button styling
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Calculator, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BottomStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isNearForm, setIsNearForm] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down 500px
      const scrolled = window.scrollY > 500;
      setIsVisible(scrolled);
      
      // Hide when near the top (where the form is)
      const nearTop = window.scrollY < 800;
      setIsNearForm(nearTop);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // Only show on mobile/tablet
  const shouldShow = isVisible && !isNearForm;
  
  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-primary" />
                  </div>
                  <span className="truncate">Umzug berechnen</span>
                </div>
              </div>
              <Button
                onClick={scrollToTop}
                className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 px-5"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Zum Rechner
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
