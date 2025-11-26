import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Truck, 
  Users, 
  Package, 
  Wrench,
  ArrowRight,
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { FAQ } from "@/components/FAQ";
import { generateServiceSchema, generateBreadcrumbSchema, injectSchema } from "@/lib/schema-markup";

const priceCategories = [
  { icon: Home, type: "1-Zimmer", price: "CHF 450 – 850", color: "from-blue-500 to-cyan-500" },
  { icon: Home, type: "2-Zimmer", price: "CHF 650 – 1'300", color: "from-purple-500 to-pink-500" },
  { icon: Home, type: "3-Zimmer", price: "CHF 1'200 – 2'200", color: "from-orange-500 to-red-500" },
  { icon: Home, type: "4+ Zimmer", price: "ab CHF 2'000", color: "from-green-500 to-emerald-500" },
  { icon: Truck, type: "Firmenumzug", price: "individuell", color: "from-indigo-500 to-blue-500" },
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
    title: "Umzug Zürich → Winterthur",
    details: "3 Zimmer, 2 Personen, 4. Stock mit Lift",
    price: "CHF 1'280",
    savings: "35% gespart durch Vergleich",
  },
  {
    title: "Umzug Bern → Luzern",
    details: "2 Zimmer, 1 Person, 2. Stock ohne Lift",
    price: "CHF 890",
    savings: "28% gespart durch Vergleich",
  },
  {
    title: "Umzug Basel → Basel",
    details: "4.5 Zimmer, Familie, Erdgeschoss",
    price: "CHF 2'450",
    savings: "42% gespart durch Vergleich",
  },
];

const Pricing = () => {
  useEffect(() => {
    const schemas = [
      generateServiceSchema(
        "Umzugskosten Schweiz",
        "Transparente Richtpreise für Umzüge in der Schweiz. Vergleichen Sie echte Offerten.",
        "CHF 450-2500"
      ),
      generateBreadcrumbSchema([
        { name: "Startseite", url: "https://umzugscheck.ch" },
        { name: "Preise", url: "https://umzugscheck.ch/preise" }
      ])
    ];
    injectSchema(schemas);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* 1. Hero */}
        <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Transparente Preise
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                Was kostet ein Umzug in der Schweiz?
              </h1>
              
              <p className="text-xl md:text-2xl text-foreground/80 mb-8">
                Hier findest du transparente Richtpreise und kannst echte Offerten vergleichen.
              </p>

              <Link to="/rechner">
                <Button size="lg" className="h-14 px-10 text-lg bg-accent hover:bg-accent/90">
                  Umzugspreis jetzt berechnen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 2. Price Overview */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Preisübersicht nach Wohnungsgröße
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {priceCategories.map((category, idx) => (
                <Card
                  key={idx}
                  className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color}`}>
                        <category.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{category.type}</h3>
                        <p className="text-2xl font-bold text-primary">{category.price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Price Factors */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Was beeinflusst den Preis?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {priceFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-2xl p-6 shadow-md border border-border hover:border-primary/30 transition-all"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
                    <factor.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{factor.title}</h3>
                  <p className="text-muted-foreground">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Price Examples */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Echte Preisbeispiele
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
              {examples.map((example, idx) => (
                <Card
                  key={idx}
                  className="hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3">{example.title}</h3>
                    <p className="text-muted-foreground mb-4">{example.details}</p>
                    <div className="flex items-center justify-between py-3 border-t border-b">
                      <span className="text-sm text-muted-foreground">Endpreis:</span>
                      <span className="text-2xl font-bold text-primary">{example.price}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">{example.savings}</span>
                    </div>
                    <Link to="/rechner" className="mt-4 block">
                      <Button className="w-full" variant="outline">
                        Meinen Preis berechnen
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Calculator CTA */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-95" />
          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Berechne deinen genauen Umzugspreis
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              In 2 Minuten zur individuellen Kostenschätzung
            </p>
            <Link to="/rechner">
              <Button size="lg" className="h-14 px-10 text-lg bg-white text-primary hover:bg-white/90">
                Jetzt Preis berechnen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm mt-6 text-white/80">
              ✓ Kostenlos  ✓ Unverbindlich  ✓ Sofortiges Ergebnis
            </p>
          </div>
        </section>

        {/* 6. FAQ */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Häufig gestellte Fragen
              </h2>
              <FAQ />
            </div>
          </div>
        </section>

        {/* 7. Final CTA */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Bereit für transparente Preise?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Vergleiche jetzt Offerten und spare bis zu 40%
            </p>
            <Link to="/umzugsofferten">
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                Kostenlose Offerten erhalten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <SimplifiedFooter />
      <StickyMobileCTA />
    </div>
  );
};

export default Pricing;
