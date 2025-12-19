import { memo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Users, Video, Trophy, Shield, ArrowRight, Clock, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MultiStepCalculator } from "./MultiStepCalculator";
import { MobileFormSheet } from "./MobileFormSheet";
import { HeroIllustration } from "./HeroIllustration";
import { UrgencyBadge } from "./UrgencyBadge";
import { useABTest } from "@/hooks/use-ab-test";
import { CheckyAvatar } from "./CheckyAvatar";
import { HeroTrustBadges } from "./HeroTrustBadges";
import { DataPrivacyBadge } from "./DataPrivacyBadge";

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
      case 'variant_b': return 'Mein Sparpotenzial berechnen';
      default: return 'Kostenlos Offerten erhalten';
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
      <section className="relative min-h-[75vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        </div>

        <div className="container relative z-10 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-[1fr,480px] gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1"
            >
              {/* Urgency Badge - More compact on mobile */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap justify-center lg:justify-start gap-2"
              >
                <UrgencyBadge variant="savings" />
                <UrgencyBadge variant="time" className="hidden sm:inline-flex" />
              </motion.div>

              {/* Headline - Optimized with trust-focused messaging */}
              <div className="space-y-1 px-2 sm:px-0">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.15]">
                  Ihr sicherster Weg
                </h1>
                <span className="block text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.15]">
                  zum besten <span className="text-primary">Preis.</span>
                </span>
              </div>

              {/* Value Proposition - Benefit-focused */}
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0">
                Erhalten Sie in <strong className="text-foreground">2 Minuten</strong> Ihren exakten Preis – 
                wir vergleichen <strong className="text-foreground">200+ geprüfte Schweizer Umzugsfirmen</strong> für Sie.
              </p>

              {/* USP Pills - Better touch targets */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start px-2 sm:px-0">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-2 sm:py-1.5 rounded-full font-medium min-h-[36px] sm:min-h-0">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Bis 40% sparen
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm bg-primary/10 text-primary px-3 py-2 sm:py-1.5 rounded-full font-medium min-h-[36px] sm:min-h-0">
                  <Users className="w-3.5 h-3.5" />
                  200+ Firmen
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm bg-amber-500/10 text-amber-700 dark:text-amber-400 px-3 py-2 sm:py-1.5 rounded-full font-medium min-h-[36px] sm:min-h-0">
                  <Sparkles className="w-3.5 h-3.5" />
                  Abnahmegarantie
                </span>
              </div>

              {/* Live Activity Badge */}
              <UrgencyBadge variant="users" className="mx-auto lg:mx-0" />

              {/* Mobile: Hero Illustration */}
              <div className="lg:hidden py-2 sm:py-4">
                <HeroIllustration />
              </div>

              {/* Mobile CTA Buttons - Improved touch targets */}
              <div className="flex flex-col gap-3 lg:hidden pt-2 px-2 sm:px-0">
                <Button 
                  size="lg" 
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta h-14 font-bold text-base active:scale-[0.98] transition-transform"
                  onClick={handleHeroCTAClick}
                >
                  {getHeroCTAText()}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full h-12 border-primary/30 active:scale-[0.98] transition-transform"
                  onClick={() => navigate('/umzugsrechner?tab=ai')}
                >
                  <Video className="w-5 h-5 mr-2 text-primary" />
                  {getVideoCTAText()}
                </Button>
              </div>

              {/* Data Privacy Badge - Prominent placement */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex flex-col items-center lg:items-start gap-3 px-2 sm:px-0"
              >
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    Server in der Schweiz
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                    <Lock className="w-3.5 h-3.5 text-primary" />
                    SSL-verschlüsselt
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20 font-medium text-green-700 dark:text-green-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Keine Werbeanrufe. Versprochen.
                  </span>
                </div>
              </motion.div>

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

            {/* Right - Multi-Step Form (Desktop only) + Checky Avatar + Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="hidden lg:flex flex-col gap-4"
            >
              {/* Checky Avatar above form */}
              <CheckyAvatar 
                size="md" 
                message="Hallo! Ich bin Checky – Ihre KI-Assistenz. Ich finde in Sekunden die besten Umzugsfirmen für Sie."
              />
              
              <MultiStepCalculator />
              
              {/* Trust Badges below form */}
              <HeroTrustBadges variant="below-form" />
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
