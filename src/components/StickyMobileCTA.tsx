import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface StickyMobileCTAProps {
  text?: string;
  link?: string;
}

export const StickyMobileCTA = ({ text = "Offerten vergleichen", link = "/umzug-offerte" }: StickyMobileCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling down 200px on mobile
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        >
          {/* Gradient overlay for smooth transition */}
          <div className="absolute inset-x-0 -top-12 h-12 bg-gradient-to-t from-background/95 via-background/50 to-transparent pointer-events-none" />
          
          <div className="bg-background/98 backdrop-blur-xl border-t-2 border-secondary/30 shadow-2xl">
            <div className="container mx-auto px-4 py-3 safe-bottom">
              <Link to={link} className="block">
                <Button 
                  size="lg" 
                  className="w-full h-14 text-base font-bold bg-secondary text-secondary-foreground shadow-cta hover:bg-secondary/90 hover:scale-[1.02] transition-transform active:scale-95 animate-pulse-subtle group"
                >
                  <Sparkles className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                  {text}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-center text-xs text-muted-foreground mt-2">
                Kostenlos & unverbindlich
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
