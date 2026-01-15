import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Button } from './button';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  message?: string;
  delayMs?: number;
}

export const FloatingWhatsApp = memo(function FloatingWhatsApp({
  phoneNumber = "41780980000", // Default Swiss number format without +
  message = "Hallo! Ich möchte gerne einen Umzug buchen oder eine Offerte anfragen. Können Sie mir helfen?",
  delayMs = 30000, // 30 seconds default
}: FloatingWhatsAppProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Show tooltip briefly when appearing
      setIsTooltipOpen(true);
      const tooltipTimer = setTimeout(() => setIsTooltipOpen(false), 5000);
      return () => clearTimeout(tooltipTimer);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-20 right-20 z-40 md:bottom-6 md:right-24"
        >
          {/* Tooltip */}
          <AnimatePresence>
            {isTooltipOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute bottom-16 left-0 w-56 p-3 bg-card rounded-xl shadow-lg border border-border mb-2"
              >
                <button
                  onClick={() => setIsTooltipOpen(false)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                  aria-label="Schliessen"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <p className="text-sm font-bold text-foreground pr-4">
                  📞 Jetzt per WhatsApp buchen!
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Offerte anfragen • Umzug buchen • Schnelle Antwort
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* WhatsApp Button */}
          <div className="relative">
            <Button
              onClick={handleClick}
              size="icon"
              className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg"
              aria-label="WhatsApp Chat öffnen"
            >
              <MessageCircle className="w-7 h-7" fill="white" />
            </Button>
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted-foreground hover:text-muted transition-colors"
              aria-label="WhatsApp Button ausblenden"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
