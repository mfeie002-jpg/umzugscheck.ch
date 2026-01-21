/**
 * Family Landing Page
 * Dedizierte Seite für Eltern/Familie - einfach erklärt
 * 
 * Mobile-First Optimizations (ChatGPT/Gemini Audit):
 * - Touch targets 44px+ minimum
 * - Safe-area padding for notch/home indicator
 * - Responsive typography scaling
 * - Sticky header with compact mobile view
 * - Improved stat cards for small screens
 * - DE/BG Language Support
 */

import { useState, useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import { CustomerUSPVisualCards } from "@/components/homepage/CustomerUSPVisualCards";
import { FamilySummary } from "@/components/homepage/FamilySummary";
import { FamilyLanguageSwitcher } from "@/components/family/FamilyLanguageSwitcher";
import { VisionTractionDashboard } from "@/components/vision/VisionTractionDashboard";
import { VisionProfitabilityRoadmap } from "@/components/vision/VisionProfitabilityRoadmap";
import { VisionEmotionalHero } from "@/components/vision/VisionEmotionalHero";
import { VisionMovingMoments } from "@/components/vision/VisionMovingMoments";
import { ExpandAllToggle } from "@/components/vision/ExpandAllToggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Users, Sparkles, Home, CheckCircle2, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getFamilyTranslation, type FamilyLanguage } from "@/lib/family-translations";
import { VisionStickyCTA } from "@/components/vision/VisionStickyCTA";

export default function FamilyLanding() {
  const [lang, setLang] = useState<FamilyLanguage>(() => {
    const stored = localStorage.getItem('family-lang');
    return (stored === 'bg' || stored === 'de' || stored === 'it') ? stored as FamilyLanguage : 'de';
  });
  const [allExpanded, setAllExpanded] = useState(false);
  
  const t = getFamilyTranslation(lang);

  useEffect(() => {
    localStorage.setItem('family-lang', lang);
  }, [lang]);

  const stats = [
    { icon: Home, label: t.stats.since, value: "31.10.2024" },
    { icon: Sparkles, label: t.stats.components, value: "370+" },
    { icon: Users, label: t.stats.pages, value: "130+" },
    { icon: CheckCircle2, label: t.stats.progress, value: "85%" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <SEOHead
        pageType="home"
        url="https://umzugscheck.ch/family"
      />

      {/* VisionStickyCTA removed - not needed for internal family page */}

      {/* Header - NON-Sticky to prevent conflict */}
      <div 
        className="bg-background border-b border-[#8B0000]/20"
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
            
            {/* Center badge - visible on larger screens */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B0000]/10 text-[#8B0000] text-xs font-bold">
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
                  className="min-h-[44px] px-3 sm:px-4 text-xs sm:text-sm active:scale-[0.98] border-[#8B0000]/20 hover:bg-[#8B0000]/5"
                >
                  {t.header.fullVision}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Emotional Hero - Human Side */}
      <VisionEmotionalHero language={lang} variant="family" />

      {/* Quick Facts - Mobile Grid with proper touch targets */}
      <section className="py-6 sm:py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center"
              >
                <stat.icon className="w-5 sm:w-6 h-5 sm:h-6 text-primary mx-auto mb-1.5 sm:mb-2" />
                <p className="text-xl sm:text-2xl font-black text-primary">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Moving Moments Gallery - Emotional Photos */}
      <VisionMovingMoments language={lang} />

      {/* Profitability Roadmap - 12 Month Timeline */}
      <VisionProfitabilityRoadmap language={lang} />

      {/* Traction Dashboard - Progress & Milestones */}
      <VisionTractionDashboard language={lang} />

      {/* Family Summary - Main Content */}
      <FamilySummary language={lang} />

      {/* 10 Customer Benefits */}
      <section className="py-8 sm:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3 sm:mb-4">
              {t.benefits.title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
              {t.benefits.subtitle}
            </p>
          </div>
          <CustomerUSPVisualCards language={lang} allExpanded={allExpanded} />
        </div>
      </section>

      {/* Footer CTA - Mobile Optimized with safe-area */}
      <section 
        className="py-8 sm:py-12 bg-primary/5"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2rem)' }}
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            {t.footer.moreDetails}
          </p>
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
        </div>
      </section>
    </div>
  );
}
