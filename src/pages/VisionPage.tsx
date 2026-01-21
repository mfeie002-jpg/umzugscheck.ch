import { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Vision10PillarSection } from "@/components/homepage/Vision10PillarSection";
import { CustomerUSPVisualCards } from "@/components/homepage/CustomerUSPVisualCards";
import { FamilySummary } from "@/components/homepage/FamilySummary";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, Loader2, Users, TrendingUp, Sparkles, DollarSign, Target, Globe, Rocket, Heart } from "lucide-react";
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
import { VisionStickyNav } from "@/components/vision/VisionStickyNav";
import { VisionTeamSection } from "@/components/vision/VisionTeamSection";
import { getVisionTranslation, type VisionLanguage } from "@/lib/vision-translations";

// Mission statement translations
const missionTranslations = {
  de: {
    tagline: "Die Mission",
    headline: "Wir revolutionieren, wie die Schweiz umzieht",
    subheadline: "Eine KI-gestützte Plattform, die den gesamten Umzugsprozess automatisiert – von der Offerte bis zur Schlüsselübergabe.",
    stats: [
      { value: "95%", label: "KI-Automatisierung" },
      { value: "553 CHF", label: "Umsatz pro Kunde" },
      { value: "90%+", label: "Profit-Marge" },
      { value: "10", label: "Einnahmequellen" },
    ]
  },
  bg: {
    tagline: "Мисията",
    headline: "Революционизираме начина, по който Швейцария се мести",
    subheadline: "AI платформа, която автоматизира целия процес на преместване – от офертата до предаването на ключовете.",
    stats: [
      { value: "95%", label: "AI автоматизация" },
      { value: "553 CHF", label: "Приход на клиент" },
      { value: "90%+", label: "Марж на печалба" },
      { value: "10", label: "Източници на приходи" },
    ]
  }
};

export default function VisionPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [language, setLanguage] = useState<VisionLanguage>('de');
  const { toast } = useToast();
  
  const t = getVisionTranslation(language);
  const mission = missionTranslations[language];

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

      {/* IMPROVEMENT #2: Sticky Navigation */}
      <VisionStickyNav language={language} />

      {/* IMPROVEMENT #1: Mission Statement Hero */}
      <section id="vision-hero" className="py-12 md:py-16 bg-gradient-to-b from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Mission Badge */}
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-6">
              {mission.tagline}
            </span>
            
            {/* Main Headline - The Mission */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {mission.headline}
            </h1>
            
            {/* Sub-headline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {mission.subheadline}
            </p>
            
            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {mission.stats.map((stat, i) => (
                <div key={i} className="p-4 rounded-xl bg-background border shadow-sm">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* Quick Links to Dedicated Pages */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/family">
                <Button variant="outline" size="sm" className="gap-2">
                  <Heart className="w-4 h-4" />
                  {language === 'de' ? 'Für Familie' : 'За семейството'}
                </Button>
              </Link>
              <Link to="/investoren">
                <Button variant="outline" size="sm" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {language === 'de' ? 'Für Investoren' : 'За инвеститори'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Milestones */}
      <div id="vision-progress">
        <VisionProgressMilestones language={language} />
        <ContributionBreakdown language={language} />
      </div>

      {/* COLLAPSIBLE SECTIONS */}
      <div className="max-w-6xl mx-auto">
        
        {/* Customer USPs */}
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
        
        {/* Investor Pillars */}
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
        
        {/* Family Summary */}
        <VisionCollapsibleSection
          title={language === 'de' ? "Einfach erklärt für die Familie" : "Обяснено просто за семейството"}
          icon={<Sparkles className="w-5 h-5" />}
          badge={language === 'de' ? "Für Eltern" : "За родители"}
          defaultOpen={false}
          language={language}
        >
          <div id="vision-family-summary">
            <FamilySummary />
          </div>
        </VisionCollapsibleSection>
        
        {/* Revenue Streams */}
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
        
        {/* Unit Economics */}
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
        
        {/* Market Potential */}
        <VisionCollapsibleSection
          title={language === 'de' ? "Marktpotenzial Schweiz" : "Пазарен потенциал Швейцария"}
          icon={<Rocket className="w-5 h-5" />}
          badge={language === 'de' ? "450'000 Umzüge/Jahr" : "450'000 преместванията/год"}
          defaultOpen={false}
          language={language}
        >
          <div id="vision-market-potential">
            <MarketPotentialSection language={language} />
          </div>
        </VisionCollapsibleSection>
        
      </div>

      {/* IMPROVEMENT #3: Team Section */}
      <ScrollReveal>
        <VisionTeamSection language={language} />
      </ScrollReveal>

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
