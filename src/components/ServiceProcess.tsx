import { Phone, FileText, Truck, Home, CheckCircle } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { Card } from "./ui/card";

interface ProcessStepData {
  number: number;
  icon: React.ElementType;
  title: string;
  description: string;
}

interface ServiceProcessProps {
  steps?: ProcessStepData[];
  title?: string;
  subtitle?: string;
}

const defaultSteps: ProcessStepData[] = [
  {
    number: 1,
    icon: Phone,
    title: "Kontakt aufnehmen",
    description: "Rufen Sie uns an oder füllen Sie unser Online-Formular aus. Wir melden uns innerhalb von 24 Stunden."
  },
  {
    number: 2,
    icon: FileText,
    title: "Kostenlose Besichtigung",
    description: "Wir begutachten Ihre Wohnung und erstellen ein massgeschneidertes Angebot – ohne versteckte Kosten."
  },
  {
    number: 3,
    icon: Truck,
    title: "Professioneller Umzug",
    description: "Unser erfahrenes Team führt Ihren Umzug termingerecht und sorgfältig durch."
  },
  {
    number: 4,
    icon: Home,
    title: "Einzug ins neue Zuhause",
    description: "Wir stellen alles an seinen Platz. Sie können sich entspannt zurücklehnen."
  },
  {
    number: 5,
    icon: CheckCircle,
    title: "Zufriedenheitsgarantie",
    description: "Erst wenn Sie zufrieden sind, ist der Umzug für uns abgeschlossen."
  }
];

export default function ServiceProcess({
  steps = defaultSteps,
  title = "So einfach geht's",
  subtitle = "In 5 Schritten zu Ihrem stressfreien Umzug"
}: ServiceProcessProps) {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full mb-4">
            Unser Prozess
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display">{title}</h2>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </AnimatedSection>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection line - desktop */}
          <div className="hidden lg:block absolute top-16 left-12 right-12 h-0.5 bg-gradient-to-r from-alpine/20 via-alpine to-alpine/20" />

          <div className="grid lg:grid-cols-5 gap-6 lg:gap-4">
            {steps.map((step, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="relative p-6 text-center bg-background border-2 border-transparent hover:border-alpine/30 transition-all group">
                  {/* Step number bubble */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-alpine text-alpine-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                    {step.number}
                  </div>
                  
                  <div className="pt-4">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-alpine/10 flex items-center justify-center group-hover:bg-alpine/20 transition-colors">
                      <step.icon className="w-7 h-7 text-alpine" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
