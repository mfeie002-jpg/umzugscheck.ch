import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Sparkles, Shield, Clock, Users } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeatureList } from "@/components/ui/feature-list";
import { CTASection } from "@/components/CTASection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

export default function CleaningService() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation();

  const faqs = [
    {
      question: "Was kostet eine Umzugsreinigung in der Schweiz?",
      answer: "Eine professionelle Umzugsreinigung kostet je nach Wohnungsgrösse CHF 300–800. Eine 3-Zimmer-Wohnung kostet durchschnittlich CHF 450–600."
    },
    {
      question: "Was ist in der Umzugsreinigung enthalten?",
      answer: "Standard-Umzugsreinigung umfasst alle Räume, Küche, Bad, Fenster innen, Böden und Oberflächen gemäss Wohnungsabgabeprotokoll."
    },
    {
      question: "Gibt es eine Abgabegarantie?",
      answer: "Ja, viele Reinigungsfirmen bieten eine Abgabegarantie. Falls der Vermieter die Reinigung nicht akzeptiert, wird kostenlos nachgeputzt."
    },
    {
      question: "Wie lange dauert eine Umzugsreinigung?",
      answer: "Eine 3-Zimmer-Wohnung benötigt ca. 4-6 Stunden. Grössere Wohnungen oder Häuser entsprechend länger."
    }
  ];

  const cleaningItems = [
    "Alle Räume gründlich reinigen",
    "Küche inkl. Backofen & Kühlschrank",
    "Badezimmer inkl. WC, Dusche & Armaturen",
    "Fenster innen putzen",
    "Böden wischen und saugen",
    "Oberflächen und Schränke reinigen"
  ];

  const benefits = [
    { icon: Shield, title: "Abgabegarantie", description: "Nachputzen kostenlos, falls Vermieter nicht akzeptiert" },
    { icon: Clock, title: "Zeitersparnis", description: "Sie sparen wertvolle Zeit am Umzugstag" },
    { icon: Users, title: "Professionell", description: "Erfahrene Reinigungskräfte mit Profi-Equipment" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Umzugsreinigung Schweiz mit Abgabegarantie"
        description="Professionelle Umzugsreinigung in der Schweiz mit Abgabegarantie. Vergleichen Sie Angebote und sparen Sie bis zu 40%. End- und Endreinigung für stressfreie Wohnungsabgabe."
        canonicalUrl="https://umzugscheck.ch/umzugsreinigung-schweiz"
        keywords="Umzugsreinigung Schweiz, Endreinigung, Abgabegarantie, Wohnungsreinigung"
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
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Umzugsreinigung mit Abgabegarantie
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Professionelle End- und Endreinigung für eine stressfreie Wohnungsabgabe. Vergleichen Sie Angebote und sparen Sie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/umzugsofferten">
                <Button size="lg" variant="cta" className="h-14 px-8 text-lg">
                  Jetzt Offerten vergleichen
                </Button>
              </Link>
              <Link to="/rechner/reinigung">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 bg-white/10 hover:bg-white/20 text-white">
                  Kosten berechnen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <PageSection variant="default">
        <div
          ref={featuresRef}
          className={cn(
            "max-w-4xl mx-auto transition-all duration-700",
            featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <SectionHeading
            title="Was ist enthalten?"
            subtitle="Komplette Endreinigung für Ihre Wohnungsabgabe"
            className="mb-12"
          />
          <FeatureList features={cleaningItems} columns={2} size="md" />
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
            title="Vorteile einer professionellen Umzugsreinigung"
            className="mb-12"
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((item, index) => (
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

      {/* FAQ */}
      <PageSection variant="default">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Häufige Fragen zur Umzugsreinigung"
            className="mb-12"
          />
          <FAQAccordion items={faqs} variant="compact" />
        </div>
      </PageSection>

      {/* CTA */}
      <CTASection
        title="Bereit für eine professionelle Umzugsreinigung?"
        description="Vergleichen Sie jetzt Angebote und erhalten Sie die beste Reinigung zum besten Preis"
        buttonText="Jetzt Offerten erhalten"
        buttonLink="/umzugsofferten"
      />
    </div>
  );
}
