import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import ComparisonSlider from "@/components/ComparisonSlider";

const PlanCompare = () => {
  const features = [
    { name: "Professioneller Transport", description: "Sicherer Transport Ihrer Möbel und Gegenstände", basic: true, half: true, full: true },
    { name: "Möbeldemontage & Montage", description: "Fachgerechter Auf- und Abbau aller Möbeltypen", basic: true, half: true, full: true },
    { name: "Transportversicherung", description: "Vollständige Versicherung während des gesamten Umzugs", basic: true, half: true, full: true },
    { name: "Erfahrenes Umzugsteam", description: "Geschulte Fachkräfte mit langjähriger Erfahrung", basic: true, half: true, full: true },
    { name: "Verpackungsmaterial", description: "Kartons, Luftpolsterfolie, Klebeband etc.", basic: "Optional", half: true, full: true },
    { name: "Professionelles Einpacken", description: "Wir packen Ihre Gegenstände sicher ein", basic: false, half: true, full: true },
    { name: "Spezialverpackung (Fragiles)", description: "Extra Schutz für empfindliche Gegenstände", basic: false, half: true, full: true },
    { name: "Systematische Beschriftung", description: "Übersichtliche Kennzeichnung aller Kartons", basic: false, half: true, full: true },
    { name: "Komplettes Auspacken", description: "Wir packen alle Kartons aus", basic: false, half: false, full: true },
    { name: "Einräumen in Schränke", description: "Wir räumen Ihre Sachen an den gewünschten Platz", basic: false, half: false, full: true },
    { name: "Material-Entsorgung", description: "Umweltgerechte Entsorgung aller Verpackungen", basic: false, half: false, full: true },
    { name: "Persönlicher Koordinator", description: "Ihr direkter Ansprechpartner für alle Fragen", basic: false, half: false, full: true },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-gradient-subtle relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30"></div>
        <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full">
              Pakete vergleichen
            </span>
            <h1 className="text-balance font-display">
              Finden Sie das <span className="text-gradient">perfekte Paket</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground">
              Vergleichen Sie unsere Umzugspakete und wählen Sie das passende für Ihre Bedürfnisse
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Interactive Comparison */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0.1}>
            <ComparisonSlider features={features} />
          </AnimatedSection>
        </div>
      </section>

      {/* Special Packages */}
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-display font-semibold mb-8 text-center">
              Spezial-Pakete
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatedSection delay={0.1}>
                <Link to="/plan/student">
                  <Card className="p-6 hover-lift cursor-pointer h-full group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-warm flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🎓</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-semibold mb-2 group-hover:text-alpine transition-colors">
                          Studenten-Paket
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Bis zu 20% Rabatt für Studierende, Auszubildende und Berufsschüler. 
                          Kombinierbar mit allen Paketen.
                        </p>
                        <div className="flex items-center text-alpine font-medium">
                          Mehr erfahren <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <Link to="/plan/ladies">
                  <Card className="p-6 hover-lift cursor-pointer h-full group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">👩</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-semibold mb-2 group-hover:text-alpine transition-colors">
                          Frauen-Service
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Reines Frauenteam auf Wunsch. Diskretion und besondere Sorgfalt 
                          für Ihre Bedürfnisse.
                        </p>
                        <div className="flex items-center text-alpine font-medium">
                          Mehr erfahren <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gradient-premium text-primary-foreground">
        <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-balance mb-6 font-display">Noch Fragen zu unseren Paketen?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Unsere Experten beraten Sie gerne und erstellen ein massgeschneidertes Angebot.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 min-h-[52px]">
              Jetzt kostenlos beraten lassen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
};

export default PlanCompare;
