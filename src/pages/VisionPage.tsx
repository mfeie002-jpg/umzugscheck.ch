import { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Vision10PillarSection } from "@/components/homepage/Vision10PillarSection";
import { CustomerUSPVisualCards } from "@/components/homepage/CustomerUSPVisualCards";
import { FamilySummary } from "@/components/homepage/FamilySummary";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, Loader2, Eye, EyeOff, Users, TrendingUp, Sparkles, DollarSign, Target, Crown, Globe, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { exportVisionToPDF, exportVisionAsTextPDF } from "@/lib/vision-pdf-export";
import { useToast } from "@/hooks/use-toast";
import { VisionLanguageSwitcher } from "@/components/vision/VisionLanguageSwitcher";
import { VisionProgressMilestones } from "@/components/vision/VisionProgressMilestones";
import { ContributionBreakdown } from "@/components/vision/ContributionBreakdown";
import { RevenueStreamExamples } from "@/components/vision/RevenueStreamExamples";
import { UnitEconomicsDetailed } from "@/components/vision/UnitEconomicsDetailed";
import { ExitTimeline } from "@/components/vision/ExitTimeline";
import { MarketPotentialSection } from "@/components/vision/MarketPotentialSection";
import { VisionUniqueness } from "@/components/vision/VisionUniqueness";
import { VisionCollapsibleSection } from "@/components/vision/VisionCollapsibleSection";
import { getVisionTranslation, type VisionLanguage } from "@/lib/vision-translations";

export default function VisionPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [language, setLanguage] = useState<VisionLanguage>('de');
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
        title: language === 'de' ? "PDF erstellt! ✅" : "PDF създаден! ✅",
        description: language === 'de' ? "Die Vision-Präsentation wurde heruntergeladen." : "Презентацията е изтеглена.",
      });
    } catch (error) {
      toast({
        title: language === 'de' ? "Fehler" : "Грешка",
        description: language === 'de' ? "PDF konnte nicht erstellt werden." : "PDF не можа да бъде създаден.",
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
        title: language === 'de' ? "Text-PDF erstellt! ✅" : "Текстов PDF създаден! ✅",
        description: language === 'de' ? "Die kompakte Version wurde heruntergeladen." : "Компактната версия е изтеглена.",
      });
    } catch (error) {
      toast({
        title: language === 'de' ? "Fehler" : "Грешка",
        description: language === 'de' ? "PDF konnte nicht erstellt werden." : "PDF не можа да бъде създаден.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        pageType="home"
        url="https://umzugscheck.ch/vision"
      />

      {/* Sticky Header with Download Buttons */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.page.backToMain}
              </Button>
            </Link>
            
            <div className="flex flex-wrap items-center gap-2">
              <VisionLanguageSwitcher 
                currentLang={language} 
                onLanguageChange={setLanguage} 
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportTextPDF}
                disabled={isExporting}
              >
                <FileText className="w-4 h-4 mr-2" />
                {t.page.compactPdf}
              </Button>
              <Button 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="relative"
                size="sm"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {exportProgress}%
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    {t.page.downloadPdf}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Hero */}
      <section id="vision-hero" className="py-8 md:py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t.page.badge}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t.page.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.page.subtitle}
          </p>
        </div>
      </section>

      {/* 1. PROGRESS MILESTONES (Always visible - shows the 3 months of work) */}
      <div id="vision-progress">
        <VisionProgressMilestones language={language} />
        <ContributionBreakdown language={language} />
      </div>

      {/* COLLAPSIBLE SECTIONS START */}
      <div className="max-w-6xl mx-auto">
        
        {/* 2. Customer USPs (Collapsible) */}
        <VisionCollapsibleSection
          title={language === 'de' ? "10 Kunden-Vorteile" : "10 клиентски предимства"}
          icon={<Users className="w-5 h-5" />}
          badge={language === 'de' ? "Magic für Familien" : "Магия за семейства"}
          defaultOpen={false}
          language={language}
        >
          <div id="vision-customer-usps">
            <CustomerUSPVisualCards />
          </div>
        </VisionCollapsibleSection>
        
        {/* 3. Investor Pillars (Collapsible) */}
        <VisionCollapsibleSection
          title={language === 'de' ? "10 Investoren-Säulen" : "10 инвеститорски стълба"}
          icon={<TrendingUp className="w-5 h-5" />}
          badge={language === 'de' ? "Business Model" : "Бизнес модел"}
          defaultOpen={false}
          language={language}
        >
          <div id="vision-investor-pillars">
            <Vision10PillarSection allExpanded={false} />
          </div>
        </VisionCollapsibleSection>
        
        {/* 4. Family Summary (Collapsible but important) */}
        <VisionCollapsibleSection
          title={language === 'de' ? "Einfach erklärt für die Familie" : "Обяснено просто за семейството"}
          icon={<Sparkles className="w-5 h-5" />}
          badge={language === 'de' ? "Für Eltern" : "За родители"}
          defaultOpen={true}
          language={language}
        >
          <div id="vision-family-summary">
            <FamilySummary />
          </div>
        </VisionCollapsibleSection>
        
        {/* 5. Revenue Streams (Collapsible) */}
        <VisionCollapsibleSection
          title={language === 'de' ? "10 Einnahmequellen im Detail" : "10 източника на приходи"}
          icon={<DollarSign className="w-5 h-5" />}
          badge={language === 'de' ? "553 CHF/Kunde" : "553 CHF/клиент"}
          defaultOpen={false}
          language={language}
        >
          <div id="vision-revenue-examples">
            <RevenueStreamExamples language={language} />
          </div>
        </VisionCollapsibleSection>
        
        {/* 6. Unit Economics (Collapsible) */}
        <VisionCollapsibleSection
          title={language === 'de' ? "Unit Economics: Wie wir Geld verdienen" : "Unit Economics: Как печелим пари"}
          icon={<Target className="w-5 h-5" />}
          badge={language === 'de' ? "90%+ Marge" : "90%+ марж"}
          defaultOpen={false}
          language={language}
        >
          <div id="vision-unit-economics">
            <UnitEconomicsDetailed language={language} />
          </div>
        </VisionCollapsibleSection>
        
        {/* 7. Market Potential (Collapsible) */}
        <VisionCollapsibleSection
          title={language === 'de' ? "Marktpotenzial Schweiz" : "Пазарен потенциал Швейцария"}
          icon={<Rocket className="w-5 h-5" />}
          badge={language === 'de' ? "450k Umzüge/Jahr" : "450k преместванията/год"}
          defaultOpen={false}
          language={language}
        >
          <div id="vision-market-potential">
            <MarketPotentialSection language={language} />
          </div>
        </VisionCollapsibleSection>
        
      </div>
      {/* COLLAPSIBLE SECTIONS END */}

      {/* 8. UNIQUENESS - Why this doesn't exist (Full section, not collapsible) */}
      <div id="vision-uniqueness">
        <ScrollReveal>
          <VisionUniqueness language={language} />
        </ScrollReveal>
      </div>

      {/* 9. Exit Timeline (Full section, important) */}
      <div id="vision-exit">
        <ScrollReveal>
          <ExitTimeline language={language} />
        </ScrollReveal>
      </div>

      {/* Footer CTA */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">
            {t.footer.questions}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              variant="outline"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {t.footer.downloadPdf}
            </Button>
            <Link to="/">
              <Button size="lg">
                {t.footer.toMainPage}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
