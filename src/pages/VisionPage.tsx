import { useState } from "react";
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
import { VisionHeroExecutive } from "@/components/vision/VisionHeroExecutive";
import { VisionAudienceSwitcher } from "@/components/vision/VisionAudienceSwitcher";
import { VisionTractionDashboard } from "@/components/vision/VisionTractionDashboard";
import { VisionTrustLogos } from "@/components/vision/VisionTrustLogos";
import { VisionComparisonMatrix } from "@/components/vision/VisionComparisonMatrix";
import { VisionComplianceSection } from "@/components/vision/VisionComplianceSection";
import { VisionProfitabilityRoadmap } from "@/components/vision/VisionProfitabilityRoadmap";
import { VisionEmotionalHero } from "@/components/vision/VisionEmotionalHero";
import { VisionMovingMoments } from "@/components/vision/VisionMovingMoments";
import { VisionSalesFunnelDiagram } from "@/components/vision/VisionSalesFunnelDiagram";
import { VisionHumanStorySection } from "@/components/vision/VisionHumanStorySection";
import { VisionSystemDiagram } from "@/components/vision/VisionSystemDiagram";
import { getVisionTranslation, type VisionLanguage } from "@/lib/vision-translations";

export default function VisionPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [language, setLanguage] = useState<VisionLanguage>('de');
  const [allExpanded, setAllExpanded] = useState(false);
  const { toast } = useToast();
  
  const t = getVisionTranslation(language);

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

  // CTA Handlers
  const handleDemoClick = () => {
    toast({
      title: language === 'de' ? "Demo Video" : language === 'it' ? "Video Demo" : "Демо видео",
      description: language === 'de' ? "Coming soon! Kontaktiere uns für eine Live-Demo." : language === 'it' ? "Prossimamente! Contattaci per una demo dal vivo." : "Скоро! Свържи се с нас за live demo.",
    });
  };

  const handlePitchDeckClick = () => {
    handleExportPDF();
  };

  const handleContactClick = () => {
    window.location.href = "mailto:info@umzugscheck.ch?subject=Umzugscheck.ch%20-%20Gespräch%20anfragen";
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        pageType="home"
        url="https://umzugscheck.ch/vision"
      />

      {/* Sticky Header with Download Buttons */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
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
                className="relative touch-manipulation min-h-[40px] px-3 md:px-4 bg-[#E32026] hover:bg-[#c91c21] text-white whitespace-nowrap"
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

      {/* Sticky Navigation */}
      <VisionStickyNav language={language} />

      {/* 0. EMOTIONAL HERO - Human Side of Moving */}
      <VisionEmotionalHero language={language} variant="full" />

      {/* 1. EXECUTIVE SUMMARY HERO (ChatGPT Priority #1) */}
      <VisionHeroExecutive 
        language={language}
        onDemoClick={handleDemoClick}
        onPitchDeckClick={handlePitchDeckClick}
        onContactClick={handleContactClick}
      />

      {/* 2. AUDIENCE SWITCHER (ChatGPT Priority #2) */}
      <VisionAudienceSwitcher language={language} />

      {/* NEW: Emotional Moving Moments Gallery */}
      <VisionMovingMoments language={language} />

      {/* NEW: Trust Logos Bar (External Validation) */}
      <VisionTrustLogos language={language} />

      {/* NEW: Profitability Roadmap (12-Month Timeline) */}
      <div id="vision-roadmap">
        <VisionProfitabilityRoadmap language={language} />
      </div>

      {/* 3. TRACTION DASHBOARD (ChatGPT Priority #4) */}
      <div id="vision-progress">
        <VisionTractionDashboard language={language} />
      </div>

      {/* NEW: Comparison Matrix (Unfair Advantage) */}
      <VisionComparisonMatrix language={language} />

      {/* NEW: Sales Funnel Diagram - Complete Revenue Map */}
      <div id="vision-sales-funnel">
        <VisionSalesFunnelDiagram language={language} />
      </div>

      {/* NEW: Human Stories - Emotional Connection */}
      <VisionHumanStorySection language={language} />

      {/* NEW: System Diagram - How Everything Connects */}
      <div id="vision-system">
        <VisionSystemDiagram language={language} />
      </div>

      {/* COLLAPSIBLE SECTIONS */}
      <div className="max-w-6xl mx-auto">
        
        {/* Customer USPs - Changed "Magic" to "Systemvorteile" */}
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
        
        {/* Investor Pillars */}
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
        
        {/* Family Summary */}
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
        
        {/* Revenue Streams */}
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
        
        {/* Unit Economics (ChatGPT Priority #3 - already has CAC breakdown) */}
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
        
        {/* Market Potential */}
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

      {/* NEW: Compliance & Regulatory Section (CRITICAL for Escrow credibility) */}
      <VisionComplianceSection language={language} />

      {/* Team Section */}
      <div id="vision-team">
        <ScrollReveal>
          <VisionTeamSection language={language} />
        </ScrollReveal>
      </div>

      {/* Uniqueness */}
      <div id="vision-uniqueness">
        <ScrollReveal>
          <VisionUniqueness language={language} />
        </ScrollReveal>
      </div>

      {/* Exit Timeline */}
      <div id="vision-exit">
        <ScrollReveal>
          <ExitTimeline language={language} />
        </ScrollReveal>
      </div>

      {/* Footer CTA */}
      <section className="py-8 md:py-12 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            {t.footer.questions}
          </p>
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
        </div>
      </section>
    </div>
  );
}
