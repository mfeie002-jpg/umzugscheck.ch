import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, TrendingUp, Users, Calculator, Building2 } from "lucide-react";
import { ScrollToTop } from "@/components/ScrollToTop";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";

const cantons = [
  { name: "Zürich", slug: "zuerich", companies: 42, moves: "1'200+" },
  { name: "Bern", slug: "bern", companies: 35, moves: "950+" },
  { name: "Luzern", slug: "luzern", companies: 28, moves: "680+" },
  { name: "Uri", slug: "uri", companies: 12, moves: "180+" },
  { name: "Schwyz", slug: "schwyz", companies: 18, moves: "420+" },
  { name: "Obwalden", slug: "obwalden", companies: 10, moves: "150+" },
  { name: "Nidwalden", slug: "nidwalden", companies: 11, moves: "160+" },
  { name: "Glarus", slug: "glarus", companies: 9, moves: "130+" },
  { name: "Zug", slug: "zug", companies: 22, moves: "510+" },
  { name: "Freiburg", slug: "freiburg", companies: 26, moves: "620+" },
  { name: "Solothurn", slug: "solothurn", companies: 24, moves: "560+" },
  { name: "Basel-Stadt", slug: "basel-stadt", companies: 30, moves: "720+" },
  { name: "Basel-Landschaft", slug: "basel-landschaft", companies: 28, moves: "650+" },
  { name: "Schaffhausen", slug: "schaffhausen", companies: 15, moves: "290+" },
  { name: "Appenzell Ausserrhoden", slug: "appenzell-ausserrhoden", companies: 12, moves: "200+" },
  { name: "Appenzell Innerrhoden", slug: "appenzell-innerrhoden", companies: 8, moves: "110+" },
  { name: "St. Gallen", slug: "st-gallen", companies: 32, moves: "780+" },
  { name: "Graubünden", slug: "graubuenden", companies: 20, moves: "410+" },
  { name: "Aargau", slug: "aargau", companies: 38, moves: "890+" },
  { name: "Thurgau", slug: "thurgau", companies: 25, moves: "570+" },
  { name: "Tessin", slug: "tessin", companies: 27, moves: "640+" },
  { name: "Waadt", slug: "waadt", companies: 36, moves: "850+" },
  { name: "Wallis", slug: "wallis", companies: 29, moves: "690+" },
  { name: "Neuenburg", slug: "neuenburg", companies: 19, moves: "430+" },
  { name: "Genf", slug: "genf", companies: 34, moves: "820+" },
  { name: "Jura", slug: "jura", companies: 13, moves: "240+" }
];

const Regionen = () => {
  return (
    <>
      <OptimizedSEO
        title="Umzugsfirmen in allen Regionen der Schweiz"
        description="Finden Sie geprüfte Umzugsfirmen in allen 26 Schweizer Kantonen. Transparente Preise, echte Kundenbewertungen und kostenlose Offerten."
        keywords="umzugsfirmen schweiz, umzug kantone, umzugsfirmen region"
        canonicalUrl="https://umzugscheck.ch/regionen"
      />

      <div className="min-h-screen flex flex-col">
        <Navigation />

        {/* Hero Section */}
        <section className="gradient-hero text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
                  Umzugsfirmen in allen Regionen der Schweiz
                </h1>
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                  Finden Sie geprüfte Umzugsfirmen in Ihrem Kanton – transparente Preise und echte Kundenbewertungen
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Key Stats */}
        <section className="py-12 bg-white border-b border-border">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
                <Card variant="elevated" className="p-6">
                  <div className="text-4xl font-bold text-primary mb-2">26</div>
                  <div className="text-muted-foreground">Alle Kantone</div>
                </Card>
                <Card variant="elevated" className="p-6">
                  <div className="text-4xl font-bold text-primary mb-2">600+</div>
                  <div className="text-muted-foreground">Umzugsfirmen</div>
                </Card>
                <Card variant="elevated" className="p-6">
                  <div className="text-4xl font-bold text-primary mb-2">15'000+</div>
                  <div className="text-muted-foreground">Vermittelte Umzüge</div>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Cantons Grid */}
        <section className="py-16 md:py-24 gradient-light">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <h2 className="mb-4 text-3xl md:text-4xl font-bold">Wählen Sie Ihren Kanton</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Umzugsfirmen in Ihrer Region vergleichen – lokale Expertise, faire Preise
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cantons.map((canton, index) => (
                  <ScrollReveal key={canton.slug} delay={index * 0.02}>
                    <Link to={`/umzug/${canton.slug}`}>
                      <Card variant="elevated" className="p-6 hover-lift border-2 hover:border-primary/30">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{canton.name}</h3>
                        <p className="text-sm text-muted-foreground">Kanton {canton.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="font-semibold">{canton.companies}</span>
                        <span className="text-muted-foreground">Firmen</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-accent" />
                        <span className="font-semibold">{canton.moves}</span>
                        <span className="text-muted-foreground">Umzüge</span>
                      </div>
                    </div>
                      </Card>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 gradient-cta text-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="mb-6 text-3xl md:text-4xl font-bold">Bereit für Ihren Umzug?</h2>
                <p className="text-xl mb-8 text-white/90">
                  Erhalten Sie kostenlose Offerten von geprüften Umzugsfirmen in Ihrer Region
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 shadow-premium">
                    <Link to="/rechner">
                      <Calculator className="w-5 h-5 mr-2" />
                      Jetzt Kosten berechnen
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                    <Link to="/firmen">
                      <Building2 className="w-5 h-5 mr-2" />
                      Firmen vergleichen
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
        <ScrollToTop />
        <StickyMobileCTA />
      </div>
    </>
  );
};

export default Regionen;
