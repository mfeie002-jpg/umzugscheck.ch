import { useState, useEffect, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calculator, CheckCircle2, Phone } from "lucide-react";
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
          <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
          
          {/* Main bar container */}
          <div className="bg-background/98 backdrop-blur-xl border-t border-border/50 shadow-2xl px-3 py-2.5 pb-safe">
            <div className="flex items-center gap-2">
              {/* Primary CTA Button */}
              <Link to="/umzugsofferten" className="flex-1">
                <Button 
                  className="w-full h-12 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-xl gap-2 active:scale-[0.98] transition-all touch-manipulation"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Offerten erhalten</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              
              {/* Calculator Quick Access */}
              <Link to="/umzugsrechner">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12 rounded-xl border-primary/30 hover:bg-primary/10 active:scale-[0.95] transition-all touch-manipulation"
                >
                  <Calculator className="h-5 w-5 text-primary" />
                </Button>
              </Link>
              
              {/* Phone Quick Access */}
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-xl border-accent/30 hover:bg-accent/10 active:scale-[0.95] transition-all touch-manipulation"
                onClick={() => window.location.href = 'tel:+41445678900'}
              >
                <Phone className="h-5 w-5 text-accent" />
              </Button>
            </div>
            
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
