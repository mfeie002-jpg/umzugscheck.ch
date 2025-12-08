import { OptimizedSEO } from "@/components/OptimizedSEO";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { Shield, Users, Target, TrendingUp, Heart, Award, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatsGrid } from "@/components/ui/stat-card";
import { FeatureList } from "@/components/ui/feature-list";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTASection } from "@/components/CTASection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

const ValueCard = ({ icon: Icon, title, description, gradient }: ValueCardProps) => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  
  return (
    <div 
      ref={ref}
      className={cn(
        "transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <Card className="p-6 h-full hover:shadow-medium transition-shadow">
        <div className={cn(
          "inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br shadow-medium mb-4",
          gradient
        )}>
          <Icon className="h-7 w-7 text-white" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </Card>
    </div>
  );
};

const About = () => {
  const stats = [
    { value: "15'000+", label: "Vermittelte Umzüge" },
    { value: "4.8/5", label: "Durchschnittsbewertung" },
    { value: "20+", label: "Geprüfte Partnerfirmen" },
    { value: "26", label: "Kantone abgedeckt" }
  ];

  const values: ValueCardProps[] = [
    {
      icon: Shield,
      title: "Geprüfte Qualität",
      description: "Nur verifizierte Umzugsfirmen mit echten Kundenbewertungen",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Unabhängigkeit",
      description: "Komplett unabhängig – deine Interessen stehen im Mittelpunkt",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Target,
      title: "Transparenz",
      description: "Volle Preistransparenz ohne versteckte Kosten",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Moderne KI-Rechner für schnelle und präzise Kostenschätzung",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Heart,
      title: "Kundenfokus",
      description: "Deine Zufriedenheit ist unser Erfolg",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: Award,
      title: "Schweizer Qualität",
      description: "Lokale Expertise für alle 26 Kantone",
      gradient: "from-indigo-500 to-blue-500"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Kostenlos Preise berechnen",
      description: "Nutzen Sie unsere KI-Rechner für eine realistische Kostenschätzung – in wenigen Minuten und völlig kostenlos."
    },
    {
      number: 2,
      title: "Umzugsfirmen vergleichen",
      description: "Vergleichen Sie geprüfte Firmen aus Ihrer Region. Bewertungen, Leistungen und Preise auf einen Blick."
    },
    {
      number: 3,
      title: "Offerten erhalten",
      description: "Erhalten Sie kostenlose Offerten und wählen Sie die beste Firma für Ihren Umzug aus."
    }
  ];

  return (
    <>
      <OptimizedSEO
        title="Über uns - Umzugscheck.ch"
        description="Seit 2018 helfen wir Menschen in der Schweiz, die besten Umzugsfirmen zu finden. Transparent, unabhängig und kostenlos."
        keywords="über uns, umzugscheck schweiz, umzugsvergleich"
        canonicalUrl="https://umzugscheck.ch/ueber-uns"
      />

      <div className="min-h-screen flex flex-col">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs items={[{ label: "Über uns" }]} />
        </div>

        <main className="flex-1">
          {/* Hero */}
          <PageSection variant="primary" spacing="xl" className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Wir machen Umzüge stressfrei
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Seit 2018 helfen wir Menschen in der Schweiz, die besten Umzugsfirmen zu finden
              </p>
              <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90">
                <Link to="/umzugsofferten">Starte deinen stressfreien Umzug</Link>
              </Button>
            </div>
          </PageSection>

          {/* Mission */}
          <PageSection variant="muted">
            <div className="max-w-4xl mx-auto">
              <SectionHeading
                title="Niemand sollte beim Umzug über den Tisch gezogen werden"
                badge="Unsere Mission"
                align="center"
              />

              <Card className="mt-10">
                <CardContent className="p-8 md:p-12 space-y-6">
                  <p className="text-lg text-foreground/90 leading-relaxed">
                    Umzugscheck.ch wurde gegründet, um den Umzugsprozess in der Schweiz transparenter, 
                    einfacher und kostengünstiger zu gestalten. Wir wissen, dass ein Umzug stressig sein 
                    kann – von der Planung über die Kostenkalkulation bis zur Auswahl der richtigen Firma.
                  </p>
                  <p className="text-lg text-foreground/90 leading-relaxed">
                    Deshalb haben wir eine Plattform geschaffen, die dir hilft, in wenigen Minuten 
                    mehrere Offerten von geprüften Umzugsfirmen zu vergleichen. Unsere KI-gestützten 
                    Preisrechner geben dir sofort eine realistische Einschätzung deiner Umzugskosten.
                  </p>
                  <FeatureList
                    features={["Klare Preise", "Geprüfte Firmen", "Transparente Vergleiche"]}
                    variant="check"
                    size="lg"
                    columns={3}
                    className="pt-4"
                  />
                </CardContent>
              </Card>
            </div>
          </PageSection>

          {/* Stats */}
          <PageSection>
            <SectionHeading
              title="Umzugscheck.ch in Zahlen"
              subtitle="Vertrauen durch Transparenz und Ergebnisse"
              align="center"
            />
            <div className="mt-10 max-w-4xl mx-auto">
              <StatsGrid stats={stats} columns={4} />
            </div>
          </PageSection>

          {/* Values */}
          <PageSection variant="muted">
            <SectionHeading
              title="Warum Umzugscheck.ch?"
              subtitle="Diese Werte leiten uns in allem, was wir tun"
              align="center"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-10">
              {values.map((value, index) => (
                <ValueCard key={index} {...value} />
              ))}
            </div>
          </PageSection>

          {/* How it Works */}
          <PageSection>
            <div className="max-w-4xl mx-auto">
              <SectionHeading
                title="So einfach funktioniert's"
                subtitle="In 3 Schritten zu deinem stressfreien Umzug"
                align="center"
              />

              <div className="space-y-6 mt-10">
                {steps.map((step) => (
                  <Card key={step.number} className="hover:shadow-medium transition-shadow">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-xl shadow-medium">
                          {step.number}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </PageSection>

          {/* Final CTA */}
          <CTASection 
            title="Bereit für Ihren stressfreien Umzug?"
            description="Starten Sie jetzt und erhalten Sie kostenlose Offerten von geprüften Profis"
            buttonText="Jetzt kostenlose Offerten erhalten"
            buttonLink="/umzugsofferten"
          />
        </main>

        <StickyMobileCTA />
      </div>
    </>
  );
};

export default About;
