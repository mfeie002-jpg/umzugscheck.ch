import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Sparkles, Truck, Shield, Clock, CheckCircle, Package } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeatureList } from "@/components/ui/feature-list";
import { CTASection } from "@/components/CTASection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/StructuredData";

export default function MovingWithCleaning() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: packagesRef, isVisible: packagesVisible } = useScrollAnimation();
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation();
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation();

  const faqs = [
    {
      question: "Was kostet Umzug mit Reinigung in der Schweiz?",
      answer: "Ein Umzug mit Endreinigung für eine 3-Zimmer-Wohnung kostet durchschnittlich CHF 1'800–2'500. Das Komplettpaket ist günstiger als separate Buchungen."
    },
    {
      question: "Welche Leistungen sind im Komplettpaket enthalten?",
      answer: "Transport aller Möbel und Gegenstände, Ein- und Ausladen, Montage/Demontage, plus professionelle Endreinigung der alten Wohnung mit Abgabegarantie."
    },
    {
      question: "Kann ich nur die Reinigung oder nur den Umzug buchen?",
      answer: "Ja, Sie können beide Services auch separat buchen. Das Komplettpaket ist jedoch oft günstiger und bequemer."
    },
    {
      question: "Wann wird die Reinigung durchgeführt?",
      answer: "Die Reinigung erfolgt direkt nach dem Umzug, sobald alle Möbel und Gegenstände abtransportiert sind. So ist die Wohnung abgabebereit."
    }
  ];

  const movingFeatures = [
    "Transport aller Möbel und Gegenstände",
    "Ein- und Ausladen",
    "Montage und Demontage",
    "Versicherungsschutz"
  ];

  const cleaningFeatures = [
    "Alle Räume gründlich reinigen",
    "Küche, Bad, WC perfekt sauber",
    "Fenster innen putzen",
    "Abgabegarantie inklusive"
  ];

  const benefits = [
    { icon: Clock, title: "Zeitersparnis", description: "Alles an einem Tag – kein zweiter Termin nötig" },
    { icon: Shield, title: "Abgabegarantie", description: "Wohnung garantiert abnahmebereit" },
    { icon: Package, title: "Preisvorteile", description: "Günstiger als separate Buchungen" },
    { icon: CheckCircle, title: "Ein Ansprechpartner", description: "Koordination aus einer Hand" }
  ];

  const steps = [
    { step: "1", title: "Umzug durchführen", description: "Professioneller Transport Ihrer Möbel" },
    { step: "2", title: "Wohnung reinigen", description: "Direkt nach Umzug folgt die Endreinigung" },
    { step: "3", title: "Wohnung abgeben", description: "Schlüssel übergeben – fertig!" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Umzug mit Reinigung Schweiz – Komplettpaket"
        description="Umzug und Endreinigung aus einer Hand. Vergleichen Sie Komplettangebote und sparen Sie bis zu 40%. Mit Abgabegarantie für stressfreien Wohnungswechsel."
        keywords="umzug mit reinigung, umzug endreinigung, komplettpaket umzug"
        canonicalUrl="https://www.umzugscheck.ch/umzug-mit-reinigung"
      />
      <ServiceSchema
        name="Umzug mit Reinigung Schweiz"
        description="Komplettpaket: Transport und professionelle Endreinigung mit Abgabegarantie"
        priceRange="CHF 1'500 - CHF 3'500"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://umzugscheck.ch" },
        { name: "Services", url: "https://umzugscheck.ch/dienstleistungen" },
        { name: "Umzug mit Reinigung", url: "https://umzugscheck.ch/umzug-mit-reinigung" }
      ]} />

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
              <div className="relative">
                <Truck className="h-8 w-8 text-white" />
                <Sparkles className="h-4 w-4 text-white absolute -top-1 -right-1" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Umzug mit Reinigung – Alles aus einer Hand
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Komplettpaket für Ihren stressfreien Umzug: Transport + professionelle Endreinigung mit Abgabegarantie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/umzugsofferten">
                <Button size="lg" variant="cta" className="h-14 px-8 text-lg">
                  Jetzt Offerten vergleichen
                </Button>
              </Link>
              <Link to="/rechner">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 bg-white/10 hover:bg-white/20 text-white">
                  Kosten berechnen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <PageSection variant="default">
        <div
          ref={packagesRef}
          className={cn(
            "max-w-4xl mx-auto transition-all duration-700",
            packagesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <SectionHeading
            title="Was ist im Komplettpaket enthalten?"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 gap-8">
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Truck className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Umzugsservice</h3>
                <FeatureList features={movingFeatures} size="sm" />
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Endreinigung</h3>
                <FeatureList features={cleaningFeatures} size="sm" />
              </CardContent>
            </Card>
          </div>
        </div>
      </PageSection>

      {/* Benefits */}
      <PageSection variant="muted">
        <div
          ref={benefitsRef}
          className={cn(
            "transition-all duration-700",
            benefitsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <SectionHeading
            title="Vorteile des Komplettpakets"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((item, index) => (
              <Card key={index} variant="elevated" className="h-full hover-lift">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
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

      {/* Steps */}
      <PageSection variant="default">
        <div
          ref={stepsRef}
          className={cn(
            "transition-all duration-700",
            stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <SectionHeading
            title="So läuft's ab"
            className="mb-12"
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      {/* FAQ */}
      <PageSection variant="muted">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Häufige Fragen"
            className="mb-12"
          />
          <FAQAccordion items={faqs} variant="compact" />
        </div>
      </PageSection>

      {/* CTA */}
      <CTASection
        title="Bereit für Ihr Komplettpaket?"
        description="Vergleichen Sie jetzt Angebote für Umzug mit Reinigung und sparen Sie bis zu 40%"
        buttonText="Jetzt Offerten erhalten"
        buttonLink="/umzugsofferten"
      />
    </div>
  );
}
