import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Building2, Shield, Clock, Users, Server, FileText, CheckCircle } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeatureList } from "@/components/ui/feature-list";
import { CTASection } from "@/components/CTASection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/StructuredData";

export default function BusinessMoving() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation();

  const faqs = [
    {
      question: "Was kostet ein Firmenumzug in der Schweiz?",
      answer: "Die Kosten für einen Firmenumzug variieren je nach Bürogrösse, Anzahl Arbeitsplätze und Distanz. Ein mittleres Büro (10-20 Arbeitsplätze) kostet durchschnittlich CHF 3'000–6'000. Nutzen Sie unseren Rechner für eine genaue Schätzung."
    },
    {
      question: "Können Firmenumzüge am Wochenende durchgeführt werden?",
      answer: "Ja, die meisten Umzugsfirmen bieten Wochenend- und Nachtumzüge an, damit Ihr Geschäftsbetrieb nicht unterbrochen wird."
    },
    {
      question: "Was ist im Firmenumzug-Service enthalten?",
      answer: "Professioneller Transport, Montage/Demontage von Büromöbeln, sichere Verpackung sensibler IT-Geräte, Projektmanagement und Koordination. Zusätzlich buchbar: IT-Umzug, Archivumzug, Lagerung."
    },
    {
      question: "Wie lange dauert ein Firmenumzug?",
      answer: "Je nach Bürogrösse 1-3 Tage. Kleinere Büros können oft an einem Tag umziehen. Grosse Unternehmen planen mehrere Tage oder Wochenenden ein."
    }
  ];

  const features = [
    "Minimale Ausfallzeiten – Umzug am Wochenende oder nachts",
    "IT-Spezialtransport – Server und Hardware sicher transportiert",
    "Projektmanagement – Ein Ansprechpartner koordiniert alles",
    "Archivumzug – Sichere Handhabung vertraulicher Dokumente",
    "Büromöbel-Montage – De- und Remontage inklusive",
    "Versicherungsschutz – Vollständige Absicherung"
  ];

  const benefits = [
    { icon: Clock, title: "Minimale Ausfallzeit", description: "Umzug an Wochenenden oder nachts möglich" },
    { icon: Server, title: "IT-Spezialtransport", description: "Sicherer Transport von Servern und Hardware" },
    { icon: Users, title: "Projektmanagement", description: "Dedizierter Ansprechpartner koordiniert alles" },
    { icon: FileText, title: "Archivumzug", description: "Sichere Handhabung vertraulicher Dokumente" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Firmenumzug Schweiz – Büroumzug professionell planen"
        description="Firmenumzug in der Schweiz planen? Vergleichen Sie geprüfte Umzugsfirmen für Büro- und Geschäftsumzüge. Kostenlose Offerten und bis zu 40% sparen."
        canonicalUrl="https://umzugscheck.ch/firmenumzug-schweiz"
        keywords="Firmenumzug Schweiz, Büroumzug, Geschäftsumzug, Firmenumzug Offerten"
      />
      <ServiceSchema
        name="Firmenumzug Schweiz"
        description="Professionelle Büro- und Geschäftsumzüge in der Schweiz mit minimalen Ausfallzeiten"
        priceRange="CHF 3'000 - CHF 15'000"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://umzugscheck.ch" },
        { name: "Services", url: "https://umzugscheck.ch/dienstleistungen" },
        { name: "Firmenumzug", url: "https://umzugscheck.ch/firmenumzug-schweiz" }
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
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Firmenumzug in der Schweiz planen
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Professionelle Büro- und Geschäftsumzüge mit minimierten Ausfallzeiten. Vergleichen Sie spezialisierte Umzugsfirmen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/umzugsofferten">
                <Button size="lg" variant="cta" className="h-14 px-8 text-lg">
                  Jetzt Offerten vergleichen
                </Button>
              </Link>
              <Link to="/umzugsrechner">
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
            title="Was ist im Firmenumzug enthalten?"
            subtitle="Professioneller Service für Ihren Geschäftsumzug"
            className="mb-12"
          />
          <FeatureList features={features} columns={2} size="md" />
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
            title="Besonderheiten beim Firmenumzug"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((item, index) => (
              <Card key={index} variant="elevated" className="text-center hover-lift">
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
            title="Häufige Fragen zum Firmenumzug"
            className="mb-12"
          />
          <FAQAccordion items={faqs} variant="compact" />
        </div>
      </PageSection>

      {/* CTA */}
      <CTASection
        title="Planen Sie jetzt Ihren Firmenumzug"
        description="Erhalten Sie kostenlose Offerten von spezialisierten Umzugsfirmen"
        buttonText="Jetzt Offerten erhalten"
        buttonLink="/umzugsofferten"
      />
    </div>
  );
}
