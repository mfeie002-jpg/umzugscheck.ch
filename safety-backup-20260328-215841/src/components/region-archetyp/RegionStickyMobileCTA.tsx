/**
 * GOLD STANDARD - Sticky Mobile CTA Bar
 * Always visible "Offerten" + "Preise" buttons on mobile
 * ChatGPT recommendation: Friction reducer for conversion
 */

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calculator, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface RegionStickyMobileCTAProps {
  regionName: string;
  variant?: 'canton' | 'city';
  showAfterScroll?: number;
}

export const RegionStickyMobileCTA = memo(({ 
  regionName, 
  variant = 'canton',
  showAfterScroll = 400 
}: RegionStickyMobileCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfterScroll]);

  const locationPrefix = variant === 'canton' ? 'im Kanton' : 'in';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          {/* Gradient backdrop */}
          <div className="bg-gradient-to-t from-background via-background to-transparent h-8" />
          
          <div className="bg-background border-t border-border shadow-2xl px-4 pt-3 pb-4 safe-area-inset-bottom">
            {/* Micro trust line - above buttons */}
            <p className="text-[11px] text-center text-muted-foreground mb-3">
              ✓ Kostenlos · ✓ Unverbindlich · ✓ {locationPrefix} {regionName}
            </p>
            
            <div className="flex gap-3">
              {/* Primary CTA */}
              <Button 
                asChild
                className="flex-1 h-12 text-sm font-bold gradient-cta text-white shadow-strong"
              >
                <Link to="/umzugsofferten">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Gratis Offerten
                </Link>
              </Button>
              
              {/* Secondary CTA */}
              <Button 
                variant="outline"
                asChild
                className="h-12 px-4"
              >
                <a href="#preise">
                  <Calculator className="w-4 h-4 mr-1" />
                  Preise
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

RegionStickyMobileCTA.displayName = 'RegionStickyMobileCTA';
