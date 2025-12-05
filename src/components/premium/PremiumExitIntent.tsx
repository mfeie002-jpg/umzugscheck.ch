import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export const PremiumExitIntent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShown]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={() => setIsVisible(false)}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 relative">
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Gift className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Warten Sie!</h3>
                <p className="text-primary-foreground/80">Exklusives Angebot nur für Sie</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full mb-4">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Nur noch 15 Minuten gültig</span>
              </div>
              
              <h4 className="text-xl font-bold mb-2">
                CHF 50 Rabatt auf Ihren Umzug
              </h4>
              <p className="text-muted-foreground">
                Sichern Sie sich jetzt Ihren exklusiven Rabatt-Code und sparen Sie bei Ihrer nächsten Buchung.
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ihr Rabatt-Code:</span>
                <div className="bg-card border-2 border-dashed border-primary px-4 py-2 rounded-lg">
                  <span className="font-mono font-bold text-lg text-primary">UMZUG50</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full group">
                <Link to="/umzugsofferten">
                  Jetzt Rabatt einlösen
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => setIsVisible(false)}
              >
                Nein, ich zahle lieber mehr
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
