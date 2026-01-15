/**
 * Universal Call Button Component
 * Provides easy phone contact across the entire site
 * - Header integration (desktop & mobile)
 * - Sticky floating button option
 * - Mobile-optimized positioning
 */

import { memo, useState, useEffect } from "react";
import { Phone, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Company phone number - centralized for easy updates
export const COMPANY_PHONE = "+41 44 567 89 00";
export const COMPANY_PHONE_DISPLAY = "044 567 89 00";
export const COMPANY_WHATSAPP = "41445678900";

interface CallButtonProps {
  variant?: 'header' | 'header-mobile' | 'floating' | 'inline';
  className?: string;
  showLabel?: boolean;
}

/**
 * Header Call Button - Desktop
 * Compact button for navigation bar
 */
export const HeaderCallButton = memo(({ className }: { className?: string }) => (
  <a 
    href={`tel:${COMPANY_PHONE}`}
    className={cn(
      "group flex items-center gap-2 px-3 py-2 rounded-xl",
      "bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/30",
      "transition-all duration-200",
      className
    )}
    aria-label="Jetzt anrufen"
  >
    <div className="relative">
      <Phone className="w-4 h-4 text-emerald-600" />
      {/* Pulse indicator */}
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
    </div>
    <span className="text-sm font-semibold text-emerald-700 hidden xl:inline">
      {COMPANY_PHONE_DISPLAY}
    </span>
    <span className="text-xs text-emerald-600/80 hidden 2xl:inline">
      Mo-Fr 8-18h
    </span>
  </a>
));
HeaderCallButton.displayName = 'HeaderCallButton';

/**
 * Mobile Header Call Button
 * Icon-only button for mobile navigation
 */
export const MobileHeaderCallButton = memo(({ className }: { className?: string }) => (
  <a 
    href={`tel:${COMPANY_PHONE}`}
    className={cn(
      "flex items-center justify-center w-11 h-11 rounded-xl",
      "bg-emerald-500 hover:bg-emerald-600 text-white",
      "shadow-lg shadow-emerald-500/25 active:scale-95 transition-all",
      "touch-manipulation min-h-[44px]",
      className
    )}
    aria-label="Jetzt anrufen"
  >
    <Phone className="w-5 h-5" />
  </a>
));
MobileHeaderCallButton.displayName = 'MobileHeaderCallButton';

/**
 * Floating Call Button
 * Sticky button that appears after scrolling
 * Positioned to not interfere with StickyMobileCTA
 */
interface FloatingCallButtonProps {
  showAfter?: number;
  position?: 'left' | 'right';
}

export const FloatingCallButton = memo(({ 
  showAfter = 400,
  position = 'left'
}: FloatingCallButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfter);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfter]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: position === 'left' ? -80 : 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: position === 'left' ? -80 : 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={cn(
            "fixed z-40",
            // Desktop: bottom-center-left, Mobile: above StickyMobileCTA
            "bottom-24 md:bottom-6",
            position === 'left' ? "left-4" : "right-4"
          )}
        >
          <AnimatePresence>
            {isExpanded ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl border border-border/50 p-4 min-w-[200px]"
              >
                {/* Close button */}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
                  aria-label="Schliessen"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>

                <p className="text-sm font-semibold text-foreground mb-3">
                  Schneller geht's telefonisch!
                </p>

                {/* Phone button */}
                <a
                  href={`tel:${COMPANY_PHONE}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors mb-2"
                >
                  <Phone className="w-5 h-5" />
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
                  className="flex items-center gap-3 p-3 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <div>
                    <div className="font-bold text-sm">WhatsApp</div>
                    <div className="text-xs text-white/80">Schnelle Antwort</div>
                  </div>
                </a>

                {/* Trust hint */}
                <p className="text-[10px] text-muted-foreground text-center mt-3">
                  ✓ Kostenlos · ✓ Unverbindlich
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
                  // On mobile: just icon, on desktop: icon + text
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
      )}
    </AnimatePresence>
  );
});
FloatingCallButton.displayName = 'FloatingCallButton';

/**
 * Inline Call CTA
 * For use within page content
 */
export const InlineCallCTA = memo(({ className }: { className?: string }) => (
  <div className={cn(
    "flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl",
    "bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200/50",
    className
  )}>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
        <Phone className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          Lieber telefonisch?
        </p>
        <p className="text-xs text-muted-foreground">
          Wir helfen dir gerne persönlich
        </p>
      </div>
    </div>
    
    <a
      href={`tel:${COMPANY_PHONE}`}
      className="flex-shrink-0"
    >
      <Button 
        variant="default"
        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
      >
        <Phone className="w-4 h-4 mr-2" />
        {COMPANY_PHONE_DISPLAY}
      </Button>
    </a>
  </div>
));
InlineCallCTA.displayName = 'InlineCallCTA';
