import { Footer } from "@/components/Footer";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Truck, Package, TrendingUp, Users, Wrench, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { FAQ } from "@/components/FAQ";
import { ScrollReveal } from "@/components/ScrollReveal";

const priceCategories = [
  { icon: Home, type: "1 Zimmer", price: "CHF 450 – 850", gradient: "from-blue-500 to-cyan-500" },
  { icon: Home, type: "2 Zimmer", price: "CHF 650 – 1'300", gradient: "from-purple-500 to-pink-500" },
  { icon: Home, type: "3 Zimmer", price: "CHF 1'200 – 2'200", gradient: "from-orange-500 to-red-500" },
  { icon: Home, type: "4+ Zimmer", price: "ab CHF 2'000", gradient: "from-green-500 to-emerald-500" },
  { icon: Truck, type: "Firmenumzug", price: "individuell", gradient: "from-indigo-500 to-blue-500" },
];

const priceFactors = [
  { icon: Package, title: "Volumen", description: "Anzahl und Größe der Möbel und Kartons" },
  { icon: TrendingUp, title: "Distanz", description: "Entfernung zwischen alter und neuer Wohnung" },
  { icon: Home, title: "Stockwerk", description: "Etage und Verfügbarkeit von Aufzügen" },
  { icon: Users, title: "Teamgröße", description: "Anzahl der benötigten Umzugshelfer" },
  { icon: Wrench, title: "Zusatzservices", description: "Montage, Reinigung, Entsorgung, Verpackung" },
];

const examples = [
  {
    title: "3-Zimmer Umzug Zürich → Winterthur",
    details: "3 Zimmer, 2 Personen, 4. Stock mit Lift",
    price: "CHF 1'280",
    savings: "35% gespart",
  },
  {
    title: "2-Zimmer Umzug Basel Stadt",
    details: "2 Zimmer, 1 Person, 2. Stock ohne Lift",
    price: "CHF 890",
    savings: "28% gespart",
  },
  {
    title: "4.5-Zimmer Umzug Bern",
    details: "4.5 Zimmer, Familie, Erdgeschoss",
    price: "CHF 2'450",
    savings: "42% gespart",
  },
];

const Pricing = () => {
  return (
    <>
      <OptimizedSEO
        title="Umzugspreise Schweiz - Was kostet ein Umzug?"
        description="Transparente Umzugspreise für die Schweiz. Vergleichen Sie Kosten für 1-5 Zimmer Wohnungen, Firmenumzüge und zusätzliche Services."
        keywords="umzugspreise schweiz, umzug kosten, umzugsfirma preis, was kostet umzug"
        canonicalUrl="https://umzugscheck.ch/preise"
      />

      <div className="min-h-screen flex flex-col">
        
        <main className="flex-1">
          {/* Hero */}
          <section className="gradient-hero text-white py-16 md:py-24">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                    Was kostet ein Umzug in der Schweiz?
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 mb-8">
                    Hier finden Sie transparente Richtpreise und können echte Offerten vergleichen
                  </p>
                  <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 shadow-premium">
                    <Link to="/rechner">Umzugspreis jetzt berechnen</Link>
                  </Button>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* 2. Price Overview */}
          <section className="py-16 md:py-20 gradient-light">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                  Preisübersicht nach Wohnungsgröße
                </h2>
              </ScrollReveal>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {priceCategories.map((category, idx) => (
                  <ScrollReveal key={idx} delay={idx * 0.1}>
                    <Card variant="elevated" className="overflow-hidden hover-lift">
                      <div className={`h-2 bg-gradient-to-r ${category.gradient}`} />
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient}`}>
                            <category.icon className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{category.type}</h3>
                            <p className="text-2xl font-bold text-accent">{category.price}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Price Factors */}
          <section className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                  Was beeinflusst den Preis?
                </h2>
              </ScrollReveal>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {priceFactors.map((factor, idx) => (
                  <ScrollReveal key={idx} delay={idx * 0.1}>
                    <Card variant="elevated" className="p-6 h-full hover-lift">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
                        <factor.icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{factor.title}</h3>
                      <p className="text-muted-foreground">{factor.description}</p>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Price Examples */}
          <section className="py-16 md:py-20 gradient-light">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                  Echte Preisbeispiele
                </h2>
              </ScrollReveal>
              <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {examples.map((example, idx) => (
                  <ScrollReveal key={idx} delay={idx * 0.1}>
                    <Card variant="elevated" className="h-full hover-lift">
                      <CardContent className="p-6 space-y-4">
                        <h3 className="text-xl font-bold">{example.title}</h3>
                        <p className="text-muted-foreground">{example.details}</p>
                        <div className="flex items-center justify-between py-3 border-t border-b">
                          <span className="text-sm text-muted-foreground">Endpreis:</span>
                          <span className="text-2xl font-bold text-accent">{example.price}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-success">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="font-medium">{example.savings} durch Vergleich</span>
                        </div>
                        <Link to="/rechner">
                          <Button className="w-full" variant="outline">
                            Meinen Preis berechnen
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* 5. Calculator CTA */}
          <section className="py-16 gradient-cta text-white">
            <div className="container mx-auto px-4 text-center">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Berechnen Sie Ihren genauen Umzugspreis
                </h2>
                <p className="text-xl mb-8 text-white/90">
                  In 2 Minuten zur individuellen Kostenschätzung
                </p>
                <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 shadow-premium">
                  <Link to="/rechner">Jetzt Preis berechnen</Link>
                </Button>
              </ScrollReveal>
            </div>
          </section>

          {/* 6. FAQ */}
          <section className="py-16 md:py-20 bg-secondary/5">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                    Häufig gestellte Fragen
                  </h2>
                  <FAQ />
                </div>
              </ScrollReveal>
            </div>
          </section>
        </main>

        <Footer />
        <StickyMobileCTA />
      </div>
    </>
  );
};

export default Pricing;
