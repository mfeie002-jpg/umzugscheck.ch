import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, Clock, Shield, DollarSign, Wrench, TrendingUp, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { FAQAccordion } from "@/components/FAQAccordion";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTASection } from "@/components/CTASection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

export default function FurnitureLift() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation();
  const { ref: situationsRef, isVisible: situationsVisible } = useScrollAnimation();

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
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Möbellift mieten - Schnell & sicher"
        description="Möbellift für Ihren Umzug mieten. Schneller Transport schwerer Möbel über Balkon oder Fenster. Sicher, zeitsparend und rückenschonend."
        keywords="möbellift mieten, möbellift umzug, möbellift schweiz, aussenlift"
        canonicalUrl="https://umzugscheck.ch/moebellift"
      />

      {/* Hero Section */}
      <section className="gradient-hero text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div
            ref={heroRef}
            className={cn(
              "max-w-4xl mx-auto text-center transition-all duration-700",
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
              <ArrowUp className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Möbellift mieten
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
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
        </div>
      </section>

      {/* Benefits Section */}
      <PageSection variant="muted">
        <div
          ref={benefitsRef}
          className={cn(
            "transition-all duration-700",
            benefitsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <SectionHeading
            title="Vorteile eines Möbellifts"
            className="mb-12"
          />
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} variant="elevated" className="h-full hover-lift">
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
            ))}
          </div>
        </div>
      </PageSection>

      {/* When to use Section */}
      <PageSection variant="default">
        <div
          ref={situationsRef}
          className={cn(
            "transition-all duration-700",
            situationsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <SectionHeading
            title="Wann braucht man einen Möbellift?"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {situations.map((situation, index) => (
              <Card key={index} className="hover-lift">
                <CardContent className="p-6">
                  <CheckCircle className="h-6 w-6 text-green-600 mb-3" />
                  <h3 className="text-lg font-bold mb-2">{situation.title}</h3>
                  <p className="text-sm text-muted-foreground">{situation.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageSection>

      {/* FAQ Section */}
      <PageSection variant="muted">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Häufige Fragen zum Möbellift"
            className="mb-12"
          />
          <FAQAccordion items={faqs} variant="compact" />
        </div>
      </PageSection>

      {/* CTA Section */}
      <CTASection
        title="Möbellift für Ihren Umzug benötigt?"
        description="Holen Sie sich jetzt Offerten von Umzugsfirmen mit Möbellift-Service"
        buttonText="Jetzt Offerte anfragen"
        buttonLink="/rechner"
      />
    </div>
  );
}
