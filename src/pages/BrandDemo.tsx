import { Helmet } from "react-helmet";
import { useRef } from "react";
import { Printer } from "lucide-react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Logo, LogoIcon } from "@/components/Logo";
import { Button } from "@/components/ui/button";

const BrandDemo = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();

  return (
    <>
      <Helmet>
        <title>Brand Guidelines | Umzugscheck.ch</title>
      </Helmet>
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8" ref={contentRef}>
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Brand Guidelines
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Logo-Varianten und Farbschema für Umzugscheck.ch
            </p>
            
            <div className="flex justify-center gap-4 no-print">
              <Button onClick={handlePrint} variant="outline" className="gap-2">
                <Printer className="h-4 w-4" />
                Drucken / PDF
              </Button>
            </div>
          </div>

          {/* Main Logo */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Hauptlogo
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Standard (Light Background)</h3>
                <div className="p-6 bg-background rounded-xl flex items-center justify-center min-h-[120px]">
                  <Logo size="xl" />
                </div>
              </div>
              
              <div className="bg-foreground rounded-2xl p-8">
                <h3 className="text-sm font-medium text-white/70 mb-4">Dark Background</h3>
                <div className="p-6 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center min-h-[120px]">
                  <Logo size="xl" className="[&_text]:fill-white [&_span]:text-white/70" />
                </div>
              </div>
            </div>
          </section>

          {/* Size Comparison */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Größen-Vergleich
            </h2>
            
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="space-y-8">
                {(["xl", "lg", "md", "sm"] as const).map((size) => (
                  <div key={size} className="flex items-center gap-4">
                    <span className="w-12 text-sm font-mono text-muted-foreground">{size.toUpperCase()}</span>
                    <div className="flex-1 p-4 bg-background rounded-xl">
                      <Logo size={size} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Icon Only */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Icon-Only (Favicon, App Icon)
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(["xl", "lg", "md", "sm"] as const).map((size) => (
                <div key={size} className="bg-card rounded-2xl p-6 border border-border text-center">
                  <div className="p-4 bg-background rounded-xl flex items-center justify-center mb-4">
                    <Logo size={size} iconOnly />
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">{size}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Color System */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Farbschema
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
                <div className="h-24 bg-primary" />
                <div className="p-4 bg-card">
                  <h3 className="font-bold text-foreground">Primary (Swiss Red)</h3>
                  <p className="text-xs text-muted-foreground">#dc2626</p>
                </div>
              </div>
              
              <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
                <div className="h-24 bg-foreground" />
                <div className="p-4 bg-card">
                  <h3 className="font-bold text-foreground">Foreground</h3>
                  <p className="text-xs text-muted-foreground">Text & Kontrast</p>
                </div>
              </div>
              
              <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
                <div className="h-24 bg-muted" />
                <div className="p-4 bg-card">
                  <h3 className="font-bold text-foreground">Muted</h3>
                  <p className="text-xs text-muted-foreground">Hintergründe</p>
                </div>
              </div>
              
              <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
                <div className="h-24 bg-background border-2 border-border" />
                <div className="p-4 bg-card">
                  <h3 className="font-bold text-foreground">Background</h3>
                  <p className="text-xs text-muted-foreground">Haupthintergrund</p>
                </div>
              </div>
            </div>
          </section>

          {/* LogoIcon standalone */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-center">
              LogoIcon Component
            </h2>
            
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <LogoIcon className="w-16 h-16 mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">64x64</span>
                </div>
                <div className="text-center">
                  <LogoIcon className="w-12 h-12 mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">48x48</span>
                </div>
                <div className="text-center">
                  <LogoIcon className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">32x32</span>
                </div>
                <div className="text-center">
                  <LogoIcon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">24x24</span>
                </div>
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