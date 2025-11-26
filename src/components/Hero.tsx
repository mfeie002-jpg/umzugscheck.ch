import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Shield, Clock, TrendingDown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { AICalculator } from "./calculator/AICalculator";
import { SecurityBadges } from "@/components/trust/SecurityBadges";
import { LiveActivityIndicator } from "@/components/trust/LiveActivityIndicator";
import { PopularBadge } from "@/components/trust/PopularBadge";
import { useHaptic } from "@/hooks/use-haptic";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Import partner logos
import logo20min from "@/assets/logos/20min-logo.png";
import logoWatson from "@/assets/logos/watson-logo.png";
import logoBlick from "@/assets/logos/blick-logo.png";
import logoTagesanzeiger from "@/assets/logos/tagesanzeiger-logo.png";
import logoTCS from "@/assets/logos/tcs-logo.png";
import logoASTAG from "@/assets/logos/astag-logo.png";

export const Hero = () => {
  const { trigger } = useHaptic();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    // Try to load cached image first
    const cachedImage = localStorage.getItem('hero-background-image');
    if (cachedImage) {
      setBackgroundImage(cachedImage);
    } else {
      // Generate new image
      generateHeroBackground();
    }

    // Listen for background updates
    const handleBackgroundUpdate = (e: CustomEvent) => {
      setBackgroundImage(e.detail);
    };
    window.addEventListener('hero-background-updated', handleBackgroundUpdate as EventListener);
    return () => {
      window.removeEventListener('hero-background-updated', handleBackgroundUpdate as EventListener);
    };
  }, []);

  const generateHeroBackground = async () => {
    try {
      console.log('Requesting hero background generation...');
      const { data, error } = await supabase.functions.invoke('generate-hero-image');
      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }
      console.log('Edge function response:', data);
      if (data?.imageUrl) {
        console.log('Setting background image, URL length:', data.imageUrl.length);
        setBackgroundImage(data.imageUrl);
        localStorage.setItem('hero-background-image', data.imageUrl);
      } else {
        console.warn('No imageUrl in response');
      }
    } catch (error) {
      console.error('Error generating hero background:', error);
    }
  };
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50/50 text-foreground">
      {/* Photographic Background - Happy Family with Movers */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={backgroundImage} 
            alt="Happy family moving into new home with professional movers"
            className="w-full h-full object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-blue-50/80 to-white/70"></div>
        </div>
      )}
      
      {/* Soft Warm Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-white to-orange-50/20">
        {/* Subtle Gradient Blobs */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-blue-200/30 to-blue-100/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-orange-100/30 to-amber-50/20 rounded-full blur-3xl animate-blob-reverse" style={{animationDelay: '2s'}}></div>
      </div>
        
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-24 relative z-10">
        {/* Hero Content - Centered */}
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Small KI Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-accent/20">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-foreground/80">✨ NEU: KI-gestützte Volumenanalyse (Beta)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground">
            Vergleichen Sie Ihren Umzug – <span className="text-primary">schnell, fair und stressfrei</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed max-w-3xl mx-auto">
            Erhalten Sie in 2 Minuten passende Angebote von geprüften Schweizer Umzugsfirmen. Kostenlos und unverbindlich.
          </p>

          {/* USP Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 max-w-4xl mx-auto">
            <div className="bg-white backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-primary/10 shadow-sm">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-success mx-auto mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm font-semibold text-center text-foreground leading-tight">100% kostenlos</p>
            </div>
            <div className="bg-white backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-primary/10 shadow-sm">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-accent mx-auto mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm font-semibold text-center text-foreground leading-tight">Bis zu 40% günstiger</p>
            </div>
            <div className="bg-white backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-primary/10 shadow-sm">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm font-semibold text-center text-foreground leading-tight">4.8/5 Kundenzufriedenheit</p>
            </div>
            <div className="bg-white backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-primary/10 shadow-sm">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm font-semibold text-center text-foreground leading-tight">15'000+ Umzüge begleitet</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4 justify-center max-w-2xl mx-auto">
            <Link to="/umzugsofferten" className="w-full sm:flex-1">
              <Button 
                size="lg" 
                className="w-full h-12 sm:h-14 text-sm sm:text-base bg-accent hover:bg-accent/90 text-white font-bold shadow-lg"
                onClick={() => trigger('medium')}
                aria-label="Jetzt Umzug vergleichen"
              >
                <span>Jetzt Umzug vergleichen</span>
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/rechner" className="w-full sm:flex-1">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full h-12 sm:h-14 text-sm sm:text-base border-2 border-primary/30 bg-white hover:bg-primary/5 text-foreground font-semibold"
                onClick={() => trigger('light')}
                aria-label="Kosten berechnen"
              >
                Kosten berechnen
              </Button>
            </Link>
          </div>

          <div className="pt-2">
            <p className="text-foreground/70 text-xs sm:text-sm flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 flex-shrink-0 text-success" aria-hidden="true" />
              <span>Kostenlos & unverbindlich. Ihre Daten werden sicher behandelt.</span>
            </p>
          </div>

          <div className="pt-4">
            <SecurityBadges />
          </div>
        </div>
      </div>

      {/* Calculator Section - Below Hero */}
      <div className="container mx-auto px-4 pb-8 sm:pb-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="backdrop-blur-lg bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-primary/20 relative">
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
              <PopularBadge variant="popular" />
            </div>
            <div className="mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                KI-Umzugsrechner
              </h3>
              <p className="text-xs text-foreground/70">📸 Foto oder 🎥 Video hochladen – KI analysiert automatisch</p>
            </div>
            <AICalculator />
            <div className="mt-3 flex items-center gap-2 text-xs text-success justify-center font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>Sofortige Analyse • Bis zu 40% sparen</span>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <LiveActivityIndicator />
          </div>
        </div>
      </div>

      <div className="relative z-20 pb-8 border-t border-primary/10 mt-8 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <p className="text-center text-foreground/80 font-semibold mb-6 text-sm sm:text-base">Bekannt aus & geprüft von:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            <div className="relative flex items-center justify-center px-4 py-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all group min-h-[110px]">
              <img src={logo20min} alt="20 Minuten" className="max-h-16 max-w-full object-contain group-hover:scale-105 transition-transform" />
            </div>

            <div className="relative flex items-center justify-center px-4 py-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all group min-h-[110px]">
              <img src={logoTagesanzeiger} alt="Tages-Anzeiger" className="max-h-16 max-w-full object-contain group-hover:scale-105 transition-transform" />
            </div>

            <div className="relative flex items-center justify-center px-4 py-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all group min-h-[110px]">
              <img src={logoBlick} alt="Blick" className="max-h-16 max-w-full object-contain group-hover:scale-105 transition-transform" />
            </div>

            <div className="relative flex items-center justify-center px-4 py-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all group min-h-[110px]">
              <img src={logoWatson} alt="watson" className="max-h-16 max-w-full object-contain group-hover:scale-105 transition-transform" />
            </div>

            <div className="relative flex items-center justify-center px-4 py-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all group min-h-[110px]">
              <img src={logoTCS} alt="TCS Schweiz" className="max-h-16 max-w-full object-contain group-hover:scale-105 transition-transform" />
            </div>

            <div className="relative flex items-center justify-center px-4 py-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all group min-h-[110px]">
              <img src={logoASTAG} alt="ASTAG" className="max-h-16 max-w-full object-contain group-hover:scale-105 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};
