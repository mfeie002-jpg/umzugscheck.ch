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
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="md:hidden fixed bottom-[52px] xs:bottom-14 left-0 right-0 z-40"
          role="complementary"
          aria-label="Schnellzugriff"
        >
          <div className="absolute inset-x-0 -top-4 h-4 bg-gradient-to-t from-background to-transparent pointer-events-none" aria-hidden="true" />
          
          <div className="bg-background/98 backdrop-blur-lg border-t border-border/50 shadow-md">
            <div className="px-3 py-2 flex items-center gap-2">
              <Link to={link} className="flex-1">
                <Button 
                  className="w-full h-10 text-xs sm:text-sm font-bold bg-secondary text-secondary-foreground shadow-cta active:scale-[0.98] transition-transform rounded-lg"
                >
                  <CheckCircle2 className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" />
                  {text}
                  <ArrowRight className="ml-1.5 w-3.5 h-3.5" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/umzugsrechner">
                <Button variant="outline" size="icon" className="h-10 w-10 border-primary/30 active:scale-[0.95] transition-transform rounded-lg">
                  <Sparkles className="h-4 w-4 text-primary" />
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
