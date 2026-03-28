import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StickyMobileCTAProps {
  text?: string;
  link?: string;
  showAfter?: number;
}

export const StickyMobileCTA = memo(({ 
  text = "Offerten vergleichen", 
  link = "/umzugsofferten",
  showAfter = 200
}: StickyMobileCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setIsVisible(window.scrollY > showAfter);
  }, [showAfter]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
          role="complementary"
          aria-label="Schnellzugriff"
        >
          {/* Gradient fade */}
          <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" aria-hidden="true" />
          
          <div className="bg-white border-t border-slate-200 shadow-2xl">
            <div className="px-4 py-3">
              <Link to={link} className="block">
                <Button 
                  className="w-full h-12 text-sm font-bold bg-primary hover:bg-primary/90 text-white shadow-lg active:scale-[0.98] transition-transform rounded-xl"
                >
                  <CheckCircle2 className="mr-2 w-4 h-4" aria-hidden="true" />
                  {text}
                  <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

StickyMobileCTA.displayName = 'StickyMobileCTA';
