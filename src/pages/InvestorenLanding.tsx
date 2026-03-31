/**
 * Investoren Landing Page — Restructured
 * 5 Beweise: Gebaut → Wirtschaftlich → Skalierbar → Moat → Risikoreduktion
 */

import { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { RevenueStreamExamples } from "@/components/vision/RevenueStreamExamples";
import { UnitEconomicsDetailed } from "@/components/vision/UnitEconomicsDetailed";
import { FundingRoadmapSection } from "@/components/vision/FundingRoadmapSection";
import { SEOContentMoatSection } from "@/components/vision/SEOContentMoatSection";
import { WhyInvestSection } from "@/components/vision/WhyInvestSection";
import { ModularerWarenkorbSection } from "@/components/vision/ModularerWarenkorbSection";
import { InvestorClosingSection } from "@/components/vision/InvestorClosingSection";
import { FiveRunsMethodologySection } from "@/components/vision/FiveRunsMethodologySection";
import { OverkillVisionSection } from "@/components/vision/OverkillVisionSection";
import { VisionEmotionalHero } from "@/components/vision/VisionEmotionalHero";
import { VisionQuickStats } from "@/components/vision/VisionQuickStats";
import { VisionLanguageSwitcher } from "@/components/vision/VisionLanguageSwitcher";
import { ExpandAllToggle } from "@/components/vision/ExpandAllToggle";
import { VisionContactCTA } from "@/components/vision/VisionContactCTA";
import { VisionProgressIndicator } from "@/components/vision/VisionProgressIndicator";
import { USPFrameworkSection } from "@/components/vision/USPFrameworkSection";
import { BuildTimelineSection } from "@/components/vision/BuildTimelineSection";
import { ThreeLayerSystemMap } from "@/components/vision/ThreeLayerSystemMap";
import { NarrativeMoatSection } from "@/components/vision/NarrativeMoatSection";
import { TwoPillarModel } from "@/components/vision/TwoPillarModel";
import { MarketAttractivenessSection } from "@/components/vision/MarketAttractivenessSection";
import { WhyWeWinSection } from "@/components/vision/WhyWeWinSection";
import { UseOfFundsSection } from "@/components/vision/UseOfFundsSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { VisionLanguage } from "@/lib/vision-translations";
import { StakeholderJokeBanner, StakeholderJokesGrid } from "@/components/stakeholder/StakeholderJokeBanner";
import { usePersona } from "@/hooks/usePersona";
import { FunNarrator } from "@/components/persona/FunNarrator";
import { FunInterruptCard } from "@/components/persona/FunInterruptCard";
import { FunSectionIntro } from "@/components/persona/FunSectionIntro";
import { FunCTA } from "@/components/persona/FunCTA";
import { VIPWelcomeBanner } from "@/components/persona/VIPWelcomeBanner";

// Translations
const translations: Record<'de' | 'bg' | 'it', {
  back: string;
  fullVision: string;
  badge: string;
  sections: { 
    revenueTitle: string; 
    unitTitle: string; 
  };
  footer: { interested: string; cta: string; visionBtn: string; familyBtn: string };
}> = {
  de: {
    back: "Zurück",
    fullVision: "Vollständige Vision",
    badge: "Investor Hub",
    sections: {
      revenueTitle: "10 Einnahmequellen",
      unitTitle: "Unit Economics",
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
      revenueTitle: "10 източници на приходи",
      unitTitle: "Unit Economics",
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
      revenueTitle: "10 Fonti di Reddito",
      unitTitle: "Unit Economics",
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
  const [language, setLanguage] = useState<VisionLanguage>(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang === 'bg' || urlLang === 'de' || urlLang === 'it') return urlLang as VisionLanguage;
    const urlPersona = params.get('persona');
    if (urlPersona && ['bg1', 'bg2', 'bg3'].includes(urlPersona)) return 'bg';
    if (urlPersona === 'it') return 'it';
    return 'de';
  });
  const [allExpanded, setAllExpanded] = useState(false);
  const t = translations[language];
  const { persona, isPersonalized } = usePersona(language);

  return (
    <div className="min-h-screen bg-background">
      <VisionProgressIndicator />
      
      <SEOHead pageType="home" url="https://umzugscheck.ch/investoren" />

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
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              {t.badge}
            </div>
            <div className="flex items-center gap-2">
              <ExpandAllToggle isExpanded={allExpanded} onToggle={() => setAllExpanded(!allExpanded)} language={language} />
              <VisionLanguageSwitcher currentLang={language} onLanguageChange={setLanguage} />
              <Link to="/vision">
                <Button variant="outline" size="sm" className="min-h-[44px] border-secondary/20 hover:bg-secondary/5">
                  {t.fullVision}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* VIP Welcome Banner */}
      {isPersonalized && <VIPWelcomeBanner persona={persona} />}

      {/* ═══════════════════════════════════════════ */}
      {/* 1. HERO — "Der Motor ist gebaut" */}
      {/* ═══════════════════════════════════════════ */}
      <VisionEmotionalHero language={language} variant="investor" />

      {isPersonalized && <FunSectionIntro persona={persona} page="investoren" sectionId="hero" />}

      {/* ═══════════════════════════════════════════ */}
      {/* 2. PROOF-KACHELN — Konsolidiert */}
      {/* ═══════════════════════════════════════════ */}
      <VisionQuickStats language={language} variant="investor" />

      {isPersonalized && <FunInterruptCard persona={persona} page="investoren" afterSection="stats" />}

      {/* ═══════════════════════════════════════════ */}
      {/* 3. BUILD TIMELINE — Nov 2025–Mär 2026 */}
      {/* ═══════════════════════════════════════════ */}
      <ScrollReveal>
        <BuildTimelineSection />
      </ScrollReveal>

      {/* ═══════════════════════════════════════════ */}
      {/* 4. ZWEI-SÄULEN-MODELL */}
      {/* ═══════════════════════════════════════════ */}
      <ScrollReveal>
        <TwoPillarModel />
      </ScrollReveal>

      {/* ═══════════════════════════════════════════ */}
      {/* 5. 3-LAYER SYSTEM MAP — Capture/Transaction/Expansion */}
      {/* ═══════════════════════════════════════════ */}
      <ScrollReveal>
        <ThreeLayerSystemMap />
      </ScrollReveal>

      {isPersonalized && <FunSectionIntro persona={persona} page="investoren" sectionId="pillars" />}

      {/* ═══════════════════════════════════════════ */}
      {/* 6. REVENUE + UNIT ECONOMICS + WARENKORB */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Badge className="mb-4 bg-secondary/10 text-secondary">553 CHF</Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-8">{t.sections.revenueTitle}</h2>
          <RevenueStreamExamples language={language} />
        </div>
      </section>

      {isPersonalized && <FunInterruptCard persona={persona} page="investoren" afterSection="revenue" />}

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Badge className="mb-4 bg-primary/10 text-primary">90%+ Marge</Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-8">{t.sections.unitTitle}</h2>
          <UnitEconomicsDetailed language={language} />
        </div>
      </section>

      <ScrollReveal>
        <ModularerWarenkorbSection />
      </ScrollReveal>

      {isPersonalized && <FunSectionIntro persona={persona} page="investoren" sectionId="economics" />}

      {/* ═══════════════════════════════════════════ */}
      {/* 7. NARRATIVE MOAT — Why Now + Flywheel + Moat */}
      {/* ═══════════════════════════════════════════ */}
      <ScrollReveal>
        <NarrativeMoatSection />
      </ScrollReveal>

      {/* ═══════════════════════════════════════════ */}
      {/* 8. SEO & CONTENT MOAT */}
      {/* ═══════════════════════════════════════════ */}
      <ScrollReveal>
        <SEOContentMoatSection language={language} />
      </ScrollReveal>

      {/* ═══════════════════════════════════════════ */}
      {/* 9. FUNDING ROADMAP — 80k in 3 Tranchen */}
      {/* ═══════════════════════════════════════════ */}
      <ScrollReveal>
        <FundingRoadmapSection language={language} />
      </ScrollReveal>

      {isPersonalized && <FunSectionIntro persona={persona} page="investoren" sectionId="roadmap" />}

      {/* ═══════════════════════════════════════════ */}
      {/* 10. FIVE RUNS METHODOLOGY — Kill Switch */}
      {/* ═══════════════════════════════════════════ */}
      <ScrollReveal>
        <FiveRunsMethodologySection />
      </ScrollReveal>

      {isPersonalized && <FunInterruptCard persona={persona} page="investoren" afterSection="market" />}

      {/* ═══════════════════════════════════════════ */}
      {/* 11. WHY INVEST — 50 Gründe */}
      {/* ═══════════════════════════════════════════ */}
      <ScrollReveal>
        <WhyInvestSection language={language} />
      </ScrollReveal>

      {/* ═══════════════════════════════════════════ */}
      {/* 12. OVERKILL VISION + USP FRAMEWORK */}
      {/* ═══════════════════════════════════════════ */}
      <ScrollReveal>
        <OverkillVisionSection />
      </ScrollReveal>

      <ScrollReveal>
        <USPFrameworkSection />
      </ScrollReveal>

      {/* ═══════════════════════════════════════════ */}
      {/* 13. CLOSING — Giuseppe-Brief */}
      {/* ═══════════════════════════════════════════ */}
      <ScrollReveal>
        <InvestorClosingSection />
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
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{t.footer.cta}</p>
          
          {isPersonalized ? (
            <FunCTA persona={persona} page="investoren" index={0} />
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/vision">
                <Button size="lg">{t.footer.visionBtn}</Button>
              </Link>
              <Link to="/family">
                <Button variant="outline" size="lg">{t.footer.familyBtn}</Button>
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