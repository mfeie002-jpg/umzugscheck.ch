/**
 * BottomStickyCTA - Mobile sticky CTA bar
 * 
 * OPTIMIZATIONS:
 * 69. Enhanced glass morphism
 * 70. Animated progress indicator
 * 71. Pulse animation on CTA
 * 72. Better safe area handling
 * 73. Savings indicator
 * 186. Swipe-up gesture hint
 * 187. Haptic feedback visual cue
 * 188. Expandable quick actions
 * 189. Touch-optimized button sizing
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { ArrowUp, Calculator, Sparkles, TrendingUp, Phone, MessageCircle, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BottomStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isNearForm, setIsNearForm] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 186. Swipe gesture handling
  const y = useMotionValue(0);
  const opacity = useTransform(y, [-100, 0], [0, 1]);
  
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
  
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y < -50) {
      setIsExpanded(true);
    } else if (info.offset.y > 50) {
      setIsExpanded(false);
    }
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
          style={{ opacity }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          {/* Progress bar at top */}
          <div className="h-1 bg-muted">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/60"
              initial={{ width: 0 }}
              animate={{ width: `${scrollProgress}%` }}
            />
          </div>
          
          {/* 186. Swipe hint indicator */}
          <div className="flex justify-center -mb-1">
            <motion.div 
              className="w-10 h-1 bg-muted-foreground/30 rounded-full"
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          <div className="bg-card/98 backdrop-blur-xl border-t border-border/50 shadow-[0_-8px_30px_rgba(0,0,0,0.15)]">
            {/* 188. Expandable quick actions */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-border/30 overflow-hidden"
                >
                  <div className="px-4 py-3 grid grid-cols-2 gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 bg-green-50 text-green-700 py-3 rounded-xl font-medium text-sm active:bg-green-100"
                    >
                      <Phone className="w-4 h-4" />
                      Anrufen
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-3 rounded-xl font-medium text-sm active:bg-blue-100"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
              <div className="flex items-center gap-3">
                {/* Toggle expand button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isExpanded ? <X className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </motion.div>
                </motion.button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <motion.div 
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Calculator className="w-5 h-5 text-primary" />
                    </motion.div>
                    <div className="truncate">
                      <span className="block text-sm font-semibold">Umzug berechnen</span>
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <TrendingUp className="w-3 h-3" />
                        Bis 40% sparen
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* 189. Touch-optimized CTA button (min 44px) */}
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  {/* 187. Pulsing glow with haptic visual cue */}
                  <motion.div
                    className="absolute inset-0 bg-primary rounded-xl blur-lg"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  
                  <Button
                    onClick={scrollToTop}
                    className="relative bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 h-12 px-5 min-w-[120px] text-base font-semibold"
                  >
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    Rechner
                    <ArrowUp className="w-4 h-4 ml-1.5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
