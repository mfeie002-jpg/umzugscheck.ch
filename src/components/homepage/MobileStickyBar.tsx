import { useState, useEffect, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const MobileStickyBar = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [hideOnScroll, setHideOnScroll] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Show after scrolling past hero (400px)
    if (currentScrollY > 400) {
      setIsVisible(true);
      
      // Hide when scrolling down fast, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 10) {
        setHideOnScroll(true);
      } else if (lastScrollY > currentScrollY && lastScrollY - currentScrollY > 5) {
        setHideOnScroll(false);
      }
    } else {
      setIsVisible(false);
    }
    
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <AnimatePresence>
      {isVisible && !hideOnScroll && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
        >
          {/* Gradient fade effect at top */}
          <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          
          <div className="bg-background/98 backdrop-blur-xl border-t border-border/50 shadow-2xl px-3 py-2.5 pb-safe">
            {/* Two-button layout for better conversion */}
            <div className="flex gap-2">
              {/* Primary CTA - 48px min touch target */}
              <Link to="/umzugsofferten" className="flex-1">
                <Button 
                  className="w-full h-14 text-base font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta rounded-xl gap-2 active:scale-[0.98] transition-transform touch-manipulation"
                  style={{ minHeight: '56px' }} // Explicit 56px for accessibility
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Offerten vergleichen</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              
              {/* Secondary: Call button - 48px touch target */}
              <a 
                href="tel:+41780980000" 
                className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 text-primary active:scale-[0.98] transition-transform touch-manipulation"
                style={{ minWidth: '56px', minHeight: '56px' }}
                aria-label="Anrufen"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
            
            {/* Minimal trust line */}
            <p className="text-center text-[10px] text-muted-foreground mt-1.5">
              Kostenlos • Unverbindlich • In 2 Minuten
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

MobileStickyBar.displayName = 'MobileStickyBar';

export default MobileStickyBar;
