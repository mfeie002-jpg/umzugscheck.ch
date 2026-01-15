/**
 * Region Exit Intent Popup
 * Shows when user tries to leave canton page - offers quick offerten CTA
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Star, Clock, Gift } from "lucide-react";
import { Link } from "react-router-dom";

interface RegionExitIntentProps {
  regionName: string;
  providerCount?: number;
  avgRating?: number;
}

export const RegionExitIntent = ({ 
  regionName, 
  providerCount = 15,
  avgRating = 4.8 
}: RegionExitIntentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Check if already shown in this session
    const alreadyShown = sessionStorage.getItem("regionExitIntentShown");
    if (alreadyShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from top of viewport (desktop)
      if (e.clientY <= 0 && !hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
        sessionStorage.setItem("regionExitIntentShown", "true");
      }
    };

    // Scroll depth trigger for mobile (75% scroll)
    let scrollTriggered = false;
    const handleScroll = () => {
      if (scrollTriggered || hasTriggered) return;
      const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercentage > 75) {
        scrollTriggered = true;
        // Delay popup slightly after deep scroll
        setTimeout(() => {
          if (!hasTriggered) {
            setIsOpen(true);
            setHasTriggered(true);
            sessionStorage.setItem("regionExitIntentShown", "true");
          }
        }, 2000);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasTriggered]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            Noch keine Offerte aus {regionName}?
          </DialogTitle>
          <DialogDescription className="text-center">
            Erhalten Sie jetzt kostenlos bis zu 5 Angebote von geprüften Umzugsfirmen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-primary">{providerCount}+</div>
              <div className="text-xs text-muted-foreground">Geprüfte Firmen</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-lg font-bold">{avgRating}</span>
              </div>
              <div className="text-xs text-muted-foreground">Ø Bewertung</div>
            </div>
          </div>

          {/* Primary CTA */}
          <Button 
            asChild
            className="w-full h-12 text-base font-semibold"
          >
            <Link to="/umzugsofferten" onClick={() => setIsOpen(false)}>
              Gratis Offerten erhalten
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          {/* Trust elements */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span>Offerten in 24h – 100% kostenlos</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gift className="h-4 w-4 text-primary" />
              <span>Bis zu 40% sparen durch Vergleich</span>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors pt-2"
          >
            Später vielleicht
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
