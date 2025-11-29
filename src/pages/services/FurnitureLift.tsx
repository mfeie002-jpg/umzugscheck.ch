import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, Clock, Shield, DollarSign, Wrench, TrendingUp, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { FAQAccordion } from "@/components/FAQAccordion";

export default function FurnitureLift() {
  const benefits = [
    { icon: Clock, title: "Zeitersparnis", description: "Viel schneller als Tragen über Treppen" },
    { icon: Shield, title: "Sicher", description: "Keine Beschädigungen an Möbeln oder Wänden" },
    { icon: DollarSign, title: "Kosteneffizient", description: "Spart Personalkosten und Zeit" },
    { icon: Wrench, title: "Professionell", description: "Erfahrene Bedienung durch Fachpersonal" },
    { icon: TrendingUp, title: "Höhe", description: "Bis zu 30 Meter und höher möglich" },
    { icon: ArrowUp, title: "Schwere Lasten", description: "Für Klaviere, Tresore, grosse Schränke" },
  ];

  const situations = [
    { title: "Enge Treppenhäuser", description: "Wenn Möbel nicht durch Treppenhaus passen" },
    { title: "Schwere Gegenstände", description: "Klaviere, Tresore, grosse Schränke" },
    { title: "Hohe Stockwerke", description: "Ab 3. Stock ohne Lift empfehlenswert" },
    { title: "Zeitersparnis", description: "Schneller als Tragen über Treppe" }
  ];

  const faqs = [
    {
      question: "Was kostet ein Möbellift in der Schweiz?",
      answer: "Ein Möbellift kostet je nach Dauer und Höhe CHF 300–800. Die Kosten hängen von Einsatzdauer, Stockwerkhöhe und Zugänglichkeit ab."
    },
    {
      question: "Wann macht ein Möbellift Sinn?",
      answer: "Bei engen Treppenhäusern, schweren Möbeln (Klaviere, Safes), hohen Stockwerken ohne Lift oder wenn das Treppenhaus geschont werden soll."
    },
    {
      question: "Brauche ich eine Bewilligung für einen Möbellift?",
      answer: "Ja, in den meisten Gemeinden benötigen Sie eine temporäre Parkplatzbewilligung für den Lift-Standplatz auf der Strasse."
    },
    {
      question: "Wie lange dauert ein Möbellift-Einsatz?",
      answer: "Durchschnittlich 2-4 Stunden, abhängig von der Anzahl der zu transportierenden Gegenstände und der Höhe."
    }
  ];

  return (
    <>
      <OptimizedSEO
        title="Möbellift mieten - Schnell & sicher"
        description="Möbellift für Ihren Umzug mieten. Schneller Transport schwerer Möbel über Balkon oder Fenster. Sicher, zeitsparend und rückenschonend."
        keywords="möbellift mieten, möbellift umzug, möbellift schweiz, aussenlift"
        canonicalUrl="https://umzugscheck.ch/moebellift"
      />

      <div className="min-h-screen flex flex-col">
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="gradient-hero text-white py-16 md:py-24">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                    Möbellift mieten
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-white/90">
                    Schwere Möbel sicher und schnell transportieren
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="default" asChild className="bg-white text-primary hover:bg-white/90 shadow-premium">
                      <Link to="/rechner">Jetzt Offerte anfragen</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                      <Link to="/umzugsfirmen">Umzugsfirmen vergleichen</Link>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-16 gradient-light">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                  Vorteile eines Möbellifts
                </h2>
              </ScrollReveal>
              <div className="grid md:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <Card variant="elevated" className="h-full hover-lift">
                      <CardHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                          <benefit.icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle>{benefit.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* When to use Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                  Wann braucht man einen Möbellift?
                </h2>
              </ScrollReveal>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {situations.map((situation, index) => (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <Card className="hover-lift">
                      <CardContent className="p-6">
                        <CheckCircle className="h-6 w-6 text-green-600 mb-3" />
                        <h3 className="text-lg font-bold mb-2">{situation.title}</h3>
                        <p className="text-sm text-muted-foreground">{situation.description}</p>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 bg-secondary/5">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                    Häufige Fragen zum Möbellift
                  </h2>
                  <FAQAccordion items={faqs} variant="compact" />
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 gradient-cta text-white">
            <div className="container mx-auto px-4 text-center">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Möbellift für Ihren Umzug benötigt?
                </h2>
                <p className="text-xl mb-8 text-white/90">
                  Holen Sie sich jetzt Offerten von Umzugsfirmen mit Möbellift-Service
                </p>
                <Button size="lg" variant="default" asChild className="bg-white text-primary hover:bg-white/90 shadow-premium">
                  <Link to="/rechner">Jetzt Offerte anfragen</Link>
                </Button>
              </ScrollReveal>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
