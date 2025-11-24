import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Building2, Star, Shield, CheckCircle2, TrendingUp, Zap } from "lucide-react";
import { QuickCalculator } from "./calculator/QuickCalculator";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-primary-light/20 to-accent-light/10">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 -z-10">
        {/* Larger gradient orbs with better colors */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/15 to-primary/5 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-accent/15 to-accent/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Refined grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6TTM0IDJ2Mmgydi0yaC0yem0tNCAyaDJ2LTJoLTJ2MnptLTQgMGgydi0yaC0ydjJ6bS00IDBoMnYtMmgtMnYyem0tNCAwaDJ2LTJoLTJ2MnptLTQgMGgydi0yaC0ydjJ6bS00IDBoMnYtMmgtMnYyem0tNCAwaDJ2LTJoLTJ2MnptLTQgMGgydi0yaC0ydjJ6TTIgMnYyaDJ2LTJIMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/80"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <motion.div 
            className="space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/20 text-sm font-medium text-primary mb-4">
              <Zap className="w-4 h-4" />
              <span>Schweizer Marktführer für Umzugsvergleiche</span>
            </div>
            
            <h1 className="font-bold leading-[1.1]">
              Ihren Umzug <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">einfach & günstig</span> vergleichen
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              Kostenlos Offerten von <span className="text-primary font-semibold">200+ geprüften Umzugsfirmen</span> vergleichen und bis zu 40% sparen.
            </p>

            {/* Enhanced trust signals */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
              <motion.div 
                className="flex flex-col items-center lg:items-start gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent fill-accent" />
                  <span className="text-2xl font-bold text-foreground">4.8/5</span>
                </div>
                <span className="text-sm text-muted-foreground">Kundenbewertung</span>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center lg:items-start gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">200+</span>
                </div>
                <span className="text-sm text-muted-foreground">Geprüfte Firmen</span>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center lg:items-start gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-2xl font-bold text-foreground">12k+</span>
                </div>
                <span className="text-sm text-muted-foreground">Zufriedene Kunden</span>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center lg:items-start gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <span className="text-2xl font-bold text-foreground">40%</span>
                </div>
                <span className="text-sm text-muted-foreground">Durchschn. Ersparnis</span>
              </motion.div>
            </div>

            {/* Enhanced CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link to="/rechner" className="group">
                <Button size="lg" className="w-full sm:w-auto shadow-strong hover:shadow-hover transition-all group text-base px-8 py-7 rounded-xl">
                  <Calculator className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Umzugskosten berechnen
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/firmen" className="group">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-base px-8 py-7 rounded-xl">
                  <Building2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Umzugsfirmen vergleichen
                </Button>
              </Link>
            </motion.div>
            
            {/* Additional trust line */}
            <motion.p 
              className="text-sm text-muted-foreground flex flex-wrap items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Kostenlos & unverbindlich
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" />
                In 60 Sekunden
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" />
                TÜV-zertifiziert
              </span>
            </motion.p>
          </motion.div>

          {/* Right Column - Enhanced Calculator */}
          <motion.div 
            className="lg:pl-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-card rounded-3xl shadow-strong hover:shadow-hover p-8 md:p-10 border-2 border-primary/10 transition-all duration-300 hover:border-primary/20">
              <div className="mb-6 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light text-accent text-xs font-semibold uppercase tracking-wide">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Beliebter KI-Rechner</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Sofort Preis berechnen
                </h3>
                <p className="text-sm text-muted-foreground">
                  Erhalten Sie in 60 Sekunden eine präzise Kosteneinschätzung
                </p>
              </div>
              <QuickCalculator />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};
