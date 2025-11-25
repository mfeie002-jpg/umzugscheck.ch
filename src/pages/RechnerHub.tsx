import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEOHead } from "@/components/SEOHead";
import { Calculator, Package, Truck, Sparkles, Trash2, Warehouse, Box, Wrench, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";

const RechnerHub = () => {
  const mainTools = [
    {
      title: "Umzugskosten-Rechner",
      slug: "umzugskosten",
      description: "Berechnen Sie die Gesamtkosten Ihres Umzugs basierend auf Zimmerzahl, Distanz und gewünschten Services.",
      icon: Calculator,
      popular: true
    },
    {
      title: "Volumenrechner",
      slug: "volumenrechner",
      description: "Ermitteln Sie das Volumen Ihres Hausrats in Kubikmetern für eine präzise Kostenkalkulation.",
      icon: Package,
      popular: false
    },
    {
      title: "Transporter-Grössen-Rechner",
      slug: "transporter-groesse",
      description: "Finden Sie heraus, welche Transportergrösse Sie für Ihren Umzug benötigen.",
      icon: Truck,
      popular: false
    }
  ];

  const additionalTools = [
    {
      title: "KI-Umzugsrechner",
      slug: "ai",
      description: "Analysieren Sie Fotos oder Videos Ihrer Wohnung mit künstlicher Intelligenz",
      icon: Sparkles
    },
    {
      title: "Reinigungsrechner",
      slug: "reinigung",
      description: "Berechnen Sie die Kosten für die Endreinigung Ihrer alten Wohnung",
      icon: Sparkles
    },
    {
      title: "Entsorgungsrechner",
      slug: "entsorgung",
      description: "Kalkulieren Sie die Kosten für Entsorgung und Räumung",
      icon: Trash2
    },
    {
      title: "Lagerrechner",
      slug: "lager",
      description: "Ermitteln Sie die Kosten für Zwischenlagerung Ihres Hausrats",
      icon: Warehouse
    },
    {
      title: "Packservice-Rechner",
      slug: "packservice",
      description: "Berechnen Sie die Kosten für professionellen Packservice",
      icon: Box
    },
    {
      title: "Möbelmontage-Rechner",
      slug: "moebelmontage",
      description: "Kalkulieren Sie die Kosten für Montage und Demontage Ihrer Möbel",
      icon: Wrench
    }
  ];

  const breadcrumbItems = [{ label: "Rechner" }];

  return (
    <>
      <SEOHead
        title="Umzugstools & Rechner - Kostenlose Kalkulatoren | Umzugscheck.ch"
        description="Nutzen Sie unsere kostenlosen Umzugsrechner: Kosten kalkulieren, Volumen berechnen, Transportergrösse ermitteln und mehr. Präzise Planung für Ihren Umzug."
        keywords="umzugsrechner, volumenrechner, umzugskosten berechnen, transporter rechner"
        canonical="https://umzugscheck.ch/rechner"
      />

      <Navigation />

      <main className="min-h-screen bg-background">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={breadcrumbItems} showHome />
        </div>

        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center">
                <Badge variant="secondary" className="mb-4">
                  <Calculator className="w-3 h-3 mr-1" />
                  Kostenlose Tools
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Umzugstools & Rechner
                </h1>
                <p className="text-xl text-muted-foreground">
                  Planen Sie Ihren Umzug mit unseren kostenlosen Rechnern. 
                  Von Kostenschätzung bis Transportergrösse – wir helfen bei der Planung.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Main Tools */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <ScrollReveal>
                <h2 className="text-3xl font-bold text-center mb-12">
                  Hauptrechner
                </h2>
              </ScrollReveal>

              <div className="grid md:grid-cols-3 gap-6">
                {mainTools.map((tool, index) => (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <Link to={`/rechner/${tool.slug}`}>
                      <Card className={`h-full hover:shadow-strong transition-all group ${
                        tool.popular ? 'border-primary/40 shadow-medium' : ''
                      }`}>
                        {tool.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-primary">
                              Beliebtester Rechner
                            </Badge>
                          </div>
                        )}
                        <CardHeader className="pt-8">
                          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                            <tool.icon className="w-8 h-8 text-primary" />
                          </div>
                          <CardTitle className="text-center text-xl group-hover:text-primary transition-colors">
                            {tool.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                          <p className="text-muted-foreground mb-6">{tool.description}</p>
                          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            Tool öffnen
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Additional Tools */}
        <section className="py-16 md:py-24 bg-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal>
                <h2 className="text-3xl font-bold text-center mb-4">
                  Weitere Spezialrechner
                </h2>
                <p className="text-center text-lg text-muted-foreground mb-12">
                  Zusätzliche Tools für spezifische Umzugsleistungen
                </p>
              </ScrollReveal>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {additionalTools.map((tool, index) => (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <Link to={`/rechner/${tool.slug}`}>
                      <Card className="h-full hover:shadow-medium hover:border-primary/40 transition-all group">
                        <CardHeader>
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                            <tool.icon className="w-6 h-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {tool.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                          <Button variant="ghost" size="sm" className="w-full">
                            Jetzt berechnen
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Kosten berechnet? Jetzt Offerten einholen!
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Holen Sie sich kostenlose Angebote von geprüften Umzugsfirmen und vergleichen Sie die Preise.
                </p>
                <Link to="/offerte">
                  <Button size="lg" className="shadow-accent">
                    Kostenlose Offerte anfordern
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default RechnerHub;
