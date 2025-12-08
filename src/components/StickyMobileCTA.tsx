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
          className="md:hidden fixed bottom-0 left-0 right-0 z-50"
          role="complementary"
          aria-label="Schnellzugriff"
        >
          <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" aria-hidden="true" />
          
          <div className="bg-background/98 backdrop-blur-lg border-t border-border/50 shadow-lg">
            <div className="px-4 py-3 pb-safe flex items-center gap-3">
              <Link to={link} className="flex-1">
                <Button 
                  className="w-full h-12 text-sm font-bold bg-primary text-primary-foreground shadow-cta active:scale-[0.98] transition-transform"
                >
                  <CheckCircle2 className="mr-2 w-4 h-4" aria-hidden="true" />
                  {text}
                  <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/umzugsrechner">
                <Button variant="outline" size="icon" className="h-12 w-12 border-primary/30 active:scale-[0.95] transition-transform">
                  <Sparkles className="h-5 w-5 text-primary" />
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
