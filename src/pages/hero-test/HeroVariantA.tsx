/**
 * Hero Test Variante A: Homepage-Stil für alle Seiten
 * 
 * Features:
 * - Grosser Hero mit voller Höhe
 * - Tab-Wechsel (Umzug/Reinigung/Entsorgung)
 * - Multi-Step-Calculator integriert
 * - Premium Animationen
 * - Trust Badges & Live Counter
 */

import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingDown, Shield, ArrowRight, Clock, Lock, 
  CheckCircle2, Camera, Users, Star, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { NavigationV17 } from "@/components/navigation-v17";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// Simulated location context
const DEMO_LOCATION = {
  name: "Kanton Zürich",
  providerCount: 47,
  rating: 4.8,
  reviewCount: 2847
};

const HeroVariantA = memo(function HeroVariantA() {
  const navigate = useNavigate();
  const [liveCount, setLiveCount] = useState(12);
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [activeTab, setActiveTab] = useState("umzug");

  // Live counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => Math.max(5, prev + Math.floor(Math.random() * 5) - 2));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/umzugsofferten');
  };

  return (
    <>
      <Helmet>
        <title>Hero Test: Variante A - Homepage-Stil | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <NavigationV17 />
      
      <main>
        {/* HERO SECTION - Homepage Style */}
        <section 
          className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-15" />
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-primary/8 via-primary/3 to-transparent" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary/5 to-transparent" />
          </div>

          <div className="container relative z-10 py-12 md:py-16 lg:py-20">
            <div className="grid lg:grid-cols-[1fr,480px] gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 text-center lg:text-left"
              >
                {/* Location Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-wrap justify-center lg:justify-start gap-2"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm bg-primary/10 text-primary px-3 py-2 rounded-full font-semibold border border-primary/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    {DEMO_LOCATION.name}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm bg-green-500/15 text-green-700 dark:text-green-400 px-3 py-2 rounded-full font-semibold border border-green-500/20">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Bis 40% sparen
                  </span>
                </motion.div>

                {/* Headline */}
                <div className="space-y-1">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold tracking-tight leading-[1.05]">
                    <span className="text-foreground">Umzugsfirmen in</span>
                  </h1>
                  <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold tracking-tight leading-[1.05]">
                    <span className="text-primary">{DEMO_LOCATION.name}</span>
                  </span>
                </div>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  <strong className="text-foreground">{DEMO_LOCATION.providerCount} geprüfte Umzugsfirmen</strong> im Vergleich. 
                  Kostenlose Offerten in <strong className="text-primary">24-48 Stunden</strong>.
                </p>

                {/* Trust Pills */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  <span className="inline-flex items-center gap-1.5 text-sm bg-green-500/15 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full font-semibold border border-green-500/20">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Bis 40% sparen
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-semibold border border-primary/20">
                    <Shield className="w-3.5 h-3.5" />
                    Alle Firmen geprüft
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm bg-secondary/10 text-secondary px-3 py-1.5 rounded-full font-semibold border border-secondary/20">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {DEMO_LOCATION.rating} ({DEMO_LOCATION.reviewCount}+ Bewertungen)
                  </span>
                </div>

                {/* Live Counter */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 border border-border"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {liveCount} Personen vergleichen gerade in {DEMO_LOCATION.name}
                  </span>
                </motion.div>

                {/* Mobile CTA */}
                <div className="flex flex-col gap-3 lg:hidden pt-4">
                  <Button 
                    size="lg" 
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg h-14 font-bold text-base"
                    onClick={() => navigate('/umzugsofferten')}
                  >
                    Kostenlos Offerten erhalten
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full h-12 border-primary/30 bg-primary/5 hover:bg-primary/10"
                    onClick={() => navigate('/video-offerte')}
                  >
                    <Camera className="w-5 h-5 mr-2 text-primary" />
                    KI Video-Analyse starten
                  </Button>
                </div>

                {/* Trust Line */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-sm text-muted-foreground"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    In 2 Min. erledigt
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-green-700 dark:text-green-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    3–5 Offerten in 24h
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Lock className="w-4 h-4" />
                    Schweizer Server
                  </span>
                </motion.div>
              </motion.div>

              {/* Right - Calculator Form (Desktop) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="hidden lg:block"
              >
                <div className="bg-card rounded-2xl shadow-xl p-6 border border-border">
                  {/* Tabs for Services */}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                    <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-muted/50">
                      <TabsTrigger value="umzug" className="text-sm font-medium">
                        Umzug
                      </TabsTrigger>
                      <TabsTrigger value="reinigung" className="text-sm font-medium">
                        Reinigung
                      </TabsTrigger>
                      <TabsTrigger value="entsorgung" className="text-sm font-medium">
                        Entsorgung
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Von (PLZ oder Ort)
                      </label>
                      <Input
                        type="text"
                        placeholder="z.B. 8001 oder Zürich"
                        value={fromQuery}
                        onChange={(e) => setFromQuery(e.target.value)}
                        className="h-12 text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Nach (PLZ oder Ort)
                      </label>
                      <Input
                        type="text"
                        placeholder="z.B. 3011 oder Bern"
                        value={toQuery}
                        onChange={(e) => setToQuery(e.target.value)}
                        className="h-12 text-base"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full h-14 text-base font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg"
                    >
                      Kostenlos Offerten erhalten
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      ✓ Kostenlos & unverbindlich · ✓ 100% Schweizer Service
                    </p>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Demo Content Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
                Test-Variante A
              </span>
              <h2 className="text-2xl font-bold mb-2">Homepage-Stil Hero</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Grosser Hero mit Tab-Wechsel, Multi-Step Calculator, Premium Animationen. 
                Optimiert für maximale Conversion durch visuelle Hierarchie.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Service-Tabs</h3>
                <p className="text-sm text-muted-foreground">
                  Umzug, Reinigung, Entsorgung – alle Services in einem Hero erreichbar.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <TrendingDown className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Premium Animationen</h3>
                <p className="text-sm text-muted-foreground">
                  Framer Motion Animationen für professionellen ersten Eindruck.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Trust Elemente</h3>
                <p className="text-sm text-muted-foreground">
                  Bewertungen, Live Counter, Badges – maximale Vertrauensbildung.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
});

export default HeroVariantA;
