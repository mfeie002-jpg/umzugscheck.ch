import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Phone, MessageSquare, FileText, X, ChevronUp } from 'lucide-react';
import { openWhatsApp } from '@/utils/whatsapp';

const FloatingCTABar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 500;
      setIsVisible(scrolled && !isDismissed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  // Hide on certain pages
  const hiddenPaths = ['/contact', '/booking', '/auth', '/admin'];
  if (hiddenPaths.some(path => location.pathname.startsWith(path))) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-40 lg:bottom-6 lg:left-auto lg:right-6 lg:w-auto"
        >
          <div className="bg-card border rounded-2xl shadow-2xl p-3 flex items-center gap-2 lg:gap-4">
            {/* Dismiss Button */}
            <button 
              onClick={() => setIsDismissed(true)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-muted rounded-full flex items-center justify-center hover:bg-muted-foreground/20 lg:hidden"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Desktop Version */}
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-sm font-medium pl-2">Bereit umzuziehen?</span>
              
              <Button asChild size="sm" className="gap-2">
                <Link to="/contact">
                  <FileText className="w-4 h-4" />
                  Offerte anfragen
                </Link>
              </Button>
              
              <Button size="sm" variant="outline" className="gap-2" onClick={() => openWhatsApp({})}>
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </Button>
              
              <Button size="sm" variant="ghost" asChild>
                <a href="tel:+41765681302" className="gap-2">
                  <Phone className="w-4 h-4" />
                  Anrufen
                </a>
              </Button>

              <button 
                onClick={() => setIsDismissed(true)}
                className="p-1 hover:bg-muted rounded-full"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Mobile Version */}
            <div className="flex lg:hidden items-center gap-2 w-full">
              <Button asChild size="sm" className="flex-1 gap-2">
                <Link to="/contact">
                  <FileText className="w-4 h-4" />
                  Offerte
                </Link>
              </Button>
              
              <Button size="sm" variant="outline" onClick={() => openWhatsApp({})}>
                <MessageSquare className="w-4 h-4" />
              </Button>
              
              <Button size="sm" variant="outline" asChild>
                <a href="tel:+41765681302">
                  <Phone className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTABar;
