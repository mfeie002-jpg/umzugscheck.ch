import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Recycle, Leaf, Home, Truck, CheckCircle } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeatureList } from "@/components/ui/feature-list";
import { CTASection } from "@/components/CTASection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

export default function DisposalService() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: servicesRef, isVisible: servicesVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();

  const faqs = [
    {
      question: "Was kostet eine Entsorgung in der Schweiz?",
      answer: "Die Kosten hängen von Menge und Art der Gegenstände ab. Kleine Entsorgungen starten bei CHF 200, grössere Wohnungsräumungen bei CHF 800–2'000."
    },
    {
      question: "Welche Gegenstände können entsorgt werden?",
      answer: "Möbel, Elektrogeräte, Hausrat, Sperrmüll. Sonderfall: Sondermüll wie Chemikalien oder Asbest benötigen Spezialentsorgung."
    },
    {
      question: "Ist die Entsorgung umweltfreundlich?",
      answer: "Ja, alle Partner-Firmen entsorgen fachgerecht und trennen recycelbare Materialien. Viele bieten CO₂-Kompensation an."
    },
    {
      question: "Kann die Entsorgung mit dem Umzug kombiniert werden?",
      answer: "Ja, Sie können Umzug und Entsorgung als Paket buchen – oft günstiger als getrennte Services."
    }
  ];

  const services = [
    { icon: Home, title: "Wohnungsräumung", description: "Komplette Räumung von Wohnungen und Häusern" },
    { icon: Recycle, title: "Sperrmüll", description: "Fachgerechte Entsorgung von Sperrmüll und Altmöbeln" },
    { icon: Leaf, title: "Umweltfreundlich", description: "Recycling und nachhaltige Entsorgung" }
  ];

  const features = [
    "Komplette Wohnungsräumung auf Wunsch",
    "Fachgerechte Möbelentsorgung",
    "Elektrogeräte-Recycling",
    "Sperrmüll-Abholung",
    "Umweltgerechte Trennung",
    "Kombination mit Umzug möglich"
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Entsorgung & Räumung Schweiz – Fachgerecht entsorgen"
        description="Professionelle Entsorgung und Wohnungsräumung in der Schweiz. Umweltfreundlich, fachgerecht und günstig. Jetzt Offerten vergleichen."
        canonicalUrl="https://umzugscheck.ch/entsorgung-schweiz"
        keywords="Entsorgung Schweiz, Räumung, Sperrmüll, Möbelentsorgung, Haushaltsauflösung"
      />

      {/* Hero */}
      <section className="relative py-20 md:py-28 gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div
            ref={heroRef}
            className={cn(
              "max-w-4xl mx-auto text-center transition-all duration-700",
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
              <Recycle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Entsorgung & Räumung in der Schweiz
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Fachgerechte und umweltfreundliche Entsorgung von Möbeln, Hausrat und Sperrmüll. Jetzt Angebote vergleichen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/umzugsofferten">
                <Button size="lg" variant="cta" className="h-14 px-8 text-lg">
                  Jetzt Offerten vergleichen
                </Button>
              </Link>
              <Link to="/rechner/entsorgung">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 bg-white/10 hover:bg-white/20 text-white">
                  Kosten berechnen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <PageSection variant="default">
        <div
          ref={servicesRef}
          className={cn(
            "transition-all duration-700",
            servicesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <SectionHeading
            title="Unsere Entsorgungsservices"
            className="mb-12"
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {services.map((item, index) => (
              <Card key={index} variant="elevated" className="h-full text-center hover-lift">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageSection>

      {/* Features */}
      <PageSection variant="muted">
        <div
          ref={featuresRef}
          className={cn(
            "max-w-4xl mx-auto transition-all duration-700",
            featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <SectionHeading
            title="Was wir entsorgen"
            subtitle="Professionelle Entsorgung für alle Gegenstände"
            className="mb-12"
          />
          <FeatureList features={features} columns={2} size="md" />
        </div>
      </PageSection>

      {/* FAQ */}
      <PageSection variant="default">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Häufige Fragen zur Entsorgung"
            className="mb-12"
          />
          <FAQAccordion items={faqs} variant="compact" />
        </div>
      </PageSection>

      {/* CTA */}
      <CTASection
        title="Benötigen Sie eine professionelle Entsorgung?"
        description="Erhalten Sie kostenlose Offerten von geprüften Entsorgungsfirmen"
        buttonText="Jetzt Offerten erhalten"
        buttonLink="/umzugsofferten"
      />
    </div>
  );
}
