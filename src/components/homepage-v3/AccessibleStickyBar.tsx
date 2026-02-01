/**
 * Accessible Sticky Bar V3 - With proper ARIA
 * Addresses gap: "ARIA-Labels für Accessibility"
 */
import { memo, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccessibleStickyBar = memo(function AccessibleStickyBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleScroll = useCallback(() => {
    if (!isDismissed) {
      setIsVisible(window.scrollY > 400);
    }
  }, [isDismissed]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (!isVisible || isDismissed) return null;

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
      role="complementary"
      aria-label="Schnellzugriff auf Offerten-Formular"
    >
      {/* Gradient fade */}
      <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" aria-hidden="true" />
      
      <div className="bg-white border-t border-border shadow-2xl">
        <div className="px-4 py-3">
          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-3 mb-2 text-xs text-muted-foreground" aria-label="Vorteile">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" aria-hidden="true" />
              Kostenlos
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" aria-hidden="true" />
              Unverbindlich
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" aria-hidden="true" />
              In 2 Min.
            </span>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <Link to="/umzugsofferten" className="flex-1">
              <Button 
                className="w-full h-12 text-base font-bold shadow-lg rounded-xl gap-2"
                aria-label="Jetzt kostenlos Umzugsofferten vergleichen"
              >
                Jetzt Offerten vergleichen
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDismissed(true)}
              className="flex-shrink-0"
              aria-label="Leiste schliessen"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
