import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, CheckCircle2, Sparkles, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { AICalculator } from "./calculator/AICalculator";
import { useHaptic } from "@/hooks/use-haptic";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

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
    <>
      {/* MOBILE-FIRST HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* Mobile Hero with Background Image */}
        <div className="lg:hidden relative min-h-[70vh] flex items-center">
          {/* Background Image with Dark Overlay */}
          <div className="absolute inset-0 z-0">
            {heroImage ? (
              <>
                <img 
                  src={heroImage} 
                  alt="Familie beim Umzug" 
                  className="w-full h-full object-cover"
                  style={{ aspectRatio: '9/16' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
            )}
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="text-center text-white space-y-6">
              {/* Headline - Max 3 Lines */}
              <motion.h1 
                className="text-4xl sm:text-5xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Ihr Umzug zum<br />besten Preis.
              </motion.h1>

              {/* Subline */}
              <motion.p 
                className="text-lg sm:text-xl leading-relaxed text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                In 2 Minuten Angebote vergleichen<br />und bis zu 40% sparen.
              </motion.p>

              {/* CTAs */}
              <motion.div 
                className="flex flex-col gap-3 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link to="/firmen" className="w-full">
                  <Button 
                    size="lg" 
                    className="w-full text-base sm:text-lg h-14 bg-accent hover:bg-accent/90 shadow-xl"
                    onClick={() => trigger('medium')}
                  >
                    Jetzt vergleichen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/rechner" className="w-full">
                  <Button 
                    size="lg" 
                    variant="ghost"
                    className="w-full text-base sm:text-lg h-14 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 backdrop-blur-sm"
                    onClick={() => trigger('light')}
                  >
                    Kosten berechnen
                  </Button>
                </Link>
              </motion.div>

              {/* Social Proof Badges */}
              <motion.div 
                className="flex flex-col gap-3 pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.8/5</span>
                  </div>
                  <div className="h-4 w-px bg-white/30" />
                  <div className="font-semibold">
                    15'000+ Umzüge
                  </div>
                </div>
                <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs border border-white/20">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>LIVE: Neue Anfrage aus Zürich</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Desktop Hero (unchanged for desktop) */}
        <div className="hidden lg:block relative bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white" />
          
          <div className="container mx-auto px-4 py-16 lg:py-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* LEFT COLUMN - Text Content */}
              <div className="space-y-8 text-left">
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                    Ihr Umzug. Unser Vergleich. <span className="text-primary">Ihre Ersparnis.</span>
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Finden Sie in 2 Minuten die bestbewerteten Umzugsfirmen der Schweiz. Vergleichen Sie Preise, Bewertungen und Services – kostenlos, unverbindlich und perfekt auf Ihren Umzug abgestimmt.
                  </p>
                  <p className="text-lg text-foreground/70 italic font-medium">
                    Damit Ihr Umzug nicht Stress bedeutet, sondern ein neuer Anfang.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                      <p className="text-3xl font-bold text-foreground">40%</p>
                    </div>
                    <p className="text-sm text-muted-foreground">günstiger dank Vergleich</p>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="h-5 w-5 text-yellow-400 flex-shrink-0 fill-yellow-400" />
                      <p className="text-3xl font-bold text-foreground">4.8/5</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Zufriedenheit</p>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                      <p className="text-3xl font-bold text-foreground">15'000+</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Umzüge</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link to="/firmen" className="flex-1">
                    <Button 
                      size="lg" 
                      className="w-full text-base px-8 bg-accent hover:bg-accent/90 shadow-lg"
                      onClick={() => trigger('medium')}
                    >
                      Jetzt Umzugsfirmen vergleichen
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/rechner" className="flex-1">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full text-base px-8 bg-white hover:bg-gray-50 border-2"
                      onClick={() => trigger('light')}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      KI-Rechner
                    </Button>
                  </Link>
                </div>
              </div>

              {/* RIGHT COLUMN - Hero Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                  {heroImage ? (
                    <img 
                      src={heroImage} 
                      alt="Glückliche Familie beim Umzug" 
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
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
            </svg>
          </div>
        </div>
      </section>

      {/* KI-RECHNER SECTION - Full Width Card Below Hero */}
      <section className="bg-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl shadow-lg p-6 sm:p-8 border border-primary/10">
            {/* Header */}
            <div className="text-center mb-6">
              <Badge className="mb-3 bg-accent/10 text-accent border-accent/20">
                <Sparkles className="w-3 h-3 mr-1" />
                Erster KI-Rechner der Schweiz
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                KI-Umzugsrechner
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Laden Sie Fotos oder Videos hoch – sofortige Kostenschätzung
              </p>
            </div>

            {/* AI Calculator */}
            <AICalculator />
            
            {/* Trust Badges Below Calculator */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-6 border-t border-primary/10">
              <Badge variant="outline" className="text-xs">
                <CheckCircle2 className="w-3 h-3 mr-1 text-success" />
                Kostenlos
              </Badge>
              <Badge variant="outline" className="text-xs">
                <CheckCircle2 className="w-3 h-3 mr-1 text-success" />
                Unverbindlich
              </Badge>
              <Badge variant="outline" className="text-xs">
                <CheckCircle2 className="w-3 h-3 mr-1 text-success" />
                Bis zu 40% sparen
              </Badge>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
