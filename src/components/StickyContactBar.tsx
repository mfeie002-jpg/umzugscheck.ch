/**
 * Sticky Contact Bar
 * Floating contact options that appear after scrolling
 * Now positioned on LEFT side to avoid conflict with other sticky elements
 */

import { useState, useEffect } from "react";
import { Phone, Mail, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { COMPANY_PHONE, COMPANY_PHONE_DISPLAY, COMPANY_WHATSAPP } from "@/components/CallButton";

interface StickyContactBarProps {
  showAfter?: number;
}

export const StickyContactBar = ({ showAfter = 600 }: StickyContactBarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfter);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfter]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={cn(
          "fixed z-40",
          // Desktop: bottom-left, Mobile: above StickyMobileCTA on left
          "bottom-24 md:bottom-6 left-4"
        )}
      >
        <AnimatePresence>
          {isExpanded ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-border/50 p-4 min-w-[220px]"
            >
              {/* Close button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-muted transition-colors"
                aria-label="Schliessen"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              <p className="text-sm font-bold text-foreground mb-3 pr-6">
                Schneller geht's telefonisch! 📞
              </p>

              {/* Phone button */}
              <a
                href={`tel:${COMPANY_PHONE}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors mb-2"
              >
                <Phone className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-sm">{COMPANY_PHONE_DISPLAY}</div>
                  <div className="text-xs text-white/80">Mo-Fr 8-18 Uhr</div>
                </div>
              </a>

              {/* WhatsApp button */}
              <a
                href={`https://wa.me/${COMPANY_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors mb-2"
              >
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-sm">WhatsApp</div>
                  <div className="text-xs text-white/80">Schnelle Antwort</div>
                </div>
              </a>

              {/* Email button */}
              <a
                href="mailto:info@umzugscheck.ch"
                className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-foreground transition-colors"
              >
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <div className="font-bold text-sm">E-Mail</div>
                  <div className="text-xs text-muted-foreground">info@umzugscheck.ch</div>
                </div>
              </a>

              {/* Trust hint */}
              <p className="text-[10px] text-muted-foreground text-center mt-3">
                ✓ Kostenlos · ✓ Unverbindlich · ✓ Schweizweit
              </p>
            </motion.div>
          ) : (
            <motion.button
              onClick={() => setIsExpanded(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "group relative flex items-center gap-2",
                "bg-emerald-500 hover:bg-emerald-600 text-white",
                "rounded-full shadow-lg shadow-emerald-500/30",
                "transition-all duration-200",
                "p-3 md:pl-4 md:pr-5"
              )}
              aria-label="Kontakt anzeigen"
            >
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
              
              <Phone className="w-5 h-5 relative z-10" />
              <span className="hidden md:inline text-sm font-semibold relative z-10">
                Anrufen
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

