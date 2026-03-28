/**
 * EXIT INTENT POPUP
 * 
 * High-converting exit intent popup that appears when users try to leave.
 * Features: Timer urgency, social proof, special offer.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Clock, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackExitIntent, trackCTAClick } from '@/lib/realtime-metrics';

interface ExitIntentPopupProps {
  onClose?: () => void;
  ctaUrl?: string;
}

export const ExitIntentPopup = ({ 
  onClose,
  ctaUrl = '/umzugsofferten'
}: ExitIntentPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [countdown, setCountdown] = useState(15);
  
  // Check if already shown this session
  useEffect(() => {
    const shown = sessionStorage.getItem('exit_intent_shown');
    if (shown) {
      setHasTriggered(true);
    }
  }, []);
  
  // Exit intent detection (desktop only)
  useEffect(() => {
    if (hasTriggered || window.innerWidth < 768) return;
    
    let timeoutId: NodeJS.Timeout;
    
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves through top of viewport
      if (e.clientY <= 10 && !hasTriggered) {
        // Small delay to prevent false triggers
        timeoutId = setTimeout(() => {
          setIsVisible(true);
          setHasTriggered(true);
          sessionStorage.setItem('exit_intent_shown', 'true');
          trackExitIntent(true, window.location.pathname);
        }, 100);
      }
    };
    
    // Wait 5 seconds before enabling exit intent
    const enableTimeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);
    
    return () => {
      clearTimeout(enableTimeout);
      clearTimeout(timeoutId);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasTriggered]);
  
  // Countdown timer
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isVisible]);
  
  const handleClose = useCallback(() => {
    setIsVisible(false);
    onClose?.();
  }, [onClose]);
  
  const handleCTA = useCallback(() => {
    trackCTAClick('exit_intent_cta', 'popup');
    window.location.href = ctaUrl;
  }, [ctaUrl]);
  
  // Benefits list
  const benefits = [
    'Kostenlose Offerten von Top-Firmen',
    'Bis zu 40% Ersparnis garantiert',
    'Unverbindlich & ohne Verpflichtung',
  ];
  
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4"
          >
            <div className="bg-background rounded-2xl shadow-2xl overflow-hidden border border-border">
              {/* Header with urgency */}
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    <span className="font-semibold">Exklusives Angebot</span>
                  </div>
                  
                  {/* Countdown */}
                  <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
                    <Clock className="h-4 w-4" />
                    <span className="font-mono font-bold">
                      {countdown > 0 ? `00:${countdown.toString().padStart(2, '0')}` : 'Jetzt!'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                  aria-label="Schliessen"
                >
                  <X className="h-5 w-5" />
                </button>
                
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Warten Sie! 🇨🇭
                </h2>
                
                <p className="text-muted-foreground mb-6">
                  Bevor Sie gehen – holen Sie sich <strong>kostenlose Umzugsofferten</strong> von geprüften Schweizer Firmen!
                </p>
                
                {/* Benefits */}
                <ul className="space-y-3 mb-6">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Social proof */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 p-3 bg-muted/50 rounded-lg">
                  <Users className="h-4 w-4 text-primary" />
                  <span>
                    <strong className="text-foreground">47 Personen</strong> haben heute Offerten angefragt
                  </span>
                </div>
                
                {/* CTA */}
                <Button 
                  onClick={handleCTA}
                  size="lg"
                  className="w-full h-14 text-lg font-semibold group"
                >
                  <span>Jetzt kostenlos vergleichen</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                
                <p className="text-center text-xs text-muted-foreground mt-4">
                  100% kostenlos • Keine Verpflichtung • Schweizer Qualität
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
