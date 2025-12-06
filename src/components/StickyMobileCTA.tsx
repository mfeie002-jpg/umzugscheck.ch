import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StickyMobileCTAProps {
  text?: string;
  link?: string;
  subtext?: string;
}

export const StickyMobileCTA = memo(({ 
  text = "Jetzt Offerten vergleichen", 
  link = "/umzugsofferten",
  subtext = "Kostenlos & unverbindlich"
}: StickyMobileCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling down 300px on mobile
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50"
          role="complementary"
          aria-label="Schnellzugriff"
        >
          {/* Gradient fade */}
          <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" aria-hidden="true" />
          
          <div className="bg-background/98 backdrop-blur-lg border-t border-border shadow-2xl">
            <div className="container mx-auto px-4 py-3 safe-bottom">
              <Link to={link} className="block">
                <Button 
                  size="lg" 
                  className="w-full h-12 text-sm font-bold bg-secondary text-secondary-foreground shadow-cta hover:bg-secondary/90 active:scale-[0.98] transition-transform group"
                >
                  <CheckCircle2 className="mr-2 w-4 h-4" aria-hidden="true" />
                  {text}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Button>
              </Link>
              <p className="text-center text-xs text-muted-foreground mt-1.5">
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
