import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StickyMobileCTAProps {
  text?: string;
  link?: string;
  subtext?: string;
  showAfter?: number;
}

export const StickyMobileCTA = memo(({ 
  text = "Jetzt Offerten vergleichen", 
  link = "/umzugsofferten",
  subtext = "Kostenlos & unverbindlich",
  showAfter = 250
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
          transition={{ type: "spring", stiffness: 450, damping: 30 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50"
          role="complementary"
          aria-label="Schnellzugriff Offerten"
        >
          {/* Fade gradient */}
          <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" aria-hidden="true" />
          
          <div className="bg-background/98 backdrop-blur-md border-t border-border shadow-xl">
            <div className="container mx-auto px-3 py-2.5 pb-safe">
              <Link to={link} className="block">
                <Button 
                  size="default" 
                  className="w-full h-11 text-sm font-bold bg-secondary text-secondary-foreground shadow-cta hover:bg-secondary/90 active:scale-[0.98] transition-all"
                >
                  <CheckCircle2 className="mr-1.5 w-4 h-4" aria-hidden="true" />
                  {text}
                  <ArrowRight className="ml-1.5 w-4 h-4" aria-hidden="true" />
                </Button>
              </Link>
              <p className="text-center text-[10px] text-muted-foreground mt-1">
                {subtext}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

StickyMobileCTA.displayName = 'StickyMobileCTA';
