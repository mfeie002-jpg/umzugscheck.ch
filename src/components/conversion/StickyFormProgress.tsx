/**
 * Sticky Form Progress Header
 * 
 * Shows progress and key info when user scrolls past the form.
 * Increases form completion rates.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickyFormProgressProps {
  currentStep: number;
  totalSteps: number;
  formRef?: React.RefObject<HTMLElement>;
  onCTAClick?: () => void;
  ctaText?: string;
  showAfterScroll?: number; // pixels
  className?: string;
}

export const StickyFormProgress = ({
  currentStep,
  totalSteps,
  formRef,
  onCTAClick,
  ctaText = "Weiter zum Formular",
  showAfterScroll = 400,
  className
}: StickyFormProgressProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;

      // Check if we've scrolled past the threshold
      const scrollY = window.scrollY;
      
      // If form ref exists, check if we've scrolled past it
      if (formRef?.current) {
        const formRect = formRef.current.getBoundingClientRect();
        const isFormOutOfView = formRect.bottom < 0;
        setIsVisible(isFormOutOfView);
      } else {
        setIsVisible(scrollY > showAfterScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [formRef, showAfterScroll, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleCTAClick = () => {
    if (onCTAClick) {
      onCTAClick();
    } else if (formRef?.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-lg",
            className
          )}
        >
          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary"
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              {/* Left: Progress info */}
              <div className="flex items-center gap-4">
                {/* Step indicator */}
                <div className="hidden sm:flex items-center gap-2">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        i < currentStep 
                          ? "bg-primary" 
                          : i === currentStep 
                            ? "bg-primary/50" 
                            : "bg-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                
                <div className="text-sm">
                  <span className="font-medium">Schritt {currentStep} von {totalSteps}</span>
                  <span className="text-muted-foreground ml-2 hidden md:inline">
                    – Noch {totalSteps - currentStep + 1} Schritte bis zur Offerte
                  </span>
                </div>
              </div>

              {/* Center: Trust signals (hidden on mobile) */}
              <div className="hidden lg:flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-green-500" />
                  <span>100% kostenlos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-primary" />
                  <span>In 2 Min. fertig</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span>Unverbindlich</span>
                </div>
              </div>

              {/* Right: CTA + Dismiss */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCTAClick}
                  size="sm"
                  className="gap-1 shadow-md"
                >
                  {ctaText}
                  <ArrowRight className="h-3 w-3" />
                </Button>
                
                <button
                  onClick={handleDismiss}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Schliessen"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyFormProgress;
