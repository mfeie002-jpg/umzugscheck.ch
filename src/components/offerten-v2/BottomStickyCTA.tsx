/**
 * BottomStickyCTA - Mobile sticky CTA bar
 * Shows on small screens, doesn't obscure form fields
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Calculator } from "lucide-react";
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
          <div className="bg-card/95 backdrop-blur-md border-t border-border shadow-2xl px-4 py-3 safe-area-pb">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <Calculator className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="truncate">Umzug jetzt berechnen</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  Kostenlose Offerten erhalten
                </p>
              </div>
              <Button
                onClick={scrollToTop}
                className="bg-primary hover:bg-primary/90 flex-shrink-0"
                size="sm"
              >
                Zum Rechner
                <ArrowUp className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
