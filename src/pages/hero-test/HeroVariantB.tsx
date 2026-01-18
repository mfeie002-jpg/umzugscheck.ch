/**
 * Hero Test Variante B: Landingpage-Stil (Kompakt)
 * 
 * Features:
 * - Kompakter Hero mit Hintergrundbild
 * - Schnelle PLZ-Eingabe
 * - Trust Badges prominent
 * - Fokus auf schnelle Lead-Generierung
 */

import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, ArrowRight, Star, CheckCircle, Users, 
  TrendingUp, Shield, Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

// Demo background image
const HERO_BG = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80";

// Simulated location context
const DEMO_LOCATION = {
  name: "Kanton Zürich",
  providerCount: 47,
  rating: 4.8,
  reviewCount: 2847
};

const HeroVariantB = memo(function HeroVariantB() {
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
        <title>Hero Test: Variante B - Landingpage-Stil | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <main>
        {/* HERO SECTION - Landingpage Style with Background Image */}
        <section className="relative min-h-[75vh] md:min-h-[80vh] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={HERO_BG}
              alt={`Umzugsfirmen in ${DEMO_LOCATION.name} vergleichen`}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/55 to-black/45" />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
              {/* Left Column - Text Content */}
              <div className="text-left">
                {/* Feature Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-3 mb-6"
                >
                  <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-lg">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-secondary uppercase tracking-wide">BIS 40% SPAREN</div>
                      <div className="text-xs text-muted-foreground">durch Vergleich</div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-primary uppercase tracking-wide">SCHWEIZER INNOVATION</div>
                      <div className="text-xs text-muted-foreground">KI Video-Rechner</div>
                    </div>
                  </div>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                >
                  Umzugsfirmen in
                  <br className="hidden sm:block" />
                  <span className="text-secondary"> {DEMO_LOCATION.name}</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-base md:text-lg lg:text-xl text-white/90 mb-6 max-w-xl"
                >
                  Vergleichen Sie kostenlos {DEMO_LOCATION.providerCount}+ geprüfte Umzugsfirmen 
                  und sparen Sie bis zu 40% bei Ihrem Umzug.
                </motion.p>

                {/* Trust Pills */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap gap-3 mb-6"
                >
                  <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border border-white/20">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span>Bis 40% günstiger</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border border-white/20">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{DEMO_LOCATION.rating} Sterne</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border border-white/20">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span>{DEMO_LOCATION.providerCount}+ Firmen</span>
                  </div>
                </motion.div>

                {/* Live Signal */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 mb-6"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <Users className="w-4 h-4 text-white/80" />
                  <span className="text-sm text-white">
                    {liveCount} Personen vergleichen gerade im {DEMO_LOCATION.name}
                  </span>
                </motion.div>

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="lg:hidden"
                >
                  <Button 
                    size="lg"
                    onClick={() => navigate('/umzugsofferten')}
                    className="w-full h-14 text-base font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg"
                  >
                    Kostenlos Offerten erhalten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>

              {/* Right Column - Compact Calculator Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-auto">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-foreground mb-1">
                      Jetzt Offerten vergleichen
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Kostenlos & unverbindlich in 2 Minuten
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Von (PLZ oder Ort)
                      </label>
                      <Input
                        type="text"
                        placeholder="z.B. 8001 oder Zürich"
                        value={fromQuery}
                        onChange={(e) => setFromQuery(e.target.value)}
                        className="h-12 text-base border-border"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Nach (PLZ oder Ort)
                      </label>
                      <Input
                        type="text"
                        placeholder="z.B. 3011 oder Bern"
                        value={toQuery}
                        onChange={(e) => setToQuery(e.target.value)}
                        className="h-12 text-base border-border"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full h-14 text-base font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg"
                    >
                      Offerten erhalten
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </form>

                  {/* Trust badges below form */}
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>100% kostenlos</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Geprüfte Firmen</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{DEMO_LOCATION.rating}/5</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Demo Content Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold mb-4">
                Test-Variante B
              </span>
              <h2 className="text-2xl font-bold mb-2">Landingpage-Stil Hero</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Kompakter Hero mit Hintergrundbild, schnelle PLZ-Eingabe, 
                fokussiert auf schnelle Lead-Generierung.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Visuell ansprechend</h3>
                <p className="text-sm text-muted-foreground">
                  Starkes Hero-Bild schafft emotionale Verbindung zum Umzug.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <ArrowRight className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Schnelle Conversion</h3>
                <p className="text-sm text-muted-foreground">
                  Kompaktes Formular für schnelle Lead-Erfassung ohne Ablenkung.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Trust im Fokus</h3>
                <p className="text-sm text-muted-foreground">
                  Prominente Trust-Badges direkt sichtbar für sofortiges Vertrauen.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
});

export default HeroVariantB;
