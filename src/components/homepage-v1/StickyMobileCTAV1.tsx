/**
 * Sticky Mobile CTA V1 - Fixierter roter Button am unteren Rand
 * P0 Improvement #3 from Analysis
 * 
 * 65% des Traffic ist Mobile. Der Nutzer scrollt — der CTA muss immer sichtbar bleiben.
 * Min 48px Touch Target für bessere UX.
 */
import { memo, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StickyMobileCTAV1 = memo(function StickyMobileCTAV1() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight * 0.7; // Show after 70% of viewport
    
    setHasScrolledPastHero(scrollY > heroHeight);
    setIsVisible(scrollY > 100);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      {/* Gradient fade */}
      <div className="absolute inset-x-0 -top-4 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      
      <div className="bg-white border-t border-border shadow-2xl">
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Trust Micro-Text */}
          <div className="hidden xs:flex items-center gap-1 text-xs text-muted-foreground">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>Gratis</span>
          </div>
          
          {/* Main CTA Button - 48px+ height for touch */}
          <Link to="/umzugsofferten" className="flex-1">
            <Button 
              className="w-full h-12 text-base font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg active:scale-[0.98] transition-transform rounded-xl"
            >
              Jetzt vergleichen
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
});
