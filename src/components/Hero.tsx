import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Shield, TrendingDown, Sparkles } from "lucide-react";
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
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const cachedImage = localStorage.getItem('hero-background-image');
    if (cachedImage) {
      setHeroImage(cachedImage);
    } else {
      generateHeroImage();
    }

    const handleUpdate = (e: CustomEvent) => {
      setHeroImage(e.detail);
    };
    window.addEventListener('hero-background-updated', handleUpdate as EventListener);
    return () => {
      window.removeEventListener('hero-background-updated', handleUpdate as EventListener);
    };
  }, []);

  const generateHeroImage = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-hero-image');
      if (error) throw error;
      if (data?.imageUrl) {
        setHeroImage(data.imageUrl);
        localStorage.setItem('hero-background-image', data.imageUrl);
      }
    } catch (error) {
      console.error('Error generating hero image:', error);
    }
  };
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Light warm background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white" />
      
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 relative z-10">
        {/* Two-Column Layout: Text Left, Image Right */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
          
          {/* LEFT COLUMN - Text Content */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            
            {/* Small KI Badge */}
            <Badge variant="secondary" className="inline-flex items-center gap-1.5 text-xs px-3 py-1">
              <Sparkles className="w-3 h-3" />
              ✨ NEU: KI-gestützte Volumenanalyse (Beta)
            </Badge>

            {/* Headlines */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Vergleichen Sie Ihren Umzug – schnell, fair und stressfrei
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground">
                Erhalten Sie in 2 Minuten passende Angebote von geprüften Schweizer Umzugsfirmen. Kostenlos und unverbindlich.
              </p>
            </div>

            {/* USP Row - 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                <span className="font-medium text-foreground">100% kostenlos</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingDown className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="font-medium text-foreground">Bis 40% günstiger</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium text-foreground">4.8/5 Zufriedenheit</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium text-foreground">15'000+ Umzüge</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <Link to="/umzugsofferten" className="w-full sm:flex-1">
                <Button 
                  size="lg" 
                  className="w-full text-base px-8 bg-accent hover:bg-accent/90 shadow-lg"
                  onClick={() => trigger('medium')}
                >
                  Jetzt Umzug vergleichen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/rechner" className="w-full sm:flex-1">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full text-base px-8 bg-white hover:bg-gray-50"
                  onClick={() => trigger('light')}
                >
                  Kosten berechnen
                </Button>
              </Link>
            </div>

            {/* Trust Footer */}
            <p className="text-sm text-muted-foreground flex items-center justify-center lg:justify-start gap-2">
              <Shield className="h-4 w-4 text-success" />
              Ihre Daten sind bei uns sicher und werden nicht weitergegeben
            </p>
          </div>

          {/* RIGHT COLUMN - Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              {heroImage ? (
                <img 
                  src={heroImage} 
                  alt="Glückliche Familie beim Umzug mit professionellen Umzugshelfern" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Sparkles className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-blue-600 font-medium">Bild wird generiert...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Badges & Activity */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <SecurityBadges />
          <LiveActivityIndicator />
        </div>
      </div>

      {/* Calculator Section - BELOW Hero */}
      <div className="container mx-auto px-4 pb-12 sm:pb-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-8 border border-primary/10">
            <div className="mb-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2 justify-center">
                <Sparkles className="w-6 h-6 text-accent" />
                KI-Umzugsrechner
              </h2>
              <p className="text-sm text-muted-foreground text-center">
                Laden Sie Fotos oder ein Video Ihrer Wohnung hoch und erhalten Sie in Sekunden eine präzise Volumenberechnung
              </p>
            </div>
            <AICalculator />
          </div>
        </div>
      </div>

      {/* Partner Logos Section */}
      <div className="container mx-auto px-4 pb-12 relative z-10">
        <p className="text-center text-muted-foreground font-medium mb-6 text-sm">
          Bekannt aus & geprüft von:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 opacity-60">
          <img src={logo20min} alt="20 Minuten" className="h-8 grayscale hover:grayscale-0 transition-all" />
          <img src={logoWatson} alt="Watson" className="h-8 grayscale hover:grayscale-0 transition-all" />
          <img src={logoBlick} alt="Blick" className="h-8 grayscale hover:grayscale-0 transition-all" />
          <img src={logoTagesanzeiger} alt="Tages-Anzeiger" className="h-8 grayscale hover:grayscale-0 transition-all" />
          <img src={logoTCS} alt="TCS" className="h-8 grayscale hover:grayscale-0 transition-all" />
          <img src={logoASTAG} alt="ASTAG" className="h-8 grayscale hover:grayscale-0 transition-all" />
        </div>
      </div>

      {/* Decorative wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};
