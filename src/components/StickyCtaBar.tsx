import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Calendar, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackCtaClick } from '@/hooks/useCtaTracking';

const StickyCtaBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed in this session
    const dismissed = sessionStorage.getItem('stickyCtaDismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('stickyCtaDismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed top-0 left-0 right-0 z-40 bg-gradient-hero text-primary-foreground py-2.5 px-4 hidden md:block shadow-medium"
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-warm animate-pulse" />
              <span className="text-sm font-medium">
                Jetzt Umzug planen und <span className="text-warm font-bold">10% Frühbucherrabatt</span> sichern!
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <a href="tel:+41765681302" onClick={() => trackCtaClick('Anrufen', 'sticky_bar')}>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-primary-foreground hover:bg-primary-foreground/10 h-8"
                >
                  <Phone className="w-4 h-4 mr-1.5" />
                  Anrufen
                </Button>
              </a>
              <a 
                href="https://wa.me/41765681302" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackCtaClick('WhatsApp', 'sticky_bar')}
              >
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-primary-foreground hover:bg-primary-foreground/10 h-8"
                >
                  <MessageCircle className="w-4 h-4 mr-1.5" />
                  WhatsApp
                </Button>
              </a>
              <Link to="/booking" onClick={() => trackCtaClick('Termin buchen', 'sticky_bar')}>
                <Button 
                  size="sm" 
                  className="bg-warm hover:bg-warm/90 text-warm-foreground h-8 font-medium"
                >
                  <Calendar className="w-4 h-4 mr-1.5" />
                  Termin buchen
                </Button>
              </Link>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10 ml-2"
                onClick={handleDismiss}
                aria-label="Banner schliessen"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCtaBar;
