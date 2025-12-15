import { memo } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Users, Video, Trophy, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MultiStepCalculator } from "./MultiStepCalculator";

export const EnhancedConversionHero = memo(function EnhancedConversionHero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[80vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      </div>

      <div className="container relative z-10 py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1fr,480px] gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 text-center lg:text-left order-2 lg:order-1"
          >
            {/* Savings Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/15 to-green-600/15 rounded-full px-4 py-2 border border-green-500/30 mx-auto lg:mx-0"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <TrendingDown className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-green-700 dark:text-green-400">Bis zu 40% sparen</span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.1]">
                Der beste Deal
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.1]">
                der ganzen <span className="text-primary">Schweiz.</span>
              </h1>
            </div>

            {/* Value Proposition */}
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Wir vergleichen <strong className="text-foreground">200+ Schweizer Umzugsfirmen</strong> – 
              Sie erhalten garantiert das beste Angebot zum fairsten Preis.
            </p>

            {/* USP Pills */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="inline-flex items-center gap-1.5 text-sm bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full font-medium">
                <TrendingDown className="w-3.5 h-3.5" />
                Bis 40% sparen
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                <Users className="w-3.5 h-3.5" />
                200+ Firmen
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm bg-secondary/10 text-secondary px-3 py-1.5 rounded-full font-medium">
                <Video className="w-3.5 h-3.5" />
                KI Video-Analyse
              </span>
            </div>

            {/* Live Activity Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full px-3 py-1.5 text-sm mx-auto lg:mx-0"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-medium">3 Personen vergleichen gerade</span>
            </motion.div>

            {/* Mobile CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:hidden pt-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta h-14 font-bold text-base"
                onClick={() => navigate('/umzugsofferten')}
              >
                Jetzt checken lassen
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto h-12 border-primary/30"
                onClick={() => navigate('/umzugsrechner?tab=ai')}
              >
                <Video className="w-5 h-5 mr-2 text-primary" />
                KI Video-Rechner
              </Button>
            </div>

            {/* Desktop Trust Badges */}
            <div className="hidden lg:flex flex-wrap gap-3 pt-4">
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-card border border-border px-4 py-2 rounded-full shadow-soft">
                <Shield className="w-4 h-4 text-primary" />
                SSL verschlüsselt
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-card border border-border px-4 py-2 rounded-full shadow-soft">
                <Trophy className="w-4 h-4 text-swiss-gold" />
                4.8 ★ Bewertung
              </span>
            </div>
          </motion.div>

          {/* Right - Multi-Step Form (Desktop only) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden lg:block"
          >
            <MultiStepCalculator />
          </motion.div>
        </div>
      </div>
    </section>
  );
});
