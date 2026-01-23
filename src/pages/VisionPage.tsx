import { useState, useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Vision10PillarSection } from "@/components/homepage/Vision10PillarSection";
import { CustomerUSPVisualCards } from "@/components/homepage/CustomerUSPVisualCards";
import { FamilySummary } from "@/components/homepage/FamilySummary";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, Loader2, Users, TrendingUp, Sparkles, DollarSign, Target, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { exportVisionToPDF, exportVisionAsTextPDF } from "@/lib/vision-pdf-export";
import { useToast } from "@/hooks/use-toast";
import { VisionLanguageSwitcher } from "@/components/vision/VisionLanguageSwitcher";
import { ExpandAllToggle } from "@/components/vision/ExpandAllToggle";
import { RevenueStreamExamples } from "@/components/vision/RevenueStreamExamples";
import { UnitEconomicsDetailed } from "@/components/vision/UnitEconomicsDetailed";
import { ExitTimeline } from "@/components/vision/ExitTimeline";
import { MarketPotentialSection } from "@/components/vision/MarketPotentialSection";
import { VisionUniqueness } from "@/components/vision/VisionUniqueness";
import { VisionCollapsibleSection } from "@/components/vision/VisionCollapsibleSection";
import { VisionStickyNav } from "@/components/vision/VisionStickyNav";
import { VisionTeamSection } from "@/components/vision/VisionTeamSection";
import { VisionAudienceSwitcher } from "@/components/vision/VisionAudienceSwitcher";
import { VisionTractionDashboard } from "@/components/vision/VisionTractionDashboard";
import { VisionTrustLogos } from "@/components/vision/VisionTrustLogos";
import { VisionComparisonMatrix } from "@/components/vision/VisionComparisonMatrix";
import { VisionComplianceSection } from "@/components/vision/VisionComplianceSection";
import { VisionProfitabilityRoadmap } from "@/components/vision/VisionProfitabilityRoadmap";
import { VisionEmotionalHero } from "@/components/vision/VisionEmotionalHero";
import { VisionQuickStats } from "@/components/vision/VisionQuickStats";
import { VisionIconFeatures } from "@/components/vision/VisionIconFeatures";
import { VisionVisualDivider } from "@/components/vision/VisionVisualDivider";
import { VisionSalesFunnelDiagram } from "@/components/vision/VisionSalesFunnelDiagram";
import { VisionSystemDiagram } from "@/components/vision/VisionSystemDiagram";
import { VisionContactCTA } from "@/components/vision/VisionContactCTA";
import { VisionLiveStats } from "@/components/vision/VisionLiveStats";
import { VisionProgressIndicator } from "@/components/vision/VisionProgressIndicator";
import { VisionScrollTracker, useScrollDepthTracking } from "@/components/vision/VisionScrollTracker";
import { getVisionTranslation, type VisionLanguage } from "@/lib/vision-translations";
import { StakeholderJokeBanner, StakeholderJokesMarquee, StakeholderJokesGrid } from "@/components/stakeholder/StakeholderJokeBanner";
import { usePersona } from "@/hooks/usePersona";
import { FunNarrator } from "@/components/persona/FunNarrator";
import { FunInterruptCard } from "@/components/persona/FunInterruptCard";
import { FunSectionIntro } from "@/components/persona/FunSectionIntro";
import { FunCTA } from "@/components/persona/FunCTA";
import { VIPWelcomeBanner } from "@/components/persona/VIPWelcomeBanner";

export default function VisionPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [language, setLanguage] = useState<VisionLanguage>(() => {
    const params = new URLSearchParams(window.location.search);
    
    // 1. Priority: URL lang parameter
    const urlLang = params.get('lang');
    if (urlLang === 'bg' || urlLang === 'de' || urlLang === 'it') {
      return urlLang as VisionLanguage;
    }
    
    // 2. Auto-detect language from persona
    const urlPersona = params.get('persona');
    if (urlPersona && ['bg1', 'bg2', 'bg3'].includes(urlPersona)) {
      return 'bg';
    }
    if (urlPersona === 'it') {
      return 'it';
    }
    
    // 3. Fallback: localStorage or default
    const stored = localStorage.getItem('vision-lang');
    return (stored === 'bg' || stored === 'de' || stored === 'it') ? stored as VisionLanguage : 'de';
  });
  const [allExpanded, setAllExpanded] = useState(false);
  const { toast } = useToast();
  
  const t = getVisionTranslation(language);
  const { persona, isPersonalized } = usePersona(language);

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      await exportVisionToPDF((progress) => {
        setExportProgress(progress);
      });
      
      toast({
        title: language === 'de' ? "PDF erstellt! ✅" : language === 'it' ? "PDF creato! ✅" : "PDF създаден! ✅",
        description: language === 'de' ? "Die Vision-Präsentation wurde heruntergeladen." : language === 'it' ? "La presentazione è stata scaricata." : "Презентацията е изтеглена.",
      });
    } catch (error) {
      toast({
        title: language === 'de' ? "Fehler" : language === 'it' ? "Errore" : "Грешка",
        description: language === 'de' ? "PDF konnte nicht erstellt werden." : language === 'it' ? "Impossibile creare il PDF." : "PDF не можа да бъде създаден.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleExportTextPDF = () => {
    try {
      exportVisionAsTextPDF();
      toast({
        title: language === 'de' ? "Text-PDF erstellt! ✅" : language === 'it' ? "PDF testuale creato! ✅" : "Текстов PDF създаден! ✅",
        description: language === 'de' ? "Die kompakte Version wurde heruntergeladen." : language === 'it' ? "La versione compatta è stata scaricata." : "Компактната версия е изтеглена.",
      });
    } catch (error) {
      toast({
        title: language === 'de' ? "Fehler" : language === 'it' ? "Errore" : "Грешка",
        description: language === 'de' ? "PDF konnte nicht erstellt werden." : language === 'it' ? "Impossibile creare il PDF." : "PDF не можа да бъде създаден.",
        variant: "destructive",
      });
    }
  };

  // Enable scroll depth tracking
  useScrollDepthTracking();

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Indicator */}
      <VisionProgressIndicator />
      
      <SEOHead
        pageType="home"
        url="https://umzugscheck.ch/vision"
      />

      {/* Compact Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-3 md:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="touch-manipulation min-h-[40px] px-2 md:px-3">
                <ArrowLeft className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">{t.page.backToMain}</span>
              </Button>
            </Link>
            
            <div className="flex items-center gap-1.5 md:gap-2">
              <ExpandAllToggle
                isExpanded={allExpanded}
                onToggle={() => setAllExpanded(!allExpanded)}
                language={language}
              />
              <VisionLanguageSwitcher 
                currentLang={language} 
                onLanguageChange={setLanguage} 
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportTextPDF}
                disabled={isExporting}
                className="touch-manipulation min-h-[40px] px-2 md:px-3 hidden sm:flex"
              >
                <FileText className="w-4 h-4 md:mr-2" />
                <span className="hidden lg:inline">{t.page.compactPdf}</span>
              </Button>
              <Button 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="relative touch-manipulation min-h-[40px] px-3 md:px-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground whitespace-nowrap"
                size="sm"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 shrink-0 md:mr-2 animate-spin" />
                    <span className="hidden md:inline">{exportProgress}%</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 shrink-0 md:mr-2" />
                    <span className="hidden md:inline truncate">{t.page.downloadPdf}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* VIP Welcome Banner */}
      {isPersonalized && <VIPWelcomeBanner persona={persona} />}

      {/* Sticky Navigation */}
      <VisionStickyNav language={language} />

      {/* 1. HERO - Homepage Style with Full-Width Image */}
      <VisionScrollTracker sectionId="hero" sectionName="Hero">
        <VisionEmotionalHero language={language} variant="full" />
      </VisionScrollTracker>

      {/* PERSONA SECTION INTRO - Hero */}
      {isPersonalized && (
        <FunSectionIntro persona={persona} page="vision" sectionId="hero" />
      )}

      {/* WEED JOKES MARQUEE - Only for BG/IT */}
      {(language === 'bg' || language === 'it') && (
        <StakeholderJokesMarquee language={language} />
      )}

      {/* 2. LIVE STATS - Animated counters */}
      <VisionScrollTracker sectionId="live-stats" sectionName="Live Stats">
        <VisionLiveStats language={language} variant="full" />
      </VisionScrollTracker>

      {/* 3. QUICK STATS - Icon-focused grid */}
      <VisionQuickStats language={language} variant="full" />

      {/* PERSONA INTERRUPT CARD */}
      {isPersonalized && (
        <FunInterruptCard persona={persona} page="vision" afterSection="stats" />
      )}

      {/* 3. AUDIENCE SWITCHER */}
      <VisionAudienceSwitcher language={language} />

      {/* 4. ICON FEATURES - Visual grid of capabilities */}
      <VisionIconFeatures language={language} />

      {/* PERSONA SECTION INTRO - Features */}
      {isPersonalized && (
        <FunSectionIntro persona={persona} page="vision" sectionId="features" />
      )}

      {/* 5. VISUAL DIVIDER - Emotional break */}
      <VisionVisualDivider language={language} variant="journey" />

      {/* 6. TRUST LOGOS */}
      <VisionTrustLogos language={language} />

      {/* 7. PROFITABILITY ROADMAP */}
      <div id="vision-roadmap">
        <VisionProfitabilityRoadmap language={language} />
      </div>

      {/* PERSONA INTERRUPT CARD */}
      {isPersonalized && (
        <FunInterruptCard persona={persona} page="vision" afterSection="roadmap" />
      )}

      {/* 8. VISUAL DIVIDER - Business */}
      <VisionVisualDivider language={language} variant="business" />

      {/* 9. TRACTION DASHBOARD */}
      <div id="vision-progress">
        <VisionTractionDashboard language={language} />
      </div>

      {/* 10. COMPARISON MATRIX */}
      <VisionComparisonMatrix language={language} />

      {/* PERSONA SECTION INTRO - Comparison */}
      {isPersonalized && (
        <FunSectionIntro persona={persona} page="vision" sectionId="comparison" />
      )}

      {/* 11. VISUAL DIVIDER - Family */}
      <VisionVisualDivider language={language} variant="family" />

      {/* 12. SALES FUNNEL */}
      <div id="vision-sales-funnel">
        <VisionSalesFunnelDiagram language={language} />
      </div>

      {/* PERSONA INTERRUPT CARD */}
      {isPersonalized && (
        <FunInterruptCard persona={persona} page="vision" afterSection="funnel" />
      )}

      {/* 13. SYSTEM DIAGRAM */}
      <div id="vision-system">
        <VisionSystemDiagram language={language} />
      </div>

      {/* COLLAPSIBLE SECTIONS - Detailed Content */}
      <div className="max-w-6xl mx-auto">
        
        <VisionCollapsibleSection
          title={language === 'de' ? "10 Kunden-Vorteile" : language === 'it' ? "10 Vantaggi Clienti" : "10 клиентски предимства"}
          icon={<Users className="w-5 h-5" />}
          badge={language === 'de' ? "Systemvorteile" : language === 'it' ? "Vantaggi di Sistema" : "Системни предимства"}
          defaultOpen={false}
          forceOpen={allExpanded}
          language={language}
        >
          <div id="vision-customer-usps">
            <CustomerUSPVisualCards language={language} />
          </div>
        </VisionCollapsibleSection>
        
        <VisionCollapsibleSection
          title={language === 'de' ? "10 Investoren-Säulen" : language === 'it' ? "10 Pilastri Investitori" : "10 инвеститорски стълба"}
          icon={<TrendingUp className="w-5 h-5" />}
          badge={language === 'de' ? "Business Model" : language === 'it' ? "Modello di Business" : "Бизнес модел"}
          defaultOpen={false}
          forceOpen={allExpanded}
          language={language}
        >
          <div id="vision-investor-pillars">
            <Vision10PillarSection allExpanded={allExpanded} language={language} />
          </div>
        </VisionCollapsibleSection>

        {/* PERSONA SECTION INTRO - Pillars */}
        {isPersonalized && (
          <FunSectionIntro persona={persona} page="vision" sectionId="pillars" />
        )}
        
        <VisionCollapsibleSection
          title={language === 'de' ? "Einfach erklärt für die Familie" : language === 'it' ? "Spiegato Semplicemente per la Famiglia" : "Обяснено просто за семейството"}
          icon={<Sparkles className="w-5 h-5" />}
          badge={language === 'de' ? "Für Eltern" : language === 'it' ? "Per i Genitori" : "За родители"}
          defaultOpen={false}
          forceOpen={allExpanded}
          language={language}
        >
          <div id="vision-family-summary">
            <FamilySummary language={language} />
          </div>
        </VisionCollapsibleSection>
        
        <VisionCollapsibleSection
          title={language === 'de' ? "10 Einnahmequellen im Detail" : language === 'it' ? "10 Fonti di Ricavo in Dettaglio" : "10 източника на приходи"}
          icon={<DollarSign className="w-5 h-5" />}
          badge={language === 'de' ? "553 CHF/Kunde" : language === 'it' ? "553 CHF/Cliente" : "553 CHF/клиент"}
          defaultOpen={false}
          forceOpen={allExpanded}
          language={language}
        >
          <div id="vision-revenue-examples">
            <RevenueStreamExamples language={language} />
          </div>
        </VisionCollapsibleSection>

        {/* PERSONA INTERRUPT CARD */}
        {isPersonalized && (
          <FunInterruptCard persona={persona} page="vision" afterSection="revenue" />
        )}
        
        <VisionCollapsibleSection
          title={language === 'de' ? "Unit Economics: Contribution Margin" : language === 'it' ? "Unit Economics: Contribution Margin" : "Unit Economics: Contribution Margin"}
          icon={<Target className="w-5 h-5" />}
          badge={language === 'de' ? "CAC + Ops getrennt" : language === 'it' ? "CAC + Ops separati" : "CAC + Ops отделно"}
          defaultOpen={false}
          forceOpen={allExpanded}
          language={language}
        >
          <div id="vision-unit-economics">
            <UnitEconomicsDetailed language={language} />
          </div>
        </VisionCollapsibleSection>
        
        <VisionCollapsibleSection
          title={language === 'de' ? "Marktpotenzial Schweiz" : language === 'it' ? "Potenziale di Mercato Svizzera" : "Пазарен потенциал Швейцария"}
          icon={<Rocket className="w-5 h-5" />}
          badge={language === 'de' ? "450'000 Umzüge/Jahr" : language === 'it' ? "450'000 Traslochi/Anno" : "450'000 преместванията/год"}
          defaultOpen={false}
          forceOpen={allExpanded}
          language={language}
        >
          <div id="vision-market-potential">
            <MarketPotentialSection language={language} />
          </div>
        </VisionCollapsibleSection>
        
      </div>

      {/* JOKES SECTION - Only for BG/IT */}
      {(language === 'bg' || language === 'it') && (
        <section className="py-12 bg-muted/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground/80 mb-2">
                {language === 'bg' ? '🌿 Зелена Мъдрост за Визионери' : '🌿 Saggezza Verde per Visionari'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'bg' ? '60 вица за добро настроение' : '60 battute per buon umore'}
              </p>
            </div>
            <StakeholderJokesGrid language={language} count={9} />
            <div className="mt-6 max-w-md mx-auto">
              <StakeholderJokeBanner language={language} variant="compact" />
            </div>
          </div>
        </section>
      )}

      {/* COMPLIANCE */}
      <VisionComplianceSection language={language} />

      {/* TEAM */}
      <div id="vision-team">
        <ScrollReveal>
          <VisionTeamSection language={language} />
        </ScrollReveal>
      </div>

      {/* PERSONA SECTION INTRO - Team */}
      {isPersonalized && (
        <FunSectionIntro persona={persona} page="vision" sectionId="team" />
      )}

      {/* UNIQUENESS */}
      <div id="vision-uniqueness">
        <ScrollReveal>
          <VisionUniqueness language={language} />
        </ScrollReveal>
      </div>

      {/* EXIT TIMELINE */}
      <div id="vision-exit">
        <VisionScrollTracker sectionId="exit" sectionName="Exit Timeline">
          <ScrollReveal>
            <ExitTimeline language={language} />
          </ScrollReveal>
        </VisionScrollTracker>
      </div>

      {/* FOOTER CTA - With Persona Variant */}
      <section className="py-8 md:py-12 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            {t.footer.questions}
          </p>
          
          {/* Persona CTA */}
          {isPersonalized ? (
            <FunCTA persona={persona} page="vision" index={0} />
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <Button 
                variant="outline"
                onClick={handleExportPDF}
                disabled={isExporting}
                className="w-full sm:w-auto min-h-[48px] touch-manipulation"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {t.footer.downloadPdf}
              </Button>
              <Link to="/" className="w-full sm:w-auto">
                <Button size="lg" className="w-full min-h-[48px] touch-manipulation">
                  {t.footer.toMainPage}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Floating Contact CTA */}
      <VisionContactCTA language={language} variant="full" />

      {/* Persona Narrator - Floating */}
      {isPersonalized && (
        <FunNarrator persona={persona} page="vision" />
      )}
    </div>
  );
}
