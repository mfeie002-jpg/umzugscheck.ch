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
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Users, Sparkles, Home, CheckCircle2, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getFamilyTranslation, type FamilyLanguage } from "@/lib/family-translations";

export default function FamilyLanding() {
  const [lang, setLang] = useState<FamilyLanguage>(() => {
    const stored = localStorage.getItem('family-lang');
    return (stored === 'bg' || stored === 'de') ? stored : 'de';
  });
  
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
    <div className="min-h-screen bg-background">
      <SEOHead
        pageType="home"
        url="https://umzugscheck.ch/family"
      />

      {/* Sticky Header - Mobile Optimized with safe-area */}
      <div 
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b"
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
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <Heart className="w-3.5 h-3.5" />
              {t.header.forFamily}
            </div>
            
            <div className="flex items-center gap-2">
              <FamilyLanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
              <Link to="/vision" className="touch-manipulation hidden sm:block">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="min-h-[44px] px-3 sm:px-4 text-xs sm:text-sm active:scale-[0.98]"
                >
                  {t.header.fullVision}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Mobile Responsive */}
      <section className="py-8 sm:py-12 md:py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold mb-4 sm:mb-6">
              <Heart className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              {t.hero.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 sm:mb-6 leading-tight">
              {t.hero.title} <span className="text-primary">{t.hero.titleHighlight}</span> 🚀
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              {t.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

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
          <CustomerUSPVisualCards language={lang} />
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
