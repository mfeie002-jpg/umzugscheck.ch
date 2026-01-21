/**
 * Vision Hero Section with Executive Summary
 * Clear mission + 3 Investor CTAs + Key Stats
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Play, FileText, Calendar, Rocket, 
  TrendingUp, Users, DollarSign, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionHeroExecutiveProps {
  language: VisionLanguage;
  onDemoClick?: () => void;
  onPitchDeckClick?: () => void;
  onContactClick?: () => void;
}

const content = {
  de: {
    badge: "Stakeholder & Investor Hub",
    headline: "Wir revolutionieren, wie die Schweiz umzieht",
    subheadline: "Eine KI-gestützte Plattform mit 10 Einnahmequellen, 90%+ Marge und dem Potenzial, der MOVU-Killer zu werden.",
    
    // 3 CTAs
    ctas: {
      demo: "Demo ansehen",
      demoSub: "60 Sek. Video",
      pitchDeck: "Pitch Deck",
      pitchDeckSub: "PDF Download",
      contact: "Gespräch buchen",
      contactSub: "15 Min. Call"
    },
    
    // Key Stats (Traction-focused)
    stats: [
      { value: "Live", label: "Status", icon: Rocket, color: "text-green-500" },
      { value: "553 CHF", label: "Revenue/Kunde", icon: DollarSign, color: "text-primary" },
      { value: "90%+", label: "Contribution Margin", icon: TrendingUp, color: "text-primary" },
      { value: "10", label: "Revenue Streams", icon: Shield, color: "text-primary" }
    ],
    
    // Why now
    whyNow: {
      title: "Warum jetzt?",
      points: [
        "450'000 Umzüge/Jahr in der Schweiz – fragmentierter Markt ohne Leader",
        "MOVU für 20 Mio verkauft – hatte nur 3 Revenue Streams, wir haben 10",
        "KI-Automatisierung ermöglicht 90%+ Margen (vs. 20% bei Klassikern)",
        "First-Mover mit Fintech-Layer (Escrow) + Computer Vision"
      ]
    }
  },
  bg: {
    badge: "Hub за заинтересовани страни и инвеститори",
    headline: "Революционизираме начина, по който Швейцария се мести",
    subheadline: "AI платформа с 10 източника на приходи, 90%+ марж и потенциал да бъде MOVU-killer.",
    
    ctas: {
      demo: "Гледай демо",
      demoSub: "60 сек видео",
      pitchDeck: "Pitch Deck",
      pitchDeckSub: "PDF Download",
      contact: "Резервирай разговор",
      contactSub: "15 мин. call"
    },
    
    stats: [
      { value: "Live", label: "Статус", icon: Rocket, color: "text-green-500" },
      { value: "553 CHF", label: "Приход/клиент", icon: DollarSign, color: "text-primary" },
      { value: "90%+", label: "Contribution Margin", icon: TrendingUp, color: "text-primary" },
      { value: "10", label: "Източници на приходи", icon: Shield, color: "text-primary" }
    ],
    
    whyNow: {
      title: "Защо сега?",
      points: [
        "450'000 премествания/година в Швейцария – фрагментиран пазар без лидер",
        "MOVU продаден за 20 млн – имаше само 3 revenue streams, ние имаме 10",
        "AI автоматизация позволява 90%+ маржове (vs. 20% при класическите)",
        "First-Mover с Fintech-Layer (Escrow) + Computer Vision"
      ]
    }
  }
};

export const VisionHeroExecutive = memo(({ 
  language, 
  onDemoClick,
  onPitchDeckClick,
  onContactClick 
}: VisionHeroExecutiveProps) => {
  const t = content[language];
  
  return (
    <section id="vision-hero" className="py-8 md:py-20 bg-gradient-to-b from-primary/10 via-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4 md:mb-6"
          >
            <Badge variant="secondary" className="text-xs md:text-sm px-3 md:px-4 py-1 md:py-1.5">
              {t.badge}
            </Badge>
          </motion.div>
          
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 md:mb-4 leading-tight px-2"
          >
            {t.headline}
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg lg:text-xl text-muted-foreground text-center mb-6 md:mb-8 max-w-3xl mx-auto px-2"
          >
            {t.subheadline}
          </motion.p>
          
          {/* 3 CTAs - Stack on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-8 md:mb-10"
          >
            <Button 
              size="lg" 
              onClick={onDemoClick}
              className="gap-2 min-h-[52px] w-full sm:w-auto sm:min-w-[160px] touch-manipulation active:scale-[0.98] transition-transform"
            >
              <Play className="w-4 h-4 flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">{t.ctas.demo}</div>
                <div className="text-xs opacity-80">{t.ctas.demoSub}</div>
              </div>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={onPitchDeckClick}
              className="gap-2 min-h-[52px] w-full sm:w-auto sm:min-w-[160px] touch-manipulation active:scale-[0.98] transition-transform"
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">{t.ctas.pitchDeck}</div>
                <div className="text-xs opacity-80">{t.ctas.pitchDeckSub}</div>
              </div>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={onContactClick}
              className="gap-2 min-h-[52px] w-full sm:w-auto sm:min-w-[160px] touch-manipulation active:scale-[0.98] transition-transform"
            >
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">{t.ctas.contact}</div>
                <div className="text-xs opacity-80">{t.ctas.contactSub}</div>
              </div>
            </Button>
          </motion.div>
          
          {/* Key Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10"
          >
            {t.stats.map((stat, i) => (
              <div 
                key={i} 
                className="p-3 md:p-4 rounded-xl bg-background border shadow-sm text-center"
              >
                <stat.icon className={`w-4 h-4 md:w-5 md:h-5 mx-auto mb-1.5 md:mb-2 ${stat.color}`} />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground leading-tight">{stat.label}</div>
              </div>
            ))}
          </motion.div>
          
          {/* Why Now Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-900 text-white rounded-xl p-4 md:p-6"
          >
            <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
              <Rocket className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
              {t.whyNow.title}
            </h3>
            <ul className="grid gap-2 md:gap-3 md:grid-cols-2">
              {t.whyNow.points.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                  <span className="text-primary mt-0.5 flex-shrink-0">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
});

VisionHeroExecutive.displayName = 'VisionHeroExecutive';
