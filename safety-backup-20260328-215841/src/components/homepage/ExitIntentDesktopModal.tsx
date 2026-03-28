/**
 * ExitIntentDesktopModal - Captures desktop users about to leave
 * Triggered when mouse leaves viewport toward top
 */

import { memo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ExitIntentDesktopModalProps {
  className?: string;
  delaySeconds?: number;
  sessionKey?: string;
}

const TESTIMONIALS = [
  {
    name: "M. Schneider",
    location: "Zürich → Bern",
    quote: "CHF 620 gespart durch den Vergleich. Sehr einfacher Prozess!",
    rating: 5,
  },
  {
    name: "S. Müller",
    location: "Basel → Luzern",
    quote: "Innerhalb von 24h 4 Offerten erhalten. Sehr empfehlenswert.",
    rating: 5,
  },
  {
    name: "K. Weber",
    location: "Genf → Lausanne",
    quote: "Professionelle Firmen, transparente Preise. Top Service!",
    rating: 5,
  },
];

export const ExitIntentDesktopModal = memo(function ExitIntentDesktopModal({
  className,
  delaySeconds = 5,
  sessionKey = "exit_intent_desktop_shown",
}: ExitIntentDesktopModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [testimonial] = useState(() => 
    TESTIMONIALS[Math.floor(Math.random() * TESTIMONIALS.length)]
  );

  // Check if already shown this session
  useEffect(() => {
    const wasShown = sessionStorage.getItem(sessionKey);
    if (wasShown) {
      setHasTriggered(true);
    }
  }, [sessionKey]);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only trigger if mouse leaves from top of viewport
    if (e.clientY <= 0 && !hasTriggered) {
      setIsOpen(true);
      setHasTriggered(true);
      sessionStorage.setItem(sessionKey, "true");
    }
  }, [hasTriggered, sessionKey]);

  useEffect(() => {
    // Delay activation to avoid triggering on quick page loads
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, delaySeconds * 1000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseLeave, delaySeconds]);

  const handleClose = () => {
    setIsOpen(false);
  };

  // Don't render on mobile/tablet
  if (typeof window !== "undefined" && window.innerWidth < 1024) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={cn(
              "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
              "w-full max-w-lg",
              className
            )}
          >
            <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Schliessen"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              
              {/* Header with Live Counter */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 pb-4 text-center">
                <h3 className="text-xl font-bold mb-1">
                  Bevor Sie gehen...
                </h3>
                <p className="text-sm text-muted-foreground">
                  Verpassen Sie nicht Ihre Chance zu sparen!
                </p>
                {/* Live Social Proof */}
                <div className="flex items-center justify-center gap-2 mt-3 text-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                  <span className="font-medium text-foreground">327 Personen</span>
                  <span className="text-muted-foreground">haben heute ihr bestes Angebot gefunden</span>
                </div>
              </div>
              
              {/* Testimonial */}
              <div className="p-6">
                <div className="bg-muted/50 rounded-xl p-4 mb-4">
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-swiss-gold fill-swiss-gold" />
                    ))}
                  </div>
                  <p className="text-sm italic mb-3">"{testimonial.quote}"</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium">{testimonial.name}</span>
                    <span>{testimonial.location}</span>
                  </div>
                </div>
                
                {/* Benefits */}
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>100% kostenlos & unverbindlich</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Bis zu 40% günstiger als Einzelanfragen</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Offerten in 24-48 Stunden</span>
                  </div>
                </div>
                
                {/* CTA */}
                <Button
                  asChild
                  size="lg"
                  className="w-full h-12 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold"
                >
                  <Link to="/vergleich" onClick={handleClose}>
                    Jetzt kostenlos vergleichen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                
                {/* Skip link */}
                <button
                  onClick={handleClose}
                  className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Nein danke, ich möchte die Seite verlassen
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

export default ExitIntentDesktopModal;
