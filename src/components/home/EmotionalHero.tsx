import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { QuickCalculator } from "@/components/calculator/QuickCalculator";
import { motion } from "framer-motion";
import { Shield, Clock, TrendingDown, Sparkles, CheckCircle2, Star } from "lucide-react";
import heroImage from "@/assets/hero-family-moving-joy.jpg";

export const EmotionalHero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-secondary/5 to-background">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${heroImage})`,
            filter: 'brightness(0.4)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
              x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
              scale: [null, Math.random() * 0.5 + 0.5]
            }}
            transition={{ 
              duration: Math.random() * 20 + 10, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/20"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Schweizer KI-Technologie • Familiengeführt • Premium Service
              </span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground"
              >
                Der intelligenteste Weg zum perfekten Umzug.
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl"
              >
                Unser <span className="text-primary font-semibold">KI-Preisrechner</span> liefert Ihnen in Sekunden eine präzise Offerte – transparent, fair und 100% schweizerisch.
              </motion.p>
            </div>

            {/* USP Bullets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { icon: Clock, text: "Sofortige Preisberechnung" },
                { icon: TrendingDown, text: "Marktvergleich garantiert" },
                { icon: CheckCircle2, text: "24/7 verfügbar" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all" asChild>
                <Link to="/rechner">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Jetzt Preis berechnen
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 backdrop-blur-sm bg-card/50" asChild>
                <Link to="/offerte-anfragen">
                  Offerte anfragen
                </Link>
              </Button>
            </motion.div>

            {/* Trust Line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-6 pt-4 border-t border-border/50"
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">4.9/5</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <span className="text-sm text-muted-foreground">12'000+ zufriedene Kunden</span>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-success" />
                <span className="text-sm text-muted-foreground">SSL-verschlüsselt</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Calculator Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* "Most Used Feature" Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-accent text-accent-foreground px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Meistgenutzte Funktion
              </div>
            </div>

            <Card className="border-2 border-primary/20 shadow-2xl backdrop-blur-sm bg-card/95 hover:shadow-primary/20 transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold mb-2 text-foreground">KI-Preisrechner</h3>
                  <p className="text-muted-foreground">Präzise Offerte in Sekunden</p>
                </div>
                
                <QuickCalculator />

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-success" />
                    <span className="text-muted-foreground">DSGVO-konform</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-muted-foreground">TÜV-zertifiziert</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating Elements */}
            <motion.div
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -top-6 -left-6 w-24 h-24 bg-accent/10 rounded-full blur-2xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path fill="hsl(var(--background))" fillOpacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
};
