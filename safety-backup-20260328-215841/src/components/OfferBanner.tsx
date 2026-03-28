import { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export function OfferBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('offer-banner-dismissed');
    if (!dismissed) {
      // Show after 2 seconds
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('offer-banner-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg"
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Gift className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">
                <span className="hidden sm:inline">Jetzt 10% Rabatt auf Ihren ersten Umzug! </span>
                <span className="sm:hidden">10% Rabatt! </span>
                <Link 
                  to="/contact" 
                  className="underline underline-offset-2 hover:no-underline font-semibold"
                  onClick={handleDismiss}
                >
                  Offerte anfragen
                </Link>
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1.5 hover:bg-primary-foreground/10 rounded-full transition-colors"
              aria-label="Banner schliessen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OfferBanner;
