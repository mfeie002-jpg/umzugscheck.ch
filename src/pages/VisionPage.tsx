import { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Vision10PillarSection } from "@/components/homepage/Vision10PillarSection";
import { CustomerUSPVisualCards } from "@/components/homepage/CustomerUSPVisualCards";
import { FamilySummary } from "@/components/homepage/FamilySummary";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, Loader2, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { exportVisionToPDF, exportVisionAsTextPDF } from "@/lib/vision-pdf-export";
import { useToast } from "@/hooks/use-toast";
import { VisionLanguageSwitcher } from "@/components/vision/VisionLanguageSwitcher";
import { VisionRoadmapTimeline } from "@/components/vision/VisionRoadmapTimeline";
import { RevenueStreamExamples } from "@/components/vision/RevenueStreamExamples";
import { UnitEconomicsDetailed } from "@/components/vision/UnitEconomicsDetailed";
import { ExitTimeline } from "@/components/vision/ExitTimeline";
import { getVisionTranslation, type VisionLanguage } from "@/lib/vision-translations";

export default function VisionPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [allExpanded, setAllExpanded] = useState(false);
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

      {/* Simple Header with Download Buttons */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
              variant={allExpanded ? "default" : "outline"}
              size="sm"
              onClick={() => setAllExpanded(!allExpanded)}
              className="gap-2"
            >
              {allExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {allExpanded ? t.page.hideDetails : t.page.showAllDetails}
            </Button>
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

      {/* Hero for Vision Page */}
      <section id="vision-hero" className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            {t.page.badge}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t.page.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.page.subtitle}
          </p>
        </div>
      </section>

      {/* 10 Kunden-USPs - Visuelle Infografik-Karten */}
      <div id="vision-customer-usps">
        <ScrollReveal>
          <CustomerUSPVisualCards />
        </ScrollReveal>
      </div>

      {/* Vision 10 Pillars - Kunden & Investoren USPs (Tabs) */}
      <div id="vision-investor-pillars">
        <ScrollReveal>
          <Vision10PillarSection allExpanded={allExpanded} />
        </ScrollReveal>
      </div>

      {/* Eltern-Zusammenfassung */}
      <div id="vision-family-summary">
        <ScrollReveal>
          <FamilySummary />
        </ScrollReveal>
      </div>

      {/* NEW: Detaillierte Revenue Stream Beispiele */}
      <div id="vision-revenue-examples">
        <ScrollReveal>
          <RevenueStreamExamples />
        </ScrollReveal>
      </div>

      {/* NEW: Unit Economics Detailed */}
      <div id="vision-unit-economics">
        <ScrollReveal>
          <UnitEconomicsDetailed />
        </ScrollReveal>
      </div>

      {/* Roadmap Timeline - Der Weg zum Marktführer */}
      <div id="vision-roadmap">
        <ScrollReveal>
          <VisionRoadmapTimeline t={t} />
        </ScrollReveal>
      </div>

      {/* NEW: Exit Timeline mit Bewertungen */}
      <div id="vision-exit">
        <ScrollReveal>
          <ExitTimeline />
        </ScrollReveal>
      </div>

      {/* Footer CTA */}
      <section className="py-16 bg-primary/5">
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
