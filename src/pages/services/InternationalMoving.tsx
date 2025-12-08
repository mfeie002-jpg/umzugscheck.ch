import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Shield, FileCheck, Truck, Clock, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { FAQAccordion } from "@/components/FAQAccordion";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeatureList } from "@/components/ui/feature-list";
import { CTASection } from "@/components/CTASection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/StructuredData";

export default function InternationalMoving() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation();
  const { ref: processRef, isVisible: processVisible } = useScrollAnimation();

  const benefits = [
    { icon: Globe, title: "Weltweiter Service", description: "Umzüge in alle Länder weltweit" },
    { icon: Shield, title: "Vollversichert", description: "Kompletter Versicherungsschutz" },
    { icon: FileCheck, title: "Zollabwicklung", description: "Komplette Dokumentenabwicklung" },
    { icon: Truck, title: "See- oder Luftfracht", description: "Je nach Zielland und Dringlichkeit" },
    { icon: Clock, title: "Erfahrene Partner", description: "Spezialisierte Umzugsfirmen" },
    { icon: Package, title: "Professionelle Verpackung", description: "Sichere Transportverpackung" },
  ];

  const processSteps = [
    "Kostenlose Beratung und Besichtigung",
    "Detailliertes Angebot mit allen Kosten",
    "Professionelle Verpackung Ihrer Güter",
    "Komplette Zoll- und Dokumentenabwicklung",
    "See- oder Luftfracht nach Wunsch",
    "Lieferung und Auspacken am Zielort"
  ];

  const faqs = [
    {
      question: "Was kostet ein internationaler Umzug ab Schweiz?",
      answer: "Die Kosten variieren stark je nach Zielland und Volumen. Ein Umzug innerhalb Europas kostet durchschnittlich CHF 3'000–8'000. Interkontinentale Umzüge ab CHF 8'000."
    },
    {
      question: "Welche Dokumente benötige ich?",
      answer: "Visum/Arbeitserlaubnis für Zielland, Inventarliste, Zolldokumente, Versicherungsnachweis. Die Umzugsfirma unterstützt Sie bei der Dokumentenvorbereitung."
    },
    {
      question: "Wie lange dauert ein internationaler Umzug?",
      answer: "Innerhalb Europas 1-2 Wochen, nach Übersee 6-12 Wochen je nach Zielland und Transportweg (Seefracht oder Luftfracht)."
    },
    {
      question: "Sind internationale Umzüge versichert?",
      answer: "Ja, alle Partner-Firmen bieten Transportversicherung an. Wir empfehlen eine Vollkaskoversicherung für internationale Umzüge."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Internationale Umzüge - Weltweit umziehen"
        description="Internationale Umzüge in die ganze Welt. Professionelle Planung, Zollabwicklung und sichere Verpackung für Ihren Auslandsumzug."
        keywords="internationaler umzug, auslandsumzug, umzug ins ausland, weltweit umziehen"
        canonicalUrl="https://umzugscheck.ch/internationale-umzuege"
      />
      <ServiceSchema
        name="Internationale Umzüge"
        description="Weltweite Umzüge ab der Schweiz mit professioneller Planung und Zollabwicklung"
        priceRange="CHF 3'000 - CHF 20'000"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://umzugscheck.ch" },
        { name: "Services", url: "https://umzugscheck.ch/dienstleistungen" },
        { name: "Internationale Umzüge", url: "https://umzugscheck.ch/internationale-umzuege" }
      ]} />

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
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Internationale Umzüge
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Ihr Umzug ins Ausland - professionell geplant und durchgeführt
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
            title="Warum internationale Umzüge mit uns?"
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

      {/* Process */}
      <PageSection variant="default">
        <div
          ref={processRef}
          className={cn(
            "max-w-4xl mx-auto transition-all duration-700",
            processVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <SectionHeading
            title="Unser Ablauf"
            subtitle="Von der Beratung bis zur Lieferung am Zielort"
            className="mb-12"
          />
          <FeatureList features={processSteps} variant="numbered" size="lg" />
        </div>
      </PageSection>

      {/* FAQ Section */}
      <PageSection variant="muted">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Häufige Fragen"
            className="mb-12"
          />
          <FAQAccordion items={faqs} variant="compact" />
        </div>
      </PageSection>

      {/* CTA Section */}
      <CTASection
        title="Bereit für Ihren internationalen Umzug?"
        description="Holen Sie sich jetzt kostenlose Offerten von erfahrenen Umzugsfirmen"
        buttonText="Jetzt Offerte anfragen"
        buttonLink="/rechner"
      />
    </div>
  );
}
