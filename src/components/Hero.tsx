import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, CheckCircle2, Sparkles, Phone, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import { AICalculator } from "./calculator/AICalculator";
import { useHaptic } from "@/hooks/use-haptic";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export const Hero = () => {
  const PHONE_DISPLAY = "044 500 12 34";
  const PHONE_TEL = "+41445001234";
  const trustBadges = [
    "Familienbetrieb seit 1980",
    "5.0★ Google",
    "Versichert bis CHF 1 Mio.",
    "Region Zug & Zürich"
  ];
  const faqs = [
    {
      q: "Sind wir versichert?",
      a: "Ja, Transport- und Haftpflichtversicherung bis CHF 1 Mio."
    },
    {
      q: "Gibt es Festpreise?",
      a: "Wir bestätigen nach kurzem Telefonat einen verbindlichen Preis."
    },
    {
      q: "Können wir kurzfristig?",
      a: "Oft noch Slots in 24-48h. Am schnellsten kurz anrufen."
    },
    {
      q: "Schwere oder sensible Güter?",
      a: "Erfahrene Teams für Flügel, Safe, Keller/Attika, Server."
    }
  ];

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
      <section className="relative overflow-x-hidden">
        {/* Mobile Hero with Background Image */}
        <div className="lg:hidden relative h-[78vh] max-h-screen flex items-center">
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
          <div className="container mx-auto px-4 py-6 relative z-10">
            <div className="text-center text-white space-y-4 max-w-2xl mx-auto">
              {/* Headline - Max 3 Lines */}
              <motion.h1 
                className="text-4xl sm:text-5xl font-bold leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                Feierabend beginnt,<br />sobald wir da sind.
              </motion.h1>

              {/* Subline */}
              <motion.p 
                className="text-lg sm:text-xl leading-relaxed text-white/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Familiengeführter Umzugspartner für Zug & Zürich. Pünktlich, erreichbar, versichert.
              </motion.p>

              {/* CTAs */}
              <motion.div 
                className="flex flex-col gap-2 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button 
                  size="lg"
                  className="w-full text-base sm:text-lg min-h-[44px] h-14 bg-accent hover:bg-accent/90 shadow-xl"
                  onClick={() => trigger('medium')}
                  asChild
                >
                  <a href={`tel:${PHONE_TEL}`} aria-label={`Jetzt anrufen ${PHONE_DISPLAY}`}>
                    <Phone className="mr-2 h-5 w-5" /> Jetzt anrufen · {PHONE_DISPLAY}
                  </a>
                </Button>
                <Link to="/contact" className="w-full">
                  <Button 
                    size="lg" 
                    variant="ghost"
                    className="w-full text-base sm:text-lg min-h-[44px] h-14 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 backdrop-blur-sm"
                  >
                    Rückruf anfordern
                  </Button>
                </Link>
                <p className="text-sm text-white/80">2 Minuten klären – wir übernehmen den Rest.</p>
              </motion.div>

              {/* Trust Pills */}
              <motion.div 
                className="flex flex-wrap items-center justify-center gap-2 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {trustBadges.map((item) => (
                  <span key={item} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm">
                    {item}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Desktop Hero (unchanged for desktop) */}
        <div className="hidden lg:block relative bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white" />
          
          <div className="container mx-auto px-4 py-12 lg:py-16 relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* LEFT COLUMN - Text Content */}
              <div className="space-y-6 text-left">
                <div className="space-y-3">
                  <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                    Feierabend beginnt,<br className="hidden lg:block" /> sobald wir da sind.
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Familiengeführter Umzugspartner für Zug & Zürich. Pünktlich, versichert und telefonisch sofort erreichbar.
                  </p>
                  <p className="text-lg text-foreground/70 font-medium">
                    Wir klären Ihren Umzug in 2 Minuten am Telefon – damit Ihr Abend wirklich frei bleibt.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {trustBadges.map((item) => (
                    <span key={item} className="px-3 py-1 rounded-full bg-muted text-sm text-foreground/80">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                      <p className="text-3xl font-bold text-foreground">40+</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Jahre Erfahrung</p>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="h-5 w-5 text-yellow-400 flex-shrink-0 fill-yellow-400" />
                      <p className="text-3xl font-bold text-foreground">5.0</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Kundenbewertungen</p>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                      <p className="text-3xl font-bold text-foreground">24/7</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Telefonisch erreichbar</p>
                  </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button 
                    size="lg" 
                    className="flex-1 text-base px-8 min-h-[44px] bg-accent hover:bg-accent/90 shadow-lg"
                    onClick={() => trigger('medium')}
                    asChild
                  >
                    <a href={`tel:${PHONE_TEL}`} aria-label={`Jetzt anrufen ${PHONE_DISPLAY}`} className="flex items-center justify-center">
                      <PhoneCall className="mr-2 h-5 w-5" /> Jetzt anrufen · {PHONE_DISPLAY}
                    </a>
                  </Button>
                  <Link to="/contact" className="flex-1 min-w-[220px]">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full text-base px-8 min-h-[44px]"
                      onClick={() => trigger('light')}
                    >
                      Rückruf anfordern
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

      {/* Credibility Strip */}
      <section className="bg-white border-t border-b border-border/60">
        <div className="container mx-auto px-4 py-5 flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Warum Familien uns anrufen</p>
            <h3 className="text-xl font-semibold text-foreground">Eigene Teams, versichert, erreichbar – Zug & Zürich</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {trustBadges.map((item) => (
              <span key={item} className="px-3 py-1 rounded-full bg-muted text-sm text-foreground/80">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Family Proof Block */}
      <section className="bg-muted/40 border-b border-border/60">
        <div className="container mx-auto px-4 py-7 grid lg:grid-cols-3 gap-5 items-center">
          <div className="lg:col-span-2 space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Familienbetrieb</p>
            <h3 className="text-2xl font-semibold text-foreground">Feierabend Familie – wir kommen selbst.</h3>
            <p className="text-muted-foreground">Keine Subunternehmer. Eigene Teams, klarer Ansprechpartner, versichert bis CHF 1 Mio. Wir klären Ihren Umzug in wenigen Minuten am Telefon.</p>
            <div className="flex gap-3 flex-wrap">
              <Button size="lg" className="min-h-[44px]" asChild>
                <a href={`tel:${PHONE_TEL}`} aria-label={`Jetzt anrufen ${PHONE_DISPLAY}`} className="flex items-center gap-2">
                  <Phone className="h-5 w-5" /> Jetzt anrufen · {PHONE_DISPLAY}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="min-h-[44px]" asChild>
                <Link to="/contact">Rückruf anfordern</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border/70 bg-white shadow-sm min-h-[220px] flex items-center justify-center">
            {heroImage ? (
              <img src={heroImage} alt="Familie Feierabend" className="w-full h-full object-cover" />
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <p className="font-semibold">Familie Feierabend</p>
                <p className="text-sm">Zug & Zürich – eigene Teams</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Objection-killer FAQ */}
      <section className="bg-white border-b border-border/60">
        <div className="container mx-auto px-4 py-8 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Schnell geklärt</p>
              <h3 className="text-2xl font-semibold text-foreground">Häufige Fragen, sofort beantwortet</h3>
            </div>
            <Button size="lg" className="min-h-[44px]" asChild>
              <a href={`tel:${PHONE_TEL}`} aria-label={`Jetzt anrufen ${PHONE_DISPLAY}`} className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5" /> Jetzt anrufen · {PHONE_DISPLAY}
              </a>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {faqs.map((item) => (
              <div key={item.q} className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-1">
                <p className="font-semibold text-foreground">{item.q}</p>
                <p className="text-sm text-muted-foreground">{item.a}</p>
                <a href={`tel:${PHONE_TEL}`} className="text-sm text-primary font-medium hover:underline">Am schnellsten klären wir das telefonisch.</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Mobile Phone CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
        <div className="bg-background/95 backdrop-blur border-t border-border shadow-lg pb-[env(safe-area-inset-bottom)]">
          <Button
            size="lg"
            className="w-full justify-center gap-2 rounded-none min-h-[44px] py-3"
            asChild
          >
            <a href={`tel:${PHONE_TEL}`} aria-label={`Jetzt anrufen ${PHONE_DISPLAY}`}>
              <Phone className="h-5 w-5" /> Jetzt anrufen · {PHONE_DISPLAY}
            </a>
          </Button>
          <Link to="/contact" className="block w-full text-center text-sm py-2 text-muted-foreground hover:text-primary">
            Rückruf anfordern
          </Link>
        </div>
      </div>

      {/* KI-RECHNER SECTION - Full Width Card Below Hero */}
      <section id="ki-rechner-section" className="bg-white py-7 sm:py-10">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl shadow-lg p-6 sm:p-7 border border-primary/10">
            {/* Header */}
            <div className="text-center mb-5">
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
            <div className="flex flex-wrap items-center justify-center gap-4 mt-5 pt-5 border-t border-primary/10">
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
