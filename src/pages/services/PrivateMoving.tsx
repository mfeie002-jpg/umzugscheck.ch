import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Home, Shield, Clock, TrendingUp, CheckCircle, Package, LucideIcon } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTASection } from "@/components/CTASection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

const BenefitCard = ({ icon: Icon, title, description, index }: BenefitCardProps) => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card className="h-full hover:shadow-medium transition-shadow">
        <CardContent className="p-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default function PrivateMoving() {
  const faqs = [
    {
      question: "Was kostet ein Privatumzug in der Schweiz?",
      answer: "Die Kosten hängen von Wohnungsgrösse, Distanz und Stockwerk ab. Ein 3-Zimmer-Umzug kostet durchschnittlich CHF 1'200–1'800. Mit unserem Preisrechner erhalten Sie eine genaue Schätzung."
    },
    {
      question: "Was ist im Privatumzug-Service enthalten?",
      answer: "Der Standard-Service umfasst Transport, Ein- und Ausladen sowie Montage/Demontage einfacher Möbel. Zusatzleistungen wie Packservice, Reinigung oder Entsorgung können optional gebucht werden."
    },
    {
      question: "Wie lange im Voraus sollte ich einen Umzug buchen?",
      answer: "Wir empfehlen 2-4 Wochen Vorlauf. In der Hauptsaison (Sommer) kann es sinnvoll sein, noch früher zu buchen. Kurzfristige Umzüge sind oft auch möglich."
    },
    {
      question: "Sind die Umzugsfirmen versichert?",
      answer: "Ja, alle Umzugsfirmen auf umzugscheck.ch sind versichert und zertifiziert. Ihre Möbel und Gegenstände sind während des Transports geschützt."
    }
  ];

  const benefits: Omit<BenefitCardProps, 'index'>[] = [
    { icon: Clock, title: "Zeitersparnis", description: "Profis erledigen Ihren Umzug schnell und effizient" },
    { icon: Shield, title: "Versicherungsschutz", description: "Ihre Möbel sind während des Transports versichert" },
    { icon: TrendingUp, title: "Kosteneffizienz", description: "Durch Vergleich finden Sie die besten Preise" },
    { icon: CheckCircle, title: "Stressfrei", description: "Entspannt umziehen ohne körperliche Belastung" },
    { icon: Package, title: "Komplettservice", description: "Alle Services aus einer Hand verfügbar" },
    { icon: Home, title: "Erfahrung", description: "Professionelle Umzugsexperten mit Know-how" }
  ];

  const steps = [
    { step: "1", title: "Offerten anfragen", description: "Füllen Sie unser Formular aus (2 Minuten)" },
    { step: "2", title: "Offerten vergleichen", description: "Erhalten Sie bis zu 5 kostenlose Offerten" },
    { step: "3", title: "Firma wählen", description: "Wählen Sie die beste Umzugsfirma für Ihre Bedürfnisse" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Privatumzug Schweiz – Umzugsfirmen vergleichen"
        description="Privatumzug in der Schweiz planen? Vergleichen Sie geprüfte Umzugsfirmen kostenlos. Bis zu 5 Offerten erhalten und bis zu 40% sparen."
        keywords="privatumzug, privatumzug schweiz, umzug wohnung, wohnungsumzug"
        canonicalUrl="https://www.umzugscheck.ch/privatumzug"
      />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs items={[
          { label: "Services", href: "/dienstleistungen" },
          { label: "Privatumzug" }
        ]} />
      </div>

      {/* Hero */}
      <PageSection 
        variant="primary" 
        spacing="xl" 
        className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
            <Home className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Privatumzug in der Schweiz
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            Finden Sie die beste Umzugsfirma für Ihren privaten Umzug. Kostenlose Offerten vergleichen und bis zu 40% sparen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/umzugsofferten">
              <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 bg-white text-primary hover:bg-white/90">
                Jetzt Offerten vergleichen
              </Button>
            </Link>
            <Link to="/rechner">
              <Button size="lg" variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 border-white/20 bg-white/10 hover:bg-white/20 text-white">
                Kosten berechnen
              </Button>
            </Link>
          </div>
        </div>
      </PageSection>

      {/* Was ist ein Privatumzug */}
      <PageSection>
        <div className="max-w-4xl mx-auto">
          <SectionHeading title="Was ist ein Privatumzug?" align="left" size="md" />
          <div className="prose prose-lg max-w-none mt-6">
            <p className="text-muted-foreground leading-relaxed">
              Ein Privatumzug bezeichnet den Wohnungswechsel von Privatpersonen oder Familien. 
              Professionelle Umzugsfirmen übernehmen dabei den Transport Ihrer Möbel und persönlichen Gegenstände 
              von der alten zur neuen Wohnung.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Je nach Bedarf können Sie zwischen verschiedenen Service-Leveln wählen: vom einfachen Transport 
              bis zum Rundum-sorglos-Paket mit Packservice, Montage und Reinigung.
            </p>
          </div>
        </div>
      </PageSection>

      {/* Vorteile */}
      <PageSection variant="muted">
        <SectionHeading
          title="Vorteile eines professionellen Privatumzugs"
          align="center"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-10">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} index={index} />
          ))}
        </div>
      </PageSection>

      {/* Ablauf */}
      <PageSection>
        <SectionHeading title="So funktioniert's" align="center" />
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-10">
          {steps.map((item, index) => {
            const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
            return (
              <div
                key={index}
                ref={ref}
                className={cn(
                  "text-center transition-all duration-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </PageSection>

      {/* FAQ */}
      <PageSection variant="muted">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Häufige Fragen zum Privatumzug"
            align="center"
          />
          <div className="mt-10">
            <FAQAccordion items={faqs} variant="compact" />
          </div>
        </div>
      </PageSection>

      {/* CTA */}
      <CTASection
        title="Bereit für Ihren Privatumzug?"
        description="Vergleichen Sie jetzt kostenlos Umzugsfirmen und sparen Sie bis zu 40%"
        buttonText="Jetzt Offerten erhalten"
        buttonLink="/umzugsofferten"
      />
    </div>
  );
}