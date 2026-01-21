/**
 * Investoren Landing Page
 * Business-focused page with visual impact
 * Clean metrics, minimal text, strong visuals
 */

import { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Vision10PillarSection } from "@/components/homepage/Vision10PillarSection";
import { RevenueStreamExamples } from "@/components/vision/RevenueStreamExamples";
import { UnitEconomicsDetailed } from "@/components/vision/UnitEconomicsDetailed";
import { MarketPotentialSection } from "@/components/vision/MarketPotentialSection";
import { ExitTimeline } from "@/components/vision/ExitTimeline";
import { VisionUniqueness } from "@/components/vision/VisionUniqueness";
import { VisionTractionDashboard } from "@/components/vision/VisionTractionDashboard";
import { VisionProfitabilityRoadmap } from "@/components/vision/VisionProfitabilityRoadmap";
import { VisionEmotionalHero } from "@/components/vision/VisionEmotionalHero";
import { VisionQuickStats } from "@/components/vision/VisionQuickStats";
import { VisionVisualDivider } from "@/components/vision/VisionVisualDivider";
import { VisionLanguageSwitcher } from "@/components/vision/VisionLanguageSwitcher";
import { ExpandAllToggle } from "@/components/vision/ExpandAllToggle";
import { VisionContactCTA } from "@/components/vision/VisionContactCTA";
import { VisionLiveStats } from "@/components/vision/VisionLiveStats";
import { VisionProgressIndicator } from "@/components/vision/VisionProgressIndicator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { VisionLanguage } from "@/lib/vision-translations";
import { StakeholderJokeBanner, StakeholderJokesGrid } from "@/components/stakeholder/StakeholderJokeBanner";
import { usePersona } from "@/hooks/usePersona";
import { FunNarrator } from "@/components/persona/FunNarrator";
import { FunInterruptCard } from "@/components/persona/FunInterruptCard";
import { FunSectionIntro } from "@/components/persona/FunSectionIntro";
import { FunCTA } from "@/components/persona/FunCTA";

// Translations
const translations: Record<'de' | 'bg' | 'it', {
  back: string;
  fullVision: string;
  badge: string;
  sections: { 
    businessModel: string; 
    pillarsTitle: string; 
    pillarsSubtitle: string; 
    revenueTitle: string; 
    unitTitle: string; 
    marketTitle: string 
  };
  footer: { interested: string; cta: string; visionBtn: string; familyBtn: string };
}> = {
  de: {
    back: "Zurück",
    fullVision: "Vollständige Vision",
    badge: "Investor Hub",
    sections: {
      businessModel: "Business Model",
      pillarsTitle: "10 Strategische Säulen",
      pillarsSubtitle: "Jede Säule ist ein eigenständiger Profit Center.",
      revenueTitle: "10 Einnahmequellen",
      unitTitle: "Unit Economics",
      marketTitle: "Marktpotenzial"
    },
    footer: {
      interested: "Interessiert?",
      cta: "Offen für strategische Partnerschaften und Investments.",
      visionBtn: "Vollständige Vision",
      familyBtn: "Einfache Erklärung"
    }
  },
  bg: {
    back: "Назад",
    fullVision: "Пълна визия",
    badge: "Investor Hub",
    sections: {
      businessModel: "Бизнес модел",
      pillarsTitle: "10 Стратегически стълба",
      pillarsSubtitle: "Всеки стълб е самостоятелен Profit Center.",
      revenueTitle: "10 източници на приходи",
      unitTitle: "Unit Economics",
      marketTitle: "Пазарен потенциал"
    },
    footer: {
      interested: "Заинтересовани?",
      cta: "Отворени за стратегически партньорства и инвестиции.",
      visionBtn: "Пълна визия",
      familyBtn: "Просто обяснение"
    }
  },
  it: {
    back: "Indietro",
    fullVision: "Visione Completa",
    badge: "Investor Hub",
    sections: {
      businessModel: "Business Model",
      pillarsTitle: "10 Pilastri Strategici",
      pillarsSubtitle: "Ogni pilastro è un Profit Center autonomo.",
      revenueTitle: "10 Fonti di Reddito",
      unitTitle: "Unit Economics",
      marketTitle: "Potenziale di Mercato"
    },
    footer: {
      interested: "Interessati?",
      cta: "Aperti a partnership strategiche e investimenti.",
      visionBtn: "Visione Completa",
      familyBtn: "Spiegazione Semplice"
    }
  }
};

export default function InvestorenLanding() {
  const [language, setLanguage] = useState<VisionLanguage>('de');
  const [allExpanded, setAllExpanded] = useState(false);
  const t = translations[language];
  const { persona, isPersonalized } = usePersona(language);

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Indicator */}
      <VisionProgressIndicator />
      
      <SEOHead
        pageType="home"
        url="https://umzugscheck.ch/investoren"
      />

      {/* Compact Header */}
      <div className="bg-background border-b border-secondary/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="min-h-[44px]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </Link>
            
            {/* Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              {t.badge}
            </div>
            
            <div className="flex items-center gap-2">
              <ExpandAllToggle
                isExpanded={allExpanded}
                onToggle={() => setAllExpanded(!allExpanded)}
                language={language}
              />
              <VisionLanguageSwitcher 
                currentLang={language} 
                onLanguageChange={setLanguage} 
              />
              <Link to="/vision">
                <Button variant="outline" size="sm" className="min-h-[44px] border-secondary/20 hover:bg-secondary/5">
                  {t.fullVision}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 1. HERO - Investor variant */}
      <VisionEmotionalHero language={language} variant="investor" />

      {/* PERSONA SECTION INTRO - Hero */}
      {isPersonalized && (
        <FunSectionIntro persona={persona} page="investoren" sectionId="hero" />
      )}

      {/* 2. LIVE STATS - Animated investor metrics */}
      <VisionLiveStats language={language} variant="investor" />

      {/* PERSONA INTERRUPT CARD */}
      {isPersonalized && (
        <FunInterruptCard persona={persona} page="investoren" afterSection="stats" />
      )}

      {/* 3. QUICK STATS - Investor-focused metrics */}
      <VisionQuickStats language={language} variant="investor" />

      {/* 4. VISUAL DIVIDER */}
      <VisionVisualDivider language={language} variant="business" />

      {/* 4. PROFITABILITY ROADMAP */}
      <VisionProfitabilityRoadmap language={language} />

      {/* PERSONA SECTION INTRO - Roadmap */}
      {isPersonalized && (
        <FunSectionIntro persona={persona} page="investoren" sectionId="roadmap" />
      )}

      {/* 5. TRACTION DASHBOARD */}
      <VisionTractionDashboard language={language} />

      {/* PERSONA INTERRUPT CARD */}
      {isPersonalized && (
        <FunInterruptCard persona={persona} page="investoren" afterSection="traction" />
      )}

      {/* 6. VISUAL DIVIDER */}
      <VisionVisualDivider language={language} variant="journey" />

      {/* 7. 10 BUSINESS PILLARS */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge className="mb-4 bg-primary/10 text-primary">{t.sections.businessModel}</Badge>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              {t.sections.pillarsTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.sections.pillarsSubtitle}
            </p>
          </motion.div>
          <Vision10PillarSection allExpanded={allExpanded} language={language} />
        </div>
      </section>

      {/* PERSONA SECTION INTRO - Pillars */}
      {isPersonalized && (
        <FunSectionIntro persona={persona} page="investoren" sectionId="pillars" />
      )}

      {/* 8. REVENUE STREAMS */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge className="mb-4 bg-secondary/10 text-secondary">553 CHF</Badge>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              {t.sections.revenueTitle}
            </h2>
          </motion.div>
          <RevenueStreamExamples language={language} />
        </div>
      </section>

      {/* PERSONA INTERRUPT CARD */}
      {isPersonalized && (
        <FunInterruptCard persona={persona} page="investoren" afterSection="revenue" />
      )}

      {/* 9. VISUAL DIVIDER */}
      <VisionVisualDivider language={language} variant="family" />

      {/* 10. UNIT ECONOMICS */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge className="mb-4 bg-primary/10 text-primary">90%+ Marge</Badge>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              {t.sections.unitTitle}
            </h2>
          </motion.div>
          <UnitEconomicsDetailed language={language} />
        </div>
      </section>

      {/* PERSONA SECTION INTRO - Economics */}
      {isPersonalized && (
        <FunSectionIntro persona={persona} page="investoren" sectionId="economics" />
      )}

      {/* 11. MARKET POTENTIAL */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge className="mb-4 bg-secondary/10 text-secondary">450k</Badge>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              {t.sections.marketTitle}
            </h2>
          </motion.div>
          <MarketPotentialSection language={language} />
        </div>
      </section>

      {/* PERSONA INTERRUPT CARD */}
      {isPersonalized && (
        <FunInterruptCard persona={persona} page="investoren" afterSection="market" />
      )}

      {/* 12. UNIQUENESS */}
      <ScrollReveal>
        <VisionUniqueness language={language} />
      </ScrollReveal>

      {/* 13. EXIT TIMELINE */}
      <ScrollReveal>
        <ExitTimeline language={language} />
      </ScrollReveal>

      {/* JOKES SECTION - Only for BG/IT */}
      {(language === 'bg' || language === 'it') && (
        <section className="py-12 bg-muted/10">
          <div className="container mx-auto px-4">
            <h3 className="text-xl font-bold text-center mb-6 text-foreground/80">
              {language === 'bg' ? '🌿 Зелена Мъдрост за Инвеститори' : '🌿 Saggezza Verde per Investitori'}
            </h3>
            <StakeholderJokesGrid language={language} count={6} />
          </div>
        </section>
      )}

      {/* FOOTER CTA */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">{t.footer.interested}</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            {t.footer.cta}
          </p>
          
          {/* Persona CTA */}
          {isPersonalized ? (
            <FunCTA persona={persona} page="investoren" index={0} />
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/vision">
                <Button size="lg">
                  {t.footer.visionBtn}
                </Button>
              </Link>
              <Link to="/family">
                <Button variant="outline" size="lg">
                  {t.footer.familyBtn}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Floating Contact CTA */}
      <VisionContactCTA language={language} variant="investor" />

      {/* FLOATING JOKE - Only for BG/IT */}
      {(language === 'bg' || language === 'it') && (
        <StakeholderJokeBanner language={language} variant="floating" />
      )}

      {/* Persona Narrator - Floating */}
      {isPersonalized && (
        <FunNarrator persona={persona} page="investoren" />
      )}
    </div>
  );
}
