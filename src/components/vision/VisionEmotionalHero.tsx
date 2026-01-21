/**
 * VisionEmotionalHero - Homepage-Style Hero with Rich Visuals
 * Same look & feel as homepage /umzugsfirmen/zug
 * Less text, more visual impact with proper dark overlay
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Globe, ArrowRight, Heart, Sparkles, Users, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { VisionLanguage } from "@/lib/vision-translations";

// Import new high-quality hero images - unique per variant
import heroVisionMain from "@/assets/vision/hero-vision-main.jpg";
import heroFamilyMain from "@/assets/vision/hero-family-main.jpg";
import heroInvestorMain from "@/assets/vision/hero-investor-main.jpg";

interface VisionEmotionalHeroProps {
  language: VisionLanguage;
  variant?: 'family' | 'investor' | 'full';
}

const content = {
  de: {
    badge: "🇨🇭 Weltweit einzigartig",
    headline: {
      family: "Ihr Umzug. Stressfrei.",
      investor: "Das First Full-Stack Umzugsportal",
      full: "Umziehen – endlich einfach."
    },
    subheadline: {
      family: "Während andere googeln, haben Sie schon 5 Offerten.",
      investor: "10 Revenue Streams. 95% KI. 90%+ Marge.",
      full: "KI-Präzision. Escrow-Sicherheit. Ein Ökosystem."
    },
    stats: [
      { icon: Globe, value: "Weltweit", label: "Einzigartig" },
      { icon: Zap, value: "95%", label: "KI-Automatisiert" },
      { icon: TrendingUp, value: "10×", label: "Revenue Streams" }
    ],
    cta: {
      primary: "Vision entdecken",
      secondary: "Live Demo"
    },
    tagline: "Win-Win-Win"
  },
  bg: {
    badge: "🇨🇭 Световен уникат",
    headline: {
      family: "Вашето преместване. Без стрес.",
      investor: "Първият Full-Stack портал за преместване",
      full: "Преместване – най-накрая лесно."
    },
    subheadline: {
      family: "Докато другите търсят, вие вече имате 5 оферти.",
      investor: "10 потока приходи. 95% AI. 90%+ марж.",
      full: "AI прецизност. Escrow сигурност. Една екосистема."
    },
    stats: [
      { icon: Globe, value: "Световен", label: "Уникат" },
      { icon: Zap, value: "95%", label: "AI-автоматизирано" },
      { icon: TrendingUp, value: "10×", label: "Потоци приходи" }
    ],
    cta: {
      primary: "Открий визията",
      secondary: "Live Demo"
    },
    tagline: "Win-Win-Win"
  },
  it: {
    badge: "🇨🇭 Unico al mondo",
    headline: {
      family: "Il tuo trasloco. Senza stress.",
      investor: "Il primo portale traslochi Full-Stack",
      full: "Traslocare – finalmente semplice."
    },
    subheadline: {
      family: "Mentre altri cercano, tu hai già 5 preventivi.",
      investor: "10 flussi di ricavo. 95% AI. 90%+ margine.",
      full: "Precisione AI. Sicurezza Escrow. Un ecosistema."
    },
    stats: [
      { icon: Globe, value: "Mondiale", label: "Unico" },
      { icon: Zap, value: "95%", label: "Automatizzato AI" },
      { icon: TrendingUp, value: "10×", label: "Flussi di Ricavo" }
    ],
    cta: {
      primary: "Scopri la visione",
      secondary: "Live Demo"
    },
    tagline: "Win-Win-Win"
  }
};

// Variant-specific images - unique per page
const variantImages = {
  family: heroFamilyMain,
  investor: heroInvestorMain,
  full: heroVisionMain,
};

export const VisionEmotionalHero = memo(({ language, variant = 'full' }: VisionEmotionalHeroProps) => {
  const t = content[language] || content.de;
  const currentImage = variantImages[variant];
  
  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Full-width Background Image with Homepage-Style Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentImage}
          alt="Umzug Schweiz"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Dark gradient overlay like homepage mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-black mb-6 shadow-lg">
              <Globe className="w-4 h-4" />
              {t.badge}
            </span>
          </motion.div>
          
          {/* Main Headline - Large & Bold */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight drop-shadow-lg"
          >
            {t.headline[variant]}
          </motion.h1>
          
          {/* Short Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto drop-shadow-md"
          >
            {t.subheadline[variant]}
          </motion.p>
          
          {/* Stats - Icon Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-3 gap-3 md:gap-4 mb-10 max-w-md mx-auto"
          >
            {t.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-center p-3 md:p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20"
              >
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-secondary mx-auto mb-1" />
                <p className="text-lg md:text-xl font-black text-white">{stat.value}</p>
                <p className="text-[10px] md:text-xs text-white/70">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
          
          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-6"
          >
            <Link to="/vision#vision-customer-usps">
              <Button size="lg" className="w-full sm:w-auto min-h-[52px] text-base font-bold px-8 bg-secondary hover:bg-secondary/90 shadow-xl group">
                <Sparkles className="w-5 h-5 mr-2" />
                {t.cta.primary}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto min-h-[52px] text-base font-bold px-8 border-2 border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm">
                {t.cta.secondary}
              </Button>
            </Link>
          </motion.div>
          
          {/* Tagline with Heart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-2 text-sm font-bold text-white/80"
          >
            <Heart className="w-4 h-4 fill-secondary text-secondary" />
            <span>{t.tagline}</span>
            <Heart className="w-4 h-4 fill-secondary text-secondary" />
          </motion.div>
          
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
});

VisionEmotionalHero.displayName = 'VisionEmotionalHero';
