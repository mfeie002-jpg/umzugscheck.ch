/**
 * Hero Test Variante C: Hybrid-Lösung
 * 
 * Features:
 * - Homepage behält grossen Hero
 * - Landingpages (Regionen, Services) bekommen einheitlichen kompakten Hero
 * - Konsistentes Design-System
 * - Optimiert für jeweiligen Kontext
 */

import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingDown, Shield, ArrowRight, Clock, Lock, 
  CheckCircle2, Camera, Users, Star, Sparkles,
  MapPin, Video, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// Simulated location context
const DEMO_LOCATION = {
  name: "Kanton Zürich",
  providerCount: 47,
  rating: 4.8,
  reviewCount: 2847
};

const HeroVariantC = memo(function HeroVariantC() {
  const navigate = useNavigate();
  const [liveCount, setLiveCount] = useState(12);
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");

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
        <title>Hero Test: Variante C - Hybrid-Lösung | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <main>
        {/* HERO SECTION - Hybrid: Optimized Compact with Premium Elements */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
          </div>

          <div className="container relative z-10 py-10 md:py-14 lg:py-16">
            <div className="grid lg:grid-cols-[1.2fr,1fr] gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
              {/* Left Column - Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-5 text-center lg:text-left"
              >
                {/* Location Badge + Savings Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-wrap justify-center lg:justify-start gap-2"
                >
                  <span className="inline-flex items-center gap-1.5 text-sm bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold border border-primary/20">
                    <MapPin className="w-4 h-4" />
                    {DEMO_LOCATION.name}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm bg-green-500/15 text-green-700 dark:text-green-400 px-4 py-2 rounded-full font-semibold border border-green-500/20">
                    <TrendingDown className="w-4 h-4" />
                    Bis 40% sparen
                  </span>
                </motion.div>

                {/* Headline - Compact but impactful */}
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                    <span className="text-foreground">Umzugsfirmen in </span>
                    <span className="text-primary">{DEMO_LOCATION.name}</span>
                    <br />
                    <span className="text-foreground">vergleichen</span>
                  </h1>
                </div>

                {/* Subtitle */}
                <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  <strong className="text-foreground">{DEMO_LOCATION.providerCount} geprüfte Firmen</strong> im Vergleich. 
                  Kostenlose Offerten in <strong className="text-primary">24h</strong>.
                </p>

                {/* Compact Trust Pills */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  <span className="inline-flex items-center gap-1 text-xs bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-full border border-border">
                    <Shield className="w-3 h-3" />
                    Geprüfte Firmen
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-full border border-border">
                    <Star className="w-3 h-3 fill-current text-yellow-500" />
                    {DEMO_LOCATION.rating} ({DEMO_LOCATION.reviewCount}+)
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-full border border-border">
                    <Clock className="w-3 h-3" />
                    In 2 Min.
                  </span>
                </div>

                {/* Live Counter - Subtle */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <Users className="w-4 h-4" />
                  <span>{liveCount} Personen vergleichen gerade</span>
                </motion.div>

                {/* Mobile CTA */}
                <div className="flex flex-col gap-3 lg:hidden pt-2">
                  <Button 
                    size="lg" 
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg h-14 font-bold"
                    onClick={() => navigate('/umzugsofferten')}
                  >
                    Kostenlos Offerten erhalten
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>

              {/* Right Column - Unified Compact Form with Tabs */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="hidden lg:block"
              >
                <div className="bg-card rounded-2xl shadow-xl p-5 border border-border">
                  {/* Tabs - Form/Video */}
                  <Tabs defaultValue="form" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted/50 mb-4">
                      <TabsTrigger 
                        value="form" 
                        className="text-sm font-medium gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white h-full rounded-lg"
                      >
                        <FileText className="h-4 w-4" />
                        Formular
                      </TabsTrigger>
                      <TabsTrigger 
                        value="video" 
                        className="text-sm font-medium gap-1.5 data-[state=active]:bg-secondary data-[state=active]:text-white h-full rounded-lg"
                      >
                        <Video className="h-4 w-4" />
                        Video
                        <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-secondary/20 text-secondary rounded font-normal">
                          NEU
                        </span>
                      </TabsTrigger>
                    </TabsList>

                    {/* Form Tab */}
                    <TabsContent value="form" className="space-y-3">
                      <p className="text-xs text-muted-foreground text-center">
                        Schritt 1 von 4 · Dauer ca. 2 Minuten
                      </p>
                      
                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">
                            Von (PLZ oder Ort)
                          </label>
                          <Input
                            type="text"
                            placeholder="z.B. 8001 oder Zürich"
                            value={fromQuery}
                            onChange={(e) => setFromQuery(e.target.value)}
                            className="h-11 text-base"
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
                            className="h-11 text-base"
                          />
                        </div>

                        <Button 
                          type="submit" 
                          size="lg" 
                          className="w-full h-12 text-base font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg"
                        >
                          Offerten erhalten
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </form>

                      <p className="text-xs text-muted-foreground text-center">
                        ✓ 100% kostenlos · ✓ Unverbindlich · ✓ Schweizer Service
                      </p>
                    </TabsContent>

                    {/* Video Tab */}
                    <TabsContent value="video" className="space-y-3">
                      <div 
                        className="border-2 border-dashed border-secondary/40 hover:border-secondary rounded-xl p-6 text-center cursor-pointer transition-all bg-gradient-to-br from-secondary/5 to-secondary/10 hover:from-secondary/10 hover:to-secondary/15"
                        onClick={() => navigate('/video-offerte')}
                      >
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                            <Camera className="h-6 w-6 text-secondary" />
                          </div>
                        </div>
                        <p className="font-semibold text-foreground mb-1">
                          Video oder Fotos hochladen
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          KI analysiert & berechnet automatisch
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1 text-secondary font-medium bg-secondary/10 px-2 py-1 rounded-full">
                            <CheckCircle2 className="h-3 w-3" />
                            Schneller
                          </span>
                          <span className="inline-flex items-center gap-1 text-secondary font-medium bg-secondary/10 px-2 py-1 rounded-full">
                            <CheckCircle2 className="h-3 w-3" />
                            Genauer
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Lock className="h-3 w-3 text-primary" />
                        <span>100% sicher · Nur für Ihre Offerte</span>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Demo Content Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full text-sm font-semibold mb-4 border border-primary/20">
                Test-Variante C
              </span>
              <h2 className="text-2xl font-bold mb-2">Hybrid-Lösung</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Kompakter Hero mit Premium-Elementen. Kombiniert das Beste aus A (Tabs, Animationen) 
                und B (Kompaktheit, Fokus). Optimiert für Landingpages.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Best of Both</h3>
                <p className="text-sm text-muted-foreground">
                  Tabs wie Homepage, aber kompakter. Video-Option nicht aufdringlich.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Lokaler Fokus</h3>
                <p className="text-sm text-muted-foreground">
                  Prominente Regions-Badge macht lokale Relevanz sofort klar.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Konsistenz</h3>
                <p className="text-sm text-muted-foreground">
                  Gleiche Elemente wie Homepage, aber angepasst an Landingpage-Kontext.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
});

export default HeroVariantC;
