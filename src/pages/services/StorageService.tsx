import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Box, Shield, Clock, ThermometerSun, CheckCircle, Package } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTASection } from "@/components/CTASection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

export default function StorageService() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: useCasesRef, isVisible: useCasesVisible } = useScrollAnimation();
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation();
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation();

  const faqs = [
    {
      question: "Was kostet Möbellagerung in der Schweiz?",
      answer: "Die Kosten variieren je nach Lagergrösse und Mietdauer. Ein 10m² Lager kostet durchschnittlich CHF 150–250 pro Monat. Langzeitmieten sind oft günstiger."
    },
    {
      question: "Wie sicher ist mein Eigentum im Lager?",
      answer: "Alle Lagerhallen sind videoüberwacht, alarmgesichert und klimatisiert. Ihre Möbel und Gegenstände sind versichert und rund um die Uhr geschützt."
    },
    {
      question: "Kann ich jederzeit auf mein Lager zugreifen?",
      answer: "Ja, bei den meisten Anbietern haben Sie 24/7 Zugang zu Ihrem Lager. Einige Anbieter bieten auch Abholservice an."
    },
    {
      question: "Wie lange kann ich Möbel einlagern?",
      answer: "Von wenigen Wochen bis mehreren Jahren – ganz nach Ihrem Bedarf. Flexible Kündigungsfristen ermöglichen Anpassungen."
    }
  ];

  const useCases = [
    { title: "Zwischenlagerung bei Umzug", description: "Überbrückung zwischen Auszug und Einzug" },
    { title: "Renovierung oder Umbau", description: "Möbel sicher lagern während der Arbeiten" },
    { title: "Auslandsaufenthalt", description: "Langzeitlagerung für Monate oder Jahre" },
    { title: "Platzmangel", description: "Saisonale Gegenstände oder selten genutzte Möbel" },
    { title: "Verkleinerung", description: "Übergangsphase bei Wohnungswechsel" },
    { title: "Geschäftliche Nutzung", description: "Archivierung oder Lagerhaltung für Firmen" }
  ];

  const benefits = [
    { icon: Shield, title: "Sicher & versichert", description: "Videoüberwachung und Alarmanlage 24/7" },
    { icon: ThermometerSun, title: "Klimatisiert", description: "Optimale Temperatur und Luftfeuchtigkeit" },
    { icon: Clock, title: "Flexibler Zugang", description: "24/7 Zugang zu Ihrem Lager möglich" },
    { icon: Package, title: "Alle Grössen", description: "Von 1m² bis 100m² verfügbar" },
    { icon: CheckCircle, title: "Kurz- & Langzeit", description: "Flexible Mietdauer nach Ihrem Bedarf" },
    { icon: Box, title: "Transport inklusive", description: "Abholung und Lieferung buchbar" }
  ];

  const steps = [
    { step: "1", title: "Lagergrösse wählen", description: "Berechnen Sie Ihren Platzbedarf" },
    { step: "2", title: "Offerten vergleichen", description: "Erhalten Sie bis zu 5 kostenlose Angebote" },
    { step: "3", title: "Einlagern", description: "Transport und Einlagerung organisieren" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Möbellager & Einlagerung Schweiz – sicher & flexibel"
        description="Sichere Möbellagerung in der Schweiz. Klimatisierte Lager mit 24/7 Zugang. Vergleichen Sie Angebote und finden Sie das passende Lager für Ihre Bedürfnisse."
        keywords="möbellager, einlagerung schweiz, möbel lagern, lagerraum"
        canonicalUrl="https://www.umzugscheck.ch/einlagerung"
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
              <Box className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Möbellager & Einlagerung in der Schweiz
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Sichere und flexible Lagerlösungen für Ihre Möbel und Gegenstände. Klimatisiert, überwacht und versichert.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/umzugsofferten">
                <Button size="lg" variant="cta" className="h-14 px-8 text-lg">
                  Jetzt Offerten vergleichen
                </Button>
              </Link>
              <Link to="/rechner/lager">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 bg-white/10 hover:bg-white/20 text-white">
                  Kosten berechnen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <PageSection variant="default">
        <div
          ref={useCasesRef}
          className={cn(
            "max-w-4xl mx-auto transition-all duration-700",
            useCasesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <SectionHeading
            title="Wann brauche ich ein Möbellager?"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((item, index) => (
              <Card key={index} variant="elevated" className="hover-lift">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
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
            title="Vorteile professioneller Möbellagerung"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
            title="So funktioniert's"
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
            title="Häufige Fragen zur Einlagerung"
            className="mb-12"
          />
          <FAQAccordion items={faqs} variant="compact" />
        </div>
      </PageSection>

      {/* CTA */}
      <CTASection
        title="Bereit für sicheres Möbellager?"
        description="Vergleichen Sie jetzt Angebote für Möbellager und finden Sie die beste Lösung"
        buttonText="Jetzt Offerten erhalten"
        buttonLink="/umzugsofferten"
      />
    </div>
  );
}
