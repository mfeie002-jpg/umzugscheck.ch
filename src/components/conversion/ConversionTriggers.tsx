/**
 * Smart Conversion Triggers
 * Exit intent, scroll depth, time on page, and engagement-based triggers
 */

import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Gift, ArrowRight, Bell, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Exit Intent Detection
export function useExitIntent(options: { 
  threshold?: number; 
  delay?: number;
  mobileScrollUp?: boolean;
} = {}) {
  const { threshold = 20, delay = 1000, mobileScrollUp = true } = options;
  const [triggered, setTriggered] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const hasTriggeredBefore = sessionStorage.getItem('exitIntentTriggered');
    
    if (hasTriggeredBefore) return;

    // Desktop: mouse leaving viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= threshold) {
        timeoutId = setTimeout(() => {
          setTriggered(true);
          sessionStorage.setItem('exitIntentTriggered', 'true');
        }, delay);
      }
    };

    const handleMouseEnter = () => {
      clearTimeout(timeoutId);
    };

    // Mobile: rapid scroll up
    const handleScroll = () => {
      if (!mobileScrollUp) return;
      
      const currentScrollY = window.scrollY;
      const scrollDelta = lastScrollY - currentScrollY;
      
      if (scrollDelta > 100 && currentScrollY < 200) {
        setTriggered(true);
        sessionStorage.setItem('exitIntentTriggered', 'true');
      }
      
      setLastScrollY(currentScrollY);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold, delay, mobileScrollUp, lastScrollY]);

  const reset = useCallback(() => {
    setTriggered(false);
    sessionStorage.removeItem('exitIntentTriggered');
  }, []);

  return { triggered, reset };
}

// Scroll Depth Trigger
export function useScrollDepthTrigger(targetDepth: number = 50) {
  const [triggered, setTriggered] = useState(false);
  const [currentDepth, setCurrentDepth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setCurrentDepth(Math.round(depth));
      
      if (depth >= targetDepth && !triggered) {
        setTriggered(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetDepth, triggered]);

  return { triggered, currentDepth };
}

// Time on Page Trigger
export function useTimeOnPageTrigger(seconds: number = 30) {
  const [triggered, setTriggered] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => {
        const newTime = prev + 1;
        if (newTime >= seconds && !triggered) {
          setTriggered(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, triggered]);

  return { triggered, timeSpent };
}

// Engagement Score Trigger
export function useEngagementTrigger(threshold: number = 50) {
  const [score, setScore] = useState(0);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    let engagementScore = 0;
    
    // Track clicks
    const handleClick = () => {
      engagementScore += 5;
      updateScore();
    };

    // Track scroll
    let maxScrollDepth = 0;
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      if (depth > maxScrollDepth) {
        engagementScore += (depth - maxScrollDepth) * 0.1;
        maxScrollDepth = depth;
        updateScore();
      }
    };

    // Track form interactions
    const handleFocus = (e: FocusEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') {
        engagementScore += 10;
        updateScore();
      }
    };

    const updateScore = () => {
      setScore(Math.round(engagementScore));
      if (engagementScore >= threshold && !triggered) {
        setTriggered(true);
      }
    };

    // Time-based score increase
    const timeInterval = setInterval(() => {
      engagementScore += 1;
      updateScore();
    }, 5000);

    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('focusin', handleFocus);

    return () => {
      clearInterval(timeInterval);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('focusin', handleFocus);
    };
  }, [threshold, triggered]);

  return { score, triggered };
}

// Exit Intent Popup Component
interface ExitIntentOfferProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'discount' | 'reminder' | 'bonus';
  onAccept?: () => void;
}

export const ExitIntentOffer = memo(function ExitIntentOffer({
  isOpen,
  onClose,
  variant = 'discount',
  onAccept
}: ExitIntentOfferProps) {
  const variants = {
    discount: {
      icon: Gift,
      title: 'Warten Sie! 🎁',
      subtitle: 'Exklusiver Rabatt nur für Sie',
      description: 'Erhalten Sie 10% Rabatt auf Ihren Umzug, wenn Sie jetzt Offerten anfordern.',
      cta: 'Rabatt sichern',
      color: 'from-primary to-primary/80'
    },
    reminder: {
      icon: Bell,
      title: 'Fortschritt speichern?',
      subtitle: 'Ihre Daten gehen nicht verloren',
      description: 'Wir können Ihnen eine Erinnerung senden, damit Sie später weitermachen können.',
      cta: 'Erinnern lassen',
      color: 'from-blue-500 to-blue-600'
    },
    bonus: {
      icon: Zap,
      title: 'Bonus freischalten!',
      subtitle: 'Kostenloser Umzugs-Check',
      description: 'Schließen Sie jetzt ab und erhalten Sie eine kostenlose Umzugs-Checkliste.',
      cta: 'Bonus holen',
      color: 'from-amber-500 to-orange-500'
    }
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
          >
            <Card className="relative overflow-hidden shadow-2xl">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>

              <div className={cn(
                "bg-gradient-to-r p-6 text-white",
                config.color
              )}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">{config.title}</h3>
                </div>
                <p className="text-white/90 font-medium">{config.subtitle}</p>
              </div>

              <div className="p-6">
                <p className="text-muted-foreground mb-6">
                  {config.description}
                </p>

                <div className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      onAccept?.();
                      onClose();
                    }}
                  >
                    {config.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <button
                    onClick={onClose}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Nein danke, ich möchte gehen
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>100% unverbindlich & kostenlos</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

// Floating CTA that appears on scroll
interface FloatingCTAProps {
  show: boolean;
  text?: string;
  onClick?: () => void;
}

export const FloatingCTA = memo(function FloatingCTA({
  show,
  text = 'Jetzt Offerte anfordern',
  onClick
}: FloatingCTAProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 inset-x-4 z-40 md:inset-x-auto md:right-6 md:left-auto"
        >
          <Button
            size="lg"
            onClick={onClick}
            className="w-full md:w-auto shadow-lg"
          >
            {text}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// Time-sensitive urgency banner
interface UrgencyBannerProps {
  show: boolean;
  message?: string;
  expiresIn?: number; // minutes
}

export const UrgencyBanner = memo(function UrgencyBanner({
  show,
  message = 'Limitiertes Angebot',
  expiresIn = 15
}: UrgencyBannerProps) {
  const [timeLeft, setTimeLeft] = useState(expiresIn * 60);

  useEffect(() => {
    if (!show) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [show]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <AnimatePresence>
      {show && timeLeft > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white overflow-hidden"
        >
          <div className="container py-2 flex items-center justify-center gap-3 text-sm font-medium">
            <Clock className="h-4 w-4" />
            <span>{message}</span>
            <span className="font-mono bg-white/20 px-2 py-0.5 rounded">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// Conversion trigger manager
export function useConversionTriggers() {
  const exitIntent = useExitIntent();
  const scrollDepth = useScrollDepthTrigger(75);
  const timeOnPage = useTimeOnPageTrigger(45);
  const engagement = useEngagementTrigger(60);

  const [showExitOffer, setShowExitOffer] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [showUrgency, setShowUrgency] = useState(false);

  useEffect(() => {
    if (exitIntent.triggered) {
      setShowExitOffer(true);
    }
  }, [exitIntent.triggered]);

  useEffect(() => {
    if (scrollDepth.triggered || timeOnPage.triggered) {
      setShowFloatingCTA(true);
    }
  }, [scrollDepth.triggered, timeOnPage.triggered]);

  useEffect(() => {
    if (engagement.triggered) {
      setShowUrgency(true);
    }
  }, [engagement.triggered]);

  return {
    showExitOffer,
    setShowExitOffer,
    showFloatingCTA,
    setShowFloatingCTA,
    showUrgency,
    setShowUrgency,
    metrics: {
      scrollDepth: scrollDepth.currentDepth,
      timeOnPage: timeOnPage.timeSpent,
      engagementScore: engagement.score
    }
  };
}
