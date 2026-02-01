/**
 * Sticky Trust & Action Bar V2
 * Links: Rating | Rechts: CTA Button
 * Bleibt in der "Thumb Zone" konstant präsent
 */
import { memo, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StickyTrustActionBar = memo(function StickyTrustActionBar() {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setIsVisible(window.scrollY > 300);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      {/* Gradient fade */}
      <div className="absolute inset-x-0 -top-4 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      
      <div className="bg-white border-t border-border shadow-2xl">
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Trust Badge - Links */}
          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-sm">4.9/5</span>
          </div>
          
          {/* CTA Button - Rechts */}
          <Link to="/video-scan" className="flex-1">
            <Button 
              className="w-full h-12 text-base font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg rounded-xl gap-2"
            >
              <Video className="w-5 h-5" />
              KI-Scan starten
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
});
