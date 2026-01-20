import { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Vision10PillarSection } from "@/components/homepage/Vision10PillarSection";
import { CustomerUSPVisualCards } from "@/components/homepage/CustomerUSPVisualCards";
import { FamilySummary } from "@/components/homepage/FamilySummary";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { exportVisionToPDF, exportVisionAsTextPDF } from "@/lib/vision-pdf-export";
import { useToast } from "@/hooks/use-toast";

export default function VisionPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      await exportVisionToPDF((progress, message) => {
        setExportProgress(progress);
      });
      
      toast({
        title: "PDF erstellt! ✅",
        description: "Die Vision-Präsentation wurde heruntergeladen.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "PDF konnte nicht erstellt werden. Bitte versuchen Sie es erneut.",
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
        title: "Text-PDF erstellt! ✅",
        description: "Die kompakte Version wurde heruntergeladen.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "PDF konnte nicht erstellt werden.",
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
              Zurück zur Hauptseite
            </Button>
          </Link>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportTextPDF}
              disabled={isExporting}
            >
              <FileText className="w-4 h-4 mr-2" />
              Kompakt-PDF
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
                  Als PDF herunterladen
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
            Interne Präsentation
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Umzugscheck.ch Vision
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Die vollständige Übersicht für Familie und Investoren – 
            was wir bauen, warum es funktioniert und wohin die Reise geht.
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
          <Vision10PillarSection />
        </ScrollReveal>
      </div>

      {/* Eltern-Zusammenfassung */}
      <div id="vision-family-summary">
        <ScrollReveal>
          <FamilySummary />
        </ScrollReveal>
      </div>

      {/* Footer CTA */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">
            Fragen? Sprich mich einfach an.
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
              PDF herunterladen
            </Button>
            <Link to="/">
              <Button size="lg">
                Zur Hauptseite
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
