import { Calculator, FileSearch, ThumbsUp } from "lucide-react";

const steps = [
  {
    icon: Calculator,
    number: "01",
    title: "Rechner ausfüllen",
    description: "Geben Sie Ihre Umzugsdetails ein – Grösse, Distanz, gewünschte Services. Dauert nur 60 Sekunden."
  },
  {
    icon: FileSearch,
    number: "02",
    title: "Offerten vergleichen",
    description: "Erhalten Sie bis zu 5 kostenlose Offerten von geprüften Umzugsfirmen in Ihrer Region."
  },
  {
    icon: ThumbsUp,
    number: "03",
    title: "Firma auswählen",
    description: "Vergleichen Sie Preise, Bewertungen und Services. Buchen Sie direkt die beste Firma für Ihren Umzug."
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="mb-4">So einfach geht's</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            In nur 3 Schritten zur perfekten Umzugsfirma – transparent, einfach und kostenlos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line - Desktop Only */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-border">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-accent rounded-full"></div>
                </div>
              )}

              <div className="relative z-10 text-center">
                {/* Number Badge */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light text-primary text-2xl font-bold mb-4">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-hero shadow-medium mb-6">
                  <step.icon className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl md:text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
