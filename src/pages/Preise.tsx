import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Calculator, TrendingDown, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Umzugspreise Schweiz 2025",
  "description": "Transparente Übersicht der Umzugskosten in der Schweiz. Vergleichen Sie Preise und finden Sie die günstigste Umzugsfirma.",
  "url": "https://umzugscheck.ch/preise"
};

const Preise = () => {
  return (
    <>
      <SEOHead
        title="Umzugspreise Schweiz 2025 - Kosten & Preisvergleich | Umzugscheck.ch"
        description="Transparente Übersicht der Umzugskosten in der Schweiz. Vergleichen Sie Preise von geprüften Umzugsfirmen und sparen Sie bis zu 40%. Kostenloser Preisrechner."
        keywords="umzugskosten schweiz, umzugspreise, umzug kosten, preisvergleich umzug, günstige umzugsfirma"
        canonical="/preise"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Breadcrumbs 
            items={[
              { label: "Startseite", href: "/" },
              { label: "Preise", href: "/preise" }
            ]}
          />

          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Transparente Umzugspreise für die ganze Schweiz
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Vergleichen Sie Preise von über 200 geprüften Umzugsfirmen und sparen Sie bis zu 35%
            </p>
            <Button size="lg" asChild>
              <Link to="/rechner">
                <Calculator className="w-5 h-5 mr-2" />
                Jetzt Preis berechnen
              </Link>
            </Button>
          </div>

          {/* Durchschnittliche Umzugspreise */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Durchschnittliche Umzugspreise in der Schweiz
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "1-2 Zimmer Wohnung",
                  price: "CHF 800 - 1'500",
                  volume: "15-25 m³",
                  duration: "4-6 Stunden",
                  features: ["1-2 Umzugshelfer", "Bis 50 km Distanz", "Standard-Inventar"]
                },
                {
                  title: "3-4 Zimmer Wohnung",
                  price: "CHF 1'500 - 3'000",
                  volume: "30-45 m³",
                  duration: "6-10 Stunden",
                  features: ["2-3 Umzugshelfer", "Bis 100 km Distanz", "Durchschnittliches Inventar"],
                  popular: true
                },
                {
                  title: "5+ Zimmer / Haus",
                  price: "CHF 3'000 - 6'000+",
                  volume: "50-80+ m³",
                  duration: "10-16+ Stunden",
                  features: ["3-4 Umzugshelfer", "Beliebige Distanz", "Umfangreiches Inventar"]
                }
              ].map((item, index) => (
                <Card key={index} className={item.popular ? "border-primary border-2 relative" : ""}>
                  {item.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                        Am beliebtesten
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-foreground">{item.price}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="text-sm text-muted-foreground">
                        <strong>Volumen:</strong> {item.volume}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <strong>Dauer:</strong> {item.duration}
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {item.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Preisfaktoren */}
          <section className="mb-16 bg-muted/30 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Was beeinflusst den Umzugspreis?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Umzugsvolumen",
                  description: "Die Menge der umzuziehenden Gegenstände ist der wichtigste Preisfaktor. Mehr Volumen = mehr Helfer und mehr Zeit."
                },
                {
                  title: "Distanz",
                  description: "Die Entfernung zwischen alter und neuer Wohnung beeinflusst die Fahrtkosten und die benötigte Zeit."
                },
                {
                  title: "Etage & Lift",
                  description: "Höhere Stockwerke ohne Lift bedeuten mehr Aufwand. Ein Lift kann den Preis um 20-30% reduzieren."
                },
                {
                  title: "Zusatzleistungen",
                  description: "Packservice, Entsorgung, Endreinigung und Möbelmontage erhöhen den Preis, sparen aber Zeit und Aufwand."
                },
                {
                  title: "Zeitpunkt",
                  description: "Umzüge am Monatsende und in den Sommermonaten sind teurer. Wochentags ist günstiger als am Wochenende."
                },
                {
                  title: "Spezialgut",
                  description: "Klaviere, Tresore, Kunstwerke oder antike Möbel erfordern spezielles Equipment und Erfahrung."
                }
              ].map((factor, index) => (
                <div key={index} className="bg-background p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-lg mb-2">{factor.title}</h3>
                  <p className="text-sm text-muted-foreground">{factor.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Vorteile des Preisvergleichs */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Warum Preise vergleichen mit Umzugscheck.ch?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: TrendingDown,
                  title: "Bis zu 35% sparen",
                  description: "Durch den direkten Vergleich mehrerer Anbieter finden Sie die besten Preise für Ihren Umzug."
                },
                {
                  icon: Calculator,
                  title: "KI-Preisrechner",
                  description: "Unser intelligenter Rechner liefert Ihnen in Sekunden eine präzise Kostenschätzung basierend auf Ihren Angaben."
                },
                {
                  icon: Shield,
                  title: "100% transparent",
                  description: "Alle Preise sind klar aufgeschlüsselt. Keine versteckten Kosten, keine Überraschungen."
                }
              ].map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Bereit für Ihren kostenlosen Preisvergleich?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Berechnen Sie jetzt in 2 Minuten Ihren individuellen Umzugspreis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/rechner">
                  <Calculator className="w-5 h-5 mr-2" />
                  Jetzt Preis berechnen
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/firmen">
                  Umzugsfirmen vergleichen
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Preise;
