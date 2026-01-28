import { CheckCircle, Shield, Clock, Heart, Award, Truck } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

interface Benefit {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface ServiceBenefitsProps {
  benefits?: Benefit[];
  title?: string;
  subtitle?: string;
}

const defaultBenefits: Benefit[] = [
  {
    icon: Shield,
    title: "Vollversichert",
    description: "Kompletter Versicherungsschutz für Ihr Hab und Gut während des gesamten Umzugs."
  },
  {
    icon: Clock,
    title: "Pünktlich",
    description: "Wir halten unsere Termine ein – garantiert. Zeit ist wertvoll."
  },
  {
    icon: Heart,
    title: "Mit Sorgfalt",
    description: "Jeder Gegenstand wird behandelt, als wäre es unser eigener."
  },
  {
    icon: Award,
    title: "Höchste Qualität",
    description: "Schweizer Qualitätsstandards in jedem Arbeitsschritt."
  },
  {
    icon: Truck,
    title: "Moderne Flotte",
    description: "Bestens ausgestattete Fahrzeuge für jeden Bedarf."
  },
  {
    icon: CheckCircle,
    title: "Alles inklusive",
    description: "Transparente Preise ohne versteckte Kosten."
  }
];

export default function ServiceBenefits({ 
  benefits = defaultBenefits,
  title = "Warum Feierabend Umzüge?",
  subtitle = "Entdecken Sie die Vorteile, die uns von anderen unterscheiden"
}: ServiceBenefitsProps) {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display">{title}</h2>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="flex items-start gap-4 p-6 bg-background rounded-xl border border-border hover:border-alpine/30 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-alpine/10 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-alpine" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
