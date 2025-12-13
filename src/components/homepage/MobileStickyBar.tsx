import { useState, useEffect, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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
          <div className="absolute inset-x-0 -top-4 h-4 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          
          {/* Simplified single CTA bar (#10) */}
          <div className="bg-background/98 backdrop-blur-xl border-t border-border/50 shadow-2xl px-4 py-3 pb-safe">
            <Link to="/umzugsofferten" className="block">
              <Button 
                className="w-full h-12 text-sm font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-[0_4px_20px_rgba(220,38,38,0.3)] rounded-xl gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Kostenlos Offerten erhalten</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                Kostenlos
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                Unverbindlich
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                In 2 Min.
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

MobileStickyBar.displayName = 'MobileStickyBar';

export default MobileStickyBar;
