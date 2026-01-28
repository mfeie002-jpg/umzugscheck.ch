import { Helmet } from "react-helmet-async";
import { useRef } from "react";
import { FileDown, Printer } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Logo, 
  LogoClassic, LogoModern, LogoSwiss, LogoInitials, LogoSignature,
  LogoBold, LogoLight, LogoBadge, LogoMinimal, LogoStacked,
  LogoCircle, LogoShield, LogoRibbon, LogoStamp, LogoWave,
  LogoSplit, LogoUnderline, LogoBoxed, LogoArrow, LogoDots
} from "@/components/Logo";
import { Button } from "@/components/ui/button";

const BrandDemo = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();

  // All 20 logo variants with descriptions
  const logoVariants = [
    { name: "Classic", description: "Horizontal mit Truck-Icon", component: LogoClassic, usage: "Header, Navigation" },
    { name: "Modern", description: "Punkt-Trenner", component: LogoModern, usage: "Footer, Dokumente" },
    { name: "Swiss", description: "Zentriert mit Linien", component: LogoSwiss, usage: "Hero, Visitenkarten" },
    { name: "Initials", description: "FU Monogramm", component: LogoInitials, usage: "App-Icons, Favicon" },
    { name: "Signature", description: "Elegant kursiv", component: LogoSignature, usage: "Premium-Materialien" },
    { name: "Bold", description: "Stark & kraftvoll", component: LogoBold, usage: "Poster, Werbung" },
    { name: "Light", description: "Fein & elegant", component: LogoLight, usage: "Briefpapier" },
    { name: "Badge", description: "Mit Truck-Icon (Header)", component: LogoBadge, usage: "Website-Header" },
    { name: "Minimal", description: "Ultra-clean lowercase", component: LogoMinimal, usage: "Web-Footer" },
    { name: "Stacked", description: "Vertikal gestapelt", component: LogoStacked, usage: "Quadratische Formate" },
    { name: "Circle", description: "Rund mit Haus-Icon", component: LogoCircle, usage: "Social Media" },
    { name: "Shield", description: "Schutz-Stil", component: LogoShield, usage: "Vertrauen, Sicherheit" },
    { name: "Ribbon", description: "Banner-Stil schräg", component: LogoRibbon, usage: "Auszeichnungen" },
    { name: "Stamp", description: "Runder Stempel", component: LogoStamp, usage: "Siegel, Zertifikate" },
    { name: "Wave", description: "Mit Wellen-Linie", component: LogoWave, usage: "Kreative Materialien" },
    { name: "Split", description: "Zweifarbig geteilt", component: LogoSplit, usage: "Modern, auffällig" },
    { name: "Underline", description: "Mit Akzent-Linie", component: LogoUnderline, usage: "Präsentationen" },
    { name: "Boxed", description: "Wörter in Boxen", component: LogoBoxed, usage: "Stark, industriell" },
    { name: "Arrow", description: "Mit Richtungs-Icons", component: LogoArrow, usage: "Umzugs-Fokus" },
    { name: "Dots", description: "Mit dekorativen Punkten", component: LogoDots, usage: "Verspielt, modern" },
  ];

  return (
    <>
      <Helmet>
        <title>Brand Guidelines - 20 Logo-Variationen | Feierabend Umzüge</title>
      </Helmet>
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8" ref={contentRef}>
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              20 Logo-Variationen
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Alle Varianten nutzen einheitlich <span className="text-primary font-semibold">Brand Blue</span> (HSL 200 65% 40%)
            </p>
            
            <div className="flex justify-center gap-4 no-print">
              <Button onClick={handlePrint} variant="outline" className="gap-2">
                <Printer className="h-4 w-4" />
                Drucken / PDF
              </Button>
            </div>
          </div>

          {/* All 20 Logo Variations Grid */}
          <section className="mb-20">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">
              Alle 20 Varianten
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {logoVariants.map((variant, index) => {
                const LogoComponent = variant.component;
                return (
                  <div key={variant.name} className="bg-card rounded-2xl p-5 border border-border shadow-soft hover:shadow-lg transition-shadow">
                    <div className="text-xs font-medium text-primary mb-3 uppercase tracking-wider flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      {variant.name}
                    </div>
                    
                    <div className="p-4 bg-background rounded-xl mb-3 min-h-[80px] flex items-center justify-center">
                      <LogoComponent size="md" showIcon showTagline />
                    </div>
                    
                    <p className="text-sm text-foreground font-medium">{variant.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{variant.usage}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Size Comparison */}
          <section className="mb-20">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">
              Größen-Vergleich
            </h2>
            
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="space-y-8">
                {["xl", "lg", "md", "sm"].map((size) => (
                  <div key={size} className="flex items-center gap-4">
                    <span className="w-12 text-sm font-mono text-muted-foreground">{size.toUpperCase()}</span>
                    <div className="flex-1 p-4 bg-background rounded-xl">
                      <LogoBadge size={size as "sm" | "md" | "lg" | "xl"} showIcon />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Color System */}
          <section className="mb-20">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">
              Einheitliches Farbschema
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl overflow-hidden border border-border shadow-soft">
                <div className="h-24 bg-primary" />
                <div className="p-4 bg-card">
                  <h3 className="font-bold text-foreground">Brand Blue</h3>
                  <p className="text-xs text-muted-foreground">HSL: 200 65% 40%</p>
                </div>
              </div>
              
              <div className="rounded-2xl overflow-hidden border border-border shadow-soft">
                <div className="h-24 bg-foreground" />
                <div className="p-4 bg-card">
                  <h3 className="font-bold text-foreground">Foreground</h3>
                  <p className="text-xs text-muted-foreground">Text & Kontrast</p>
                </div>
              </div>
              
              <div className="rounded-2xl overflow-hidden border border-border shadow-soft">
                <div className="h-24 bg-muted" />
                <div className="p-4 bg-card">
                  <h3 className="font-bold text-foreground">Muted</h3>
                  <p className="text-xs text-muted-foreground">Hintergründe</p>
                </div>
              </div>
              
              <div className="rounded-2xl overflow-hidden border border-border shadow-soft">
                <div className="h-24 bg-background border-2 border-border" />
                <div className="p-4 bg-card">
                  <h3 className="font-bold text-foreground">Background</h3>
                  <p className="text-xs text-muted-foreground">Haupthintergrund</p>
                </div>
              </div>
            </div>
          </section>

          {/* Dark Background Demo */}
          <section className="mb-20">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">
              Auf dunklem Hintergrund
            </h2>
            
            <div className="bg-foreground rounded-2xl p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-white/10 backdrop-blur rounded-xl flex justify-center">
                  <LogoBadge size="md" showIcon className="[&_span]:text-white [&_div]:bg-white/20" />
                </div>
                <div className="p-4 bg-white/10 backdrop-blur rounded-xl flex justify-center">
                  <LogoSplit size="md" className="[&>div:first-child]:bg-white [&>div:first-child]:text-foreground" />
                </div>
                <div className="p-4 bg-white/10 backdrop-blur rounded-xl flex justify-center">
                  <LogoStamp size="md" className="border-white [&_span]:text-white" />
                </div>
              </div>
            </div>
          </section>

          {/* Quick Reference */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-8 text-center">
              Quick Reference
            </h2>
            
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
              <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
                {logoVariants.map((variant, index) => {
                  const LogoComponent = variant.component;
                  return (
                    <div key={variant.name} className="p-2 bg-background rounded-lg flex flex-col items-center gap-1">
                      <LogoComponent size="sm" showIcon={false} showTagline={false} />
                      <span className="text-[8px] text-muted-foreground">{index + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default BrandDemo;