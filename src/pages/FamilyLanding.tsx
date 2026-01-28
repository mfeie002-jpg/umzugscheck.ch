/**
 * Family Landing Page
 * Simplified visual-first page for family stakeholders
 * Mobile-First with emotional imagery and minimal text
 */

import { useState, useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import { CustomerUSPVisualCards } from "@/components/homepage/CustomerUSPVisualCards";
import { FamilySummary } from "@/components/homepage/FamilySummary";
import { FamilyLanguageSwitcher } from "@/components/family/FamilyLanguageSwitcher";
import { VisionProfitabilityRoadmap } from "@/components/vision/VisionProfitabilityRoadmap";
import { VisionEmotionalHero } from "@/components/vision/VisionEmotionalHero";
import { VisionQuickStats } from "@/components/vision/VisionQuickStats";
import { VisionIconFeatures } from "@/components/vision/VisionIconFeatures";
import { VisionVisualDivider } from "@/components/vision/VisionVisualDivider";
import { VisionLiveStats } from "@/components/vision/VisionLiveStats";
import { VisionProgressIndicator } from "@/components/vision/VisionProgressIndicator";
import { ReloOSJourneySection } from "@/components/vision/ReloOSJourneySection";
import { ReloOSFeaturesGrid } from "@/components/vision/ReloOSFeaturesGrid";
import { ExpandAllToggle } from "@/components/vision/ExpandAllToggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getFamilyTranslation, type FamilyLanguage } from "@/lib/family-translations";
import { StakeholderJokeBanner, StakeholderJokesGrid } from "@/components/stakeholder/StakeholderJokeBanner";
import { usePersona } from "@/hooks/usePersona";
import { FunNarrator } from "@/components/persona/FunNarrator";
import { FunInterruptCard } from "@/components/persona/FunInterruptCard";
import { FunSectionIntro } from "@/components/persona/FunSectionIntro";
import { FunCTA } from "@/components/persona/FunCTA";
import { VIPWelcomeBanner } from "@/components/persona/VIPWelcomeBanner";

export default function FamilyLanding() {
  const [lang, setLang] = useState<FamilyLanguage>(() => {
    const params = new URLSearchParams(window.location.search);
    
    // 1. Priority: URL lang parameter
    const urlLang = params.get('lang');
    if (urlLang === 'bg' || urlLang === 'de' || urlLang === 'it') {
      return urlLang as FamilyLanguage;
    }
    
    // 2. Auto-detect BG when persona=bg1/bg2/bg3
    const urlPersona = params.get('persona');
    if (urlPersona && ['bg1', 'bg2', 'bg3'].includes(urlPersona)) {
      return 'bg';
    }
    // 3. Auto-detect IT when persona=it
    if (urlPersona === 'it') {
      return 'it';
    }
    
    // 4. Fallback: localStorage
    const stored = localStorage.getItem('family-lang');
    return (stored === 'bg' || stored === 'de' || stored === 'it') ? stored : 'de';
  });
  const [allExpanded, setAllExpanded] = useState(false);
  
  const t = getFamilyTranslation(lang);
  const { persona, isPersonalized } = usePersona(lang);

  useEffect(() => {
    localStorage.setItem('family-lang', lang);
  }, [lang]);

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Indicator */}
      <VisionProgressIndicator />
      
      <SEOHead
        pageType="home"
        url="https://umzugscheck.ch/family"
      />

      {/* Compact Header */}
      <div 
        className="bg-background border-b border-secondary/20"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="container mx-auto px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <Link to="/" className="touch-manipulation">
              <Button 
                variant="ghost" 
                size="sm" 
                className="min-h-[44px] px-3 sm:px-4 text-xs sm:text-sm active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">{t.header.back}</span>
              </Button>
            </Link>
            
            {/* Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold">
              <Heart className="w-3.5 h-3.5" />
              {t.header.forFamily}
            </div>
            
            <div className="flex items-center gap-2">
              <ExpandAllToggle
                isExpanded={allExpanded}
                onToggle={() => setAllExpanded(!allExpanded)}
                language={lang}
              />
              <FamilyLanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
              <Link to="/vision" className="touch-manipulation hidden sm:block">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="min-h-[44px] px-3 sm:px-4 text-xs sm:text-sm active:scale-[0.98] border-secondary/20 hover:bg-secondary/5"
                >
                  {t.header.fullVision}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* VIP Welcome Banner */}
      {isPersonalized && <VIPWelcomeBanner persona={persona} />}

      {/* 1. HERO - Family variant with emotional image */}
      <VisionEmotionalHero language={lang} variant="family" />

      {/* PERSONA SECTION INTRO - Hero */}
      {isPersonalized && (
        <FunSectionIntro persona={persona} page="family" sectionId="hero" />
      )}

      {/* WEED JOKES BANNER - Only for BG/IT */}
      {(lang === 'bg' || lang === 'it') && (
        <div className="container mx-auto px-4 py-4">
          <StakeholderJokeBanner language={lang} variant="full" />
        </div>
      )}

      {/* 2. LIVE STATS - Animated family-focused metrics */}
      <VisionLiveStats language={lang} variant="family" />

      {/* PERSONA INTERRUPT CARD */}
      {isPersonalized && (
        <FunInterruptCard persona={persona} page="family" afterSection="stats" />
      )}

      {/* 3. QUICK STATS - Family-focused */}
      <VisionQuickStats language={lang} variant="family" />

      {/* 4. ICON FEATURES - What makes us unique */}
      <VisionIconFeatures language={lang} />

      {/* PERSONA SECTION INTRO - Features */}
      {isPersonalized && (
        <FunSectionIntro persona={persona} page="family" sectionId="features" />
      )}

      {/* NEW: RELO-OS 6-PHASE JOURNEY - Family Variant */}
      <ReloOSJourneySection language={lang} variant="family" />

      {/* NEW: RELO-OS FEATURES - Compact for Family */}
      <ReloOSFeaturesGrid language={lang} variant="compact" />

      {/* 4. VISUAL DIVIDER */}
      <VisionVisualDivider language={lang} variant="family" />

      {/* 5. PROFITABILITY ROADMAP */}
      <VisionProfitabilityRoadmap language={lang} />

      {/* PERSONA INTERRUPT CARD */}
      {isPersonalized && (
        <FunInterruptCard persona={persona} page="family" afterSection="roadmap" />
      )}

      {/* 6. FAMILY SUMMARY - Simple explanation */}
      <FamilySummary language={lang} />

      {/* PERSONA SECTION INTRO - Summary */}
      {isPersonalized && (
        <FunSectionIntro persona={persona} page="family" sectionId="summary" />
      )}

      {/* 7. VISUAL DIVIDER */}
      <VisionVisualDivider language={lang} variant="journey" />

      {/* 8. 10 CUSTOMER BENEFITS */}
      <section className="py-8 sm:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3 sm:mb-4">
              {t.benefits.title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
              {t.benefits.subtitle}
            </p>
          </motion.div>
          <CustomerUSPVisualCards language={lang} allExpanded={allExpanded} />
        </div>
      </section>

      {/* PERSONA INTERRUPT CARD */}
      {isPersonalized && (
        <FunInterruptCard persona={persona} page="family" afterSection="benefits" />
      )}

      {/* JOKES GRID - Only for BG/IT */}
      {(lang === 'bg' || lang === 'it') && (
        <section className="py-8 sm:py-12 bg-muted/10">
          <div className="container mx-auto px-4">
            <h3 className="text-xl font-bold text-center mb-6 text-foreground/80">
              {lang === 'bg' ? '🌿 Още Зелена Мъдрост' : '🌿 Altra Saggezza Verde'}
            </h3>
            <StakeholderJokesGrid language={lang} count={6} />
          </div>
        </section>
      )}

      {/* FOOTER CTA */}
      <section 
        className="py-8 sm:py-12 bg-primary/5"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2rem)' }}
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            {t.footer.moreDetails}
          </p>
          
          {/* Persona CTA */}
          {isPersonalized ? (
            <FunCTA persona={persona} page="family" index={0} />
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link to="/vision" className="w-full sm:w-auto touch-manipulation">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] text-sm sm:text-base font-bold active:scale-[0.98]"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  {t.footer.fullVision}
                </Button>
              </Link>
              <Link to="/" className="w-full sm:w-auto touch-manipulation">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] text-sm sm:text-base active:scale-[0.98]"
                >
                  {t.footer.mainPage}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FLOATING JOKE - Only for BG/IT */}
      {(lang === 'bg' || lang === 'it') && (
        <StakeholderJokeBanner language={lang} variant="floating" />
      )}

      {/* Persona Narrator - Floating */}
      {isPersonalized && (
        <FunNarrator persona={persona} page="family" />
      )}
    </div>
  );
}
