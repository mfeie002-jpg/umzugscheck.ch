import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { trackCtaClick } from "@/hooks/useCtaTracking";

const SocialProofBar = () => {
  const currentMonth = new Date().toLocaleString('de-CH', { month: 'long' });
  
  return (
    <section className="py-3 sm:py-4 bg-forest/5 border-y border-forest/10 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-forest"></span>
            </span>
            <span className="text-xs sm:text-sm font-medium">
              <strong className="text-forest">12 Umzüge</strong> diese Woche
            </span>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-border" />
          
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-forest" />
            <span>
              <strong>8 freie Termine</strong> im {currentMonth}
            </span>
          </div>
          
          <Link to="/contact" onClick={() => trackCtaClick('Jetzt reservieren', 'social-proof-bar')}>
            <Button size="sm" variant="default" className="text-xs h-7 sm:h-8 bg-forest hover:bg-forest/90 text-white">
              Jetzt reservieren
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SocialProofBar;
