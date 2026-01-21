/**
 * Investoren Landing Page
 * Dedizierte Seite für Investoren - Business-fokussiert
 * Mit DE/BG Language Support
 */

import { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Vision10PillarSection } from "@/components/homepage/Vision10PillarSection";
import { RevenueStreamExamples } from "@/components/vision/RevenueStreamExamples";
import { UnitEconomicsDetailed } from "@/components/vision/UnitEconomicsDetailed";
import { MarketPotentialSection } from "@/components/vision/MarketPotentialSection";
import { ExitTimeline } from "@/components/vision/ExitTimeline";
import { VisionUniqueness } from "@/components/vision/VisionUniqueness";
import { VisionProgressMilestones } from "@/components/vision/VisionProgressMilestones";
import { ContributionBreakdown } from "@/components/vision/ContributionBreakdown";
import { VisionTractionDashboard } from "@/components/vision/VisionTractionDashboard";
import { VisionProfitabilityRoadmap } from "@/components/vision/VisionProfitabilityRoadmap";
import { VisionEmotionalHero } from "@/components/vision/VisionEmotionalHero";
import { VisionMovingMoments } from "@/components/vision/VisionMovingMoments";
import { VisionLanguageSwitcher } from "@/components/vision/VisionLanguageSwitcher";
import { ExpandAllToggle } from "@/components/vision/ExpandAllToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Target, DollarSign, Rocket, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { VisionLanguage } from "@/lib/vision-translations";

// Translations mit Italienisch
const translations: Record<'de' | 'bg' | 'it', {
  back: string;
  fullVision: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: { revenue: string; margin: string; streams: string; automation: string; market: string };
  sections: { businessModel: string; pillarsTitle: string; pillarsSubtitle: string; revenueTitle: string; unitTitle: string; marketTitle: string };
  footer: { interested: string; cta: string; visionBtn: string; familyBtn: string };
}> = {
  de: {
    back: "Zurück",
    fullVision: "Vollständige Vision",
    badge: "Investor Hub",
    title: "Umzugscheck.ch",
    subtitle: "Investment Opportunity",
    description: "Die intelligenteste Umzugs-Plattform der Schweiz mit 10 Einnahmequellen, 90%+ Marge und First-Mover-Advantage.",
    metrics: {
      revenue: "Revenue/Kunde",
      margin: "Contribution Margin",
      streams: "Revenue Streams",
      automation: "Automatisierung",
      market: "Marktpotenzial"
    },
    sections: {
      businessModel: "Business Model",
      pillarsTitle: "10 Strategische Säulen",
      pillarsSubtitle: "Jede Säule ist ein eigenständiger Profit Center mit klarer Unit Economics.",
      revenueTitle: "10 Einnahmequellen im Detail",
      unitTitle: "Unit Economics: Wie wir Geld verdienen",
      marketTitle: "Marktpotenzial Schweiz"
    },
    footer: {
      interested: "Interessiert?",
      cta: "Wir sind offen für Gespräche über strategische Partnerschaften und Investments.",
      visionBtn: "Vollständige Vision ansehen",
      familyBtn: "Einfache Erklärung (Familie)"
    }
  },
  bg: {
    back: "Назад",
    fullVision: "Пълна визия",
    badge: "Investor Hub",
    title: "Umzugscheck.ch",
    subtitle: "Инвестиционна възможност",
    description: "Най-интелигентната платформа за преместване в Швейцария с 10 източника на приходи, 90%+ марж и предимство на първия.",
    metrics: {
      revenue: "Приход/клиент",
      margin: "Contribution Margin",
      streams: "Източници на приходи",
      automation: "Автоматизация",
      market: "Пазарен потенциал"
    },
    sections: {
      businessModel: "Бизнес модел",
      pillarsTitle: "10 Стратегически стълба",
      pillarsSubtitle: "Всеки стълб е самостоятелен Profit Center с ясна Unit Economics.",
      revenueTitle: "10 източника на приходи в детайли",
      unitTitle: "Unit Economics: Как печелим пари",
      marketTitle: "Пазарен потенциал Швейцария"
    },
    footer: {
      interested: "Заинтересовани?",
      cta: "Отворени сме за разговори относно стратегически партньорства и инвестиции.",
      visionBtn: "Вижте пълната визия",
      familyBtn: "Просто обяснение (семейство)"
    }
  },
  it: {
    back: "Indietro",
    fullVision: "Visione Completa",
    badge: "Investor Hub",
    title: "Umzugscheck.ch",
    subtitle: "Opportunità di Investimento",
    description: "La piattaforma di trasloco più intelligente della Svizzera con 10 fonti di reddito, margine 90%+ e vantaggio del first-mover.",
    metrics: {
      revenue: "Revenue/Cliente",
      margin: "Contribution Margin",
      streams: "Flussi di Entrate",
      automation: "Automazione",
      market: "Potenziale di Mercato"
    },
    sections: {
      businessModel: "Business Model",
      pillarsTitle: "10 Pilastri Strategici",
      pillarsSubtitle: "Ogni pilastro è un Profit Center autonomo con Unit Economics chiare.",
      revenueTitle: "10 Fonti di Reddito in Dettaglio",
      unitTitle: "Unit Economics: Come Guadagniamo",
      marketTitle: "Potenziale di Mercato Svizzera"
    },
    footer: {
      interested: "Interessati?",
      cta: "Siamo aperti a discussioni su partnership strategiche e investimenti.",
      visionBtn: "Vedi la Visione Completa",
      familyBtn: "Spiegazione Semplice (Famiglia)"
    }
  }
};

export default function InvestorenLanding() {
  const [language, setLanguage] = useState<VisionLanguage>('de');
  const [allExpanded, setAllExpanded] = useState(false);
  const t = translations[language];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        pageType="home"
        url="https://umzugscheck.ch/investoren"
      />

      {/* Header - NON-Sticky to prevent conflict with page scrolling */}
      <div className="bg-background border-b border-[#8B0000]/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="min-h-[44px]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </Link>
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
                <Button variant="outline" size="sm" className="min-h-[44px] border-[#8B0000]/20 hover:bg-[#8B0000]/5">
                  {t.fullVision}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Emotional Hero - Investor variant */}
      <VisionEmotionalHero language={language} variant="investor" />

      {/* Key Metrics Banner */}
      <section className="py-8 border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              { icon: DollarSign, label: t.metrics.revenue, value: "553 CHF" },
              { icon: Target, label: t.metrics.margin, value: ">90%" },
              { icon: Building2, label: t.metrics.streams, value: "10" },
              { icon: Rocket, label: t.metrics.automation, value: "95%" },
              { icon: TrendingUp, label: t.metrics.market, value: "450k/" + (language === 'de' ? 'Jahr' : language === 'it' ? 'Anno' : 'год') },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-background border rounded-xl p-4 text-center"
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xl md:text-2xl font-black text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Moving Moments - Show emotional impact for investors */}
      <VisionMovingMoments language={language} />

      {/* Profitability Roadmap - 12 Month Timeline */}
      <VisionProfitabilityRoadmap language={language} />

      {/* Traction Dashboard */}
      <VisionTractionDashboard language={language} />

      {/* Progress Section */}
      <section className="py-12">
        <VisionProgressMilestones language={language} />
        <ContributionBreakdown language={language} />
      </section>

      {/* 10 Business Pillars */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-primary/10 text-primary">{t.sections.businessModel}</Badge>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              {t.sections.pillarsTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.sections.pillarsSubtitle}
            </p>
          </div>
          <Vision10PillarSection allExpanded={allExpanded} language={language} />
        </div>
      </section>

      {/* Revenue Streams */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-primary/10 text-primary">553 CHF/{language === 'de' ? 'Kunde' : language === 'it' ? 'Cliente' : 'клиент'}</Badge>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              {t.sections.revenueTitle}
            </h2>
          </div>
          <RevenueStreamExamples language={language} />
        </div>
      </section>

      {/* Unit Economics */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-primary/10 text-primary">90%+ {language === 'de' ? 'Marge' : language === 'it' ? 'Margine' : 'Марж'}</Badge>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              {t.sections.unitTitle}
            </h2>
          </div>
          <UnitEconomicsDetailed language={language} />
        </div>
      </section>

      {/* Market Potential */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-primary/10 text-primary">450k {language === 'de' ? 'Umzüge/Jahr' : language === 'it' ? 'Traslochi/Anno' : 'премествания/год'}</Badge>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              {t.sections.marketTitle}
            </h2>
          </div>
          <MarketPotentialSection language={language} />
        </div>
      </section>

      {/* Uniqueness */}
      <ScrollReveal>
        <VisionUniqueness language={language} />
      </ScrollReveal>

      {/* Exit Timeline */}
      <ScrollReveal>
        <ExitTimeline language={language} />
      </ScrollReveal>

      {/* Footer CTA */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">{t.footer.interested}</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            {t.footer.cta}
          </p>
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
        </div>
      </section>
    </div>
  );
}
