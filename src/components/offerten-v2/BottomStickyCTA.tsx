/**
 * BottomStickyCTA - Mobile sticky CTA bar
 * 
 * OPTIMIZATIONS:
 * 69. Enhanced glass morphism
 * 70. Animated progress indicator
 * 71. Pulse animation on CTA
 * 72. Better safe area handling
 * 73. Savings indicator
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Calculator, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BottomStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isNearForm, setIsNearForm] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 500;
      setIsVisible(scrolled);
      
      const nearTop = window.scrollY < 800;
      setIsNearForm(nearTop);
      
      // Calculate scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const progress = (window.scrollY / documentHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
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
          {/* Progress bar at top */}
          <div className="h-0.5 bg-muted">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/60"
              initial={{ width: 0 }}
              animate={{ width: `${scrollProgress}%` }}
            />
          </div>
          
          <div className="bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <motion.div 
                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Calculator className="w-4.5 h-4.5 text-primary" />
                  </motion.div>
                  <div className="truncate">
                    <span className="block text-sm">Umzug berechnen</span>
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <TrendingUp className="w-3 h-3" />
                      Bis 40% sparen
                    </span>
                  </div>
                </div>
              </div>
              
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                {/* Pulsing glow */}
                <motion.div
                  className="absolute inset-0 bg-primary rounded-lg blur-md"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <Button
                  onClick={scrollToTop}
                  className="relative bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 h-11 px-5"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Zum Rechner
                  <ArrowUp className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
