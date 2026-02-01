/**
 * WhatsApp Floating Action Button V5 - Shows on hesitation
 * Addresses: "WhatsApp Floating Action Button (FAB)"
 */
import { memo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WHATSAPP_NUMBER = '41441234567'; // Replace with actual number
const EXPERT_NAME = 'Fabian';

export const WhatsAppFAB = memo(function WhatsAppFAB() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Show after user hesitates (scrolled + idle time)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show FAB after hesitation
  useEffect(() => {
    if (!hasScrolled) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 15000); // 15 seconds of viewing = hesitation

    return () => clearTimeout(timer);
  }, [hasScrolled]);

  // Also show if user has been on page for 30s regardless of scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = useCallback(() => {
    if (isExpanded) {
      // Open WhatsApp
      const message = encodeURIComponent(
        'Hallo, ich habe eine Frage zu meinem Umzug...'
      );
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
        '_blank'
      );
    } else {
      setIsExpanded(true);
    }
  }, [isExpanded]);

  const handleClose = useCallback(() => {
    setIsExpanded(false);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-card rounded-2xl shadow-2xl border p-4 max-w-[280px]"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute -top-2 -right-2 w-6 h-6 bg-muted rounded-full flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
              aria-label="Schliessen"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Expert Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold">{EXPERT_NAME}</div>
                <div className="text-xs text-muted-foreground">
                  Umzugsexperte • Online
                </div>
              </div>
            </div>

            {/* Message */}
            <p className="text-sm text-muted-foreground mb-4">
              Unsicher bei einer Offerte? Ich helfe Ihnen gerne – 
              kostenlos und unverbindlich.
            </p>

            {/* CTA */}
            <Button 
              onClick={handleClick}
              className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Per WhatsApp fragen
            </Button>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="w-14 h-14 rounded-full bg-[#25D366] shadow-lg flex items-center justify-center hover:bg-[#20BD5A] transition-colors"
            aria-label="WhatsApp Chat öffnen"
          >
            <MessageCircle className="w-7 h-7 text-white" />
            
            {/* Pulse Animation */}
            <span className="absolute w-full h-full rounded-full bg-[#25D366] animate-ping opacity-25" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});
