import { memo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Users, Video, Trophy, Shield, ArrowRight, Clock, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MultiStepCalculator } from "./MultiStepCalculator";
import { MobileFormSheet } from "./MobileFormSheet";
import { HeroIllustration } from "./HeroIllustration";
import { UrgencyBadge } from "./UrgencyBadge";
import { useABTest } from "@/hooks/use-ab-test";

export const EnhancedConversionHero = memo(function EnhancedConversionHero() {
  const navigate = useNavigate();
  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);
  
  // A/B Test variants
  const { variant: heroCTAVariant, trackConversion: trackHeroCTA } = useABTest('hero_cta');
  const { variant: videoCTAVariant } = useABTest('video_cta');
  
  // CTA text based on A/B test variant
  const getHeroCTAText = () => {
    switch (heroCTAVariant) {
      case 'variant_a': return 'Kostenlos Offerten erhalten';
      case 'variant_b': return 'Jetzt vergleichen & sparen';
      default: return 'Jetzt checken lassen';
    }
  };
  
  const getVideoCTAText = () => {
    return videoCTAVariant === 'variant_a' ? 'Video aufnehmen & sparen' : 'KI Video-Rechner';
  };
  
  const handleHeroCTAClick = () => {
    trackHeroCTA('hero_cta_click');
    setIsMobileFormOpen(true);
  };

  return (
    <>
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
              {/* Urgency Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap justify-center lg:justify-start gap-2"
              >
                <UrgencyBadge variant="savings" />
                <UrgencyBadge variant="time" className="hidden sm:inline-flex" />
              </motion.div>

              {/* Headline - SEO optimized */}
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.1]">
                  Umzugsfirmen vergleichen:
                </h1>
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.1]">
                  Der beste Deal der <span className="text-primary">Schweiz.</span>
                </span>
              </div>

              {/* Value Proposition */}
              <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Wir vergleichen <strong className="text-foreground">200+ Schweizer Umzugsfirmen</strong> – 
                Sie erhalten garantiert das beste Angebot zum fairsten Preis.
              </p>

              {/* USP Pills - Including Cleaning Guarantee for Swiss market */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="inline-flex items-center gap-1.5 text-sm bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full font-medium">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Bis 40% sparen
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                  <Users className="w-3.5 h-3.5" />
                  200+ Firmen
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm bg-amber-500/10 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  Reinigung mit Abnahmegarantie
                </span>
              </div>

              {/* Live Activity Badge */}
              <UrgencyBadge variant="users" className="mx-auto lg:mx-0" />

              {/* Mobile: Hero Illustration */}
              <div className="lg:hidden py-4">
                <HeroIllustration />
              </div>

              {/* Mobile CTA Buttons - Opens Bottom Sheet */}
              <div className="flex flex-col sm:flex-row gap-3 lg:hidden pt-2">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta h-14 font-bold text-base"
                  onClick={handleHeroCTAClick}
                >
                  {getHeroCTAText()}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto h-12 border-primary/30"
                  onClick={() => navigate('/umzugsrechner?tab=ai')}
                >
                  <Video className="w-5 h-5 mr-2 text-primary" />
                  {getVideoCTAText()}
                </Button>
              </div>

              {/* Time estimate + expectation setting */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 text-sm"
              >
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  In nur 2 Minuten
                </span>
                <span className="hidden sm:inline text-border">•</span>
                <span className="inline-flex items-center gap-2 font-medium text-green-700 dark:text-green-400">
                  3–5 Offerten in 24–48h
                </span>
                <span className="hidden sm:inline text-border">•</span>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Lock className="w-3.5 h-3.5" />
                  Daten bleiben in der Schweiz
                </span>
              </motion.div>

              {/* Desktop Trust Badges */}
              <div className="hidden lg:flex flex-wrap gap-3 pt-2">
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

      {/* Mobile Bottom Sheet Form */}
      <MobileFormSheet 
        isOpen={isMobileFormOpen} 
        onClose={() => setIsMobileFormOpen(false)} 
      />
    </>
  );
});
