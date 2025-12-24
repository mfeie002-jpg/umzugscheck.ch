import { memo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Users, Video, Trophy, Shield, ArrowRight, Clock, Lock, Sparkles, CheckCircle2, Camera } from "lucide-react";
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
import { PartnerLogos } from "@/components/trust/PartnerLogos";

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
      <section className="relative min-h-[70vh] sm:min-h-[75vh] lg:min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
        {/* Enhanced Background with Swiss-themed gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-15" />
          <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-primary/8 via-primary/3 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary/5 to-transparent" />
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

              {/* Headline - Trust-focused with visual hierarchy */}
              <div className="space-y-1 px-2 sm:px-0">
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold tracking-tight leading-[1.05]">
                  <span className="text-foreground">Umzugsfirmen</span>
                </h1>
                <span className="block text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold tracking-tight leading-[1.05]">
                  <span className="text-primary">vergleichen</span> & sparen
                </span>
              </div>

              {/* Value Proposition - Cleaner, more direct */}
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0">
                <strong className="text-foreground">200+ geprüfte Umzugsfirmen</strong> im Vergleich. 
                Kostenlose Offerten in <strong className="text-primary">24-48 Stunden</strong>.
              </p>

              {/* Simplified USP Pills */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start px-2 sm:px-0">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm bg-green-500/15 text-green-700 dark:text-green-400 px-3 py-2 sm:py-1.5 rounded-full font-semibold min-h-[36px] sm:min-h-0 border border-green-500/20">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Bis 40% sparen
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm bg-primary/10 text-primary px-3 py-2 sm:py-1.5 rounded-full font-semibold min-h-[36px] sm:min-h-0 border border-primary/20">
                  <Shield className="w-3.5 h-3.5" />
                  Alle Firmen geprüft
                </span>
              </div>

              {/* Live Activity Badge */}
              <UrgencyBadge variant="users" className="mx-auto lg:mx-0" />

              {/* Mobile: Hero Illustration */}
              <div className="lg:hidden py-2 sm:py-4">
                <HeroIllustration />
              </div>

              {/* Mobile CTA Buttons - Differentiated CTAs */}
              <div className="flex flex-col gap-3 lg:hidden pt-2 px-2 sm:px-0">
                <Button 
                  size="lg" 
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta h-14 font-bold text-base active:scale-[0.98] transition-transform"
                  onClick={handleHeroCTAClick}
                >
                  {getHeroCTAText()}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                {/* Secondary CTA: KI Video-Analyse - differenziert vom primären CTA */}
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full h-12 border-primary/30 bg-primary/5 hover:bg-primary/10 active:scale-[0.98] transition-transform"
                  onClick={() => navigate('/umzugsrechner?tab=ai')}
                >
                  <Camera className="w-5 h-5 mr-2 text-primary" />
                  KI Video-Analyse starten
                </Button>
              </div>
              
              {/* Trust Metrics - Clean, verifiable */}
              <PartnerLogos variant="hero" className="pt-1" />

              {/* Single line trust + time estimate */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground px-2 sm:px-0"
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
