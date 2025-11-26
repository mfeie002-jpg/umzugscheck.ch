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
            
            {/* Headlines */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Ihr Umzug. Unser Vergleich. <span className="text-primary">Ihre Ersparnis.</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Finden Sie in 2 Minuten die bestbewerteten Umzugsfirmen der Schweiz. Vergleichen Sie Preise, Bewertungen und Services – kostenlos, unverbindlich und perfekt auf Ihren Umzug abgestimmt.
              </p>
              <p className="text-base sm:text-lg text-foreground/70 italic font-medium">
                Damit Ihr Umzug nicht Stress bedeutet, sondern ein neuer Anfang.
              </p>
            </div>

            {/* Stats Row - 3 Column */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  <TrendingDown className="h-5 w-5 text-accent flex-shrink-0" />
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">40%</p>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">günstiger dank transparentem Vergleich</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">4.8/5</p>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Kundenzufriedenheit</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">15'000+</p>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">erfolgreiche Umzüge</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <Link to="/firmen" className="w-full sm:flex-1">
                <Button 
                  size="lg" 
                  className="w-full text-base px-8 bg-accent hover:bg-accent/90 shadow-lg"
                  onClick={() => trigger('medium')}
                >
                  Jetzt Umzugsfirmen vergleichen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/rechner" className="w-full sm:flex-1">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full text-base px-8 bg-white hover:bg-gray-50 border-2"
                  onClick={() => trigger('light')}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  KI-Umzugsrechner benutzen
                </Button>
              </Link>
            </div>

            {/* Trust Footer */}
            <p className="text-sm text-muted-foreground flex items-center justify-center lg:justify-start gap-2">
              <Shield className="h-4 w-4 text-success" />
              Kostenlos & unverbindlich. Ihre Daten werden sicher behandelt.
            </p>
          </div>

          {/* RIGHT COLUMN - Hero Image with White Banner Overlay */}
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
              
              {/* White Banner Overlay */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 max-w-sm border border-primary/10">
                  {/* Red Badge */}
                  <div className="mb-4">
                    <Badge className="bg-accent hover:bg-accent text-white px-3 py-1 text-xs">
                      🚀 Der erste KI-Rechner der Schweiz
                    </Badge>
                  </div>
                  
                  {/* Headline */}
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Jetzt mit <span className="text-accent">KI-Rechner</span><br />
                    bis zu 40% sparen
                  </h3>
                  
                  {/* Calculator Button/Widget */}
                  <Link to="/rechner">
                    <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-primary/20 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-foreground text-sm">Umzugsrechner</p>
                          <p className="text-xs text-muted-foreground">KI-gestützte Analyse</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
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
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-10 border border-primary/5">
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">Beliebteste Funktion</Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-3 justify-center">
                <Sparkles className="w-7 h-7 text-accent" />
                KI-Umzugsrechner
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground text-center max-w-xl mx-auto">
                Foto oder Video hochladen – sofortige Volumen- & Kostenschätzung
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
