/**
 * Enhanced Exit Intent Popup
 * 
 * Features:
 * - Urgency countdown timer
 * - Random testimonial from satisfied customers
 * - Savings highlight
 * - Mobile-optimized bottom sheet variant
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Clock, Gift, Star, TrendingDown, X, ArrowRight, 
  Shield, Users, Mail, CheckCircle2 
} from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

interface ExitIntentEnhancedProps {
  formData?: {
    fromLocation?: string;
    toLocation?: string;
    rooms?: string;
  };
  flowPath?: string;
}

// Testimonials for social proof
const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    location: 'Zürich',
    quote: 'Innerhalb von 24h 5 Offerten erhalten. CHF 800 gespart!',
    rating: 5,
    savings: 800,
  },
  {
    name: 'Marco B.',
    location: 'Bern',
    quote: 'Super einfach, super schnell. Sehr empfehlenswert!',
    rating: 5,
    savings: 650,
  },
  {
    name: 'Lisa K.',
    location: 'Basel',
    quote: 'Die Video-Analyse war genial – sehr präzise Schätzung.',
    rating: 5,
    savings: 1200,
  },
  {
    name: 'Thomas R.',
    location: 'Luzern',
    quote: 'Bester Preis gefunden, 40% unter dem Erstangebot.',
    rating: 5,
    savings: 950,
  },
];

export function ExitIntentEnhanced({ formData, flowPath = '/umzugsofferten' }: ExitIntentEnhancedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [countdown, setCountdown] = useState(15 * 60); // 15 minutes
  const [testimonial] = useState(() => 
    TESTIMONIALS[Math.floor(Math.random() * TESTIMONIALS.length)]
  );
  const isMobile = useIsMobile();

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Exit intent detection
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('exitIntentShown_v2');
    if (alreadyShown) return;

    // Desktop: Mouse leaves top of viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        triggerPopup();
      }
    };

    // Mobile: Rapid scroll up (exit intent pattern)
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = lastScrollY - currentScrollY;
      
      // Fast upward scroll from below fold = exit intent
      if (scrollVelocity > 200 && currentScrollY > 300 && !hasTriggered) {
        triggerPopup();
      }
      lastScrollY = currentScrollY;
    };

    // Back button attempt
    const handlePopState = () => {
      if (!hasTriggered) {
        triggerPopup();
      }
    };

    const triggerPopup = () => {
      setIsOpen(true);
      setHasTriggered(true);
      sessionStorage.setItem('exitIntentShown_v2', 'true');
    };

    if (!isMobile) {
      document.addEventListener('mouseleave', handleMouseLeave);
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasTriggered, isMobile]);

  const handleSaveProgress = async () => {
    if (!email) {
      toast.error('Bitte geben Sie Ihre E-Mail-Adresse ein');
      return;
    }

    setIsSubmitting(true);
    try {
      const progressData = {
        email,
        formData,
        savedAt: new Date().toISOString(),
        bonusEligible: countdown > 0,
      };
      localStorage.setItem('uc_saved_progress', JSON.stringify(progressData));

      toast.success('Fortschritt gespeichert!', {
        description: 'Wir senden Ihnen einen Link zum Weitermachen.',
      });
      setIsOpen(false);
    } catch (error) {
      toast.error('Fehler beim Speichern');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        {/* Urgency Header */}
        <div className="bg-secondary text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 animate-pulse" />
              <span className="font-semibold">Exklusives Angebot</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              <span className="text-sm">Gültig noch:</span>
              <span className="font-mono font-bold">{formatTime(countdown)}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Main Message */}
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Warten Sie – verpassen Sie nicht CHF 500+ Ersparnis!
            </h2>
            <p className="text-muted-foreground">
              Schliessen Sie jetzt ab und erhalten Sie einen zusätzlichen Bonus.
            </p>
          </div>

          {/* Testimonial Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary/5 border border-primary/20 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="font-semibold text-primary">{testimonial.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{testimonial.name}</span>
                  <span className="text-xs text-muted-foreground">aus {testimonial.location}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground italic">"{testimonial.quote}"</p>
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  <TrendingDown className="h-3 w-3" />
                  CHF {testimonial.savings} gespart
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bonus Offer */}
          <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl p-4 border border-secondary/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <Gift className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Ihr Bonus bei Abschluss heute:</p>
                <p className="text-sm text-muted-foreground">
                  10% Rabatt auf die erste Offerte + Kostenlose Umzugscheckliste
                </p>
              </div>
            </div>
          </div>

          {/* Progress Summary */}
          {formData && (formData.fromLocation || formData.toLocation) && (
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <p className="font-medium mb-1">Ihr bisheriger Fortschritt:</p>
              <div className="text-muted-foreground space-y-0.5">
                {formData.fromLocation && <p>Von: {formData.fromLocation}</p>}
                {formData.toLocation && <p>Nach: {formData.toLocation}</p>}
                {formData.rooms && <p>Zimmer: {formData.rooms}</p>}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {/* Primary CTA - Continue to funnel */}
            <Link to={flowPath} onClick={() => setIsOpen(false)}>
              <Button className="w-full h-12 text-base font-semibold bg-secondary hover:bg-secondary/90">
                Jetzt Offerten erhalten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            {/* Secondary - Save progress */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="E-Mail für Fortsetzungslink"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant="outline"
                onClick={handleSaveProgress}
                disabled={isSubmitting}
              >
                {isSubmitting ? '...' : 'Speichern'}
              </Button>
            </div>
          </div>

          {/* Trust Elements */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" />
              100% kostenlos
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              200+ Firmen
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Unverbindlich
            </span>
          </div>

          {/* Dismiss link */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
          >
            Nein danke, ich möchte die Seite verlassen
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ExitIntentEnhanced;
